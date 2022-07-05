import { DataCache } from "../../utils/datacache";
import * as d3 from "../../lib/d3.min";
import { GenTooltip } from "../general/genTooltip";
import { getGenSvgScale } from "../../utils/genSvgScale";
import { ClassifyData } from "../../utils/ClassifyDataNT";

export class GenMap {
	constructor(props) {
		this.data = props.mapData;
		this.mapVizId = props.vizId;
		this.mLegendData;
		this.mSuppressedFlagID = -2;
  		this.mNoDataFlagID = -1;
  		this.mInActiveFlagID = -3;
  		this.mColorByStateID = {};
  		this.mInActiveColor = "#FFFFFF";
	}

	render(geometries) {
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
        // STANDARD BREAKS  = 1
        // NATURAL BREAKS   = 2
        // EQUAL INTERVAL   = 3

        var StandardBreaksObj = ClassifyData(this.data, "estimate", 5, 1);
        console.log("%c%s\t%o", "background-color:Aqua;", "Standard Breaks", StandardBreaksObj);
        console.log(JSON.stringify(StandardBreaksObj.legend));

        var NaturalBreaksObj = ClassifyData(this.data, "estimate", 5, 2);
        console.log("%c%s\t%o", "background-color:PaleGoldenrod;", "Natural Breaks", NaturalBreaksObj);
        console.log(JSON.stringify(NaturalBreaksObj.legend));

        var EqualIntervalObj = ClassifyData(this.data, "estimate", 5, 3);
        console.log("%c%s\t%o", "background-color:LightGreen;", "Equal Interval", EqualIntervalObj);
		console.log(JSON.stringify(EqualIntervalObj.legend));
		

		// for testing hardcode one year period
/* 		this.data = this.data.filter(
					(d) => parseInt(d.year_pt) === parseInt("2005")
		); */
		//console.log("###genMAP incoming 2013 data:", this.data);
		//debugger;

		function mouseover() {
			const thisElement = d3.select(this);
			console.log("rollover selected element:", thisElement);
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

		const colors = {
			"No case reported": "white",
			"1-49 cases": "#e4f2e1",
			"50-99 cases": "#8dcebb",
			"100-199 cases": "#00a9b5",
			"200-299 cases": "#007fbe",
			"300-399 cases": "#004fb8",
			"400+ cases": "#00008b",
		};

		const dotColors = ["#FFFFFF", "#e4f2e1", "#8dcebb", "#00a9b5", "#007fbe","#00008b", "#FFFFFF"];
		function getColor(p) {
			switch (true) {
				case p === null:
					return dotColors[0];
				case p <= 4:
					return dotColors[1];
				case p <= 8:
					return dotColors[2];
				case p <= 12:
					return dotColors[3];
				case p < 16:
					return dotColors[4];
				case p < 20:
					return dotColors[5];
				default:
					return dotColors[6];
			}
		};

/* 		console.log("color for 2.6:", getColor(2.6));
		console.log("color for 5.6:", getColor(5.6));
		console.log("color for 9.6:", getColor(9.6));
		console.log("color for 10.6:", getColor(10.6));
		console.log("color for 13.6:", getColor(13.6));
		console.log("color for 17.6:", getColor(17.6)); */
		
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

			//console.log("---- FOR G FIPS:", g.properties.STATE_FIPS," estimateMatch:", estimateMatch);

			if (estimateMatch.length > 0) {
				estimateMatch = estimateMatch[0].estimate;
			} else {
				estimateMatch = 0;
			}

			g.properties = {
				...g.properties,
				estimate: parseFloat(estimateMatch),
			};
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
			.style("fill", (d) => getColor(d.properties.estimate));
			//.style("fill", (d) => getColor(d.estimate));

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

			//console.log("---- FOR G FIPS:", g.properties.STATE_FIPS," estimateMatch:", estimateMatch);

			if (estimateMatch.length > 0) {
				estimateMatch = estimateMatch[0].estimate;
			} else {
				estimateMatch = "No case reported.";
			}

			filteredTerritories.push({
				...t,
				estimate: estimateMatch,
			});
		});

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
			.style("fill", (d) => getColor(d.estimate))
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
			.attr("font-family", "monospace")
			.text((d) => d.desiredAbbr)
			.attr("pointer-events", "none");

		d3.selectAll("#states path, #territoryGroup rect")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseout", mouseout);

		genTooltip.render();


		

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

			$("#divMapLegend").remove();

			if (mLegendData.length) {
			for (i = 0; i < mLegendData.length; i += 1) {
				displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
				legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019
				colorHexVal = mLegendData[i].color_hexval;

				// 18Mar2022, DIAB-88 colorStyle = "color:black !important;background-color:" + colorHexVal;
				// 18Mar2022, DIAB-88
				if (i > 1) {
				colorStyle = "color:white !important;background-color:" + colorHexVal;
				} else {
				colorStyle = "color:black !important;background-color:" + colorHexVal;
				}

				legendItemObj = {
				ColorStyle: colorStyle,
				DisplayLabel: displayLabel,
				ItemValue: legendItemVal,
				IsChecked: mActiveLegendItems.indexOf(displayLabel) > -1
				};
				legendItems.push(legendItemObj);
			}

			// No Data
			noDataColorHexVal = mConfig.DataParameters.getNoDataColorHexVal();
			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" + noDataColorHexVal,
				DisplayLabel: "No Data",
				ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
			};
			legendItems.push(legendItemObj);

			// Suppressed Data
			suppressedDataColorHexVal =
				mConfig.DataParameters.getSuppressedDataColorHexVal();
			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" +
				suppressedDataColorHexVal,
				DisplayLabel: "Suppressed",
				ItemValue: mSuppressedFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: mActiveLegendItems.indexOf(String(mSuppressedFlagID)) > -1
			};
			legendItems.push(legendItemObj);

			legendTemplateConfig = {
				LegendDivID: "divMapLegend",
				LegendItems: legendItems
			};

			legendCompiledTemplateHTML = Handlebars.compile(legendTemplateHTML);
			legendGeneratedHTML = legendCompiledTemplateHTML(legendTemplateConfig);
			const $MapContainer = $("#" + mConfig.ParentID); // 25Feb2022
			$MapContainer.append(legendGeneratedHTML);
			}
		}
	}
}
