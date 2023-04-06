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

export class GenChart {
	constructor(providedProps) {
		this.props = getProps(providedProps);
		this.subGroups = providedProps.subGroups;
	}

	render() {
		const p = this.props;

		const genTooltip = new GenTooltip(p.genTooltipConstructor);
		let legendData = [];
		let multiLineColors;
		if (!p.usesBars) {
			multiLineColors = d3.scaleOrdinal(p.multiLineColors);
		}
		let fullNestedData;

		let needReliabilityCallout = false;

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

		// inserts line breaks where every : is in the Group on the bar left axis
		let longestLabelSegmentLength = 0;
		let measured = false;
		const maxLabelLength = 24;
		const insertLineBreaks = function (d) {
			const splitOnColon = d
				.toString()
				.split(":")
				.map((s) => s.trim());
			const finalListOfTspan = [];

			// recursive split until string is not too long
			const splitIfTooLong = (testString) => {
				if (testString.length > maxLabelLength) {
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

			if (measured) {
				let el = d3.select(this);
				el.text("")
					.attr("dy", 0) // dy was set by d3 when creating the axis label, set it to 0
					.attr(
						"transform",
						`translate(-5, ${
							-(finalListOfTspan.length / 2 + 0.3) * p.labelPaddingScale * axisLabelFontSize
						})`
					);

				finalListOfTspan.forEach((ts, i) => {
					el.append("tspan")
						.text(ts)
						.attr("x", 0)
						.attr("y", (i + 1) * p.labelPaddingScale * axisLabelFontSize);
				});
				return;
			}

			longestLabelSegmentLength = Math.max(
				longestLabelSegmentLength,
				Math.max(...finalListOfTspan.map((f) => f.length))
			);
		};

		// some unit titles are too long for mobile ... split text to draw on 2 lines only when yAxis space is too small to fit on one line
		const splitTitle = function (testString, spaceAvailable, fontSize) {
			// estimate does not account for non mono-spaced font
			const estimatedStringLength = testString.length * fontSize;
			if (estimatedStringLength > 0.9 * spaceAvailable) {
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
				return newSplit;
			}
			return [testString, ""];
		};

		const svgId = `${p.vizId}-svg`;

		// setup fontSizes

		// create a non-displayed div to get size of one rem as decimal value
		const viz = d3.select(`#${p.vizId}`);
		const remDiv = viz.append("div").attr("line-height", "1rem").attr("display", "none");
		const rem = parseFloat(remDiv.style("line-height"), 10);

		// these 4 params keeps everything sized/positioned correctly regardless of screen resolution
		const { fullSvgWidth, overallScale, svgHeightRatio, svgScale } = getGenSvgScale(p.vizId);

		const symbolSize = fullSvgWidth / 6;
		const symbols = [
			d3.symbol().type(d3.symbolCircle).size(symbolSize),
			d3.symbol().type(d3.symbolSquare).size(symbolSize),
			d3.symbol().type(d3.symbolTriangle).size(symbolSize),
			d3.symbol().type(d3.symbolDiamond).size(symbolSize),
			d3.symbol().type(d3.symbolStar).size(symbolSize),
			d3.symbol().type(d3.symbolCross).size(symbolSize),
			d3.symbol().type(d3.symbolWye).size(symbolSize),
		];

		const chartTitleFontSize = overallScale * p.chartTitleFontScale * rem;
		let axisTitleFontSize = overallScale * p.axisTitleFontScale * rem;
		// this scaling often makes the title sizes too big on Mobile

		if (axisTitleFontSize > 18) axisTitleFontSize = 18;
		if (appState.currentDeviceType === "mobile" && axisTitleFontSize > 14) axisTitleFontSize = 14;

		let axisLabelFontSize = overallScale * p.axisLabelFontScale * rem;
		// this scaling makes the label sizes too big
		if (axisLabelFontSize > 16) {
			// knock it back down
			axisLabelFontSize = 16;
		}

		// loop through all y-axis tick labels to find the longest string
		// this works whether we need to consider splitting the string to multiple lines (bar chart) or not (line chart)
		// rendering the values by two-sig-fig magnitude format seems to work fine for strings too
		// scaling the length by power of 0.75 seems to make short and long segments get appropriate margin space
		p.data.map((d) => genFormat(d[p.chartProperties.yLeft1], "magnitudeTwoSF")).forEach((d) => insertLineBreaks(d));

		p.yLeftLabelScale = longestLabelSegmentLength ** 0.75; // scaling the
		measured = true; // setting this to true allows the insertLineBreaks function to ignore trying to create tspans until after the tick labels are created

		let splitText = [];
		let leftTitleScale = 1;
		if (p.usesLeftAxisTitle) {
			// with bigger font size - always split the left axis title
			splitText = splitTitle(
				$("#estimateTypeDropdown-select > a").text(),
				fullSvgWidth * svgHeightRatio,
				axisLabelFontSize
			);
			if (splitText[1]) leftTitleScale = 2;
		}

		// setup chart labels and title sizes
		// assumption is made that there are always left and bottom axis labels
		// but not always titles

		const chartTitleSize = p.usesChartTitle * p.labelPaddingScale * chartTitleFontSize;

		const axisTitleSize = p.labelPaddingScale * axisTitleFontSize;
		const axisSize = p.labelPaddingScale * axisLabelFontSize;
		const rightTitleSize = p.usesRightAxisTitle * axisTitleSize;
		const leftAxisSize = p.usesLeftAxis * axisSize * p.yLeftLabelScale;
		const rightAxisSize = p.usesRightAxis * axisSize * p.yRightLabelScale;
		const leftTitleSize = p.usesLeftAxisTitle * axisTitleSize * leftTitleScale;
		const xAxisTitleSize = p.usesXAxisTitle * axisTitleSize;
		const bottomAxisScale = p.usesTwoLineXAxisLabels && svgHeightRatio !== 0.5 ? 2 : 1;

		// setup margins, widths, and heights
		let marginTB = 20;
		const margin = {
			top: p.usesTopAxis ? marginTB + (axisSize + xAxisTitleSize * 2) * p.labelPaddingScale : marginTB,
			right: d3.max([rightTitleSize + rightAxisSize, p.marginRightMin * overallScale]),
			bottom: p.usesBottomAxis ? marginTB + (axisSize + xAxisTitleSize) * p.labelPaddingScale : marginTB,
			left: d3.max([leftTitleSize + leftAxisSize, p.marginLeftMin]),
		}; // top margin * 2 is to fit the split title onto 2 lines at top for bar charts

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
				.style("text-align", "center")
				.style("clear", "both")
				.attr("id", `${p.vizId}-chartTitle`)
				.text(p.chartTitle);

			if ($(`#${p.vizId}-chartTitle`).height() > chartTitleSize * 1.1) title.style("text-align", "left");

			const titleDims = $("#chart-container-chartTitle")[0].getBoundingClientRect();
			const titleCenter = (titleDims.right - titleDims.left) / 2;
			title.style("transform", `translateX(${chartCenterX - titleCenter}px`);
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
			yScaleLeft = d3.scaleBand().range([0, chartHeight]).paddingInner(0.15).paddingOuter(0.15);
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

		// if horizontal bar chart, move axis to top
		if (p.barLayout?.horizontal) xAxisType = d3.axisTop(xScale);
		else xAxisType = d3.axisBottom(xScale);

		const xAxis = xAxisType
			.tickSize(3)
			.tickSizeOuter(5)
			.tickSizeInner(5)
			.tickFormat((d, i) => {
				if (appState.currentDeviceType === "mobile") {
					return i % 2 !== 0 ? " " : genFormat(d, p.formatXAxis);
				}
				return genFormat(d, p.formatXAxis);
			});

		let yAxisNumTicks = 10;
		if (!p.usesBars) yAxisNumTicks = yScaleLeft.ticks().length;
		const yAxisLeft = d3
			.axisLeft(yScaleLeft)
			.tickSize(3)
			.tickSizeInner(-chartWidth)
			.tickFormat((d, i) => {
				if (appState.currentDeviceType === "mobile") {
					if (yAxisNumTicks > 10) {
						// draw only every other label if large number of ticks
						return i % 2 !== 0 ? " " : genFormat(d, p.formatYAxisLeft);
					}
					// draw every label
					return genFormat(d, p.formatYAxisLeft);
				}
				// for desktop always draw every tick label
				return genFormat(d, p.formatYAxisLeft);
			});

		if (p.left1ScaleType === "log") yAxisLeft.tickValues(yLeft1TickValues);

		const yAxisRight = d3
			.axisRight(yScaleRight)
			.tickSize(3)
			.ticks(p.rightTickCount)
			.tickFormat((drawD) => genFormat(drawD, p.formatYAxisRight));

		const svg = viz
			.append("svg")
			.attr("id", svgId)
			.attr("class", "general-chart")
			.attr("viewBox", [0, 0, svgWidth, svgHeight]);

		if (!p.data.length) {
			// line chart
			svg.append("text")
				.text(p.noDataMessage)
				.attr("text-anchor", "middle")
				.attr("font-size", axisTitleFontSize)
				.attr("x", chartCenterX)
				.attr("y", p.usesBars ? chartCenterY - 20 : chartCenterY);

			// note if we have no data, genChart still tries to build the bar chart legend
		} else {
			// append the axes
			// xAxis
			let xAxisDraw;
			if (p.usesBottomAxis || p.usesTopAxis) {
				xAxisDraw = svg
					.append("g")
					.attr("class", "axis bottom")
					.attr("id", "xaxis")
					.attr(
						"transform",
						`translate(${margin.left}, ${p.barLayout?.horizontal ? margin.top : margin.top + chartHeight})`
					);
			}

			// left yAxis
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
				let splitBarTitle = [];
				const title = p.barLayout.horizontal ? $("#estimateTypeDropdown-select > a").text() : p.bottomAxisTitle;

				// split the title, based on title length vs space available
				splitBarTitle = splitTitle(title, chartWidth, axisLabelFontSize);

				svg.append("text")
					.text(splitBarTitle[0])
					.attr("text-anchor", "middle")
					.attr("id", "topAxisTitle0")
					.attr("font-size", axisTitleFontSize)
					.attr("font-weight", 600) // make axis title bold
					.attr("x", chartCenterX)
					.attr(
						"y",
						!p.usesBottomAxis
							? 1.5 * xAxisTitleSize
							: margin.top + chartHeight + (axisSize + xAxisTitleSize * 1.5)
					);

				// for bar chart and MOBILE, then draw 2nd line HERE
				if (splitBarTitle[1]) {
					svg.append("text")
						.text(splitBarTitle[1])
						.style("text-anchor", "middle")
						.attr("id", "topAxisTitle1")
						.attr("font-size", axisTitleFontSize)
						.attr("font-weight", 600)
						.attr("x", chartCenterX)
						.attr(
							"y",
							!p.usesBottomAxis
								? 2.5 * xAxisTitleSize
								: margin.top + chartHeight + (axisSize + xAxisTitleSize * 2.5)
						);
					svgHeight += xAxisTitleSize;
				}
			}

			// left yAxis
			// for LINE chart
			if (p.usesLeftAxisTitle) {
				svg.append("text")
					.text(p.barLayout.horizontal ? "" : splitText[0])
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("id", "leftAxisTitle")
					.attr("x", -chartCenterY) // up and down bc rotated  - (TT) removed the adjust value centered it
					.attr("y", axisTitleSize / p.labelPaddingScale + 2) // dist to edge
					.attr("font-size", axisTitleFontSize)
					.attr("font-weight", 600) // make titles bold
					.attr("fill", p.leftAxisColor);

				// if the second item in splitText !== ""
				if (splitText[1]) {
					svg.append("text")
						.text(p.barLayout.horizontal ? "" : splitText[1])
						.style("text-anchor", "middle")
						.attr("transform", "rotate(-90)")
						.attr("id", "leftAxisTitle")
						.attr("x", -chartCenterY) // up and down bc rotated  - (TT)  removed the adjust value centered it
						.attr("y", 2 * (axisTitleSize / p.labelPaddingScale) + 2) // move in 2nd line
						.attr("font-size", axisTitleFontSize)
						.attr("font-weight", 600)
						.attr("fill", p.leftAxisColor);
				}
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
				const hatchSize = 10; // 8px of color, 2px of whitespace, rotated 30 degrees, as defined below...
				p.barColors.forEach((c, i) => {
					svg.append("defs")
						.append("pattern")
						.attr("id", `diagonalHatch-${i}`)
						.attr("patternUnits", "userSpaceOnUse")
						.attr("width", hatchSize * 0.8)
						.attr("height", hatchSize)
						.attr("patternTransform", "rotate(30)")
						.append("rect")
						.attr("width", hatchSize / 2)
						.attr("height", hatchSize)
						.attr("fill", c);
				});

				bars = svg
					.append("g")
					.attr("class", "bars")
					.attr("transform", `translate(${margin.left}, ${margin.top})`);
			}

			let noDataTextGroup;
			if (p.usesBars && p.barLayout.horizontal) {
				noDataTextGroup = svg
					.append("g")
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
					.attr("pointer-events", "none")
					.attr("text-anchor", "left");
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
			if (p.usesMultiLineLeftAxis) {
				const hatchSize = 8; // 8px of color, 2px of whitespace, rotated 30 degrees, as defined below...
				p.multiLineColors.forEach((c, i) => {
					svg.append("defs")
						.append("pattern")
						.attr("id", `diagonalHatch-${i}`)
						.attr("patternUnits", "userSpaceOnUse")
						.attr("width", hatchSize * 0.8)
						.attr("height", hatchSize)
						.attr("patternTransform", "rotate(30)")
						.append("rect")
						.attr("width", hatchSize / 2)
						.attr("height", hatchSize)
						.attr("fill", c);
				});

				fullNestedData = d3
					.nest()
					.key((d) => d[p.multiLineLeftAxisKey])
					.entries(p.data);

				fullNestedData.forEach((nd, i) => {
					lines[i] = d3.line().defined((d) => d.estimate);
					const lineGroup = svg
						.append("g")
						.attr("class", nd.key.replace(/[\W_]+/g, ""))
						.attr("transform", `translate(${margin.left}, ${margin.top})`);

					lineGroups[i] = lineGroup;

					nd.values[0].assignedLegendColor = multiLineColors(i);

					lineGroupPaths[i] = lineGroups[i]
						.append("path")
						.attr("fill", "none")
						.attr("stroke", multiLineColors(i))
						.attr("stroke-width", 2);
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
				let sortedXValues = data.map((d) => d[p.chartProperties.xAxis]).sort((a, b) => a - b);

				if (p.needsScaleTime) {
					let minReported = sortedXValues[0];
					let maxReported = [...sortedXValues.slice(-1)][0];
					minReported.setDate(minReported.getDate() - 1); // these tweaks move the points off of the edges, to not end up on the axis
					maxReported.setDate(maxReported.getDate() + 1);
					xScale.domain([minReported, maxReported]).nice();
				} else if (p.barLayout.horizontal) {
					yScaleLeft.domain(data.map((d) => d[p.chartProperties.yLeft1]));
				} else {
					sortedXValues = data.map((d) => d[p.chartProperties.xAxis]).sort((a, b) => a.localeCompare(b));
					xScale.domain(sortedXValues.map((d) => d));
				}

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
											? (d) => {
													const end = xScale(xScale.domain().slice(-1));
													const start = xScale(d[p.chartProperties.bars]) ?? 0;
													return end - start;
											  }
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
									.attr("fill", (d, i) => {
										const unreliable = d.flag && d.flag !== "N/A";
										return unreliable ? `url(#diagonalHatch-${i})` : p.barColors[i];
									})
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
					const barDataValues = p.data.map((d) => d.stub_label);
					let lineIndex = 0;
					this.subGroups.forEach((legendItem, i) => {
						if (barDataValues.includes(legendItem)) {
							d3.select(`#legendItem-${i}`)
								.append("svg")
								.attr("width", 24)
								.attr("height", 12)
								.append("rect")
								.attr("width", 24)
								.attr("height", 10)
								.attr("transform", "translate(0, -1)")
								.style("fill", p.barColors[lineIndex])
								.style("opacity", 0.85);
							lineIndex++;
						}
					});

					bars.selectAll("rect")
						.data(p.data)
						.join(
							(enter) => {
								const hz = p.barLayout.horizontal;
								enter
									.append("rect")
									.attr("class", "bar")
									.attr("width", hz ? (d) => xScale(d[p.chartProperties.bars]) : xScale.bandwidth())
									.attr("fill", (d, i) => {
										if (p.barColors) {
											d.assignedLegendColor = p.barColors[i];
											const unreliable = d.flag && d.flag !== "N/A";
											if (unreliable) {
												needReliabilityCallout = true;
												$(".unreliableNote").show();
												$(".unreliableFootnote").show();
											}
											return unreliable ? `url(#diagonalHatch-${i})` : p.barColors[i];
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
											return d.flag && d.flag !== "N/A"
												? `url(#diagonalHatch-${i})`
												: p.barColors[i];
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
						p.data.forEach((d, i) => {
							const CIBarId = "CIBar" + i;
							svg.append("line")
								.datum(d)
								.attr("class", `${svgId}-CIBarItem`)
								.attr("id", CIBarId)
								.attr("y1", (d) => yScaleLeft(d[p.chartProperties.yLeft1]) + whiskerOffset)
								.attr("y2", (d) => yScaleLeft(d[p.chartProperties.yLeft1]) + whiskerOffset)
								.attr("x1", (d) => xScale(d.estimate_lci) + margin.left)
								.attr("x2", (d) => xScale(d.estimate_uci) + margin.left)
								.attr("stroke", "#333")
								.attr("stroke-width", 3);
						});
					}

					if (p.barLayout.horizontal) {
						noDataTextGroup
							.selectAll("noDataText1")
							.data(p.data)
							.enter()
							.append("text")
							.text((d) => (!d[p.chartProperties.bars] ? "No data available" : ""))
							.attr("fill", "#333")
							.attr("font-size", axisLabelFontSize)
							.attr("x", xScale(xScale.domain().slice(-1) * 0.01))
							.attr(
								"y",
								(d) =>
									yScaleLeft(d[p.chartProperties.yLeft1]) +
									p.barLayout.size / 2 -
									axisLabelFontSize * 0.6
							);

						noDataTextGroup
							.selectAll("noDataText2")
							.data(p.data)
							.enter()
							.append("text")
							.text((d) => (!d[p.chartProperties.bars] ? "for current selections" : ""))
							.attr("fill", "#333")
							.attr("font-size", axisLabelFontSize)
							.attr("x", xScale(xScale.domain().slice(-1) * 0.01))
							.attr(
								"y",
								(d) =>
									yScaleLeft(d[p.chartProperties.yLeft1]) +
									p.barLayout.size / 2 +
									axisLabelFontSize * 0.6
							);
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
					p.numberOfEquallySpacedDates = p.data.length + 1;
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
					const nestedDataValues = nestedData.map((d) => d.key);
					let lineIndex = 0;
					this.subGroups.forEach((legendItem, i) => {
						if (nestedDataValues.includes(legendItem)) {
							d3.select(`#legendItem-${i}`)
								.append("svg")
								.attr("width", 24)
								.attr("height", 24)
								.append("path")
								.attr("class", "symbolPoints")
								.attr("transform", `translate(12, 12)`)
								.style("fill", multiLineColors(lineIndex))
								.attr("d", symbols[lineIndex])
								.style("opacity", 0.85);
							lineIndex++;
						}
					});

					nestedData.forEach((nd, i) => {
						lines[i]
							.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
							.y((d) => yScaleLeft(d[p.chartProperties.yLeft1]))
							.curve(d3.curveCatmullRom);

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
										.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
										.y0((d) => yScaleLeft(d.estimate_lci))
										.y1((d) => yScaleLeft(d.estimate_uci))
										.curve(d3.curveCatmullRom)
								);
						}

						lineGroupPaths[i].attr("d", lines[i](nd.values));
						lineGroups[i]
							.selectAll("p")
							.data(nd.values, (d) => d[p.chartProperties.xAxis])
							.join(
								(enter) => {
									enter
										.append("ellipse") // adding hover over ellipses
										.filter((d) => d.estimate)
										.style("fill", multiLineColors(i))
										.attr("cx", (d) => xScale(d[p.chartProperties.xAxis]) + offset)
										.attr("cy", (d) => yScaleLeft(d[p.chartProperties.yLeft1]))
										.attr("rx", d3.max([5, offset]))
										.attr("ry", d3.max([5, d3.min([offset, 15])]))
										.style("opacity", 0); // this makes it invisible
									enter
										.append("path")
										.attr("class", "symbolPoints")
										.attr("d", symbols[i])
										.attr("transform", (d) => {
											return `translate(${
												xScale(d[p.chartProperties.xAxis]) + offset
											}, ${yScaleLeft(d[p.chartProperties.yLeft1])})`;
										})
										.attr("stroke", (d) =>
											d.flag !== undefined && d[p.chartProperties.yLeft1]
												? multiLineColors(i)
												: "white"
										)
										.style("fill", (d) => {
											const unreliable = d.flag && d.flag !== "N/A";
											if (unreliable) {
												needReliabilityCallout = true;
												$(".unreliableNote").show();
												$(".unreliableFootnote").show();
											}
											const hasValue = d[p.chartProperties.yLeft1];
											return !hasValue
												? "white"
												: unreliable
												? `url(#diagonalHatch-${i})`
												: multiLineColors(i);
										})
										.style("opacity", 0.85);
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
					});
				}

				leftLine1
					.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
					.y((d) => yScaleLeft(d[p.chartProperties.yLeft1]))
					.curve(d3.curveCatmullRom);

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
					.y((d) => yScaleLeft(d[p.chartProperties.yLeft2]))
					.curve(d3.curveCatmullRom);

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
						.y((d) => yScaleLeft(d[p.chartProperties.yLeft3]))
						.curve(d3.curveCatmullRom);

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
					.y((d) => yScaleRight(d[p.chartProperties.yRight]))
					.curve(d3.curveCatmullRom);

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
					if (p.needsScaleTime) {
						// uses single years
						if (appState.currentDeviceType === "desktop") {
							xAxis
								.ticks(d3.timeYear.every(1))
								// Show all tick marks but labels every other tick
								.tickFormat((d, i) => {
									return i % 5 !== 0 ? " " : genFormat(d, "year");
								});
						} else if (appState.currentDeviceType === "tablet") {
							xAxis
								.ticks(d3.timeYear.every(2))
								// Show all tick marks but labels every other tick
								.tickFormat((d, i) => {
									return i % 2 !== 0 ? " " : genFormat(d, "year");
								});
						} else {
							// mobile
							xAxis
								.ticks(d3.timeYear.every(2))
								// Show all tick marks but labels every other tick
								.tickFormat((d, i) => {
									return i % 5 !== 0 ? " " : genFormat(d, "year");
								});
						}
					} else {
						// uses time periods
						if (appState.currentDeviceType === "mobile") {
							// mobile
							xAxis.ticks(tickValues.length).tickFormat((d, i) => {
								return i % 4 !== 0 ? " " : d;
							});
						} else {
							// desktop and tablet
							xAxis.ticks(tickValues.length).tickFormat((d, i) => {
								return i % 2 !== 0 ? " " : d;
							});
						}
					}
				}

				if (p.barLayout?.horizontal) {
					leftAxisDraw.call(yAxisLeft);
					d3.selectAll(`#${svgId} .y.axis.left text`).each(insertLineBreaks);
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
					`#${svgId} .symbolPoints, #${svgId} ellipse, #${svgId} ellipse, #${svgId} rect.bar, #${svgId} rect.hover-bar, #${svgId} rect.stacked-bar`
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

		// DRAW LEGEND
		if (p.usesLegend) {
			if (p.usesMultiLineLeftAxis && fullNestedData && fullNestedData[0].key) {
				fullNestedData.forEach((d, i) => {
					legendData[i] = {
						stroke: d.values[0].assignedLegendColor,
						dashArrayScale: p.left1DashArrayScale,
						text: d.key,
						stub_label_num: d.stub_label_num,
					};
				});
			} else if (p.usesStackedBars) {
				stack(p.data).forEach((d, i) => {
					legendData[i] = {
						stroke: color(d.key),
						dashArrayScale: p.left1DashArrayScale,
						text: p.genTooltipConstructor.propertyLookup[d.key].title.split(":")[0],
					};
				});
				legendData.reverse();
			} else if (p.usesBars) {
				p.data = p.data.map((d) => ({
					...d,
					assignedLegendColor: !d.estimate
						? ""
						: p.data.find((e) => e.stub_label === d.stub_label).assignedLegendColor,
				}));

				p.data.forEach((d, i) => {
					legendData[i] = {
						stroke: d.assignedLegendColor,
						dashArrayScale: 0,
						text: d.stub_label,
					};
				});
			} else {
				if (p.usesLeftLine1) {
					legendData.push({
						stroke: leftLine1Color,
						dashArrayScale: p.left1DashArrayScale,
						text: p.leftLegendText,
					});
				}
				if (p.usesLeftLine2) {
					legendData.push({
						stroke: p.leftLine2Color,
						dashArrayScale: p.left2DashArrayScale,
						text: p.left2LegendText,
					});
				}
				if (p.usesLeftLine3) {
					legendData.push({
						stroke: p.leftLine3Color,
						dashArrayScale: p.left3DashArrayScale,
						text: p.left3LegendText,
					});
				}
			}

			if (p.usesRightLine) {
				legendData.push({
					stroke: rightLineColor,
					dashArrayScale: p.rightDashArrayScale,
					text: p.rightLegendText,
				});
			}
		}
		let legendHeight = 0;
		if (p.usesReliabilityCallout && needReliabilityCallout) {
			const chartContainerWidth = $("#chartContainer").width();
			const callOutWidth = chartContainerWidth / 3;
			const callOutHeight = 4 * axisTitleFontSize;
			const labelSize = 0.89 * axisTitleFontSize;

			const callOutGroup = svg
				.append("g")
				.attr("transform", `translate(${chartContainerWidth / 2}, ${svgHeight})`);

			callOutGroup
				.append("rect")
				.attr("x", -callOutWidth / 2)
				.attr("width", callOutWidth)
				.attr("height", callOutHeight)
				.attr("fill", "none")
				.attr("stroke", "#333");

			legendHeight += callOutHeight + 20;

			callOutGroup
				.append("text")
				.attr("transform", `translate(0, ${1.5 * labelSize})`)
				.attr("text-anchor", "middle")
				.attr("font-size", axisTitleFontSize)
				.attr("font-weight", "bold")
				.text("Reliability");

			const reliabilityInfo = callOutGroup
				.append("g")
				.attr("transform", `translate(0, ${2.5 * labelSize})`)
				.attr("text-anchor", "middle");

			const reliabilityInfoRectWidth = callOutWidth / 5;
			reliabilityInfo
				.append("rect")
				.attr("transform", `translate(${-callOutWidth / 2 + 20}, 0)`)
				.attr("width", reliabilityInfoRectWidth)
				.attr("height", labelSize)
				.attr("fill", "#333");

			reliabilityInfo
				.append("text")
				.attr(
					"transform",
					`translate(${-callOutWidth / 2 + 25 + reliabilityInfoRectWidth}, ${0.8 * labelSize})`
				)
				.attr("text-anchor", "start")
				.attr("font-size", labelSize)
				.text("Reliable");

			reliabilityInfo
				.append("rect")
				.attr("transform", `translate(20, 0)`)
				.attr("width", reliabilityInfoRectWidth)
				.attr("height", labelSize)
				.attr("fill", "url(#diagonalHatch-7)");

			reliabilityInfo
				.append("text")
				.attr("transform", `translate(${reliabilityInfoRectWidth + 25}, ${0.8 * labelSize})`)
				.attr("text-anchor", "start")
				.attr("font-size", labelSize)
				.text("Not Reliable");
		}
		svg.attr("viewBox", [((svgScale - 1) * fullSvgWidth) / 2, 0, fullSvgWidth, svgHeight + legendHeight]);

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
