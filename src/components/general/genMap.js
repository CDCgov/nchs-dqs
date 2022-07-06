import { DataCache } from "../../utils/datacache";
import * as d3 from "../../lib/d3.min";
import { GenTooltip } from "../general/genTooltip";
import { getGenSvgScale } from "../../utils/genSvgScale";
import { ClassifyData } from "../../utils/ClassifyDataNT";

export class GenMap {
	constructor(props) {
		this.data = props.mapData;
		this.mapVizId = props.vizId;
		this.classifyType = parseInt(props.classifyType);

	}
	
	render(geometries) {
		let mLegendData;
		let mActiveLegendItems = [];
		const mSuppressedFlagID = -2;
		const mNoDataFlagID = -1;
		const mInActiveFlagID = -3;
		let mColorByStateID = {};
		let mInActiveColor = "#FFFFFF";
		
		//const svgId = this.mapVizId;
		const svgId = `${this.mapVizId}-svg`;
		
		// Need to clear out the last map that was generated
		$(`#${this.mapVizId}`).empty();
		
		function getTooltipConstructor(vizId) {
			const propertyLookup = {
				STATE_NAME: { title: "STATE: ", datumType: "string" },
				estimate: { title: "Estimate: ", datumType: "string" },
				"": { title: "", datumType: "empty" },
			};

			const headerProps = ["STATE_NAME", ""];
			const bodyProps = ["estimate"];
			return { propertyLookup, headerProps, bodyProps, svgId, vizId };
		}
		const genTooltip = new GenTooltip(getTooltipConstructor(this.mapVizId));

		// The below commented out code was used to demonstrate how the US Map would render after moving
		// to a new set of binning requirements that will be provided from DB group for CVI-3561
		// It may be helpful to leave this in for future changes to Map bin categories

		// this.data = this.data.map((d) => ({
		// 	...d,
		// 	Total_Cases_Range:
		// 		d.Total_Cases_Range === "1-24 cases" || d.Total_Cases_Range === "25-49 cases"
		// 			? "1-49 cases"
		// 			: d.Total_Cases_Range === "50-99 cases"
		// 			? "50-99 cases"
		// 			: d.Total_Cases_Range === "100-149 cases" || d.Total_Cases_Range === "150-199 cases"
		// 			? "100-199 cases"
		// 			: d.Total_Cases_Range === "200-249 cases" || d.Total_Cases_Range === "250-299 cases"
		// 			? "200-299 cases"
		// 			: d.Total_Cases_Range === "300+ cases"
		// 			? "300-399 cases"
		// 			: d.Total_Cases_Range === "400+ cases"
		// 			? "400+ cases"
		// 			: "No case reported",
		// }));

		// this.data = this.data.map((d) => ({
		// 	...d,
		// 	Total_Cases_Range: d.rep_juris === "LA" || d.rep_juris === "AZ" ? "400+ cases" : d.Total_Cases_Range,
		// }));

		const copiedData = [...this.data];

		console.log("###genMAP incoming geometries:", geometries);
		console.log("###genMAP incoming data:", this.data);

		// remove all records without an estimate
		this.data = this.data
				.filter(function (d) {
					//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
					if (('estimate' in d) && (d.estimate !== undefined) && (d.estimate !== "")) {
						return d;
					}
				});
		
		// CLASSIFY THE DATA
       	//   METHODS  \\
        // STANDARD BREAKS  = 1 -> pass 4 to do 4 quartiles
        // NATURAL BREAKS   = 2
        // EQUAL INTERVAL   = 3

		let ClassifiedDataObj;

		switch (this.classifyType) {
			case 1:
				// Standard Breaks - with 4 Quartiles
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 4, 1);
				console.log("%c%s\t%o", "background-color:Aqua;", "Standard Breaks", ClassifiedDataObj);
				console.log(JSON.stringify(ClassifiedDataObj.legend));
				break;
			case 2:
				// Natural Breaks
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 5, 2);
        		console.log("%c%s\t%o", "background-color:PaleGoldenrod;", "Natural Breaks", ClassifiedDataObj);
        		console.log(JSON.stringify(ClassifiedDataObj.legend));
				break;
			case 3:
				// Equal Intervals - NOT USED
				ClassifiedDataObj = ClassifyData(this.data, "estimate", 5, 3);
        		console.log("%c%s\t%o", "background-color:LightGreen;", "Equal Interval", ClassifiedDataObj);
				console.log(JSON.stringify(ClassifiedDataObj.legend));
				break;

		}
		
		this.data = ClassifiedDataObj.classifiedData;
		// the data now has a "Class" assigned to it
		//debugger;

		// for testing hardcode one year period
/* 		this.data = this.data.filter(
					(d) => parseInt(d.year_pt) === parseInt("2005")
		); */
		//console.log("###genMAP incoming 2013 data:", this.data);
		//debugger;

		function mouseover() {
			const thisElement = d3.select(this);
			//console.log("rollover selected element:", thisElement);
			// dont need this right now but keep as example if we need later
/* 			if (thisElement.node().tagName.toLowerCase() === "path") {
				let additionalProperties = ["properties"];
				if (thisElement.data()[0].properties.STATE_ABBR === "NY")
					additionalProperties.push([
						"NYC Count: ",
						copiedData.filter((d) => d.rep_juris === "NYC")[0].Total_Cases_Range,
					]);
				genTooltip.mouseover(thisElement, additionalProperties);
			} else {
				genTooltip.mouseover(thisElement);
			} */
			genTooltip.mouseover(thisElement);
		}
		function mousemove() {
			genTooltip.mousemove();
		}
		function mouseout() {
			genTooltip.mouseout(d3.select(this));
		}

		const bgColors = ["#FFFFFF", "#e4f2e1", "#8dcebb", "#00a9b5", "#007fbe", "#00008b", "#FFFFFF"];
		function getColor(bin) {
			//console.log("color bin:", bin);
			return bgColors[bin];
		}

		// (TT) this let's you use white text on darker backgrounds
		const fontColors = ["#000000", "#000000", "#000000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
		function getFontColor(bin) {
			//console.log("font color bin:", bin);
			return fontColors[bin];
		}
		
		const { fullSvgWidth, overallScale } = getGenSvgScale(this.mapVizId);
		const territoriesHeight = 50 * overallScale;

		let mapWidthRatio = 0.7;
		if (fullSvgWidth <= 1050) mapWidthRatio = 1;

		const width = mapWidthRatio * fullSvgWidth;
		const mapHeightRatio = 0.5;
		const mapHeight = width * mapHeightRatio;
		const svgHeight = mapHeight + territoriesHeight * 2;

		const svg = d3
			.select(`#${this.mapVizId}`)
			.append("svg")
			.attr("height", svgHeight)
			.attr("width", width)
			.attr("id", svgId)
			.attr("display", "inline-block");

		// join the data of territories with the incoming data
		geometries.forEach((g) => {
			//let estimateRange = this.data.filter((d) => d.stub_label_num === g.properties.STATE_FIPS)[0]?.estimate;
			let estimateMatch = this.data
				.filter(function (d) {
					//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
					if (parseInt(d.stub_label_num) === parseInt(g.properties.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.estimate ? d.estimate : 0;
					}
				});
			
			let classBin = this.data
				.filter(function (d) {
					//console.log("d , d.bin:", d, d.class);
					if (parseInt(d.stub_label_num) === parseInt(g.properties.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.class ? d.class : 0;
					}
				});

			//console.log("---- FOR G FIPS:", g.properties.STATE_FIPS," estimateMatch:", estimateMatch, " classBin:",classBin[0].class);

			if (estimateMatch.length > 0) {
				estimateMatch = estimateMatch[0].estimate;
			} else {
				estimateMatch = 0;
			}

			if (classBin[0] !== undefined) { 
				if (classBin[0].hasOwnProperty("class")) {
					g.properties = {
						...g.properties,
						estimate: parseFloat(estimateMatch),
						class: parseInt(classBin[0].class),
						active: 1,  // default initial to all checked
					};
				} else {
					console.log("### classBin has no class!", classBin[0]);
				}
			}
		});

		console.log("###genMAP geometries w estimate:", geometries);
		
		// what territories are we hiding????  (TTTT)
		const hiddenStates = [57, 66, 78];
		const filteredStates = geometries.filter((d) => hiddenStates.indexOf(d.properties.STATE_FIPS) === -1);
		const stateGeoCollection = {
			type: "GeometryCollection",
			geometries: filteredStates,
		};

		const states = topojson.feature(DataCache.USTopo, stateGeoCollection);
		const projection = d3
			.geoAlbers()
			.translate([width / 2, mapHeight / 2])
			.scale(width);

		const path = d3.geoPath().projection(projection);

		const usMap = svg.append("g").attr("width", width).attr("height", mapHeight);

		console.log("states data:", states);

		usMap
			.append("g")
			.attr("id", "states")
			.selectAll("path")
			.data(states.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#000")
			.style("stroke-width", 0.4) // was 0.3
			.style("fill", (d) => getColor(d.properties.class));

		const territories = [
			{
				STATE_NAME: "American Samoa", desiredAbbr: "AS", abbr: "AS",
				STATE_FIPS: "60",
			},
/* 			{   Puerto Rico is in the States data for some reason bc it's an island
				in the geometries

				STATE_NAME: "Puerto Rico",
				desiredAbbr: "PR",
				abbr: "PR",
				STATE_FIPS: "72", 
			}, */
			{
				STATE_NAME: "Guam", desiredAbbr: "GU", abbr: "GU",
				STATE_FIPS: "66",
			},
			{
				STATE_NAME: "Northern Mariana Islands",
				desiredAbbr: "MP",
				abbr: "MP",
				STATE_FIPS: "69",
			},
/* 			{
				STATE_NAME: "Palau", desiredAbbr: "PW", abbr: "PW",
				STATE_FIPS: "78",
			}, */
/* 			{
				STATE_NAME: "Republic of the Marshall Islands",
				desiredAbbr: "RMI",
				abbr: "RMI",
				STATE_FIPS: "78",
			}, */
			{
				STATE_NAME: "Virgin Islands", desiredAbbr: "VI", abbr: "VI",
				STATE_FIPS: "78",
			},
		];
		let filteredTerritories = [];
		territories.forEach((t) => {
			//debugger;
			let estimateMatch = this.data
				.filter(function (d) {
					//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
					if (parseInt(d.stub_label_num) === parseInt(t.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.estimate ? d.estimate : 0;
					}
				});

			let classBin = this.data
				.filter(function (d) {
					//console.log("TERRITORIES: d , d.bin, t", d, d.class, t);
					if (parseInt(d.stub_label_num) === parseInt(t.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", t.STATE_FIPS, " estimate:", d.estimate);
						return d.class ? d.class : 0;
					}
				});

			//console.log("---- FOR G FIPS:", g.properties.STATE_FIPS," estimateMatch:", estimateMatch);

			if (estimateMatch.length > 0) {
				estimateMatch = estimateMatch[0].estimate;
			} else {
				estimateMatch = "No case reported.";
			}

			
			if (classBin[0] !== undefined) { 
				if (classBin[0].hasOwnProperty("class")) {		
					//console.log("### TERRITORY classBin has REAL class!", classBin[0].class);
					filteredTerritories.push({
						...t,
						estimate: estimateMatch,
						class: parseInt(classBin[0].class),
					});
				} else {
					console.log("### TERRITORY classBin has no class!", classBin[0]);
				}
			}

		});

		console.log("filtered Territories:", filteredTerritories);

		const numberOfTerritories = filteredTerritories.length + 1;
		const territoryRectWidth = 60 * overallScale;
		const territoryRectHeight = 25 * overallScale;
		const territorySpaceBetween = 10 * overallScale;
		const territoryTranslateLeft =
			(overallScale *
				(numberOfTerritories * territoryRectWidth + (numberOfTerritories - 1) * territorySpaceBetween)) /
			2;

		const territoryGroup = svg
			.append("g")
			.attr("id", "territoryGroup")
			.attr("transform", `translate(${width * 0.5 - territoryTranslateLeft}, ${mapHeight + territoriesHeight})`)
			.attr("width", width)
			.attr("height", territoriesHeight);

		territoryGroup
			.selectAll("rect")
			.data(filteredTerritories)
			.enter()
			.append("rect")
			.attr("x", (d, i) => territoryRectWidth * i + territorySpaceBetween)
			.attr("width", territoryRectWidth * 0.8)
			.attr("height", territoryRectHeight)
			//.style("fill", "#e4f2e1")
			.style("fill", (d) => getColor(d.class))
			//.style("fill", (d) => getColor(d.properties.estimate));
			.attr("rx", 5 * overallScale)
			.attr("ry", 5 * overallScale)
			.attr("stroke-width", 0.7)
			.attr("stroke", "#777");

		territoryGroup
			.selectAll("text")
			.data(filteredTerritories)
			.enter()
			.append("text")
			.attr("font-size", 18 * overallScale)
			.attr("x", (d, i) => territoryRectWidth * i + territorySpaceBetween + 23 * overallScale)
			.attr("y", 18 * overallScale)
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

		loadMapLegend();

		function isNoDataOrSuppressedAndActive(activeLegendItem, val) {
			if (
			(activeLegendItem === String(mNoDataFlagID) ||
				activeLegendItem === String(mSuppressedFlagID)) &&
			String(val) === activeLegendItem
			) {
			return true;
			}
			return false;
		}
		
		function isValueInActiveLegend(val) {
			var minVal;
			var maxVal;
			var splitVal;

			for (let i = 0; i < mActiveLegendItems.length; i += 1) {
			if (isNoDataOrSuppressedAndActive(mActiveLegendItems[i], val)) {
				return true;
			}
			splitVal = mActiveLegendItems[i].split("-");
			minVal = +splitVal[0];
			maxVal = +splitVal[1];
			if (+val >= minVal && +val <= maxVal) {
				return true;
			}
			}

			return false;
		}

		function legendClickHandler(evt) {
			// 12Apr2021  var legendItemLabel;
			var index;
			var itemLabel;
			var $chkBxObj;

			// 12Apr2021 DIAB-13
			if (
			evt.target &&
			evt.target.nodeName.toLowerCase() === "input".toLowerCase()
			) {
			itemLabel = $(evt.target).val();
			$chkBxObj = $(evt.target);
			// 24Feb2022 } else if (evt.target.className === "dataBox") {
			} else if ($(evt.target).hasClass("da-maplegend-box")) {
			itemLabel = $(evt.target).find("input").val();
			$chkBxObj = $(evt.target).find("input");
			}
			index = mActiveLegendItems.indexOf(itemLabel);
			if (index > -1) {
			mActiveLegendItems.splice(index, 1);
			$chkBxObj.prop("checked", false);
			} else {
			// 12Apr2021 DIAB-13  mActiveLegendItems.push(legendItemLabel);
			mActiveLegendItems.push(itemLabel);
			$chkBxObj.prop("checked", true);
			}

			// 12Apr2021 setData();
			updateData(); // 12Apr2021 DIAB-13
			renderMap();
			}
		
		function addEventListeners() {
			//removeEventListeners();
			$(document).on("click", "#us-map-legend", legendClickHandler);
/* 			window.addEventListener("resize", createMap);
			publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
			function () {
				createMap();
			}; */
		}
		// original from Diabetes Atlas app 6/30/22
		function loadMapLegend() {
			var i;
			var legendTemplateConfig;
			var legendItems = [];
			var legendItemObj;
			var displayLabel;
			var colorHexVal;
			var colorStyle;
			var noDataColorHexVal;
			var suppressedDataColorHexVal;
			var legendCompiledTemplateHTML;
			var legendGeneratedHTML;
			var legendItemVal; // 11Apr2019
			let bgColor;
			let fontColor;
			let isActive;

			$("#us-map-legend").empty();

			// No Data Box is First
			noDataColorHexVal = "#dee2e6";   // mConfig.DataParameters.getNoDataColorHexVal();
			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" + noDataColorHexVal,
				DisplayLabel: "No Data",
				ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: 1,  // mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
			};
			legendItems.push(legendItemObj);

			if (mLegendData.length) {
			for (i = 0; i < mLegendData.length; i += 1) {
				displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
				legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019
				//colorHexVal = mLegendData[i].color_hexval;

				//debugger;

				// 18Mar2022, DIAB-88 colorStyle = "color:black !important;background-color:" + colorHexVal;
				// 18Mar2022, DIAB-88
				bgColor = getColor(i+1);
				fontColor = getFontColor(i+1);
				colorStyle = "color:" + fontColor + " !important;background-color:" + bgColor;
				isActive = mLegendData[i].active;
				
				legendItemObj = {
					ColorStyle: colorStyle,
					DisplayLabel: displayLabel,
					ItemValue: legendItemVal,
					IsChecked: isActive,
					//IsChecked: mActiveLegendItems.indexOf(displayLabel) > -1
				};
				legendItems.push(legendItemObj);
			}



/* 			// Suppressed Data
			suppressedDataColorHexVal = "Gray";  // mConfig.DataParameters.getSuppressedDataColorHexVal();
			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" +
				suppressedDataColorHexVal,
				DisplayLabel: "Suppressed",
				ItemValue: mSuppressedFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: mActiveLegendItems.indexOf(String(mSuppressedFlagID)) > -1
			};
			legendItems.push(legendItemObj); */

			legendTemplateConfig = {
				LegendDivID: "us-map-legend",
				LegendItems: legendItems
			};

			// Generate the HTML for the legend
			//legendCompiledTemplateHTML = Handlebars.compile(legendTemplateHTML);
			//	legendGeneratedHTML = legendCompiledTemplateHTML(legendTemplateConfig);
				
				legendGeneratedHTML = "<div id='us-map-legend' class='d-flex justify-content-center da-map-legend mb-1'>";
				legendItems.forEach((leg) => {
					let isCheckedStr;
					let seeLeg = leg;
					if (leg.IsChecked === 1) {
						isCheckedStr = "checked";
					} else {
						isCheckedStr = "";
					}
					//debugger;
					legendGeneratedHTML += `<div class='px-2 py-1 da-maplegend-box border border-secondary' style='${leg.ColorStyle}'>
        			<input class='form-check-input' type='checkbox' value='${leg.ItemValue}' ${isCheckedStr} style='margin-right:3px;cursor:pointer"
            			aria-label='${leg.DisplayLabel}' autocomplete='off'>${leg.DisplayLabel}</input></div>`;
				});



				legendGeneratedHTML += "</div>";
				
			// now add the legend to the map div
				// - could use this method to pass in the parent id
/* 				const $MapContainer = $("#" + mConfig.ParentID); // 25Feb2022
				$MapContainer.append(legendGeneratedHTML); */
				
				// now add the legend to the map div
				$("#us-map-legend").html(legendGeneratedHTML);
			}
		}
	}
}
