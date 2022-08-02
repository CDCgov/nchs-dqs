/* *************************************************************************************
  Author: Lincoln Bollschweiler
  Email: rlv1@cdc.org
  Date: Aug 2021

  This component requires the following html to be in place in your template
 
   <div id="[your choice of id, passed in with constructor]" class="general-chart"></div>

   If you need to add to (or remove anything from) the svg chart, please don't. Instead, 
   note, that at the end of the file, the render() function returns the svg with some 
   props back to the caller. You will be able to manipulate the implementation after
   the render is complete. If you absolutely feel you need to make changes please reach
   out to Lincoln at the email address provided above to liaise/consult first.

 ************************************************************************************* */

import * as d3 from "../../lib/d3.min";
import { GenTooltip } from "./genTooltip";
import { genFormat } from "../../utils/genFormat";
import { getGenSvgScale } from "../../utils/genSvgScale";
import { Utils } from "../../utils/utils";
import { getProps } from "./chart/props";
import { data } from "jquery";

export class GenChart {
	constructor(providedProps) {
		this.props = getProps(providedProps);
	}

	render() {
		const p = this.props;
		//console.log("genChart props=", p);

		const genTooltip = new GenTooltip(p.genTooltipConstructor);
		let legendData = [];
		let multiLineColors;
		if (!p.usesBars) {
			multiLineColors = d3.scaleOrdinal(p.multiLineColors);
		}
		//console.log("multilinecolors TOP:", multiLineColors);
		let fullNestedData;
		////////////////////////////////////////////////////////////////////////////////
		// (TT) Need to REMOVE any data items set to dontDraw from the drawn set
		// BUT leave all data items on the legend!!!
		// (1) backup ORIGINAL p.data that has ALL DATA in it
		let allIncomingData = p.data; // this has to be used for the LEGENDS
		// (2) Limit the draw data to max of 10 lines or bars
		let barCount = 0;
		const maxBarCount = 10; /// this could be a PROP PASSED INTO genChart (TT)
		// For barchart limit drawData to first 10
		// - note cannot do exact same for lines bc there are data points not just one data per line
		// whereas in the bar charts each bar is one data point so the below approach works
		if (p.usesBars) {
			//console.log("##DRAW BAR CHART###");
			p.data.forEach((d, i) => {
				if (d.dontDraw === false && barCount < maxBarCount) {
					barCount++; // increment barCount
				} else {
					// then either dontDraw already true or needs to be set to true
					// bc bar count is exceeded
					d.dontDraw = true;
				}
			});
		} else {
			// for LINE data we have to do something different
			// - bc there are MANY points for each line not just one data point
			// need to look at the "nested" data and use only MAX of 10 "nests"
			// - see below by searching for fullNestedData
			// 7/28/22 (TT) NOTE: I saw a line chart where the yScaleLeft was too big compared to the data
			// I think it is due to line chart yScaleLeft scaling on all data vs. selected data
			// - if that is the case we will need to narrow down the drawn data BEFORE
			// creating yScaleLeft
		}

		// FOR ALL CHARTS
		// (3) go ahead and filter out that dontDraw data so that scales etc. will be correct
		// - this keeps us from having to edit a LOT of code
		p.data = p.data.filter((d) => d.dontDraw === false);

		//debugger;

		// if you need to look at incoming data
		console.log("genChart p.data:", p.data);

		// FOr reliability, convert any NaN values to null.
		//p.data = p.data.filter((d) =>(d.estimate !== null) && (!isNaN(d.estimate)));
		//allIncomingData = allIncomingData.filter((d) => (d.estimate !== null) && (!isNaN(d.estimate)));

		p.data = p.data.filter(function (d) {
			if (isNaN(d.estimate)) {
				return (d.estimate = null); // estimate missing so fill in with null???
			} else {
				return d;
			}
		});
		allIncomingData = allIncomingData.filter(function (d) {
			if (isNaN(d.estimate)) {
				return (d.estimate = null); // estimate missing so fill in with null???
			} else {
				return d;
			}
		});

		// NOW filter down to only bars/lines to be drawn
		const drawData = p.data;
		///////////////////////////////////////////////////////////////////////////////

		// Need to store list of used colors bc we have a legend with all data,
		// but dontDraw property that may not draw it, plus a limit of 10
		// incoming prop = p.assignedLegendColor
		// and for lines using exact same prop
		// (it's easier to create a prop and pass it in than do new map to create)

		function mouseover(data) {
			if (Object.prototype.hasOwnProperty.call(data, "data")) {
				genTooltip.mouseover(d3.select(this), ["data"]);
			} else {
				genTooltip.mouseover(d3.select(this));
			}
		}
		function mousemove() {
			genTooltip.mousemove();
		}
		function mouseout() {
			genTooltip.mouseout();
		}

		// inserts line breaks where every : is in the Characteristic on the bar left axis
		const insertLinebreaks = function (d) {
			let el = d3.select(this);
			el.text("");
			let words;
			// some Characteristics are long but NO COLON just spaces
			if (d.match(":")) {
				words = d.split(":"); // split labels on : colon
				//console.log("Colon split:", d, words);
				for (var i = 0; i < words.length; i++) {
					var str;
					var result;
					var tspan;
					if (words[i].length < 24) {
						tspan = el.append("tspan").text(words[i]);
						tspan.attr("x", 0).attr("dy", "12"); // dy is space between lines
						/* 						if (words.length < 2) {
							tspan.attr("x", 0).attr("dy", "32");
						} 
						if (words.length == 2) {
							tspan.attr("x", 0).attr("dy", "30");
						}
						if (words.length == 3) {
							tspan.attr("x", 0).attr("dy", "12"); // was 21
						}
						if (words.length == 4) {
							tspan.attr("x", 0).attr("dy", "12");
						} */
					} else {
						str = words[i];
						result = str.replace(/.{20}\S*\s+/g, "$&@").split(/\s+@/);
						tspan = tspan.append("tspan").text(result[0]);
						tspan.attr("x", 0).attr("dy", "11");
						tspan = tspan.append("tspan").text(result[1]);
					}
				} // end for loop
			} else {
				// try spaces
				// - to understand why this is here select Medicaid and then "Level of Difficulty"
				// - very long text with no colon but lots of spaces
				words = d.split(" "); // split labels on spaces
				//console.log("SPACE split d, words:", d, words);
				// now accumulate strings up to a certain length
				let tmpLine = "";
				let lineMaxLen = 21;
				let lineLen = 0;
				let lines = [];
				words.forEach((wd) => {
					if (lineLen + wd.length < lineMaxLen) {
						tmpLine += wd + " ";
						lineLen += wd.length + 1;
					} else {
						lines.push(tmpLine);
						console.log("Push line:", tmpLine);
						tmpLine = wd + " "; // start with word that didnt fit
						lineLen = wd.length + 1;
					}
				}); // end foreach
				// always ends on one final string which needs to be pushed
				lines.push(tmpLine);
				if (lines.length === 1) {
					// push a blank line for now bc couldnt get dy changes below to do anything
					lines.push("      ");
				}
				for (var i = 0; i < lines.length; i++) {
					var str;
					var result;
					var tspan;
					if (lines[i].length < 25) {
						tspan = el.append("tspan").text(lines[i]);
					}
					//console.log("BEFORE tspan i, x, y:", i, tspan.attr("x"), tspan.attr("y"));
					if (lines.length < 2) {
						tspan.attr("x", 0).attr("dy", "32");
					}
					if (lines.length == 2) {
						tspan.attr("x", 0).attr("dy", "30");
					}
					if (lines.length == 3) {
						tspan.attr("x", 0).attr("dy", "21");
					}
					if (lines.length == 4) {
						tspan.attr("x", 0).attr("dy", "12");
					}
					//console.log("AFTER tspan i, x, y:", i, tspan.attr("x"), tspan.attr("y"));
				} // end for loop
			} // end else case

			// if this is here it only affects the last line
			if (i > 0) {
				// the dy value is the "space between label lines" - try to calc so it adjusts some
				tspan.attr("x", 0).attr("dy", axisLabelFontSize / 2 + 6); // was 15
				//tspan.attr("y", 0).attr("dy",
			}

			// based on number of lines, adjust height
			let offset = words.length * 0.005;
			if (words.length > 2) {
				//d3.select(this).attr("dy",-offset + "em"); //-offset + "em"
				d3.select(this).attr("dy", 27);
			} else {
				// move it down closer to hash
				offset = 3 * offset;
				d3.select(this).attr("dy", 30);
			}
		};

		// Find the position of a SVG DOM element
		function getPosition(element) {
			let match;
			let x, y;
			// We have a transform, that might contain a translate(x,y)
			let transform = element.attr("transform");
			if (transform) match = transform.match(/translate\(\s*(-?[\d.]*)\s*[,]\s*(-?[\d.]*)\s*/);

			// We have translate(x,y)
			if (match?.length >= 2) {
				x = parseFloat(match[1]);
				y = parseFloat(match[2]);

				// We try to get x="" and y=""
			} else {
				x = element.attr("x");
				y = element.attr("y");
			}
			// Set x and y to 0 if they are undefined or null
			x = x ? x : 0;
			y = y ? y : 0;

			return { x, y };
		}

		const svgId = `${p.vizId}-svg`;

		// setup fontSizes

		// create a non-displayed div to get size of one rem as decimal value
		const viz = d3.select(`#${p.vizId}`);
		const remDiv = viz.append("div").attr("line-height", "1rem").attr("display", "none");
		const rem = parseFloat(remDiv.style("line-height"), 10);

		// these 4 params keeps everything sized/positioned correctly regardless of screen resolution
		const { fullSvgWidth, overallScale, svgHeightRatio, svgScale } = getGenSvgScale(p.vizId);

		const chartTitleFontSize = overallScale * p.chartTitleFontScale * rem;
		let axisTitleFontSize = overallScale * p.axisTitleFontScale * rem;
		let axisLabelFontSize = overallScale * p.axisLabelFontScale * rem;
		// this scaling often makes the label sizes too big
		if (axisTitleFontSize > 14) {
			// knock it back down
			axisTitleFontSize = 14;
		}

		// this scaling often makes the label sizes too big
		if (axisLabelFontSize > 14) {
			// knock it back down
			axisLabelFontSize = 12;
		}

		// setup chart labels and title sizes
		// assumption is made that there are always left and bottom axis labels
		// but not always titles

		const chartTitleSize = p.usesChartTitle * p.labelPaddingScale * chartTitleFontSize;

		const axisTitleSize = p.labelPaddingScale * axisTitleFontSize; //
		const axisSize = p.labelPaddingScale * axisLabelFontSize; //
		const rightTitleSize = p.usesRightAxisTitle * axisTitleSize; //
		const leftAxisSize = p.usesLeftAxis * axisSize * p.yLeftLabelScale; //
		const rightAxisSize = p.usesRightAxis * axisSize * p.yRightLabelScale; //
		const leftTitleSize = p.usesLeftAxisTitle * axisTitleSize; //
		const bottomTitleSize = p.usesBottomAxisTitle * axisTitleSize; //
		const bottomAxisScale = p.usesTwoLineXAxisLabels && svgHeightRatio !== 0.5 ? 2 : 1;

		// setup margins, widths, and heights
		const margin = {
			top: axisSize, // + 40, // gives room for tick label when no chart title
			right: d3.max([rightTitleSize + rightAxisSize, p.marginRightMin * overallScale]),
			bottom: bottomTitleSize + bottomAxisScale * axisSize * p.xLabelScale + 40, // add default extra 10px to bottom for below bottom line letters (like y)
			left: d3.max([leftTitleSize + leftAxisSize, p.marginLeftMin + 15]),
		};

		if (p.chartRotate === true) {
			margin.bottom *= 3;
			margin.top *= 1.5;
		}
		const xMargin = margin.left + margin.right;
		const yMargin = margin.top + margin.bottom;

		let svgWidth = fullSvgWidth * svgScale;
		let svgHeight = svgWidth * svgHeightRatio;
		let chartWidth = svgWidth - xMargin;
		let chartHeight = svgHeight - yMargin;

		// get chart x and y centers
		const halfXMargins = xMargin / 2;
		const halfWidth = svgWidth / 2;
		const chartCenterX = halfWidth + margin.left - halfXMargins;

		const halfYMargins = yMargin / 2;
		const halfHeight = svgHeight / 2;
		const chartCenterY = halfHeight + margin.top - halfYMargins;

		if (p.chartRotate) {
			const barWidth = 60;
			chartHeight = chartWidth - xMargin;
			svgHeight = svgWidth;
			chartWidth = p.data.length * barWidth + 0.3 * barWidth;
			svgWidth = xMargin + chartWidth;
		}

		//  apply chart title
		if (p.usesChartTitle) {
			const title = viz
				.append("div")
				.style("line-height", chartTitleSize * 1.1 + "px")
				.style("font-size", chartTitleSize + "px")
				.style("width", svgWidth + "px")
				.style("margin", "0 auto")
				.attr("id", `${p.vizId}-chartTitle`)
				.text(p.chartTitle);

			if ($(`#${p.vizId}-chartTitle`).height() > chartTitleSize * 1.1) title.style("text-align", "left");
		}

		// setup scales
		let xScale;

		// (TTT) THIS SECTION NEED AN OVERHAUL FOR 1950 - 1960 - 1970 to show bigger gaps
		// than year to year data 1981, 1982, 1983 etc.
		// - why is no "extent" calculated
		if (p.firefoxReversed === true) {
			xScale = d3.scaleBand().range([chartWidth, 0]).paddingInner(0.1).paddingOuter(0.1);
		} else {
			xScale = p.needsScaleTime
				? d3.scaleTime().range([0, chartWidth])
				: d3.scaleBand().range([0, chartWidth]).paddingInner(0.15).paddingOuter(0.15);
		}

		let yScaleExtent = [0];
		let yScaleType = d3.scaleLinear();
		let yLeft1TickValues;
		if (p.left1ScaleType === "log") {
			yScaleExtent = d3.extent(p.data.map((d) => d[p.chartProperties.yLeft1]));
			yScaleType = d3.scaleLog();
			yLeft1TickValues = Utils.getPowerOf10ArrayWithinBounds(...yScaleExtent, 6);
		}

		// (TT) leave this COMMENTED OUT code here for now
		// - saw a case where the calc Max was way high vs. the data
		// and I think it is bc the .max statement below is on all p.data
		// where as the line charts use fullNestedData
		// so scale is too high compared to "selected" 10 lines data
		// this section can help debug that if we see it again
		/* 		console.log("Max scale leftDomainOverageScale =", p.leftDomainOverageScale);
		console.log("Max scale p.data=", p.data);
		let calcMax = d3.max(p.data, (d) =>
			d3.max([
				p.leftDomainMin,
				d[p.chartProperties.yLeft1],
				d[p.chartProperties.yLeft2],
				d[p.chartProperties.yLeft3],
				d[p.chartProperties.bars],
				parseFloat(d["estimate_uci"]), // (TT) keeps CI whiskers inside chart by adding UCI to this max calc
			])
		);  // * p.leftDomainOverageScale;
		console.log("Max scale calcMax=", calcMax); */

		// THE PROBLEM: WE CALC MAX  HERE BUT THAT IS ON ALL DATA
		// FOR LINE CHARTS!
		// GO down below here when we set dontDraw on nested line data
		// so that's a problem bc the scale is WAY OFF for SOME line charts
		const yScaleLeft = yScaleType
			.domain(
				p.leftDomain
					? p.leftDomain
					: [
							yScaleExtent[0],
							d3.max(p.data, (d) =>
								d3.max([
									p.leftDomainMin,
									d[p.chartProperties.yLeft1],
									d[p.chartProperties.yLeft2],
									d[p.chartProperties.yLeft3],
									d[p.chartProperties.bars],
									p.enableCI ? parseFloat(d["estimate_uci"]) : 0, // (TT) keeps CI whiskers inside chart by adding UCI to this max calc
								])
							) * p.leftDomainOverageScale,
					  ]
			)
			.range([chartHeight, 0]);

		const yScaleRight = d3
			.scaleLinear()
			.domain(
				p.rightDomain
					? p.rightDomain
					: [
							0,
							d3.max(p.data, (d) => d3.max([p.rightDomainMin, d[p.chartProperties.yRight]])) *
								p.leftDomainOverageScale,
					  ]
			)
			.range([chartHeight, 0]);

		// set up axes
		const xAxis = d3
			.axisBottom(xScale)
			.tickSize(3)
			.tickSizeOuter(5)
			.tickSizeInner(5)
			.tickFormat((drawData) => genFormat(drawData, p.formatXAxis));

		const yAxisLeft = d3
			.axisLeft(yScaleLeft)
			.tickSize(3)
			.tickSizeInner(-chartWidth)
			.ticks(p.leftTickCount)
			.tickFormat((drawData) => genFormat(drawData, p.formatYAxisLeft)); // this is what sets the tick labels
		// but where do we rotate them???

		if (p.left1ScaleType === "log") yAxisLeft.tickValues(yLeft1TickValues);

		const yAxisRight = d3
			.axisRight(yScaleRight)
			.tickSize(3)
			.ticks(p.rightTickCount)
			.tickFormat((drawD) => genFormat(drawD, p.formatYAxisRight));

		const svg = viz.append("svg").attr("height", svgHeight).attr("width", svgWidth).attr("id", svgId);

		// add a white box if you want a white box to show when chart is NOT on a white background (TT)
		// - this could also be enabled or disabled from a PROP
		svg.append("g")
			.append("rect")
			.attr("id", "whitebox") // give it a white box background
			.attr("fill", "#FFFFFF")
			.attr("height", svgHeight)
			.attr("width", svgWidth);
		if (!p.data.length) {
			if (p.usesBars) {
				svg.append("text")
					.text(p.noDataMessage)
					.attr("text-anchor", "middle")
					.attr("font-size", axisTitleFontSize)
					.attr("x", -chartCenterX - 20)
					.attr("y", chartCenterY)
					.attr("transform", `rotate(-${p.chartRotationPercent})`);
			} else {
				// if line chart then dont rotate
				svg.append("text")
					.text(p.noDataMessage)
					.attr("text-anchor", "middle")
					.attr("font-size", axisTitleFontSize)
					.attr("x", chartCenterX)
					.attr("y", chartCenterY);
			}
			// note if we have no data, genChart still tries to build the bar chart legend
		} else {
			// append the axes
			// xAxis
			let xAxisDraw;
			if (p.usesBottomAxis) {
				xAxisDraw = svg
					.append("g")
					.attr("class", "axis bottom")
					.attr("transform", `translate(${margin.left}, ${margin.top + chartHeight})`);
			}

			// left yAxis
			if (p.usesLeftAxis) {
				if (p.usesBars === true && p.chartRotate === true) {
					// need to rotate axis values
					svg.append("g")
						.attr("class", "y axis left")
						.attr("transform", `translate(${margin.left}, ${margin.top})`)
						.call(yAxisLeft)
						.selectAll("text")
						.attr("y", 0)
						.attr("x", 0)
						.attr("dy", "-0.15em")
						.attr("transform", "rotate(-90)")
						.style("text-anchor", "start");
				} else {
					// dont rotate - show normal
					svg.append("g")
						.attr("class", "y axis left")
						.attr("transform", `translate(${margin.left}, ${margin.top})`)
						.call(yAxisLeft);
				}
			}

			// right yAxis
			if (p.usesRightAxis) {
				svg.append("g")
					.attr("class", "y axis right")
					.attr("transform", `translate(${margin.left + chartWidth}, ${margin.top})`)
					.call(yAxisRight);
			}

			// append the axis titles
			// xAxis
			if (p.usesBottomAxisTitle) {
				svg.append("text")
					.text(p.bottomAxisTitle)
					.attr("text-anchor", "middle")
					.attr("font-size", axisTitleFontSize)
					.attr("x", chartCenterX)
					.attr(
						"y",
						margin.top + chartHeight + bottomAxisScale * axisSize * p.xLabelScale + bottomTitleSize + 15
					);
			}

			// left yAxis
			if (p.usesLeftAxisTitle && !p.chartRotate) {
				svg.append("text")
					.text(p.leftAxisTitle)
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("x", -chartCenterY + 24) // up and down bc rotated
					.attr("y", axisTitleSize / p.labelPaddingScale + 2) // dist to edge
					.attr("font-size", axisTitleFontSize)
					.attr("fill", p.leftAxisColor);
			}

			// right yAxis
			if (p.usesRightAxisTitle) {
				svg.append("text")
					.text(p.rightAxisTitle)
					.style("text-anchor", "middle")
					.attr("transform", "rotate(90)")
					.attr("x", chartCenterY)
					.attr("y", -svgWidth + axisTitleFontSize / p.labelPaddingScale)
					.attr("font-size", axisTitleFontSize)
					.attr("fill", p.rightAxisColor);
			}

			let hoverBars;
			if (p.usesHoverBars)
				hoverBars = svg
					.append("g")
					.attr("class", "hoverBars")
					.attr("transform", `translate(${margin.left}, ${margin.top})`);

			let bars;
			if (p.usesBars) {
				bars = svg
					.append("g")
					.attr("class", "bars")
					.attr("transform", `translate(${margin.left}, ${margin.top})`);
			}

			let stackedBars;
			if (p.usesStackedBars) {
				stackedBars = svg
					.append("g")
					.attr("class", "stackedBars")
					.attr("transform", `translate(${margin.left}, ${margin.top})`);
			}
			// stacked bars
			let color;
			let stack;
			if (p.usesStackedBars) {
				color = d3.scaleOrdinal(p.chartProperties.stackedBars, p.barColors);
				stack = d3.stack().keys(p.chartProperties.stackedBars);
			}

			let domainCalloutLabel, domainCalloutLine;
			if (p.usesDomainCallout) {
				domainCalloutLabel = svg
					.append("g")
					.append("text")
					.attr("fill", p.domainCalloutLineColor)
					.attr("text-anchor", "end")
					.attr("font-size", axisLabelFontSize)
					.text(p.domainCalloutLabel);

				domainCalloutLine = svg
					.append("line")
					.style("stroke-width", 2)
					.style("stroke", p.domainCalloutLineColor)
					.style("stroke-dasharray", "5, 5");
			}

			// lines
			let lines = [];
			let lineGroups = [];
			let lineGroupPaths = [];
			let lineCount = 0;
			let maxLineCount = 10;
			if (p.usesMultiLineLeftAxis) {
				// move to top - multiLineColors = d3.scaleOrdinal(p.multiLineColors);
				// need the legend Nests from ALL incoming data
				fullNestedData = d3
					.nest()
					.key((d) => d[p.multiLineLeftAxisKey])
					.entries(allIncomingData);

				// limit legend to 10 max
				fullNestedData.forEach((d, i) => {
					//if (i > 9) { console.log("nested dontDraw on data d,i", d, i); }
					if (d.values[0].dontDraw === false && lineCount < maxLineCount) {
						lineCount++; // increment barCount
					} else {
						// then either dontDraw already true or needs to be set to true
						// bc line count is exceeded
						// --- iterate over ALL values and set ALL to true
						//console.log("nested dontDraw SET TRUE on data d,i", d, i);
						d.values[0].dontDraw = true;
					}
				});

				fullNestedData.forEach((nd, i) => {
					// only draw those whose first data point is dontDraw = false
					if (nd.values[0].dontDraw === false) {
						lines[i] = d3.line().defined(function (d) {
							return d.estimate !== null;
						});
						const lineGroup = svg
							.append("g")
							.attr("class", nd.key.replace(/[\W_]+/g, ""))
							.attr("transform", `translate(${margin.left}, ${margin.top})`);

						lineGroups[i] = lineGroup;

						nd.values[0].assignedLegendColor = multiLineColors(i);
						//console.log("lineGroup color assigned to i,nd,multilinecolor:", nd.values[0].assignedLegendColor, nd, multiLineColors(i));

						lineGroupPaths[i] = lineGroups[i]
							.append("path")
							.attr("fill", "none")
							.attr("stroke", multiLineColors(i))
							.attr("stroke-width", 2);
					}
				});
			}

			const leftLine1Color = p.leftLine1Color || p.leftAxisColor;

			let leftLine1 = d3.line();
			const leftLineGroup1 = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
			let leftLinePath1 = leftLineGroup1
				.append("path")
				.attr("fill", "none")
				.attr("stroke", leftLine1Color)
				.attr("stroke-width", 4);

			let leftLine2 = d3.line();
			const leftLineGroup2 = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
			let leftLinePath2 = leftLineGroup2
				.append("path")
				.attr("fill", "none")
				.attr("stroke", p.leftLine2Color)
				.attr("stroke-width", 4);

			let leftLine3 = d3.line();
			const leftLineGroup3 = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
			let leftLinePath3 = leftLineGroup3
				.append("path")
				.attr("fill", "none")
				.attr("stroke", p.leftLine3Color)
				.attr("stroke-width", 4);

			const rightLineColor = p.rightLineColor || p.rightAxisColor;
			let rightLine = d3.line();
			let rightLineGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
			let rightLinePath = rightLineGroup
				.append("path")
				.attr("fill", "none")
				.attr("stroke", rightLineColor)
				.attr("stroke-width", 4);

			const endRangeSpecialSectionStartDate = p.usesMultiLineLeftAxis
				? fullNestedData[0].values.slice(-p.finalDataPointsDaysCount)[0].date
				: p.data.slice(-p.finalDataPointsDaysCount)[0].date;

			let barColor, edgeCaseBarColor;
			if (p.usesBars) {
				barColor = p.barColor ?? leftLine1Color;

				if (p.finalDataPointsDaysCount)
					edgeCaseBarColor =
						p.edgeCaseFinalBarColor ??
						Utils.adjustColorLuminance(barColor, p.edgeCaseForFinalDataPointBarColorPercentAdjust);
			}

			let dateCalloutLabel, dateCalloutLine;
			if (p.usesDateCallout) {
				dateCalloutLabel = svg
					.append("g")
					.append("text")
					.attr("fill", p.dateCalloutLineColor)
					.attr("text-anchor", "middle")
					.attr("font-size", axisLabelFontSize)
					.text(p.dateCalloutLabel);

				dateCalloutLine = svg
					.append("line")
					.style("stroke-width", 2)
					.style("stroke", p.dateCalloutLineColor)
					.style("stroke-dasharray", "5, 5");
			}

			const updateTheChart = (data, nestedData) => {
				const sortedXValues = data.map((d) => d[p.chartProperties.xAxis]).sort((a, b) => a - b);
				if (p.needsScaleTime) {
					let minReported = sortedXValues[0];
					let maxReported = [...sortedXValues.slice(-1)][0];
					minReported.setDate(minReported.getDate() - 1); // these tweaks move the points off of the edges, to not end up on the axis
					maxReported.setDate(maxReported.getDate() + 1);
					xScale.domain([minReported, maxReported]).nice();
				} else xScale.domain(sortedXValues.map((d) => d));

				if (p.usesDomainCallout) {
					const calloutDomainY = yScaleLeft(p.domainCalloutY);
					domainCalloutLabel
						.attr("y", calloutDomainY + margin.top - 0.25 * axisLabelFontSize)
						.attr("x", svgWidth - margin.right - 30)
						.attr("opacity", calloutDomainY ? "1" : "0");

					domainCalloutLine
						.attr("x1", margin.left)
						.attr("y1", calloutDomainY + margin.top)
						.attr("x2", svgWidth - margin.right)
						.attr("y2", calloutDomainY + margin.top)
						.attr("opacity", calloutDomainY ? "1" : "0");
				}

				if (p.usesHoverBars) {
					hoverBars
						.selectAll("rect")
						.data(data, (d) => d.Date)
						.join(
							(enter) => {
								enter
									.append("rect")
									.attr("class", "hover-bar")
									.attr("width", xScale.bandwidth())
									.attr("y", 0)
									.attr("height", (d) => yScaleLeft(d[p.chartProperties.bars]))
									.attr("x", (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("fill", "black")
									.attr("opacity", "0");
							},
							(update) => {
								update
									.attr("x", (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("width", xScale.bandwidth());
							},
							(exit) => {
								exit.remove();
							}
						);
				}

				if (p.usesBars) {
					bars.selectAll("rect")
						.data(drawData)
						.join(
							(enter) => {
								enter
									.append("rect")
									.attr("class", "bar")
									.attr("width", xScale.bandwidth())
									.attr("fill", (d, i) => {
										if (p.barColors) {
											// save the color used
											d.assignedLegendColor = p.barColors[i];
											return p.barColors[i];
										}
										if (
											p.finalDataPointsDaysCount &&
											d[p.chartProperties.xAxis] >= endRangeSpecialSectionStartDate
										)
											return edgeCaseBarColor;
										return barColor;
									})
									.attr("height", (d) => chartHeight - yScaleLeft(d[p.chartProperties.bars]))
									//console.log("BAR x=", xScale(d[p.chartProperties.xAxis]));
									.attr("x", (d, i) => xScale(d[p.chartProperties.xAxis]))
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.bars]))
									.attr("opacity", 0.85);
							},
							(update) => {
								update
									.attr("width", xScale.bandwidth())
									.attr("fill", (d, i) => {
										if (p.barColors) {
											// save the color used
											d.assignedLegendColor = p.barColors[i];
											return p.barColors[i];
										}
										if (
											p.finalDataPointsDaysCount &&
											d[p.chartProperties.xAxis] >= endRangeSpecialSectionStartDate
										)
											return edgeCaseBarColor;
										return barColor;
									})
									.attr("height", (d) => chartHeight - yScaleLeft(d[p.chartProperties.bars]))
									.attr("x", (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.bars]));
							},
							(exit) => {
								exit.remove();
							}
						);

					// MEOWWWW - DRAW CI WHISKERS FOR BAR CHART
					if (p.enableCI) {
						// did this so I could log the data
						//console.log("cidata,xbandwidth", drawData, xScale.bandwidth());

						drawData.forEach((d, i) => {
							// (TT) note bc of the rotated chart:
							// - x in the below code is up and down as you see chart
							// - y is left and right as you look at chart
							const CIBarId = "CIBar" + i;
							const CIBarItem = svg
								.append("line")
								.datum(d)
								.attr("class", `${svgId}-CIBarItem`)
								.attr("id", CIBarId)
								.filter(function (d) {
									// console.log(
									// 	"cidata2 i, lci, est, uci:",
									// 	i,
									// 	d.estimate_lci,
									// 	d.estimate,
									// 	d.estimate_uci
									// );
									return d.estimate_uci;
								})
								//(TTT) LEAVE THESE LOGS HERE UNTIL WE CONFIRM FROM TESTING THESE CI WHISKERS ARE CORRECT
								.attr("x1", function (d) {
									return xScale(d[p.chartProperties.xAxis]) + xScale.bandwidth() / 2 + margin.left;
								}) //console.log("x1,bandwidth,total=", xScale(d[p.chartProperties.xAxis]), xScale.bandwidth(), xScale(d[p.chartProperties.xAxis]) + xScale.bandwidth() );
								.attr("y1", function (d) {
									return yScaleLeft(d.estimate_lci) + margin.top;
								})
								//.attr("y1", function (d) { console.log("y1=", (yScaleLeft(d[p.chartProperties.bars] - d.estimate_lci))); return  yScaleLeft(d.estimate_lci) + margin.top; })
								.attr(
									"x2",
									(d) => xScale(d[p.chartProperties.xAxis]) + xScale.bandwidth() / 2 + margin.left
								)
								//.attr("y2", function (d) { return  yScaleLeft(d.estimate_uci) + margin.top; })
								.attr("y2", function (d) {
									// console.log("cProp.bars=", d[p.chartProperties.bars]);
									// console.log("y2=", yScaleLeft(d[p.chartProperties.bars]));
									return yScaleLeft(d.estimate_uci) + margin.top;
								})
								.attr("stroke", "black")
								.attr("stroke-width", 3);
						});
					}
				}

				if (p.usesStackedBars) {
					stackedBars
						.selectAll("g")
						.data(stack(data))
						.join("g")
						.attr("fill", (d) => color(d.key))
						.selectAll("rect")
						.data((d) => d)
						.join("rect")
						.attr("class", "stacked-bar")
						.attr("x", (d) => xScale(d.data[p.chartProperties.xAxis]))
						.attr("y", ([y1, y2]) => Math.min(yScaleLeft(y1), yScaleLeft(y2)))
						.attr("height", ([y1, y2]) => yScaleLeft(y1) - yScaleLeft(y2))
						.attr("width", xScale.bandwidth());
				}

				const dataLength = p.usesMultiLineLeftAxis ? nestedData[0].values.length : data.length;

				if (p.usesBars) {
					// need to set to number of bars + 1 to get each tick mark a label drawn (TT)
					p.numberOfEquallySpacedDates = drawData.length + 1;
				}
				const allDateTicksButLast = xScale
					.domain()
					.filter((d, i) => !(i % Math.ceil(xScale.domain().length / (p.numberOfEquallySpacedDates - 1))))
					.slice(0, p.numberOfEquallySpacedDates - 1);
				const lastTick = d3.max(xScale.domain());
				const lastInGroup = [...allDateTicksButLast].slice(-1)[0];
				let tickValues;
				if ((Date.parse(lastTick) - Date.parse(lastInGroup)) / (1000 * 60 * 60 * 24) < 21) {
					allDateTicksButLast.pop();
					tickValues = [...allDateTicksButLast, lastTick];
				} else tickValues = [...allDateTicksButLast, lastTick];
				tickValues = [...allDateTicksButLast, lastTick];

				const offset = p.needsScaleTime ? 0 : xScale.bandwidth() / 2; // the alignment value for line/ellipse position to bar positions

				if (p.finalDataPointsDaysCount && p.finalDataPointsType) {
					// end-data edge-cases
					// case where we put a colored rect over last n number of date ranges to callout a specific condition
					// remove the rect if it already exists
					if (p.finalDataPointsType === "rect") {
						const currentEdgeCaseEndDataRect = d3.select("#edgeCaseEndDataRect");
						if (!currentEdgeCaseEndDataRect.empty()) {
							currentEdgeCaseEndDataRect.remove();
						}

						const finalDate = d3.max(xScale.domain());
						const startDate = d3.min(xScale.domain());
						// get width and start for rect
						if (finalDate > endRangeSpecialSectionStartDate) {
							const startDateUsed =
								startDate > endRangeSpecialSectionStartDate
									? startDate
									: endRangeSpecialSectionStartDate;
							svg.append("rect")
								.attr("id", "edgeCaseEndDataRect")
								.attr("transform", `translate(${margin.left}, ${margin.top})`)
								.attr("height", chartHeight)
								.attr("width", offset + xScale(finalDate) - xScale(startDateUsed))
								.attr("x", xScale(startDateUsed) - offset / 2)
								.attr("fill", p.rectColorForFinalDataPoints)
								.attr("opacity", 0.25)
								.attr("pointer-events", "none");
						}
					}
				}

				if (p.usesMultiLineLeftAxis) {
					nestedData.forEach((nd, i) => {
						// only draw those whose first data point is dontDraw = false
						if (nd.values[0].dontDraw === false) {
							lines[i]
								.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
								.y((d) => yScaleLeft(d[p.chartProperties.yLeft1]));

							// #### Show confidence interval #####
							// BROKEN OUT SEPARATELY TO ENABLE AND DISABLE
							if (p.enableCI) {
								lineGroups[i]
									.append("path")
									.datum(nd.values, (d) => d[p.chartProperties.xAxis])
									.attr("fill", multiLineColors(i))
									.attr("stroke", "none")
									.style("opacity", 0.4)
									.attr(
										"d",
										d3
											.area()
											.x(function (d) {
												// console.log(
												// 	"x d,i,x:",
												// 	d,
												// 	i,
												// 	xScale(d[p.chartProperties.xAxis]) + offset
												// );
												return xScale(d[p.chartProperties.xAxis]) + offset;
											})
											.y0(function (d) {
												// console.log("y0 d:", yScaleLeft(d.estimate_lci));
												return yScaleLeft(d.estimate_lci);
											})
											.y1(function (d) {
												// console.log("y1 d:", yScaleLeft(d.estimate_uci));
												return yScaleLeft(d.estimate_uci);
											})
									);
							}

							lineGroupPaths[i].attr("d", lines[i](nd.values));
							lineGroups[i]
								.selectAll("ellipse")
								.data(nd.values, (d) => d[p.chartProperties.xAxis])
								.join(
									(enter) => {
										enter
											.append("ellipse") // adding hover over ellipses
											.filter(function (d) {
												return d.estimate;
											})
											.style("fill", multiLineColors(i))
											.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
											.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
											.attr("rx", d3.max([5, offset]))
											.attr("ry", d3.max([5, d3.min([offset, 15])]))
											.style("opacity", 0); // this makes it invisible
										enter
											.append("ellipse") // add always visible "point" (TT)
											// filter out the nulls at last possible moment (TT)
											.filter(function (d) {
												return d.estimate;
											})
											// change to a function and set based on the "flag"
											.style("fill", function (d) {
												if (d.flag === "*") {
													//console.log("### FLAG exists for i:", i, nd.values[0].flag);
													return "white"; // creates circle that appears "empty" for "*" flag
												} else {
													//console.log("### FLAG does NOT exist i:", i, nd.values[i].flag);
													return multiLineColors(i); // fills in the dot with line color
												}
											})
											.style("stroke", function (d) {
												if (d.flag !== undefined) {
													//console.log("### FLAG exists for i:", i, nd.values[0].flag);
													return multiLineColors(i);
												}
											})
											.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
											.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
											.attr("rx", d3.max([5, 1])) // 5 = point width in pixels
											.attr("ry", d3.max([5, d3.min([offset, 1])]))
											.style("opacity", 1);
									},
									(update) => {
										update
											.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
											.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
											.attr("rx", d3.max([5, offset]))
											.attr("ry", d3.max([5, d3.min([offset, 15])]));
										/* 											.style("fill", (d, i) => {
																						// save the color used
																						d.assignedLegendColor = multiLineColors[i];
																						return multiLineColors[i];
																					}) */
									},
									(exit) => {
										exit.remove();
									}
								);
						}
					});
				}

				leftLine1
					.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
					.y((d) => yScaleLeft(d[p.chartProperties.yLeft1]));

				if (p.usesLeftLine1 && !p.usesMultiLineLeftAxis) {
					let leftLine1Data;
					if (p.finalDataPointsDaysCount && p.hideLeft1InFinalDataPoints)
						leftLine1Data = data.filter(
							(d) =>
								d[p.chartProperties.yLeft1] > 0 &&
								d[p.chartProperties.xAxis] < endRangeSpecialSectionStartDate
						);
					else leftLine1Data = data.filter((d) => d[p.chartProperties.yLeft1] > 0);

					leftLinePath1.attr("d", leftLine1(leftLine1Data));

					leftLineGroup1
						.selectAll("ellipse")
						.data(leftLine1Data, (d) => d[p.chartProperties.xAxis])
						.join(
							(enter) => {
								enter
									.append("ellipse")
									.style("fill", leftLine1Color)
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]))
									.style("opacity", 0);
							},
							(update) => {
								update
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]));
							},
							(exit) => {
								exit.remove();
							}
						);
				}

				leftLine2
					.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
					.y((d) => yScaleLeft(d[p.chartProperties.yLeft2]));

				if (p.usesLeftLine2) {
					let leftLine2Data;
					if (p.finalDataPointsDaysCount && p.hideLeft2InFinalDataPoints)
						leftLine2Data = data.filter(
							(d) =>
								d[p.chartProperties.yLeft2] > 0 &&
								d[p.chartProperties.xAxis] < endRangeSpecialSectionStartDate
						);
					else leftLine2Data = data.filter((d) => d[p.chartProperties.yLeft2] > 0);

					leftLinePath2.attr("d", leftLine2(leftLine2Data));

					leftLineGroup2
						.selectAll("ellipse")
						.data(leftLine2Data, (d) => d[p.chartProperties.xAxis])
						.join(
							(enter) => {
								enter
									.append("ellipse")
									.style("fill", p.leftLine2Color)
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft2]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]))
									.style("opacity", 0);
							},
							(update) => {
								update
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft2]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]));
							},
							(exit) => {
								exit.remove();
							}
						);
				}

				if (p.usesLeftLine3) {
					leftLine3
						.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
						.y((d) => yScaleLeft(d[p.chartProperties.yLeft3]));

					if (p.usesLeftLine3) {
						let leftLine3Data;
						if (p.finalDataPointsDaysCount && p.hideLeft3InFinalDataPoints)
							leftLine3Data = data.filter(
								(d) =>
									d[p.chartProperties.yLeft3] > 0 &&
									d[p.chartProperties.xAxis] < endRangeSpecialSectionStartDate
							);
						else leftLine3Data = data.filter((d) => d[p.chartProperties.yLeft3] > 0);

						leftLinePath3.attr("d", leftLine3(leftLine3Data));

						leftLineGroup3
							.selectAll("ellipse")
							.data(leftLine3Data, (d) => d[p.chartProperties.xAxis])
							.join(
								(enter) => {
									enter
										.append("ellipse")
										.style("fill", p.leftLine3Color)
										.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
										.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft3]))
										.attr("rx", d3.max([5, offset]))
										.attr("ry", d3.max([5, d3.min([offset, 15])]))
										.style("opacity", 0);
								},
								(update) => {
									update
										.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
										.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft3]))
										.attr("rx", d3.max([5, offset]))
										.attr("ry", d3.max([5, d3.min([offset, 15])]));
								},
								(exit) => {
									exit.remove();
								}
							);
					}
				}

				rightLine
					.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
					.y((d) => yScaleRight(d[p.chartProperties.yRight]));

				if (p.usesRightLine) {
					let rightLineData;
					if (p.finalDataPointsDaysCount && p.hideRightInFinalDataPoints)
						rightLineData = data.filter(
							(d) =>
								d[p.chartProperties.yRight] > 0 &&
								d[p.chartProperties.xAxis] < endRangeSpecialSectionStartDate
						);
					else rightLineData = data.filter((d) => d[p.chartProperties.yRight] > 0);

					rightLinePath.attr("d", rightLine(rightLineData)).attr("stroke-dasharray", p.rightDashArrayScale);

					rightLineGroup
						.selectAll("ellipse")
						.data(rightLineData, (d) => d[p.chartProperties.xAxis])
						.join(
							(enter) => {
								enter
									.append("ellipse")
									.style("fill", rightLineColor)
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleRight(d[p.chartProperties.yRight]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]))
									.style("opacity", 0);
							},
							(update) => {
								update
									.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
									.attr("cy", (d) => yScaleRight(d[p.chartProperties.yRight]))
									.attr("rx", d3.max([5, offset]))
									.attr("ry", d3.max([5, d3.min([offset, 15])]));
							},
							(exit) => {
								exit.remove();
							}
						);
				}

				if (p.usesDateCallout) {
					const calloutDateX = xScale(p.dateCalloutDate);
					dateCalloutLabel
						.attr("y", margin.top + axisLabelFontSize)
						.attr("x", () => calloutDateX + margin.left + offset)
						.attr("opacity", calloutDateX ? "1" : "0");

					dateCalloutLine
						.attr("x1", calloutDateX + margin.left + offset)
						.attr("y1", margin.top + axisLabelFontSize + 5)
						.attr("x2", calloutDateX + margin.left + offset)
						.attr("y2", svgHeight - margin.bottom)
						.attr("opacity", calloutDateX ? "1" : "0");
				}

				if (p.usesDateAsXAxis) {
					if (p.needsScaleTime) xAxis.ticks(7).tickFormat((d) => genFormat(d, "year"));
					else xAxis.tickValues(tickValues);
				}
				if (p.usesBars === true && p.chartRotate === true) {
					// need to format axis tick vals
					xAxisDraw.call(xAxis);
					d3.selectAll(`#${svgId} .axis.bottom text`).each(insertLinebreaks);
				} else {
					// draw regular/normal
					xAxisDraw.call(xAxis);
				}

				if (p.bottomAxisRotation)
					d3.selectAll(`#${svgId} .axis.bottom text`)
						.attr("text-anchor", "end")
						.attr(
							"transform",
							`translate(${p.xLabelRotatedXAdjust * overallScale + 6}, ${
								p.xLabelRotatedYAdjust * overallScale
							}) rotate(${p.bottomAxisRotation})`
						);

				d3.selectAll(`#${svgId} .axis text`).attr("font-size", axisLabelFontSize);
				d3.selectAll(`#${svgId} .y.axis.left text`).attr("fill", p.leftAxisColor);
				d3.selectAll(`#${svgId} .y.axis.right .tick text`).attr("fill", p.rightAxisColor);

				d3.selectAll(
					`#${svgId} ellipse, #${svgId} ellipse, #${svgId} rect.bar, #${svgId} rect.hover-bar, #${svgId} rect.stacked-bar`
				)
					.on("mouseover", mouseover)
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("touchmove", mouseout)
					.on("scroll", mouseout);

				d3.select("#outerContainer").on("touchmove", mouseout);
			};

			/* ***************************************************************************
			/*  GenTrendsSlider Section
			/* ************************************************************************* */
			if (p.usesDateDomainSlider) {
				const sliderContainer = viz
					.append("div")
					.attr("data-html2canvas-ignore", "")
					.attr("id", `${p.vizId}slider-viz-div`)
					.attr("class", "slider-viz-div")
					.style("width", "100%");

				sliderContainer.append("input").attr("id", `${p.vizId}sliderEventHandler`).style("display", "none");

				// This clone stops the sliderEventHandler from being created multiple times when the
				// graph is re-rendered on right- left-axis and territory changes.
				let el = document.getElementById(`${p.vizId}sliderEventHandler`);
				let elClone = el.cloneNode(true);
				el.parentNode.replaceChild(elClone, el);

				const sliderEvent = d3.select(`#${p.vizId}sliderEventHandler`);
				if (!sliderEvent.empty()) {
					// listen to date-range slider ... on change, update bars, lines, paths, and xAxis
					// this event fires on initial chart loading as well
					document
						.getElementById(`${p.vizId}sliderEventHandler`)
						.addEventListener(`${p.vizId}trendsSliderEvent`, (evt) => {
							const startDate = evt.detail[0];
							const endDate = evt.detail[1];
							const updatedDataset = p.data.filter(
								(d) => d[p.chartProperties.xAxis] >= startDate && d[p.chartProperties.xAxis] <= endDate
							);
							const updatedNestedData = d3
								.nest()
								.key((d) => d[p.multiLineLeftAxisKey])
								.entries(updatedDataset);
							updateTheChart(updatedDataset, updatedNestedData);
						});
				}
			} else {
				updateTheChart(p.data, fullNestedData);
			}
			d3.selectAll(`#${svgId} .left .tick line`).attr("stroke", p.leftAxisColor).attr("opacity", "0.4");

			genTooltip.render();
		}

		let currPos;
		if (p.usesBars === true && p.chartRotate === true) {
			// rotate the chart prior to adding legend items for proper location setting
			currPos = $(`#${svgId}`)[0].getBoundingClientRect();
			d3.select(`#${svgId}`).attr("transform", "rotate(90)");

			// Add the legend. Have to do this last after Bar Chart drawn

			if (p.usesLegend === true) {
				// set up the data first
				//console.log("p.data:", p.data);

				// HERE IS WHERE WE USE ALL DATA even if dontDraw = false
				// THis the bar chart LEGEND gives option of turning on and off ALL values
				// without this the clicking slowly disappears the options never to return

				// now sort by stub_label_num
				allIncomingData.sort((a, b) => {
					return a.stub_label_num - b.stub_label_num;
				});

				// (TT) Reliability they want all Null and NaN entries REMOVED

				// ALSO REMOVES THE COLOR LINES ON ONES WITH dontDraw = TRUE
				allIncomingData.forEach((d, i) => {
					legendData[i] = {
						stroke: d.assignedLegendColor, //  p.barColors[i] -> WRITE FUNCTIN TO RETURN BAR COLOR FROM DRAWN BAR
						dashArrayScale: 0,
						text: d.stub_label,
						dontDraw: d.dontDraw,
					};
					if (!d.draw) {
						//console.log("legend incoming data:", i, d.stub_label);
					}
				});

				// Are there more than 10 legend items
				//console.log("### BARS numLegendItems:", numLegendItems);

				/* 				svg.append("text")
							.attr("id", "legendBarTxt")
							//.attr("class", "visible")
							.attr("x", labelTx)
							.attr("y", labelTy)
							.attr("dy", "0.32em")
							.style("fill", "black")
							.style("font-size", "17px")
							.text("Select up to 10 groups"); */

				////
				// need height first
				const legendHeight = (legendData.length + 1) * axisLabelFontSize * 1.1;
				let legendTx;
				let legendTy;

				if (p.legendBottom) {
					// try increasing the width even though it is rotated?
					svg.attr("width", svgWidth + legendHeight + 100);
					svg.select("#whitebox").attr("width", svgWidth + legendHeight + 30);

					legendTx = svgWidth + 10;
					legendTy = (svgHeight - margin.top - margin.bottom) / 2; // * 2 + 25;

					//console.log("genChart: legTx, LegTy, legendHeight:", legendTx, legendTy, legendHeight);
				} else {
					legendTx = margin.left + p.legendCoordinatePercents[0] * svgWidth;
					legendTy = margin.top + p.legendCoordinatePercents[1] * svgHeight;
				}

				if (legendData[0].text.length > 0) {
					// ***********************************************
					// (TTT) MOVE TO AFTER THE LEGEND IS MADE
					// THEN POSITION IT EXACTLY CENTER OF THE LEGEND
					//**************************************************
					if (legendData.length > 10) {
						const selectTenText = svg
							.append("g")
							.attr("transform", `translate(${legendTx}, ${legendTy})`)
							.append("text")
							.attr("id", "selectTenTxt")
							.attr("x", -80) //legendTx - 120)
							.attr("y", -16) //legendTy - 250)

							//.attr("dy", "0.32em")
							.style("fill", "black")
							.style("font-size", "17px")
							.text("Select up to 10 groups")
							.attr("transform", `rotate(-${p.chartRotationPercent})`);
					}
					const legendContainer = svg
						.append("g")
						.attr("transform", `translate(${legendTx}, ${legendTy})`)
						.append("rect")
						.attr("id", `${svgId}-chart-legend`)
						.attr("data-html2canvas-ignore", "")
						.attr("height", legendHeight)
						.attr("fill", "#F2F2F2")
						.attr("rx", "5")
						.attr("ry", "5")
						.attr("stroke", "black")
						.attr("data-html2canvas-ignore", "");

					legendData.forEach((d, i) => {
						// create unique id name
						const legendId = d.text.replace(/ /g, "_");
						const legendItem = svg
							.append("g")
							.attr("class", `${svgId}-legendItem ${d.text.replace(/[\W_]+/g, "")}`)
							.attr("id", legendId)
							.attr(
								"transform",
								`translate(${legendTx + 1.1 * axisLabelFontSize * (i + 1)},
								${legendTy + axisLabelFontSize / 2 - 15})`
							)
							.attr("data-html2canvas-ignore", "");

						// only draw color line if data is drawn
						if (!d.dontDraw) {
							legendItem
								.append("line")
								.attr("x1", 0)
								.attr("y1", 0)
								.attr("x2", 40)
								.attr("y2", 0)
								.attr("stroke", d.stroke)
								.attr("stroke-width", 4)
								.attr("stroke-dasharray", d.dashArrayScale)
								.attr("transform", `rotate(-${p.chartRotationPercent})`);
						}
						//console.log("2 data d:", d);

						// Could not get these methods of implementing a checkbox to work
						// just see a white space and no checkbox and not aligned in proper location either
						/* 					legendItem
												.append("input")
												.attr("checked", true)
												.attr("type", "checkbox")
												//.attr("label", function(d, i) { return i; })
												.attr("id", function (d, i) { return "legCheck" + i; });
												//.attr("onClick", "change(this)")
												//.attr("for", function(d,i) { return "legCheck" + i; }); */

						/* 					legendItem
												.append("foreignObject")
												.attr("width", 20)
												.attr("height", 20)
												.append("xhtml:body")
												//.html("<form><input type=checkbox id=check /></form>")
												.html("<i class='fas fa-check-square'></i>")
												.on("click", function(d, i){
													console.log("checkbox icon clicked");  // legendItem.select("#check").node().checked
												}); */

						// could not get d alone to work in function below
						// -- if you use d in the foreach above, you can't then use the same d
						// in a function inside it.  Have to use another variable (TT)
						const curD = d;
						legendItem
							.append("g")
							.append("text")
							//.attr('font-family', 'FontAwesome') // this method does not work (TT)
							.attr("class", "far")
							.attr("font-size", axisLabelFontSize * 1.1)
							.attr("x", 45)
							.attr("y", axisLabelFontSize * 0.5)
							.text(function (curD) {
								//console.log("GenChart-Legend BARCHART - set checked or not - 3 data curD,d:", curD,d);
								if (d.dontDraw) {
									return "\uf0c8"; // square unicode [&#xf0c8;]
								} else {
									return "\uf14a"; // check square unicode
								}
							})
							.attr("transform", `rotate(-${p.chartRotationPercent})`);

						legendItem
							.append("g")
							.append("text")
							.attr("font-family", "sans-serif")
							.attr("font-size", axisLabelFontSize * 1.0)
							.attr("x", 67)
							.attr("y", axisLabelFontSize * 0.5) // axisLabelFontSize * 0.4
							.text(d.text)
							.attr("font-size", axisLabelFontSize)
							.attr("transform", `rotate(-${p.chartRotationPercent})`);
					});

					// get all legend items and find the longest then set the legend container size
					const legendItems = document.querySelectorAll(`.${svgId}-legendItem`);
					const legendWidths = [...legendItems].map((l) => l.getBoundingClientRect().width);
					const newWidth = d3.max(legendWidths);
					legendContainer
						.attr("width", newWidth + 56) //might need to calculate the 53 based on fontsize or something
						.attr("transform", `rotate(-${p.chartRotationPercent})`);

					// Now center the legend container
					legendContainer.attr("x", legendContainer.attr("x") - legendContainer.attr("width") / 2);

					// Now get each legend Item Line and move those to the left
					let adjustX;
					let adjustY;
					const legendElementG = d3.selectAll(`.${svgId}-legendItem`).nodes();
					legendElementG.forEach((text) => {
						d3.select(text).attr("transform", function (d) {
							adjustX = text.transform.animVal[0].matrix.e;
							// since bar chart is rotated the move left is on the Y not the X
							adjustY = text.transform.animVal[0].matrix.f + legendContainer.attr("width") / 2;
							//console.log(text.transform.animVal[0].matrix.e + ", " + text.transform.animVal[0].matrix.f);
							//console.log("slect transform", this, this.getAttribute("transform"), this.getAttribute("transform"));
							let newTransform = " translate(" + `${adjustX},${adjustY}` + ")"; // this.getAttribute("transform") +
							//console.log("newTransform:", newTransform);
							return newTransform; // this.getAttribute("transform") +
						});
					});
				} // end if legendData.length > 0
			}
		} else {
			// DRAW LEGEND FOR NON-ROTATED CHARTS
			if (p.usesLegend) {
				// FOR ASSIGNED LEGEND COLOR TO WORK, LEGEND HAS TO BE DRAWN
				// AFTER THE GRAPH HAS BEEN DRAWN WHETHER LINE OR BAR CHART
				// - therefore all legend drawing must be moved to the END
				// of this code

				//Sort ascending order
				let legendSorted = legendData.slice().sort((a, b) => d3.ascending(a.text, b.text));
				legendData = legendSorted;

				if (p.usesMultiLineLeftAxis && fullNestedData && fullNestedData[0].key) {
					// ALL nests go on the legend but only draw those that are set to dontDraw = false
					fullNestedData.forEach((d, i) => {
						//console.log("fullnestdata d,i,color:", d, i, d.values[0].assignedLegendColor);
						legendData[i] = {
							stroke: d.values[0].assignedLegendColor,
							dashArrayScale: p.left1DashArrayScale,
							text: d.key,
							dontDraw: d.values[0].dontDraw,
						};
					});

					//console.log("## LINES numLegendItems:", numLegendItems);

					// cannot do it this way below because
					// the data is NOT nested and lists too many legend entries
					/* 					allIncomingData.forEach((d, i) => {
											legendData[i] = {
											stroke: d.assignedLegendColor, //  p.barColors[i] -> WRITE FUNCTIN TO RETURN BAR COLOR FROM DRAWN BAR
											dashArrayScale: 0,
											text: d.stub_label,
											dontDraw: d.dontDraw,
										}; */
				} else if (p.usesStackedBars) {
					stack(p.data).forEach((d, i) => {
						legendData[i] = {
							stroke: color(d.key),
							dashArrayScale: p.left1DashArrayScale,
							text: p.genTooltipConstructor.propertyLookup[d.key].title.split(":")[0],
							dontDraw: d.values[0].dontDraw,
						};
					});
					legendData.reverse();
				} else {
					if (p.usesLeftLine1) {
						legendData.push({
							stroke: leftLine1Color,
							dashArrayScale: p.left1DashArrayScale,
							text: p.leftLegendText,
							dontDraw: d.values[0].dontDraw,
						});
					}
					if (p.usesLeftLine2) {
						legendData.push({
							stroke: p.leftLine2Color,
							dashArrayScale: p.left2DashArrayScale,
							text: p.left2LegendText,
							dontDraw: d.values[0].dontDraw,
						});
					}
					if (p.usesLeftLine3) {
						legendData.push({
							stroke: p.leftLine3Color,
							dashArrayScale: p.left3DashArrayScale,
							text: p.left3LegendText,
							dontDraw: d.values[0].dontDraw,
						});
					}
				}

				if (p.usesRightLine) {
					legendData.push({
						stroke: rightLineColor,
						dashArrayScale: p.rightDashArrayScale,
						text: p.rightLegendText,
						dontDraw: d.values[0].dontDraw,
					});
				}

				// need height first
				const legendHeight = (legendData.length + 1) * axisLabelFontSize * 1.1;
				let legendTx;
				let legendTy;

				if (p.legendBottom) {
					svg.attr("height", svgHeight + legendHeight + 30);
					svg.select("#whitebox").attr("height", svgHeight + legendHeight + 30);

					// try to center it
					legendTx = (svgWidth - margin.left - margin.right) / 2 + 50;
					// move it down outside the bottom margin
					legendTy = margin.top + svgHeight;
					// now move the legend below the axis
				} else {
					legendTx = margin.left + p.legendCoordinatePercents[0] * svgWidth;
					legendTy = margin.top + p.legendCoordinatePercents[1] * svgHeight;
				}

				const legendContainer = svg
					.append("g")
					.attr("transform", `translate(${legendTx}, ${legendTy})`)
					.append("rect")
					.attr("id", `${svgId}-chart-legend`)
					.attr("data-html2canvas-ignore", "")
					.attr("height", legendHeight)
					.attr("fill", "#F2F2F2")
					.attr("rx", "5")
					.attr("ry", "5")
					.attr("stroke", "black");

				legendData.forEach((d, i) => {
					const legendId = d.text.replace(/ /g, "_");
					const legendItem = svg
						.append("g")
						.attr("class", `${svgId}-legendItem ${d.text.replace(/[\W_]+/g, "")}`)
						.attr("id", legendId)
						.attr("data-html2canvas-ignore", "")
						.attr(
							"transform",
							`translate(${legendTx + axisLabelFontSize / 2},
								${legendTy + 1.1 * axisLabelFontSize * (i + 1)})`
						);

					//console.log("legendItem d,i:", d, i);

					// only draw color line if data is drawn
					if (!d.dontDraw) {
						legendItem
							.append("line")
							.attr("x1", 0)
							.attr("y1", 0)
							.attr("x2", 40)
							.attr("y2", 0)
							.attr("stroke", d.stroke)
							.attr("stroke-width", 4)
							.attr("stroke-dasharray", d.dashArrayScale);
					}

					let curD2 = d;
					legendItem
						.append("g")
						.append("text")
						//.attr('font-family', 'FontAwesome') // this method does not work (TT)
						.attr("class", "far")
						.attr("font-size", axisLabelFontSize * 1.1)
						.attr("x", 45)
						.attr("y", axisLabelFontSize * 0.5)
						.text(function (curD2) {
							// TRICKY: you can do a function on any variable but then use
							// curD to get the value of dontDraw
							// if you use d or curD in both places it does not work!
							//console.log("GenChart-Legend LINES - set checked or not - 4 data curD:", curD2, d);
							if (d.dontDraw === true) {
								return "\uf0c8"; // square unicode [&#xf0c8;]
							} else {
								return "\uf14a"; // check square unicode
							}
						});

					legendItem
						.append("g")
						.append("text")
						.attr("x", 67) // this moves the text to the right
						.attr("y", axisLabelFontSize * 0.5) // up and down
						.text(d.text)
						.attr("font-size", axisLabelFontSize);
				});

				// get all legend items and find the longest then set the legend container size
				const legendItems = document.querySelectorAll(`.${svgId}-legendItem`);
				//const legendItems = d3.selectAll(`${svgId}-legendItem`);
				const legendWidths = [...legendItems].map((l) => l.getBoundingClientRect().width);
				const newWidth = d3.max(legendWidths);
				legendContainer.attr("width", newWidth + 56);

				// Now center the legend container
				legendContainer.attr("x", legendContainer.attr("x") - legendContainer.attr("width") / 2);

				// Now get each legend Item Line and move those to the left
				let adjustX;
				let adjustY;
				const legendElementG = d3.selectAll(`.${svgId}-legendItem`).nodes();
				legendElementG.forEach((text) => {
					d3.select(text).attr("transform", function (d) {
						adjustX = text.transform.animVal[0].matrix.e - legendContainer.attr("width") / 2;
						adjustY = text.transform.animVal[0].matrix.f;
						//console.log(text.transform.animVal[0].matrix.e + ", " + text.transform.animVal[0].matrix.f);
						//console.log("slect transform", this, this.getAttribute("transform"), this.getAttribute("transform"));
						let newTransform = " translate(" + `${adjustX},${adjustY}` + ")"; // this.getAttribute("transform") +
						//console.log("newTransform:", newTransform);
						return newTransform; // this.getAttribute("transform") +
					});
				});

				if (legendData.length > 10) {
					const selectTenText = svg
						.append("g")
						.attr("transform", `translate(${legendTx}, ${legendTy})`)
						.append("text")
						.attr("id", "selectTenTxt")
						.attr("x", -80)
						.attr("y", -12)
						.attr("data-html2canvas-ignore", "")
						.style("fill", "black")
						.style("font-size", "17px")
						.text("Select up to 10 groups");

					// if setting the location above is not consistent,
					// then calc width of the text and place half way across container
					// minus half the width of the text
					/* 					const selTenTxt = document.querySelector(`#selectTenTxt`);
					const selTenWidth = selTenTxt.getBoundingClientRect().width;
					console.log("10width:", selTenWidth);
					console.log("10 top:", selTenTxt.getBoundingClientRect().top);
					console.log("10 left:", selTenTxt.getBoundingClientRect().left);
					console.log("legendContainer x:", legendContainer.attr("x"));
					
					d3.select(selTenTxt).attr("transform", function (d) {
						console.log("d and d.x", d);
						adjustX = selTenTxt.getBoundingClientRect().left ;
						adjustY = legendContainer.attr("y") - legendContainer.attr("width") / 2;
						adjustY = selTenTxt.getBoundingClientRect().top;
						let newTransform =  " translate(" + `${adjustX},${adjustY}` + ")"; // this.getAttribute("transform") + 
						console.log("newTransform:", newTransform);
						return newTransform; // this.getAttribute("transform") + 
					});  */
				}
			}
		}

		if (p.chartRotate) {
			// Rotation occurs around the center of the svg. The final width of the rotated svg is designed to be the
			// original height, pre-rotation. Due to css positioning of the svg, when the rotated height becomes greater than
			// the width after adding legend items, rotation changes the position of the svg off of desired center.
			// To move it back, we first get the desired location then rotate (done above), find out where it is after rotation,
			// (done here) and finally move it back(required re-rotating WITH translation at the same time).

			const newPos = $(`#${svgId}`)[0].getBoundingClientRect();
			const yAdjust = currPos.width > currPos.height ? newPos.left - currPos.left : 0;

			d3.select(`#${svgId}`).attr("transform", `rotate(90), translate(${currPos.top - newPos.top}, ${yAdjust})`);

			// finally adjust the green container height for the content of the new svg height
			$("#chart-container").css("height", newPos.height - 80);
		} else {
			$("#chart-container").css("height", $(`#${svgId}`)[0].getBoundingClientRect().height);
		}

		return {
			data: p.data,
			vizId: p.vizId,
			svg,
			svgId,
			svgHeightRatio,
			margin,
			xScale,
			svgWidth,
		};
	}
}
