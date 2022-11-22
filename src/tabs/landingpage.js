import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import { GenChart } from "../components/general/genChart";
import { GenMap } from "../components/general/genMap";
import * as hashTab from "../utils/hashTab";
import { MainEvents } from "../eventhandlers/mainevents";
import { downloadCSV } from "../utils/downloadCSV";
import * as config from "../components/landingPage/config";
import { nhisGroups, nhisTopics } from "../components/landingPage/nhis";
import * as functions from "../components/landingPage/functions";

export class LandingPage {
	constructor() {
		this.socrataData = null;
		this.nhisData = null;
		this.csv = null;
		this.chartConfig = null;
		this.flattenedFilteredData = null;
		this.dataTopic = "obesity-child"; // default
		this.characteristicId = 0;
		this.startPeriod = "1988-1994";
		this.startYear = "1988"; // first year of the first period
		this.endPeriod = "2013-2016";
		this.endYear = "2013"; // first year of the last period
		this.footnoteMap = {};
		this.showBarChart = 0;
		this.topoJson = null;
		this.classifyType = 2; // 1 = Quartiles, 2 = Natural, 3 = EqualIntervals
		this.selections = null;
		this.currentTimePeriodIndex = 0;
		this.animating = false;
		this.config = null;
		this.activeTabNumber = 1; // the chart tab number, 0 indexed
	}

	getUSMapData = async () => (this.topoJson ? null : Utils.getJsonFile("content/json/StatesAndTerritories.json"));

	getNhisData = (id) => {
		const dataId = id.split("nhis-")[1];
		if (DataCache[`data-${dataId}`]) return DataCache[`data-${dataId}`];
		const filteredToIndicator = this.nhisData.filter((d) => d.outcome_or_indicator === dataId);
		const returnData = [];
		filteredToIndicator.forEach((f) => {
			const group = nhisGroups[f.group];
			if (group) {
				const ci = f.confidence_interval?.split(",") ?? ["0", "0"];
				const percent =
					f.percentage !== "999" && f.percentage !== "888" && f.percentage !== "777" ? f.percentage : null;
				returnData.push({
					estimate: percent,
					estimate_lci: ci[0].trim(),
					estimate_uci: ci[1].trim(),
					flag: null,
					footnote_id_list: "",
					footnote_list: null,
					indicator: f.outcome_or_indicator,
					panel: group.panel,
					panel_num: group.panelNum,
					se: null,
					stub_label: f.group,
					stub_name: group.stubName,
					stub_name_num: group.stubNameNum,
					unit: "Percent of population",
					unit_num: 1,
					year: f.year,
					year_num: "",
					age: group.stubName.includes("Age Group") ? f.group : "N/A",
				});
			}
		});

		DataCache[`data-${dataId}`] = returnData;
		return returnData;
	};

	getSelectedSocrataData = async (config) => {
		let nchsData = DataCache[`data-${config.socrataId}`];
		if (nchsData) return nchsData;

		if (config.socrataId.startsWith("nhis")) {
			return this.getNhisData(config.socrataId);
		}

		try {
			let [metaData, jsonData] = [];
			console.log("SOCRATA get topic", config.socrataId);

			[metaData, jsonData] = await Promise.all([
				//t is Socrata ID, m is metadata and p is private
				fetch(
					`https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&m=1&p=${config.private}`
				).then((res) => res.text()),
				fetch(
					`https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&m=0&p=${config.private}`
				).then((res) => res.text()),
			]);

			const columns = JSON.parse(metaData).columns.map((col) => col.fieldName);

			nchsData = functions.addMissingProps(columns, JSON.parse(jsonData));

			DataCache[`data-${config.socrataId}`] = nchsData;
			return nchsData;
		} catch (err) {
			console.error("Error fetching data", err);
			return null;
		}
	};

	renderTab() {
		$("#maincontent").html(config.tabContent);
		MainEvents.registerEvents(); // add any click events inside here
		functions.addHtmlTooltips();

		$("#tabs").tabs({
			active: this.activeTabNumber, // this is the chart tab, always set to start here on page load
			activate: (e) => {
				this.activeTabNumber = parseInt(e.currentTarget.id.split("-")[2], 10) - 1;
				switch (this.activeTabNumber) {
					case 0:
						this.updateStubNameNum(1, false);
						$("#characteristicSelect").val(1);
						this.renderMap();
						break;
					case 1:
						this.renderChart();
						break;
					default:
						break;
				}
			},
		});

		this.selections = hashTab.getSelections();
		if (this.selections) this.dataTopic = this.selections.topic;
		this.updateDataTopic(this.dataTopic, false); // this gets Socrata data and renders chart/map/datatable; "false" param means topicChange = false
	}

	renderMap() {
		let subtopicText = $("#subtopicSelect option:selected").text();
		this.chartSubTitle = "Subtopic: " + subtopicText;
		$("#chart-subtitle").html(`<strong>${this.chartSubTitle}</strong>`);

		// NOTE: the map tab DIV MUST be visible so that the vizId is rendered
		$("#us-map-container").show();

		// If TOTAL is selected we CANNOT DRAW THE MAP, so show a message
		if (this.characteristicId === 0) {
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

			// Get filtered data
			let stateData = this.getFlattenedFilteredData();
			// but need to narrow it to the selected time period
			const allDates = this.socrataData.map((d) => d.year).filter((v, i, a) => a.indexOf(v) === i);
			stateData = stateData.filter((d) => parseInt(d.year_pt, 10) === parseInt(this.startYear, 10));
			this.flattenedFilteredData = stateData;
			// this.currentTimePeriodIndex = document.getElementById("#year-start-select")?.selectedIndex ?? 0;
			const mapVizId = "us-map";
			let map = new GenMap({
				mapData: stateData, // misCdata[3].Jurisdiction2,
				vizId: mapVizId,
				classifyType: this.classifyType,
				startYear: parseInt(this.startYear, 10),
				allDates,
				currentTimePeriodIndex: this.currentTimePeriodIndex,
				animating: this.animating,
			});

			map.render(this.topoJson);
			$("#us-map-time-slider").empty();
			map.renderTimeSeriesAxisSelector();
		}
	}

	renderChart() {
		const flattenedData = this.getFlattenedFilteredData();
		this.flattenedFilteredData = flattenedData;

		this.chartConfig = functions.getAllChartProps(flattenedData, this.showBarChart, this.config);
		this.chartConfig.chartTitle = ""; // don't use the built in chart title

		$(`#${this.chartConfig.vizId}`).empty();
		const genChart = new GenChart(this.chartConfig);
		genChart.render();

		// set the title - easier to do it all here based on selectors
		let indicatorText = $("#data-topic-select option:selected").text();
		let stubText = $("#characteristicSelect option:selected").text();
		if (this.showBarChart) {
			this.config.chartTitle = indicatorText + " by " + stubText + " in " + this.startPeriod;
		} else {
			this.config.chartTitle =
				indicatorText + " by " + stubText + " from " + this.startPeriod + " to " + this.endPeriod;
		}
		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);
		let subtopicText = $("#subtopicSelect option:selected").text();
		this.chartSubTitle = "Subtopic: " + subtopicText;
		$("#chart-subtitle").html(`<strong>${this.chartSubTitle}</strong>`);
	}

	renderDataVisualizations = () => {
		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.renderMap();
		} else this.renderChart();
		this.renderDataTable();
		hashTab.writeHashToUrl();
		$(".dimmer").removeClass("active");
	};

	getFlattenedFilteredData() {
		let selectedSubtopicData = this.socrataData.filter(
			(d) =>
				parseInt(d.unit_num, 10) === parseInt(this.config.yAxisUnitId, 10) &&
				parseInt(d.stub_name_num, 10) === parseInt(this.characteristicId, 10) &&
				parseInt(d.year_pt, 10) >= parseInt(this.startYear, 10) &&
				parseInt(d.year_pt, 10) <= parseInt(this.endYear, 10)
		);

		if (this.config.hasSubtopic)
			selectedSubtopicData = selectedSubtopicData.filter(
				(d) => parseInt(d.panel_num, 10) === parseInt(this.config.panelNum, 10)
			);

		if (selectedSubtopicData[0]?.hasOwnProperty("estimate_uci")) {
			// enable the CI checkbox
			$("#enable-CI-checkbox").prop("disabled", false);
		} else {
			// disable it
			$("#enable-CI-checkbox").prop("disabled", true);
			$("#enable-CI-checkbox").prop("checked", false);
		}

		selectedSubtopicData.sort((a, b) => a.year_pt - b.year_pt).sort((a, b) => a.stub_label_num - b.stub_label_num);

		if (this.showBarChart) {
			const allDataGroups = [...new Set(selectedSubtopicData.map((d) => d.stub_label))];

			// filter to just the start year
			selectedSubtopicData = selectedSubtopicData.filter(
				(d) => parseInt(d.year_pt, 10) === parseInt(this.startYear, 10)
			);

			const current = selectedSubtopicData[0];
			const filteredDataGroups = [...new Set(selectedSubtopicData.map((d) => d.stub_label))];
			const excludedGroups = allDataGroups.filter((d) => !filteredDataGroups.includes(d));
			excludedGroups.forEach((d) =>
				selectedSubtopicData.push({
					panel: current.panel,
					unit: current.unit,
					stub_name: current.stub_name,
					year: current.year,
					age: current.age,
					flag: current.flag,
					estimate_lci: null,
					estimate_uci: null,
					stub_label: d,
					estimate: null,
				})
			);
		} else {
			// set up for line chart
			selectedSubtopicData = selectedSubtopicData.map((d) => ({
				...d,
				subLine: d.stub_label,
			}));
		}

		let allFootnoteIdsArray = selectedSubtopicData.map((d) => d.footnote_id_list);
		this.updateFootnotes(allFootnoteIdsArray, this.dataTopic);

		// "date" property is necessary for correctly positioning data point for these charts
		if (this.dataTopic === "suicide" || this.dataTopic === "medicaidU65")
			return [...selectedSubtopicData].map((d) => ({
				...d,
				date: new Date(`${d.year}-01-01T00:00:00`),
			}));

		return [...selectedSubtopicData];
	}

	// Pull all the available years, filtering by subtopic, unit, and characteristic
	getFilteredYearData() {
		this.config.panelNum = $("#subtopicSelect option:selected").val();

		const filteredData = this.socrataData.filter(
			(d) =>
				parseInt(d.unit_num, 10) === parseInt(this.config.yAxisUnitId, 10) &&
				parseInt(d.stub_name_num, 10) === parseInt(this.characteristicId, 10)
		);

		return this.config.hasSubtopic
			? filteredData.filter((d) => parseInt(d.panel_num, 10) === parseInt(this.config.panelNum, 10))
			: filteredData;
	}

	updateFootnotes(footnotesIdArray, dataTopic) {
		let footnotesList;
		let sourceList;
		let allFootnotesText = "";
		let sourceText = "";
		// in some cases this gets called with no footnotes.

		if (dataTopic === "obesity-child" && footnotesIdArray[1]) {
			// this includes every item in the footnotes
			footnotesList = footnotesIdArray[1].split(",");

			// get ONLY the source codes list
			sourceList = footnotesList;
			sourceList = sourceList.filter((d) => d.toString().startsWith("SC")); // match(/SC/));
			sourceList.forEach(
				(f) =>
					(sourceText +=
						"<div><b>Source</b>: " + f + ": " + functions.linkify(this.footnoteMap[f]) + "</div>")
			);

			// now remove the SC notes from footnotesList
			footnotesList = footnotesList.filter((d) => d.substring(0, 2) !== "SC");

			// foreach footnote ID, look it up in the tabnotes and ADD it to text
			allFootnotesText = "";
			footnotesList.forEach(
				(f) =>
					(allFootnotesText +=
						"<p class='footnote-text'>" + f + ": " + functions.linkify(this.footnoteMap[f]) + "</p>")
			);
		} else if (footnotesIdArray[0]) {
			// this includes every item in the footnotes
			footnotesList = footnotesIdArray[0].split(",");

			// get ONLY the source codes list
			sourceList = footnotesList;
			sourceList = sourceList.filter((d) => d.toString().startsWith("SC")); // match(/SC/));
			sourceList.forEach(
				(f) =>
					(sourceText +=
						"<div><b>Source</b>: " + f + ": " + functions.linkify(this.footnoteMap[f]) + "</div>")
			);

			// now remove the SC notes from footnotesList
			footnotesList = footnotesList.filter((d) => d.substring(0, 2) !== "SC");

			// foreach footnote ID, look it up in the tabnotes and ADD it to text
			allFootnotesText = "";
			footnotesList.forEach(
				(f) =>
					(allFootnotesText +=
						"<p class='footnote-text'>" + f + ": " + functions.linkify(this.footnoteMap[f]) + "</p>")
			);
		}
		// update source text
		$("#source-text-map").html(sourceText);
		$("#source-text-chart").html(sourceText);

		// now update the footnotes on the page
		$("#pageFooter").html(allFootnotesText);
		$("#pageFooterTable").show(); // this is the Footnotes line section with the (+) toggle on right
	}

	updateDataTopic(dataTopic, topicChange = true) {
		$(".dimmer").addClass("active");

		// reset to full range of time periods on topic change event but not from page load, which may have a hash url stating 'single-time-period' (bar chart)
		if (topicChange) {
			$("#show-one-period-checkbox").prop("checked", false);
			$("#startYearContainer").removeClass("offset-3");
			$("#endYearContainer").show();
			this.showBarChart = false;
		}
		this.dataTopic = dataTopic; // string
		this.config = config.topicLookup[dataTopic];
		if (this.selections) this.config.panelNum = parseInt(this.selections.subTopic, 10);
		const hasMap = this.config.hasMap ? true : false; // undefined does not work with the .toggle() on the next line. Set to true or false;
		$("#mapTab-li").toggle(hasMap); // hide/show the map tabs selector

		$("#cdcDataGovButton").attr("href", this.config.dataUrl);

		// clear the list of active legend items
		DataCache.activeLegendList = [];

		// make sure time periods are visible (hidden if on Map tab or on refresh)

		if (this.selections?.viewSinglePeriod) {
			$("#startYearContainer").addClass("offset-3");
			$("#endYearContainer").hide();
			this.showBarChart = true;
		}

		$("#enable-CI-checkbox-wrapper").toggle(this.config.hasCI); // toggle is show/hide depending on boolean
		this.config.enableCI = false;
		$("#enable-CI-checkbox").prop("checked", false);

		if (this.selections) this.characteristicId = parseInt(this.selections.characteristic, 10);
		else this.characteristicId = 0;

		// set the chart title
		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);

		DataCache.activeLegendList = [];

		if (this.config.socrataId.startsWith("nhis") && !this.nhisData) {
			this.getSelectedSocrataData(config.topicLookup.nhis).then((data) => {
				this.nhisData = data;
				this.getData(topicChange);
			});
		} else {
			this.getData(topicChange);
		}
	}

	getData = (topicChange) => {
		Promise.all([
			this.getSelectedSocrataData(this.config),
			this.getSelectedSocrataData(config.topicLookup.footnotes),
			this.getUSMapData(),
		])
			.then((data) => {
				let [socrataData, footNotes, mapData] = data;

				if (mapData) this.topoJson = JSON.parse(mapData);

				// build footnote map - but this needs to be done on EVERY data change
				this.footnoteMap = {};
				let i = null;
				for (i = 0; footNotes.length > i; i += 1) {
					this.footnoteMap[footNotes[i].fn_id] = footNotes[i].fn_text;
				}

				// create a year_pt col from time period
				this.socrataData = socrataData
					// ONLY FOR US MAP - dont filter out "- - -"
					// No need this data to draw as gray  -> .filter((d) => d.flag !== "- - -") // remove undefined data
					.map((d) => ({
						...d,
						estimate: parseFloat(d.estimate),
						year_pt: functions.getYear(d.year),
						dontDraw: false,
						assignedLegendColor: "#FFFFFF",
					}));

				// for line chart and bar chart, REMOVE the undefined data entirely
				if (!this.config.hasMap) {
					// remove flag = "- - -" data
					this.socrataData = this.socrataData.filter((d) => d.flag !== "- - -"); // remove undefined data
				}

				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				if (!topicChange && this.showBarChart) {
					// have to run the selects setup twice for a reload of barcharts
					this.showBarChart = false;
					this.setAllSelectDropdowns();
					this.showBarChart = true;
				}
				this.setAllSelectDropdowns(); // includes time periods

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

				this.showBarChart = this.selections?.viewSinglePeriod;
				this.renderDataVisualizations();

				// Not all Topics have a US Map. If on Map, switch to the Chart tab.
				// Also, switching from a Topic with a Map to another, with a Map, fails to load the map correctly so just switch to Chart
				if (this.activeTabNumber === 0 && topicChange) {
					$("a[href='#chart-tab']").trigger("click");
				}
			})
			.catch((err) => console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`));
		return "";
	};

	setAllSelectDropdowns() {
		this.flattenedFilteredData = this.getFlattenedFilteredData();
		this.setSubtopic();
		this.setCharacteristic();
		this.setVerticalUnitAxisSelect();
		this.resetTimePeriods();
	}

	// Subtopic
	setSubtopic() {
		// Creates an array of objects with unique "name" property values. Have to iterate over the unfiltered data

		let allTopics = [...new Map(this.socrataData.map((item) => [item.panel, item])).values()];
		// now sort them in id order
		allTopics.sort((a, b) => {
			return a.panel_num - b.panel_num;
		});
		// console.log("allPanelsArray", allPanelsArray);
		$("#subtopicSelect").empty();

		allTopics.forEach((y) => {
			// allow string to int equality with ==
			if (this.config.panelNum == y.panel_num || y.panel == "N/A")
				$("#subtopicSelect").append(
					`<option value="${y.panel_num}" selected>${y.panel === "N/A" ? "Not Applicable" : y.panel}</option>`
				);
			else $("#subtopicSelect").append(`<option value="${y.panel_num}">${y.panel}</option>`);
		});

		if (!this.selections) {
			const firstVal = $("#subtopicSelect option:first").val();
			$("#subtopicSelect").val(firstVal);
			this.config.panelNum = firstVal;
		}
	}

	setCharacteristic() {
		let allCharacteristicIds;

		if (this.flattenedFilteredData) {
			if (this.flattenedFilteredData.length === 0) {
				this.flattenedFilteredData = this.getFlattenedFilteredData();
			}
		}

		// MAY NEED TO CHANGE TO SWITCH STATEMENT AS WE ADD DATA SETS
		// try this BEFORE getting the unique options
		// filter by subtopic selection if applicable
		const topicsWhereCharacteristicsVaryBySubtopic = ["obesity-child", "obesity-adult", "birthweight"].concat(
			nhisTopics.map((t) => t.id)
		);
		if (topicsWhereCharacteristicsVaryBySubtopic.includes(this.dataTopic)) {
			allCharacteristicIds = this.socrataData.filter(
				(item) => parseInt(item.panel_num, 10) === parseInt(this.config.panelNum, 10)
			);
		} else {
			allCharacteristicIds = this.socrataData;
		}

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allCharacteristicIds = [...new Map(allCharacteristicIds.map((item) => [item.stub_name, item])).values()];

		// now sort them in id order
		allCharacteristicIds.sort((a, b) => {
			return a.stub_name_num - b.stub_name_num;
		});

		$("#characteristicSelect").empty();

		// reload the stubs but if new list has match for current selection
		// then - keep current selected
		let foundUnit = false;

		allCharacteristicIds.forEach((y) => {
			if (this.characteristicId === parseInt(y.stub_name_num, 10)) {
				$("#characteristicSelect").append(
					`<option value="${y.stub_name_num}" selected>${y.stub_name}</option>`
				);
				foundUnit = true;
			} else {
				$("#characteristicSelect").append(`<option value="${y.stub_name_num}">${y.stub_name}</option>`);
			}
		});

		if (foundUnit === false) {
			// now update the stubname num to the first on the list
			this.characteristicId = $("#characteristicSelect option:first").val();
		}
	}

	setVerticalUnitAxisSelect() {
		let allUnitsArray = this.socrataData.filter(
			(item) => parseInt(item.stub_name_num, 10) === parseInt(this.characteristicId, 10)
		);

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allUnitsArray = [...new Map(allUnitsArray.map((item) => [item.unit, item])).values()];

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
			if (this.config.yAxisUnitId === parseInt(y.unit_num, 10)) {
				$("#unit-num-select-map").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				$("#unit-num-select-chart").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				$("#unit-num-select-table").append(`<option value="${y.unit_num}" selected>${y.unit}</option>`);
				foundUnit = true;
			} else {
				$("#unit-num-select-map").append(`<option value="${y.unit_num}">${y.unit}</option>`);
				$("#unit-num-select-chart").append(`<option value="${y.unit_num}">${y.unit}</option>`);
				$("#unit-num-select-table").append(`<option value="${y.unit_num}">${y.unit}</option>`);
			}
		});
		if (foundUnit === false) {
			// have to set to a valid unit num or data will error out
			this.config.yAxisUnitId = $("#unit-num-select-chart option:first").val(); // set to first item on the unit list
		}
	}

	updateSubtopic(panelNum) {
		this.config.panelNum = parseInt(panelNum, 10);
		console.log("new subtopic num: ", this.config.panelNum);
		this.setCharacteristic();
		DataCache.activeLegendList = [];

		this.renderDataVisualizations();
	}

	updateStubNameNum(stubNameNum, updateTimePeriods = true) {
		this.characteristicId = stubNameNum;

		// have to update UNIT bc some stubs dont have all units
		this.setVerticalUnitAxisSelect();

		// have to update START TIME PERIOD select bc some stubs for same data have different years that are valid data
		if (updateTimePeriods) this.resetTimePeriods();

		// clear the list of active legend items when stub name changes
		DataCache.activeLegendList = [];
		this.renderDataVisualizations();
	}

	resetTimePeriods() {
		// When "stubname" (Characteristic) changes, update the time period selects dropdowns.
		// Some characteristics have no data -> flag = "- - -"; so filter those years out.

		const allYearsArray = [...new Set(this.getFilteredYearData().map((d) => d.year))];
		const singleYearsArray = allYearsArray.map((d) => functions.getYear(d)).sort((a, b) => a - b);

		$("#year-start-select").empty();
		$("#year-end-select").empty();

		// Data sets with time period ranges like 2002-2005
		allYearsArray.forEach((y) => {
			$("#year-start-select").append(`<option value="${y}">${y}</option>`);
			$("#year-end-select").append(`<option value="${y}">${y}</option>`);
		});

		// make the last end year "selected"
		$("#year-end-select option:last").attr("selected", "selected");

		// and update labels and global variables to new values
		$("#year-start-label").text("Start Period");
		$("#year-end-label").text("End Period");

		this.startYear = singleYearsArray[0];
		this.startPeriod = $("#year-start-select option:selected").text(); // set this for the chart title
		this.endYear = singleYearsArray.slice(-1)[0];
		this.endPeriod = $("#year-end-select option:selected").text(); // set this for chart title
	}

	updateStartPeriod(start) {
		// also updates End Period dropdown so it only has values after the updated start period
		$("#year-start-select").val(start);
		const allYearsArray = this.getFilteredYearData().map((d) => d.year);
		this.startPeriod = start;
		this.startYear = functions.getYear(start);
		const currentEnd = $("#year-end-select :selected").text();
		$("#year-end-select").empty();

		allYearsArray.forEach((y) => {
			if (functions.getYear(y) > this.startYear) {
				if (currentEnd === y) $("#year-end-select").append(`<option selected value="${y}">${y}</option>`);
				else $("#year-end-select").append(`<option value="${y}">${y}</option>`);
			}
		});
		this.renderDataVisualizations();
	}

	updateEndPeriod(end) {
		this.endYear = end;
		this.endPeriod = functions.getYear(end);
		this.renderChart();
	}

	updateYAxisUnitId(yAxisUnitId) {
		this.config.yAxisUnitId = parseInt(yAxisUnitId, 10);
		this.setCharacteristic();

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

		this.renderDataVisualizations();
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		if (value === 0) this.resetTimePeriods();
		this.renderChart();
		hashTab.writeHashToUrl();
	}

	updateEnableCI(value) {
		this.config.enableCI = value;
		this.renderChart();
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
		const selDataPt = value.replace(/_/g, " ");

		const currentLength = DataCache.activeLegendList.length;
		const foundItemIndex = DataCache.activeLegendList.findIndex((f) => f.stub_label === selDataPt);

		if (currentLength > 0 && foundItemIndex !== -1) DataCache.activeLegendList.splice(foundItemIndex, 1);
		else if (currentLength < 10) DataCache.activeLegendList.push({ stub_label: selDataPt, dontDraw: false });
		else return;

		// console.log("ACtiveLegend List after click:", DataCache.activeLegendList);
		this.renderChart();
	}

	// call this when Reset Button is clicked
	resetSelections() {
		functions.resetTopicDropdownList();
		// reset panel
		this.setSubtopic();

		// reset Characteristic
		this.characteristicId = 0; // should always be TOTAL in every data set!!!
		this.setCharacteristic();

		// remove "View Single Period" if it is set
		$("#show-one-period-checkbox").prop("checked", false);
		$("#startYearContainer").removeClass("offset-3");
		$("#endYearContainer").show();
		this.showBarChart = false;

		// reset and show time period start/end dropdowns
		this.resetTimePeriods();
		$(".timePeriodContainer").css("display", "flex");

		this.setVerticalUnitAxisSelect(); // reset the unit
		DataCache.activeLegendList = []; // clear the list of active legend items when stub name changes

		// default back to "Chart" tab
		if (this.activeTabNumber === 1) this.renderChart();
		else $("a[href='#chart-tab']").click();
		hashTab.writeHashToUrl();
	}

	renderDataTable() {
		// DATATABLE FUNCTION
		const tableData = this.flattenedFilteredData;
		let tableId = "nchs-table";
		let cols = ["Subtopic", "Characteristic", "Group", "Year", "Age", "Estimate", "Standard Error"];
		let keys = ["panel", "stub_name", "stub_label", "year", "age", "estimate", "se"];

		if (this.config.hasCI) {
			cols.push("Lower Confidence Interval", "Upper Confidence Interval");
			keys.push("estimate_lci", "estimate_uci");
		}

		cols.push("Flag");
		keys.push("flag");

		this.csv = {
			data: tableData,
			dataKeys: keys,
			title: this.config.chartTitle,
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

		/* Table element manipulation and rendering */
		let tableContainer = document.getElementById(`${tableId}-container`);
		tableContainer.setAttribute("aria-label", `${this.config.chartTitle} table`);
		tableContainer.setAttribute("aria-label", `${this.config.chartTitle} table`);
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
			.attr("id", (col, i) => `${keys[i]}-th`)
			.html((col, i) => {
				// group the <th> content so that the last word of the th is wrapped in a span with the sort icon
				// so that the sort icon can be in a <span> with css of white-space: nowrap
				const words = col.split(" ");
				// console.log(`Words: ${words}`);
				const lastWord = words.splice(-1);
				// console.log(`Last word: ${lastWord}`);
				// console.log(`Words: ${words}`);
				let header = "<span>";
				if (words.length) {
					words.forEach((w) => (header += `${w} `));
					header += "</span>";
				}
				header += `<span class="sortIconNoWrap">${lastWord} <i id="${keys[i]}-icon" class="sort icon"></i></span>`;
				return header;
			});

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
					if (column.value === "N/A") {
						this.setAttribute("aria-label", `${columnHeader} Not Available`);
					} else {
						this.setAttribute("aria-label", `${columnHeader} ${column.value}`);
					}
				} else if (column.value === null) {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} Not Available`);
				} else {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} ${column.value}`);
				}
			});

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
	}

	exportCSV() {
		downloadCSV(this.csv);
	}
}
