import * as d3 from "../../lib/d3.min";
import { DataCache } from "../../utils/datacache";
import { GenTooltip } from "./genTooltip";
import { getGenSvgScale } from "../../utils/genSvgScale";

export class GenMap {
	constructor(props) {
		this.data = props.mapData;
		this.mapVizId = props.vizId;
		this.startYear = props.startYear; // time period start year selected
		this.allDates = props.allDates;
		this.currentTimePeriodIndex = props.currentTimePeriodIndex;
		this.animating = props.animating;
		this.noDataColorHexVal = null;
		this.tooltipConstructor = props.genTooltipConstructor;
		this.topoJson = props.topoJson;
		this.mLegendData = props.mLegendData;
		this.stableBuckets = props.stableBuckets;
	}

	renderTimeSeriesAxisSelector() {
		const svgId = "us-map-time-slider-svg";

		// setup fontSizes

		// create a non-displayed div to get size of one rem as decimal value
		const viz = d3.select("#us-map-time-slider");
		const remDiv = viz.append("div").attr("line-height", "1rem").attr("display", "none");
		const rem = parseFloat(remDiv.style("line-height"), 10);

		const { fullSvgWidth } = getGenSvgScale("us-map-time-slider");
		const axisLabelFontSize = 0.6 * rem;
		const svgWidth = fullSvgWidth;
		const svgHeight = $("#us-map-svg").height();

		// setup margins, widths, and heights
		const margin = {
			top: 0.02 * svgHeight,
			right: 0,
			bottom: 0.22 * svgHeight,
			left: 0.95 * svgWidth,
		};

		const yMargin = margin.top + margin.bottom;
		const height = svgHeight - yMargin;

		// setup scales
		let yScale = d3
			.scalePoint()
			.range([0, height])
			.domain(this.allDates.map((d) => d));

		// set up axes
		const yAxis = d3.axisLeft(yScale).tickSize(5);
		const svg = viz.append("svg").attr("viewBox", [0, 0, svgWidth, svgHeight]).attr("id", svgId);

		svg.append("g")
			.attr("class", "axis left")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(yAxis);

		d3.selectAll(`#${svgId} .axis.left text`).attr("text-anchor", "end");
		d3.selectAll(`#${svgId} .axis text`).attr("font-size", axisLabelFontSize);

		d3.selectAll(`#${svgId} .axis text`)
			.filter((d, i) => i === this.currentTimePeriodIndex)
			.attr("font-weight", "bold");

		// axis marker overlay (so clicking near a marker triggers a stop on that time-period)
		svg.append("g")
			.selectAll("rect")
			.data(this.allDates)
			.enter()
			.append("rect")
			.attr("class", "mapAnimateAxisPoint")
			.attr("height", yScale.step())
			.attr("width", margin.left)
			.attr("y", (d) => yScale(d) + margin.top - 0.1 * axisLabelFontSize - yScale.step() / 2)
			.attr("x", 0.2 * axisLabelFontSize)
			.attr("fill", "transparent")
			.attr("data-index", (d, i) => i)
			.attr("cursor", "pointer");

		// axis marker for which time-period is being displayed
		svg.append("g")
			.append("rect")
			.attr("class", "mapAnimateAxisPoint")
			.attr("width", 0.9 * axisLabelFontSize)
			.attr("height", 0.2 * axisLabelFontSize)
			.attr("y", yScale(this.allDates[this.currentTimePeriodIndex]) + margin.top - 0.1 * axisLabelFontSize)
			.attr("x", margin.left - 0.45 * axisLabelFontSize)
			.attr("fill", "black");

		const widthOfAxis = $(`#${svgId} .axis.left`)[0].getBoundingClientRect().width;
		const playPauseOffset = svgWidth - widthOfAxis - axisLabelFontSize;

		const animate = svg
			.append("g")
			.attr("transform", `translate(${playPauseOffset}, ${margin.top + 0.8 * axisLabelFontSize})`);

		// outer circle containing play/pause 'icons' that gives the illusion of a an active button
		animate
			.append("circle")
			.attr("class", "mapPlayButton")
			.attr("id", "mapPlayButtonContainer")
			.attr("r", 1.06 * axisLabelFontSize)
			.attr("fill", "darkgrey")
			.attr("cx", -0.9 * axisLabelFontSize)
			.attr("cy", -0.9 * axisLabelFontSize)
			.style("cursor", "pointer")
			.style("display", this.animating ? "block" : "none");

		// inner circle containing play/pause 'icons'
		animate
			.append("circle")
			.attr("class", "mapPlayButton")
			.attr("r", 0.9 * axisLabelFontSize)
			.attr("fill", "black")
			.attr("stroke", "black")
			.attr("cx", -0.9 * axisLabelFontSize)
			.attr("cy", -0.9 * axisLabelFontSize)
			.style("cursor", "pointer");

		// play icon (triangle)
		animate
			.append("path")
			.attr("class", "mapPlayButton")
			.attr("id", "animatePlayIcon")
			.attr(
				"d",
				d3
					.symbol()
					.type(d3.symbolTriangle)
					.size(4 * axisLabelFontSize)
			)
			.attr("fill", this.animating ? "none" : "white")
			.attr("transform", `rotate(90), translate(${-0.94 * axisLabelFontSize}, ${0.94 * axisLabelFontSize})`);

		// one of the pause rectangles
		animate
			.append("rect")
			.attr("class", "animatePauseIcon")
			.attr("x", -1.15 * axisLabelFontSize)
			.attr("y", -1.3 * axisLabelFontSize)
			.attr("width", 0.15 * axisLabelFontSize)
			.attr("height", 0.7 * axisLabelFontSize)
			.attr("fill", this.animating ? "white" : "none");

		// the other pause rectangle
		animate
			.append("rect")
			.attr("class", "animatePauseIcon")
			.attr("x", -0.85 * axisLabelFontSize)
			.attr("y", -1.3 * axisLabelFontSize)
			.attr("width", 0.15 * axisLabelFontSize)
			.attr("height", 0.7 * axisLabelFontSize)
			.attr("fill", this.animating ? "white" : "none");
	}

	render() {
		const topoJson = JSON.parse(JSON.stringify(this.topoJson)); // deep clone
		const { geometries } = topoJson.objects.StatesAndTerritories;
		let { mLegendData } = this;
		let mActiveLegendItems = [];
		const mSuppressedFlagID = -2;
		const mNoDataFlagID = -1;
		let noDataColorHexVal = "#dee2e6";
		const svgId = `${this.mapVizId}-svg`;

		// Need to clear out the last map that was generated
		$(`#${this.mapVizId}`).empty();

		const genTooltip = new GenTooltip(this.tooltipConstructor);

		function mouseover() {
			const thisElement = d3.select(this);
			genTooltip.mouseover(thisElement);
		}
		function mousemove() {
			genTooltip.mousemove();
		}
		function mouseout() {
			genTooltip.mouseout(d3.select(this));
		}

		const bgColors = ["#FFFFFF", "#e4f2e1", "#8dcebb", "#00a9b5", "#007fbe", "#00008b", "#FFFFFF"];

		function getColor(bin, flag) {
			if (flag === "- - -") return noDataColorHexVal; // ignore bin set to light gray
			if (flag === "*") return "url(#crossHatch)"; // ignore bin set to dark gray
			if (flag === "N/A") return noDataColorHexVal; // Set to no data color

			const binColor = bgColors[bin]; // this IS based on position of the bin to the color
			const index = DataCache.mapLegendColors.indexOf(binColor);
			if (index > -1) return binColor; // COLOR FOUND !!
			return "#FFFFFF"; // COLOR NOT FOUND - so NOT ACTIVE
		}

		function getColorFromDProps(d) {
			const binColor = bgColors[d.properties.class]; // this IS based on position of the bin to the color
			const { flag, estimate, crosshatch } = d.properties;
			const index = DataCache.mapLegendColors.indexOf(binColor);

			if (flag === "- - -") return noDataColorHexVal; // ignore bin set to light gray
			if (crosshatch) return "url(#crossHatch)"; // ignore bin set to dark gray
			if (flag === "*" && estimate !== null && index > -1) return binColor;
			if (flag === "N/A" && estimate === null) return noDataColorHexVal; // no data record found
			if (index > -1) return binColor; // COLOR FOUND
			return "#FFFFFF"; // COLOR NOT FOUND - so NOT ACTIVE
		}

		// the territories don't have Properties off the d object - so just duplicated function and removed the properties
		function getColorFromD(d) {
			const binColor = bgColors[d.class]; // this IS based on position of the bin to the color
			const { flag, estimate } = d;

			const index = DataCache.mapLegendColors.indexOf(binColor);
			if (flag === "- - -") return noDataColorHexVal; // ignore bin set to light gray
			if ((flag === "*" && estimate === null) || d.crosshatch) return "url(#crossHatch)"; // ignore bin set to dark gray
			if (flag === "*" && estimate !== null && index > -1) return binColor;
			if (flag === "N/A" && estimate === null) return noDataColorHexVal; // no data record found
			if (index > -1) return binColor; // COLOR FOUND
			return "#FFFFFF"; // COLOR NOT FOUND - so NOT ACTIVE
		}

		// (TT) this let's you use white text on darker backgrounds - some left as black text
		const fontColors = ["#000000", "#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
		const getFontColor = (bin) => fontColors[bin];
		// debugger;
		const { fullSvgWidth, overallScale } = getGenSvgScale(this.mapVizId);
		const territoriesHeight = 50 * overallScale;

		const width = fullSvgWidth;
		const mapHeightRatio = 0.65;
		const mapHeight = width * mapHeightRatio;
		const svgHeight = mapHeight + territoriesHeight * 2;

		const svg = d3.select(`#${this.mapVizId}`).append("svg").attr("id", svgId);

		svg.append("defs")
			.append("pattern")
			.attr("id", "crossHatch")
			.attr("width", 8)
			.attr("height", 8)
			.attr("patternUnits", "userSpaceOnUse")
			.attr("patternTransform", "rotate(45)")
			.append("rect")
			.attr("width", 2) // sets the thickness of the crosshatching
			.attr("height", 8)
			.attr("fill", "#bbb")
			.attr("transform", "translate(0,0)");

		// join the data of STATES with the incoming data topic data
		geometries.forEach((g) => {
			const match = this.data.find((d) => d.stub_label_num == g.properties.STATE_FIPS);
			let theFlag;
			if (match) {
				theFlag = match.flag;
				g.properties = {
					...g.properties,
					estimate: match.estimate ?? "N/A",
					class: match.class,
					active: 1,
					flag: match.flag,
					crosshatch: 0,
					panel: match.panel,
					unit: match.unit,
					year: match.year,
				};
			} else {
				g.properties = {
					...g.properties,
					estimate: null,
					class: null,
					active: 1,
					flag: "N/A",
					crosshatch: 0,
				};
			}

			if (theFlag === "*") {
				geometries.push({
					arcs: g.arcs,
					type: g.type,
					properties: { ...g.properties, crosshatch: 1 },
				});
			}
		});

		// what territories are we hiding????  (TTTT)
		const hiddenStates = [57, 66, 78];
		const filteredStates = geometries.filter((d) => hiddenStates.indexOf(d.properties.STATE_FIPS) === -1);
		const stateGeoCollection = {
			type: "GeometryCollection",
			geometries: filteredStates,
		};

		const states = topojson.feature(topoJson, stateGeoCollection);
		// const projection = d3.geoAlbers().fitSize([width, svgHeight], states);
		const projection = d3.geoAlbers().fitSize([width, mapHeight], states);
		const path = d3.geoPath().projection(projection);

		svg.attr("viewBox", [0, 0, width, svgHeight]);
		// svg.attr("viewBox", [0, 0, width, svgHeight]).attr("preserveAspectRatio", "xMinYMin meet");

		svg.append("g")
			.attr("id", "states")
			.selectAll("path")
			.data(states.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#000")
			.style("stroke-width", 0.4) // was 0.3
			.style("fill", (d) => getColorFromDProps(d))
			.attr("d.properties.flag", (d) => (d.properties.flag === "**" ? "*" : d.properties.flag));

		const territories = [
			{
				STATE_NAME: "American Samoa",
				desiredAbbr: "AS",
				abbr: "AS",
				STATE_FIPS: "60",
			},
			{
				STATE_NAME: "Guam",
				desiredAbbr: "GU",
				abbr: "GU",
				STATE_FIPS: "66",
			},
			{
				STATE_NAME: "Northern Mariana Islands",
				desiredAbbr: "MP",
				abbr: "MP",
				STATE_FIPS: "69",
			},
			{
				STATE_NAME: "Virgin Islands",
				desiredAbbr: "VI",
				abbr: "VI",
				STATE_FIPS: "78",
			},
		];
		let filteredTerritories = [];
		territories.forEach((t, i) => {
			const match = this.data.find((d) => d.stub_label_num == t.STATE_FIPS);
			let theFlag;
			if (match) {
				theFlag = match.flag;
				filteredTerritories.push({
					...t,
					estimate: match.estimate ?? "N/A",
					class: match.class,
					flag: match.flag,
					crosshatch: 0,
					panel: match.panel,
					unit: match.unit,
					year: match.year,
				});
			} else {
				filteredTerritories.push({
					...t,
					estimate: null,
					class: null,
					flag: "N/A",
					crosshatch: 0,
				});
			}

			if (theFlag === "*") {
				filteredTerritories[i].crosshatch = 1;
			}
		});

		const numberOfTerritories = filteredTerritories.length + 1;
		const territoryRectWidth = width / numberOfTerritories + 2;
		const territoryRectHeight = Math.min(30, territoryRectWidth / 3);
		const territorySpaceBetween = territoryRectWidth / 5;

		const territoryGroup = svg
			.append("g")
			.attr("id", "territoryGroup")
			.attr("transform", `translate(${territoryRectWidth / 2}, ${mapHeight + territoriesHeight})`)
			.attr("width", width)
			.attr("height", territoriesHeight);

		territoryGroup
			.selectAll("rect")
			.data(filteredTerritories)
			.enter()
			.append("rect")
			.attr("x", (d, i) => territoryRectWidth * i + territorySpaceBetween / 2)
			.attr("width", territoryRectWidth * 0.8)
			.attr("height", territoryRectHeight)
			.attr("rx", 5 * overallScale)
			.attr("ry", 5 * overallScale)
			.attr("stroke-width", 0.7)
			.attr("stroke", "#777")
			.style("fill", (d) => getColorFromD(d));

		territoryGroup
			.selectAll("text")
			.data(filteredTerritories)
			.enter()
			.append("text")
			.attr("font-size", territoryRectHeight * 0.7)
			.attr("x", (d, i) => territoryRectWidth * i + territoryRectWidth * 0.4 + territorySpaceBetween / 2)
			.attr("y", territoryRectHeight * 0.72)
			.attr("text-anchor", "middle")
			.attr("font-family", "arial,helvetica,sans-serif")
			.attr("stroke", (d) => getFontColor(d.class))
			.style("fill", (d) => getFontColor(d.class))
			.text((d) => d.desiredAbbr)
			.attr("pointer-events", "none");

		d3.selectAll("#states path, #territoryGroup rect")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseout", mouseout);

		genTooltip.render();

		mActiveLegendItems = getDefaultActiveLegendItems();

		loadMapLegend();
		addEventListeners(); // detect clicks

		// call this in click event handler when legend is being clicked on and off
		function updateMap() {
			// update the colors for STATES
			d3.selectAll("#states path").style("fill", function (d) {
				return getColorFromDProps(d); // .properties.class,d.properties.flag);
			});

			// update the colors for TERRITORIES - separate bc the territory data format is DIFFERENT
			d3.selectAll("#territoryGroup rect").style("fill", function (d) {
				return getColorFromD(d);
			});
		}

		// this just generates a LIST  of ALL ITEMS out of the mlegendData array
		// - it does not do any filtering yet
		// - this just starts off the active legend list
		function getDefaultActiveLegendItems() {
			let activeLegendItems = [];
			activeLegendItems.push(String(mNoDataFlagID)); // No Data = 0th item always

			for (let i = 0; i < mLegendData.length; i += 1) {
				activeLegendItems.push(mLegendData[i].min + " - " + mLegendData[i].max);
			}
			return activeLegendItems;
		}

		function legendClickHandler(e) {
			e.stopPropagation();

			const color = $(e.target).data("color");
			const checked = $(e.target).hasClass("checked");

			if (checked) $(e.target).removeClass("checked").attr("style", "background-color: transparent");
			else $(e.target).addClass("checked").attr("style", `background-color: ${color}`);

			if (color === "#dee2e6") {
				if (checked) noDataColorHexVal = "#ffffff";
				else noDataColorHexVal = "#dee2e6";
			}

			// Add or Remove that color to/from the Active list of colors
			let index = DataCache.mapLegendColors.indexOf(color);
			// - note the ORDER of the colors is NOT related to the bin number
			// - this just tracks whether that color is ACTIVE or not
			if (index !== -1) {
				// COLOR FOUND .. remove it from the list
				DataCache.mapLegendColors.splice(index, 1);
			} else {
				// ADD COLOR BACK ... it's not there, so add the item to the active list
				DataCache.mapLegendColors.push(color);
			}

			updateMap(); // just update the colors without redrawing the map
		}

		function addEventListeners() {
			$(document).off("click", "#us-map-legend > div > input");
			$(document).on("click", "#us-map-legend > div > input", legendClickHandler);
			$(document).off("click", "#us-map-legend .squareCheckbox");
			$(document).on("click", "#us-map-legend .squareCheckbox", legendClickHandler);
		}

		// create and load the map legend
		function loadMapLegend() {
			let i;
			let legendItems = [];
			let legendItemObj;
			let displayLabel;
			let colorStyle;
			let legendGeneratedHTML;
			let legendItemVal; // 11Apr2019
			let bgColor;
			let isActive;

			$("#us-map-legend").empty();

			// No Data Box is First
			legendItemObj = {
				ColorStyle: noDataColorHexVal,
				DisplayLabel: "No Data",
				ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: 1, // always start it checked // OLD - mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
			};
			legendItems.push(legendItemObj);

			let nullFlag = false;
			if (mLegendData.length) {
				for (i = 0; i < mLegendData.length; i += 1) {
					displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
					legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019

					if (displayLabel.match("null")) {
						// then skip adding that as a legend item
						// bc we hardcoded that item above
						nullFlag = true;
						continue;
						// then it is "Unreliable"
					} else {
						if (nullFlag) {
							bgColor = getColor(i);
						} else {
							bgColor = getColor(i + 1);
						}
						colorStyle = bgColor;
					}

					isActive = mLegendData[i].active;

					// form object and save it to the list
					legendItemObj = {
						ColorStyle: colorStyle,
						DisplayLabel: displayLabel,
						ItemValue: legendItemVal,
						IsChecked: isActive,
					};
					legendItems.push(legendItemObj);
				}

				// Generate the HTML for the legend
				legendGeneratedHTML = "";
				// debugger;
				legendItems.forEach((leg, i) => {
					let isCheckedStr;
					if (leg.IsChecked === 1) {
						isCheckedStr = "checked";
					} else {
						isCheckedStr = "";
					}
					let legendId = "legend-box-" + i;
					// draw regular with color
					legendGeneratedHTML += `
						<div class="row">
							<div class="col-3 col-offset-1">
								<div id=${legendId}
									 class="squareCheckbox checked"
									 data-color=${leg.ColorStyle}
									 tabindex="0"
									 aria-label='${leg.DisplayLabel.replace("-", "to")}'
									 style="background-color: ${leg.ColorStyle};">
									 	&nbsp;
								</div>
							</div>
							<div class="col-9">${leg.DisplayLabel}</div>
						</div>
        				`;
				});

				// now add the legend to the map div
				$("#us-map-legend").html(legendGeneratedHTML);
			}
		}
	}
}
