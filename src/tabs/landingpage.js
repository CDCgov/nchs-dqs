import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
// import * as config from "../components/landingPage/config";
// import { PageEvents } from "../eventhandlers/pageevents";
import { GenChart } from "../components/general/genChart";
import { GenMap } from "../components/general/genMap";
import * as hashTab from "../utils/hashTab";
import { MainEvents } from "../eventhandlers/mainevents";

export class LandingPage {
	constructor() {
		this.allData = null;
		this.currentData = null;
		this.currentLocation = null;
		this.classification = null;
		this.currentCategories = null;
		this.savedCategories = null;
		this.subNav = null;
		this.maxDate = null;
		this.catUpdate = true;
		this.classUpdate = true;
		this.locationUpdate = true;
		this.popFactorsInitURL = `${process.env.API_URL}nchs-home`;
		this.csv = null;
		this.defaultDropdown = null;
		this.chartConfig = null;
		this.currentNamedCategories = [];
		this.yScaleType = null; // linear or log
		this.chartValueProperty = null;
		this.flattenedFilteredData = null;
		this.vizId = "chart-container";
		// select data items - set some defaults
		this.dataTopic = "obesity-child"; // default
		this.dataFile = "content/json/ObesityChildren.json"; // default is Obesity
		this.chartTitle = "Obesity Among Children and Adolescents";
		this.panelNum = 1;
		this.stubNameNum = 0;
		this.startPeriod = "1988-1994";
		this.startYear = "1988"; // first year of the first period
		this.endPeriod = "2013-2016";
		this.endYear = "2013"; // first year of the last period
		this.footNotes = "";
		this.footnoteMap = {};
		this.unitNum = 1; // default 1 obesity
		this.unitNumText = "";
		this.showBarChart = 0;
		this.showMap = 0;
		this.geometries = {};
		this.classifyType = 2; // 1 = Quartiles, 2 = Natural, 3 = EqualIntervals
		this.enableCI = 0; // 1 = Enable Confidence Intervals for datasets that have them
		this.selections = null;
		this.currentTimePeriodIndex = 0;
		this.animating = false;
	}

	renderTab() {
		document.getElementById("maincontent").innerHTML = this.tabContent;

		this.selections = hashTab.getSelections();
		if (this.selections) {
			this.dataTopic = this.selections.topic;
		}

		console.log("hash panel:", this.panelNum);

		this.getInitialData(); // for starters OBESITY DATA
		MainEvents.registerEvents(); // add any click events inside here
	}

	renderAfterDataReady() {
		if (this.selections) {
			this.panelNum = parseInt(this.selections.subTopic, 10);
			this.stubNameNum = parseInt(this.selections.characteristic, 10);
			this.updateDataTopic(this.dataTopic, true);

			if (this.selections.viewSinglePeriod) {
				$("#year-end-label").hide();
				$("#year-end-select").hide();
				this.showBarChart = true;
			} else {
				$("#year-end-label").show();
				$("#year-end-select").show();
				this.showBarChart = false;
			}
		}

		// set default yscale:
		if (!this.yScaleType) {
			this.yScaleType = "linear";
			this.storedScaleState = "linear";
		}

		$(".dimmer").attr("class", "ui inverted dimmer");
		this.renderChart();
	}

	getInitialData() {
		async function getSelectedData() {
			return DataCache.ObesityData ?? Utils.getJsonFile("content/json/ObesityChildren.json");
		}

		async function getFootnoteData() {
			return DataCache.Footnotes ?? Utils.getJsonFile("content/json/FootNotes.json");
		}

		async function getUSMapData() {
			return DataCache.USMapData ?? Utils.getJsonFile("content/json/State_Territory_FluView1.json");
		}

		DataCache.activeLegendList = [];

		// getUSMapData - if we do it here we just load the map date ONE TIME
		Promise.all([getSelectedData(), getFootnoteData(), getUSMapData()])
			.then((data) => {
				//const [destructuredData] = data;
				[DataCache.ObesityData, DataCache.Footnotes, DataCache.USTopo] = data;
				DataCache.USTopo = JSON.parse(DataCache.USTopo);
				const { geometries } = DataCache.USTopo.objects.State_Territory_FluView1;
				this.geometries = geometries;

				this.allData = JSON.parse(data[0]);
				DataCache.ObesityData = this.allData;
				this.footNotes = JSON.parse(data[1]);
				DataCache.Footnotes = this.footNotes;

				// build footnote map - but this needs to be done on EVERY data change
				this.footnoteMap = {};
				let i = null;
				for (i = 0; this.footNotes.length > i; i += 1) {
					this.footnoteMap[this.footNotes[i].fn_id] = this.footNotes[i].fn_text;
				}

				// create a year_pt col from time period
				if (this.dataTopic === "obesity-child" || this.dataTopic === "obesity-adult") {
					this.allData = this.allData
						.filter(function (d) {
							if (d.flag === "- - -") {
								return (d.estimate = null); // estimate missing so fill in with null???
							} else {
								return d;
							}
						})
						.map((d) => ({
							...d,
							estimate: parseFloat(d.estimate),
							year_pt: this.getYear(d.year),
							dontDraw: false,
							assignedLegendColor: "#FFFFFF",
						}));
					this.renderAfterDataReady();
				} else {
					this.allData = this.allData
						.filter(function (d) {
							if (d.flag === "- - -") {
								d.estimate = null;
								return d;
							} else {
								return d;
							}
						})
						.map((d) => ({
							...d,
							estimate: parseFloat(d.estimate),
							year_pt: d.year,
							dontDraw: false,
							assignedLegendColor: "#FFFFFF",
						}));
					this.renderAfterDataReady();
				}
			})
			.catch(function (err) {
				console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`);
			});
	}

	getYear(period) {
		const yearsArray = period.split("-");
		return parseInt(yearsArray[0]);
	}

	getSelectorText(sel) {
		return sel.options[sel.selectedIndex].text;
	}

	renderMap() {
		// NOTE: the map tab DIV MUST be visible so that the vizId is rendered
		$("#us-map-container").show();

		// If TOTAL is selected we CANNOT DRAW THE MAP, so show a message
		if (this.stubNameNum === 0) {
			// need to SHOW A MESSAGE
			$("#us-map-message").html("Please select a Characteristic that supports US Map data.");
			$("#us-map-legend").hide();
			$("#us-map-time-slider").hide();
		} else {
			$("#us-map-message").html("");
			// get rid of the big margins
			$("#us-map-message").hide();
			$("#us-map-legend").show();
			$("#us-map-time-slider").show();

			// (TTTT) to do the PLAY legend - can't do this
			// -- you need to pass ALL THE DATA to do the PLAY function
			// assuming you program the PLAY inside of genMap

			// Get filtered data
			let stateData = this.getFlattenedFilteredData();
			// but need to narrow it to the selected time period
			const allDates = this.allData.map((d) => d.year).filter((v, i, a) => a.indexOf(v) === i);
			stateData = stateData.filter((d) => parseInt(d.year_pt) === parseInt(this.startYear));
			this.flattenedFilteredData = stateData;

			const mapVizId = "us-map";
			let map = new GenMap({
				mapData: stateData, // misCdata[3].Jurisdiction2,
				vizId: mapVizId,
				classifyType: this.classifyType,
				startYear: parseInt(this.startYear),
				allDates,
				currentTimePeriodIndex: this.currentTimePeriodIndex,
				animating: this.animating,
			});
			map.render(this.geometries);
			$("#us-map-time-slider").empty();
			map.renderTimeSeriesAxisSelector();
		}

		// always render data table  with the latest data
		this.renderDataTable(this.flattenedFilteredData);
	}

	renderChart(fromHash = false) {
		const flattenedData = this.getFlattenedFilteredData();
		this.flattenedFilteredData = flattenedData;
		//console.log(`landing ${this.dataTopic} filtered data:`, flattenedData);
		this.chartConfig = this.getChartBaseProps();
		this.chartValueProperty = this.chartConfig.chartValueProperty;
		this.chartConfig = this.getAllChartProps(flattenedData, this.chartConfig);
		this.chartConfig.chartTitle = ""; // dont use the built in chart title

		$(`#${this.chartConfig.vizId}`).empty();
		const genChart = new GenChart(this.chartConfig);
		genChart.render();

		// set the title - easier to do it all here based on selectors
		let indicatorText = $("#data-topic-select option:selected").text();
		let stubText = $("#stub-name-num-select option:selected").text();
		if (this.showBarChart) {
			this.chartTitle = indicatorText + " by " + stubText + " in " + this.startPeriod;
		} else {
			this.chartTitle = indicatorText + " by " + stubText + " from " + this.startPeriod + " to " + this.endPeriod;
		}
		$("#chart-title").html(`<strong>${this.chartTitle}</strong>`);
		let panelText = $("#panel-num-select option:selected").text(); //this.getSelectorText("#data-topic-select");
		this.chartSubTitle = "Subtopic: " + panelText;
		$("#chart-subtitle").html(`<strong>${this.chartSubTitle}</strong>`);

		// always render data table  with the latest data
		this.renderDataTable(this.flattenedFilteredData);
		hashTab.writeHashToUrl();

}

	getFlattenedFilteredData() {
		let selectedPanelData;
		//debugger;
		switch (this.dataTopic) {
			case "obesity-child":
			case "obesity-adult":
			case "birthweight":
			case "infant-mortality":
				// correct panel num = NA
				if (this.panelNum === "NA") {
					// set to valid value
					this.panelNum = 1;
				}
				selectedPanelData = this.allData.filter(
					(d) =>
						parseInt(d.panel_num) === parseInt(this.panelNum) &&
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				break;
			case "suicide":
				selectedPanelData = this.allData.filter(
					(d) =>
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				break;
			case "injury":
				// BE CAREFUL not sure if this will work universally
				if (this.stubNameNum === "0") {
					// set to a valid value
					this.stubNameNum = "1";
				}
				if (this.unitNum === "1") {
					// set to a valid value
					this.unitNum = "2";
				}
				if (this.unitNum === 1) {
					// set to a valid value
					this.unitNum = 2;
				}

				selectedPanelData = this.allData.filter(
					(d) =>
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				break;
			case "medicaidU65":

				selectedPanelData = this.allData.filter(
					(d) =>
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				
				// MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
				// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
				if (selectedPanelData) {
					if (selectedPanelData[0].hasOwnProperty("estimate_uci")) {
						// enable the CI checkbox
						$("#enable-CI-checkbox").prop("disabled", false);
					} else {
						// disable it
						$("#enable-CI-checkbox").prop("disabled", true);
						$("#enable-CI-checkbox").prop("checked", false);
					}
				}

				break;
		}

		// DONT ADD CODE LIKE THIS...
		// *** WE WANT TO LEAVE ESTIMATES AS null IF INVALID SO IT SHOWS A MISSING AREA
		// remove any remaining data where estimate is blank or null
		//selectedPanelData = selectedPanelData.filter(function (d) { return d.estimate != ""  && d.estimate != null && d.estimate; });
		/* 		selectedPanelData = selectedPanelData.filter(function (d) { 
					if(isNaN(d.estimate)){
						return false;
					} else {
						return true;
					}
				}); */

		// now sort in order of the year for Bar Charts & Line Charts
		// - D3 draws in order sent to the charting function
		selectedPanelData.sort((a, b) => {
			return a.year_pt - b.year_pt;
		});

		// now sort by stub_label_num
		// - do not sort alphabetically bc that results in "Below 100%" values in wrong order
		selectedPanelData.sort((a, b) => {
			return a.stub_label_num - b.stub_label_num;
			//return a.stub_label - b.stub_label;
		}); 

		if (this.showBarChart) {
			// filter to just the start year
			selectedPanelData = selectedPanelData.filter((d) => parseInt(d.year_pt) === parseInt(this.startYear));
		} else {
			
			// set up for line chart
			selectedPanelData = selectedPanelData.map((d) => ({
				...d,
				subLine: d.stub_label,
			}));
		}

		let allFootnoteIdsArray = d3
			.map(selectedPanelData, function (d) {
				return d.footnote_id_list;
			})
			.keys();
		// console.log("**********************footnote ids: ", allFootnoteIdsArray);
		this.updateFootnotes(allFootnoteIdsArray, this.dataTopic);

		// "date" property is necessary for correctly positioning data point for these charts
		if (this.dataTopic === "suicide" || this.dataTopic === "medicaidU65")
			return [...selectedPanelData].map((d) => ({
				...d,
				date: new Date(`${d.year}-01-01T00:00:00`),
			}));

		return [...selectedPanelData];
	}

	// can't use getFlattenedFilteredData bc that filters down to existing year set
	// - we need this one to pull all the available years BUT still filter by panel, unit and stubname
	getFilteredYearData() {
		// Make sure panel num is correct
		this.panelNum = $("#panel-num-select option:selected").val();

		let allYearsData;
		switch (this.dataTopic) {
			case "obesity-child":
			case "obesity-adult":
			case "birthweight":
			case "infant-mortality":
				allYearsData = this.allData.filter(
					(d) =>
						parseInt(d.panel_num) === parseInt(this.panelNum) &&
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum)
				);
				break;
			case "suicide":
			case "injury":
			case "medicaidU65":
				// does not use the panel_num
				allYearsData = this.allData.filter(
					(d) =>
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum)
				);
				// on rare data sets unit num 1 does not work
				// ... so try again without the unit num
				if (!(allYearsData.length > 0)) {
					allYearsData = this.allData.filter(
						(d) =>
							parseInt(d.stub_name_num) === parseInt(this.stubNameNum)
					);
				}
				break;
		}
		return [...allYearsData];
	}

	getChartBaseProps() {
		const chartValueProperty = "estimate";

		let yAxisTitle;
		let xAxisTitle;

		// (TTT) since this is driven from text - GET RID OF SWITCH???
		// - wait for a few more datasets to be sure
		switch (this.dataTopic) {
			case "obesity-child":
			case "obesity-adult":
			case "birthweight":
			case "infant-mortality":
			case "medicaidU65":
				yAxisTitle = this.unitNumText; //"Percent of Population, crude (%)";
				break;
			case "suicide":
				yAxisTitle = this.unitNumText; //"Deaths per 100,000 resident population, crude";
				break;
			case "injury":
				yAxisTitle = this.unitNumText; //"Initial injury-related visits in thousands, crude";
				break;
		}
		// X Axis Title is the "Characteristic" selected
		xAxisTitle = $("#stub-name-num-select option:selected").text();
		return { chartValueProperty, yAxisTitle, xAxisTitle };
	}

	getAllChartProps = (data, chartBaseProps) => {
		const { chartValueProperty, yAxisTitle, xAxisTitle } = chartBaseProps;
		const vizId = "chart-container";
		let props;
		// figure out legend placement
		let legendCoordPercents = [0.4, 0.58];
		switch (this.stubNameNum) {
			case 0:
				legendCoordPercents = [0.38, 0.75];
				break;
			case 1:
				legendCoordPercents = [0.4, 0.7];
				break;
			case 2:
				legendCoordPercents = [0.4, 0.7];
				break;
			case 3:
				legendCoordPercents = [0.25, 0.65];
				break;
			case 4:
				legendCoordPercents = [0.25, 0.51];
				break;
			case 5:
				legendCoordPercents = [0.38, 0.66];
				break;
			default:
				legendCoordPercents = [0.4, 0.58];
				break;
		}
		// if one single year then use bar chart
		let useBars;
		if (this.showBarChart) {
			//yAxisTitle = this.unitNumText;
			useBars = true;
			props = {
				data,
				chartProperties: {
					yLeft1: chartValueProperty,
					xAxis: "stub_label",
					yAxis: "estimate",
					bars: "estimate",
				},
				enableCI: this.enableCI,
				usesLegend: true,
				legendBottom: true,
				usesDateDomainSlider: false,
				usesBars: true,
				usesHoverBars: true,
				barColors: [
					"#6a3d9a",
					"#cab2d6",
					"#ff7f00",
					"#fdbf6f",
					"#e31a1c",
					"#fb9a99",
					"#33a02c",
					"#b2df8a",
					"#1f78b4",
					"#a6cee3",
					"#A6A6A6",
					"#fb9a99",
					"#e31a1c",
					"#cab2d6",
					"#a6cee3",
				],
				chartRotate: true,
				chartRotationPercent: 90,
				bottomAxisRotation: -90,
				xLabelRotatedYAdjust: 10,
				xLabelRotatedXAdjust: -40,
				axisLabelFontScale: 0.55,
				usesChartTitle: true,
				usesLeftAxis: true,
				usesLeftAxisTitle: true,
				usesRightAxis: true,
				usesBottomAxis: true,
				usesBottomAxisTitle: false,
				usesDateAsXAxis: true,
				yLeftLabelScale: 1,

				legendCoordinatePercents: legendCoordPercents,
				leftAxisTitle: yAxisTitle,
				bottomAxisTitle: xAxisTitle,
				formatXAxis: "string",
				usesMultiLineLeftAxis: false,
				vizId,
				genTooltipConstructor: this.getTooltipConstructor(vizId, chartValueProperty),
			};
		} else {
			const scaleTimeIndicators = ["suicide", "Medicaid"];
			const needsScaleTime = scaleTimeIndicators.some((ind) => data[0]?.indicator.includes(ind));

			// ********************* update data
			// DRAW A LINE CHART
			useBars = false;
			props = {
				data,
				chartProperties: {
					yLeft1: chartValueProperty,
					xAxis: needsScaleTime ? "date" : "year",
					yAxis: "estimate",
				},
				enableCI: this.enableCI,
				usesLegend: true,
				legendBottom: true,
				usesDateDomainSlider: false,
				usesBars: false,
				usesHoverBars: false,
				usesChartTitle: true,
				usesLeftAxis: true,
				usesLeftAxisTitle: true,
				usesBottomAxis: true,
				usesBottomAxisTitle: false, // they dont want a title there
				usesDateAsXAxis: true,
				needsScaleTime,
				yLeftLabelScale: 3,
				legendCoordinatePercents: legendCoordPercents,
				leftAxisTitle: yAxisTitle,
				bottomAxisTitle: xAxisTitle,
				formatXAxis: "string",
				usesMultiLineLeftAxis: true,
				multiLineColors: [
					"#88419d",
					"#1f78b4",
					"#b2df8a",
					"#33a02c",
					"#0b84a5",
					"#cc4c02",
					"#690207",
					"#e1ed3e",
					"#7c7e82",
					"#8dddd0",
					"#A6A6A6",
					"#fb9a99",
					"#e31a1c",
					"#cab2d6",
					"#a6cee3",
				],
				multiLineLeftAxisKey: "subLine",
				vizId,
				genTooltipConstructor: this.getTooltipConstructor(vizId, chartValueProperty),
			};
		}

		return props;
	};

	// ORIG SET OF COLORS
	/* 				barColors: [
					"#88419d",
					"#1f78b4",
					"#b2df8a",
					"#33a02c",
					"#0b84a5",
					"#cc4c02",
					"#690207",
					"#e1ed3e",
					"#7c7e82",
					"#8dddd0",
					"#A6A6A6",
					"#fb9a99",
					"#e31a1c",
					"#cab2d6",
					"#a6cee3",
		], */

	getTooltipConstructor = (vizId, chartValueProperty) => {
		const propertyLookup = {
			// list properties needed in tooltip body and give their line titles and datum types
			year: {
				title: "Time Period: ",
				datumType: "string",
			},
			estimate: {
				title: "Estimate: ",
				datumType: "string",
			},
			indicator: {
				title: "Indicator: ",
				datumType: "string",
			},
			unit: {
				title: "Unit: ",
				datumType: "string",
			},
			panel: {
				title: "Subtopic: ",
				datumType: "string",
			},
			stub_name: {
				title: "",
				datumType: "string",
			},
			stub_label: {
				title: "Stub Label: ",
				datumType: "string",
			},
			age: {
				title: "Age Group: ",
				datumType: "string",
			},
			flag: {
				title: "Flag: ",
				datumType: "string",
			},
			estimate_lci: {
				title: "95% confidence LCI: ",
				datumType: "string",
			},
			estimate_uci: {
				title: "95% confidence UCI: ",
				datumType: "string",
			},
			"": { title: "", datumType: "empty" },
		};

		const headerProps = ["stub_name", "stub_label"];
		const bodyProps = ["panel", "unit", chartValueProperty, "estimate_uci", "estimate_lci", "year", "age", "flag"];

		return {
			propertyLookup,
			headerProps,
			bodyProps,
			svgId: `${vizId}-svg`,
			vizId,
		};
	};

	// THIS IS WHERE WE CAN SET WHAT TO VISUALIZE
	// -- compare trends ties viewtype, metric and measure to CORRECT DATA
	// For us we don't need this really until we have 2 or more data sets
	getVizKey() {
		/* 		let viewType = this.viewtype; // view: cases vs. deaths
				let numType = this.metric; // metric: count vs. 100k
				let { measure } = this; // measure: daily vs. cumulative
			*/
		// for now we jus thave one
		return "caseObesity";

		if (viewType === "cases") {
			// Cases data options
			if (numType === "count") {
				// raw numbers
				if (measure === "daily") {
					// new cases
					return "caseRawNewSubmission";
				} // cumulative cases
				return "caseRawCumulativeSubmission";
			} // rate numbers
			if (measure === "daily") {
				// new cases
				return "caseRateNewSubmission";
			} // cumulative cases
			return "caseRateCumulativeSubmission";
		} // Deaths data options
		if (numType === "count") {
			// raw numbers
			if (measure === "daily") {
				// new deaths
				return "deathRawNewSubmission";
			} // cumulative deaths
			return "deathRawCumulativeSubmission";
		} // rate numbers
		if (measure === "daily") {
			// new deaths
			return "deathRateNewSubmission";
		} // cumulative deaths
		return "deathRateCumulativeSubmission";
	}

	updateFootnotes(footnotesIdArray, dataTopic) {
		let footnotesList;
		let sourceList;
		let allFootnotesText = "";
		let sourceText = "";
		// in some cases this gets called with no footnotes.

		if (dataTopic == "obesity-child" && footnotesIdArray[1]) {
			// this includes every item in the footnotes
			footnotesList = footnotesIdArray[1].split(",");

			// get ONLY the source codes list
			sourceList = footnotesList;
			sourceList = sourceList.filter((d) => d.toString().startsWith("SC")); // match(/SC/));
			sourceList.forEach(
				(f) => (sourceText += "<div><b>Source</b>: " + f + ": " + this.footnoteMap[f] + "</div>")
			);

			// now remove the SC notes from footnotesList
			footnotesList = footnotesList.filter((d) => d.substring(0, 2) !== "SC");

			// foreach footnote ID, look it up in the tabnotes and ADD it to text
			allFootnotesText = "";
			footnotesList.forEach(
				(f) => (allFootnotesText += "<p class='footnote-text'>" + f + ": " + this.footnoteMap[f] + "</p>")
			);
		} else if (footnotesIdArray[0]) {
			// this includes every item in the footnotes
			footnotesList = footnotesIdArray[0].split(",");

			// get ONLY the source codes list
			sourceList = footnotesList;
			sourceList = sourceList.filter((d) => d.toString().startsWith("SC")); // match(/SC/));
			sourceList.forEach(
				(f) => (sourceText += "<div><b>Source</b>: " + f + ": " + this.footnoteMap[f] + "</div>")
			);

			// now remove the SC notes from footnotesList
			footnotesList = footnotesList.filter((d) => d.substring(0, 2) !== "SC");

			// foreach footnote ID, look it up in the tabnotes and ADD it to text
			allFootnotesText = "";
			footnotesList.forEach(
				(f) => (allFootnotesText += "<p class='footnote-text'>" + f + ": " + this.footnoteMap[f] + "</p>")
			);
		}
		// update source text
		$("#source-text-map").html(sourceText);
		$("#source-text-chart").html(sourceText);

		// now update the footnotes on the page
		$("#pageFooter").html(allFootnotesText);
		$("#pageFooterTable").show(); // this is the Footnotes line section with the (+) toggle on right
	}

	getFootnoteText(f) {
		const footnote = this.searchJSONArray(DataCache.Footnotes.fn_text, {
			fn_id,
		});

		if (footnotes.length > 0) return footnote;
		return `<p>There was an error pulling footnote` + fn_id + `. Try refreshing your browser to see them.</p>`;
	}

	updateDataTopic(dataTopic, fromHash = false) {
		this.dataTopic = dataTopic; // string
		let selectedDataCache;

		// return the cached data or get the data from file
		async function getSelectedData(dataFile, selectedDataCache) {
			if (selectedDataCache) {
				return selectedDataCache;
			} else {
				// load from file
				const theData = await Utils.getJsonFile(dataFile);
				return theData;
			}
		}

		// clear the list of active legend items
		DataCache.activeLegendList = [];

		let theChartTab = document.getElementById("icons-tab-2");

		// switch to new data source
		switch (dataTopic) {
			case "obesity-child":
				this.dataFile = "content/json/ObesityChildren.json";
				this.chartTitle = "Obesity Among Children and Adolescents";
				selectedDataCache = DataCache.ObesityData;
				this.panelNum = 1;
				// set a valid unit num or else chart breaks
				this.unitNum = 1;
				// show 95% CI checkbox since "suicide" has no se data
				$("#enable-CI-checkbox-wrapper").show();
				break;
			case "obesity-adult":
				this.dataFile = "content/json/ObesityAdults.json";
				this.chartTitle = "Obesity Among Adults";
				selectedDataCache = DataCache.ObesityAdultData;
				this.panelNum = 1;
				// set a valid unit num or else chart breaks
				this.unitNum = 1;
				// show 95% CI checkbox
				$("#enable-CI-checkbox-wrapper").show();
				break;
			case "suicide": // no panel
				this.dataFile = "content/json/DeathRatesForSuicide.json";
				this.chartTitle = "Death Rates for Suicide";
				selectedDataCache = DataCache.SuicideData;
				// set a valid unit num or else chart breaks
				this.unitNum = 2;
				// hide 95% CI checkbox since "suicide" has no se data
				$("#enable-CI-checkbox-wrapper").hide();
				break;
			case "injury":
				this.dataFile = "content/json/InjuryEDVis.json";
				this.chartTitle = "Injury-related Visits to Hospital Emergency Departments";
				selectedDataCache = DataCache.InjuryData;
				this.panelNum = 1;
				// set a valid unit num or else chart breaks
				this.unitNum = 2;
				// hide 95% CI checkbox since "suicide" has no se data
				$("#enable-CI-checkbox-wrapper").hide();
				break;
			case "birthweight":
				this.dataFile = "content/json/LowBirthweightLiveBirths.json";
				this.chartTitle = "Low Birthweight Live Births";
				selectedDataCache = DataCache.BirthweightData;
				this.panelNum = 1;
				// set a valid unit num or else chart breaks
				this.unitNum = 1;
				// hide 95% CI checkbox since "suicide" has no se data
				$("#enable-CI-checkbox-wrapper").hide();
				break;
			case "infant-mortality":
				this.dataFile = "content/json/InfantMortality.json";
				this.chartTitle = "Infant Mortality";
				selectedDataCache = DataCache.InfantMortalityData;
				this.panelNum = 1;
				// set a valid unit num or else chart breaks
				this.unitNum = 1;
				// hide 95% CI checkbox since "suicide" has no se data
				$("#enable-CI-checkbox-wrapper").hide();
				break;
			case "medicaidU65": // no panel
				this.dataFile = "content/json/MedicaidcoveragePersonsUnderAge65.json";
				this.chartTitle = "Medicaid Coverage Among Persons Under Age 65";
				selectedDataCache = DataCache.MedicaidU65Data;
				this.panelNum = "NA"; // no panel
				// set a valid unit num or else chart breaks
				this.unitNum = 2;
				// show 95% CI checkbox
				$("#enable-CI-checkbox-wrapper").show();
				// default unit num does not support CI
				$("#enable-CI-checkbox").prop("disabled", true); // start unchecked
				break;
		}
		// always start new topic with Enable CI disabled
		this.enableCI = 0; // but keep it disabled
		$("#enable-CI-checkbox").prop("checked", false); // start unchecked

		// if we switch Topic then start with Total every time
		if (!fromHash) this.stubNameNum = 0;

		// set the chart title
		$("#chart-title").html(`<strong>${this.chartTitle}</strong>`);

		// now get the data if it has not been fetched already
		// *** PROBLEM: THIS PROMISE IS NOT WAITING FOR DATA TO LOAD
		// -- THEREFORE THE SELECT DROPDOWNS ARE NOT UPDATED ???
		// console.log("ATTEMPTING dataFile Promise:", this.dataFile);
		Promise.all([getSelectedData(this.dataFile, selectedDataCache)])
			.then((data) => {
				// console.log("FULFILLED dataFile Promise:", this.dataFile);
				if (selectedDataCache !== undefined) {
					this.allData = data[0];
				} else {
					this.allData = JSON.parse(data[0]);
				}

				switch (dataTopic) {
					case "obesity-child":
						DataCache.ObesityData = this.allData;
						break;
					case "obesity-adult":
						DataCache.ObesityAdultData = this.allData;
						break;
					case "suicide":
						DataCache.SuicideData = this.allData;
						break;
					case "injury":
						DataCache.InjuryData = this.allData;
						break;
					case "birthweight":
						DataCache.BirthweightData = this.allData;
						break;
					case "infant-mortality":
						DataCache.InfantMortalityData = this.allData;
						break;
					case "medicaidU65":
						DataCache.MedicaidU65Data = this.allData;
						break;
				}

				// create a year_pt col from time period
				this.allData = this.allData
					// ONLY FOR US MAP - dont filter out "- - -"
					// No need this data to draw as gray  -> .filter((d) => d.flag !== "- - -") // remove undefined data
					.map((d) => ({
						...d,
						estimate: parseFloat(d.estimate),
						year_pt: this.getYear(d.year),
						dontDraw: false,
						assignedLegendColor: "#FFFFFF",
					}));
				
				// for line chart and bar chart, REMOVE the undefined data entirely
				if (!this.showMap) {
					// remove flag = "- - -" data
					this.allData = this.allData
						.filter((d) => d.flag !== "- - -") // remove undefined data

				}

				//this.renderAfterDataReady();

				// have to put interface changes in separate switch statements
				// - it WAS in switch statement at top but...
				// if you do that you get weird chart "flashes" between changing data sets
				switch (dataTopic) {
					// cases with LINE CHART only and no map data
					case "obesity-child":
					case "obesity-adult":
					case "suicide":
					case "injury":
					case "medicaidU65":
						// show the chart tab
						$("#tab-chart").css("visibility", "visible");
						$("#icons-tab-2").css("background-color", "#b3d2ce"); // didnt work
						$("#icons-tab-2").css("border-top", "solid 5px #8ab9bb");
						// hide the map tab
						$("#tab-map").css("visibility", "hidden");
						this.updateShowMap(0);
						break;

					// cases with LINE CHART only and no map data
					case "obesity-child":
					case "obesity-adult":
					case "suicide":
					case "injury":
					case "medicaidU65":
						// show the chart tab
						$("#tab-chart").css("visibility", "visible");
						$("#icons-tab-2").css("background-color", "#b3d2ce"); // didnt work
						$("#icons-tab-2").css("border-top", "solid 5px #8ab9bb");
						// hide the map tab
						$("#tab-map").css("visibility", "hidden");
						this.updateShowMap(0);
						break;

					// cases with US Map data option
					case "birthweight":
					case "infant-mortality":
						// show the map tab BUT DO NOT MAKE IT THE DEFAULT
						//$('#icons-tab-1').click();
						$("#tab-map").css("visibility", "visible");
						$("#icons-tab-1").css("background-color", "#ffffff"); // didnt work
						$("#icons-tab-1").css("border-top", "solid 1px #C0C0C0");
						// hide the chart tab
						//$('#tab-chart').css("visibility", "hidden");
						// set chart tab to white
						//$('#tab-chart').css('background-color', '#ffffff'); // didnt work
						//$('#tab-chart').css('border-top', 'solid 1px #C0C0C0');
						theChartTab.style.backgroundColor = "#b3d2ce";
						theChartTab.style.cssText += "border-top: solid 5px #8ab9bb";
						this.updateShowMap(0);
						break;
				}

				//disable single year if it is set
				// force "year" to reset and not have single year clicked
				if (document.getElementById("show-one-period-checkbox").checked && !fromHash) {
					$("#show-one-period-checkbox").click();
				}

				// need data in place before filling year selects
				this.flattenedFilteredData = this.getFlattenedFilteredData();

				this.setAllSelectDropdowns(fromHash);
				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				// now filter data again to pick up unit num
				this.flattenedFilteredData = this.getFlattenedFilteredData();

				// DUE TO MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
				// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
				if (this.flattenedFilteredData[0] !== undefined) {
					if (this.flattenedFilteredData[0].hasOwnProperty("estimate_uci")) {
						// enable the CI checkbox
						$("#enable-CI-checkbox").prop("disabled", false);
					} else {
						// disable it
						$("#enable-CI-checkbox").prop("disabled", true);
						$("#enable-CI-checkbox").prop("checked", false);
					}
				}

				// now re-render the chart based on updated selection
				this.renderChart();
			})
			.catch(function (err) {
				console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`);
			});
	}

	setAllSelectDropdowns(fromHash = false) {
		let allYearsArray;
		// always filter the data again
		this.flattenedFilteredData = this.getFlattenedFilteredData();
		let yearsData;
		let max;
		let index;
		let singleYearsArray = [];
		switch (this.dataTopic) {
			case "obesity-child": // stack cases if you want to share code between data sets
			case "obesity-adult":
			case "injury": // - can't use || in case switch statement
			case "birthweight":
			case "infant-mortality":
				// NO DONT DO THIS HERE - reset unit_num or else it breaks
				//this.unitNum = 1;

				// this is Subtooic
				this.setPanelSelect(fromHash);

				// set stub names
				this.setStubNameSelect();

				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				// Get the start year options
				yearsData = this.getFilteredYearData();
				allYearsArray = d3
					.map(yearsData, function (d) {
						return d.year;
					})
					.keys();
				// console.log("allyears OBESITY start:", allYearsArray);
				$("#year-start-select").empty();
				$("#year-end-select").empty();
				allYearsArray.forEach((y) => {
					$("#year-start-select").append(`<option value="${y}">${y}</option>`);
					$("#year-end-select").append(`<option value="${y}">${y}</option>`);
					singleYearsArray.push(this.getYear(y));
				});
				// make the last end year selected
				$("#year-end-select option:last").attr("selected", "selected");
				// fix labels
				$("#year-start-label").text("Start Period");
				$("#year-end-label").text("End Period");

				// now set the start and end years otherwise flattenedfiltereddata is WRONG
				this.startYear = singleYearsArray[0];
				this.startPeriod = $("#year-start-select option:selected").text(); // set this for the chart title
				// max converts the strings to integers and gets the max
				max = Math.max(...singleYearsArray);
				// indexOf gets the index of the maximum value so we can set as the "End year"
				index = singleYearsArray.indexOf(max);
				this.endYear = singleYearsArray[index]; // now get that year
				this.endPeriod = $("#year-end-select option:selected").text(); // set this for chart title
				break;
			case "suicide":
			case "medicaidU65":
				// subtopic
				$("#panel-num-select").empty().append('<option selected value="NA">Not Applicable</option>');
				// set stub names
				this.setStubNameSelect();

				// Get the start year options
				yearsData = this.getFilteredYearData();
				allYearsArray = d3
					.map(yearsData, function (d) {
						return d.year;
					})
					.keys();
				// console.log("allyears SUICIDE start:", allYearsArray);
				$("#year-start-select").empty();
				$("#year-end-select").empty();

				// have to build an array of "only the first year"
				allYearsArray.forEach((y) => {
					$("#year-start-select").append(`<option value="${y}">${y}</option>`);
					$("#year-end-select").append(`<option value="${y}">${y}</option>`);
				});
				// make the last end year selected
				$("#year-end-select option:last").attr("selected", "selected");
				// fix labels
				$("#year-start-label").text("Start Year");
				$("#year-end-label").text("End Year");

				// now set the start and end years otherwise flattenedfiltereddata is WRONG
				this.startYear = allYearsArray[0];
				this.startPeriod = this.startYear;
				// max converts the strings to integers and gets the max
				max = Math.max(...allYearsArray);
				// indexOf however fails unless we convert max back to a string!
				index = allYearsArray.indexOf(max.toString());
				this.endYear = allYearsArray[index];
				this.endPeriod = this.endYear;
				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();
				break;
		}
	}

	// Subtopic
	setPanelSelect(fromHash = false) {
		//console.log("flattenedData before:", this.flattenedFilteredData);
		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		let allPanelsArray = [...new Map(this.allData.map((item) => [item["panel"], item])).values()];
		// now sort them in id order
		allPanelsArray.sort((a, b) => {
			return a.panel_num - b.panel_num;
		});
		// console.log("allPanelsArray", allPanelsArray);
		$("#panel-num-select").empty();

		allPanelsArray.forEach((y, i) => {
			// allow string int comparison
			// if (fromHash) {
			if (this.panelNum == y.panel_num)
				$("#panel-num-select").append(`<option value="${y.panel_num}" selected>${y.panel}</option>`);
			else $("#panel-num-select").append(`<option value="${y.panel_num}">${y.panel}</option>`);
			// } else if (i === 0)
			// 	$("#panel-num-select").append(`<option value="${y.panel_num}" selected>${y.panel}</option>`);
			// else $("#panel-num-select").append(`<option value="${y.panel_num}">${y.panel}</option>`);
		});

		if (!fromHash) {
			const firstVal = $("#panel-num-select option:first").val();
			$("#panel-num-select").val(firstVal);
		}
	}

	setStubNameSelect() {
		let allStubsArray;

		if (this.flattenedFilteredData) {
			if (this.flattenedFilteredData.length === 0) {
				this.flattenedFilteredData = this.getFlattenedFilteredData();
			}
		}

		// MAY NEED TO CHANGE TO SWITCH STATEMENT AS WE ADD DATA SETS
		// try this BEFORE getting the unique options
		// filter by panel selection if applicable
		if (this.dataTopic === "obesity-child" || this.dataTopic === "obesity-adult") {
			allStubsArray = this.allData.filter((item) => parseInt(item.panel_num) === parseInt(this.panelNum));
		} else {
			allStubsArray = this.allData;
		}

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allStubsArray = [...new Map(allStubsArray.map((item) => [item["stub_name"], item])).values()];

		// now sort them in id order
		allStubsArray.sort((a, b) => {
			return a.stub_name_num - b.stub_name_num;
		});

		$("#stub-name-num-select").empty();

		// reload the stubs but if new list has match for current selection
		// then - keep current selected
		let foundUnit = false;

		allStubsArray.forEach((y) => {

			if (this.stubNameNum === parseInt(y.stub_name_num)) {
				$("#stub-name-num-select").append(
					`<option value="${y.stub_name_num}" selected>${y.stub_name}</option>`
				);
				foundUnit = true;
			} else {
				$("#stub-name-num-select").append(`<option value="${y.stub_name_num}">${y.stub_name}</option>`);
			}
		});
		// NO DONT DO THIS - set first item to "selected"
		//$('#stub-name-num-select option:first-child').attr("selected", "selected");

		if (foundUnit === false) {
			// now update the stubname num to the first on the list
			this.stubNameNum = $("#stub-name-num-select option:first").val();
		}

	}

	setVerticalUnitAxisSelect() {
		// console.log("UNIT flattenedData before:", this.flattenedFilteredData);
		// filter out by characteristic / stub_name bc some stub_names do not have both UNIT options
		// only show the ones related to selected CHaracteristic
		// let theSelectedStubNum = this.stubNameNum;

		allUnitsArray = this.allData.filter((item) => parseInt(item.stub_name_num) === parseInt(this.stubNameNum));

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		let allUnitsArray = [...new Map(allUnitsArray.map((item) => [item["unit"], item])).values()];

		// now sort them in id order
		allUnitsArray.sort((a, b) => {
			return a.unit_num - b.unit_num;
		});
		// console.log("allUnitsArray", allUnitsArray);
		$("#unit-num-select-map").empty();
		$("#unit-num-select-chart").empty();
		// on the table tab
		$("#unit-num-select-table").empty();

		let foundUnit = false;
		// PROBLEM: on Suicide and AGe... we have not unit_num 1 so it only has 2 and this the filter in render removes out all data
		allUnitsArray.forEach((y) => {
			if (this.unitNum === parseInt(y.unit_num)) {
				$("#unit-num-select-map").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				$("#unit-num-select-chart").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				//this.unitNum = parseInt(y.unit_num); // bc maybe there is no 1 and have to set to a valid value
				// on table tab
				$("#unit-num-select-table").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				this.unitNumText = y.unit;
				foundUnit = true;
			} else {
				$("#unit-num-select-map").append(`<option value="${y.unit_num}">${y.unit}</option>`);
				$("#unit-num-select-chart").append(`<option value="${y.unit_num}">${y.unit}</option>`);
				//this.unitNum = parseInt(y.unit_num); // bc maybe there is no 1 and have to set to a valid value
				// on table tab
				$("#unit-num-select-table").append(`<option value="${y.unit_num}">${y.unit}</option>`);
			}
		});
		if (foundUnit === false) {
			// have to set to a valid unit num or data will error out
			this.unitNum = $("#unit-num-select-chart option:first").val(); // set to first item on the unit list
			this.unitNumText = $("#unit-num-select-chart option:first").text(); // set to first item on the unit list
		}
	}

	updatePanelNum(panelNum) {
		this.panelNum = parseInt(panelNum);
		//this.setCategoriesSelect();
		console.log("new panel num: ", this.panelNum);
		// update stubname select dropdown
		// Get the start year options

		// set stub names
		this.setStubNameSelect();

		// now re-render the chart based on updated selection
		if (this.showMap) {
			this.renderMap();
		} else {
			this.renderChart();
		}
	}

	updateStubNameNum(stubNameNum) {
		this.stubNameNum = stubNameNum;
		//console.log("new stub name num: ", this.stubNameNum);

		// have to update START TIME PERIOD select bc some stubs for same data have different
		// years that are valid data
		this.resetTimePeriods();

		// have to update UNIT bc some stubs dont have both units
		this.setVerticalUnitAxisSelect();

		if (stubNameNum === 0) {
			// disable the map for TOTAL
			this.updateShowMap(0);
		}

		// now re-render the chart based on updated selection
		if (this.showMap) {
			this.renderMap();
		} else {
			// need to hide map and show the chart?
			// --- depends on what tab is selected????
			$("#us-map-message").show();
			$("#us-map-message").html("Please select a Characteristic that supports US Map data.");
			$("#us-map-legend").hide();
			$("#us-map-time-slider").hide();

			// cant just call click = infinite loop
			//$('#icons-tab-2').click(); // click event will render the chart
			// only call chart render if map NOT selected
			// - map could be selected but data does not support map
			//if (document.getElementById("icons-tab-1").display === 'none') {
			
			// clear the list of active legend items when stub name changes
			DataCache.activeLegendList = [];

			// always call this
			this.renderChart();
			//}
		}
	}

	resetTimePeriods() {
		// when stubname Characteristic changes, we need to
		// go back through the filtered year data and update
		// the time period selects
		// WHY?  Because some characteristics have no data -> flag = "- - -"
		// and we need to filter those years out
		
		let max;
		let index;
		let singleYearsArray = [];
		let yearsData = this.getFilteredYearData();
		let allYearsArray = d3
			.map(yearsData, function (d) {
				return d.year;
			})
			.keys();
		
		$("#year-start-select").empty();
		$("#year-end-select").empty();
		switch (this.dataTopic) {
			// Data sets with time period ranges like 2002-2005
			case "obesity-child":
			case "obesity-adult":
			case "injury":
			case "birthweight":
			case "infant-mortality":
				allYearsArray.forEach((y) => {
					$("#year-start-select").append(`<option value="${y}">${y}</option>`);
					$("#year-end-select").append(`<option value="${y}">${y}</option>`);
					singleYearsArray.push(this.getYear(y));
				});
				// make the last end year selected
				$("#year-end-select option:last").attr("selected", "selected");
				// fix labels
				$("#year-start-label").text("Start Period");
				$("#year-end-label").text("End Period");

				// now set the start and end years otherwise flattenedfiltereddata is WRONG
				this.startYear = singleYearsArray[0];
				this.startPeriod = $("#year-start-select option:selected").text(); // set this for the chart title
				// max converts the strings to integers and gets the max
				max = Math.max(...singleYearsArray);
				// indexOf gets the index of the maximum value so we can set as the "End year"
				index = singleYearsArray.indexOf(max);
				this.endYear = singleYearsArray[index]; // now get that year
				this.endPeriod = $("#year-end-select option:selected").text(); // set this for chart title
				break;
			
			// Data sets with single year selects
			case "suicide":
			case "medicaidU65":


				// have to build an array of "only the first year"
				allYearsArray.forEach((y) => {
					$("#year-start-select").append(`<option value="${y}">${y}</option>`);
					$("#year-end-select").append(`<option value="${y}">${y}</option>`);
				});
				// make the last end year selected
				$("#year-end-select option:last").attr("selected", "selected");
				// fix labels
				$("#year-start-label").text("Start Year");
				$("#year-end-label").text("End Year");

				// now set the start and end years otherwise flattenedfiltereddata is WRONG
				this.startYear = allYearsArray[0];
				this.startPeriod = this.startYear;
				// max converts the strings to integers and gets the max
				max = Math.max(...allYearsArray);
				// indexOf however fails unless we convert max back to a string!
				index = allYearsArray.indexOf(max.toString());
				this.endYear = allYearsArray[index];
				this.endPeriod = this.endYear;
				break;
		} // end switch
	}

	updateStartPeriod(start) {
		$("#year-start-select").val(start);
		// NOW update END period
		// - get ALL END OPTION AGAIN
		// - then REMOVE any that are <= START YEAR
		// Get the start year options
		let yearsData = this.getFilteredYearData();
		let allYearsArray = d3
			.map(yearsData, function (d) {
				return d.year;
			})
			.keys();

		$("#year-end-select").empty();
		switch (this.dataTopic) {
			// Data sets with time period ranges like 2002-2005
			case "obesity-child":
			case "obesity-adult":
			case "injury":
			case "birthweight":
			case "infant-mortality":
				this.startPeriod = start;
				this.startYear = this.getYear(start);
				allYearsArray.forEach((y) => {
					if (this.getYear(y) > this.startYear) {
						$("#year-end-select").append(`<option value="${y}">${y}</option>`);
					}
				});
				break;
			// Data sets with single year selects
			case "suicide":
			case "medicaidU65":
				this.startPeriod = start;
				this.startYear = start;
				allYearsArray.forEach((y) => {
					if (parseInt(y) > this.startYear) {
						$("#year-end-select").append(`<option value="${y}">${y}</option>`);
					}
				});
				break;
		} // end switch

		// make the last end year selected
		$("#year-end-select option:last").attr("selected", "selected");

		if (this.showMap) {
			this.renderMap();
		} else {
			this.renderChart();
		}
	}

	updateEndPeriod(end) {
		switch (this.dataTopic) {
			// Data sets with time period ranges like 2002-2005
			case "obesity-child":
			case "obesity-adult":
			case "injury":
			case "birthweight":
			case "infant-mortality":
				this.endPeriod = end;
				this.endYear = this.getYear(end);
				break;
			// Data sets with single year selects
			case "suicide":
			case "medicaidU65":
				this.endPeriod = end;
				this.endYear = end;
				break;
		}
		if (this.showMap) {
			this.renderMap();
		} else {
			// what if they are on Table?
			this.renderChart();
		}
	}

	updateUnitNum(unitNum) {
		this.unitNum = parseInt(unitNum);

		// have to update the "text" to draw on the chart
		this.unitNumText = $("#unit-num-select-chart option:selected").text(); //(TTT)
		// console.log("unitNum text=", this.unitNumText);

		// actually have to go update the Stubname options after a unit num change
		// - call set stub names
		this.setStubNameSelect();

		// DUE TO MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
		// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
		if (this.flattenedFilteredData[0].hasOwnProperty("estimate_uci")) {
			// enable the CI checkbox
			$("#enable-CI-checkbox").prop("disabled", false);
		} else {
			// disable it
			$("#enable-CI-checkbox").prop("disabled", true);
			$("#enable-CI-checkbox").prop("checked", false);
		}

		if (this.showMap) {
			this.renderMap();
		} else {
			this.renderChart();
		}
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		this.renderChart();
	}

	updateEnableCI(value) {
		this.enableCI = value;
		this.renderChart();
	}

	updateShowMap(value) {
		this.showMap = value;
		let theMapWrapper = document.getElementById("map-wrapper");
		if (this.showMap) {
			let theMap = document.getElementById("map-tab");
			theMap.style.display = "block";
			theMap.classList.add("show");
			theMap.classList.add("active");
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "none";
			theChart.classList.remove("show");
			theChart.classList.remove("active");
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "none";
			theTable.classList.remove("show");
			theTable.classList.remove("active");
			// flip the colors
			let theMapTab = document.getElementById("icons-tab-1");
			theMapTab.style.backgroundColor = "#b3d2ce";
			theMapTab.style.cssText += "border-top: solid 5px #8ab9bb";
			let theChartTab = document.getElementById("icons-tab-2");
			theChartTab.style.backgroundColor = "#ffffff";
			theChartTab.style.cssText += "border-top: solid 1px #C0C0C0";
			let theTableTab = document.getElementById("icons-tab-3");
			theTableTab.style.backgroundColor = "#ffffff";
			theTableTab.style.cssText += "border-top: solid 1px #C0C0C0";
			$("#us-map-wrapper").show();
			$("#us-map-container").show();
			$("#us-map-message").show();
			$("#us-map-legend").show();
			this.renderMap();
		} else {
			// need to hide the map (TTTT)
			if (theMapWrapper) {
				theMapWrapper.style.display = "none";
			}
			$("#us-map").empty();
			$("#us-map-container").html = "<div id='us-map-message' class='chart-title'></div>";
			let theMap = document.getElementById("map-tab");
			theMap.style.display = "none";
			theMap.classList.remove("show");
			theMap.classList.remove("active");
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "block";
			theChart.classList.add("show");
			theChart.classList.add("active");
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "none";
			theTable.classList.remove("show");
			theTable.classList.remove("active");
			$("#us-map-wrapper").hide();
			$("#us-map-legend").hide();
			$("#us-map-message").html("Please select a Characteristic that supports US Map data.");
			// flip the colors
			let theMapTab = document.getElementById("icons-tab-1");
			theMapTab.style.backgroundColor = "#ffffff";
			theMapTab.style.cssText += "border-top: solid 1px #C0C0C0";
			let theChartTab = document.getElementById("icons-tab-2");
			theChartTab.style.backgroundColor = "#b3d2ce";
			theChartTab.style.cssText += "border-top: solid 5px #8ab9bb";
			let theTableTab = document.getElementById("icons-tab-3");
			theTableTab.style.backgroundColor = "#ffffff";
			theTableTab.style.cssText += "border-top: solid 1px #C0C0C0";
		}
	}

	updateClassifyType(value) {
		switch (value) {
			case "natural":
				this.classifyType = 2; // natural
				break;
			case "quartiles":
				this.classifyType = 1; // standard
				break;
			case "equal":
				this.classifyType = 3; // not using right now
				break;
			default: // natural
				this.classifyType = 2;
				break;
		}
		this.renderMap();
	}

	toggleLegendItem(value) {
		//this.showBarChart = value;
		const selDataPt = value.replace(/_/g, " ");

		// REMOVE the clicked item from the active legend items list
		// - PROBLEM: this filter is copying the items into the list TWICE
		// - it does filter out the selected item but doubles the list
		let tempList=[];

		// 
		if (DataCache.activeLegendList.filter((f) => f.stub_label === selDataPt).length) {
			// remove it BUT ONLY IF WE HAVE MORE THAN 1 ITEM ON THE ACTIVE LIST
			// - dont let it go to zero
			if (DataCache.activeLegendList.length > 1) { 
				tempList = DataCache.activeLegendList.filter(
					(d) =>
						d.stub_label !== selDataPt
				);
				DataCache.activeLegendList = [];
				DataCache.activeLegendList = tempList;
			}
		} else {
			// add it if we are not at the max of 10
			if (DataCache.activeLegendList.length < 10) {
				DataCache.activeLegendList.push({ stub_label: selDataPt, dontDraw: false, });
			}
			
		}

		console.log("ACtiveLegend List after click:", DataCache.activeLegendList);
		
		switch (this.dataTopic) {
			case "obesity-child":
			case "obesity-adult":
			case "infant-mortality":
			case "birthweight":
				// has a "panel"
				this.allData.forEach((d) => {
					if (
						d.stub_label === selDataPt &&
						parseInt(d.panel_num) === parseInt(this.panelNum) &&
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
					) {
						//d.dontDraw = !d.dontDraw; // toggle it
						// console.log("toggle has panel dontDraw=", d.dontDraw);
												
						// NEW if on the active list THEN set dontDraw = false
						if (DataCache.activeLegendList.filter(function (e) { return e.stub_label === d.stub_label; }).length > 0) {
							// it is on the list
							d.dontDraw = false;
						} else {
							// not on there so dont draw it
							d.dontDraw = true;
						}	
					}
				});
				break;
			case "suicide":
			case "injury":
			case "medicaidU65":
				// does not have any panelNum
				this.allData.forEach((d, i) => {
					if (
						d.stub_label === selDataPt &&
						parseInt(d.unit_num) === parseInt(this.unitNum) &&
						parseInt(d.stub_name_num) === parseInt(this.stubNameNum) &&
						parseInt(d.year_pt) >= parseInt(this.startYear) &&
						parseInt(d.year_pt) <= parseInt(this.endYear)
					) {
						// NO dont just blindly toggle it
						//d.dontDraw = !d.dontDraw; // toggle it
					
						// NEW if on the active list THEN set dontDraw = false
						if (DataCache.activeLegendList.filter(function (e) { return e.stub_label === d.stub_label; }).length > 0) {
							// it is on the list
							d.dontDraw = false;
						} else {
							// not on there so dont draw it
							d.dontDraw = true;
						}	

						//console.log("TOGGLE no panel year,i,dontDraw=", d.year_pt, i, d.dontDraw, selDataPt);
					} 
				});
				break;
		} // end switch

		console.log("Datacache AFTER removing selDataPt", DataCache.activeLegendList);

		console.log("this.alldata BEFORE renderChart", this.allData);

		this.renderChart();
	}

	/* getTableInfo(state) {
		let tableTitle = config.leftAxisLookup.get(this.selection.leftAxis).tableTitle;

		const keys = ["state", "displayDate", this.selection.leftAxis];
		if (this.selection.dayCheckBox && this.selection.leftAxis === "New_case") keys.push("seven_day_avg_new_cases");
		else if (this.selection.dayCheckBox && this.selection.leftAxis === "new_death")
			keys.push("seven_day_avg_new_deaths");
		else if (this.selection.dayCheckBox && this.selection.leftAxis === "new_test_results_reported")
			keys.push("new_test_results_reported_7_day_rolling_average");

		if (this.selection.rightAxis !== "select") keys.push(this.selection.rightAxis);

		const cols = ["State", "Date", config.leftAxisLookup.get(this.selection.leftAxis).dtHeader];
		if (
			this.selection.dayCheckBox &&
			(this.selection.leftAxis === "New_case" ||
				this.selection.leftAxis === "new_death" ||
				this.selection.leftAxis === "new_test_results_reported")
		)
			cols.push("7-Day Moving Avg");

		if (this.selection.rightAxis !== "select")
			cols.push(config.rightAxisLookup.get(this.selection.rightAxis).dtHeader);

		if (state === "The United States") {
			if (this.selection.leftAxis === "New_case") {
				keys.push("historical_new_total_cases");
				cols.push("Historic Cases");
			} else if (this.selection.leftAxis === "new_death") {
				keys.push("historical_new_total_deaths");
				cols.push("Historic Deaths");
			}
		}

		const rightTitle = config.rightAxisLookup.get(this.selection.rightAxis)?.titleText ?? "";
		let chartTitle = config.leftAxisLookup.get(this.selection.leftAxis).titleText;
		if (chartTitle.includes("COVID-19") && rightTitle.includes("COVID-19"))
			chartTitle = chartTitle.replace("COVID-19 ", "");
		chartTitle += `${rightTitle}in ${state} Reported to CDC`;
		chartTitle += config.rightAxisLookup.get(this.selection.rightAxis)?.titleEnd ?? "";

		let callout = config.leftAxisLookup.get(this.selection.leftAxis).calloutText;
		if (
			this.selection.dayCheckBox &&
			(this.selection.leftAxis === "New_case" || this.selection.leftAxis === "new_death")
		)
			callout += ` The red line is the 7-day moving average of ${this.selection.leftAxis.split("_")[1]}s.`;

		// to get the specific text this had to be a separate callout case
		if (this.selection.dayCheckBox && this.selection.leftAxis === "new_test_results_reported")
			callout += ` The red line is the 7-day moving average of NAATs that were performed.`;

		callout += config.rightAxisLookup.get(this.selection.rightAxis)?.calloutText ?? "";

		return { chartTitle, tableTitle, keys, cols, callout };
	}
 */
	renderDataTable(tableData) {
		// DATATABLE FUNCTION
		let tableTitleId = "table-title";
		let tableId = "nchs-table";
		let tableHeading = "";

		/* 		const formattedData = tableData.map((d) => ({
					...d,
					displayDate: genFormat(d.date, "tableDate"),
					value: d[keys[0]],
				}));
		
				formattedData.sort((a, b) => b.date - a.date); */

		let keys = Object.keys(tableData[0]);
		// information saved for csv download
		this.csv = {
			data: tableData,
			dataKeys: keys,
			title: this.chartTitle,
			headers: cols,
		};
		// Now delete a couple cols for visual table
		keys = keys.filter(
			(item) =>
				item !== "indicator" &&
				item !== "footnote_id_list" &&
				item !== "unit" &&
				!item.match("_num") &&
				!item.match("year_pt") &&
				!item.match("subLine") &&
				!item.match("dontDraw") &&
				!item.match("assignedLegendColor") &&
				item !== "date"
		);
		const cols = keys;

		/* Table element manipulation and rendering */
		let tableContainer = document.getElementById(`${tableId}-container`);
		tableContainer.setAttribute("aria-label", `${this.chartTitle} table`);
		tableContainer.setAttribute("aria-label", `${this.chartTitle} table`);
		let table = d3.select(`#${tableId}`);
		table.select("thead").remove();
		table.select("tbody").remove();
		let thead = table.append("thead");

		thead
			.append("tr")
			.selectAll("th")
			.data(cols)
			.enter()
			.append("th")
			.attr("scope", "col")
			.attr("tabindex", "0")
			.attr("id", (column, i) => `${keys[i]}-th`)
			.text(function (column) {
				if (column === "panel") {
					column = "Subtopic";
				}
				if (column === "stub_name") {
					column = "Characteristic";
				}
				if (column === "stub_label") {
					column = "Group";
				}
				if (column === "se") {
					column = "Standard Error";
				}
				return column.charAt(0).toUpperCase() + column.slice(1);
				//return this.capString(column);
			})
			/* 			.attr("class", function (column, i) {
							let classString;
							if (column === "Date") {
								classString = "table-sort-header data-table-header date-sort";
							} else {
								classString = "table-sort-header data-table-header number-sort";
							}
							if (keys[i] === "state") {
								classString += " sorted";
							}
							return classString;
						}) */
			.append("i")
			.attr("id", (column, i) => `${keys[i]}-icon`)
			.attr("class", "sort icon");

		let tbody = table.append("tbody");
		let row = tbody.selectAll("tr").data(tableData);

		row.enter()
			.append("tr")
			.selectAll("td")
			.data((row) => {
				return keys.map((column) => {
					return {
						column,
						value: row[column],
					};
				});
			})
			.enter()
			.append("td")
			.attr("tabindex", "0")
			.text(function (d, i) {
				if (d.value == null) return "N/A";
				return typeof i === "number" ? d.value : d.value; //.toLocaleString() <- this makes year have comma in it
				// so I removed it - could further reduce this return code
			})
			.each(function (column, index, i) {
				let columnIndex = index;
				let columnHeader = cols[columnIndex];
				let firstColumnVal = i[0].innerText;
				if (columnIndex === 0) {
					this.setAttribute("aria-label", `${columnHeader} ${column.value}`);
				} else if (column.value === null) {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} Not Available`);
				} else {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} ${column.value}`);
				}
			});

		const numberCells = $(".wtable td ~ td");
		numberCells.wrapInner("<div class='number-cells'></div>");
		$(`#${tableId}`).tablesort();
		$("thead  .date-sort").data("sortBy", (th, td) => {
			return new Date(td[0].textContent);
		});

		$("thead th.number-sort").data("sortBy", (th, td) => {
			const cellValue = td.text();
			if (cellValue === "N/A") {
				return 1;
			}
			return -1 * parseFloat(cellValue.replace(/,/g, ""));
		});

		//document.getElementById("table-note").innerHTML = DataCache.JSONReleaseWithPullTime;
	}

	exportCSV() {
		downloadCSV(this.csv);
	}

	// TO DO: Change the selectors to be filled using data code??
	tabContent = `<!-- TOP SELECTORS --><div class="color-area-wrapper">
	<div class="rectangle-white">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">1</strong>
			</span>
			<span style="padding-bottom:0px; font-family:Open Sans,sans-serif;color: black; font-weight:300; ">Select a topic</span><br>
			<span style="margin-left: 47px; margin-top:-10px; font-family:Open Sans,sans-serif;color: black; font-weight:600;font-size:22px;">Topic</span>
			<br>&nbsp;<br>
			<div class="styled-select">
			<select name="data-topic-select" id="data-topic-select" form="select-view-options"  style="font-size:12px;height:2em;width:180px;">
				<optgroup style="font-size:12px;">
				<option value="obesity-child" selected>Obesity among Children</option>
				<option value="obesity-adult">Obesity among Adults</option>
				<option value="suicide">Death Rates for Suicide</option>
				<option value="injury">Initial injury-related visits to hospital emergency departments</option>
				<option value="infant-mortality">Infant Mortality</option>
				<option value="birthweight">Low birthweight live births</option>
				<option value="medicaidU65">Medicaid coverage among persons under age 65</option>

				</optgroup>
			</select>
			</div>
		</div>
		<div class="chevron-white"></div>
	</div>
	<div class="rectangle-white">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">2</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color: #010101; font-weight:300; ">Refine to a</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color: #010101; font-weight:600;font-size:22px;">Subtopic</span>
			<br>&nbsp;<br>
			<select name="panel-num-select" id="panel-num-select" form="select-view-options" class="styled-select"  style="font-size:12px;height:2em;width:180px;">
				<optgroup>
				<option value="1" selected>2-19 years</option>
				<option value="2">2-5 years</option>
				<option value="3">6-11 years</option>
				<option value="4">12-19 years</option>
				</optgroup>
			</select>
		</div>
		<div class="chevron-white"></div>
	</div>
	<div class="rectangle-white">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">3</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color:#010101; font-weight:300; ">View data by</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color:#010101; font-weight:600;font-size:22px;">Characteristic</span>
			<br>&nbsp;<br>
			<select name="stub-name-num-select" id="stub-name-num-select" form="select-view-options"  class="custom-select"  style="font-size:12px;height:2em;width:180px;">
				<option value="0" selected>Total</option>
				<option value="1">Sex</option>
				<option value="3"">Race and Hispanic origin</option>
        		<option value="4">Sex and race and Hispanic origin</option>
				<option value="5">Percent of poverty level</option>
			</select>
		</div>
		<div class="chevron-white"></div>
	</div>
	<!-- last section with no chevron -->
	<div class="inner-content-wrapper">
		<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
			<i class="fa fa-circle fa-stack-2x"></i>
			<strong class="fa-stack-1x fa-stack-text fa-inverse">4</strong>
		</span>
		<span style="font-family:Open Sans,sans-serif;color:#010101; font-weight:300; ">Choose from available</span><br>
		<span style="margin-left:47px; margin-top:-5px; font-family:Open Sans,sans-serif;color:#010101; font-weight:600;font-size:22px;">Time
			Periods</span>
		<div class="checkbox-style">
			<input type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox">
			<label for="show-one-period-checkbox">View single period</label>
		</div>
		<div id="timePeriodContainer" style="display: flex;">
			<div style="flex-direction: column;">
				<div class="label-style" id="year-start-label">Start Period <br> </div>
				<div>
					<select name="year-start" id="year-start-select" form="select-view-options" class="select-style"  style="font-size:12px;height:2em;width:100px;">
						<option value="1988-1994" selected>1988-1994</option>
						<option value="1999-2002">1999-2002</option>
						<option value="2001-2004">2001-2004</option>
						<option value="2003-2006">2003-2006</option>
						<option value="2005-2008">2005-2008</option>
						<option value="2007-2010">2007-2010</option>
						<option value="2009-2012">2009-2012</option>
						<option value="2011-2014">2011-2014</option>
						<option value="2013-2016">2013-2016</option>
					</select>
				</div>
			</div>
			<div style="flex-direction: column;">
				<div class="label-style" id="year-end-label">End Period</div>
				<div>
					<select name="year-end" id="year-end-select" form="select-view-options" class="select-style"  style="font-size:12px;height:2em;width:100px;">
						<option value="1988-1994">1988-1994</option>
						<option value="1999-2002">1999-2002</option>
						<option value="2001-2004">2001-2004</option>
						<option value="2003-2006">2003-2006</option>
						<option value="2005-2008">2005-2008</option>
						<option value="2007-2010">2007-2010</option>
						<option value="2009-2012">2009-2012</option>
						<option value="2011-2014">2011-2014</option>
						<option value="2013-2016" selected>2013-2016</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- #b3d2ce -->

<br>
	<div tabindex="0" class="chart-titles space-util" style="text-align: center;">
		<span id="chart-title" class="chart-title"></span>
		<br>
		<span tabindex="0" id="chart-subtitle" class=""></span>
	</div>

	<!-- Tabs navs -->
<ul class="nav nav-tabs justify-content-center" id="ex-with-icons" role="tablist" style="margin-top: 15px;">
  <li class="nav-item center" role="presentation" id="tab-map" style="visibility:hidden;width: 200px;  text-align: center;">
    <a class="nav-link" id="icons-tab-1" data-mdb-toggle="tab" href="#map-tab" role="tab"
      aria-controls="ex-with-icons-tabs-1" aria-selected="true"  style="background-color:#b3d2ce;"><i class="fas fa-map fa-fw me-2"></i>Map</a>
  </li>
    <li class="nav-item center" role="presentation" id="tab-chart" style="width: 200px;  text-align: center;">
    <a class="nav-link active" id="icons-tab-2" data-mdb-toggle="tab" href="#chart-tab" role="tab"
      aria-controls="ex-with-icons-tabs-2" aria-selected="true"  style="background-color:#b3d2ce;border-top:solid 5px #8ab9bb;"><i class="fas fa-chart-line fa-fw me-2"></i>Chart</a>
  </li>
  <li class="nav-item center" role="presentation"  id="tab-table" style="width: 200px;  text-align: center;">
    <a class="nav-link" id="icons-tab-3" data-mdb-toggle="tab" href="#table-tab" role="tab"
      aria-controls="ex-with-icons-tabs-3" aria-selected="false"  style="border-top:solid 1px #C0C0C0;"><i class="fas fa-table fa-fw me-2"></i>Table</a>
  </li>
</ul>
<!-- Tabs navs -->

<!-- Tabs content -->
<div class="tab-content" id="ex-with-icons-content">
  <div class="tab-pane fade" id="map-tab" role="tabpanel" aria-labelledby="ex-with-icons-tab-1">
		<div class="map-wrapper" style="background-color:#b3d2ce;margin-top:0px;padding-top:1px;"><!-- if you remove that 1px padding you lose all top spacing - dont know why (TT) -->
			<div style="display:inline;float:left;">
				<div style="margin-left:90px;margin-right:50px;margin-bottom:10px;width:auto;display:inline;float:left;">Adjust Unit<br>
					<select name="unit-num-select-map" id="unit-num-select-map" form="select-view-options" class="custom-select">
						<option value="1" selected>Percent of population, crude</option>
					</select>
				</div>
				<fieldset style="margin-left: 90px; margin-top: 12px;">
					<div class="btnToggle">
						<input type="radio" name="classifyBy" value="natural" id="classNBreaks" checked="checked" />
						<label for="classNBreaks">Natural Breaks</label>
						<input type="radio" name="classifyBy" value="quartiles" id="classQuartiles" />
						<label for="classQuartiles">Quartiles</label>
					</div>
				</fieldset>
			</div>
				<div id="us-map-container" class="general-map" style="margin-left:50px;margin-right:50px;align:left;background-color: #FFFFFF;">
					<div id="us-map" class="general-map"></div>				
					<div id="us-map-message" class="chart-title"></div>
					<div id="us-map-time-slider"></div>
					<div id="us-map-legend"></div>
				</div>
				<br>
				<div class="source-text" id="source-text-map"><b>Source</b>: No source info available.</div>
		</div><!-- end map wrapper -->
  </div>
  <div class="tab-pane fade show active" id="chart-tab" role="tabpanel" aria-labelledby="ex-with-icons-tab-2">
		<div class="chart-wrapper" style="background-color:#b3d2ce;margin-top:0px;padding-top:1px;"><!-- if you remove that 1px padding you lose all top spacing - dont know why (TT) -->
				<div style="margin-left:90px;margin-right:50px;margin-bottom:10px;width:auto;display:inline;float:left;">Adjust Unit<br>
					<select name="unit-num-select-chart" id="unit-num-select-chart" form="select-view-options" class="custom-select">
						<option value="1" selected>Percent of population, crude</option>
					</select>
					
					<div class="checkbox-style" id="enable-CI-checkbox-wrapper" style="display: inline">
						<input type="checkbox" id="enable-CI-checkbox" name="enable-CI-checkbox">
						<label for="enable-CI-checkbox">Enable 95% Confidence Intervals</label>
					</div>
				</div>
				<div id="chart-container" class="general-chart">
				</div>
				<br>
				<div class="source-text" id="source-text-chart"><b>Source</b>: Data is from xyslkalkahsdflskhfaslkfdhsflkhlaksdf and alkjlk.</div>
		</div><!-- end chart wrapper -->
  </div>
  <div class="tab-pane fade" id="table-tab" onClick="" role="tabpanel" aria-labelledby="ex-with-icons-tab-3">
		<div class="table-wrapper" style="background-color:#b3d2ce;margin-top:0px;padding-top:1px;">
			<div style="margin-left:180px;width:400px;">Adjust vertical axis (Unit)<br>
				<select name="unit-num-select-table" id="unit-num-select-table" form="select-view-options" class="custom-select">
					<option value="1" selected>Percent of population, crude</option>
				</select>
			</div>
				<div id="nchs-table-container">
					<div id="table-title" class="title"></div>
				</div>
				<div id="topOfTable" class="scrolling-table-container">
                    <table id="nchs-table" class="expanded-data-table"></table>
                </div>
				<br>
		</div><!-- end chart wrapper -->

  </div>

</div>
<!-- Tabs content -->

					<div class="dwnl-img-container margin-spacer" data-html2canvas-ignore>
						<button tabindex="0" id="dwn-chart-img" class="theme-cyan ui btn">Download Chart</button>
					</div>
					<div class="data-table-container" id="pageFooterTable" style="margin-top: 10px;margin-bottom:15px;">
						<div class="table-toggle closed" id="footer-table-toggle" tabindex="0">
							<h4 class="table-title">Footnotes</h4>
							<div class="table-toggle-icon">
								<i id="footer-table-header-icon" class="fas fa-plus"></i>
							</div>
						</div>
						<div id="pageFooter" class="data-table closed"></div>
					</div>
						<div id="data-table-container" class="data-table closed" tabindex="0" aria-label="Data table">
							<div class="table-info">
								<div tabindex="0" class="general_note" style="margin-top: 10px;" id="table-note"></div>
								<button id="btnCompareTrendsTableExport" class="btn data-download-btn" tabindex="0"
									aria-label="Download Data for Data Table for Seven-day moving average of new cases">
									Download Data <i class='fas fa-download' aria-hidden="true"></i>
								</button>
							</div>
							<div tabindex="0" id="skipTableLink" class="skipOptions"><a href="#viewHistoricLink">Skip Table</a> </div>
							<div id="topOfTable" class="scrolling-table-container">
								<table tabindex="0" id="compare-trends-table" class="expanded-data-table"></table>
							</div>
						</div>
					</div>

    `;
}
