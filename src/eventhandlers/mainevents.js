import { ExportEvents } from "./exportevents";
import { downLoadGenChart } from "../utils/downloadimg";
//import { getCurrentSliderDomain } from "./components/general/genTrendsSlider";
//import * as util from "../components/communityProfile/util";

export const MainEvents = {
	registerEvents() {
		$("#data-topic-select").change((evt) => {
			let dataTopic = evt.target.value; // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateDataTopic(dataTopic);
			console.log("New data topic:", dataTopic);
		});
		$("#panel-num-select").change((evt) => {
			let panelNum = evt.target.value;
		    appState.ACTIVE_TAB.updatePanelNum(panelNum);
				//this.setDownloadAriaLabel();
			  //.updatePanelNum(panelNum);
			console.log("parent:", evt.target.parentNode);
			console.log("appstate:",appState)
			//debugger;
		});
		$("#stub-name-num-select").change((evt) => {
			let stubNum = parseInt(evt.target.value); // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateStubNameNum(stubNum);
			console.log("New stubname num:", evt.target.value);
		});
		$("#year-start-select").change((evt) => {
			let yrStart = evt.target.value; // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateStartPeriod(yrStart);
			console.log("New Start Period:", yrStart);
		});
		$("#year-end-select").change((evt) => {
			let yrEnd = evt.target.value; // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateEndPeriod(yrEnd);
			console.log("New End Period:", yrEnd);
		});
		// on the chart tab
		$("#unit-num-select").change((evt) => {
			let unitNum = parseInt(evt.target.value); // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
			console.log("New Unit num:", unitNum);
		});
		// on the table tab
		$("#unit-num-select2").change((evt) => {
			let unitNum = parseInt(evt.target.value); // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
			console.log("New Unit num:", unitNum);
		});
		$("#show-one-period-checkbox").on('change',(evt) => {
			let isChecked = evt.target.checked; // if you dont do this then stubNum is string
			if (isChecked) {
				//console.log("Checkbox is checked..");
				// hide the ending period select dropdown
				$("#year-end-label").hide();
				$("#year-end-select").hide();
				// set to enable bar chart
				appState.ACTIVE_TAB.updateShowBarChart(1);
  			} else {
    			// show the ending period select dropdown
				$("#year-end-label").show();
				$("#year-end-select").show();
				// set to enable line chart
				appState.ACTIVE_TAB.updateShowBarChart(0);
			}
		});

		$(document).on("click", ".chart-container-svg-legendItem", (event) => {
			event.stopPropagation();
			// get the unique id of the legend item
			let legItem = event.target.parentNode.parentNode.id;
			//console.log("legendItem clicked: ", legItem);
			appState.ACTIVE_TAB.toggleLegendItem(legItem);
			event.preventDefault();
		});
		
		// click Chart then show Chart
		$(document).on("click", "#icons-tab-1", (event) => {
			event.stopPropagation();
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "block";
			theChart.classList.add("show");
			theChart.classList.add("active");
			// have to render Chart again otherwise svg has no "size" = NaN
			appState.ACTIVE_TAB.renderChart();
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "none";
			theTable.classList.remove("show");
			theTable.classList.remove("active");
			// flip the colors
			let theChartTab = document.getElementById("icons-tab-1");
			theChartTab.style.backgroundColor = "#b3d2ce";
			theChartTab.style.cssText += 'border-top: solid 5px #8ab9bb'; 
			let theTableTab = document.getElementById("icons-tab-2");
			theTableTab.style.backgroundColor = "#ffffff";
			theTableTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			event.preventDefault();
		});
		
		// click Table then show Table
		$(document).on("click", "#icons-tab-2", (event) => {
    		event.stopPropagation();
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "block";
			theTable.classList.add("show");
			theTable.classList.add("active");
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "none";
			theChart.classList.remove("show");
			theChart.classList.remove("active");
			// flip the colors
			let theChartTab = document.getElementById("icons-tab-1");
			theChartTab.style.backgroundColor = "#ffffff";
			theChartTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			let theTableTab = document.getElementById("icons-tab-2");
			theTableTab.style.backgroundColor = "#b3d2ce";
			theTableTab.style.cssText += 'border-top: solid 5px #8ab9bb'; 
			event.preventDefault();
		});

		$(document)
			.off("click", "#popFactors-download-chart")
			// the category lines (remove)
			.on("click", ".delete.icon", (e) => {
				const element = e.target.closest("a").dataset.value;
				const notUpdating = !appState.ACTIVE_TAB.getCatUpdateState();
				if (notUpdating) {
					appState.ACTIVE_TAB.removeCategory(element);
					this.setDownloadAriaLabel();
				}
			})
			// the category lines (add back)
			.on("click", "#category-select-list > .item", (e) => {
				const category = e.target.dataset.value;
				const notUpdating = !appState.ACTIVE_TAB.getCatUpdateState();
				if (notUpdating) {
					appState.ACTIVE_TAB.addCategory(category);
					this.setDownloadAriaLabel();
				}
			});

		$("#popFactors-download-chart").click((e) => {
			const params = {
				contentContainer: "popFactors-chart-container",
				downloadButton: e.target.id,
				imageSaveName: "Demographic Factors Trends",
			};
			downLoadGenChart(params);
		});

		ExportEvents.registerEvents();
	},

	setDownloadAriaLabel() {
		let tableText = $("#pop-factors-table-title").text();
		$("#btnPopFactorsExport").attr("aria-label", `Download Data for ${tableText}`);
	},
};
