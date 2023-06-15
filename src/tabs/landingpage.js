import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import { GenChart } from "../components/general/genChart";
import { GenMap } from "../components/general/genMap";
import * as hashTab from "../utils/hashTab";
import { MainEvents } from "../eventhandlers/mainevents";
import { downloadCSV } from "../utils/downloadCSV";
import * as config from "../components/landingPage/config";
import { NHISTopics } from "../components/landingPage/nhis";
import * as functions from "../components/landingPage/functions";
import { GenDropdown } from "../components/general/genDropdown";
import { TopicDropdown } from "../components/general/topicDropdown";
import { SubgroupMultiSelectDropdown } from "../components/general/subgroupMultiSelectDropdown";
import { genFormat } from "../utils/genFormat";

export class LandingPage {
	constructor() {
		this.socrataData = null;
		this.NHISData = null;
		this.csv = null;
		this.chartConfig = null;
		this.flattenedFilteredData = null;
		this.dataTopic = "angina-pectoris"; // default
		this.groupId = 0;
		this.startPeriod = null;
		this.startYear = null; // first year of the first period
		this.endPeriod = null;
		this.endYear = null; // first year of the last period
		this.footnoteMap = null;
		this.showBarChart = 0;
		this.topoJson = null;
		this.selections = null;
		this.initialPageLoad = true;
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
		this.staticBinning = true;
		this.legend = null;
		this.sigFigs = null;
	}

	getUSMapData = async () => (this.topoJson ? null : Utils.getJsonFile("content/json/StatesAndTerritories.json"));

	getNhisData = (dataId, mapper) => {
		// if (DataCache[`data-${dataId}`]) return DataCache[`data-${dataId}`];
		const returnData = mapper(this.nhisData, dataId);
		DataCache[`data-${dataId}`] = returnData;
		return returnData;
	};

	getSelectedSocrataData = async (localConfig) => {
		let nchsData = DataCache[`data-${localConfig.socrataId}`];
		if (nchsData) return nchsData;

		// if there's a specific lookup id with a mapper
		if (localConfig.topicLookupId && config.topicLookup[localConfig.topicLookupId]) {
			return this.getNhisData(localConfig.socrataId, config.topicLookup[localConfig.topicLookupId].dataMapper);
		}

		try {
			let [metaData, jsonData] = [];
			let metaUrl, dataUrl;

			if (localConfig.private == 0) {
				metaUrl = `https://data.cdc.gov/api/views/${localConfig.socrataId}`;
				dataUrl = `https://data.cdc.gov/resource/${localConfig.socrataId}.json?$limit=50000`;
			} else {
				//t is Socrata ID, m is metadata and p is private
				metaUrl = `https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${localConfig.socrataId}&m=1&p=${localConfig.private}`;
				dataUrl = `https://${window.location.hostname}/NCHSWebAPI/api/SocrataData/JSONData?t=${localConfig.socrataId}&m=0&p=${localConfig.private}`;
			}

			[metaData, jsonData] = await Promise.all([
				fetch(metaUrl).then((res) => res.text()),
				fetch(dataUrl).then((res) => res.text()),
			]).catch(() => {
				Utils.getErrorMessage();
			});

			const columns = JSON.parse(metaData).columns.map((col) => col.fieldName);
			nchsData = functions.addMissingProps(columns, JSON.parse(jsonData));
			DataCache[`data-${localConfig.socrataId}`] = nchsData;
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
		DataCache.mapLegendColors = ["#a1dab4", "#41b6c4", "#2c7fb8", "#253494"];
		DataCache.noDataColorHexVal = "#fff";

		functions.addHtmlTooltips();

		const screenWidth = $(window).width();
		if (screenWidth < 1200) {
			$(".mainDropdown").removeClass("col");
		}
		if (screenWidth < 768) {
			$(".fa-arrow-circle-right").addClass("fa-rotate-90");
		}
		$("#tabs").tabs({
			active: this.activeTabNumber,
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

				if (!this.selections) this.selections = {};
				this.selections.tab = this.activeTabNumber;
				switch (this.activeTabNumber) {
					case 0:
						this.allMapData = null;
						this.updateGroup(1);
						this.groupDropdown.value("1");
						break;
					case 1:
						this.subgroupDropdown.disable(false);
						this.groupDropdown.enableDropdown();
						this.groupDropdown.enableValues("all");
						this.renderDataVisualizations();
						break;
					case 2: // table
						this.subgroupDropdown.disable(false);
						this.renderDataVisualizations();
						this.groupDropdown.enableDropdown();
						$("#showAllSubgroupsSlider").trigger("focus");
						break;

					default:
						break;
				}
			},
		});

		const hasFiltersAppliedFromUrl = this.initTopicDropdown();
		this.updateTopic(this.dataTopic, false); // this gets Socrata data and renders chart/map/datatable; "false" param means topicChange = false
		if (hasFiltersAppliedFromUrl) {
			$("#refineTopicList").attr("style", "color: #800080 !important");
			functions.updateTopicDropdownList();
		}
	}

	generateLegend = () => {
		if (!this.allMapData) {
			return null;
		}

		const min = d3.min(this.allMapData, (d) => d.estimate);
		const max = d3.max(this.allMapData, (d) => d.estimate);

		const endYearDataBinned = functions.binData(this.allMapData.filter((d) => d.year_pt === this.endYear));
		const { legend } = endYearDataBinned;

		// account for when dataset does NOT have 'no data' and therefore add that to legend object
		if (legend?.length < 5) {
			legend.unshift({ c: 0, min: null, max: null, active: 1 });
		}
		let currentMax;
		legend.forEach((l, idx) => {
			if (idx === 0) {
				return;
			}
			if (idx === 1) {
				l.min = min;
				currentMax = l.max;
			} else {
				l.min = Number((currentMax + this.config.binGranularity).toFixed(2));
				currentMax = l.max;
			}
			if (idx === 4) {
				l.max = max;
			}
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

		$("#chart-subtitle").html(`Classification: ${this.classificationDropdown.text()}`);

		let stateData = [...data];

		this.legend = this.generateLegend();
		if (!this.legend?.length || this.legend.length !== 5) {
			return;
		}

		const allDates = this.allYearsOptions.map((d) => d.value);
		stateData = stateData.filter((d) => d.year_pt == this.startYear);

		const chartTitleStart = this.config.chartTitle.split(" in ")[0];
		this.config.chartTitle = chartTitleStart + " in " + this.startPeriod;
		$("#chart-title").html(`${this.config.chartTitle}`);
		$("#mapLegendPeriod").html(this.staticBinning ? allDates.slice(-1)[0] : this.startPeriod);

		let classified;
		let staticBin;
		if (this.staticBinning) {
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
		this.updateFootnotes(stateData);

		const mapVizId = "us-map";
		let map = new GenMap({
			mapData: stateData,
			topoJson: this.topoJson,
			mLegendData: this.staticBinning ? staticBin : classified.legend,
			vizId: mapVizId,
			startYear: parseInt(this.startYear, 10),
			allDates,
			currentTimePeriodIndex: this.currentTimePeriodIndex,
			animating: this.animating,
			genTooltipConstructor: functions.getMapTooltipConstructor(this.genChart.props.genTooltipConstructor),
		});
		map.render();
		$("#us-map-time-slider").empty();
		map.renderTimeSeriesAxisSelector(this.currentTimePeriodIndex);
	}

	renderChart(data) {
		if (!$("#chartSelectors #chart-table-selectors").length) {
			$("#chart-table-selectors").detach().prependTo("#chartSelectors");
			$("#subGroupsSelectorsSection").hide();
			$("#mapBinningTypeSelector").hide();
		}

		const subgroupValues = this.subgroupDropdown.getSelectedOptionValues();
		$("#chartLegendContent").empty();

		subgroupValues.forEach((g, i) => {
			$("#chartLegendContent").append(`
				<div class="legendItems">
					<div id="legendItem-${i}" class="legendItem"></div>
					<div id="legendText-${i}" class="legendText">${g}</div>
				</div>
				`);
		});

		const flattenedData = [...data];
		this.flattenedFilteredData = flattenedData;
		const checkedSubgroups = [...$("#genMsdSelections input:checked").map((i, el) => $(el).data("val"))];
		const chartData = flattenedData.filter((d) => checkedSubgroups.includes(d.stub_label));

		this.updateFootnotes(chartData);

		this.chartConfig = functions.getAllChartProps(
			chartData,
			this.showBarChart,
			this.config,
			this.groupDropdown.text(),
			this.sigFigs
		);
		this.chartConfig.chartTitle = ""; // don't use the built in chart title
		this.chartConfig.subGroups = subgroupValues;

		// rotate labels 45 degrees
		this.chartConfig.bottomAxisRotation = this.chartConfig.usesTopAxis ? 45 : -45;

		$(`#${this.chartConfig.vizId}`).empty();
		this.genChart = new GenChart(this.chartConfig);
		this.genChart.render();

		// set the title - easier to do it all here based on selectors
		const topic = this.topicDropdown.text();
		const group = this.groupDropdown.text();

		if (this.showBarChart) {
			this.config.chartTitle = `${topic} by ${group} in ${this.startPeriod}`;
		} else {
			this.config.chartTitle = `${topic} by ${group} from ${this.startPeriod} to ${this.endPeriod}`;
		}

		$("#chart-title").html(`${this.config.chartTitle}`);
		$("#chart-subtitle").html(`Classification: ${this.classificationDropdown.text()}`);
		$("#chartLegendTitle").html(group);
	}

	renderDataVisualizations = () => {
		$(".unreliableNote").hide();
		$(".unreliableFootnote").hide();

		const data = this.getFlattenedFilteredData();
		if (this.config.hasMap && this.activeTabNumber === 0) {
			this.renderMap(data);
			$("#btnTableExport").hide();
			$("#dwn-chart-img").show();
			this.groupDropdown.disableDropdown();
			this.subgroupDropdown.disable(true);
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

		// for reading in Map, Chart, or Table from hash url
		if (this.selections?.tab && this.selections?.tab != this.activeTabNumber) {
			let { tab } = this.selections;
			let activeTab;
			if (tab == 0) {
				activeTab = "map-tab";
			} else if (tab == 1) {
				activeTab = "chart-tab";
			} else {
				activeTab = "table-tab";
			}
			$(`a[href='#${activeTab}']`).trigger("click");
			return;
		}

		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId, this.activeTabNumber);
		$(".genLoader").removeClass("active");
	};

	getFlattenedFilteredData() {
		// check if the hashLookup has been constructed for this topic. If not, construct it, update this.selections, and return to this.updateTopic
		// to get the rest of the possible hashUrl parameters.
		const topic = this.topicDropdown.value();
		if (!hashTab.hashLookup[topic]) {
			if (this.initialPageLoad && this.selections) {
				this.selections = hashTab.addToHashLookup(
					this.socrataData,
					this.topicDropdown.value(),
					this.initialPageLoad
				);
				this.initialPageLoad = false;
				this.updateTopic(topic, false);
				if (this.selections.viewSinglePeriod) {
					$("#startYearContainer-label").html("");
					$("#startYearContainer").removeClass("offset-3");
				}
				return;
			}
			// show 'From' label by default
			$("#startYearContainer-label").html("From");

			hashTab.addToHashLookup(this.socrataData, this.topicDropdown.value());
		}

		let data = this.socrataData.filter(
			(d) => d.unit_num == this.config.yAxisUnitId && d.stub_name_num == this.groupId
		);

		// get the number of significant figures in the data by finding the first estimate with a decimal and counting the places
		const estimateWithADecimal = data.find((d) => d.estimate && d.estimate.toString().includes("."));
		if (!estimateWithADecimal) {
			this.sigFigs = 0;
		} else {
			const estimate = estimateWithADecimal.estimate.toString();
			const splitEstimate = estimate.split(".");
			this.sigFigs = splitEstimate[1].length;
		}

		// there was a conditional here, but removed it so that toggling the population
		// dropdoown triggers rerender, and we need to refresh/update the mapdata as such
		this.allMapData = [...data];

		data = data.filter(
			(d) =>
				(!this.startYear || parseInt(d.year_pt, 10) >= parseInt(this.startYear, 10)) &&
				(!this.endYear || parseInt(d.year_pt, 10) <= parseInt(this.endYear, 10))
		);

		if (this.config.hasClassification) data = data.filter((d) => d.panel_num == this.config.classificationId);

		if (data[0]) {
			if (data[0].estimate_uci) {
				if (!$("ciTableSlider").is(":visible")) {
					$("#ciTableSlider").show();
				}
				// enable the CI checkbox
				$("#confidenceIntervalSlider").prop("disabled", false);
				$("#chart-table-selectors-tooltip").hide();
			} else {
				// hide confidence interval slider
				$("#ciTableSlider").hide();
				$("#chart-table-selectors-tooltip").show();
			}
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

		// "date" property is necessary for correctly positioning data point for these charts
		if (this.dataTopic === "suicide" || this.dataTopic === "medicaidU65")
			data = [...data].map((d) => ({
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

	updateFootnotes(data) {
		const allFootnoteIdsArray = [
			...new Set(
				data
					.map((d) => d.footnote_id_list)
					.join(",")
					.split(",")
			),
		];

		// now update the footnotes on the page
		let footerNotes = "";
		let footerNotesArray = [...allFootnoteIdsArray].filter((d) => d.substring(0, 2) !== "NA");
		let unreliableNotesArray = [...allFootnoteIdsArray].filter((d) => d.substring(0, 2) === "NA");
		if (footerNotesArray.length > 1) {
			const order = ["NA", "FN", "NH", "DH", "NT", "SC"];
			footerNotesArray = footerNotesArray
				.filter((d) => d !== "")
				.sort((a, b) => order.indexOf(a.substring(0, 2)) - order.indexOf(b.substring(0, 2)));
		}

		// check if there are any footnotes to display and there is not just an empty string for a single footnote
		const replaceLabel = {
			SC: "Data Source",
			FN: "Footnotes",
			NT: "Methodology",
			NA: "Reliability",
			NH: "Footnotes",
			DH: "Footnotes",
		};

		let reliabilityFootnotesSymbol = "*";

		if (footerNotesArray.length && !(footerNotesArray.length === 1 && footerNotesArray[0] === "")) {
			footerNotes = footerNotesArray
				.filter((f) => this.footnoteMap[f])
				.map(
					(f) =>
						`<p class="${replaceLabel[f.substring(0, 2)].replace(
							" ",
							""
						)}Footnote footnoteHeader"><strong>${
							replaceLabel[f.substring(0, 2)]
						}</strong></p><p>${functions.link_i_fy(this.footnoteMap[f])}</p>`
				)
				.join("");

			const unreliableNotes =
				unreliableNotesArray?.length === 0
					? ""
					: unreliableNotesArray
							.filter((f) => this.footnoteMap[f])
							.map(
								(f) =>
									`<p class="unreliableFootnote footnoteHeader"><strong>${
										replaceLabel[f.substring(0, 2)]
									}</strong></p><p>${functions.link_i_fy(this.footnoteMap[f])}</p>`
							)
							.join("");

			if (unreliableNotes) {
				if (unreliableNotes.includes("(**)")) {
					reliabilityFootnotesSymbol = "**";
				}
				if (unreliableNotes.includes("(***)")) {
					reliabilityFootnotesSymbol = "***";
				}
				if (unreliableNotes.includes("(****)")) {
					reliabilityFootnotesSymbol = "****";
				}
				if (unreliableNotes.includes("(^)")) {
					reliabilityFootnotesSymbol = "^";
				}
			}
			footerNotes = unreliableNotes + footerNotes;
			$("#pageFooterTable").show(); // this is the Footnotes line section with the (+) toggle on right
		} else {
			$("#pageFooterTable").hide();
		}

		$("#pageFooter").html(footerNotes);

		const footnoteClasses = [
			"DataSourceFootnote",
			"FootnotesFootnote",
			"MethodologyFootnote",
			"unreliableFootnote",
		];

		let found = false;
		footnoteClasses.forEach((f) => {
			found = false;
			$(`.${f}`).each((i, el) => {
				if (found) $(el).remove();
				found = true;
			});
		});

		return reliabilityFootnotesSymbol;
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

	updateTopic = (dataTopic, topicChange = true) => {
		$(".genLoader").addClass("active");

		// reset to full range of time periods on topic change event but not from page load, which may have a hash url stating 'single-time-period' (bar chart)
		if (topicChange) {
			$("#show-one-period-checkbox").prop("checked", false);
			$("#startYearContainer").removeClass("offset-3");
			$("#startYearContainer-label").html("From");
			$("#endYearContainer").show();
			this.showBarChart = false;
			this.currentTimePeriodIndex = 0;
			$("#showAllSubgroupsSlider").prop("checked", false);
			// check if confidence interval is hidden and show on topic change
			// if (!$("ciTableSlider").is(":visible")) {
			// 	$("#ciTableSlider").show();
			// }
			$("#confidenceIntervalSlider").prop("checked", false);
		}

		this.dataTopic = dataTopic; // string
		this.config = config.topicLookup[dataTopic];

		// fix to prevent invalid hash
		if (!this.config) {
			console.warn("couldn't find topic in topic lookup", dataTopic);
			const firstValue = $("#topicDropdown-select .genDropdownOption:first").attr("data-val");
			// grab the first one in the dropdown
			console.log("reverting to", firstValue);
			return this.topicDropdown.value(firstValue, true);
		}

		if (this.selections) this.config.classificationId = parseInt(this.selections.classification, 10);
		const hasMap = !!this.config.hasMap; // undefined does not work with the .toggle() on the next line. Set to true or false;
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
		$("#chart-title").html(`${this.config.chartTitle}`);

		if (this.config.isNhisData) {
			this.getSelectedSocrataData(config.topicLookup[this.config.topicLookupId]).then((data) => {
				this.nhisData = data;
				this.getData(topicChange);
			});
		} else {
			this.getData(topicChange);
		}

		return null;
	};

	getData = (topicChange) => {
		Promise.all([
			this.getSelectedSocrataData(this.config),
			this.getSelectedSocrataData(config.topicLookup.footnotes),
			this.getSelectedSocrataData(config.topicLookup.NHISFootnotes),
			this.getSelectedSocrataData(config.topicLookup.cshsFootnotes),
			this.getSelectedSocrataData(config.topicLookup.NHAMCSFootnotes),
			this.getSelectedSocrataData(config.topicLookup.NHANESFootnotes),
			this.getUSMapData(),
		])
			.then((data) => {
				let [socrataData, footNotes, NHISFootnotes, cshsFootnotes, NHAMCSFootnotes, NHANESFootnotes, mapData] =
					data;

				if (mapData) this.topoJson = JSON.parse(mapData);

				let allFootNotes = DataCache.Footnotes;
				if (!allFootNotes) {
					allFootNotes = [
						...footNotes,
						...NHISFootnotes,
						...cshsFootnotes,
						...NHAMCSFootnotes,
						...NHANESFootnotes,
					];
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
						if (!$("ciTableSlider").is(":visible")) {
							$("#ciTableSlider").show();
						}
						// enable the CI checkbox
						$("#confidenceIntervalSlider").prop("disabled", false);
						$("#chart-table-selectors-tooltip").hide();
					} else {
						// hide confidence interval slider
						$("#ciTableSlider").hide();
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
		let filters = [];
		if (this.selections) {
			if (typeof this.selections === "string" && this.selections.includes("filters")) {
				filters = this.selections.split("=")[1].split("&");
				filters.forEach((filter) => {
					$(`#filter${filter}`).prop("checked", true);
				});
			} else {
				this.dataTopic = this.selections.topic;
			}
		}

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
			selectedValue: this.dataTopic,
		});
		this.topicDropdown.render();

		// add advanced filters to data-filter attribute
		$("#topicDropdown-select .genDropdownOption").each((i, el) => {
			const value = $(el).data("val");
			$(el).data({ filter: config.topicLookup[value].filters, dataSystem: config.topicLookup[value].dataSystem });
		});

		return filters.length > 0;
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
			ariaLabel: "select a classification",
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
			NHISTopics.map((t) => t.id)
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
			ariaLabel: "select a group",
			options,
			selectedValue: this.selections?.group,
		});
		this.groupDropdown.render();
		this.groupId = this.groupDropdown.value();
		const groupText = this.groupDropdown.text();
		if (groupText.toLowerCase().includes("total")) {
			$("#subGroupsSelectorsSection").hide();
		} else {
			// check if on table tab AND sub group toggle is visible
			if (this.activeTabNumber === 2 && !$("#subGroupsSelectorsSection").is(":visible")) {
				$("#subGroupsSelectorsSection").show();
			}
			$("#showAllSubgroupsSlider").prop("disabled", false);
		}
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
			this.updateGroup(1);
			return;
		}

		this.renderDataVisualizations();
	}

	updateGroup(groupId) {
		this.events.stopAnimation();

		this.groupId = groupId;
		this.setVerticalUnitAxisSelect();

		// some topics have different number of years for different groups. If all years changes then reset the time periods
		const allYears = [...new Set(this.getFilteredYearData().map((d) => d.year))]
			.sort((a, b) => a.localeCompare(b))
			.toString();
		const storedAllYears = [...this.allYearsOptions.map((d) => d.value)].toString();

		if (allYears !== storedAllYears) this.resetTimePeriods();
		const groupText = this.groupDropdown.text();
		if (groupText.toLowerCase().includes("total")) {
			// $("#showAllSubgroupsSlider").prop("disabled", true);
			$("#subGroupsSelectorsSection").hide();
		} else {
			if (this.activeTabNumber === 2 && !$("#subGroupsSelectorsSection").is(":visible")) {
				$("#subGroupsSelectorsSection").show();
			}
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
		const onlyOneTimePeriod = this.allYearsOptions.length === 1;
		const startPeriodOptions =
			this.selections?.viewSinglePeriod || onlyOneTimePeriod
				? this.allYearsOptions
				: this.allYearsOptions.slice(0, -1);
		this.initStartPeriodDropdown(startPeriodOptions);
		this.initEndPeriodDropdown(onlyOneTimePeriod ? this.allYearsOptions : this.allYearsOptions.slice(1));
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
		this.endYear = functions.getYear(end);
		this.endPeriod = end;
		this.renderDataVisualizations();
	}

	updateYAxisUnitId(yAxisUnitId) {
		this.config.yAxisUnitId = parseInt(yAxisUnitId, 10);

		// DUE TO MIXED UCI DATA: One unit_num has NO UCI data, and the other one DOES (TT)
		// IF UNIT NUM CHANGES, CHECK TO SEE IF ENABLE CI CHECKBOX SHOULD BE DISABLED
		if (this.flattenedFilteredData[0]?.hasOwnProperty("estimate_uci")) {
			if (!$("ciTableSlider").is(":visible")) {
				$("#ciTableSlider").show();
			}
			$("#confidenceIntervalSlider").prop("disabled", false);
			$("#chart-table-selectors-tooltip").hide();
		} else {
			// hide confidence interval slider
			$("#ciTableSlider").hide();
		}

		this.renderDataVisualizations();
	}

	updateShowBarChart(value) {
		this.showBarChart = value;
		if (value === 0) {
			this.resetTimePeriods();
			$("#startYearContainer-label").html("From");
		} else {
			this.initStartPeriodDropdown(this.allYearsOptions);
			$("#startYearContainer-label").html("");
		}
		this.renderDataVisualizations();
		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId, this.activeTabNumber);
	}

	updateEnableCI(value) {
		this.config.enableCI = value;
		const sliderState = $("#confidenceIntervalSlider").prop("checked");
		if (value === 0 && sliderState) {
			$("#confidenceIntervalSlider").prop("checked", false);
		}
		this.renderDataVisualizations();
	}

	updateBinningMethod(toggle) {
		this.staticBinning = toggle;
		this.legend = null;
		this.renderDataVisualizations();
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
		$("#startYearContainer-label").html("From");
		$("#endYearContainer").show();
		this.showBarChart = false;

		// reset and show time period start/end dropdowns
		this.resetTimePeriods();
		$(".timePeriodContainer").css("display", "flex");

		this.setVerticalUnitAxisSelect();
		this.updateEnableCI(0);
		this.staticBinning = true;
		$("#mapBinningSlider").prop("checked", true);
		$("#showAllSubgroupsSlider").prop("checked", false);

		// default back to "Chart" tab
		if (this.activeTabNumber === 0) $("a[href='#chart-tab']").trigger("click");
		else this.renderDataVisualizations();

		// select first item in dropdown
		const firstValue = $("#topicDropdown-select .genDropdownOption:first").attr("data-val");
		this.topicDropdown.value(firstValue, true);

		hashTab.writeHashToUrl(this.dataTopic, this.config.classificationId, this.groupId, this.activeTabNumber);
	}

	renderDataTable(data) {
		if (!$("#tableSelectors #chart-table-selectors").length) {
			$("#chart-table-selectors").detach().prependTo("#tableSelectors");
			$("#mapBinningTypeSelector").hide();
			const groupText = this.groupDropdown.text();
			if (!groupText.toLowerCase().includes("total")) {
				$("#subGroupsSelectorsSection").show();
			}
		}

		let tableData = [...data];
		let cols = ["Classification", "Group", "Subgroup", "Year", "Flag", "Estimate"];
		let keys = ["panel", "stub_name", "stub_label", "year", "flag", "estimate"];

		if (this.config.enableCI) {
			cols.push("Lower Confidence Interval", "Upper Confidence Interval");
			keys.push("estimate_lci", "estimate_uci");
		}

		if (!$("#showAllSubgroupsSlider").is(":checked")) {
			const checkedSubgroups = [...$("#genMsdSelections input:checked").map((i, el) => $(el).data("val"))];
			tableData = tableData.filter((d) => checkedSubgroups.includes(d.stub_label));
		}

		const reliabilityNotesSymbol = this.updateFootnotes(tableData);
		console.log(`renderTable --- reliabilityNotesSymbol ${reliabilityNotesSymbol}`);

		const topicTitle = this.topicDropdown.text();
		const group = this.groupDropdown.text();
		if (this.showBarChart) {
			this.config.chartTitle = `${topicTitle} by ${group} in ${this.startPeriod}`;
		} else {
			this.config.chartTitle = `${topicTitle} by ${group} from ${this.startPeriod} to ${this.endPeriod}`;
		}

		this.csv = {
			data: tableData,
			dataKeys: keys,
			title: this.config.chartTitle,
			headers: cols,
		};

		$("#chart-title").html(`${this.config.chartTitle}`);
		$("#chart-subtitle").html(`Classification: ${this.classificationDropdown.text()}`);

		const showCI = document.getElementById("confidenceIntervalSlider").checked && this.config.hasCI;
		const groupText = this.groupDropdown.text().toLowerCase();
		const topic = this.topicDropdown.text().toLowerCase();
		const groupNotAge = !groupText.includes("age") && !groupText.includes("years") && !topic.includes("age");

		if (tableData.some((d) => d.flag)) {
			$(".unreliableNote").show();
			$(".unreliableFootnote").show();
		}

		tableData = tableData.map((d) => {
			let { flag, estimate, estimate_lci, estimate_uci } = d;

			if (!estimate && estimate !== 0) {
				flag = reliabilityNotesSymbol || "**";
				estimate = "";
			} else {
				estimate = functions.formatTableValues(Number(estimate), this.sigFigs);
			}

			if (showCI && estimate) {
				estimate_lci = functions.formatTableValues(Number(estimate_lci), this.sigFigs);
				estimate_uci = functions.formatTableValues(Number(estimate_uci), this.sigFigs);
			}

			return {
				year: d.year,
				column: `${d.stub_label}${
					d.age && groupNotAge && d.age !== "N/A" && d.age !== d.stub_label ? ": " + d.age : ""
				}`,
				estimate,
				ci: showCI && estimate ? ` (${estimate_lci}, ${estimate_uci})` : "",
				flag: flag === "---" ? flag : flag ? ` ${flag}` : "",
			};
		});

		if (tableData.every((d) => !d.estimate || d.estimate === "NaN")) {
			$("#tableResultsCount").hide();
			$(".expanded-data-table")
				.empty()
				.html(
					`<div style="text-align: center; margin: 30px; font-size: 1rem;">There are no data for your selections. Please change your options. Select at least one Subgroup.</div>`
				);
			return;
		}

		const columns = [...new Set(tableData.map((d) => d.column))];
		const years = [...new Set(tableData.map((d) => d.year))];
		let tableId = "nchs-table";

		$("#tableEstimateHeader").html(`Estimate${showCI ? " (Confidence Interval)" : ""}`);

		$(".expanded-data-table").empty().html(`
			<table id="nchs-table">
				<thead>					
					<tr>
						<th>&nbsp;</th>
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
					const row = tableData.find((f) => f.column === c && f.year === d);
					const value = row?.estimate ?? "";
					const flag = row?.flag ?? "";
					const ci = row?.ci ?? "";
					return `<td tabindex="0">${value + ci + flag}</td>`;
				})}</tr>`;
			$(body).append(row);
		});

		functions.adjustTableDimensions();
	}

	exportCSV() {
		downloadCSV(this.csv);
	}
}
