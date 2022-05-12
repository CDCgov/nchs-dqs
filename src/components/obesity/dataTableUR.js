import { downloadCSV } from "../../utils/downloadCSV";
import * as d3 from "../../lib/d3.min";
import { DataCache } from "../../utils/datacache";
import { stateAbbrToFull } from "../../utils/helpers";
import { dataTableUREvents } from "./dataTableUREvents";

export class UrbanRuralDataTable {
	constructor(props) {
		this.data = props.flattenedTableData || {};
		this.dataLocation = props.currentLocation || "";
    this.metric = props.metric || "fullyVaccinated"
		this.tableTitle = "";
	}

	template = `
    <div id="urban-rural-table-toggle" class="table-toggle closed" tabindex="0"  aria-labelledby="urban-rural-table-title" >
    	<h4 id="urban-rural-table-title" class="table-title">Data Table for Vaccinations Data</h4>
    	<div class="table-toggle-icon"><i id="urban-rural-table-header-icon" class="fas fa-plus"></i></div>
  	</div>
  	<div id="urban-rural-table-container" class="data-table closed"  style ="overflow-x:scroll;" tabindex="0" aria-label="vaccinations table">
    	<div class="table-info">
    	    <div class="general_note" style="margin-top: 10px;" id="table-note">${DataCache.JSONReleaseWithPullSet6am}</div>
    	    <button id="btnUrbanRuralExport" class="btn data-download-btn" tabindex="0">
    	        Download Data <i class='fas fa-download' aria-hidden="true"></i>
    	    </button>
    	</div>
    	<div id="skipTableLink" class="skipOptions"><a href="#viewHistoricLink">Skip Table</a></div>
    	<div id="topOfTable" class="scrolling-table-container" style="overflow-x:scroll">
    	    <table id="urban-rural-data-table" class="expanded-data-table vaccinations-fontsize"></table>
		</div>
  	</div>`;

	renderUrbanRuralDataTable(data, currentLocation) {
		const _self = this;
		this.categoryNamesMapForDataTable = new Map([
			[1, ["Large Central Metro", "Large-Central-Metro"]],
			[2, ["Large Fringe Metro", "Large-Fringe-Metro"]],
			[3, ["Medium Metro", "Medium-Metro"]],
			[4, ["Small Metro", "Small-Metro"]],
			[5, ["Micropolitan", "Micropolitan"]],
			[6, ["Non-core (Rural)", "Non-core-(Rural)"]],
			[7, ["Metro", "Metro"]],
			[8, ["Non-Metro", "Non-Metro"]],
			[9, ["% Population in Large Medium Metro", "Medium-Metro2"]],
			[10, ["% Population in Large Small Metro", "Small-Metro2"]],
			[11, ["% Population in Large Micropolitan", "Micropolitan2"]],
			[12, ["% Population in Large Non-core (Rural)", "Non-core-(Rural)2"]],
		]);
		let categoryNames = new Set(data.map((x) => x.NCHS_Category));
		let categoryNamesValuesArray = Array.from(categoryNames).sort();

		window.appState.ACTIVE_TAB.UrbanRural = this;
		let tableData = _self.filterDataUrbanRural(data);
		const tableId = "urban-rural-data-table";
    this.tableTitle = `Data Table for the Average of the Percentages of the Fully Vaccinated Population in ${stateAbbrToFull(
			currentLocation
		)} by Urban-Rural Classification Type`;
    if(this.metric === "boosterDose"){
      this.tableTitle = `Data Table for the Average of the Percentages of the Fully Vaccinated Population with a First Booster Dose in ${stateAbbrToFull(
        currentLocation
      )} by Urban-Rural Classification Type`;
    }
		let categoriesArray = [];
		let categoryNamesArray = [];
		categoryNamesArray = ["Date", "Location"];
		categoryNamesValuesArray.map((x) => categoryNamesArray.push(this.categoryNamesMapForDataTable.get(x)[0]));
		categoriesArray = ["Date", "location"];
		categoryNamesValuesArray.map((x) => categoriesArray.push(this.categoryNamesMapForDataTable.get(x)[1]));

		const keys = [...categoriesArray];
		const cols = [...categoryNamesArray];
		const currentSelected = "date";

		document.getElementById(`urban-rural-table-title`).innerHTML = this.tableTitle;
		dataTableUREvents.registerEvents();
		const tableContainer = document.getElementsByClassName("anchorClassforTable")[0];
		tableContainer.setAttribute("aria-label", `${this.tableTitle} table`);
		tableContainer.setAttribute("aria-label", `${this.tableTitle} table`);
		const table = d3.select("#urban-rural-data-table");
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
			.attr("tabindex", "0")
			.text(function (column) {
				return column;
			})
			.attr("class", function (column, i) {
				let classString;
				if (column === "Date") {
					classString = "table-sort-header data-table-header date-sort";
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
			.attr("tabindex", "0")
			.text(function (d, i, row) {
				if (d.value === null || d.value === undefined) {
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
	}

	exportCSV2() {
		const _self = this;
		const csvData = _self.filterDataUrbanRural(this.data);

		const exportButton = document.querySelector("#btnUrbanRuralExport > i");
		exportButton.classList.remove("fa-download");
		exportButton.classList.add("fa-circle-notch", "fa-spin");
		this.getCSVData(csvData, this.data);
		downloadCSV(this.csv);
		exportButton.classList.remove("fa-circle-notch", "fa-spin");
		exportButton.classList.add("fa-download");
	}

	getCSVData(filteredData, data) {
		const _self = this;
		let keys = [];
		let cols = [];
		let categoryNamesMapForDataTable = new Map([
			[1, ["% Fully Vaccinated Large Centralvvv", "Large-Central-Metro"]],
			[2, ["% Fully Vaccinated Large Fringe", "Large-Fringe-Metro"]],
			[3, ["% Fully Vaccinated Medium Metro", "Medium-Metro"]],
			[4, ["% Fully Vaccinated Small Metro", "Small-Metro"]],
			[5, ["% Fully Vaccinated Micropolitan", "Micropolitan"]],
			[6, ["% Fully Vaccinated Non-core (Rural)", "Non-core-(Rural)"]],
			[7, ["% Population in Large Central Metro", "Large-Central-Metro2"]],
			[8, ["% Population in Large Fringe Metro", "Large-Fringe-Metro2"]],
			[9, ["% Population in Large Medium Metro", "Medium-Metro2"]],
			[10, ["% Population in Large Small Metro", "Small-Metro2"]],
			[11, ["% Population in Large Micropolitan", "Micropolitan2"]],
			[12, ["% Population in Large Non-core (Rural)", "Non-core-(Rural)2"]],
      [13, ["Metro", "Metro"]],
			[14, ["Non-Metro", "Non-Metro"]],
		]);

		// creates the Set we need based on the number of items in categoryNamesMapForDataTable map above
		let categoryNames = new Set(); // (data.map((x) => x.NCHS_Category));
		for (let key of categoryNamesMapForDataTable.keys()) {
			categoryNames.add(key);
		}

		let categoryNamesValuesArray = Array.from(categoryNames); // no dont .sort() or cols are out of order

		cols = ["Date", "Location"];
		categoryNamesValuesArray.map((x) => cols.push(categoryNamesMapForDataTable.get(x)[0]));

		keys = ["Date", "location"];
		categoryNamesValuesArray.map((x) => keys.push(categoryNamesMapForDataTable.get(x)[1]));

		const csvData = filteredData;
		const csvTitle = _self.tableTitle;
		this.csv = {
			data: csvData,
			dataKeys: keys,
			title: csvTitle,
			headers: cols,
		};
	}

	// if you need to add cols to the CSV download, here is where you do that
	// but also have to add to category names in data before it's passed in
	filterDataUrbanRural(data) {
		let tableData = [];
		let map_test = new Map();
		let helper = 0;
    let xValue;
		data.map((x) => {
			if (map_test.get(x.Date) === undefined) {
        xValue = x.Avg_Booster_Pop_Pct;
        if(this.metric === "boosterDose"){
          xValue = x.Avg_Booster_Pop_Pct;
        }
				tableData.push({
					Date: x.Date,
					location: x.location,
					[`${x.subLine.replaceAll(" ", "-")}`]: xValue,
					[`${x.subLine.replaceAll(" ", "-")}` + `2`]: x.NCHS_Pct,
				});
				map_test.set(x.Date, helper);
				helper += 1;
			} else {
        tableData[`${map_test.get(x.Date)}`][`${x.subLine.replaceAll(" ", "-")}`] =
        x.Avg_Series_Complete_Pop_Pct;
        tableData[`${map_test.get(x.Date)}`][`${x.subLine.replaceAll(" ", "-")}` + `2`] = x.NCHS_Pct;
        if(this.metric === "boosterDose"){
          tableData[`${map_test.get(x.Date)}`][`${x.subLine.replaceAll(" ", "-")}`] =
          x.Avg_Booster_Pop_Pct;
          tableData[`${map_test.get(x.Date)}`][`${x.subLine.replaceAll(" ", "-")}` + `2`] = x.NCHS_Pct;
        }
			}
		});
		tableData.reverse();

		return tableData;
	};

	render() {
		$("#urban-rural-data-table-container").empty().append(this.template);
		this.renderUrbanRuralDataTable(this.data, this.dataLocation);

	}
}
