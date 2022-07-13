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
		this.startYear = props.startYear; // time period start year selected
	}
	
	render(geometries) {
		let mLegendData;
		let mEstimateByStateID = {};
		let mStateNameByStateID = {};
		let mActiveLegendItems = [];
		let mActiveLegendItemColors = [];
		const mSuppressedFlagID = -2;
		const mNoDataFlagID = -1;
		const mInActiveFlagID = -3;
		let mColorByStateID = {};
		let mInActiveColor = "#FFFFFF";
		const noDataColorHexVal = "#dee2e6";
		const unreliableHexVal = "#9b9ea1";

		//const svgId = this.mapVizId;
		const svgId = `${this.mapVizId}-svg`;
		
		// Need to clear out the last map that was generated
		$(`#${this.mapVizId}`).empty();
		
		const MapSvgDefs =
			`<defs>
					<pattern id="forwardHash" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<rect width="4" height="8" transform="translate(0,0)" fill="#bbb"></rect>
					</pattern>
				</defs>`;

		
		function getTooltipConstructor(vizId) {
			const propertyLookup = {
				STATE_NAME: { title: "STATE: ", datumType: "string" },
				estimate: { title: "Estimate: ", datumType: "string" },
				flag: { title: "Flag: ", datumType: "string" },
				"": { title: "", datumType: "empty" },
			};

			const headerProps = ["STATE_NAME", ""];
			const bodyProps = ["estimate","flag"];
			return { propertyLookup, headerProps, bodyProps, svgId, vizId };
		}
		const genTooltip = new GenTooltip(getTooltipConstructor(this.mapVizId));

		//const copiedData = [...this.data];

		console.log("###genMAP incoming geometries:", geometries);
		console.log("###genMAP incoming data:", this.data);

		// remove all records without an estimate
		// - NO DONT DO THIS - we need this data in the graphs and maps
		/* 		this.data = this.data
						.filter(function (d) {
							//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
							if (('estimate' in d) && (d.estimate !== undefined) && (d.estimate !== "")) {
								return d;
							}
						}); */
		
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
		// same as above but remove WHITE
		mActiveLegendItemColors = ["#e4f2e1", "#8dcebb", "#00a9b5", "#007fbe", "#00008b"];
		function getColor(bin,flag) {
			let index;
			let binColor = bgColors[bin]; // this IS based on position of the bin to the color
			
			// Check if the legend bin is inactive...
			// -- if it is, then return WHITE
			//console.log("active colors list:", mActiveLegendItemColors);
			//console.log("check this bincolor:", binColor);
			index = mActiveLegendItemColors.indexOf(binColor);
			//console.log("bincolor index check:", index);
			// Add or Remove that color to/from the Active list of colors
			// - note the ORDER of the colors is NOT related to the bin number
			// - this just tracks whether that color is ACTIVE or not
			if (flag === "- - -") {
				// ignore bin set to light gray
				return noDataColorHexVal;
			} else if (flag === "*") {
				return "url(#forwardHash)";
				// ignore bin set to dark gray
				//return unreliableHexVal;
			} else if (flag === "**") {
				// Set to cross hatch
				return "url(#forwardHash)";
			} else if (index > -1) {
				// COLOR FOUND
				//console.log("RETURNING bincolor:", binColor);
				return binColor;
			} else {
				// COLOR NOT FOUND - so NOT ACTIVE
				//return "url(#forwardHash)";  // <-- need ANOTHER case where null data gets the cross hatch?
				return "#FFFFFF";
			}
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
		
		svg.append("defs").append("pattern")
			.attr('id', 'forwardHash')
			.attr("width", 8)
			.attr("height", 8)
			.attr('patternUnits', "userSpaceOnUse")
			.attr('patternTransform', "rotate(45)")
			.append('rect')
			.attr("width", 4)
			.attr("height", 8)
			.attr('fill', '#bbb')
			.attr("transform", "translate(0,0)");


		// join the data of territories with the incoming data
		geometries.forEach((g) => {
			//let estimateRange = this.data.filter((d) => d.stub_label_num === g.properties.STATE_FIPS)[0]?.estimate;
			let estimateMatch = this.data
				.filter(function (d) {
					// for debugging specific states only - can set the territory code to investigate
					if (parseInt(d.stub_label_num) === 72 && parseInt(g.properties.STATE_FIPS) === 72) {
						console.log("STATES: d , d.bin, d.flag, g", d, d.class, d.flag, g);
					}
					//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
					if (parseInt(d.stub_label_num) === parseInt(g.properties.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.estimate ? d.estimate : null;
					}
				});
			
			let classBin = this.data
				.filter(function (d) {
					//console.log("d , d.bin:", d, d.class);
					if (parseInt(d.stub_label_num) === parseInt(g.properties.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.class ? d.class : null;
					}
				});

			let theFlag = this.data
				.filter(function (d) {
					if (parseInt(d.stub_label_num) === parseInt(g.properties.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", t.STATE_FIPS, " estimate:", d.estimate);
						return d.flag ? d.flag : null;
					}
				});
			if (theFlag.length > 0) {
				theFlag = theFlag[0].flag;
			} else {
				theFlag = "none";
			}

			console.log("STATES FLAG:",g.properties.STATE_FIPS,theFlag)

			//console.log("---- FOR G FIPS:", g.properties.STATE_FIPS," estimateMatch:", estimateMatch, " classBin:",classBin[0].class);

			if (estimateMatch.length > 0) {
				estimateMatch = estimateMatch[0].estimate;
			} else {
				estimateMatch = null;
			}

/* 			if (theFlag === "*") {
				// duplicate the geometry and add cross hatching
				let geomHatch = g;
				geomHatch.flag = "**"; // set special code so getColor returns crosshatch
				geometries.push({
						...geomHatch,
						estimate: null,
						class: null,
						flag: geomHatch.flag,
				});
			} */
			
			if (classBin[0] !== undefined) {
				if (classBin[0].hasOwnProperty("class")) {
					g.properties = {
						...g.properties,
						estimate: parseFloat(estimateMatch),
						class: parseInt(classBin[0].class),
						active: 1,  // default initial to all checked
						flag: theFlag,
					};
				} else {
					g.properties = {
						...g.properties,
						estimate: parseFloat(estimateMatch),
						class: null,
						active: 1,  // default initial to all checked
						flag: theFlag,
					};
					console.log("### classBin has no class!", classBin[0]);
				}
			} else {
				g.properties = {
					...g.properties,
					estimate: null,
					class: null,
					active: 1,  // default initial to all checked
					flag: theFlag,
				};
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
			.style("fill", (d) => getColor(d.properties.class,d.properties.flag));

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
			//console.log("TERR t:", t);

			let estimateMatch = this.data
				.filter(function (d) {
					//console.log("for stub state:", d.stub_label_num, " G FIPS is:", g.properties.STATE_FIPS, " estimate:", d.estimate);
					if (parseInt(d.stub_label_num) === parseInt(t.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", g.properties.STATE_FIPS, " estimate:", d.estimate);
						return d.estimate ? d.estimate : null;
					}
				});

			let classBin = this.data
				.filter(function (d) {
					// for debugging specific territories only - can set the territory code to investigate
					if (parseInt(t.STATE_FIPS) === 60) {
						//console.log("TERRITORIES: d , d.bin, t", d, d.class, t);
					}
					////////////////////////////////////////////

					// this code is needed for the app, not for debugging
					if (parseInt(d.stub_label_num) === parseInt(t.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", t.STATE_FIPS, " estimate:", d.estimate);
						return d.class ? d.class : null;
					}
				});
			
			let theFlag = this.data
				.filter(function (d) {
					if (parseInt(d.stub_label_num) === parseInt(t.STATE_FIPS)) {
						//console.log("### FIPS code MATCH:", t.STATE_FIPS, " estimate:", d.estimate);
						return d.flag ? d.flag : null;
					}
				});
			if (theFlag.length > 0) {
				theFlag = theFlag[0].flag;
			} else {
				theFlag = "";
			}


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
						flag: theFlag,
					});
				} else {
					filteredTerritories.push({
						...t,
						estimate: null,
						class: null,
						flag: theFlag,
					});
					console.log("### TERRITORY classBin has no class! ####", classBin[0]);
				}
			} else {
				filteredTerritories.push({
					...t,
					estimate: null,
					class: null,
					flag: theFlag,
				});
			}

			// NEED THE FLAG in the territories because data and class can be null, but there are 2 flags "- - -" and "*"

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
			.style("fill", function (d) {
				console.log("Territories FILL getcolor for d:", d);
				return getColor(d.class,d.flag);
			})
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
		//debugger;
		mActiveLegendItems = getDefaultActiveLegendItems();

		loadMapLegend();
		addEventListeners(); // detect clicks

		// call this in click event handler when legend is being clicked on and off
		function updateMap() {
			let t = d3.transition().duration(250);

			//debugger;
			// update the colors for STATES
			d3.selectAll("#states path")
				.style("fill", function (d) {
					//console.log("updateMap d=", d);
					return getColor(d.properties.class,d.properties.flag);
				});

			// update the colors for TERRITORIES - separate bc the territory data format is DIFFERENT
			d3.selectAll("#territoryGroup rect")
				.style("fill", function (d) {
					console.log("updateMap TERRITORY color from class d=", d); // did this func just to debug coloring
					return getColor(d.class,d.flag); // pass in both to get this right
				});
		}

		// this just generates a LIST  of ALL ITEMS out of the mlegendData array
		// - it does not do any filtering yet
		// - this just starts off the active legend list
		  function getDefaultActiveLegendItems() {
			var activeLegendItems;
			activeLegendItems = [];
			activeLegendItems.push(String(mNoDataFlagID)); // No Data = 0th item always
			//activeLegendItems.push(String(mSuppressedFlagID)); // Suppressed

			for (let i = 0; i < mLegendData.length; i += 1) {
			activeLegendItems.push(mLegendData[i].min + " - " + mLegendData[i].max);
			}

			return activeLegendItems;
		  }
		
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

		function updateData() {
			var val;
			mEstimateByStateID = {};
			mColorByStateID = {};

			mCurrentYearData.Data.forEach(function (d) {
			if (d.IsSuppressed) {
				val = mSuppressedFlagID;
			} else if (d.IsNoData) {
				val = mNoDataFlagID;
			} else {
				val = d.Value;
			}

			if (isValueInActiveLegend(val)) {
				mEstimateByStateID[+d.GeoID] = val;
				mColorByStateID[+d.GeoID] = d.Color_HexVal;
			} else {
				mEstimateByStateID[+d.GeoID] = mInActiveFlagID;
				mColorByStateID[+d.GeoID] = mInActiveColor;
			}
			});
		}

		function convertRGB(rgb) {
			// This will choose the correct separator, if there is a "," in your value it will use a comma, otherwise, a separator will not be used.
			var separator = rgb.indexOf(",") > -1 ? "," : " ";


			// This will convert "rgb(r,g,b)" into [r,g,b] so we can use the "+" to convert them back to numbers before using toString 
			rgb = rgb.substr(4).split(")")[0].split(separator);

			// Here we will convert the decimal values to hexadecimal using toString(16)
			var r = (+rgb[0]).toString(16),
				g = (+rgb[1]).toString(16),
				b = (+rgb[2]).toString(16);

			if (r.length == 1)
				r = "0" + r;
			if (g.length == 1)
				g = "0" + g;
			if (b.length == 1)
				b = "0" + b;

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
			console.log("Active colors AFTER click:", mActiveLegendItemColors);
			//debugger;

			if (evt.target && evt.target.nodeName.toLowerCase() === "input".toLowerCase())
			{
				itemLabel = $(evt.target).val();
				$chkBxObj = $(evt.target);
			} else if ($(evt.target).hasClass("da-maplegend-box")) {
				itemLabel = $(evt.target).find("input").val();
				$chkBxObj = $(evt.target).find("input");
			}
			index = mActiveLegendItems.indexOf(itemLabel);

			//console.log("legend Item CLICKED:",index, itemLabel, evt);
			//console.log("Active Legend items BEFORE:", mActiveLegendItems);
			if (index > -1) {
				// ITEM FOUND
				// remove it from the list
				mActiveLegendItems.splice(index, 1);
				$chkBxObj.prop("checked", false);
			} else {
				// RE-ENABLE
				// it's not there, so add the item to the active list
				mActiveLegendItems.push(itemLabel);
				$chkBxObj.prop("checked", true);
			}
			//console.log("Active Legend items AFTER:", mActiveLegendItems);
			
			//debugger;

			// tested and dont need this
			//evt.preventDefault();
			
			// just update the colors without redrawing the map
			updateMap();

			}
		
		function addEventListeners() {
			//removeEventListeners();
			$(document).off("click", "#us-map-legend");
			$(document).on("click", "#us-map-legend", legendClickHandler);

			// TO DO: Add back in listener to see if they resize browser
			// and if they do then resize map all over again
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
			//var noDataColorHexVal;
			var suppressedDataColorHexVal;
			var legendCompiledTemplateHTML;
			var legendGeneratedHTML;
			var legendItemVal; // 11Apr2019
			let bgColor;
			let fontColor;
			let isActive;

			$("#us-map-legend").empty();

			// No Data Box is First
			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" + noDataColorHexVal,
				DisplayLabel: "No Data",
				ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: 1,  // always start it checked // OLD - mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
			};
			legendItems.push(legendItemObj);

			// No Data Unreliable - THEY ASKED TO DISABLE UNRELIABLE FROM THE LEGEND
			// - instead we just have cross hatching in the state or territory if flag = "*"
/* 			legendItemObj = {
				ColorStyle:
				"color:black !important; background-color:" + unreliableHexVal,
				DisplayLabel: "Unreliable",
				ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
				IsChecked: 1,  // always start it checked // OLD - mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
			};
			legendItems.push(legendItemObj); */

			let nullFlag = false;
			if (mLegendData.length) {
				for (i = 0; i < mLegendData.length; i += 1) {
			
				displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
				legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019
				//colorHexVal = mLegendData[i].color_hexval;

				if (displayLabel.match("null")) {
					// then skip adding that as a legend item
					// bc we hardcoded that item above
					nullFlag = true;
					continue; 
					// then it is "Unreliable"

					displayLabel = "Unreliable";
					legendItemVal = "Unreliable";
					// how to set crosshatch??
					fontColor = "#FFFFFF"
					colorStyle = "color:" + fontColor + " !important;background-color:" + "url(#forwardHash)";
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
					//IsChecked: mActiveLegendItems.indexOf(displayLabel) > -1
				};
				legendItems.push(legendItemObj);
				console.log("loadLegend item:", i, legendItemObj);
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
				legendItems.forEach((leg,i) => {
					let isCheckedStr;
					//let seeLeg = leg;
					if (leg.IsChecked === 1) {
						isCheckedStr = "checked";
					} else {
						isCheckedStr = "";
					}
					let legendId = "legend-box-" + i;
					if (leg.DisplayLabel.match("Unreliable")) {
						// for cross hatching, just use white
						legendGeneratedHTML += `<div id='${legendId}' class='px-2 py-1 da-maplegend-box border border-secondary' style='${leg.ColorStyle}'>
        			<input class='form-check-input' type='checkbox' value='${leg.ItemValue}' ${isCheckedStr} style='margin-right:3px;cursor:pointer"
            			aria-label='${leg.DisplayLabel}' autocomplete='off'>${leg.DisplayLabel}</input></div>`;
					} else {
						// draw regular with color
						//debugger;
						legendGeneratedHTML += `<div id='${legendId}' class='px-2 py-1 da-maplegend-box border border-secondary' style='${leg.ColorStyle}'>
        			<input class='form-check-input' type='checkbox' value='${leg.ItemValue}' ${isCheckedStr} style='margin-right:3px;cursor:pointer"
            			aria-label='${leg.DisplayLabel}' autocomplete='off'>${leg.DisplayLabel}</input></div>`;
					}
				});
				legendGeneratedHTML += "</div>";
				
				// now add the legend to the map div
				// - could use this method to pass in the parent id
/* 				const $MapContainer = $("#" + mConfig.ParentID); // 25Feb2022
				$MapContainer.append(legendGeneratedHTML); */
				
				// now add the legend to the map div
				$("#us-map-legend").html(legendGeneratedHTML);

				// now grab the Unreliable legend item and add crosshatching
				// - NO we don't need to crosshatch this box anymore; just darker gray
				//$("#legend-box-1").attr("style", "background-color:url(#forwardHash) !important;");


			}
		}
	}
}
