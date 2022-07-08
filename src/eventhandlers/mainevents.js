import { ExportEvents } from "./exportevents";
import { downLoadGenChart } from "../utils/downloadimg";
//import { getCurrentSliderDomain } from "./components/general/genTrendsSlider";
//import * as util from "../components/communityProfile/util";

export const MainEvents = {
	registerEvents() {
		$("#data-topic-select").change((evt) => {
			let dataTopic = evt.target.value; // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateDataTopic(dataTopic);
			// force "year" to reset and not have single year clicked
			if (document.getElementById('show-one-period-checkbox').checked) {
				$("#show-one-period-checkbox").click();
			}
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
		// on the map tab
		$("#unit-num-select-map").change((evt) => {
			let unitNum = parseInt(evt.target.value); // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
			console.log("New Unit num:", unitNum);
		});
		// on the chart tab
		$("#unit-num-select-chart").change((evt) => {
			let unitNum = parseInt(evt.target.value); // if you dont do this then stubNum is string
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
			console.log("New Unit num:", unitNum);
		});
		// on the table tab
		$("#unit-num-select-table").change((evt) => {
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
			console.log("legendItem clicked: event.target,item",event.target, legItem);
			appState.ACTIVE_TAB.toggleLegendItem(legItem);
			event.preventDefault();
		});
		
		// click Map then show Map
		$(document).on("click", "#icons-tab-1", (event) => {
			event.stopPropagation();
			// have to do this LAST not FIRST - appState.ACTIVE_TAB.updateShowMap(1);
			// the map div must be visible in the Dom before you can render the map
			let theMap = document.getElementById("map-tab");
			theMap.style.display = "block";
			theMap.classList.add("show");
			theMap.classList.add("active");
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "none";
			theChart.classList.remove("show");
			theChart.classList.remove("active");
			// have to render Chart again otherwise svg has no "size" = NaN
			appState.ACTIVE_TAB.renderChart();
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "none";
			theTable.classList.remove("show");
			theTable.classList.remove("active");
			// flip the colors
			let theMapTab = document.getElementById("icons-tab-1");
			theMapTab.style.backgroundColor = "#b3d2ce";
			theMapTab.style.cssText += 'border-top: solid 5px #8ab9bb'; 
			let theChartTab = document.getElementById("icons-tab-2");
			theChartTab.style.backgroundColor = "#ffffff";
			theChartTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			let theTableTab = document.getElementById("icons-tab-3");
			theTableTab.style.backgroundColor = "#ffffff";
			theTableTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			// also need to reset the Characteristic stubNameNum back to what is selected!!!
			appState.ACTIVE_TAB.updateStubNameNum(parseInt($("#stub-name-num-select").val())); // (TT) 
			// NOW show the map
			appState.ACTIVE_TAB.updateShowMap(1);
			// FOR NOW FORCE SINGLE TIME PERIOD AS ONLY OPTION 
			// - must check if it is already checked though
			if (!document.getElementById('show-one-period-checkbox').checked) {
				$("#show-one-period-checkbox").click();
			}
			event.preventDefault();
		});

		// click Chart then show Chart
		$(document).on("click", "#icons-tab-2", (event) => {
			event.stopPropagation();
			let theMap = document.getElementById("map-tab");
			theMap.style.display = "none";
			theMap.classList.remove("show");
			theMap.classList.remove("active");
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
			let theMapTab = document.getElementById("icons-tab-1");
			theMapTab.style.backgroundColor = "#ffffff";
			theMapTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			let theChartTab = document.getElementById("icons-tab-2");
			theChartTab.style.backgroundColor = "#b3d2ce";
			theChartTab.style.cssText += 'border-top: solid 5px #8ab9bb'; 
			let theTableTab = document.getElementById("icons-tab-3");
			theTableTab.style.backgroundColor = "#ffffff";
			theTableTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			appState.ACTIVE_TAB.updateShowMap(0);
			// also need to reset the Characteristic back to default value
			// - 7/8/22 NO dont do it this way
			// - if we blindly set to 0 the visible Characteristic could be set to 1 but draws
			// chart based on set to 0
			//appState.ACTIVE_TAB.updateStubNameNum(0); // (TT) this assumes Total is always 0 on the list!!
			// also need to reset the Characteristic stubNameNum back to what is selected!!!
			// - actually may not even need this
			//appState.ACTIVE_TAB.updateStubNameNum(parseInt($("#stub-name-num-select").val())); // (TT) 
		
			// if a data set does not have 0 on the stub_label_num then this will FAIL
			event.preventDefault();
		});
		
		$(document).on("click", "#classNBreaks", (event) => {
			//event.stopPropagation();
			// get the unique walue
			let classifyBy = event.target.value;
			console.log("radio clicked: event.target,classifyBy", event.target, classifyBy);
			appState.ACTIVE_TAB.updateClassifyType(classifyBy);
			//event.preventDefault(); // kills the toggle
		});
				
		$(document).on("click", "#classQuartiles", (event) => {
			//event.stopPropagation();
			// get the unique value
			let classifyBy = event.target.value;
			console.log("radio clicked: event.target,classifyBy", event.target, classifyBy);
			appState.ACTIVE_TAB.updateClassifyType(classifyBy);
			//event.preventDefault(); // kills the toggle
		});
			
		// click Table then show Table
		$(document).on("click", "#icons-tab-3", (event) => {
			event.stopPropagation();
			// do this first but then code AFTER will fix it
			//appState.ACTIVE_TAB.updateShowMap(0);
			let theMap = document.getElementById("map-tab");
			theMap.style.display = "none";
			theMap.classList.remove("show");
			theMap.classList.remove("active");
			let theTable = document.getElementById("table-tab");
			theTable.style.display = "block";
			theTable.classList.add("show");
			theTable.classList.add("active");
			let theChart = document.getElementById("chart-tab");
			theChart.style.display = "none";
			theChart.classList.remove("show");
			theChart.classList.remove("active");
			// flip the colors
			let theMapTab = document.getElementById("icons-tab-1");
			theMapTab.style.backgroundColor = "#ffffff";
			theMapTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			let theChartTab = document.getElementById("icons-tab-2");
			theChartTab.style.backgroundColor = "#ffffff";
			theChartTab.style.cssText += 'border-top: solid 1px #C0C0C0'; 
			let theTableTab = document.getElementById("icons-tab-3");
			theTableTab.style.backgroundColor = "#b3d2ce";
			theTableTab.style.cssText += 'border-top: solid 5px #8ab9bb'; 
			// dont do this here bc updateShowMap is defaulting to Chart
			// appState.ACTIVE_TAB.updateShowMap(0);
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
