import _ from "lodash";
import { DataCache } from "../../utils/datacache";
import * as d3 from "../../lib/d3.min";
import { config, colorMap, SVI, summaryTable, getAllChartProps, getChartBaseProps, renderSlider } from "./config";
import { GenChart } from "../general/genChart";
import { stateAbbrToFull } from "../../utils/helpers";
import { UrbanRuralDataTable } from "./dataTableUR";
import * as util from "../communityProfile/util";
import { getCurrentSettingSliderDomain } from "./dataTable";
import { Utils } from "../../utils/utils";

//export var chartConfig = null;
export class VaccinationsMap {
	constructor(props) {
		this.data = props.data.vaccination_county_condensed_data || {};
		this.width = props.width || "";
		this.height = props.height || "";
		this.offset = props.offset || "";
		this.svg = props.svg || "";
		this.tooltip = props.tooltip || "";
		this.classified = props.classified || "Doses_Administered";
		this.ustopo = DataCache.USTopo;
		this.colorMap = colorMap;
		this.svi = SVI;
		this.topoState = "";
		this.topoCounty = "";
		this.colorNeeded = "Series_Complete_Pop_Pct_SVI";
		this.selectedRects = [];
		this.lastItemTooltip = ["Percent of population receiving at least one dose:", "Administered_Dose1_Pop_Pct"];
		this.tableSvg = "";
		this.summaryTable = summaryTable;
		this.dataForTable = props.dataForTable.vaccination_equity_summary_data || {};
		this.dataForSecondChart = props.dataForTable.Booster_eligibility || {};
		this.viewSelected = "SVI";
		this.currentCategories = [7, 8];
		// this.urbanRuralData = props.urbanRuralData.equity_trends || {};
		this.locationUpdate = true;
		this.currentLocation = "US";
		//this.chartConfig = null;
		this.currentSliderDomain = null;
		this.getEquityTrendsInitialData = props.getEquityTrendsInitialData.equity_trends || [];
		this.selectUsOrStateData = props.selectUsOrStateData.equity_trends_init_data || [];
	}

	render() {
		$(`#${config.mapId}`).empty();
		this.initMap();
	}

	calcSVGheight = (devicetype) => {
		if (devicetype === "desktop") {
			return 180;
		}
		if (devicetype === "tablet") {
			return 200;
		}
		return 180;
	};

	svgheightAdjusment = (devicetype) => {
		if (devicetype === "desktop") {
			return 160;
		}
		if (devicetype === "tablet") {
			return 160;
		}
		return 130;
	};

	initMap() {
		let mapWidth = $(`#${config.mapId}`).width();
		this.width = mapWidth;
		let mapRatio = 0.618;
		if (appState.currentDeviceType === "mobile") mapRatio = 0.6;
		let mapHeightAdjustment = this.calcSVGheight(appState.currentDeviceType); // add to height for territories & legend
		this.height = mapWidth * mapRatio + mapHeightAdjustment;
		this.offset = [this.width * 0.97, this.height * 0.8];

		this.svg = d3
			.select(`#${config.mapId}`)
			.append("svg")
			.style("background-color", "#ffffff")
			.attr("id", `${config.mapId}Internal`);
		if (appState.currentDeviceType === "desktop") {
			this.svg
				.attr(
					"viewBox",
					`0 0 ${this.width + 200} ${this.height - this.svgheightAdjusment(appState.currentDeviceType) + 182}`
				)
				.attr("preserveAspectRatio", "xMinYMin meet");
		} else if (appState.currentDeviceType === "tablet") {
			this.svg
				.attr(
					"viewBox",
					`0 0 ${this.width - 134} ${this.height - this.svgheightAdjusment(appState.currentDeviceType) + 535}`
				)
				.attr("preserveAspectRatio", "xMinYMin meet");
		} else {
			this.svg
				.attr(
					"viewBox",
					`0 0 ${this.width} ${this.height - this.svgheightAdjusment(appState.currentDeviceType) + 535}`
				)
				.attr("preserveAspectRatio", "xMinYMin meet");
		}

		// We add a <div> container for the tooltip, which is hidden by default.
		this.tooltip = d3.select("body").append("div").attr("class", "tooltip");

		this.svg
			.append("defs")
			.append("pattern")
			.attr("id", "diagonalHatch")
			.attr("patternUnits", "userSpaceOnUse")
			.attr("width", 4)
			.attr("height", 4)
			.append("path")
			.attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
			.attr("stroke", "#000000")
			.attr("stroke-width", 1);
		this.renderMap();
	}

	renderMap() {
		d3.json("content/CoronaViewJson_01/counties_states_majorCities_CDT.json").then((topoData) => {
			this.topoState = topojson.feature(topoData, topoData.objects.states_fixed);
			// let alaska = topojson.feature(topoData, topoData.objects.HIVTB_AK_Counties_FIPS);
			this.topoCounty = topojson.feature(topoData, topoData.objects.counties_fixed_CDT);
			// Array.prototype.push.apply(this.topoCounty.features, alaska.features);
			this.buildMap();
			this.eventHandlers();
			this.renderTable();
			this.urbanRuralSection();
			this.renderURDataTable();
			$("#urbanRuralChartEquity").css("display", "none");
		});
	}

	renderTable() {
		let _self = this;
		let tableData;
		let keys, cols;
		let order = [];
		let population = $("input[name='population-radio']:checked").val();
		let view = $("input[name='view-radio']:checked").val();
		let metric = $("input[name='vaccination-radio']:checked").val();
		switch (view) {
			case "SVI":
				switch (`${metric} ${population}`) {
					case "fullyVaccinated Total_Population":
						tableData = _self.dataForTable.All;
						cols = [
							"SVI Rank",
							"% of Total Population Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Series_Complete_Pop_Pct_SVI", "Series_Complete_Pop_Pct_SVI", "num_counties"];
						order = [
							"1",
							"2",
							"3",
							"4",
							"5",
							"6",
							"7",
							"8",
							"9",
							"10",
							"11",
							"12",
							"13",
							"14",
							"15",
							"16",
							0,
						];
						break;
					case "fullyVaccinated Population_5":
						tableData = _self.dataForTable["5Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 5 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Series_Complete_5PlusPop_Pct_SVI", "Series_Complete_5PlusPop_Pct_SVI", "num_counties"];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "fullyVaccinated Population_5_17":
						tableData = _self.dataForTable["5to17"];
						cols = [
							"SVI Rank",
							"% of Population 5 to 17 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Series_Complete_5to17Pop_Pct_SVI", "Series_Complete_5to17Pop_Pct_SVI", "num_counties"];
						order = [
							"1",
							"2",
							"3",
							"4",
							"5",
							"6",
							"7",
							"8",
							"9",
							"10",
							"11",
							"12",
							"13",
							"14",
							"15",
							"16",
							"",
						];
						break;
					case "fullyVaccinated Population_Over_12":
						tableData = _self.dataForTable["12Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 12 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Series_Complete_12PlusPop_Pct_SVI",
							"Series_Complete_12PlusPop_Pct_SVI",
							"num_counties",
						];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "fullyVaccinated Population_Over_18":
						tableData = _self.dataForTable["18plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 18 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Series_Complete_18PlusPop_Pct_SVI",
							"Series_Complete_18PlusPop_Pct_SVI",
							"num_counties",
						];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "fullyVaccinated Population_65_plus":
						tableData = _self.dataForTable["65Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 65 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Series_Complete_65PlusPop_Pct_SVI",
							"Series_Complete_65PlusPop_Pct_SVI",
							"num_counties",
						];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "boosterDose Total_Population":
						tableData = _self.dataForTable.Booster_All;
						cols = [
							"SVI Rank",
							"% of Total Population Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Booster_Doses_Vax_Pct_SVI", "Booster_Doses_Vax_Pct_SVI", "num_counties"];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "boosterDose Population_Over_12":
						tableData = _self.dataForTable["Booster_12Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 12 Years of Age Fully Vaccinated with a First First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Booster_Doses_12PlusVax_Pct_SVI", "Booster_Doses_12PlusVax_Pct_SVI", "num_counties"];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "boosterDose Population_Over_18":
						tableData = _self.dataForTable["Booster_18Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 18 Years of Age Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Booster_Doses_18PlusVax_Pct_SVI", "Booster_Doses_18PlusVax_Pct_SVI", "num_counties"];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					case "boosterDose Population_65_plus":
						tableData = _self.dataForTable["Booster_65Plus"];
						cols = [
							"SVI Rank",
							"% of Population ≥ 65 Years of Age Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Booster_Doses_65PlusVax_Pct_SVI", "Booster_Doses_65PlusVax_Pct_SVI", "num_counties"];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
						break;
					default:
						break;
				}
				break;
			case "Metro":
				switch (`${metric} ${population}`) {
					case "fullyVaccinated Total_Population":
						tableData = _self.dataForTable.UR_All;
						cols = [
							"Metro Status",
							"% of Total Population Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"series_complete_pop_pct_UR_Equity",
							"series_complete_pop_pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "fullyVaccinated Population_5":
						tableData = _self.dataForTable.UR_5Plus;
						cols = [
							"Metro Status",
							"% of Population ≥ 5 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"series_complete_5PlusPop_pct_UR_Equity",
							"series_complete_5PlusPop_pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "fullyVaccinated Population_5_17":
						tableData = _self.dataForTable.UR_5to17;
						cols = [
							"Metro Status",
							"% of Population 5 to 17  Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Series_Complete_5to17Pop_Pct_UR_Equity",
							"Series_Complete_5to17Pop_Pct_UR_Equity",
							"num_counties",
						];
						order = ["1", "2", "3", "4", "5", "6", "7", "8", "0"];
						break;
					case "fullyVaccinated Population_Over_12":
						tableData = _self.dataForTable.UR_12Plus;
						cols = [
							" Metro Status",
							"% of Population ≥ 12 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"series_complete_12PlusPop_pct_UR_Equity",
							"series_complete_12PlusPop_pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "fullyVaccinated Population_Over_18":
						tableData = _self.dataForTable.UR_18Plus;
						cols = [
							"Metro Status",
							"% of Population ≥ 18 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"series_complete_18PlusPop_pct_UR_Equity",
							"series_complete_18PlusPop_pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "fullyVaccinated Population_65_plus":
						tableData = _self.dataForTable.UR_65Plus;
						cols = [
							" Metro Status",
							"% of Population ≥ 65 Years of Age Fully Vaccinated",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"series_complete_65PlusPop_pct_UR_Equity",
							"series_complete_65PlusPop_pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "boosterDose Total_Population":
						tableData = _self.dataForTable.UR_Booster_Doses_All;
						cols = [
							"Metro Status",
							"% of Total Population Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = ["Booster_Doses_Vax_Pct_UR_Equity", "Booster_Doses_Vax_Pct_UR_Equity", "num_counties"];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "boosterDose Population_Over_12":
						tableData = _self.dataForTable.UR_Booster_Doses_12Plus;
						cols = [
							" Metro Status",
							"% of Population ≥ 12 Years of Age Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Booster_Doses_12PlusVax_Pct_UR_Equity",
							"Booster_Doses_12PlusVax_Pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "boosterDose Population_Over_18":
						tableData = _self.dataForTable.UR_Booster_Doses_18Plus;
						cols = [
							"Metro Status",
							"% of Population ≥ 18 Years of Age Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Booster_Doses_18PlusVax_Pct_UR_Equity",
							"Booster_Doses_18PlusVax_Pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					case "boosterDose Population_65_plus":
						tableData = _self.dataForTable.UR_Booster_Doses_65Plus;
						cols = [
							" Metro Status",
							"% of Population ≥ 65 Years of Age Fully Vaccinated with a First Booster Dose",
							"Number of U.S. Counties at this Level",
						];
						keys = [
							"Booster_Doses_65PlusVax_Pct_UR_Equity",
							"Booster_Doses_65PlusVax_Pct_UR_Equity",
							"num_counties",
						];
						order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
						break;
					default:
						break;
				}
				break;

			default:
				break;
		}
		let output = [];
		// output = _.sortBy(tableData, o => parseInt(o[`${_self.colorNeeded}`]))
		let copiedTableData = JSON.parse(JSON.stringify(tableData));
		output = copiedTableData.sort(
			(a, b) => parseInt(a[`${_self.colorNeeded}`]) - parseInt(b[`${_self.colorNeeded}`])
		);
		output.push(output.shift());
		//KEEPING THIS FOR A FEW RELEASES JUST IN CASE
		// output = _.sortBy(tableData, function (item) {
		// 	let matchIndex;
		// 	matchIndex = _.indexOf(order, item[`${_self.colorNeeded}`]);
		// 	return matchIndex === -1 ? tableData.length : matchIndex;
		// });
		// // HOTFIX SOLUTION, NEED TO INVESTIGATE WHY IS NOT TAKING THE ORDER INTO CONSIDERATION
		// if ((population === "Population_5" || population === "Population_5_17") && view === "Metro") {
		// 	output.push(output.shift());
		// }
		// if ( view==="Metro" && metric === "boosterDose" ) {

		// }

		//Null kept showing up between 13 and 14 on SVI/fullyVaccinated/65+
		//this ensures the null is always at the end of the list need to figure out why is not taking the order in consideration
		// if ( view==="SVI" && metric === "fullyVaccinated" && population === "Population_65_plus" ||
		//      view==="SVI" && metric === "boosterDose" && population === "Population_65_plus" ){
		// output.forEach(function(v, i) {
		//   if (v[`${_self.colorNeeded}`] == null) {
		//     output.push(output[i]);
		//     output.splice(i, 1);
		//   }
		// });
		// }
		this.tableSvg = d3.select(`#${config.mapId}`);

		this.tableSvg.select("thead").remove();
		this.tableSvg.select("tbody").remove();
		let table = this.tableSvg
			.append("table")
			.attr("class", "table")
			.attr("id", "SummaryTable")
			.style("border-width", "1px");
		let thead = table.append("thead");
		thead
			.append("tr")
			.selectAll("th")
			.data(cols)
			.enter()
			.append("th")
			.attr("scope", "col")
			.attr("data-class", "Table")
			.attr("tabindex", "0")
			.text(function (column) {
				return column;
			});

		let tbody = table.append("tbody").attr("data-class", "Table");
		let row = tbody.selectAll("tr").data(output);

		// append cell data
		row.enter()
			.append("tr")
			.selectAll("td")
			.data(function (row) {
				return keys.map(function (column) {
					return {
						column,
						value: row[column],
					};
				});
			})
			.enter()
			.append("td")
			.attr("tabindex", "0")
			.style("border-width", "1px")
			.text(function (d, i) {
				if (d.value == null) {
					return "N/A";
				}
				if (i === 0) {
					if (d.value === 0) {
						return _self.summaryTable.get(view).get(`${metric} ${population}`).get("")[0];
					}
					return _self.summaryTable.get(view).get(`${metric} ${population}`).get(d.value.toString())[0];
				}
				if (i === 1) {
					if (d.value === 0) {
						return _self.summaryTable.get(view).get(`${metric} ${population}`).get("")[0];
					}
					return _self.summaryTable.get(view).get(`${metric} ${population}`).get(d.value.toString())[1];
				}
				return d.column.includes("Percent")
					? d.value.toLocaleString(undefined, {
							maximumFractionDigits: 1,
					  }) + "%"
					: d.value.toLocaleString(undefined, {
							maximumFractionDigits: 1,
					  });
			})
			.each(function (column, index, i) {
				let columnIndex = index;
				let columnHeader = cols[columnIndex];
				let firstColumnVal = i[0].innerText;
				if (columnIndex === 0) {
					this.setAttribute("aria-label", columnHeader + " " + column.value);
				} else if (column.value === null) {
					this.setAttribute("aria-label", firstColumnVal + " " + columnHeader + " " + "Not Available");
				} else {
					this.setAttribute("aria-label", firstColumnVal + " " + columnHeader + " " + column.value);
				}
				this.setAttribute("tabindex", "0");
			});

		if ($(".ui.attached.basic.button.buttonDataViewTogg.btn-cyan.active")[0].id === "map-toggle-btn") {
			$('[data-class="Table"]').css("display", "none");
		}

		util.loader("hide");
	}

	buildMap() {
		let _self = this;
		// INITIAL CALLOUT BOX AND MAP TITLE
		$("#metric_callout_box").text(
			"This shows the percentage of residents in the county who are fully vaccinated and county-level SVI."
		);
		$("#vaccinations-map-title").text("Percentage of People Fully Vaccinated by SVI");

		let mousemove = (d, i, nodes) => {
			let xOffset = (window.innerWidth - document.body.clientWidth) / 2; // Added by STT on 10052016 to solve the fixed page mouse over issue
			if (xOffset < 0) {
				// Added by STT on 10052016 to solve the fixed page mouse over issue
				xOffset = 0;
			}

			let lt = parseInt(d3.event.pageX, 10) + 10 + "px"; // Added xOffset by STT on 10052016 to solve the fixed page mouse over issue
			let tp = parseInt(d3.event.pageY - 10, 10) + "px";
			let tpHtml = ``;

			let abbr = d.properties.FIPS;

			let pairingData = _self.data.filter(function (x) {
				return x.FIPS == abbr;
			});

			if (pairingData.length > 0) {
				let population = $("input[name='population-radio']:checked").val();
				let view = $("input[name='view-radio']:checked").val();
				let metric = $("input[name='vaccination-radio']:checked").val();
				switch (`${metric} ${population}`) {
					case "fullyVaccinated Total_Population":
						_self.lastItemTooltip = ["Percent of population fully vaccinated:", "Series_Complete_Pop_Pct"];
						break;
					case "fullyVaccinated Population_5":
						_self.lastItemTooltip = ["Percent of 5+ pop fully vaccinated:", "Series_Complete_5PlusPop_Pct"];
						break;
					case "fullyVaccinated Population_Over_12":
						_self.lastItemTooltip = [
							"Percent of 12+ pop fully vaccinated:",
							"Series_Complete_12PlusPop_Pct",
						];
						break;
					case "fullyVaccinated Population_Over_18":
						_self.lastItemTooltip = [
							"Percent of 18+ pop fully vaccinated:",
							"Series_Complete_18PlusPop_Pct",
						];
						break;
					case "fullyVaccinated Population_65_plus":
						_self.lastItemTooltip = [
							"Percent of 65+ pop fully vaccinated:",
							"Series_Complete_65PlusPop_Pct",
						];
						break;
					case "fullyVaccinated Population_5_17":
						_self.lastItemTooltip = [
							"Percent of 5-17 pop fully vaccinated:",
							"Series_Complete_5to17Pop_Pct",
						];
						break;
					//////////////////////
					case "boosterDose Total_Population":
						_self.lastItemTooltip = [
							"Percent of fully vaccinated pop with a First Booster Dose:",
							"Booster_Doses_Vax_Pct",
						];
						break;
					case "boosterDose Population_Over_12":
						_self.lastItemTooltip = [
							"Percent of fully vaccinated pop ages 12+ with a 1st booster dose:",
							"Booster_Doses_12Plus_Vax_Pct",
						];
						break;
					case "boosterDose Population_Over_18":
						_self.lastItemTooltip = [
							"Percent of fully vaccinated pop ages 18+ with a 1st booster dose:",
							"Booster_Doses_18Plus_Vax_Pct",
						];
						break;
					case "boosterDose Population_65_plus":
						_self.lastItemTooltip = [
							"Percent of fully vaccinated pop ages 65+ with a 1st booster dose:",
							"Booster_Doses_65Plus_Vax_Pct",
						];
						break;
					default:
						break;
				}

				if (view === "SVI") {
					tpHtml = `
          <ul style="list-style-type:none;" class="p-0 m-0">
            <li><strong>State:</strong> ${pairingData[0].StateName}</li>
            <li><strong>County:</strong> ${pairingData[0].County}</li>
            <li><strong>SVI:</strong> ${SVI.get(pairingData[0].SVI_CTGY)}</li>
            <li><strong>County reporting completeness*:</strong> ${
				pairingData[0].Completeness_pct !== null ? pairingData[0].Completeness_pct + "%" : "N/A"
			}</li>
            <li><strong>${this.lastItemTooltip[0]}</strong> ${
						pairingData[0][this.lastItemTooltip[1]] !== null
							? pairingData[0][this.lastItemTooltip[1]] + "%"
							: "N/A"
					}</li>
          </ul>`;
				} else {
					tpHtml = `
          <ul style="list-style-type:none;" class="p-0 m-0">
            <li><strong>State:</strong> ${pairingData[0].StateName}</li>
            <li><strong>County:</strong> ${pairingData[0].County}</li>
            <li><strong>Metro status:</strong> ${pairingData[0].metro_status}</li>
            <li><strong>County reporting completeness*:</strong> ${
				pairingData[0].Completeness_pct !== null ? pairingData[0].Completeness_pct + "%" : "N/A"
			}</li>
            <li><strong>${this.lastItemTooltip[0]}</strong> ${
						pairingData[0][this.lastItemTooltip[1]] !== null
							? pairingData[0][this.lastItemTooltip[1]] + "%"
							: "N/A"
					}</li>
          </ul>`;
				}
			}

			this.tooltip
				.html(tpHtml)
				.style("left", () => {
					if (d3.event.pageX > 1000) {
						return `${parseInt(d3.event.pageX) - 150}px`;
					}
					return lt;
				})
				.style("top", () => {
					if (d3.event.pageX > 1000) {
						return `${parseInt(d3.event.pageY) - 150}px`;
					}
					return tp;
				})
				.style("visibility", "visible")
				.style("pointer-events", "none");
			d3.select(nodes[i]).on("mousemove", null);
		};
		let mouseLeave = (d, i, nodes) => {
			this.tooltip.style("opacity", 0).style("visibility", "hidden");

			d3.select(d3.event.target).transition().style("stroke", "#000").style("stroke-width", "0.3px");
			d3.select(nodes[i]).on("mousemove", mousemove);
		};

		let mouseover = (d, i, node) => {
			this.tooltip.style("opacity", 0.85);

			d3.select(d3.event.target)
				.raise()
				.transition()
				.duration(200)
				.style("stroke", "yellow")
				.style("stroke-width", "2px");
		};

		let states = this.topoState;

		let projection = d3.geoAlbers().fitSize(this.offset, states);

		let path = d3.geoPath().projection(projection);

		let stPath = this.svg.append("g").attr("class", "state");

		stPath
			.append("g")
			.attr("id", "counties")
			.attr("class", "counties")
			.selectAll("path")
			.data(this.topoCounty.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke-width", config.countyStroke)
			.attr("stroke", "black")
			.attr("class", "county-boundary")
			.attr("pointer-events", "all")
			.style("width", "80%")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseLeave)
			.attr("data-fips", (d) => {
				return d.properties.FIPS;
			})
			.attr("data-county", (d) => {
				return d.properties.NAME.substring(0, d.properties.NAME.indexOf(","));
			})
			.attr("data-state-name", (d) => {
				if (d.properties.NAME.split(",")[1]) {
					return d.properties.NAME.split(",")[1].trim().replace(/ /g, "-");
				}
				return d.properties.NAME.trim().replace(/ /g, "-");
			});

		// state polygons
		stPath
			.append("g")
			.attr("id", "states")
			.selectAll("path")
			.data(states.features)
			.enter()
			.append("path")
			.attr("data-abbr", (d) => d.properties.STATE_ABBR)
			.attr("data-state", (d) => d.properties.NAME)
			.attr("d", path)
			.attr("class", "stpath")
			.style("stroke-width", 1.3)
			.attr("stroke", "#000")
			.attr("fill", "transparent")
			.attr("pointer-events", "stroke")
			.attr("geoid", (d) => d.properties.STATE_FIPS);

		let hiddenStates = [
			"Guam",
			"N.-Mariana-Islands",
			"Northern Mariana Islands",
			"Northern-Mariana-Islands",
			"U.S.-Virgin-Islands",
			"U.S. Virgin Islands",
			"American Samoa",
			"American-Samoa",
		];

		hiddenStates.forEach((state) => {
			$(`[data-state="${state}"]`).remove();
			$(`[data-state-name="${state}"]`).remove();
		});

		this.createLegend();
		this.setMapColor();
		$("#vaccinations-wrapper").css("visibility", "visible");
	}

	createLegend() {
		let _self = this;
		let rectClick = (d, i, node) => {
			if (_self.selectedRects.includes(d[5])) {
				_self.selectedRects = _self.selectedRects.filter(function (value) {
					return value !== d[5];
				});
			} else {
				_self.selectedRects.push(d[5]);
			}
			let selectedValues = [..._self.colorMap.get(_self.viewSelected).keys()];

			selectedValues.map((x) => {
				if (_self.selectedRects.includes(x.toString())) {
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", _self.colorMap.get(_self.viewSelected).get(x));
					$(`[data-squareID ="${x}"]`).css("stroke-width", "4");
					$(`[data-squareID ="${x}"]`).css("opacity", "1");
					if (_self.selectedRects.includes("p")) {
						$(`[data-completeness-pct="yes"]`).css("fill", "#4E4E4E");
						$("#percentRect").css("fill", "#4E4E4E");
					}
				} else if (_self.selectedRects.includes("p") && _self.selectedRects.length > 1) {
					$("#percentRect").css("fill", "#4E4E4E");
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", "#4E4E4E");
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "0.75");
				} else if (_self.selectedRects.includes("p")) {
					$(`[data-completeness-pct="yes"]`).css("fill", "#4E4E4E");
					$("#percentRect").css("fill", "#4E4E4E");
				} else {
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", "#4E4E4E");
					$("#percentRect").css("fill", "white");
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "0.75");
				}
			});
			if (_self.selectedRects.length == 0) {
				selectedValues.map((x) => {
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", _self.colorMap.get(_self.viewSelected).get(x));
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "1");
					$(`[data-class="clearSelections"]`).css("display", "none");
				});
			} else if (_self.selectedRects.length == 1 && _self.selectedRects.includes("p")) {
				selectedValues.map((x) => {
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", _self.colorMap.get(_self.viewSelected).get(x));
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "1");
					$(`[data-class="clearSelections"]`).css("display", "none");
					$(`[data-completeness-pct="yes"]`).css("fill", "#4E4E4E");
				});
			} else {
				$(`[data-class="clearSelections"]`).css("display", "");
			}
		};

		let clearSelections = () => {
			let selectedValues = [..._self.colorMap.get(_self.viewSelected).keys()];
			if (_self.selectedRects.includes("p")) {
				_self.selectedRects = ["p"];
				selectedValues.map((x) => {
					$(`[data-${_self.colorNeeded}="${x}"][data-completeness-pct="no"]`).css(
						"fill",
						_self.colorMap.get(_self.viewSelected).get(x)
					);
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "1");
					$(`[data-class="clearSelections"]`).css("display", "none");
				});
			} else {
				_self.selectedRects = [];
				selectedValues.map((x) => {
					$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", _self.colorMap.get(_self.viewSelected).get(x));
					$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
					$(`[data-squareID ="${x}"]`).css("opacity", "1");
					$(`[data-class="clearSelections"]`).css("display", "none");
				});
			}
		};
		// START OF HEAT MAP SVG

		// x and y axis scales
		let y = d3.scaleBand();

		let x = d3.scaleBand();

		// container to hold the grid
		let heatMap = this.svg.append("g").attr("id", "legendGroup");
		let numRows = 4;
		let numCols = _self.viewSelected == "SVI" ? 4 : 2;
		if (window.appState.currentDeviceType === "mobile") {
			if (_self.viewSelected === "SVI") {
				y.range([0, 254]).domain(d3.range(numRows));
				x.range([0, 254]).domain(d3.range(numCols));
			} else {
				y.range([0, 254]).domain(d3.range(numRows));
				x.range([0, 130]).domain(d3.range(numCols));
			}

			let heatMapRects = heatMap
				.selectAll("rect")
				.data(config.colorSchemeAndCategoryMap2.get(_self.viewSelected))
				.enter()
				.append("rect")
				.attr("id", function (d) {
					return "id" + d[0];
				})
				.attr("x", function (d, index) {
					return x(index % numCols);
				})
				.attr("y", function (d, index) {
					return y(Math.floor(index / numCols));
				})
				.attr("width", 65)
				.attr("height", 65)
				.attr("fill", function (d) {
					return d[1];
				})
				.style("stroke", "black");
		} else {
			if (_self.viewSelected === "SVI") {
				y.range([0, 304]).domain(d3.range(numRows));
				x.range([0, 304]).domain(d3.range(numCols));
			} else {
				y.range([0, 304]).domain(d3.range(numRows));
				x.range([0, 155]).domain(d3.range(numCols));
			}
			let heatMapRects = heatMap
				.selectAll("rect")
				.data(config.colorSchemeAndCategoryMap2.get(_self.viewSelected))
				.enter()
				.append("rect")
				.attr("data-squareID", function (d) {
					return d[5];
				})
				.attr("id", function (d) {
					return d[5].replace("/", "-");
				})
				.attr("x", function (d, index) {
					return x(index % numCols);
				})
				.attr("y", function (d, index) {
					return y(Math.floor(index / numCols));
				})
				.attr("width", 76)
				.attr("height", 75)
				.attr("fill", function (d) {
					return d[1];
				})
				.style("stroke", "black")
				.on("click", rectClick);
		}

		let textOffset,
			textSize,
			LeftLabelOffset,
			bottomLabelXOffset,
			bottomLabelYOffset,
			topMarginLabelFontSize,
			topMarginLabelXOffset,
			bottomPercentYOffset,
			BottomPercent1XOffset,
			BottomPercent2XOffset,
			BottomPercent3XOffset,
			BottomPercent4XOffset,
			leftPercent1YOffset,
			leftPercent2YOffset,
			leftPercent3YOffset,
			leftPercent4YOffset,
			excludeButton,
			excludeFirstLabelYOffset,
			excludeFirstLabelXOffset,
			excludeSecondLabelYOffset,
			excludeSecondLabelXOffset,
			disclaimerText1,
			disclaimerText2,
			disclaimerTextxOffset,
			disclaimerTextxOffset2,
			topLabelBreakYOffset1,
			topLabelBreakYOffset2,
			noDataSquareYOffset,
			noDataSquareTextYOffset;
		if (window.appState.currentDeviceType === "mobile") {
			textOffset = 32;
			textSize = "9px";
			LeftLabelOffset = 140;
			bottomLabelXOffset = 140;
			bottomLabelYOffset = 300;
			topMarginLabelFontSize = "9px";
			topMarginLabelXOffset = 130;
			bottomPercentYOffset = 270;
			BottomPercent1XOffset = 30;
			BottomPercent2XOffset = 95;
			BottomPercent3XOffset = 160;
			BottomPercent4XOffset = 220;
			leftPercent1YOffset = -220;
			leftPercent2YOffset = -160;
			leftPercent3YOffset = -95;
			leftPercent4YOffset = -30;
			disclaimerText1 = 360;
			disclaimerText2 = 375;
			disclaimerTextxOffset = 130;
			disclaimerTextxOffset2 = 135;
			topLabelBreakYOffset1 = -4;
			topLabelBreakYOffset2 = -13;
			noDataSquareYOffset = 314;
			noDataSquareTextYOffset = 333;
		} else {
			textOffset = 42;
			textSize = "12px";
			LeftLabelOffset = 160;
			bottomLabelXOffset = 155;
			bottomLabelYOffset = 352;
			topMarginLabelFontSize = "12px";
			topMarginLabelXOffset = 160;
			bottomPercentYOffset = 320;
			BottomPercent1XOffset = 40;
			BottomPercent2XOffset = 112;
			BottomPercent3XOffset = 190;
			BottomPercent4XOffset = 270;
			leftPercent1YOffset = -266;
			leftPercent2YOffset = -189;
			leftPercent3YOffset = -116;
			leftPercent4YOffset = -36;
			excludeButton = 435;
			excludeFirstLabelYOffset = 445;
			excludeFirstLabelXOffset = 158;
			excludeSecondLabelYOffset = 465;
			excludeSecondLabelXOffset = 85;
			disclaimerText1 = 520;
			disclaimerText2 = 535;
			disclaimerTextxOffset = 140;
			disclaimerTextxOffset2 = 140;
			topLabelBreakYOffset1 = -8;
			topLabelBreakYOffset2 = -26;
			noDataSquareYOffset = 390;
			noDataSquareTextYOffset = 410;
		}

		// LEFT MARGIN LABEL
		heatMap
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -35)
			.attr("x", -LeftLabelOffset)
			.attr("id", "legendLeftText")
			.style("text-anchor", "middle")
			.text("% of total population fully vaccinated");
		if (window.appState.currentDeviceType === "mobile") {
			heatMap.style("font-size", "12px");
		}
		// RIGHT BOTTOM MARGIN LABEL
		if (_self.viewSelected === "SVI") {
			heatMap
				.append("text")
				.attr("id", "SVILegendText")
				.attr("y", bottomLabelYOffset)
				.attr("x", bottomLabelXOffset)
				.style("text-anchor", "middle")
				.text("Social Vulnerability Index (SVI)");
		}
		// NO DATA SQUARE
		heatMap
			.append("rect")
			.attr("y", noDataSquareYOffset)
			.attr("x", -40)
			.attr("width", 25)
			.attr("height", 25)
			.attr("fill", "url(#diagonalHatch)")
			.style("stroke", "black");

		heatMap
			.append("text")
			.attr("y", noDataSquareTextYOffset)
			.attr("x", 0)
			.style("text-anchor", "left")
			.text("No Data");

		// This function is from https://stackoverflow.com/a/24785497
		function wrap(text, width) {
			text.each(function () {
				let text = d3.select(this),
					words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.1, // ems
					x = text.attr("x"),
					y = text.attr("y"),
					dy = 0, // parseFloat(text.attr("dy")),
					tspan = text
						.text(null)
						.append("tspan")
						.attr("x", 0)
						.attr("y", y)
						.attr("dy", dy + "em");
				while ((word = words.pop())) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text
							.append("tspan")
							.attr("x", 0)
							.attr("y", y)
							.attr("dy", ++lineNumber * lineHeight + dy + "em")
							.text(word);
					}
				}
			});
		}

		// COMPLETENESS PCT BUTTON
		if (window.appState.currentDeviceType !== "mobile") {
			// heatMap
			// 	.append("rect")
			// 	.attr("y", excludeButton)
			// 	.attr("x", -40)
			// 	.attr("id", "percentRect")
			// 	.attr("width", 25)
			// 	.attr("height", 25)
			// 	.attr("fill", "white")
			// 	.style("stroke", "black")
			// 	.style("cursor", "pointer")
			// 	.on("click", function () {
			// 		rectClick(["", "", "", "", "", "p"]);
			// 	});
			// heatMap
			// 	.append("text")
			// 	.attr("y", excludeFirstLabelYOffset)
			// 	.style("text-anchor", "left")
			// 	.style("cursor", "pointer")
			// 	.text("Exclude states with <75% vaccination county reporting completeness*")
			// 	.call(wrap, 304)
			// 	.on("click", function () {
			// 		rectClick("p");
			// 	});
		}
		// Clear Data Square
		heatMap
			.append("rect")
			.attr("y", 390)
			.attr("x", 150)
			.attr("width", 180)
			.attr("height", 28)
			.attr("fill", "lightgrey")
			.style("stroke", "black")
			.attr("data-class", "clearSelections")
			.style("cursor", "pointer")
			.attr("data-html2canvas-ignore", "")
			.style("display", "none")
			.on("click", clearSelections);

		heatMap
			.append("text")
			.attr("y", 410)
			.attr("x", 247)
			.style("text-anchor", "middle")
			.text("Clear Selections")
			.attr("data-class", "clearSelections")
			.attr("data-html2canvas-ignore", "")
			.style("cursor", "pointer")
			.style("display", "none")
			.on("click", clearSelections);

		// TOP MARGIN LABEL
		let view = $("input[name='view-radio']:checked").val();
		if (view === "SVI") {
			heatMap
				.append("text")
				.attr("y", -8)
				.attr("x", topMarginLabelXOffset)
				.style("text-anchor", "middle")
				.attr("font-size", topMarginLabelFontSize)
				.attr("font-weight", "bold")
				.attr("font-style", "italic")
				.text("Select boxes in legend to limit the counties shown.");
		} else {
			heatMap
				.append("text")
				.attr("y", topLabelBreakYOffset2) // 13
				.attr("x", topMarginLabelXOffset - 90)
				.style("text-anchor", "middle")
				.attr("font-size", topMarginLabelFontSize)
				.attr("font-weight", "bold")
				.attr("font-style", "italic")
				.text("Select boxes in legend");
			heatMap
				.append("text")
				.attr("y", topLabelBreakYOffset1)
				.attr("x", topMarginLabelXOffset - 90)
				.style("text-anchor", "middle")
				.attr("font-size", topMarginLabelFontSize)
				.attr("font-weight", "bold")
				.attr("font-style", "italic")
				.text("to limit the counties shown.");
		}

		// HEATMAP Rect PERCENTAGES LEFT
		heatMap
			.append("text")
			.attr("transform", "rotate(-90)")
			.text(config.percentagesHeatMap1218Total[0][0])
			.attr("x", leftPercent1YOffset)
			.attr("y", `${-5}`)
			.attr("id", "A1")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		heatMap
			.append("text")
			.attr("transform", "rotate(-90)")
			.text(config.percentagesHeatMap1218Total[1][0])
			.attr("x", leftPercent2YOffset)
			.attr("y", `${-5}`)
			.attr("id", "A2")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		heatMap
			.append("text")
			.attr("transform", "rotate(-90)")
			.text(config.percentagesHeatMap1218Total[2][0])
			.attr("x", leftPercent3YOffset)
			.attr("y", `${-5}`)
			.attr("id", "A3")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		heatMap
			.append("text")
			.attr("transform", "rotate(-90)")
			.text(config.percentagesHeatMap1218Total[3][0])
			.attr("x", leftPercent4YOffset)
			.attr("y", `${-5}`)
			.attr("id", "A4")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		// HEATMAP Rect PERCENTAGES BOTTOM
		const heatMapBottomTickLabels =
			_self.viewSelected === "SVI"
				? ["0-0.25", "0.2501-1-0.50", "0.5001-0.75", "0.7501-1.0"]
				: ["Metro", "Non-Metro"];
		heatMap
			.append("text")
			.text(heatMapBottomTickLabels[0])
			.attr("x", BottomPercent1XOffset)
			.attr("y", bottomPercentYOffset)
			.attr("id", "A1Bottom")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		heatMap
			.append("text")
			.text(heatMapBottomTickLabels[1])
			.attr("x", BottomPercent2XOffset)
			.attr("y", bottomPercentYOffset)
			.attr("id", "B1Bottom")
			.attr("font-size", textSize)
			.attr("font-weight", "bolder")
			.attr("fill", "black")
			.attr("text-anchor", "middle");

		if (_self.viewSelected === "SVI") {
			heatMap
				.append("text")
				.text(heatMapBottomTickLabels[2])
				.attr("x", BottomPercent3XOffset)
				.attr("y", bottomPercentYOffset)
				.attr("id", "C1Bottom")
				.attr("font-size", textSize)
				.attr("font-weight", "bolder")
				.attr("fill", "black")
				.attr("text-anchor", "middle");

			heatMap
				.append("text")
				.text(heatMapBottomTickLabels[3])
				.attr("x", BottomPercent4XOffset)
				.attr("y", bottomPercentYOffset)
				.attr("id", "D1Bottom")
				.attr("font-size", textSize)
				.attr("font-weight", "bolder")
				.attr("fill", "black")
				.attr("text-anchor", "middle");
		}

		if (window.appState.currentDeviceType === "mobile") {
			heatMap
				.attr("transform", `translate(${this.width / 2.5 - 70},${this.height - 120})`)
				.attr("viewBox", `0 0,5,5`)
				.attr("preserveAspectRatio", "xMinYMin meet");
		} else {
			const { height: svgHeight } = document
				.getElementById("vaccinations-map-wrapperInternal")
				.getBoundingClientRect();
			const { height: legendHeight } = document.getElementById("legendGroup").getBoundingClientRect();
			const translateY = (svgHeight - legendHeight) / 2 + 50;

			if (appState.currentDeviceType === "desktop") {
				heatMap.attr("transform", `translate(${this.width / 1.3 + 41},${translateY})`);
			} else if (appState.currentDeviceType === "tablet" && _self.viewSelected === "SVI") {
				heatMap.attr("transform", `translate(${this.width / 2.6 - 140},${this.height - 140})`);
			} else if (appState.currentDeviceType === "tablet") {
				heatMap.attr("transform", `translate(${this.width / 2.6 - 152},${this.height - 140})`);
			}
		}
	}

	setMapColor() {
		let _self = this;
		d3.select(".counties")
			.selectAll(".county-boundary")
			.each((d, i, nodes) => {
				let abbr = d.properties.FIPS;
				let pairingData = _self.data.filter((x) => x.FIPS == abbr);

				let d3elem = d3.select(nodes[i]);
				if (!pairingData[0] || !pairingData[0][`${_self.colorNeeded}`]) {
					d3elem.style("fill", "url(#diagonalHatch)");
				} else {
					d3elem.style(
						"fill",
						_self.colorMap.get(_self.viewSelected).get(parseInt(pairingData[0][`${_self.colorNeeded}`]))
					);
				}
				if (
					pairingData[0] !== undefined &&
					pairingData[0].Completeness_pct > 0 &&
					pairingData[0].Completeness_pct < 75
				) {
					d3elem.attr("data-completeness-pct", "yes");
				} else {
					d3elem.attr("data-completeness-pct", "no");
				}
				d3elem.attr(
					"data-Series_Complete_Pop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_Pop_Pct_SVI ?? "None "}`
				);
				d3elem.attr(
					"data-Series_Complete_5to17Pop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_5PlusPop_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_5PlusPop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_5PlusPop_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_12PlusPop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_12PlusPop_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_18PlusPop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_18PlusPop_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_65PlusPop_Pct_SVI",
					`${pairingData[0]?.Series_Complete_65PlusPop_Pct_SVI ?? "None"}`
				);

				d3elem.attr(
					"data-series_complete_pop_pct_UR_Equity",
					`${pairingData[0]?.series_complete_pop_pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_5to17Pop_Pct_UR_Equity",
					`${pairingData[0]?.Series_Complete_5to17Pop_Pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-Series_Complete_5PlusPop_Pct_UR_Equity",
					`${pairingData[0]?.Series_Complete_5PlusPop_Pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-series_complete_12PlusPop_pct_UR_Equity",
					`${pairingData[0]?.series_complete_12PlusPop_pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-series_complete_18PlusPop_pct_UR_Equity",
					`${pairingData[0]?.series_complete_18PlusPop_pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-series_complete_65PlusPop_pct_UR_Equity",
					`${pairingData[0]?.series_complete_65PlusPop_pct_UR_Equity ?? "None"}`
				);
				///////////
				d3elem.attr("data-Booster_Doses_Vax_Pct_SVI", `${pairingData[0]?.Booster_Doses_Vax_Pct_SVI ?? "None"}`);
				d3elem.attr(
					"data-Booster_Doses_12PlusVax_Pct_SVI",
					`${pairingData[0]?.Booster_Doses_12PlusVax_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_18PlusVax_Pct_SVI",
					`${pairingData[0]?.Booster_Doses_18PlusVax_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_65PlusVax_Pct_SVI",
					`${pairingData[0]?.Booster_Doses_65PlusVax_Pct_SVI ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_Vax_Pct_UR_Equity",
					`${pairingData[0]?.Booster_Doses_Vax_Pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_12PlusVax_Pct_UR_Equity",
					`${pairingData[0]?.Booster_Doses_12PlusVax_Pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_18PlusVax_Pct_UR_Equity",
					`${pairingData[0]?.Booster_Doses_18PlusVax_Pct_UR_Equity ?? "None"}`
				);
				d3elem.attr(
					"data-Booster_Doses_65PlusVax_Pct_UR_Equity",
					`${pairingData[0]?.Booster_Doses_65PlusVax_Pct_UR_Equity ?? "None"}`
				);
			});
	}

	eventHandlers() {
		const _self = this;
		let textBox = $("#metric_callout_box");
		let title = $("#vaccinations-map-title");
		$('[data-class="Table"]').css("display", "none");
		$("input[name='view-radio'], input[name='population-radio'], input[name='vaccination-radio']").click(() => {
			let population = $("input[name='population-radio']:checked").val();
			let view = $("input[name='view-radio']:checked").val();
			let metric = $("input[name='vaccination-radio']:checked").val();
			this.renderURDataTable();
			//hanlde the hiding of filters
			switch (metric) {
				case "fullyVaccinated":
					$("#div-radio-population-over-5, #div-radio-population-5-17").css("display", "");

					break;
				case "boosterDose":
					$("#div-radio-population-over-5, #div-radio-population-5-17").css("display", "none");
					if (population === "Population_5_17" || population === "Population_5") {
						$("#population-radio-population-over-12").prop("checked", true);
						population = "Population_Over_12";
					}
					break;
				default:
					break;
			}

			// Handle callout text
			switch (`${view} ${metric}`) {
				case "SVI fullyVaccinated":
					textBox.text(
						"This shows county-level social vulnerability and the percentage of residents who are fully vaccinated."
					);
					break;
				case "SVI boosterDose":
					textBox.text(
						"This shows county-level social vulnerability and the percentage of fully vaccinated residents with a first booster dose."
					);
					break;
				case "Metro fullyVaccinated":
					textBox.text(
						"This shows county metro/non-metro status and the percentage of residents who are fully vaccinated."
					);
					break;
				case "Metro boosterDose":
					textBox.text(
						"This shows county metro/non-metro status and the percentage of fully vaccinated residents with a first booster dose."
					);
					break;
				default:
					textBox.text(
						"This shows county-level social vulnerability and the percentage of residents who are fully vaccinated."
					);
					break;
			}

			_self.viewSelected = view;
			if (view !== "urbanRuralChart") {
				$("#legendGroup").remove();
				$("#vaccinations-map-wrapperInternal").css("display", "");
				$("#vaccination-selection").css("visibility", "");
				this.createLegend();
			} else {
				// 	$("#vaccination-selection").css("visibility", "hidden");
			}

			switch (`${view} ${metric}`) {
				case "SVI fullyVaccinated":
					$("#toggle-viz-type-container").css("display", "");
					_self.hideShowFunction(view);
					switch (population) {
						case "Total_Population":
							_self.colorNeeded = "Series_Complete_Pop_Pct_SVI";
							title.text("Percentage of People Fully Vaccinated by SVI");
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_5_17":
							_self.colorNeeded = "Series_Complete_5to17Pop_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 5-17 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap("5To17");
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_5":
							_self.colorNeeded = "Series_Complete_5PlusPop_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 5 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_Over_12":
							_self.colorNeeded = "Series_Complete_12PlusPop_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 12 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_Over_18":
							_self.colorNeeded = "Series_Complete_18PlusPop_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 18 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_65_plus":
							_self.colorNeeded = "Series_Complete_65PlusPop_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 65 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						default:
							break;
					}
					break;
				case "SVI boosterDose":
					$("#toggle-viz-type-container").css("display", "");
					_self.hideShowFunction(view);
					switch (population) {
						case "Total_Population":
							_self.colorNeeded = "Booster_Doses_Vax_Pct_SVI";
							title.text("Percentage of People Fully Vaccinated with a First Booster Dose by SVI");
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();

							break;
						case "Population_Over_12":
							_self.colorNeeded = "Booster_Doses_12PlusVax_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 12 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_Over_18":
							_self.colorNeeded = "Booster_Doses_18PlusVax_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 18 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_65_plus":
							_self.colorNeeded = "Booster_Doses_65PlusVax_Pct_SVI";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 65 Years of Age and Older by SVI"
							);
							_self.changePercentagesHeatMap("65YearsBooster");
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						default:
							break;
					}
					break;
				case "Metro fullyVaccinated":
					_self.hideShowFunction(view);
					switch (population) {
						case "Total_Population":
							_self.colorNeeded = "series_complete_pop_pct_UR_Equity";
							title.text("Percentage of People Fully Vaccinated by Metro/Non-Metro Status");
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_5_17":
							_self.colorNeeded = "Series_Complete_5PlusPop_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 5-17 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap("5To17");
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_5":
							_self.colorNeeded = "Series_Complete_5PlusPop_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 5 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_Over_12":
							_self.colorNeeded = "series_complete_12PlusPop_pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 12 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_Over_18":
							_self.colorNeeded = "series_complete_18PlusPop_pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 18 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_65_plus":
							_self.colorNeeded = "series_complete_65PlusPop_pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated for the Population 65 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap("65Years");
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						default:
							break;
					}
					break;
				case "Metro boosterDose":
					_self.hideShowFunction(view);
					switch (population) {
						case "Total_Population":
							_self.colorNeeded = "Booster_Doses_Vax_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_Over_12":
							_self.colorNeeded = "Booster_Doses_12PlusVax_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 12 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_Over_18":
							_self.colorNeeded = "Booster_Doses_18PlusVax_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 18 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap();
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						case "Population_65_plus":
							_self.colorNeeded = "Booster_Doses_65PlusVax_Pct_UR_Equity";
							title.text(
								"Percentage of People Fully Vaccinated with a First Booster Dose for the Population 65 Years of Age and Older by Metro/Non-Metro Status"
							);
							_self.changePercentagesHeatMap("65YearsBoosterMetro");
							_self.clearSelections();
							_self.selectedRects = [];
							$("#percentRect").css("fill", "white");
							$("#SummaryTable").remove();
							_self.renderTable();
							break;
						default:
							break;
					}
					break;
				case "urbanRuralChart fullyVaccinated":
					_self.hideShowFunction(view);
					break;
				case "urbanRuralChart boosterDose":
					_self.hideShowFunction(view);
					break;
				default:
					break;
			}

			if (view !== "urbanRuralChart") {
				_self.setMapColor();
			}
		});

		// Toggle for map or table
		$("#map-toggle-btn").on("click", (e) => {
			$('[data-class="Table"]').css("display", "none");
			$("#vaccinations-map-title").css("display", "");
			$("#vaccinations-map-wrapperInternal").css("display", "");
			$("#chart-toggle-btn").removeClass("active");
			$("#map-toggle-btn").addClass("active");
			$("#dwnload-img-vaccination-equity-maps").html(`Download Map<span class="fas" aria-hidden="true"></span>`);
		});

		$("#chart-toggle-btn").on("click", (e) => {
			$("#vaccinations-map-wrapperInternal").css("display", "none");
			$("#vaccinations-map-title").css("display", "none");
			$('[data-class="Table"]').css("display", "");
			$("#map-toggle-btn").removeClass("active");
			$("#chart-toggle-btn").addClass("active");
			$("#dwnload-img-vaccination-equity-maps").html(
				`Download Summary Table <span class="fas" aria-hidden="true"></span>`
			);
		});
		$(document)
			.off("click", ".delete.icon")
			.off("click", "#category-select-list > .item")
			// remove category lines
			.on("click", ".delete.icon", (e) => {
				// I believe Semantic has built in delete function on click
				//... then code below removes the line from the chart
				const element = e.target.closest("a").dataset.value;
				_self.removeCategory(element);
			})
			.on("keydown", ".delete.icon", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.target.parentElement.remove(); // dont need this on click for some reason
					// but need it for keydown to remove it from list
					//... then code below removes the line from the chart
					const element = e.target.closest("a").dataset.value;
					_self.removeCategory(element);
				}
			})
			// add category lines
			.on("click", "#category-select-list > .item", (e) => {
				const category = e.target.dataset.value;
				_self.addCategory(category);
			});
	}

	hideShowFunction(view) {
		if (view !== "urbanRuralChart") {
			if (this.currentLocation !== "US") {
				$(".dropdown").dropdown("set selected", "US");
			}
			if ($(".ui.attached.basic.button.buttonDataViewTogg.btn-cyan.active")[0].id === "map-toggle-btn") {
				$("#urbanRuralChartEquity").css("display", "none");
				$("#dwnload-img-RuralUrban-chart").css("display", "none");
				$("#view-selection-2").css("display", "none");
				$("#view-selection-3").css("display", "none");
				$('[data-class="Table"]').css("display", "none");
				$("#SummaryTable").css("display", "none");
				$("#category-select").css("display", "none");

				$("#dwnload-img-vaccination-equity-maps").css("display", "");
				$("#vaccinations-map-title").css("display", "");
				$("#vaccinations-map-wrapperInternal").css("display", "");
				$("#population-selection").css("display", "");
				$("#toggle-viz-type-container").css("display", "");
			} else {
				$('[data-class="Table"]').css("display", "none");
				$("#urbanRuralChartEquity").css("display", "none");
				$("#dwnload-img-RuralUrban-chart").css("display", "none");
				$("#view-selection-2").css("display", "none");
				$("#view-selection-3").css("display", "none");
				$("#category-select").css("display", "none");

				$("#dwnload-img-vaccination-equity-maps").css("display", "");
				$("#vaccinations-map-title").css("display", "none");
				$("#vaccinations-map-wrapperInternal").css("display", "none");
				$("#population-selection").css("display", "");
				$("#toggle-viz-type-container").css("display", "");
			}
		} else {
			$("#category-select").css("display", "block");
			$("#vaccinations-map-wrapperInternal").css("display", "none");
			$("#vaccinations-map-title").css("display", "none");
			$("#dwnload-img-vaccination-equity-maps").css("display", "none");
			$("#population-selection").css("display", "none");
			$("#toggle-viz-type-container").css("display", "none");

			$("#urbanRuralChartEquity").css("display", "");
			$("#view-selection-2").css("display", "");
			$("#view-selection-3").css("display", "");
			$("#dwnload-img-RuralUrban-chart").css("display", "");
			$('[data-class="Table"]').css("display", "none");
			this.setCurrentCategoriesValues();
			this.setCategoriesSelect(this.getEquityTrendsInitialData);
			this.renderChart();
		}
	}

	clearSelections() {
		let _self = this;
		let selectedValues = [..._self.colorMap.keys()];
		if (_self.selectedRects.includes("p")) {
			_self.selectedRects = ["p"];
			selectedValues.map((x) => {
				$(`[data-${_self.colorNeeded}="${x}"][data-completeness-pct="no"]`).css("fill", _self.colorMap.get(x));
				$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
				$(`[data-squareID ="${x}"]`).css("opacity", "1");
				$(`[data-class="clearSelections"]`).css("display", "none");
			});
		} else {
			_self.selectedRects = [];
			selectedValues.map((x) => {
				$(`[data-${_self.colorNeeded}="${x}"]`).css("fill", _self.colorMap.get(x));
				$(`[data-squareID ="${x}"]`).css("stroke-width", "1");
				$(`[data-squareID ="${x}"]`).css("opacity", "1");
				$(`[data-class="clearSelections"]`).css("display", "none");
			});
		}
	}

	changePercentagesHeatMap(selection) {
		let population = $("input[name='population-radio']:checked").val();
		let view = $("input[name='view-radio']:checked").val();
		let percentagesLeft = [$("#A1"), $("#A2"), $("#A3"), $("#A4")];
		let percentagesBottom = [$("#A1Bottom"), $("#B2Bottom"), $("#C3Bottom"), $("#D4Bottom")];
		let leftLegendText = $("#legendLeftText");
		let metric = $("input[name='vaccination-radio']:checked").val();

		// if (population.includes("12")) {
		// 	leftLegendText.text("% of 12+ population fully vaccinated");
		// } else if (population.includes("18")) {
		// 	leftLegendText.text("% of 18+ population fully vaccinated");
		// } else if (population.includes("65")) {
		// 	leftLegendText.text("% of 65+ population fully vaccinated");
		// } else if (population.includes("5")) {
		// 	leftLegendText.text("% of 5+ population fully vaccinated");
		// } else {
		// 	leftLegendText.text("% of total population fully vaccinated");
		// }

		switch (`${metric} ${population}`) {
			case "fullyVaccinated Total_Population":
				leftLegendText.text("% of total pop fully vaccinated");
				break;
			case "fullyVaccinated Population_5":
				leftLegendText.text("% of 5+ pop fully vaccinated");
				break;
			case "fullyVaccinated Population_Over_12":
				leftLegendText.text("% of 12+ pop fully vaccinated");
				break;
			case "fullyVaccinated Population_Over_18":
				leftLegendText.text("% of 18+ pop fully vaccinated");
				break;
			case "fullyVaccinated Population_65_plus":
				leftLegendText.text("% of 65+ pop fully vaccinated");
				break;
			case "fullyVaccinated Population_5_17":
				leftLegendText.text("% of 5 to 17 pop fully vaccinated");
				break;
			//////////////////////
			case "boosterDose Total_Population":
				leftLegendText.text("% of total pop fully vax people with a 1st booster dose");
				break;
			case "boosterDose Population_Over_12":
				leftLegendText.text("% of 12+  of fully vax people with a 1st booster dose");
				break;
			case "boosterDose Population_Over_18":
				leftLegendText.text("% of 18+ of fully vax people with a 1st booster dose");
				break;
			case "boosterDose Population_65_plus":
				leftLegendText.text("% of 65+ of fully vax people with a 1st booster dose");
				break;
			default:
				break;
		}

		if (view === "SVI") {
			if (metric === "fullyVaccinated") {
				if (selection === "5To17") {
					percentagesLeft[0].text(config.percentagesHeatMap.get("5To17").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("5To17").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("5To17").get(3)[0]);
					percentagesLeft[3].text(config.percentagesHeatMap.get("5To17").get(4)[0]);
					percentagesBottom[0].text(config.percentagesHeatMap.get("5To17").get(1)[1]);
					percentagesBottom[1].text(config.percentagesHeatMap.get("5To17").get(2)[1]);
					percentagesBottom[2].text(config.percentagesHeatMap.get("5To17").get(3)[1]);
					percentagesBottom[3].text(config.percentagesHeatMap.get("5To17").get(4)[1]);
				} else {
					percentagesLeft[0].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(3)[0]);
					percentagesLeft[3].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(4)[0]);
					percentagesBottom[0].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(1)[1]);
					percentagesBottom[1].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(2)[1]);
					percentagesBottom[2].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(3)[1]);
					percentagesBottom[3].text(config.percentagesHeatMap.get("fullyVaccinated SVI").get(4)[1]);
				}
			} else {
				if (selection === "65YearsBooster") {
					percentagesLeft[0].text(config.percentagesHeatMap.get("65YearsBooster").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("65YearsBooster").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("65YearsBooster").get(3)[0]);
					percentagesLeft[3].text(config.percentagesHeatMap.get("65YearsBooster").get(4)[0]);
					percentagesBottom[0].text(config.percentagesHeatMap.get("65YearsBooster").get(1)[1]);
					percentagesBottom[1].text(config.percentagesHeatMap.get("65YearsBooster").get(2)[1]);
					percentagesBottom[2].text(config.percentagesHeatMap.get("65YearsBooster").get(3)[1]);
					percentagesBottom[3].text(config.percentagesHeatMap.get("65YearsBooster").get(4)[1]);
				} else {
					percentagesLeft[0].text(config.percentagesHeatMap.get("boosterDose SVI").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("boosterDose SVI").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("boosterDose SVI").get(3)[0]);
					percentagesLeft[3].text(config.percentagesHeatMap.get("boosterDose SVI").get(4)[0]);
					percentagesBottom[0].text(config.percentagesHeatMap.get("boosterDose SVI").get(1)[1]);
					percentagesBottom[1].text(config.percentagesHeatMap.get("boosterDose SVI").get(2)[1]);
					percentagesBottom[2].text(config.percentagesHeatMap.get("boosterDose SVI").get(3)[1]);
					percentagesBottom[3].text(config.percentagesHeatMap.get("boosterDose SVI").get(4)[1]);
				}
			}
		} else if ((view = "Metro")) {
			if (metric === "fullyVaccinated") {
				if (selection === "5To17") {
					percentagesLeft[0].text(config.percentagesHeatMap.get("Metro5To17").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("Metro5To17").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("Metro5To17").get(3));
					percentagesLeft[3].text(config.percentagesHeatMap.get("Metro5To17").get(4));
					percentagesBottom[0].text(config.percentagesHeatMap.get("Metro5To17").get(1)[1]);
					$("#B1Bottom").text(config.percentagesHeatMap.get("Metro5To17").get(2)[1]);
					// leftLegendText.text("% of population 5-17 fully vaccinated");
				} else {
					percentagesLeft[0].text(config.percentagesHeatMap.get("Metro").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("Metro").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("Metro").get(3));
					percentagesLeft[3].text(config.percentagesHeatMap.get("Metro").get(4));
					percentagesBottom[0].text(config.percentagesHeatMap.get("Metro").get(1)[1]);
					$("#B1Bottom").text(config.percentagesHeatMap.get("Metro").get(2)[1]);
				}
			} else {
				if (selection === "65YearsBoosterMetro") {
					percentagesLeft[0].text(config.percentagesHeatMap.get("boosterDose Metro65").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("boosterDose Metro65").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("boosterDose Metro65").get(3));
					percentagesLeft[3].text(config.percentagesHeatMap.get("boosterDose Metro65").get(4));
					percentagesBottom[0].text(config.percentagesHeatMap.get("boosterDose Metro65").get(1)[1]);
					// $("#B1Bottom").text(config.percentagesHeatMap.get("boosterDose Metro").get(2)[1]);
				} else {
					percentagesLeft[0].text(config.percentagesHeatMap.get("Metro5To17").get(1)[0]);
					percentagesLeft[1].text(config.percentagesHeatMap.get("Metro5To17").get(2)[0]);
					percentagesLeft[2].text(config.percentagesHeatMap.get("Metro5To17").get(3));
					percentagesLeft[3].text(config.percentagesHeatMap.get("Metro5To17").get(4));
					percentagesBottom[0].text(config.percentagesHeatMap.get("Metro5To17").get(1)[1]);
					$("#B1Bottom").text(config.percentagesHeatMap.get("Metro5To17").get(2)[1]);
					// leftLegendText.text("% of population 5-17 fully vaccinated");
				}
			}
		}
	}

	/// //////////////ruralUrban section start////////////////////

	populateSelectOptions() {
		const locationList = this.selectUsOrStateData.map((x) => {
			if (x.LongName == "United States") {
				return { name: x.LongName, value: x.State, selected: true };
			}
			return { name: x.LongName, value: x.State };
		});

		const locationDropdownList = _.uniqBy(locationList, "name", true);
		// let locationDropdownList = this.selectUsOrStateData;

		// Find the index by property title, that should equal name "Unknown".
		let unknownKey = _.findIndex(locationDropdownList, ["name", "United States"]);
		if (unknownKey !== -1) {
			// Clone the value to the bottom of the array.
			locationDropdownList.unshift(locationDropdownList[unknownKey]);
			// Remove the original key.
			//ran twice to remove United States for some reson it does not work just running it once TODO: find a fix
			locationDropdownList.splice(unknownKey, 1);
			locationDropdownList.splice(unknownKey, 1);
		}
		$("#location-select").dropdown({
			values: locationDropdownList,
		});
		let classificationSelectValues = [
			{ name: "NCHS Urban/Rural Classification(2013)", value: "NCHS" },
			{
				name: "Metro vs Non-Metro",
				value: "Metro",
				selected: true,
			},
		];

		$("#classification-select").dropdown({
			values: classificationSelectValues,
		});
		// /* the below is needed because jquery creates a refrence in memory for selected objects.
		//     Thus when the element is destroyed the listener remains and creates a bug when the tab is
		//     navigated to again. */
		this.locationUpdate = false;
		// this.catUpdate = false;
		// this.classUpdate = false;
	}

	renderChart() {
		const _self = this;
		let metric = $("input[name='vaccination-radio']:checked").val();
		const flattenedData = this.getFlattenedFilteredData();
		const chartBaseProps = this.getChartBaseProps(metric);
		const props = getAllChartProps(flattenedData, chartBaseProps);
		_self.updateTitleAndTooltip();

		$(`#${props.vizId}`).empty();
		this.chartConfig = props;
		const genChart = new GenChart(props);

		renderSlider(genChart.render(), getCurrentSettingSliderDomain());
	}

	renderURDataTable() {
		const _self = this;
		const flattenedTableData = this.getFlattenedFilteredTableData();
		let { currentLocation } = _self;
		if (currentLocation === "") {
			currentLocation = "US";
		}
		let metric = $("input[name='vaccination-radio']:checked").val();
		const DataTable = new UrbanRuralDataTable({
			flattenedTableData,
			currentLocation,
			metric,
		});
		DataTable.render();
	}

	getFlattenedFilteredData() {
		const _self = this;
		let classifiedData = this.getEquityTrendsInitialData;
		const noLocationNamedData = [...classifiedData];

		const stateData = noLocationNamedData
			.filter((d) => this.currentCategories.includes(d.NCHS_Category))
			.map((d) => ({
				...d,
				date: new Date(`${d.Date}T00:00:00`),
				Classification: d.Classification,
				location: d.LongName,
				subLine: config.getCategoryName2.get(d.NCHS_Category),
				NCHS_txt:
					"<b>% Population in " + config.getCategoryName2.get(d.NCHS_Category) + ":</b> " + d.NCHS_Pct + "%",
			}));

		let sortedstateData = _.sortBy(stateData, "NCHS_Category");
		return [...sortedstateData];
	}

	getFlattenedFilteredTableData() {
		const _self = this;
		let classifiedData = this.getEquityTrendsInitialData;
		const noLocationNamedData = [...classifiedData];

		const stateData = noLocationNamedData.map((d) => ({
			...d,
			date: new Date(`${d.Date}T00:00:00`),
			Classification: d.Classification,
			location: d.LongName,
			subLine: config.getCategoryName2.get(d.NCHS_Category),
			NCHS_txt:
				"<b>% Population in " + config.getCategoryName2.get(d.NCHS_Category) + ":</b> " + d.NCHS_Pct + "%",
		}));

		let sortedTableData = _.sortBy(stateData, "NCHS_Category");
		return [...sortedTableData];
	}

	urbanRuralSection() {
		const _self = this;
		_self.populateSelectOptions(this.getEquityTrendsInitialData);
		$("#location-select").change((evt) => {
			const notUpdating = !_self.locationUpdate;
			if (notUpdating) {
				let location = evt.target.value;
				_self.updateLocation(location);
			}
		});

		$("#classification-select").change((evt) => {
			const notUpdating = !_self.locationUpdate;
			if (notUpdating) {
				let classification = evt.target.value;
				_self.updateLocation(this.currentLocation);
			}
		});

		_self.renderChart();
		_self.setCategoriesSelect(this.getEquityTrendsInitialData);
	}

	getChartBaseProps(metric) {
		let chartValueProperty = "Avg_Series_Complete_Pop_Pct";
		let yAxisTitle = "Percent";
		let chartTitle;
		let vizId = "urbanRuralChartEquity";

		if (metric === "boosterDose") {
			chartValueProperty = "Avg_Booster_Pop_Pct";
			vizId = "urbanRuralChartEquityBooster";
			// yAxisTitle = "Average % of total pop fully vaccinated with a 1st booster dose" ;
		}
		let classification = $("#classification-select").dropdown("get value");
		let selectedMetric = $("input[name='vaccination-radio']:checked").val();
		switch (`${selectedMetric} ${classification}`) {
			case "fullyVaccinated NCHS":
				chartTitle = `Average Percentages of Fully Vaccinated Population in ${stateAbbrToFull(
					this.currentLocation
				)}, by  County Urbanicity `;
				break;
			case "fullyVaccinated Metro":
				chartTitle = `Average Percentages of Fully Vaccinated Population in ${stateAbbrToFull(
					this.currentLocation
				)},  by Metro/Non-Metro Status `;
				break;
			case "boosterDose NCHS":
				chartTitle = `Average Percentages of Fully Vaccinated Population with a First Booster Dose in ${stateAbbrToFull(
					this.currentLocation
				)},  by County Urbanicity`;
				break;
			case "boosterDose Metro":
				chartTitle = `Average Percentages of Fully Vaccinated Population with a First Booster Dose in ${stateAbbrToFull(
					this.currentLocation
				)}, by Metro/Non-Metro Status`;
				break;
			default:
				break;
		}
		return { chartValueProperty, yAxisTitle, chartTitle, vizId };
	}

	setCategoriesSelect = () => {
		console.log({ currentLocation: this.currentLocation });
		const categoriesList = this.getEquityTrendsInitialData
			.filter((d) => this.currentCategories.includes(d.NCHS_Category))
			.map((x) => {
				return { name: config.getCategoryName2.get(x.NCHS_Category), value: x.NCHS_Category, selected: true };
			});

		const locationDropdownList = _.uniqBy(categoriesList, "name", true).filter((x) => x.name !== undefined);
		$("#category-select").dropdown({
			values: locationDropdownList.reverse(),
		});
	};

	updateTitleAndTooltip = () => {
		let textBox = $("#metric_callout_box");
		let classification = $("#classification-select").dropdown("get value");
		let metric = $("input[name='vaccination-radio']:checked").val();
		switch (`${metric} ${classification}`) {
			case "fullyVaccinated NCHS":
				textBox.text(
					`This chart shows trends in the average percentage of the fully vaccinated population by urbanicity at national and jurisdictional levels.`
				);
				break;
			case "fullyVaccinated Metro":
				textBox.text(
					`This chart shows trends in the average percentage of the fully vaccinated population by metro vs. non-metro classification type at national and jurisdictional levels.`
				);
				break;
			case "boosterDose NCHS":
				textBox.text(
					`This chart shows trends in the average percentage of the fully vaccinated population with a first booster dose by urbanicity at national and jurisdictional levels.`
				);
				break;
			case "boosterDose Metro":
				textBox.text(
					`This chart shows trends in the average percentage of the fully vaccinated population with a first booster dose by metro vs. non-metro classification type at national and jurisdictional levels.`
				);
				break;
			default:
				textBox.text(
					`This chart shows trends in the average percentage of the fully vaccinated population by urbanicity at national and jurisdictional levels.`
				);
				break;
		}
	};

	async updateLocation(currentLocation) {
		const _self = this;
		this.currentLocation = currentLocation;
		await _self.getNewLocationData();
		console.log({ updateLocation: this.getEquityTrendsInitialData });
		_self.setCurrentCategoriesValues();
		_self.renderChart();
		this.renderURDataTable();
		_self.setCategoriesSelect(this.getEquityTrendsInitialData, this.currentLocation);
	}
	getNewLocationData() {
		let dataPromise = Utils.getAPI(`${process.env.API_URL}equity_trends_${this.currentLocation}`, 10 * 10000);
		Promise.resolve(dataPromise).then((x) => {
			this.getEquityTrendsInitialData = x.equity_trends;
		});
	}
	setCurrentCategoriesValues() {
		switch ($("#classification-select").dropdown("get value")) {
			case "NCHS":
				this.currentCategories = [1, 2, 3, 4, 5, 6];
				break;
			case "Metro":
				this.currentCategories = [7, 8];
				break;
			default:
				this.currentCategories = [1, 2, 3, 4, 5, 6];
				break;
		}
	}

	removeCategory(category) {
		let helper;
		helper = this.currentCategories.filter((x) => {
			return x !== +category;
		});
		this.currentCategories = helper;
		this.renderChart();
	}

	addCategory(category) {
		this.currentCategories.push(+category);
		this.currentCategories.sort();
		this.renderChart();
	}
}

/* export function setCurrentSliderDomain(sd) {
	this.currentSliderDomain = sd;
} */

/* export const getChartBaseProps = () => {
	const chartValueProperty = "Avg_Series_Complete_Pop_Pct";
	const yAxisTitle = "Average % of total population fully vaccinated";
	return { chartValueProperty, yAxisTitle };
}; */

/* module.exports = { setCurrentSliderDomain };  
module.exports = { getChartBaseProps };*/
