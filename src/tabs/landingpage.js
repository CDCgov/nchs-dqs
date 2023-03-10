import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import { GenChart } from "../components/general/genChart";
import { GenMap } from "../components/general/genMap";
import * as hashTab from "../utils/hashTab";
import { MainEvents } from "../eventhandlers/mainevents";
import * as config from "../components/landingPage/config";
import { nhisGroups, nhisTopics } from "../components/landingPage/nhis";
import * as functions from "../components/landingPage/functions";
import { GenDropdown } from "../components/general/genDropdown";
import { TopicDropdown } from "../components/general/topicDropdown";
import { SubgroupMultiSelectDropdown } from "../components/general/subgroupMultiSelectDropdown";

export class LandingPage {
	constructor() {
		this.socrataData = null;
		this.nhisData = null;
		this.csv = null;
		this.chartConfig = null;
		this.flattenedFilteredData = null;
		this.dataTopic = "obesity-child"; // default
		this.groupId = 0;
		this.startPeriod = null;
		this.startYear = null; // first year of the first period
		this.endPeriod = null;
		this.endYear = null; // first year of the last period
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
		this.subgroupDropdown = new SubgroupMultiSelectDropdown({
			tabName: "landingPage",
			containerId: "subgroupDropdown",
			chartContainerId: "chart-container",
		});
		this.estimateTypeTableDropdown = null;
		this.allYearsOptions = null;
		this.dataTable = null;
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
			console.log("SOCRATA get topic", config.socrataId);

			let [metaData, jsonData] = [];
			let metaUrl, dataUrl;

			if (config.private == 0) {
				metaUrl = `https://data.cdc.gov/api/views/${config.socrataId}`;
				dataUrl = `https://data.cdc.gov/resource/${config.socrataId}.json?$limit=50000`;
			} else {
				//t is Socrata ID, m is metadata and p is private
				metaUrl = `https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&m=1&p=${config.private}`;
				dataUrl = `https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${config.socrataId}&m=0&p=${config.private}`;
			}

			[metaData, jsonData] = await Promise.all([
				fetch(metaUrl).then((res) => res.text()),
				fetch(dataUrl).then((res) => res.text()),
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
		$("#chartSelectors").html(config.chartAndTableSelectors);
		$("#subGroupsSelectorsSection").hide();
		$("#mapBinningTypeSelector").hide();

		this.events = new MainEvents(this.animationInterval);
		this.events.registerEvents(); // add any click events inside here

		functions.addHtmlTooltips();

		$("#tabs").tabs({
			active: this.activeTabNumber, // this is the chart tab, always set to start here on page load
			activate: (e) => {
				let target = e.currentTarget;
				let id;
				if (!target) {
					// if the keyboard is used to navigate tabs, neither target nor currentTarget are available
					// if there is no map and navigation lands on map-tab, switch to either table or chart
					target = $(".ui-tabs-active > a");
					id = parseInt(target.attr("id").slice(-1), 10);
					if (!this.config.hasMap && id === 1) {
						if (this.activeTabNumber === 1) {
							// activate table
							$("#ui-id-3").trigger("click");
							return;
						}
						// activate chart
						$("#ui-id-2").trigger("click");
						return;
					}
				} else id = parseInt(target.id.slice(-1), 10);

				this.activeTabNumber = id - 1;
				$("#subgroupDropdown .genDropdownOpened").removeClass("genDropdownOpened");
				switch (this.activeTabNumber) {
					case 0:
						this.updateGroup(1, false);
						this.groupDropdown.value("1");
						this.groupDropdown.disableDropdown();
						this.allMapData = null;
						this.estimateTypeMapDropdown.value(this.config.yAxisUnitId);
						break;
					case 1:
						this.groupDropdown.enableDropdown();
						this.groupDropdown.enableValues("all");
						this.renderDataVisualizations();
						break;
					case 2: // table
						this.renderDataVisualizations();
						$("#showAllSubgroupsSlider").trigger("focus");
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

	renderMap(data) {
		if (!$("#mapSelectors #chart-table-selectors").length) {
			$("#chart-table-selectors").detach().prependTo("#mapSelectors");
			$("#subGroupsSelectorsSection").hide();
			$("#ciTableSlider").hide();
			$("#mapBinningTypeSelector").show();
		}

		$("#chart-subtitle").html(`<strong>Classification: ${this.classificationDropdown.text()}</strong>`);

		let stateData = [...data];
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

	renderChart(data) {
		if (!$("#chartSelectors #chart-table-selectors").length) {
			$("#chart-table-selectors").detach().prependTo("#chartSelectors");
			$("#subGroupsSelectorsSection").hide();
			$("#ciTableSlider").show();
			$("#mapBinningTypeSelector").hide();
		}

		const flattenedData = [...data];
		this.flattenedFilteredData = flattenedData;
		const checkedSubgroups = [...$("#genMsdSelections input:checked").map((i, el) => $(el).data("val"))];
		const chartData = flattenedData.filter((d) => checkedSubgroups.includes(d.stub_label));

		this.chartConfig = functions.getAllChartProps(
			chartData,
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
		const data = this.getFlattenedFilteredData();
		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.renderMap(data);
			$("#btnTableExport").hide();
			$("#dwn-chart-img").show();
		} else if (this.activeTabNumber === 1) {
			const disabled = this.groupDropdown.text().toLowerCase().includes("total");
			this.subgroupDropdown.disable(disabled);
			this.subgroupDropdown.setMaxSelections(7);
			this.renderChart(data);
			$("#btnTableExport").hide();
			$("#dwn-chart-img").show();
		} else if (this.activeTabNumber === 2) {
			const onTotal = this.groupDropdown.text().toLowerCase().includes("total");
			const showingAllSubgroups = $("#showAllSubgroupsSlider").is(":checked");
			const disabled = onTotal || showingAllSubgroups;
			this.subgroupDropdown.disable(disabled);
			this.subgroupDropdown.setMaxSelections(1000); // arbitrary large number
			this.renderDataTable(data);
			$("#btnTableExport").show();
			$("#dwn-chart-img").hide();
		}
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
		$(".genLoader").removeClass("active");
	};

	getFlattenedFilteredData() {
		let data = this.socrataData.filter(
			(d) =>
				d.unit_num == this.config.yAxisUnitId &&
				d.stub_name_num == this.groupId &&
				(!this.startYear || parseInt(d.year_pt, 10) >= parseInt(this.startYear, 10)) &&
				(!this.endYear || parseInt(d.year_pt, 10) <= parseInt(this.endYear, 10))
		);

		if (this.config.hasClassification) data = data.filter((d) => d.panel_num == this.config.classificationId);
		if (!this.allMapData && this.activeTabNumber === 0 && this.groupId === 1) this.allMapData = [...data];

		if (data[0]?.estimate_uci) {
			// enable the CI checkbox
			$("#confidenceIntervalSlider").prop("disabled", false);
			$("#ciTableSlider-tooltip").hide();
		} else {
			// disable it
			$("#confidenceIntervalSlider").prop("disabled", true);
			$("#confidenceIntervalSlider").prop("checked", false);
			$("#ciTableSlider-tooltip").show();
		}

		data.sort((a, b) => a.year_pt - b.year_pt).sort((a, b) => a.stub_label_num - b.stub_label_num);

		if (this.showBarChart) {
			const allDataGroups = [...new Set(data.map((d) => d.stub_label))];

			// filter to just the start year
			if (this.startYear) data = data.filter((d) => d.year_pt == this.startYear);

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

		const allFootnoteIdsArray = [
			...new Set(
				data
					.map((d) => d.footnote_id_list)
					.join(",")
					.split(",")
			),
		];

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

	updateFootnotes(footnotesIdArray) {
		const sourceTextNotes = [...footnotesIdArray].filter((d) => d.toString().startsWith("SC"));
		let sourceText = "";
		if (sourceTextNotes.length) {
			sourceText = sourceTextNotes
				.map((d) => `<div></div><b>Source</b>: ${d}: ${functions.linkify(this.footnoteMap[d])}</div>`)
				.join("");
		}
		$("#source-text-map").html(sourceText);
		$("#source-text-chart").html(sourceText);

		// now update the footnotes on the page
		let footerNotes = "";
		let footerNotesArray = [...footnotesIdArray].filter((d) => d.substring(0, 2) !== "SC");
		if (footerNotesArray.length > 1) footerNotesArray = footerNotesArray.filter((d) => d !== "");

		// check if there are any footnotes to display and there is not just an empty string for a single footnote
		if (footerNotesArray.length && !(footerNotesArray.length === 1 && footerNotesArray[0] === "")) {
			footerNotes = footerNotesArray
				.map((f) => `<p class='footnote-text'>${f}: ${functions.linkify(this.footnoteMap[f])}</p>`)
				.join("");
			$("#pageFooterTable").show(); // this is the Footnotes line section with the (+) toggle on right
		} else {
			$("#pageFooterTable").hide();
		}
		$("#pageFooter").html(footerNotes);
	}

	topicDropdownChange = (value) => {
		this.startYear = null;
		this.endYear = null;
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

		if (this.selections?.viewSinglePeriod) {
			$("#startYearContainer").addClass("offset-3");
			$("#endYearContainer").hide();
			this.showBarChart = true;
		}

		if (this.selections) this.groupId = parseInt(this.selections.group, 10);
		else this.groupId = 0;

		// set the chart title
		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);

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
					// assignedLegendColor: "#FFFFFF",
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
						$("#confidenceIntervalSlider").prop("disabled", false);
						$("#ciTableSlider-tooltip").hide();
					} else {
						// disable it
						$("#confidenceIntervalSlider").prop("disabled", true);
						document.getElementById("confidenceIntervalSlider").checked = false;
						$("#ciTableSlider-tooltip").show();
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
					topicGroup: k[1].topicGroup,
				});
		});

		this.topicDropdown = new TopicDropdown({
			containerId: "topicDropdown",
			ariaLabel: "select a topic",
			options: options.sort((a, b) => a.text.localeCompare(b.text)),
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

		const topicsWhereGroupsVaryByClassification = ["obesity-child", "obesity-adult", "birthweight"].concat(
			nhisTopics.map((t) => t.id)
		);

		let allGroupIds;
		if (topicsWhereGroupsVaryByClassification.includes(this.dataTopic)) {
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
		const groupText = this.groupDropdown.text();
		if (groupText.toLowerCase().includes("total")) $("#showAllSubgroupsSlider").prop("disabled", true);
		else $("#showAllSubgroupsSlider").prop("disabled", false);
		this.initSubgroupDropdown();
	}

	initSubgroupDropdown() {
		this.flattenedFilteredData = this.getFlattenedFilteredData();
		const options = [...new Set(this.flattenedFilteredData.map((f) => f.stub_label))].map((d, i) => ({
			text: d,
			value: d,
			selected: i < 5,
		}));
		this.subgroupDropdown.setOptions(options);
		this.subgroupDropdown.render();
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

		const options = allUnitsArray.map((d) => ({ text: d.unit, value: d.unit_num }));
		if (options.length) {
			this.estimateTypeTableDropdown = new GenDropdown({
				containerId: "estimateTypeDropdown",
				options,
				ariaLabel: "estimate type",
				selectedValue: this.config.yAxisUnitId,
			});
			this.estimateTypeTableDropdown.render();

			this.estimateTypeMapDropdown = new GenDropdown({
				containerId: "estimateTypeDropdownMap",
				options,
				ariaLabel: "estimate type",
				selectedValue: this.config.yAxisUnitId,
			});
			this.estimateTypeMapDropdown.render();

			if (!options.find((o) => o.value == this.config.yAxisUnitId)) this.config.yAxisUnitId = options[0].value;
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
			this.updateGroup(1, false);
			this.groupDropdown.value("1");
			this.groupDropdown.disableDropdown();
			return;
		}

		this.renderDataVisualizations();
	}

	updateGroup(groupId, updateTimePeriods = true) {
		this.events.stopAnimation();
		this.groupId = groupId;
		this.setVerticalUnitAxisSelect();

		if (updateTimePeriods) this.resetTimePeriods();
		const groupText = this.groupDropdown.text();
		if (groupText.toLowerCase().includes("total")) {
			$("#showAllSubgroupsSlider").prop("disabled", true);
		} else {
			$("#showAllSubgroupsSlider").prop("disabled", false);
		}

		this.initSubgroupDropdown();
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

		const startPeriodOptions = this.selections?.viewSinglePeriod
			? this.allYearsOptions
			: this.allYearsOptions.slice(0, -1);
		this.initStartPeriodDropdown(startPeriodOptions);
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
		const endPeriodOptions = this.allYearsOptions.filter((d) => this.startYear < functions.getYear(d.value));
		if (endPeriodOptions.length) this.initEndPeriodDropdown(endPeriodOptions);
		this.renderDataVisualizations();
	}

	updateEndPeriod(end) {
		this.endYear = end;
		this.endPeriod = functions.getYear(end);
		this.renderDataVisualizations();
	}

	updateYAxisUnitId(yAxisUnitId) {
		this.config.yAxisUnitId = parseInt(yAxisUnitId, 10);

		// DUE TO MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
		// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
		if (this.flattenedFilteredData[0]?.hasOwnProperty("estimate_uci")) {
			$("#confidenceIntervalSlider").prop("disabled", false);
			$("#ciTableSlider-tooltip").hide();
		} else {
			$("#confidenceIntervalSlider").prop("disabled", true);
			document.getElementById("confidenceIntervalSlider").checked = false;
			$("#ciTableSlider-tooltip").show();
		}

		this.renderDataVisualizations();
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		if (value === 0) {
			this.resetTimePeriods();
			$("#startYearContainer-label").html("Start Period");
		} else {
			this.initStartPeriodDropdown(this.allYearsOptions);
			$("#startYearContainer-label").html("Period");
		}
		this.renderDataVisualizations();
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
	}

	updateEnableCI(value) {
		this.config.enableCI = value;
		this.renderDataVisualizations();
	}

	updateClassifyType(value) {
		this.binning = value;
		this.resetTimePeriods();
		this.renderMap(this.flattenedFilteredData);
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

		// default back to "Chart" tab
		if (this.activeTabNumber === 0) $("a[href='#chart-tab']").trigger("click");
		else this.renderDataVisualizations();

		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId);
	}

	renderDataTable(data, search) {
		if (!$("#tableSelectors #chart-table-selectors").length) {
			$("#chart-table-selectors").detach().prependTo("#tableSelectors");
			$("#subGroupsSelectorsSection").show();
			$("#ciTableSlider").show();
			$("#mapBinningTypeSelector").hide();
		}

		let tableData = [...data];
		if (!$("#showAllSubgroupsSlider").is(":checked")) {
			const checkedSubgroups = [...$("#genMsdSelections input:checked").map((i, el) => $(el).data("val"))];
			tableData = tableData.filter((d) => checkedSubgroups.includes(d.stub_label));
		}

		$("#chart-title").html(`<strong>${this.config.chartTitle}</strong>`);
		$("#chart-subtitle").html(`<strong>Classification: ${this.classificationDropdown.text()}</strong>`);

		const showCI = document.getElementById("confidenceIntervalSlider").checked && this.config.hasCI;
		const groupNotAge = !this.groupDropdown.text().toLowerCase().includes("age");

		tableData = tableData.map((d) => ({
			year: d.year,
			column: `${d.stub_label}${
				d.age && groupNotAge && d.age !== "N/A" && d.age !== d.stub_label ? ": " + d.age : ""
			}`,
			data: `${d.estimate}${showCI && d.estimate ? " (" + d.estimate_lci + ", " + d.estimate_uci + ")" : ""}${
				d.flag ? " " + d.flag : ""
			}`,
		}));

		if (tableData.every((d) => !d.data || d.data === "NaN")) {
			$("#tableResultsCount").hide();
			$(".expanded-data-table")
				.empty()
				.html(
					`<div style="text-align: center; margin: 30px; font-size: 1rem;">There are no data for your selections. Please change your options. Select at least one Subgroup.</div>`
				);
			return;
		}
		$("#tableResultsCount").show();

		const columns = [...new Set(tableData.map((d) => d.column))];
		const years = [...new Set(tableData.map((d) => d.year))];
		const allResultsCount = columns.length * years.length;
		$("#fullTableCount").html(allResultsCount);
		$("#filteredTableCount").html(allResultsCount);
		let tableId = "nchs-table";

		$(".expanded-data-table").empty().html(`
			<div class="row genSearch">
				<div class="col-12" style="width: 100%; display: flex; align-items: center; position: relative;">
					<i class="fa fa-search" style="padding: 0 6px;"></i>
					<input
						id="search-table"
						class="form-control form-control-sm"
						style="width: 100%; border: 1px solid lightgrey;"
						type="text"
						placeholder="Search this table"
						value="${search ?? ""}" />
					<i  role="button"
						tabindex="0"
						class="fa fa-times-circle"
						id="clear-search-table" style="padding: 0 6px; cursor: pointer; position: absolute; right: 0.6em; font-size: 1.5em; color: grey;"
						aria-label="press enter to reset table to all results"></i>
				</div>
			</div>
			<table id="nchs-table" class="table table-bordered">
				<thead>
					<tr>
						<th style="position: sticky; left: 0; z-index: 3; background-color: #e0e0e0;" class="dtfc-fixed-left">Year</th>
						<th colspan="${columns.length}">Estimate${showCI ? " (Confidence Interval)" : ""}</th>
					</tr>
					<tr>
						<th style="left: 1px !important;"></th>
						${columns.map((c, i) => `<th class="headerValue" data-index=${i + 1}>${c}</th>`).join("")}
					</tr>
				</thead>
				<tbody></tbody>
			</table>`);

		const body = `#${tableId} > tbody`;

		years.forEach((d) => {
			const row = `
			<tr>
				<th tabindex="0">${d}</th>
				${columns.map((c) => {
					const value = tableData.find((f) => f.column === c && f.year === d)?.data ?? "";
					return `<td tabindex="0">${value.includes("NaN") ? value.replaceAll("NaN", "") : value}</td>`;
				})}</tr>`;
			$(body).append(row);
		});

		$("#clear-search-table").hide();
		this.dataTable = $("#nchs-table")
			.DataTable({
				bAutoWidth: false,
				bInfo: false,
				paging: false,
				scrollX: "auto",
				fixedColumns: {
					left: 1,
				},
				searching: false,
				dom: "tB",
				buttons: ["csv"],
			})
			.columns.adjust();

		const filter = $("div.dataTables_filter");
		$(filter).parent().parent().find("div:first").remove();
		$(filter).parent().removeClass().addClass("col-12");
		$(filter).find("label").prepend("<i class='fa fa-search' style='padding: 0 6px'></i>");

		let allWordsInHeaderValues = [];
		$(".headerValue").each((i, d) => {
			const words = $(d).text().split(" ");
			words.forEach((w) => {
				if (!allWordsInHeaderValues.includes(w)) allWordsInHeaderValues.push(w);
			});
		});
		allWordsInHeaderValues = allWordsInHeaderValues.map((d) => d.replace(":", "").toLowerCase());
		const clearIndices = columns.map((d, i) => i + 1);

		const hideShowColumns = (search) => {
			clearIndices.forEach((i) => {
				const column = this.dataTable.column(i);
				column.visible(true);
			});

			if (search === "") {
				$("#clear-search-table").hide();
				$("#filteredTableCount").html(allResultsCount);
				return;
			}
			const searchIsFullWordInHeader = allWordsInHeaderValues.includes(search.toLowerCase());
			$(".dataTables_scrollHeadInner .headerValue").each((i, d) => {
				const column = this.dataTable.column(i + 1);
				const wordsInHeader = $(d)
					.text()
					.split(" ")
					.map((d) => d.replace(":", "").toLowerCase());
				if (searchIsFullWordInHeader && !wordsInHeader.includes(search.toLowerCase())) column.visible(false);
				else if (!searchIsFullWordInHeader && !wordsInHeader.some((w) => w.includes(search.toLowerCase())))
					column.visible(false);
			});
			// check if user has filtered out all columns
			const visibleColumns = this.dataTable
				.columns()
				.visible()
				.filter((d) => d === true);
			if (visibleColumns.length === 1) {
				this.renderDataTable(data, search);
				return;
			}

			$("#filteredTableCount").html($(".dataTables_scrollHeadInner .headerValue").length * years.length);
		};

		$("#search-table")
			.autocomplete({
				source: allWordsInHeaderValues,
				select: (event, ui) => {
					$("#search-table").val(ui.item.value);
					$("#search-table").trigger("keyup");
					hideShowColumns(ui.item.value);
				},
				response: (event, ui) => {
					if (!ui.content.length) ui.content.push({ value: "", label: "No results found" });
				},
			})
			.on("keyup", (e) => {
				if ($("#search-table").val() === "") {
					hideShowColumns("");
					return;
				}
				if (e.keyCode === 13) {
					hideShowColumns($("#search-table").val());
					$("#search-table").autocomplete("close");
				} else if (e.keyCode === 27 && $("#search-table").val() !== "") $("#search-table").val("");
				else $("#clear-search-table").show();
			});

		$("#clear-search-table").on("click", () => {
			$("#search-table").val("");
			hideShowColumns("");
		});

		$("#btnTableExport").empty().append(`Download Data <i class="fas fa-download" aria-hidden="true"></i>`);
		this.dataTable.buttons().container().appendTo($("#btnTableExport"));
		// $(".buttons-csv.buttons-html5").html("");
	}
}
