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
	}

	render() {
		const p = this.props;
		const genTooltip = new GenTooltip(p.genTooltipConstructor);

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

		const svgId = `${p.vizId}-svg`;

		// setup fontSizes

		// create a non-displayed div to get size of one rem as decimal value
		const viz = d3.select(`#${p.vizId}`);
		const remDiv = viz.append("div").attr("line-height", "1rem").attr("display", "none");
		const rem = parseFloat(remDiv.style("line-height"), 10);

		// these 4 params keeps everything sized/positioned correctly regardless of screen resolution
		const { fullSvgWidth, overallScale, svgHeightRatio, svgScale } = getGenSvgScale(p.vizId);

		const chartTitleFontSize = overallScale * p.chartTitleFontScale * rem;
		const axisTitleFontSize = overallScale * p.axisTitleFontScale * rem;
		const axisLabelFontSize = overallScale * p.axisLabelFontScale * rem;

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
			top: axisSize, // gives room for tick label when no chart title
			right: d3.max([rightTitleSize + rightAxisSize, p.marginRightMin * overallScale]),
			bottom: bottomTitleSize + bottomAxisScale * axisSize * p.xLabelScale + 10, // add default extra 10px to bottom for below bottom line letters (like y)
			left: d3.max([leftTitleSize + leftAxisSize, p.marginLeftMin]),
		};

		const xMargin = margin.left + margin.right;
		const yMargin = margin.top + margin.bottom;

		const svgWidth = fullSvgWidth * svgScale;
		const svgHeight = svgWidth * svgHeightRatio;

		const chartWidth = svgWidth - xMargin;
		const chartHeight = svgHeight - yMargin;

		// get chart x and y centers
		const halfXMargins = xMargin / 2;
		const halfWidth = svgWidth / 2;
		const chartCenterX = halfWidth + margin.left - halfXMargins;

		const halfYMargins = yMargin / 2;
		const halfHeight = svgHeight / 2;
		const chartCenterY = halfHeight + margin.top - halfYMargins;

		// apply chart title
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

		if (p.firefoxReversed === true) {
			xScale = d3.scaleBand().range([chartWidth, 0]).paddingInner(0.1).paddingOuter(0.1);
		} else {
			xScale = d3.scaleBand().range([0, chartWidth]).paddingInner(0.1).paddingOuter(0.1);
		}

		let yScaleExtent = [0];
		let yScaleType = d3.scaleLinear();
		let yLeft1TickValues;
		if (p.left1ScaleType === "log") {
			yScaleExtent = d3.extent(p.data.map((d) => d[p.chartProperties.yLeft1]));
			yScaleType = d3.scaleLog();
			yLeft1TickValues = Utils.getPowerOf10ArrayWithinBounds(...yScaleExtent, 6);
		}

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
			.tickFormat((d) => genFormat(d, p.formatXAxis));

		const yAxisLeft = d3
			.axisLeft(yScaleLeft)
			.tickSize(3)
			.tickSizeInner(-chartWidth)
			.ticks(p.leftTickCount)
			.tickFormat((d) => genFormat(d, p.formatYAxisLeft));

		if (p.left1ScaleType === "log") yAxisLeft.tickValues(yLeft1TickValues);

		const yAxisRight = d3
			.axisRight(yScaleRight)
			.tickSize(3)
			.ticks(p.rightTickCount)
			.tickFormat((d) => genFormat(d, p.formatYAxisRight));

		// apply the svg to the container element
		const svg = viz.append("svg").attr("height", svgHeight).attr("width", svgWidth).attr("id", svgId);


		// CVI-4549 Tech Debt: Display message to user when no data is passed into genChart component
		if (!p.data.length) {
			svg.append("text")
				.text(p.noDataMessage)
				.attr("text-anchor", "middle")
				.attr("font-size", axisTitleFontSize)
				.attr("x", chartCenterX)
				.attr("y", chartCenterY);
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
				svg.append("g")
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
			if (p.usesBottomAxisTitle) {
				svg.append("text")
					.text(p.bottomAxisTitle)
					.attr("text-anchor", "middle")
					.attr("font-size", axisTitleFontSize)
					.attr("x", chartCenterX)
					.attr("y", margin.top + chartHeight + bottomAxisScale * axisSize * p.xLabelScale + bottomTitleSize);
			}

			// left yAxis
			if (p.usesLeftAxisTitle) {
				svg.append("text")
					.text(p.leftAxisTitle)
					.style("text-anchor", "middle")
					.attr("transform", "rotate(-90)")
					.attr("x", -chartCenterY)
					.attr("y", axisTitleSize / p.labelPaddingScale)
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
			let multiLineColors, fullNestedData;
			let lines = [];
			let lineGroups = [];
			let lineGroupPaths = [];
			if (p.usesMultiLineLeftAxis) {
				multiLineColors = d3.scaleOrdinal(p.multiLineColors);
				fullNestedData = d3
					.nest()
					.key((d) => d[p.multiLineLeftAxisKey])
					.entries(p.data);

				fullNestedData.forEach((nd, i) => {
					lines[i] = d3.line();
					const lineGroup = svg
						.append("g")
						.attr("class", nd.key.replace(/[\W_]+/g, ""))

						.attr("transform", `translate(${margin.left}, ${margin.top})`);

					lineGroups[i] = lineGroup;

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

			if (p.usesLegend) {
				let legendData = [];
				if (p.usesMultiLineLeftAxis && fullNestedData[0].key !== "undefined") {
					fullNestedData.forEach((d, i) => {
						legendData[i] = {
							stroke: multiLineColors(i),
							dashArrayScale: p.left1DashArrayScale,
							text: d.key,
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

				const legendTx = margin.left + p.legendCoordinatePercents[0] * svgWidth;
				const legendTy = margin.top + p.legendCoordinatePercents[1] * svgHeight;

				const legendHeight = (legendData.length + 1) * axisLabelFontSize * 1.1;

				const legendContainer = svg
					.append("g")
					.attr("transform", `translate(${legendTx}, ${legendTy})`)
					.append("rect")
					.attr("id", `${svgId}-chart-legend`)
					.attr("height", legendHeight)
					.attr("fill", "#F2F2F2")
					.attr("rx", "5")
					.attr("ry", "5")
					.attr("stroke", "black");

				legendData.forEach((d, i) => {
					const legendItem = svg
						.append("g")
						.attr("class", `${svgId}-legendItem ${d.text.replace(/[\W_]+/g, "")}`)
						.attr(
							"transform",
							`translate(${legendTx + axisLabelFontSize / 2},
								${legendTy + 1.1 * axisLabelFontSize * (i + 1)})`
						);

					legendItem
						.append("line")
						.attr("x1", 0)
						.attr("y1", 0)
						.attr("x2", 40)
						.attr("y2", 0)
						.attr("stroke", d.stroke)
						.attr("stroke-width", 4)
						.attr("stroke-dasharray", d.dashArrayScale);

					legendItem
						.append("g")
						.append("text")
						.attr("x", 60)
						.attr("y", axisLabelFontSize * 0.4)
						.text(d.text)
						.attr("font-size", axisLabelFontSize);
				});

				// get all legend items and find the longest then set the legend container size
				const legendItems = document.querySelectorAll(`.${svgId}-legendItem`);
				const legendWidths = [...legendItems].map((l) => l.getBoundingClientRect().width);
				const newWidth = d3.max(legendWidths);
				legendContainer.attr("width", newWidth + 13);

				if (p.legendBottom) {
					svg.attr("height", svgHeight + legendHeight);
				}
			}

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
				xScale.domain(sortedXValues.map((d) => d));

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
						.data(data)
						.join(
							(enter) => {
								enter
									.append("rect")
									.attr("class", "bar")
									.attr("width", xScale.bandwidth())
									.attr("fill", (d, i) => {
										if (p.barColors) return p.barColors[i];
										if (
											p.finalDataPointsDaysCount &&
											d[p.chartProperties.xAxis] >= endRangeSpecialSectionStartDate
										)
											return edgeCaseBarColor;
										return barColor;
									})
									.attr("height", (d) => chartHeight - yScaleLeft(d[p.chartProperties.bars]))
									.attr("x", (d) => xScale(d[p.chartProperties.xAxis]))
									.attr("y", (d) => yScaleLeft(d[p.chartProperties.bars]))
									.attr("opacity", 0.85);
							},
							(update) => {
								update
									.attr("width", xScale.bandwidth())
									.attr("fill", (d, i) => {
										if (p.barColors) return p.barColors[i];
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
				const offset = xScale.bandwidth() / 2; // the alignment value for line/ellipse position to bar positions

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
						lines[i]
							.x((d) => xScale(d[p.chartProperties.xAxis]) + offset)
							.y((d) => yScaleLeft(d[p.chartProperties.yLeft1]));

						lineGroupPaths[i].attr("d", lines[i](nd.values));
						lineGroups[i]
							.selectAll("ellipse")
							.data(nd.values, (d) => d[p.chartProperties.xAxis])
							.join(
								(enter) => {
									enter
										.append("ellipse")
										.style("fill", multiLineColors(i))
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

				if (p.usesDateAsXAxis) xAxis.tickValues(tickValues);
				xAxisDraw.call(xAxis);

				if (p.bottomAxisRotation)
					d3.selectAll(`#${svgId} .axis.bottom text`)
						.attr("text-anchor", "end")
						.attr(
							"transform",
							`translate(${p.xLabelRotatedXAdjust * overallScale}, ${
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
