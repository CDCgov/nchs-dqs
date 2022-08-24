import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import { GenChart } from "../components/general/genChart";
import { GenMap } from "../components/general/genMap";
import * as hashTab from "../utils/hashTab";
import { MainEvents } from "../eventhandlers/mainevents";
import { downloadCSV } from "../utils/downloadCSV";
import { HtmlTooltip } from "../components/general/htmlTooltip";
import * as config from "../config";

export class LandingPage {
	constructor() {
		this.socrataData = null;
		this.csv = null;
		this.chartConfig = null;
		this.flattenedFilteredData = null;
		this.dataTopic = "obesity-child"; // default
		this.stubNameNum = 0;
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

	getUSMapData = async () => (this.topoJson ? null : Utils.getJsonFile("content/json/State_Territory_FluView1.json"));

	// this is the function that cleans up Socrata data
	addMissingProps = (cols, rows) => {
		let newArray = [];
		rows.forEach((row) => {
			const keys = Object.keys(row);
			const difference = cols.filter((col) => !keys.includes(col));
			if (difference.length > 0) {
				difference.forEach((item) => {
					row[item] = null;
				});
				newArray.push(row);
			} else {
				newArray.push(row);
			}
		});
		return newArray;
	};

	getSelectedSocrataData = async (config) => {
		let nchsData = DataCache[`data-${config.socrataId}`];
		if (nchsData) return nchsData;

		try {
			let [metaData, jsonData] = [];
			console.log("SOCRATA get topic", config.socrataId);

			[metaData, jsonData] = await Promise.all([
				//t is Socrata ID, m is metadata and p is private
				fetch(
					`https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&&m=1&&p=${config.private}`
				).then((res) => res.text()),
				fetch(
					`https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&&m=0&&p=${config.private}`
				).then((res) => res.text()),
			]);

			const columns = JSON.parse(metaData).columns.map((col) => col.fieldName);

			nchsData = this.addMissingProps(columns, JSON.parse(jsonData));
			DataCache[`data-${config.socrataId}`] = nchsData;
			return nchsData;
		} catch (err) {
			console.error("Error fetching data", err);
			return null;
		}
	};

	addHtmlTooltips = () => {
		const resetInfoTooltip = new HtmlTooltip({
			h3: "Reset all selections except for Topic selection.",
			containerId: "resetInfoContainer",
		});
		resetInfoTooltip.render();

		$("#resetInfo").mouseover((e) => resetInfoTooltip.mouseover(e));
		$("#resetInfo").mousemove((e) => resetInfoTooltip.mousemove(e));
		$("#resetInfo").mouseleave((e) => resetInfoTooltip.mouseout(e));

		const addFiltersTooltip = new HtmlTooltip({
			h3: "This feature is a work in progress.",
			containerId: "resetInfoContainer",
		});
		addFiltersTooltip.render();

		$("#addFiltersTextContainer").mouseover((e) => addFiltersTooltip.mouseover(e));
		$("#addFiltersTextContainer").mousemove((e) => addFiltersTooltip.mousemove(e));
		$("#addFiltersTextContainer").mouseleave((e) => addFiltersTooltip.mouseout(e));

		const editFiltersTooltip = new HtmlTooltip({
			h3: "This feature is a work in progress.",
			containerId: "resetInfoContainer",
		});
		editFiltersTooltip.render();

		$("#editFiltersTextContainer").mouseover((e) => editFiltersTooltip.mouseover(e));
		$("#editFiltersTextContainer").mousemove((e) => editFiltersTooltip.mousemove(e));
		$("#editFiltersTextContainer").mouseleave((e) => editFiltersTooltip.mouseout(e));
	};

	renderTab() {
		document.getElementById("maincontent").innerHTML = config.tabContent;
		MainEvents.registerEvents(); // add any click events inside here
		this.addHtmlTooltips();

		$("#tabs").tabs({
			active: this.activeTabNumber, // this is the chart tab, always set to start here on page load
			activate: (e) => {
				this.activeTabNumber = parseInt(e.currentTarget.id.split("-")[2], 10) - 1;
				switch (this.activeTabNumber) {
					case 0:
						this.updateStubNameNum(1, false);
						$("#stub-name-num-select").val(1);
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
		this.updateDataTopic(this.dataTopic); // this gets Socrata data and renders chart/map/datatable;
	}

	getYear = (period) => parseInt(period.split("-")[0], 10);

	renderMap() {
		let panelText = $("#panel-num-select option:selected").text();
		this.chartSubTitle = "Subtopic: " + panelText;
		$("#chart-subtitle").html(`<strong>${this.chartSubTitle}</strong>`);

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

		this.chartConfig = this.getChartBaseProps();
		this.chartConfig = this.getAllChartProps(flattenedData, this.chartConfig);
		this.chartConfig.chartTitle = ""; // dont use the built in chart title

		$(`#${this.chartConfig.vizId}`).empty();
		const genChart = new GenChart(this.chartConfig);
		genChart.render();

		// set the title - easier to do it all here based on selectors
		let indicatorText = $("#data-topic-select option:selected").text();
		let stubText = $("#stub-name-num-select option:selected").text();
		if (this.showBarChart) {
			this.config.chartTitle = indicatorText + " by " + stubText + " in " + this.startPeriod;
		} else {
			this.config.chartTitle =
				indicatorText + " by " + stubText + " from " + this.startPeriod + " to " + this.endPeriod;
		}
		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);
		let panelText = $("#panel-num-select option:selected").text();
		this.chartSubTitle = "Subtopic: " + panelText;
		$("#chart-subtitle").html(`<strong>${this.chartSubTitle}</strong>`);
	}

	renderDataVisualizations = () => {
		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.renderMap();
		} else this.renderChart();
		this.renderDataTable();
		hashTab.writeHashToUrl();
	};

	getFlattenedFilteredData() {
		if (this.dataTopic === "injury") this.stubNameNum++;
		let selectedPanelData = this.socrataData.filter(
			(d) =>
				parseInt(d.unit_num, 10) === parseInt(this.config.unitNum, 10) &&
				parseInt(d.stub_name_num, 10) === parseInt(this.stubNameNum, 10) &&
				parseInt(d.year_pt, 10) >= parseInt(this.startYear, 10) &&
				parseInt(d.year_pt, 10) <= parseInt(this.endYear, 10)
		);

		if (this.config.hasSubtopic)
			selectedPanelData = selectedPanelData.filter(
				(d) => parseInt(d.panel_num, 10) === parseInt(this.config.panelNum, 10)
			);

		if (selectedPanelData[0]?.hasOwnProperty("estimate_uci")) {
			// enable the CI checkbox
			$("#enable-CI-checkbox").prop("disabled", false);
		} else {
			// disable it
			$("#enable-CI-checkbox").prop("disabled", true);
			$("#enable-CI-checkbox").prop("checked", false);
		}

		selectedPanelData.sort((a, b) => a.year_pt - b.year_pt).sort((a, b) => a.stub_label_num - b.stub_label_num);

		if (this.showBarChart) {
			// filter to just the start year
			selectedPanelData = selectedPanelData.filter(
				(d) => parseInt(d.year_pt, 10) === parseInt(this.startYear, 10)
			);
		} else {
			// set up for line chart
			selectedPanelData = selectedPanelData.map((d) => ({
				...d,
				subLine: d.stub_label,
			}));
		}

		let allFootnoteIdsArray = selectedPanelData.map((d) => d.footnote_id_list);
		this.updateFootnotes(allFootnoteIdsArray, this.dataTopic);

		// "date" property is necessary for correctly positioning data point for these charts
		if (this.dataTopic === "suicide" || this.dataTopic === "medicaidU65")
			return [...selectedPanelData].map((d) => ({
				...d,
				date: new Date(`${d.year}-01-01T00:00:00`),
			}));

		return [...selectedPanelData];
	}

	// Pull all the available years, filtering by panel, unit, and stubname
	getFilteredYearData() {
		this.config.panelNum = $("#panel-num-select option:selected").val();

		const filteredData = this.socrataData.filter(
			(d) =>
				parseInt(d.unit_num, 10) === parseInt(this.config.unitNum, 10) &&
				parseInt(d.stub_name_num, 10) === parseInt(this.stubNameNum, 10)
		);

		return this.config.hasSubtopic
			? filteredData.filter((d) => parseInt(d.panel_num, 10) === parseInt(this.config.panelNum, 10))
			: filteredData;
	}

	getChartBaseProps = () => {
		const chartValueProperty = "estimate";
		let xAxisTitle;

		// X Axis Title is the "Characteristic" selected
		xAxisTitle = $("#stub-name-num-select option:selected").text();
		return { chartValueProperty, xAxisTitle };
	};

	getAllChartProps = (data, chartBaseProps) => {
		const { chartValueProperty, xAxisTitle } = chartBaseProps;
		const vizId = "chart-container";
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
		const scaleTimeIndicators = ["suicide", "Medicaid"];
		const needsScaleTime = scaleTimeIndicators.some((ind) => data[0]?.indicator.includes(ind));

		return {
			data,
			chartProperties: {
				yLeft1: this.showBarChart ? "stub_label" : chartValueProperty,
				xAxis: this.showBarChart ? chartValueProperty : needsScaleTime ? "date" : "year",
				bars: "estimate",
			},
			enableCI: this.config.enableCI,
			usesLegend: true,
			legendBottom: true,
			usesDateDomainSlider: false,
			usesBars: this.showBarChart,
			usesHoverBars: this.showBarChart,
			barLayout: this.showBarChart ? { horizontal: true, size: 60 } : { horizontal: false, size: null },
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
			marginRightMin: 20,
			axisLabelFontScale: this.showBarChart ? 0.5 : 1,
			usesChartTitle: true,
			usesLeftAxis: true,
			usesLeftAxisTitle: true,
			usesBottomAxis: !this.showBarChart,
			usesTopAxis: this.showBarChart,
			usesXAxisTitle: true,
			usesDateAsXAxis: !this.showBarChart,
			needsScaleTime: !this.showBarChart && needsScaleTime,
			yLeftLabelScale: this.showBarChart ? 10 : 1,
			legendCoordinatePercents: legendCoordPercents,
			bottomAxisTitle: xAxisTitle,
			// leftAxisTitle: xAxisTitle,
			formatXAxis: "string",
			usesMultiLineLeftAxis: !this.showBarChart,
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

	updateDataTopic(dataTopic) {
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

		$("#enable-CI-checkbox-wrapper").toggle(this.config.enableCI); // toggle is show/hide depending on boolean
		this.config.enableCI = false;
		$("#enable-CI-checkbox").prop("checked", false);

		if (this.selections) this.stubNameNum = parseInt(this.selections.characteristic, 10);
		else this.stubNameNum = 0;

		// set the chart title
		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);

		DataCache.activeLegendList = [];

		// this loads the obesity-childhood data as the INITIAL data load
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
						year_pt: this.getYear(d.year),
						dontDraw: false,
						assignedLegendColor: "#FFFFFF",
					}));

				//???????????????????????????
				// for line chart and bar chart, REMOVE the undefined data entirely
				if (!this.config.hasMap) {
					// remove flag = "- - -" data
					this.socrataData = this.socrataData.filter((d) => d.flag !== "- - -"); // remove undefined data
				}

				// set the Adjust vertical axis via unit_num in data
				this.setVerticalUnitAxisSelect();

				// Set dropdowns and filter data (set this.flattenedFilteredData). Picks up unit num
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
			})
			.catch((err) => console.error(`Runtime error loading data in tabs/landingpage.js: ${err}`));
	}

	setAllSelectDropdowns() {
		this.flattenedFilteredData = this.getFlattenedFilteredData();
		this.setPanelSelect();
		this.setStubNameSelect();
		this.setVerticalUnitAxisSelect();
		this.resetTimePeriods();
	}

	// Subtopic
	setPanelSelect() {
		// Creates an array of objects with unique "name" property values. Have to iterate over the unfiltered data

		let allPanelsArray = [...new Map(this.socrataData.map((item) => [item.panel, item])).values()];
		// now sort them in id order
		allPanelsArray.sort((a, b) => {
			return a.panel_num - b.panel_num;
		});
		// console.log("allPanelsArray", allPanelsArray);
		$("#panel-num-select").empty();

		allPanelsArray.forEach((y) => {
			// allow string to int equality with ==
			if (this.config.panelNum == y.panel_num || y.panel === "N/A")
				$("#panel-num-select").append(
					`<option value="${y.panel_num}" selected>${y.panel === "N/A" ? "Not Applicable" : y.panel}</option>`
				);
			else $("#panel-num-select").append(`<option value="${y.panel_num}">${y.panel}</option>`);
		});

		if (!this.selections) {
			const firstVal = $("#panel-num-select option:first").val();
			$("#panel-num-select").val(firstVal);
			this.config.panelNum = firstVal;
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
		if (
			this.dataTopic === "obesity-child" ||
			this.dataTopic === "obesity-adult" ||
			this.dataTopic === "birthweight"
		) {
			allStubsArray = this.socrataData.filter(
				(item) => parseInt(item.panel_num, 10) === parseInt(this.config.panelNum, 10)
			);
		} else {
			allStubsArray = this.socrataData;
		}

		// Creates an array of objects with unique "name" property values.
		// have to iterate over the unfiltered data
		allStubsArray = [...new Map(allStubsArray.map((item) => [item.stub_name, item])).values()];

		// now sort them in id order
		allStubsArray.sort((a, b) => {
			return a.stub_name_num - b.stub_name_num;
		});

		$("#stub-name-num-select").empty();

		// reload the stubs but if new list has match for current selection
		// then - keep current selected
		let foundUnit = false;

		allStubsArray.forEach((y) => {
			if (this.stubNameNum === parseInt(y.stub_name_num, 10)) {
				$("#stub-name-num-select").append(
					`<option value="${y.stub_name_num}" selected>${y.stub_name}</option>`
				);
				foundUnit = true;
			} else {
				$("#stub-name-num-select").append(`<option value="${y.stub_name_num}">${y.stub_name}</option>`);
			}
		});

		if (foundUnit === false) {
			// now update the stubname num to the first on the list
			this.stubNameNum = $("#stub-name-num-select option:first").val();
		}
	}

	setVerticalUnitAxisSelect() {
		let allUnitsArray = this.socrataData.filter(
			(item) => parseInt(item.stub_name_num, 10) === parseInt(this.stubNameNum, 10)
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
			if (this.config.unitNum === parseInt(y.unit_num, 10)) {
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
			this.config.unitNum = $("#unit-num-select-chart option:first").val(); // set to first item on the unit list
		}
	}

	updatePanelNum(panelNum) {
		this.config.panelNum = parseInt(panelNum, 10);
		console.log("new panel num: ", this.config.panelNum);
		this.setStubNameSelect();
		this.renderDataVisualizations();
	}

	updateStubNameNum(stubNameNum, updateTimePeriods = true) {
		this.stubNameNum = stubNameNum;

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
		const singleYearsArray = allYearsArray.map((d) => this.getYear(d)).sort((a, b) => a - b);

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
		this.startYear = this.getYear(start);
		const currentEnd = $("#year-end-select :selected").text();
		$("#year-end-select").empty();

		allYearsArray.forEach((y) => {
			if (this.getYear(y) > this.startYear) {
				if (currentEnd === y) $("#year-end-select").append(`<option selected value="${y}">${y}</option>`);
				else $("#year-end-select").append(`<option value="${y}">${y}</option>`);
			}
		});
		this.renderDataVisualizations();
	}

	updateEndPeriod(end) {
		this.endYear = end;
		this.endPeriod = this.getYear(end);
		this.renderChart();
	}

	updateUnitNum(unitNum) {
		this.config.unitNum = parseInt(unitNum, 10);
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
		// reset panel
		this.setPanelSelect();

		// reset Characteristic
		this.stubNameNum = 0; // should always be TOTAL in every data set!!!
		this.setStubNameSelect();

		// remove "View Single Period" if it is set
		$("#show-one-period-checkbox").prop("checked", false);
		$("#startYearContainer").removeClass("offset-3");
		$("#endYearContainer").show();
		this.showBarChart = false;

		// reset and show time period start/end dropdowns
		this.resetTimePeriods();
		$("#timePeriodContainer").css("display", "flex");

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

		switch ($("#data-topic-select").val()) {
			case "obesity-child":
			case "obesity-adult":
			case "medicaidU65":
				cols.push("Lower Confidence Interval", "Upper Confidence Interval");
				keys.push("estimate_lci", "estimate_uci");
				break;
			default:
				break;
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
				console.log(`Words: ${words}`);
				const lastWord = words.splice(-1);
				console.log(`Last word: ${lastWord}`);
				console.log(`Words: ${words}`);
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
	}

	exportCSV() {
		downloadCSV(this.csv);
	}
}
