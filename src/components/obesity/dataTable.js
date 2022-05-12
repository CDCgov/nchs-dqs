import { downloadCSV } from "../../utils/downloadCSV";
import * as d3 from "../../lib/d3.min";
import { DataCache } from "../../utils/datacache";
import { SVIDataTable, SVI, getAllChartProps, getChartBaseProps } from "./config";

var currentSliderDomain;
export class VaccinationsTable {
	constructor(props) {
		appState.CURRENT_TAB = "VaccinationsEquityChart";
		this.data = props.data || {};
		this.totals = props.totals || {};
		this.totalsLTC = props.totalsLTC || {};
		this.SVIDataTable = SVIDataTable;
		this.chartConfig = null;
	}

	rendervaccinationsTable(data) {

		const chartBaseProps = getChartBaseProps();
		const props = getAllChartProps(data.vaccination_county_condensed_data, chartBaseProps);
		this.chartConfig = props;

		data.vaccination_county_condensed_data = data.vaccination_county_condensed_data.filter(function (x) {
			return x.FIPS !== "UNK";
		});
		document.getElementById("btnVaccinationsEquityExport").addEventListener("click", (evt) => {
			evt.preventDefault();
			evt.stopImmediatePropagation();
			appState.ACTIVE_TAB.exportCSV();
		});
		const self = this;
		const showRadioSelected65Plus = document.getElementById("population-radio-population-over-65");
		const showRadioSelected18Plus = document.getElementById("population-radio-population-over-18");
		const showRadioSelected12Plus = document.getElementById("population-radio-population-over-12");
		const showRadioSelected5Plus = document.getElementById("population-radio-population-over-5");
		const showRadioSelected5_17 = document.getElementById("population-radio-population-5-17");
		const showRadioSelectedTotalPopulation = document.getElementById("population-radio-total");

		const SVIRadioSelected = document.getElementById("SVI");
		const MetroRadioSelected = document.getElementById("metroNonMetro");

		const fullyVaccinated = document.getElementById("fully-vaccinated-radio");
		const boosterDose = document.getElementById("booster-dose-radio");

		function callRender() {
			self.render();
			document.getElementById("btnVaccinationsEquityExport").removeEventListener("click", (evt) => {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				appState.ACTIVE_TAB.exportCSV();
			});
			showRadioSelected65Plus.removeEventListener("click", callRender, false);
			showRadioSelected18Plus.removeEventListener("click", callRender, false);
			showRadioSelected12Plus.removeEventListener("click", callRender, false);
			showRadioSelected5Plus.removeEventListener("click", callRender, false);
			showRadioSelected5_17.removeEventListener("click", callRender, false);
			showRadioSelectedTotalPopulation.removeEventListener("click", callRender, false);
			SVIRadioSelected.removeEventListener("click", callRender, false);
			MetroRadioSelected.removeEventListener("click", callRender, false);
			fullyVaccinated.removeEventListener("click", callRender, false);
			boosterDose.removeEventListener("click", callRender, false);
		}

		showRadioSelected65Plus.addEventListener("click", callRender);
		showRadioSelected18Plus.addEventListener("click", callRender);
		showRadioSelected12Plus.addEventListener("click", callRender);
		showRadioSelected5Plus.addEventListener("click", callRender);
		showRadioSelected5_17.addEventListener("click", callRender);

		showRadioSelectedTotalPopulation.addEventListener("click", callRender);
		SVIRadioSelected.addEventListener("click", callRender);
		MetroRadioSelected.addEventListener("click", callRender);
		fullyVaccinated.addEventListener("click", callRender);
		boosterDose.addEventListener("click", callRender);

		window.appState.ACTIVE_TAB = this;

		const addCommasToData = data.vaccination_county_condensed_data.map((x) => ({ ...x }));
		// County   StateName
		const tableData = this.filterData(
			addCommasToData.sort((a, b) => {
				(a, b) => {
					if (a.StateName === b.StateName) {
						return a.County < b.County ? -1 : 1;
					}
					return a.StateName < b.StateName ? -1 : 1;
				};
			})
		);
		const tableId = "vaccinations-equity-table";
		const tableTitle = "Data Table for Vaccinations Equity";
		let categoriesArray = [];
		let categoryNamesArray = [];
		let viewSelected = $("input[name='view-radio']:checked").val();
		if (fullyVaccinated.checked === true) {
			if (viewSelected === "SVI") {
				if (showRadioSelected5Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(5+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 5+ pop fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_5PlusPop_Pct",
					];
				} else if (showRadioSelected5_17.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(5 -17/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 5-17 pop fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_5to17Pop_Pct",
					];
				} else if (showRadioSelected12Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(12+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 12+ pop fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_12PlusPop_Pct",
					];
				} else if (showRadioSelected18Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(18+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 18+ pop fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_18PlusPop_Pct",
					];
				} else if (showRadioSelected65Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(65+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 65+ pop fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_65PlusPop_Pct",
					];
				} else {
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of total population fully vaccinated",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Series_Complete_Pop_Pct",
					];
				}
			} else if (showRadioSelected5Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 5+ pop fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_5PlusPop_Pct",
				];
			} else if (showRadioSelected5_17.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 5 - 17 pop fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_5to17Pop_Pct",
				];
			} else if (showRadioSelected12Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 12+ pop fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_12PlusPop_Pct",
				];
			} else if (showRadioSelected18Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 18+ pop fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_18PlusPop_Pct",
				];
			} else if (showRadioSelected65Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 65+ pop fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_65PlusPop_Pct",
				];
			} else {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of total population fully vaccinated",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Series_Complete_Pop_Pct",
				];
			}
		} else if (boosterDose.checked === true) {
			if (viewSelected === "SVI") {
				if (showRadioSelected12Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(12+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 12+ fully vaccinated pop with a 1st booster dose",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Booster_Doses_12Plus_Vax_Pct",
					];
				} else if (showRadioSelected18Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(18+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 18+ fully vaccinated pop with a 1st booster dose",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Booster_Doses_18Plus_Vax_Pct",
					];
				} else if (showRadioSelected65Plus.checked === true) {
					// Selection -> People/At Least One Dose/(Rate/count)/(65+/Total Population)
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of 65+ fully vaccinated pop with a 1st booster dose",
					];

					categoriesArray = [
						"County",
						"StateAbbr",
						"SVI_CTGY",
						"Completeness_pct",
						"Booster_Doses_65Plus_Vax_Pct",
					];
				} else {
					categoryNamesArray = [
						"County",
						"State",
						"SVI",
						"County of Residence Reporting Completeness",
						"Percent of total fully vaccinated pop with a 1st booster dose",
					];

					categoriesArray = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Booster_Doses_Vax_Pct"];
				}
			} else if (showRadioSelected12Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 12+ fully vaccinated pop with a 1st booster dose",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Booster_Doses_12Plus_Vax_Pct",
				];
			} else if (showRadioSelected18Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 18+ fully vaccinated pop with a 1st booster dose",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Booster_Doses_18Plus_Vax_Pct",
				];
			} else if (showRadioSelected65Plus.checked === true) {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of 65+ fully vaccinated pop with a first booster dose",
				];

				categoriesArray = [
					"County",
					"StateAbbr",
					"metro_status",
					"Completeness_pct",
					"Booster_Doses_65Plus_Vax_Pct",
				];
			} else {
				categoryNamesArray = [
					"County",
					"State",
					"Metro status",
					"County of Residence Reporting Completeness",
					"Percent of total fully vaccinated pop with a 1st booster dose",
				];

				categoriesArray = ["County", "StateAbbr", "metro_status", "Completeness_pct", "Booster_Doses_Vax_Pct"];
			}
		}

		const keys = [...categoriesArray];
		const cols = [...categoryNamesArray];
		const currentSelected = "date";

		document.getElementById(`vaccinations-equity-table-title`).innerHTML = tableTitle;
		const tableContainer = document.getElementsByClassName("data-table-container")[0];
		tableContainer.setAttribute("aria-label", `${tableTitle} table`);
		tableContainer.setAttribute("aria-label", `${tableTitle} table`);
		const table = d3.select("#vaccinations-equity-table");
		table.select("thead").remove();
		table.select("tbody").remove();
		const thead = table.append("thead");
		thead
			.append("tr")
			.selectAll("th")
			.data(cols)
			.enter()
			.append("th")
			.attr("scope", "col")
			.attr("tabindex", "0") // for 508 compliance
			.text(function (column) {
				return column;
			})
			.attr("class", function (column, i) {
				let classString;
				if (column === "County" || column === "State" || column === "SVI") {
					classString = "table-sort-header data-table-header";
				} else {
					classString = "table-sort-header data-table-header number-sort";
				}
				if (currentSelected === keys[i]) {
					classString += " sorted";
				}
				return classString;
			})
			.append("i")
			.attr("id", (column, i) => `${keys[i]}-icon`)
			.attr("class", "sort icon");

		let tbody = table.append("tbody");
		let row = tbody.selectAll("tr").data(tableData);

		let cell = row
			.enter()
			.append("tr")
			.selectAll("td")
			.data(function (row) {
				return keys.map(function (column) {
					let dataObj = {
						column,
						value: row[column],
					};
					return dataObj;
				});
			})
			.enter()
			.append("td")
			.attr("tabindex", "0") // for 508 compliance
			.text(function (d, i, row) {
				if (d.value === null || d.value == 0) {
					return "N/A";
				}
				return d.value;
			})
			.each(function (column, index, i) {
				let columnIndex = index;
				let columnHeader = cols[columnIndex];
				let firstColumnVal = i[0].innerText;
				if (columnIndex === 0) {
					this.setAttribute("aria-label", `${columnHeader} ${column.value}`);
				} else if (column.value === null) {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} ` + `Not Available`);
				} else {
					this.setAttribute("aria-label", `${firstColumnVal} ${columnHeader} ${column.value}`);
				}
				//$(this).attr('tabindex', '0');
				this.setAttribute("tabindex", "0"); // for 508 compliance
			});

		$(`#${tableId}`).tablesort();
		$("thead th.number-sort").data("sortBy", function (th, td, tablesort) {
			const cellValue = td.text();
			if (cellValue === "N/A") {
				return 1;
			}
			if (td.text()[td.text().length - 1] === "%") {
				return -1 * parseFloat(cellValue.split("-")[0]);
			}
			return -1 * parseFloat(cellValue.replace(/,/g, ""));
		});

		document.getElementById("table-note").innerHTML = DataCache.JSONReleaseWithPullSet6am;
	}

	exportCSV() {
		const csvData = this.filterDataCsv(this.data.vaccination_county_condensed_data);
		const exportButton = document.querySelector("#btnVaccinationsEquityExport > i");
		exportButton.classList.remove("fa-download");
		exportButton.classList.add("fa-circle-notch", "fa-spin");
		this.getCSVData(csvData);
		downloadCSV(this.csv);
		exportButton.classList.remove("fa-circle-notch", "fa-spin");
		exportButton.classList.add("fa-download");
	}

	getCSVData(data) {
		let keys = [];
		let cols = [];
		let viewSelected = $("input[name='view-radio']:checked").val();
		let population = $("input[name='population-radio']:checked").val();
		let metric = $("input[name='vaccination-radio']:checked").val();

		// this is duplicated in case we want diferent values between the table and the download
		const toDelete = ["GU ", "VI"];
		const newArray = data.filter((obj) => !toDelete.includes(obj.StateAbbr));
		let dataForDownload = JSON.parse(JSON.stringify(newArray));
		dataForDownload.map((x) => {
			x.SVI_CTGY = SVI.get(x.SVI_CTGY);
		});

		switch (`${viewSelected} ${metric}`) {
			case "SVI fullyVaccinated":
				switch (population) {
					case "Total_Population":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of total population fully vaccinated",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Series_Complete_Pop_Pct"];
						break;
					case "Population_5_17":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 5-17 pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"SVI_CTGY",
							"Completeness_pct",
							"Series_Complete_5to17Pop_Pct",
						];
						break;
					case "Population_5":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 5+ pop fully vaccinated",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Series_Complete_5PlusPop_Pct"];
						break;
					case "Population_Over_12":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 12+ pop fully vaccinated",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Series_Complete_12PlusPop_Pct"];
						break;
					case "Population_Over_18":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 18+ pop fully vaccinated",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Series_Complete_18PlusPop_Pct"];
						break;
					case "Population_65_plus":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 65+ pop fully vaccinated",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Series_Complete_65PlusPop_Pct"];
						break;
					default:
						break;
				}
				break;
			case "SVI boosterDose":
				switch (population) {
					case "Total_Population":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of total fully vaccinated pop with a first booster dose",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Booster_Doses_Vax_Pct"];
						break;
					case "Population_Over_12":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 12+ fully vaccinated pop with a first booster dose",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Booster_Doses_12Plus_Vax_Pct"];
						break;
					case "Population_Over_18":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 18+ fully vaccinated pop with a first booster dose",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Booster_Doses_18Plus_Vax_Pct"];
						break;
					case "Population_65_plus":
						cols = [
							"County",
							"State",
							"SVI",
							"County of Residence Reporting Completeness",
							"Percent of 65+ fully vaccinated pop with a first booster dose",
						];

						keys = ["County", "StateAbbr", "SVI_CTGY", "Completeness_pct", "Booster_Doses_65Plus_Vax_Pct"];
						break;
					default:
						break;
				}
				break;
			case "Metro fullyVaccinated":
				switch (population) {
					case "Total_Population":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of total population fully vaccinated",
						];

						keys = ["County", "StateAbbr", "metro_status", "Completeness_pct", "Series_Complete_Pop_Pct"];
						break;
					case "Population_5_17":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 5 - 17 pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Series_Complete_5to17Pop_Pct",
						];
						break;
					case "Population_5":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 5+ pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Series_Complete_5PlusPop_Pct",
						];
						break;
					case "Population_Over_12":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 12+ pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Series_Complete_12PlusPop_Pct",
						];
						break;
					case "Population_Over_18":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 18+ pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Series_Complete_18PlusPop_Pct",
						];
						break;
					case "Population_65_plus":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 65+ pop fully vaccinated",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Series_Complete_65PlusPop_Pct",
						];
						break;
					default:
						break;
				}
				break;
			case "Metro boosterDose":
				switch (population) {
					case "Total_Population":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of total fully vaccinated pop with a first booster dose",
						];

						keys = ["County", "StateAbbr", "metro_status", "Completeness_pct", "Booster_Doses_Vax_Pct"];
						break;
					case "Population_Over_12":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 12+ fully vaccinated pop with a first booster dose",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Booster_Doses_12Plus_Vax_Pct",
						];
						break;
					case "Population_Over_18":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 18+ fully vaccinated pop with a first booster dose",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Booster_Doses_18Plus_Vax_Pct",
						];
						break;
					case "Population_65_plus":
						cols = [
							"County",
							"State",
							"Metro status",
							"County of Residence Reporting Completeness",
							"Percent of 65+ fully vaccinated pop with a first booster dose",
						];

						keys = [
							"County",
							"StateAbbr",
							"metro_status",
							"Completeness_pct",
							"Booster_Doses_65Plus_Vax_Pct",
						];
						break;
					default:
						break;
				}
				break;
		}

		// if (viewSelected === "SVI") {
		// 	cols = [
		// 		"County",
		// 		"State",
		// 		"SVI",
		// 		"County of Residence Reporting Completeness",
		// 		"Percent of total population fully vaccinated",
		// 		"Percent of 5+ pop fully vaccinated",
		// 		"Percent of 12+ pop fully vaccinated",
		// 		"Percent of 18+ pop fully vaccinated",
		// 		"Percent of 65+ pop fully vaccinated",
		// 	];

		// 	keys = [
		// 		"County",
		// 		"StateAbbr",
		// 		"SVI_CTGY",
		// 		"Completeness_pct",
		// 		"Series_Complete_Pop_Pct",
		// 		"Series_Complete_5PlusPop_Pct",
		// 		"Series_Complete_12PlusPop_Pct",
		// 		"Series_Complete_18PlusPop_Pct",
		// 		"Series_Complete_65PlusPop_Pct",
		// 	];
		// } else {
		// 	cols = [
		// 		"County",
		// 		"State",
		// 		"Metro status",
		// 		"County of Residence Reporting Completeness",
		// 		"Percent of total population fully vaccinated",
		// 		"Percent of 5+ pop fully vaccinated",
		// 		"Percent of 12+ pop fully vaccinated",
		// 		"Percent of 18+ pop fully vaccinated",
		// 		"Percent of 65+ pop fully vaccinated",
		// 	];

		// 	keys = [
		// 		"County",
		// 		"StateAbbr",
		// 		"metro_status",
		// 		"Completeness_pct",
		// 		"Series_Complete_Pop_Pct",
		// 		"Series_Complete_5PlusPop_Pct",
		// 		"Series_Complete_12PlusPop_Pct",
		// 		"Series_Complete_18PlusPop_Pct",
		// 		"Series_Complete_65PlusPop_Pct",
		// 	];
		// }

		const csvData = dataForDownload;
		const csvTitle = "COVID-19 Vaccinations Equity";

		this.csv = {
			data: csvData,
			dataKeys: keys,
			title: csvTitle,
			headers: cols,
		};
	}

	filterData = (data) => {
		// this is duplicated in case we want diferent values between the table and the download
		const toDelete = ["GU ", "VI"];
		const newArray = data.filter((obj) => !toDelete.includes(obj.StateAbbr));
		newArray.map((x) => {
			x.SVI_CTGY = SVI.get(x.SVI_CTGY);
		});
		return newArray;
	};

	filterDataCsv = (data) => {
		const toDelete = new Set(["Long Term Care", "United States"]);
		const newArray = data.filter((obj) => !toDelete.has(obj.LongName));
		const arrayToReturn = newArray.map((d) => {
			return d;
		});
		return arrayToReturn;
	};

	template = `
		<div class="table-toggle closed" tabindex="0" aria-labelledby="vaccinations-equity-table-title">    	
    	  <h4 id="vaccinations-equity-table-title" class="table-title">Data Table for Vaccinations Data</h4>
    	  <div class="table-toggle-icon"><i id="vaccinations-equity-table-header-icon" class="fas fa-plus"></i></div>
    	</div>
    	<div class="data-table closed"  style ="overflow-x:scroll;" tabindex="0" aria-label="vaccinations table">
    	  <div class="table-info">
    	      <div class="general_note" style="margin-top: 10px;" id="table-note"></div>
    	      <button id="btnVaccinationsEquityExport" class="btn data-download-btn" tabindex="0" aria-label="Vaccinations data download button">
    	          Download Data <i class='fas fa-download' aria-hidden="true"></i>
    	      </button>
    	  </div>
    	<div id="skipTableLink" class="skipOptions"><a href="#viewHistoricLink">Skip Table</a> </div>
    	<div id="topOfTable" class="scrolling-table-container" style="overflow-x:scroll">
    	  <table id="vaccinations-equity-table" class="expanded-data-table vaccinations-fontsize"></table>
    	</div>
    `;

	render() {
		$("#vaccionation-data-table-container").empty().append(this.template);
		this.rendervaccinationsTable(this.data);
	}
}

// because this component is messing with ACTIVETAB we can't just put
// what we need in VaccinationEquity because dateTable.js VaccinationTable object
// is what is set to be appState.ACTIVE_TAB which genTrendsSlider uses to get
// chartConfig.data
// therefore we need everything in here
// HOWEVER the change event is in dataTableUREvents so we have to pass the currentSliderDomain
// from dataTableUREvents into here to set and store it
// THEN we let map.js grab the currentSliderDomain using the get function below
// to pass it into to renderSlider
// (this is all painful because this component is not really in standard format)(TT)
export function setCurrentSliderDomain (sd) {
	currentSliderDomain = sd;
}

export function getCurrentSettingSliderDomain() {
	return currentSliderDomain;
}
