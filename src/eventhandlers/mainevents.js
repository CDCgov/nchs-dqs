import { ExportEvents } from "./exportevents";
import { downLoadGenChart } from "../utils/downloadimg";
//import { getCurrentSliderDomain } from "./components/general/genTrendsSlider";
//import * as util from "../components/communityProfile/util";

export const MainEvents = {
	registerEvents() {
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
		$("#show-one-period-checkbox").on('change',(evt) => {
			let isChecked = evt.target.checked; // if you dont do this then stubNum is string
			if (isChecked) {
				//console.log("Checkbox is checked..");
				// hide the ending period select dropdown
				$("#year-end-label").hide();
				$("#year-end-select").hide();
  			} else {
    			// show the ending period select dropdown
				$("#year-end-label").show();
				$("#year-end-select").show();
			}
		});

		$("#classification-select").change((evt) => {
			const notUpdating = !appState.ACTIVE_TAB.getClassUpdateState();
			if (notUpdating) {
				let classification = evt.target.value;
				appState.ACTIVE_TAB.updateClassification(classification);
				this.setDownloadAriaLabel();
			}
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
