import { resetAppStateVars } from "../utils/appState";
import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import * as config from "../components/landingPage/config";
//import { MainCard } from "../components/landingPage/mainCard";
//import { SubCard } from "../components/landingPage/subCard";
import { PageEvents } from "../eventhandlers/pageevents";
import { GenChart } from "../components/general/genChart";

//import { CommunityTransmissionMap } from "../components/landingPage/communityMap";
//import { CommunityTransmissionMapLegend } from "../components/landingPage/communityMapLegend";
//import { landingStatusBar } from "../components/landingPage/landingStatusBar";

export class LandingPage {
	constructor() {
		resetAppStateVars();
		appState.CURRENT_TAB = "nchs-home";
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
		this.dataTopic = "obesity"; // default
		this.dataFile = "content/json/HUS_OBESCH_2018.json"; // default is Obesity
		this.chartTitle = "Obesity Among Children and Adolescents";
		this.panelNum = 1;
		this.stubNameNum = 0;
		this.startPeriod = "1988-1994";
		this.startYear = "1988"; // first year of the first period
		this.endPeriod = "2013-2016";
		this.endYear = "2013" // first year of the last period
		this.footNotes = "";
		this.footnoteMap = {};
		this.unitNum = 1; // default 1 obesity
		this.showBarChart = 0;
	}

	renderTab() {
		document.getElementById("maincontent").innerHTML = this.tabContent;

/* 		const countyViewInput = document.getElementById("county-view-input");
		$(document).on("click", (e) => {
			if (e.target !== countyViewInput) closeSearchArea();
		}); */

		this.getInitialData(); // for starters OBESITY DATA

		/* 		document.addEventListener("DOMContentLoaded", evt => {
			if (evt.target.readyState === "complete") {
				this.addClickListeners();
			}
		}); */

		this.addClickListeners();
	}

	
	renderAfterDataReady() {
		// set default yscale:
		if (!this.yScaleType) {
			this.yScaleType = "linear";
			this.storedScaleState = "linear";
		}

		console.log("Panel Num", this.panelNum);

		//updateTitle(this.charttype, this.numbertype, this.neworcumulative);
		$(".dimmer").attr("class", "ui inverted dimmer");

		this.setStubNameSelect() 
		
		this.renderChart();
	}

	getInitialData() {
		
		async function getSelectedData() {
			return DataCache.ObesityData ?? Utils.getJsonFile("content/json/HUS_OBESCH_2018.json");
		}

		async function getFootnoteData() {
			return DataCache.Footnotes ?? Utils.getJsonFile("content/json/FootNotes.json");
		}
		
/* 		const getObesityData = () =>
			DataCache.ObesityData ?? Utils.getJsonFile("content/json/HUS_OBESCH_2018.json");

		const getFootnoteData = () =>
			DataCache.Footnotes ?? Utils.getJsonFile("content/json/FootNotes.json");
 */		
//		let footnotesData = getFootnoteData();
		Promise.all([getSelectedData(),getFootnoteData()]).then((data) => {
			//const [destructuredData] = data;
			[DataCache.ObesityData, DataCache.Footnotes] = data;
			this.allData = JSON.parse(data[0]);
			DataCache.ObesityData = this.allData;
			this.footNotes = JSON.parse(data[1]);
			DataCache.Footnotes = this.footNotes;

			// build footnote map ONE TIME
			this.footnoteMap = {};
			let i = null;
			for (i = 0; this.footNotes.length > i; i += 1) {
				this.footnoteMap[this.footNotes[i].fn_id] = this.footNotes[i].fn_text;
			}

			// create a year_pt col from time period
			if (this.dataTopic === "obesity") {
				this.allData = this.allData
					.filter((d) => d.flag !== "- - -") // remove undefined data
					.map((d) => ({ ...d, estimate: parseFloat(d.estimate), year_pt: this.getYear(d.year) }));
				this.renderAfterDataReady();
			} else {
				this.allData = this.allData
					.filter((d) => d.flag !== "- - -") // remove undefined data
					.map((d) => ({ ...d, estimate: parseFloat(d.estimate), year_pt: d.year}));
				this.renderAfterDataReady();
			}


		}).catch(function (err) {
			console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`);
		});
	
	}

	getYear(period) {
		const yearsArray = period.split("-");
		return parseInt(yearsArray[0]);
	}

/* 	updateComparisonChart(loadingState) {
		if (!loadingState) {
			// only update if not a false update function during initial page load
			renderComparisonChart();
			document
				.getElementById("dwn-chart-img")
				.setAttribute("aria-label", `Download Chart ${$("#main-title").html()}`);
		}
	} */

	renderChart() {
// ${this.updateTitle()} in next line and have function to set it based on selectors
		
		$("#chart-title").html(`<strong>${this.chartTitle}</strong>`);
		$("#chart-subtitle").html(`Data from NCHS.`);

		// $("#metric_callout_box").html(config.calloutText.get(this.casesOrDeaths + this.newOrCumulative));
		//debugger;
		const flattenedData = this.getFlattenedFilteredData();
		this.flattenedFilteredData = flattenedData;
		console.log(`landing ${this.dataTopic} filtered data:`, flattenedData);
		this.chartConfig = this.getChartBaseProps();
		this.chartValueProperty = this.chartConfig.chartValueProperty;
		this.chartConfig = this.getAllChartProps(flattenedData, this.chartConfig);
		this.chartConfig.chartTitle = ""; // dont use the built in chart title

		$(`#${this.chartConfig.vizId}`).empty();
		const genChart = new GenChart(this.chartConfig);
		// not using a slider here
		//config.renderSlider(genChart.render(), this.currentSliderDomain);
		genChart.render();

		// render data table too
		this.renderDataTable(this.flattenedFilteredData);

		// set background to white - THIS DOESNT WORK
		//$("#chart-container-svg").style("background-color", '#FFFFFF');

		// example of removing lines from the graph
/* 		const removedCategories = this.savedNamedCategories.filter((s) => !this.currentNamedCategories.includes(s));
		removedCategories.forEach((r) => $(`.${r}`).hide()); */
	}

	getFlattenedFilteredData() {
		const { classification } = this;
		//debugger;
		let selectedPanelData
		switch (this.dataTopic) {
			case "obesity":
				selectedPanelData = this.allData.filter(
					(d) => parseInt(d.panel_num) === this.panelNum && parseInt(d.unit_num) === this.unitNum && parseInt(d.stub_name_num) === this.stubNameNum && parseInt(d.year_pt) >= parseInt(this.startYear) && parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				break;
			case "suicide":
				selectedPanelData = this.allData.filter(
					(d) =>  parseInt(d.unit_num) === this.unitNum && parseInt(d.stub_name_num) === this.stubNameNum && parseInt(d.year_pt) >= parseInt(this.startYear) && parseInt(d.year_pt) <= parseInt(this.endYear)
				);
				//debugger;
				break;
			case "injury":
				selectedPanelData = this.allData.filter(
					(d) =>  parseInt(d.unit_num) === this.unitNum && parseInt(d.stub_name_num) === this.stubNameNum && parseInt(d.year_pt) >= this.startYear && parseInt(d.year_pt) >= this.startYear && parseInt(d.year_pt) <= this.endYear
				);
				break;
		}
		//debugger;
		if (this.showBarChart) {
			// filter to just the start year
			selectedPanelData = selectedPanelData.filter(
					(d) =>  parseInt(d.year_pt) === parseInt(this.startYear)
			);
		} else {
			// set up for line chart
			selectedPanelData = selectedPanelData.map((d) => ({
				...d,
				subLine: d.stub_label,
			}));
		}

		//debugger;
		let allFootnoteIdsArray = d3.map(selectedPanelData, function (d) { return d.footnote_id_list; }).keys().join();
		console.log("footnote ids: ", allFootnoteIdsArray); //selectedPanelData[0].footnote_id_list
		this.updateFootnotes(allFootnoteIdsArray);
		//debugger;
/* 		const noLocationNamedData = [...classifiedData, ...allCountiesData];
		if (this.currentLocation === "United States")
			return noLocationNamedData.map((d) => ({
				...d,
				date: new Date(`${d.date}T00:00:00`),
				subLine: functions.getCategoryName2(d.Category, classification),
			})); */

		return [...selectedPanelData];
	}

	getChartBaseProps() {
		const chartValueProperty = "estimate";
		
		/* this.newOrCumulative !== "total"
				? `${this.newOrCumulative}_day_avg_new_${this.casesOrDeaths}_per_100k`
				: `total_${this.casesOrDeaths}_per_100k`; */

		//const newTotalText = this.newOrCumulative === "seven" ? "7-day" : "14-day";

		let yAxisTitle;
		let xAxisTitle;

		switch (this.dataTopic) {
			case "obesity":
				yAxisTitle = "Percent of Population, crude (%)";
				xAxisTitle = "Time Period";
				break;
			case "suicide":
				yAxisTitle = "Deaths per 100,000 resident population, crude";
				xAxisTitle = "Time Period";
				break;
			case "injury":
				yAxisTitle = "Initial injury-related visits in thousands, crude";
				xAxisTitle = "Time Period";
				break;
		}

		return { chartValueProperty, yAxisTitle, xAxisTitle };
	}

	getAllChartProps = (data, chartBaseProps) => {
		const { chartValueProperty, yAxisTitle, xAxisTitle } = chartBaseProps;
		const vizId = "chart-container";
		let props;
				// figure out legend placement
		let legendCoordPercents = [0.40, 0.58];
		switch (this.stubNameNum) {
			case 0:
				legendCoordPercents = [0.38, 0.75];
				break;
			case 1:
				legendCoordPercents = [0.40, 0.70];
				break;
			case 2:
				legendCoordPercents = [0.40, 0.70];
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
				legendCoordPercents = [0.40, 0.58];
				break;
		}
		// if one single year then use bar chart
		let useBars;
		//debugger;
		if (this.showBarChart) {
			useBars = true;
			props = {
			data,
			chartProperties: {
				yLeft1: chartValueProperty,
				xAxis: "year",
				yAxis: "estimate",
				bars: "estimate",
			},
			usesLegend: true,
			legendBottom: true,
			usesDateDomainSlider: false,
			usesBars: true,
			usesHoverBars: true,
			barColor: "steelblue",
			usesChartTitle: true,
			usesLeftAxis: true,
			usesLeftAxisTitle: false,
			usesBottomAxis: true,
			usesBottomAxisTitle: true,
			usesDateAsXAxis: true,
			yLeftLabelScale: 3,
			legendCoordinatePercents: legendCoordPercents,
			leftAxisTitle: yAxisTitle,
			bottomAxisTitle: xAxisTitle,
			formatXAxis: "string",
			usesMultiLineLeftAxis: false,
			vizId,
			genTooltipConstructor: this.getTooltipConstructor(vizId, chartValueProperty),
	    };

		} else {
			useBars = false;
					props = {
			data,
			chartProperties: {
				yLeft1: chartValueProperty,
				xAxis: "year",
				yAxis: "estimate",
			},
			usesLegend: true,
			legendBottom: true,
			usesDateDomainSlider: false,
			usesBars: false,
			usesHoverBars: false,
			usesChartTitle: true,
			usesLeftAxis: true,
			usesLeftAxisTitle: false,
			usesBottomAxis: true,
			usesBottomAxisTitle: true,
			usesDateAsXAxis: true,
			yLeftLabelScale: 3,
			legendCoordinatePercents: legendCoordPercents,
			leftAxisTitle: yAxisTitle,
			bottomAxisTitle: xAxisTitle,
			formatXAxis: "string",
			usesMultiLineLeftAxis: true,
			multiLineColors: [
				"#88419d",
				"#57b452",
				"#0b84a5",
				"#cc4c02",
				"#690207",
				"#e1ed3e",
				"#7c7e82",
				"#8dddd0",
				"#A6A6A6",
			],
			multiLineLeftAxisKey: "subLine",
			vizId,
			genTooltipConstructor: this.getTooltipConstructor(vizId, chartValueProperty),
	    };

		}


	    return props;
	};
	
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
			"": { title: "", datumType: "empty" },
		};

		const headerProps = ["stub_name","stub_label"]; 
		const bodyProps = ["panel","unit", chartValueProperty, "year"];

		return {
			propertyLookup,
			headerProps,
			bodyProps,
			svgId: `${vizId}-svg`,
			vizId,
		};
	};
    

/* 	renderComparisonChart() {
		//const { ySelect } = currentViz;
		const vizKey = getVizKey();
		chartConfig  = config.getGenChartConfig ({
			currentViz,
			data: this.allData,
			vizKey: this.vizKey,
			vizId: this.vizId,
		});

		// use this if we need to adjust data at all
		//this.chartConfig.data = this.updateCurrentData();
		//if (this.yScaleType === "log") this.chartConfig.legendCoordinatePercents = [0.4, 0.65];
		this.chartConfig.left1ScaleType = this.yScaleType;

		const genChart = new GenChart(this.chartConfig);
		genChart.render;
		//functions.renderSlider(genChart.render(this.chartConfig.data), this.currentSliderDomain);
		//this.tableData = this.formatDataForTable(this.chartConfig.data);
		//this.renderComparisonTable(this.tableData);
	} */

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

	updateFootnotes(footnotesIdArray) {
		let footnotesList = footnotesIdArray.split(",");
		//console.log("footnote ids: ", footnotesList);
		// foreach footnote ID, look it up in the tabnotes and ADD it to text
		let allFootnotesText = "";
		footnotesList.forEach(f =>
			allFootnotesText += "<p class='footnote-text'>" + f + ": " + this.footnoteMap[f] + "</p>"
		);
		// now update the footnotes on the page
		$("#pageFooter").html(allFootnotesText);
		$("#pageFooterTable").show(); // this is the Footnotes line section with the (+) toggle on right
		//$("#pageFooter").show(); // let toggleTable do this
	}

	getFootnoteText(f) {
		const footnote = this.searchJSONArray(DataCache.Footnotes.fn_text, {
			fn_id
		});

		if (footnotes.length > 0) return footnote;
		return `<p>There was an error pulling footnote` + fn_id + `. Try refreshing your browser to see them.</p>`;
	}

	updateDataTopic(dataTopic) {
		this.dataTopic = dataTopic; // string

		// get the data
		async function getSelectedData(dataFile) {
			return Utils.getJsonFile(dataFile);
		}
		//debugger;
		switch (dataTopic) {
			case "obesity":
				this.dataFile = "content/json/HUS_OBESCH_2018.json";
				this.chartTitle = "Obesity Among Children and Adolescents";
				break;
			case "suicide":
				this.dataFile = "content/json/DeathRatesForSuicide.json";
				this.chartTitle = "Death Rates for Suicide";
				break;
			case "injury":
				this.dataFile = "content/json/InjuryEDVis.json";
				this.chartTitle = "Injury-related Visits to Hospital Emergency Departments";
				break;			
			
		}
		$("#chart-title").html(`<strong>${this.chartTitle}</strong>`);

		// now get the data if it has not been fetched already
		Promise.all([getSelectedData(this.dataFile)]).then((data) => {
			//const [destructuredData] = data;
			[DataCache.ObesityData] = data;

			this.allData = JSON.parse(data[0]);
			DataCache.ObesityData = this.allData;
			//debugger;
			// create a year_pt col from time period
			this.allData = this.allData
				.filter((d) => d.flag !== "- - -") // remove undefined data
				.map((d) => ({ ...d, estimate: parseFloat(d.estimate), year_pt: this.getYear(d.year) }));
			//this.renderAfterDataReady();

			// need data in place before filling year selects
			this.flattenedFilteredData = this.getFlattenedFilteredData();

			this.setAllSelectDropdowns();

			// set the Adjust vertical axis via unit_num in data
			this.setVerticalUnitAxisSelect();

			// now filter data again to pick up unit num
			this.flattenedFilteredData = this.getFlattenedFilteredData();
			
			// now re-render the chart based on updated selection
			this.renderChart();

		}).catch(function (err) {
			console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`);
		});



	}

	setAllSelectDropdowns () {
		let allYearsArray;

		if (this.flattenedFilteredData.length === 0) {
			this.flattenedFilteredData = this.getFlattenedFilteredData();
		}
		
		switch (this.dataTopic) {
			case "obesity":
				// reset unit_num or else it breaks
				this.unitNum = 1;

				// subtopic
/* 				$('#panel-num-select')
					.empty()
					.append('<option selected="selected" value="1">2-19 years</option>')
					.append('<option selected="selected" value="2">2-5 years</option>')
					.append('<option selected="selected" value="3">6-11 years</option>')
					.append('<option selected="selected" value="4">12-19 years</option>')
					; */
				
				// this is Subtooic
				this.setPanelSelect();

				// set stub names
				this.setStubNameSelect();

				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				console.log("BEFORE all data OBESIty", this.allData);
				console.log("BEFORE flattened data OBESIty", this.flattenedFilteredData);

				// Get the start year options
				allYearsArray = d3.map(this.flattenedFilteredData, function (d) { return d.year_pt; }).keys();
				console.log("allyears OBESITY start:", allYearsArray);
				$('#year-start-select').empty();
				$('#year-end-select').empty();
				allYearsArray.forEach((y) => {
					$('#year-start-select').append(`<option value="${y}">${y}</option>`);
					$('#year-end-select').append(`<option value="${y}">${y}</option>`);
				});
				// fix labels
				$('#year-start-label').text("Start Year");
				$('#year-end-label').text("End Year");
				break;
			case "suicide":
				// subtopic
				$('#panel-num-select')
					.empty()
					.append('<option selected="selected" value="NA">Not Applicable</option>')
					;
				// set stub names
				this.setStubNameSelect();

				// Get the start year options
				allYearsArray = d3.map(this.flattenedFilteredData, function (d) { return d.year; }).keys();
				console.log("allyears SUICIDE start:", allYearsArray);
				//debugger;
				$('#year-start-select').empty();
				$('#year-end-select').empty();

				allYearsArray.forEach((y) => {
					$('#year-start-select').append(`<option value="${y}">${y}</option>`);
					$('#year-end-select').append(`<option value="${y}">${y}</option>`);
				});
				// make the last end year selected
				$("#year-end-select option:last"). attr("selected", "selected");
				// fix labels
				$('#year-start-label').text("Start Year");
				$('#year-end-label').text("End Year");

				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				break;
			case "injury":
								// subtopic
				$('#panel-num-select')
					.empty()
					.append('<option selected="selected" value="NA">Not Applicable</option>')
					;
				// set stub names
				this.setStubNameSelect();

				// Get the start year options
				allYearsArray = d3.map(this.flattenedFilteredData, function (d) { return d.year_pt; }).keys();
				console.log("allyears start:", allYearsArray);
				$('#year-start-select').empty();
				$('#year-end-select').empty();
				allYearsArray.forEach((y) => {
					$('#year-start-select').append(`<option value="${y}">${y}</option>`);
					$('#year-end-select').append(`<option value="${y}">${y}</option>`);
				});
				// fix labels
				$('#year-start-label').text("Start Year");
				$('#year-end-label').text("End Year");
				break;
		}

	}

	// Subtopic
	setPanelSelect() {

		//console.log("flattenedData before:", this.flattenedFilteredData);
		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		let allPanelsArray = [
			...new Map(this.allData.map((item) => [item["panel"], item])).values(),
		];
		// now sort them in id order
		allPanelsArray.sort((a, b) => {
   			 return a.panel_num - b.panel_num;
		});
		console.log("allPanelsArray", allPanelsArray);
		$('#panel-num-select').empty();

		allPanelsArray.forEach((y) => {
			$('#panel-num-select').append(`<option value="${y.panel_num}">${y.panel}</option>`);
		});
	}

	setStubNameSelect() {

		let allStubsArray;

		if (this.flattenedFilteredData) {
			if (this.flattenedFilteredData.length === 0) {
				this.flattenedFilteredData = this.getFlattenedFilteredData();
			}
		}
		console.log("flattenedData SETSTUBNAMESELECT before:", this.flattenedFilteredData);
		//debugger;
		// try this BEFORE getting the unique options
		// filter by panel selection if applicable
		if (this.dataTopic === "obesity") {
			allStubsArray = this.allData.filter(item => (parseInt(item.panel_num) === this.panelNum));
		} else {
			allStubsArray = this.allData;
		}

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allStubsArray = [
			...new Map(allStubsArray.map((item) => [item["stub_name"], item])).values(),
		];
		//debugger;

		// now sort them in id order
		allStubsArray.sort((a, b) => {
   			 return a.stub_name_num - b.stub_name_num;
		});
		console.log("allStubsArray", allStubsArray);
		$('#stub-name-num-select').empty();

		allStubsArray.forEach((y) => {
			$('#stub-name-num-select').append(`<option value="${y.stub_name_num}">${y.stub_name}</option>`);
		});
	}

	setVerticalUnitAxisSelect() {

		console.log("UNIT flattenedData before:", this.flattenedFilteredData);
		// filter out by characteristic / stub_name bc some stub_names do not have both UNIT options
		// only show the ones related to selected CHaracteristic
		let theSelectedStubNum = this.stubNameNum;
		//debugger;
		allUnitsArray = this.allData.filter(item => (parseInt(item.stub_name_num) === this.stubNameNum));


		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		let allUnitsArray = [
			...new Map(allUnitsArray.map((item) => [item["unit"], item])).values(),
		];
	
		// now sort them in id order
		allUnitsArray.sort((a, b) => {
   			 return a.unit_num - b.unit_num;
		});
		console.log("allUnitsArray", allUnitsArray);
		$('#unit-num-select').empty();
		// on the table tab
		$('#unit-num-select2').empty();

		//debugger;

		// PROBLEM: on Suicide and AGe... we have not unit_num 1 so it only has 2 and this the filter in render removes out all data
		allUnitsArray.forEach((y) => {
			$('#unit-num-select').append(`<option value="${y.unit_num}">${y.unit}</option>`);
			this.unitNum = parseInt(y.unit_num); // bc maybe there is no 1 and have to set to a valid value
			// on table tab
			$('#unit-num-select2').append(`<option value="${y.unit_num}">${y.unit}</option>`);
		});
	}
	
	updatePanelNum(panelNum) {
		this.panelNum = parseInt(panelNum);
		//this.setCategoriesSelect();
		console.log("new panel num: ", this.panelNum)
		// update stubname select dropdown 
		// Get the start year options
				
		// set stub names
		this.setStubNameSelect();
		
		// now re-render the chart based on updated selection
		this.renderChart();

	}

	updateStubNameNum(stubNameNum) {
		this.stubNameNum = stubNameNum;
		//this.setCategoriesSelect();
		console.log("new stub name num: ", this.stubNameNum)

		// have to update UNIT bc some stubs dont have both units
		this.setVerticalUnitAxisSelect();

		// now re-render the chart based on updated selection
		this.renderChart();
		//this.renderDataTable();
	}
	
	updateStartPeriod(start) {
		switch (this.dataTopic) {
			case "obesity" || "injury":
				this.startPeriod = start;
				this.startYear = this.getYear(start);
				break;
			case "suicide":
				this.startPeriod = start;
				this.startYear = start;
				break;
		}
		this.renderChart();
	}

	updateEndPeriod(end) {

		switch (this.dataTopic) {
			case "obesity" || "injury":
				this.endPeriod = end;
				this.endYear = this.getYear(end);
				break;
			case "suicide":
				this.endPeriod = end;
				this.endYear = end;
				break;
		}
		this.renderChart();
	}

	updateUnitNum(unitNum) {

		this.unitNum = parseInt(unitNum);
		this.renderChart();
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		this.renderChart();
	}

	addClickListeners() {
/* 		// this is a weird eslint rule. class methods must use this for assigments unless static.
		const buttons = document.querySelectorAll(".landing-card-main");
		PageEvents.addButtonsClickListers(buttons);
		this.buttons = document.querySelectorAll(".daily-update-card");
		PageEvents.addButtonsClickListers(this.buttons);
		// these are not buttons, but hrefs but this will get the scroll effect we need
		// -- the .landing-link listeners need to be here AND in update-list code
		// -- if you remove these 2 lines below then the non-update-list landing-links don't work (TT)
		this.buttons = document.querySelectorAll(".landing-link");
		PageEvents.addButtonsClickListers(this.buttons);
		this.communityButtons = document.querySelectorAll(".community-links");
		PageEvents.addButtonsClickListers(this.communityButtons); */
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
		keys = keys.filter(item => (item !== 'indicator') && (item !== 'footnote_id_list') && (item !== 'unit'));
		const cols = keys;


		/* Table element manipulation and rendering */
		//document.getElementById(tableTitleId).innerHTML = "";  // dont show title this.chartTitle;
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
				return column;
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
				return typeof i === "number" ? d.value.toLocaleString() : d.value;
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
	<div class="rectangle-green">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">1</strong>
			</span>
			<span style="padding-bottom:0px; font-family:Open Sans,sans-serif;color: white; font-weight:300; ">Select a topic</span><br>
			<span style="margin-left: 47px; margin-top:-10px; font-family:Open Sans,sans-serif;color: white; font-weight:500;font-size:22px;">Topic</span>
			<br>&nbsp;<br>
			<div class="styled-select">
			<select name="data-topic-select" id="data-topic-select" form="select-view-options"  style="font-size:12px;height:2em;width:180px;">
				<optgroup style="font-size:12px;">
				<option value="obesity" selected>Obesity among children</option>
				<option value="suicide">Death rates for suicide</option>
				</optgroup>
			</select>
			</div>
			<!-- REMOVE FOR NOW <option value="injury">Initial injury-related visits to hospital emergency departments -->
		</div>
		<div class="chevron-green"></div>
	</div>
	<div class="rectangle-yellow">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">2</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color: #010101; font-weight:300; ">Refine to a</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color: #010101; font-weight:500;font-size:22px;">Subtopic</span>
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
		<div class="chevron-yellow"></div>
	</div>
	<div class="rectangle-white">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">3</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color:#010101; font-weight:300; ">View data by</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color:#010101; font-weight:500;font-size:22px;">Characteristic</span>
			<br>&nbsp;<br>
			<select name="stub-name-num-select" id="stub-name-num-select" form="select-view-options"  class="custom-select"  style="font-size:12px;height:2em;width:180px;">
				<option value="0" selected>Total</option>
				<option value="1">Sex</option>
				<option value="2">Age</option>
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
		<span style="margin-left:47px; margin-top:-5px; font-family:Open Sans,sans-serif;color:#010101; font-weight:500;font-size:22px;">Time
			Periods</span>
		<div class="checkbox-style">
			<input type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox">
			<label for="show-one-period-checkbox">View single period</label>
		</div>
		<div style="display: flex;">
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
  <li class="nav-item" role="presentation">
    <a class="nav-link active" id="icons-tab-1" data-mdb-toggle="tab" href="#chart-tab" role="tab"
      aria-controls="ex-with-icons-tabs-1" aria-selected="true"  style="background-color:#b3d2ce;"><i class="fas fa-chart-line fa-fw me-2"></i>Chart</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="icons-tab-2" data-mdb-toggle="tab" href="#table-tab" role="tab"
      aria-controls="ex-with-icons-tabs-2" aria-selected="false"><i class="fas fa-table fa-fw me-2"></i>Table</a>
  </li>
</ul>
<!-- Tabs navs -->

<!-- Tabs content -->
<div class="tab-content" id="ex-with-icons-content">
  <div class="tab-pane fade show active" id="chart-tab" role="tabpanel" aria-labelledby="ex-with-icons-tab-1">
		<div class="chart-wrapper" style="background-color:#b3d2ce;margin-top:0px;padding-top:1px;"><!-- if you remove that 1px padding you lose all top spacing - dont know why (TT) -->
		<div style="margin-left:180px;width:400px;">Adjust vertical axis (Unit)<br>
			<select name="unit-num-select" id="unit-num-select" form="select-view-options" class="custom-select">
				<option value="1" selected>Percent of population, crude</option>
			</select>
		</div>
				<div id="chart-container" class="general-chart" style="align:left;">
				</div>
				<br>
				<div class="source-text"><b>Source</b>: Data is from xyslkalkahsdflskhfaslkfdhsflkhlaksdf and alkjlk.</div>
		</div><!-- end chart wrapper -->
  </div>
  <div class="tab-pane fade" id="table-tab" onClick="" role="tabpanel" aria-labelledby="ex-with-icons-tab-2">
		<div class="table-wrapper" style="background-color:#b3d2ce;margin-top:0px;padding-top:1px;">
			<div style="margin-left:180px;width:400px;">Adjust vertical axis (Unit)<br>
				<select name="unit-num-select" id="unit-num-select2" form="select-view-options" class="custom-select">
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
				<div class="source-text"><b>Source</b>: Data is from xyslkalkahsdflskhfaslkfdhsflkhlaksdf and alkjlk.</div>
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
