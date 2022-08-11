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
import { DataCache } from "../../utils/datacache";

export class GenChart {
	constructor(providedProps) {
		this.props = getProps(providedProps);
	}

	// NOTE: ALl data sorting needs to be done on the data
	// BEFORE passing into this genChart (TT)

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

			let numToDraw = 0;
			p.data.forEach((d, i) => {
				numToDraw = DataCache.activeLegendList.filter(function (e) {
					return e.dontDraw === false;
				}).length;
			});

			if (numToDraw === 0) numToDraw = 10;

			// THe problem is I think this code always wants to force to 10 items selected
			// which is not what we need... if we start with 10 and they deselect 1 then it should be 9 obviously
			// how can we start with 10 on initial render but then have a list of 8 or 9 or 2
			// on re-render --->  NEED TO PERSIST THE LIST OF SELECTED ITEMS
			p.data.forEach((d, i) => {
				if (d.dontDraw === false && barCount < numToDraw) {
					barCount++; // increment barCount
					if (i > 9) {
						console.log(
							" ###### genChart datapt,dontDraw is False, i, barCount,maxBarCount",
							d,
							d.dontDraw,
							i,
							barCount,
							maxBarCount
						);
					}

					// PUSH only if not already on the list
					if (
						DataCache.activeLegendList.filter(function (e) {
							return e.stub_label === d.stub_label;
						}).length > 0
					) {
						// it is on the list
						// so dont push it
					} else {
						// not on there so push it
						DataCache.activeLegendList.push(d);
					}
				} else {
					// remove if it was on active list
					const tempList = DataCache.activeLegendList.filter((e) => e.stub_label !== d.stub_label);
					DataCache.activeLegendList = [];
					DataCache.activeLegendList = tempList;

					// then either dontDraw already true or needs to be set to true
					// bc bar count is exceeded
					d.dontDraw = true;
					if (i < 11) {
						console.log("genChart datapt,dontDraw set True, i, barCount", d, d.dontDraw, i, barCount);
					}
				}

				// CHANGE - if on the active list then set dontDraw = false
				// - if not on the list set it to dontDraw = true
				if (
					DataCache.activeLegendList.filter(function (e) {
						return e.stub_label === d.stub_label;
					}).length > 0
				) {
					// it is on the list
					d.dontDraw = false;
				} else {
					d.dontDraw = true;
				}
			});

			// the list below has 200-399 and NOT 133-199
			// so something is messed up

			//console.log("@@@@ SactiveLegendList:", DataCache.activeLegendList);
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

		//console.log("genChart p.data BEFORE removing dontDraw=true vals:", p.data);

		// FOR ALL CHARTS
		// (3) go ahead and filter out that dontDraw data so that scales etc. will be correct
		// - this keeps us from having to edit a LOT of code
		p.data = p.data.filter((d) => d.dontDraw === false);

		// if you need to look at incoming data
		//console.log("genChart p.data after removing dontDraw=true vals:", p.data);

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
			const splitOnColon = d.split(":").map((s) => s.trim());
			const maxLength = 24;
			const finalListOfTspan = [];

			// recursive split until string is not too long
			const splitIfTooLong = (testString) => {
				if (testString.length > maxLength) {
					const center = testString.length / 2;
					const allSpaceIndeces = [];
					let startIndex = testString.indexOf(" ");
					if (startIndex === -1) {
						finalListOfTspan.push(testString);
						return;
					}
					while (startIndex !== -1) {
						allSpaceIndeces.push(startIndex);
						startIndex = testString.indexOf(" ", startIndex + 1);
					}

					// find the index of a space " " that is closest to the middle of the string
					const closest = allSpaceIndeces.reduce(function (prev, curr) {
						return Math.abs(curr - center) < Math.abs(prev - center) ? curr : prev;
					});
					const newSplit = [testString.substring(0, closest).trim(), testString.substring(closest).trim()];
					// recursively call this function if still too long
					newSplit.forEach((ns) => splitIfTooLong(ns));
				} else finalListOfTspan.push(testString);
			};

			splitOnColon.forEach((s) => {
				splitIfTooLong(s);
			});

			let el = d3.select(this);
			el.text("")
				.attr("dy", 0) // dy was set by d3 when creating the axis label, set it to 0
				.attr(
					"transform",
					`translate(-5, ${-(finalListOfTspan.length / 2 + 0.3) * p.labelPaddingScale * axisLabelFontSize})`
				);

			finalListOfTspan.forEach((ts, i) => {
				el.append("tspan")
					.text(ts)
					.attr("x", 0)
					.attr("y", (i + 1) * p.labelPaddingScale * axisLabelFontSize);
			});
		};

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
		const xAxisTitleSize = p.usesXAxisTitle * axisTitleSize; //
		const bottomAxisScale = p.usesTwoLineXAxisLabels && svgHeightRatio !== 0.5 ? 2 : 1;

		// setup margins, widths, and heights
		let marginTB = 20;
		const margin = {
			top: p.usesTopAxis ? marginTB + (axisSize + xAxisTitleSize) * p.labelPaddingScale : marginTB,
			right: d3.max([rightTitleSize + rightAxisSize, p.marginRightMin * overallScale]),
			bottom: p.usesBottomAxis ? marginTB + (axisSize + xAxisTitleSize) * p.labelPaddingScale : marginTB,
			left: d3.max([leftTitleSize + leftAxisSize, p.marginLeftMin + 15]),
		};

		const xMargin = margin.left + margin.right;
		const yMargin = margin.top + margin.bottom;

		const svgWidth = fullSvgWidth * svgScale;
		const chartWidth = svgWidth - xMargin;
		let svgHeight = svgWidth * svgHeightRatio;
		let chartHeight = svgHeight - yMargin;

		if (p.barLayout?.horizontal) {
			chartHeight = p.data.length * p.barLayout.size + 0.3 * p.barLayout.size;
			svgHeight = yMargin + chartHeight;
		}

		// get chart x and y centers
		const halfXMargins = xMargin / 2;
		const halfWidth = svgWidth / 2;
		const chartCenterX = halfWidth + margin.left - halfXMargins;

		const halfYMargins = yMargin / 2;
		const halfHeight = svgHeight / 2;
		const chartCenterY = halfHeight + margin.top - halfYMargins;

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

		if (p.barLayout?.horizontal) {
			xScale = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(p.data, (d) =>
						d3.max([
							d[p.chartProperties.bars],
							p.enableCI ? parseFloat(d.estimate_uci) : 0, // (TT) keeps CI whiskers inside chart by adding UCI to this max calc
						])
					) * p.leftDomainOverageScale,
				])
				.range([0, chartWidth]);
		} else if (p.firefoxReversed === true) {
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

		let yScaleLeft;

		if (p.barLayout && p.barLayout.horizontal) {
			yScaleLeft = d3.scaleBand().range([chartHeight, 0]).paddingInner(0.15).paddingOuter(0.15);
		} else {
			yScaleLeft = yScaleType
				.domain(
					p.leftDomain || [
						yScaleExtent[0],
						d3.max(p.data, (d) =>
							d3.max([
								p.leftDomainMin,
								d[p.chartProperties.yLeft1],
								d[p.chartProperties.yLeft2],
								d[p.chartProperties.yLeft3],
								d[p.chartProperties.bars],
								p.enableCI ? parseFloat(d.estimate_uci) : 0, // (TT) keeps CI whiskers inside chart by adding UCI to this max calc
							])
						) * p.leftDomainOverageScale,
					]
				)
				.range([chartHeight, 0]);
		}

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
		let xAxisType;

		if (p.barLayout?.horizontal) xAxisType = d3.axisTop(xScale);
		else xAxisType = d3.axisBottom(xScale);

		const xAxis = xAxisType
			.tickSize(3)
			.tickSizeOuter(5)
			.tickSizeInner(5)
			.tickFormat((drawData) => genFormat(drawData, p.formatXAxis));

		const yAxisLeft = d3.axisLeft(yScaleLeft).tickSize(3).tickSizeInner(-chartWidth); //.ticks(p.leftTickCount);
		// .tickFormat((drawData) => genFormat(drawData, p.formatYAxisLeft)); // this is what sets the tick labels
		// but where do we rotate them???

		if (p.left1ScaleType === "log") yAxisLeft.tickValues(yLeft1TickValues);

		const yAxisRight = d3
			.axisRight(yScaleRight)
			.tickSize(3)
			.ticks(p.rightTickCount)
			.tickFormat((drawD) => genFormat(drawD, p.formatYAxisRight));

		const svg = viz.append("svg").attr("id", svgId).attr("viewBox", [0, 0, svgWidth, svgHeight]);

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
			if (p.usesBottomAxis || p.usesTopAxis) {
				xAxisDraw = svg
					.append("g")
					.attr("class", "axis bottom")
					.attr(
						"transform",
						`translate(${margin.left}, ${p.barLayout?.horizontal ? margin.top : margin.top + chartHeight})`
					);
			}

			// left yAxis
			// debugger;
			let leftAxisDraw;
			if (p.usesLeftAxis) {
				leftAxisDraw = svg
					.append("g")
					.attr("class", "y axis left")
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
					.call(yAxisLeft);
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
			if (p.usesXAxisTitle) {
				const axisTitle = svg
					.append("text")
					.text(p.barLayout.horizontal ? $("#unit-num-select-chart :selected").text() : p.bottomAxisTitle)
					.attr("text-anchor", "middle")
					.attr("font-size", axisTitleFontSize)
					.attr("x", chartCenterX)
					.attr(
						"y",
						!p.usesBottomAxis
							? 1.5 * xAxisTitleSize
							: margin.top + chartHeight + (axisSize + xAxisTitleSize * 1.5)
					);

				if (p.barLayout?.horizontal) axisTitle.attr("data-html2canvas-ignore", "");
			}

			// left yAxis
			// for LINE chart
			if (p.usesLeftAxisTitle) {
				svg.append("text")
					.text(p.barLayout.horizontal ? "" : $("#unit-num-select-chart :selected").text())
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("x", -chartCenterY) // up and down bc rotated  - (TT) removed the adjust value centered it
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
				let numLinesToDraw = 0;
				fullNestedData.forEach((d, i) => {
					numLinesToDraw = DataCache.activeLegendList.filter(function (e) {
						return e.dontDraw === false;
					}).length;

					// set all data to dontDraw == true
					d.dontDraw = true; // disable ALL
				});

				if (numLinesToDraw === 0) numLinesToDraw = 10;

				// iterate through and set the dontDraw values based on activeLegendList
				let numSetToDraw = 0;
				fullNestedData.forEach((d, i) => {
					if (
						DataCache.activeLegendList.filter(function (e) {
							return e.stub_label === d.values[0].stub_label;
						}).length > 0
					) {
						// it is on the list
						d.values[0].dontDraw = false;
						numSetToDraw++;
					} else {
						d.values[0].dontDraw = true;
					}
				});

				// otherwise it might draw nothing
				if (numSetToDraw === 0) {
					// then select 10 to draw
					fullNestedData.forEach((d, i) => {
						if (numSetToDraw < numLinesToDraw) {
							// it is on the list
							d.values[0].dontDraw = false;
							numSetToDraw++;
						}
					});
				}

				// NOW WE CAN deal with the legend and whether the lines are drawn
				fullNestedData.forEach((d, i) => {
					if (d.values[0].dontDraw === false && lineCount < numLinesToDraw) {
						lineCount++; // increment barCount

						// PUSH only if not already on the list
						if (
							DataCache.activeLegendList.filter(function (e) {
								return e.stub_label === d.values[0].stub_label;
							}).length > 0
						) {
							// it is on the list
							// so dont push it
							//console.log("ALREADY on the list",d.values[0].stub_label);
						} else {
							// not on there so push it 8/2/2022

							// the line after this is pushing the wrong object
							DataCache.activeLegendList.push(d.values[0]);
						}
					} else {
						// remove if it was on active list
						const tempList = DataCache.activeLegendList.filter(
							(e) => e.stub_label !== d.values[0].stub_label
						);
						DataCache.activeLegendList = [];
						DataCache.activeLegendList = tempList;

						// then either dontDraw already true or needs to be set to true
						// bc bar count is exceeded
						d.values[0].dontDraw = true;
						if (i < 11) {
							//console.log("genChart datapt,dontDraw set True, i, barCount", d, d.dontDraw, i, barCount);
						}
					}

					// CHANGE - if on the active list then set dontDraw = false
					// - if not on the list set it to dontDraw = true
					if (
						DataCache.activeLegendList.filter(function (e) {
							return e.stub_label === d.values[0].stub_label;
						}).length > 0
					) {
						// it is on the list
						d.values[0].dontDraw = false;
					} else {
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

				// debugger;
				if (p.needsScaleTime) {
					let minReported = sortedXValues[0];
					let maxReported = [...sortedXValues.slice(-1)][0];
					minReported.setDate(minReported.getDate() - 1); // these tweaks move the points off of the edges, to not end up on the axis
					maxReported.setDate(maxReported.getDate() + 1);
					xScale.domain([minReported, maxReported]).nice();
				} else if (p.barLayout.horizontal) {
					yScaleLeft.domain(data.map((d) => d[p.chartProperties.yLeft1]));
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
								const hz = p.barLayout.horizontal;
								enter
									.append("rect")
									.attr("class", "hover-bar")
									.attr(
										"width",
										hz
											? (d) =>
													xScale(xScale.domain().slice(-1)) -
													xScale(d[p.chartProperties.bars])
											: xScale.bandwidth()
									)
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
									.attr(
										"height",
										hz
											? p.barLayout.size * 0.9
											: (d) => chartHeight - yScaleLeft(d[p.chartProperties.yLeft1])
									)
									.attr("x", (d) => xScale(d[p.chartProperties.bars]))
									.attr("fill", "black")
									.attr("opacity", "0");
							},
							(update) => {
								const hz = p.barLayout.horizontal;
								update
									.attr("x", (d) => xScale(d[p.chartProperties.bars]))
									.attr(
										"width",
										hz
											? (d) =>
													xScale(xScale.domain().slice(-1)) -
													xScale(d[p.chartProperties.bars])
											: xScale.bandwidth()
									);
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
								const hz = p.barLayout.horizontal;
								enter
									.append("rect")
									.attr("class", "bar")
									.attr("width", hz ? (d) => xScale(d[p.chartProperties.bars]) : xScale.bandwidth())
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
									.attr(
										"height",
										hz
											? p.barLayout.size * 0.9
											: (d) => chartHeight - yScaleLeft(d[p.chartProperties.yLeft1])
									)
									.attr("x", hz ? 0 : (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
									.attr("opacity", 0.85);
							},
							(update) => {
								const hz = p.barLayout.horizontal;
								update
									.attr("width", hz ? (d) => xScale(d[p.chartProperties.bars]) : xScale.bandwidth())
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
									.attr(
										"height",
										hz
											? p.barLayout.size * 0.9
											: (d) => chartHeight - yScaleLeft(d[p.chartProperties.yLeft1])
									)
									.attr("x", hz ? 0 : (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.yLeft1]));
							},
							(exit) => {
								exit.remove();
							}
						);

					// DRAW CI WHISKERS FOR BAR CHART
					if (p.enableCI) {
						const whiskerOffset = yScaleLeft.bandwidth() / 2 + margin.top;
						drawData.forEach((d, i) => {
							const CIBarId = "CIBar" + i;
							svg.append("line")
								.datum(d)
								.attr("class", `${svgId}-CIBarItem`)
								.attr("id", CIBarId)
								.attr("y1", (d) => yScaleLeft(d[p.chartProperties.yLeft1]) + whiskerOffset)
								.attr("y2", (d) => yScaleLeft(d[p.chartProperties.yLeft1]) + whiskerOffset)
								.attr("x1", (d) => xScale(d.estimate_lci) + margin.left)
								.attr("x2", (d) => xScale(d.estimate_uci) + margin.left)
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

				const offset = p.needsScaleTime || p.barLayout.horizontal ? 0 : xScale.bandwidth() / 2; // the alignment value for line/ellipse position to bar positions

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
				if (p.barLayout?.horizontal) {
					leftAxisDraw.call(yAxisLeft);
					d3.selectAll(`#${svgId} .y.axis.left text`).each(insertLinebreaks);
				}

				xAxisDraw.call(xAxis);

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

			if (p.barLayout?.horizontal) {
				d3.selectAll(`#${svgId} .left .tick line`).attr("stroke", p.leftAxisColor).attr("opacity", 0);
			} else {
				d3.selectAll(`#${svgId} .left .tick line`).attr("stroke", p.leftAxisColor).attr("opacity", 0.4);
			}

			genTooltip.render();
		}

		// DRAW LEGEND FOR NON-ROTATED CHARTS
		if (p.usesLegend) {
			// FOR ASSIGNED LEGEND COLOR TO WORK, LEGEND HAS TO BE DRAWN
			// AFTER THE GRAPH HAS BEEN DRAWN WHETHER LINE OR BAR CHART
			// - therefore all legend drawing must be moved to the END
			// of this code

			// ONLY SORT DATA PASSED INTO GENCHART - DONT SORT IN HERE
			// now sort by stub_label_num
			/* 				fullNestedData.sort((a, b) => {
					return a.values[0].stub_label_num - b.values[0].stub_label_num;
				}); */

			if (p.usesMultiLineLeftAxis && fullNestedData && fullNestedData[0].key) {
				// ALL nests go on the legend but only draw those that are set to dontDraw = false
				fullNestedData.forEach((d, i) => {
					//console.log("fullnestdata d,i,color:", d, i, d.values[0].assignedLegendColor);
					legendData[i] = {
						stroke: d.values[0].assignedLegendColor,
						dashArrayScale: p.left1DashArrayScale,
						text: d.key,
						dontDraw: d.values[0].dontDraw,
						stub_label_num: d.stub_label_num,
					};
				});
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
			} else if (p.usesBars) {
				allIncomingData.forEach((d, i) => {
					legendData[i] = {
						stroke: d.assignedLegendColor, //  p.barColors[i] -> WRITE FUNCTIN TO RETURN BAR COLOR FROM DRAWN BAR
						dashArrayScale: 0,
						text: d.stub_label,
						dontDraw: d.dontDraw,
					};
				});
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
			svg.attr("viewBox", [0, 0, svgWidth, svgHeight + legendHeight + 30]);
			svg.select("#whitebox").attr("height", svgHeight + legendHeight + 30);

			// start the left-edge translation of everything in the legend at the center of the chart area
			// it will be moved, once drawn, by setting 'x' after
			const legendTx = (svgWidth + margin.left) / 2;
			const legendTy = legendData.length > 10 ? svgHeight + 20 : svgHeight;

			const legendContainer = svg
				.append("g")
				.attr("transform", `translate(${legendTx}, ${legendTy})`)
				.append("rect")
				.attr("id", `${svgId}-chart-legend`)
				// .attr("data-html2canvas-ignore", "")
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
					.attr("style", "cursor: default")
					.attr("id", legendId)
					//.attr("data-html2canvas-ignore", "")
					.attr(
						"transform",
						`translate(${legendTx + axisLabelFontSize / 2},
								${legendTy + 1.1 * axisLabelFontSize * (i + 1)})`
					);

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

				legendItem
					.append("g")
					.append("text")
					.attr("class", "far")
					.attr("font-size", axisLabelFontSize * 1.1)
					.attr("x", 45)
					.attr("y", axisLabelFontSize * 0.5)
					.text(function () {
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
			const newWidth = d3.max(legendWidths) ?? 0;
			legendContainer.attr("width", newWidth + 56);

			// Now center the legend container
			legendContainer.attr("x", legendContainer.attr("x") - legendContainer.attr("width") / 2);

			// Now get each legend Item Line and move those to the left
			let adjustX;
			let adjustY;
			const legendElementG = d3.selectAll(`.${svgId}-legendItem`).nodes();
			legendElementG.forEach((text) => {
				d3.select(text).attr("transform", () => {
					adjustX = text.transform.animVal[0].matrix.e - legendContainer.attr("width") / 2;
					adjustY = text.transform.animVal[0].matrix.f;
					let newTransform = `translate(${adjustX}, ${adjustY})`;
					return newTransform;
				});
			});

			if (legendData.length > 10) {
				svg.append("g")
					.attr("transform", `translate(${legendTx}, ${legendTy})`)
					.append("text")
					.attr("id", "selectTenTxt")
					.attr("x", -80)
					.attr("y", -12)
					.attr("data-html2canvas-ignore", "")
					.style("fill", "black")
					.style("font-size", "17px")
					.text("Select up to 10 groups");
			}
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
