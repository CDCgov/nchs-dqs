import * as d3 from "../../lib/d3.min";
import { GenTooltip } from "./genTooltip";
import { getGenSvgScale } from "../../utils/genSvgScale";
import { ClassifyData } from "../../utils/ClassifyDataNT";

export class GenMap {
	constructor(props) {
		this.data = props.mapData;
		this.mapVizId = props.vizId;
		this.classifyType = parseInt(props.classifyType, 10);
		this.startYear = props.startYear; // time period start year selected
		this.allDates = props.allDates;
		this.currentTimePeriodIndex = props.currentTimePeriodIndex;
		this.animating = props.animating;
		this.noDataColorHexVal = null;
		this.tooltipConstructor = props.genTooltipConstructor;
		this.topoJson = props.topoJson;
	}

	renderTimeSeriesAxisSelector() {
		const svgId = "us-map-time-slider-svg";

		// setup fontSizes

		// create a non-displayed div to get size of one rem as decimal value
		const viz = d3.select("#us-map-time-slider");
		const remDiv = viz.append("div").attr("line-height", "1rem").attr("display", "none");
		const rem = parseFloat(remDiv.style("line-height"), 10);

		const { fullSvgWidth } = getGenSvgScale(this.mapVizId);
		const axisLabelFontSize = 0.6 * rem;

		// setup margins, widths, and heights
		const margin = {
			top: 0,
			right: axisLabelFontSize,
			bottom: 100,
			left: 3 * axisLabelFontSize,
		};

		const xMargin = margin.left + margin.right;
		const yMargin = margin.top + margin.bottom;
		const mapWidthRatio = 0.8;
		const svgWidth = fullSvgWidth * mapWidthRatio;
		const svgHeight = 110;

		const chartWidth = svgWidth - xMargin;
		const chartHeight = svgHeight - yMargin;

		// setup scales
		let xScale = d3
			.scalePoint()
			.range([0, chartWidth])
			.domain(this.allDates.map((d) => d));

		// set up axes
		const xAxis = d3.axisBottom(xScale).tickSize(5);
		const svg = viz.append("svg").attr("viewBox", [0, 0, svgWidth, svgHeight]).attr("id", svgId);

		svg.append("g")
			.attr("class", "axis bottom")
			.attr("transform", `translate(${margin.left}, ${margin.top + chartHeight})`)
			.call(xAxis);

		// axis marker overlay (so clicking near a marker triggers a stop on that time-period)
		svg.append("g")
			.selectAll("rect")
			.data(this.allDates)
			.enter()
			.append("rect")
			.attr("class", "mapAnimateAxisPoint")
			.attr("height", margin.bottom)
			.attr("width", xScale.step())
			.attr("x", (d) => xScale(d) + margin.left - 0.1 * axisLabelFontSize - xScale.step() / 2)
			.attr("y", 0.2 * axisLabelFontSize)
			.attr("fill", "transparent")
			.attr("data-index", (d, i) => i)
			.attr("cursor", "pointer");

		// axis marker for which time-period is being displayed
		svg.append("g")
			.append("rect")
			.attr("class", "mapAnimateAxisPoint")
			.attr("height", 0.9 * axisLabelFontSize)
			.attr("width", 0.2 * axisLabelFontSize)
			.attr("x", xScale(this.allDates[this.currentTimePeriodIndex]) + margin.left - 0.1 * axisLabelFontSize)
			.attr("y", 0.2 * axisLabelFontSize)
			.attr("fill", "darkgrey");

		// animate section
		const animate = svg.append("g");

		animate
			.append("rect")
			.attr("class", "mapPlayButton")
			.attr("id", "mapPlayButtonContainer")
			.attr("width", 2 * axisLabelFontSize)
			.attr("height", 2 * axisLabelFontSize)
			.attr("fill", "darkgrey")
			.attr("rx", 0.2 * axisLabelFontSize)
			.attr("ry", 0.2 * axisLabelFontSize)
			.attr("transform", `translate(0, ${axisLabelFontSize})`)
			.style("cursor", "pointer")
			.style("display", this.animating ? "block" : "none");

		// // inner rectangle to contain play button
		animate
			.append("rect")
			.attr("class", "mapPlayButton")
			.attr("width", 1.7 * axisLabelFontSize)
			.attr("height", 1.7 * axisLabelFontSize)
			.attr("fill", "#F2F2F2")
			.attr("stroke", "black")
			.attr("rx", 0.2 * axisLabelFontSize)
			.attr("ry", 0.2 * axisLabelFontSize)
			.attr("transform", `translate(${0.15 * axisLabelFontSize}, ${1.15 * axisLabelFontSize})`)
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
					.size(3 * axisLabelFontSize)
			)
			.attr("fill", this.animating ? "none" : "black")
			.attr("transform", `rotate(90), translate(${2 * axisLabelFontSize}, ${-axisLabelFontSize})`);

		animate
			.append("rect")
			.attr("class", "animatePauseIcon")
			.attr("x", 1.05 * axisLabelFontSize)
			.attr("y", 1.65 * axisLabelFontSize)
			.attr("width", 0.15 * axisLabelFontSize)
			.attr("height", 0.7 * axisLabelFontSize)
			.attr("fill", this.animating ? "black" : "none");

		animate
			.append("rect")
			.attr("class", "animatePauseIcon")
			.attr("x", 0.8 * axisLabelFontSize)
			.attr("y", 1.65 * axisLabelFontSize)
			.attr("width", 0.15 * axisLabelFontSize)
			.attr("height", 0.7 * axisLabelFontSize)
			.attr("fill", this.animating ? "black" : "none");

		d3.selectAll(`#${svgId} .axis.bottom text`)
			.attr("text-anchor", "end")
			.attr("transform", `translate(${-0.85 * axisLabelFontSize}, ${0.5 * axisLabelFontSize}), rotate(-90)`);

		d3.selectAll(`#${svgId} .axis text`).attr("font-size", axisLabelFontSize);

		d3.selectAll(`#${svgId} .axis text`)
			.filter((d, i) => i === this.currentTimePeriodIndex)
			.attr("font-weight", "bold");
	}

	render() {
		const topoJson = JSON.parse(JSON.stringify(this.topoJson));
		const { geometries } = topoJson.objects.StatesAndTerritories;
		let mLegendData;
		let mActiveLegendItems = [];
		let mActiveLegendItemColors = [];
		const mSuppressedFlagID = -2;
		const mNoDataFlagID = -1;
		let noDataColorHexVal = "#dee2e6";
		const svgId = `${this.mapVizId}-svg`;

		// Need to clear out the last map that was generated
		$(`#${this.mapVizId}`).empty();

		const genTooltip = new GenTooltip(this.tooltipConstructor);

		let ClassifiedDataObj;

		switch (this.classifyType) {
			case 1:
				// Standard Breaks - with 4 Quartiles
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 4, 1);
				break;
			case 2:
				// Natural Breaks
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 5, 2);
				break;
			case 3:
				// Equal Intervals - NOT USED
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 5, 3);
				break;
			default:
				break;
		}

		this.data = ClassifiedDataObj.classifiedData;

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
		// same as above but remove WHITE
		mActiveLegendItemColors = ["#e4f2e1", "#8dcebb", "#00a9b5", "#007fbe", "#00008b"];

		function getColor(bin, flag) {
			if (flag === "- - -") return noDataColorHexVal; // ignore bin set to light gray
			if (flag === "*") return "url(#crossHatch)"; // ignore bin set to dark gray
			if (flag === "N/A") return noDataColorHexVal; // Set to no data color

			const binColor = bgColors[bin]; // this IS based on position of the bin to the color
			const index = mActiveLegendItemColors.indexOf(binColor);
			if (index > -1) return binColor; // COLOR FOUND !!
			return "#FFFFFF"; // COLOR NOT FOUND - so NOT ACTIVE
		}

		function getColorFromDProps(d) {
			const binColor = bgColors[d.properties.class]; // this IS based on position of the bin to the color
			const { flag, estimate, crosshatch } = d.properties;
			const index = mActiveLegendItemColors.indexOf(binColor);

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

			const index = mActiveLegendItemColors.indexOf(binColor);
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

		const { fullSvgWidth, overallScale } = getGenSvgScale(this.mapVizId);
		const territoriesHeight = 50 * overallScale;

		const width = fullSvgWidth;
		const mapHeightRatio = 0.5;
		const mapHeight = width * mapHeightRatio;
		const svgHeight = mapHeight + territoriesHeight * 2;

		const svg = d3.select(`#${this.mapVizId}`).append("svg").attr("id", svgId).attr("display", "inline-block");

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
		const projection = d3
			.geoAlbers()
			.translate([width / 2, mapHeight / 2])
			.scale(width);

		const path = d3.geoPath().projection(projection);

		svg.attr("viewBox", [0, 0, width, svgHeight]);

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

		mLegendData = ClassifiedDataObj.legend;
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

		function convertRGB(rgb) {
			// This will choose the correct separator, if there is a "," in your value it will use a comma, otherwise, a separator will not be used.
			const separator = rgb.indexOf(",") > -1 ? "," : " ";

			// This will convert "rgb(r,g,b)" into [r,g,b] so we can use the "+" to convert them back to numbers before using toString
			const cleanedRgb = rgb.substr(4).split(")")[0].split(separator);

			// Here we will convert the decimal values to hexadecimal using toString(16)
			let r = (+cleanedRgb[0]).toString(16);
			let g = (+cleanedRgb[1]).toString(16);
			let b = (+cleanedRgb[2]).toString(16);

			if (r.length === 1) r = "0" + r;
			if (g.length === 1) g = "0" + g;
			if (b.length === 1) b = "0" + b;

			// The return value is a concatenation of "#" plus the rgb values which will give you your hex
			return "#" + r + g + b;
		}

		function legendClickHandler(evt) {
			let index;
			let itemLabel;
			let $chkBxObj;

			// will call click event twice if you dont call this
			evt.stopPropagation();

			// get bg color of the one clicked
			let theClickedColor = convertRGB(evt.target.parentNode.style.backgroundColor);

			if (theClickedColor === "#dee2e6") {
				// this is the color used for 'No Data'
				this.noDataHasColor = !this.noDataHasColor;
				if (this.noDataHasColor) noDataColorHexVal = "#ffffff";
				else noDataColorHexVal = "#dee2e6";
			}

			index = mActiveLegendItemColors.indexOf(theClickedColor);
			// Add or Remove that color to/from the Active list of colors
			// - note the ORDER of the colors is NOT related to the bin number
			// - this just tracks whether that color is ACTIVE or not
			if (index > -1) {
				// COLOR FOUND
				// remove it from the list
				mActiveLegendItemColors.splice(index, 1);
			} else {
				// ADD COLOR BACK
				// it's not there, so add the item to the active list
				mActiveLegendItemColors.push(theClickedColor);
			}

			if (evt.target && evt.target.nodeName.toLowerCase() === "input".toLowerCase()) {
				itemLabel = $(evt.target).val();
				$chkBxObj = $(evt.target);
			} else if ($(evt.target).hasClass("da-maplegend-box")) {
				itemLabel = $(evt.target).find("input").val();
				$chkBxObj = $(evt.target).find("input");
			}
			index = mActiveLegendItems.indexOf(itemLabel);

			if (index > -1) {
				// ITEM FOUND,  remove it from the list
				mActiveLegendItems.splice(index, 1);
				$chkBxObj.prop("checked", false);
			} else {
				// RE-ENABLE, it's not there, so add the item to the active list
				mActiveLegendItems.push(itemLabel);
				$chkBxObj.prop("checked", true);
			}

			// just update the colors without redrawing the map
			updateMap();
		}

		function addEventListeners() {
			$(document).off("click", "#us-map-legend > div > input");
			$(document).on("click", "#us-map-legend > div > input", legendClickHandler);
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
			let fontColor;
			let isActive;

			$("#us-map-legend").empty();

			// No Data Box is First
			legendItemObj = {
				ColorStyle: "color:black !important; background-color:" + noDataColorHexVal,
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
							fontColor = getFontColor(i);
						} else {
							bgColor = getColor(i + 1);
							fontColor = getFontColor(i + 1);
						}
						colorStyle = "color:" + fontColor + " !important;background-color:" + bgColor;
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

				legendItems.forEach((leg, i) => {
					let isCheckedStr;
					if (leg.IsChecked === 1) {
						isCheckedStr = "checked";
					} else {
						isCheckedStr = "";
					}
					let legendId = "legend-box-" + i;
					if (leg.DisplayLabel.match("Unreliable")) {
						// for cross hatching, just use white
						legendGeneratedHTML += `
						<div id='${legendId}' style='${leg.ColorStyle}'>
							<input
								id='mapchk-${i}'
								class='form-check-input'
								type='checkbox'
								value='${leg.ItemValue}'
								${isCheckedStr}
								style='margin-right:3px;cursor:pointer"
								aria-label='${leg.DisplayLabel.replace("-", "to")}'
								autocomplete='off' />
							<label for='mapchk-${i}'>${leg.DisplayLabel}</label>
						</div>`;
					} else {
						// draw regular with color
						legendGeneratedHTML += `
						<div id='${legendId}' style='${leg.ColorStyle}'>
							<input
								class='form-check-input'
								type='checkbox'
								value='${leg.ItemValue}'
								${isCheckedStr}
								style='margin-right:3px; cursor:pointer;'
								aria-label='${leg.DisplayLabel.replace("-", "to")}'
								autocomplete='off' />
								<label for='mapchk-${i}'>${leg.DisplayLabel}</label>
						</div>`;
					}
				});

				// now add the legend to the map div
				$("#us-map-legend").html(legendGeneratedHTML);
			}
		}
	}
}
