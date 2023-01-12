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
import { GenDropdown } from "../components/general/genDropdown";

export class LandingPage {
	constructor() {
		this.socrataData = null;
		this.nhisData = null;
		this.csv = null;
		this.chartConfig = null;
		this.flattenedFilteredData = null;
		this.dataTopic = "obesity-child"; // default
		this.groupId = 0;
		this.startPeriod = "1988-1994";
		this.startYear = "1988"; // first year of the first period
		this.endPeriod = "2013-2016";
		this.endYear = "2013"; // first year of the last period
		this.footnoteMap = null;
		this.showBarChart = 0;
		this.topoJson = null;
		this.selections = null;
		this.currentTimePeriodIndex = 0;
		this.animating = false;
		this.config = null;
		this.activeTabNumber = 1; // the chart tab number, 0 indexed
		this.genChart = null;
		this.allMapData = null;
		this.animationInterval = null;
		this.events = null;
		this.topicDropdown = null;
		this.classificationDropdown = null;
		this.groupDropdown = null;
		this.allYearsOptions = null;
		this.binning = "static";
		this.legend = null;
	}

	getUSMapData = async () => (this.topoJson ? null : Utils.getJsonFile("content/json/StatesAndTerritories.json"));

	getNhisData = (id) => {
		const dataId = id.split("nhis-")[1];
		if (DataCache[`data-${dataId}`]) return DataCache[`data-${dataId}`];
		const filteredToIndicator = this.nhisData.filter((d) => d.outcome_or_indicator === dataId);
		const returnData = [];
		filteredToIndicator.forEach((f) => {
			let group = nhisGroups[f.group];
			if (group instanceof Map) {
				group = group.get(f.group_byid);
			}
			if (group) {
				const ci = f.confidence_interval?.split(",") ?? ["0", "0"];
				const percent =
					f.percentage !== "999" && f.percentage !== "888" && f.percentage !== "777" && f.percentage !== "555"
						? f.percentage
						: null;
				returnData.push({
					estimate: percent,
					estimate_lci: ci[0].trim(),
					estimate_uci: ci[1].trim(),
					flag: null,
					footnote_id_list: f.footnote_id_list,
					indicator: f.outcome_or_indicator,
					panel: group.classification,
					panel_num: group.classificationId,
					se: null,
					stub_label: f.group,
					stub_name: group.group,
					stub_name_num: group.groupId,
					unit: "Percent of population",
					unit_num: 1,
					year: f.year,
					year_num: "",
					age: group.group.includes("Age Group") ? f.group : "N/A",
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
		this.events = new MainEvents(this.animationInterval);
		this.events.registerEvents(); // add any click events inside here

		functions.addHtmlTooltips();

		$("#tabs").tabs({
			active: this.activeTabNumber, // this is the chart tab, always set to start here on page load
			activate: (e) => {
				this.activeTabNumber = parseInt(e.currentTarget.id.split("-")[2], 10) - 1;
				switch (this.activeTabNumber) {
					case 0:
						this.updateGroup(1, false);
						this.groupDropdown.value("1");
						this.groupDropdown.disableDropdown();
						this.allMapData = null;
						this.renderMap();
						break;
					case 1:
						this.groupDropdown.enableDropdown();
						this.renderChart();
						this.groupDropdown.enableValues("all");
						break;
					default:
						break;
				}
			},
		});

		this.initTopicDropdown();
		this.updateTopic(this.dataTopic, false); // this gets Socrata data and renders chart/map/datatable; "false" param means topicChange = false
	}

	generateLegend = () => {
		if (!this.allMapData) return null;

		const min = d3.min(this.allMapData, (d) => d.estimate);
		const max = d3.max(this.allMapData, (d) => d.estimate);

		const endYearDataBinned = functions.binData(this.allMapData.filter((d) => d.year_pt == this.endYear));
		const { legend } = endYearDataBinned;
		let currentMax;
		legend.forEach((l, i) => {
			if (i === 0) return;
			if (i === 1) {
				l.min = min;
				currentMax = l.max;
			} else {
				l.min = Number((currentMax + this.config.binGranularity).toFixed(2));
				currentMax = l.max;
			}
			if (i === 4) l.max = max;
		});

		return legend;
	};

	renderMap() {
		$("#chart-subtitle").html(`<strong>Classification: ${this.classificationDropdown.text()}</strong>`);

		let stateData = this.getFlattenedFilteredData();
		this.legend = this.legend ?? this.generateLegend();
		if (!this.legend?.length) {
			return;
		}

		const allDates = this.allYearsOptions.map((d) => d.value);
		stateData = stateData.filter((d) => d.year_pt == this.startYear);

		let classified;
		let staticBin;
		if (this.binning === "static") {
			stateData = stateData.map((d) => ({
				...d,
				class: d.estimate ? this.legend.find((l) => l.min <= d.estimate && l.max >= d.estimate).c : 0,
			}));
			staticBin = JSON.parse(JSON.stringify(this.legend));
			staticBin[1].min = "min";
			staticBin[4].max = "max";
		} else {
			classified = functions.binData(stateData);
			stateData = classified.classifiedData;
		}

		this.flattenedFilteredData = stateData;

		const mapVizId = "us-map";
		let map = new GenMap({
			mapData: stateData,
			topoJson: this.topoJson,
			mLegendData: this.binning === "static" ? staticBin : classified.legend,
			vizId: mapVizId,
			startYear: parseInt(this.startYear, 10),
			allDates,
			currentTimePeriodIndex: this.currentTimePeriodIndex,
			animating: this.animating,
			genTooltipConstructor: functions.getMapTooltipConstructor(this.genChart.props.genTooltipConstructor),
		});
		map.render();
		$("#us-map-time-slider").empty();
		map.renderTimeSeriesAxisSelector();
	}

	renderChart() {
		const flattenedData = this.getFlattenedFilteredData();
		this.flattenedFilteredData = flattenedData;

		this.chartConfig = functions.getAllChartProps(
			flattenedData,
			this.showBarChart,
			this.config,
			this.groupDropdown.text()
		);
		this.chartConfig.chartTitle = ""; // don't use the built in chart title

		$(`#${this.chartConfig.vizId}`).empty();
		this.genChart = new GenChart(this.chartConfig);
		this.genChart.render();

		// set the title - easier to do it all here based on selectors
		const topic = this.topicDropdown.text();
		const group = this.groupDropdown.text();

		if (this.showBarChart) this.config.chartTitle = `${topic} by ${group} in ${this.startPeriod}`;
		else this.config.chartTitle = `${topic} by ${group} from ${this.startPeriod} to ${this.endPeriod}`;

		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);
		$("#chart-subtitle").html(`<strong>Classification: ${this.classificationDropdown.text()}</strong>`);
	}

	renderDataVisualizations = () => {
		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.renderMap();
		} else this.renderChart();
		this.renderDataTable();
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
		$(".genLoader").removeClass("active");
	};

	getFlattenedFilteredData() {
		let data = this.socrataData.filter(
			(d) =>
				d.unit_num == this.config.yAxisUnitId &&
				d.stub_name_num == this.groupId &&
				parseInt(d.year_pt, 10) >= parseInt(this.startYear, 10) &&
				parseInt(d.year_pt, 10) <= parseInt(this.endYear, 10)
		);

		if (this.config.hasClassification) data = data.filter((d) => d.panel_num == this.config.classificationId);
		if (!this.allMapData && this.activeTabNumber === 0 && this.groupId === 1) this.allMapData = [...data];

		if (data[0]?.estimate_uci) {
			// enable the CI checkbox
			$("#enable-CI-checkbox").prop("disabled", false);
		} else {
			// disable it
			$("#enable-CI-checkbox").prop("disabled", true);
			$("#enable-CI-checkbox").prop("checked", false);
		}

		data.sort((a, b) => a.year_pt - b.year_pt).sort((a, b) => a.stub_label_num - b.stub_label_num);

		if (this.showBarChart) {
			const allDataGroups = [...new Set(data.map((d) => d.stub_label))];

			// filter to just the start year
			data = data.filter((d) => d.year_pt == this.startYear);

			const current = data[0];

			const filteredDataGroups = [...new Set(data.map((d) => d.stub_label))];
			const excludedGroups = allDataGroups.filter((d) => !filteredDataGroups.includes(d));
			excludedGroups.forEach((d) =>
				data.push({
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
			data = data.map((d) => ({
				...d,
				subLine: d.stub_label,
			}));
		}

		let allFootnoteIdsArray = data.map((d) => d.footnote_id_list);
		this.updateFootnotes(allFootnoteIdsArray, this.dataTopic);

		// "date" property is necessary for correctly positioning data point for these charts
		if (this.dataTopic === "suicide" || this.dataTopic === "medicaidU65")
			return [...data].map((d) => ({
				...d,
				date: new Date(`${d.year}-01-01T00:00:00`),
			}));

		return [...data];
	}

	// Pull all the available years, filtering by classification, unit, and group
	getFilteredYearData() {
		const filteredData = this.socrataData.filter(
			(d) => d.unit_num == this.config.yAxisUnitId && d.stub_name_num == this.groupId
		);

		return this.config.hasClassification
			? filteredData.filter((d) => d.panel_num == this.config.classificationId)
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

	topicDropdownChange = (value) => {
		this.events.stopAnimation();
		this.selections = null;
		this.legend = null;
		this.allMapData = null;
		this.updateTopic(value);
	};

	updateTopic(dataTopic, topicChange = true) {
		$(".genLoader").addClass("active");

		// reset to full range of time periods on topic change event but not from page load, which may have a hash url stating 'single-time-period' (bar chart)
		if (topicChange) {
			$("#show-one-period-checkbox").prop("checked", false);
			$("#startYearContainer").removeClass("offset-3");
			$("#endYearContainer").show();
			this.showBarChart = false;
			this.currentTimePeriodIndex = 0;
		}

		this.dataTopic = dataTopic; // string
		this.config = config.topicLookup[dataTopic];
		if (this.selections) this.config.classificationId = parseInt(this.selections.classification, 10);
		const hasMap = this.config.hasMap ? true : false; // undefined does not work with the .toggle() on the next line. Set to true or false;
		$("#mapTab-li").toggle(hasMap); // hide/show the map tabs selector

		$("#cdcDataGovButton").attr("href", this.config.dataUrl);

		// clear the list of active legend items
		DataCache.activeLegendList = [];

		if (this.selections?.viewSinglePeriod) {
			$("#startYearContainer").addClass("offset-3");
			$("#endYearContainer").hide();
			this.showBarChart = true;
		}

		$("#enable-CI-checkbox-wrapper").toggle(this.config.hasCI); // toggle is show/hide depending on boolean
		this.config.enableCI = false;
		$("#enable-CI-checkbox").prop("checked", false);

		if (this.selections) this.groupId = parseInt(this.selections.group, 10);
		else this.groupId = 0;

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
			this.getSelectedSocrataData(config.topicLookup.nhisFootnotes),
			this.getUSMapData(),
		])
			.then((data) => {
				let [socrataData, footNotes, nhisFootnotes, mapData] = data;

				if (mapData) this.topoJson = JSON.parse(mapData);

				let allFootNotes = DataCache.Footnotes;
				if (!allFootNotes) {
					allFootNotes = [...footNotes, ...nhisFootnotes];
					DataCache.Footnotes = allFootNotes;
				}

				if (!this.footnoteMap) {
					this.footnoteMap = {};
					let i = null;
					for (i = 0; i < allFootNotes.length; i++) {
						const text = allFootNotes[i]?.fn_text;
						const id = allFootNotes[i].fn_id;
						this.footnoteMap[id] = text;
					}
				}

				// create a year_pt col from time period
				this.socrataData = socrataData.map((d) => ({
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
		this.initClassificationDropdown();
		this.initGroupDropdown();
		this.setVerticalUnitAxisSelect();
		this.resetTimePeriods();
	}

	initTopicDropdown() {
		this.selections = hashTab.getSelections();

		if (this.selections) this.dataTopic = this.selections.topic;

		const options = [];
		Object.entries(config.topicLookup).forEach((k) => {
			const title = k[1].chartTitle;
			if (title)
				options.push({
					text: title,
					value: k[0],
				});
		});

		this.topicDropdown = new GenDropdown({
			containerId: "topicDropdown",
			ariaLabel: "select a topic",
			options,
			selectedValue: this.selections?.topic,
		});
		this.topicDropdown.render();

		// add advanced filters to data-filter attribute
		$("#topicDropdown-select .genDropdownOption").each((i, el) => {
			const value = $(el).data("val");
			$(el).data("filter", config.topicLookup[value].filters);
		});
	}

	// Classification
	initClassificationDropdown() {
		// Creates an array of objects with unique "name" property values. Have to iterate over the unfiltered data
		let allTopics = [...new Map(this.socrataData.map((item) => [item.panel, item])).values()];
		// now sort them in id order
		allTopics.sort((a, b) => {
			return a.panel_num - b.panel_num;
		});

		const options = allTopics.map((d) => ({
			text: d.panel,
			value: d.panel_num,
		}));

		this.classificationDropdown = new GenDropdown({
			containerId: "classificationDropdown",
			ariaLabel: "refine by classification",
			options,
			selectedValue: this.selections?.classification,
		});
		this.classificationDropdown.render();
		this.config.classificationId = this.classificationDropdown.value();

		if (options.length === 1) {
			this.classificationDropdown.disableDropdown();
		}
	}

	initGroupDropdown() {
		if (this.config.hasClassification || !this.flattenedFilteredData)
			this.flattenedFilteredData = this.getFlattenedFilteredData();

		const topicsWhereCharacteristicsVaryBySubtopic = ["obesity-child", "obesity-adult", "birthweight"].concat(
			nhisTopics.map((t) => t.id)
		);

		let allGroupIds;
		if (topicsWhereCharacteristicsVaryBySubtopic.includes(this.dataTopic)) {
			allGroupIds = this.socrataData.filter((d) => d.panel_num == this.config.classificationId);
		} else {
			allGroupIds = this.socrataData;
		}

		allGroupIds = [...new Map(allGroupIds.map((item) => [item.stub_name, item])).values()].sort(
			(a, b) => a.stub_name_num - b.stub_name_num
		);

		const options = allGroupIds.map((d) => ({
			text: d.stub_name,
			value: d.stub_name_num,
		}));

		this.groupDropdown = new GenDropdown({
			containerId: "groupDropdown",
			ariaLabel: "view data by group",
			options,
			selectedValue: this.selections?.group,
		});
		this.groupDropdown.render();
		this.groupId = this.groupDropdown.value();
	}

	setVerticalUnitAxisSelect() {
		let allUnitsArray = this.socrataData.filter(
			(item) => parseInt(item.stub_name_num, 10) === parseInt(this.groupId, 10)
		);

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allUnitsArray = [...new Map(allUnitsArray.map((item) => [item.unit, item])).values()];

		// now sort them in id order
		allUnitsArray.sort((a, b) => {
			return a.unit_num - b.unit_num;
		});

		$("#unit-num-select-map").empty();
		$("#unit-num-select-chart").empty();
		// on the table tab
		$("#unit-num-select-table").empty();

		let foundUnit = false;
		// PROBLEM: on Suicide and AGe... we have not unit_num 1 so it only has 2 and this the filter in render removes out all data
		allUnitsArray.forEach((y) => {
			if (this.config.yAxisUnitId == y.unit_num) {
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
		if (!foundUnit) {
			// have to set to a valid unit num or data will error out
			this.config.yAxisUnitId = $("#unit-num-select-chart option:first").val(); // set to first item on the unit list
		}
	}

	updateClassification(classificationId) {
		this.legend = null;
		this.allMapData = null;
		this.currentTimePeriodIndex = 0;

		this.events.stopAnimation();
		this.config.classificationId = parseInt(classificationId, 10);
		this.initGroupDropdown();

		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.updateGroup(1);
			this.groupDropdown.value("1");
			this.groupDropdown.disableDropdown();
			return;
		}

		DataCache.activeLegendList = [];
		this.renderDataVisualizations();
	}

	updateGroup(groupId, updateTimePeriods = true) {
		this.events.stopAnimation();
		this.groupId = groupId;
		this.setVerticalUnitAxisSelect();

		if (updateTimePeriods) this.resetTimePeriods();

		DataCache.activeLegendList = [];
		this.renderDataVisualizations();
	}

	initStartPeriodDropdown(options) {
		this.startPeriod = options[0].value;
		this.startYear = functions.getYear(this.startPeriod);

		this.startPeriodDropdown = new GenDropdown({
			containerId: "startYearContainer",
			ariaLabel: "select starting period",
			options,
			selectedValue: this.startPeriod,
		});
		this.startPeriodDropdown.render();
	}

	initEndPeriodDropdown(options) {
		this.endPeriod = options.slice(-1)[0].value;
		this.endYear = functions.getYear(this.endPeriod);
		this.endPeriodDropdown = new GenDropdown({
			containerId: "endYearContainer",
			ariaLabel: "select ending period",
			options,
			selectedValue: this.endPeriod,
		});
		this.endPeriodDropdown.render();
	}

	resetTimePeriods() {
		const allYearsArray = [...new Set(this.getFilteredYearData().map((d) => d.year))].sort((a, b) =>
			a.localeCompare(b)
		);

		this.allYearsOptions = allYearsArray.map((d) => ({ text: d, value: d }));
		this.initStartPeriodDropdown(this.allYearsOptions);
		this.initEndPeriodDropdown(this.allYearsOptions.slice(1));
		this.currentTimePeriodIndex = 0;
	}

	updateStartTimePeriodDropdown(value) {
		this.startPeriodDropdown.value(value, false);
	}

	updateStartPeriod(start) {
		this.startPeriod = start;
		this.currentTimePeriodIndex = this.allYearsOptions.findIndex((d) => d.value === start);
		this.startYear = functions.getYear(start);
		const endPeriodOptions = this.allYearsOptions.filter((d) => this.startYear <= functions.getYear(d.value));
		this.initEndPeriodDropdown(endPeriodOptions);
		this.renderDataVisualizations();
	}

	updateEndPeriod(end) {
		this.endYear = end;
		this.endPeriod = functions.getYear(end);
		this.renderChart();
	}

	updateYAxisUnitId(yAxisUnitId) {
		this.config.yAxisUnitId = parseInt(yAxisUnitId, 10);
		this.initGroupDropdown();

		// DUE TO MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
		// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
		if (this.flattenedFilteredData[0].hasOwnProperty("estimate_uci")) {
			$("#enable-CI-checkbox").prop("disabled", false);
		} else {
			$("#enable-CI-checkbox").prop("disabled", true);
			$("#enable-CI-checkbox").prop("checked", false);
		}

		this.renderDataVisualizations();
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		if (value === 0) {
			this.resetTimePeriods();
			$("#startYearContainer-label").html("Start Period");
		} else $("#startYearContainer-label").html("Period");
		this.renderChart();
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
	}

	updateEnableCI(value) {
		this.config.enableCI = value;
		this.renderChart();
	}

	updateClassifyType(value) {
		this.binning = value;
		this.resetTimePeriods();
		this.renderMap();
	}

	toggleLegendItem(value) {
		const selDataPt = value.replace(/_/g, " ");

		const currentLength = DataCache.activeLegendList.length;
		const foundItemIndex = DataCache.activeLegendList.findIndex((f) => f.stub_label === selDataPt);

		if (currentLength > 0 && foundItemIndex !== -1) DataCache.activeLegendList.splice(foundItemIndex, 1);
		else if (currentLength < 10) DataCache.activeLegendList.push({ stub_label: selDataPt, dontDraw: false });
		else return;

		this.renderChart();
	}

	// call this when Reset Button is clicked
	resetSelections() {
		functions.resetTopicDropdownList();
		this.initClassificationDropdown();
		this.groupId = 0;
		this.initGroupDropdown();

		// remove "View Single Period" if it is set
		$("#show-one-period-checkbox").prop("checked", false);
		$("#startYearContainer").removeClass("offset-3");
		$("#endYearContainer").show();
		this.showBarChart = false;

		// reset and show time period start/end dropdowns
		this.resetTimePeriods();
		$(".timePeriodContainer").css("display", "flex");

		this.setVerticalUnitAxisSelect();
		DataCache.activeLegendList = [];

		// default back to "Chart" tab
		if (this.activeTabNumber === 1) this.renderChart();
		else $("a[href='#chart-tab']").trigger("click");
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
	}

	renderDataTable() {
		const tableData = this.flattenedFilteredData;
		let tableId = "nchs-table";
		let cols = ["Classification", "Group", "Subgroup", "Year", "Age", "Estimate", "Standard Error"];
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
				const lastWord = words.splice(-1);
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
