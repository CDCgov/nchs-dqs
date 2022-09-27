import { ExportEvents } from "./exportevents";
import { downLoadGenChart, downLoadMap2 } from "../utils/downloadimg";
import { resetTopicDropdownList, updateTopicDropdownList } from "../components/landingPage/functions";

export const MainEvents = {
	registerEvents() {
		let animationInterval;
		const stopAnimation = () => {
			clearInterval(animationInterval);
			$("#animatePlayIcon").css("fill", "black");
			$(".animatePauseIcon").css("fill", "none");
			appState.ACTIVE_TAB.animating = false;
			$("#mapPlayButtonContainer").hide();
		};

		$("#data-topic-select").on("change", (evt) => {
			stopAnimation();
			let dataTopic = evt.target.value;
			appState.ACTIVE_TAB.selections = null;
			appState.ACTIVE_TAB.updateDataTopic(dataTopic);
		});

		$("#panel-num-select").on("change", (evt) => {
			stopAnimation();
			let panelNum = evt.target.value;
			appState.ACTIVE_TAB.updatePanelNum(panelNum);
		});

		$("#stub-name-num-select").on("change", (evt) => {
			stopAnimation();
			let stubNum = parseInt(evt.target.value, 10);
			appState.ACTIVE_TAB.updateStubNameNum(stubNum);
		});

		$(document)
			.off("click", ".mapPlayButton, .animatePauseIcon")
			.on("click", ".mapPlayButton, .animatePauseIcon", () => {
				if (appState.ACTIVE_TAB.animating) {
					stopAnimation();
					return;
				}

				const allYears = document.getElementById("year-start-select").options;
				let next = appState.ACTIVE_TAB.currentTimePeriodIndex;
				const { length } = allYears;

				const moveNext = () => {
					next++;
					if (next === length) next = 0;
					appState.ACTIVE_TAB.currentTimePeriodIndex = next;
					appState.ACTIVE_TAB.updateStartPeriod(allYears[next].value);
				};
				appState.ACTIVE_TAB.animating = true;
				moveNext();
				animationInterval = setInterval(() => moveNext(), 2000);
			});

		$(document)
			.off("click", ".mapAnimateAxisPoint")
			.on("click", ".mapAnimateAxisPoint", (e) => {
				stopAnimation();
				const indexClicked = $(e.target).data("index");
				const allYears = document.getElementById("year-start-select").options;
				appState.ACTIVE_TAB.currentTimePeriodIndex = indexClicked;
				appState.ACTIVE_TAB.updateStartPeriod(allYears[indexClicked].value);
			});

		$("#year-start-select").on("change", (evt) => {
			const yrStart = evt.target.value;
			appState.ACTIVE_TAB.updateStartPeriod(yrStart);
			appState.ACTIVE_TAB.currentTimePeriodIndex = document.getElementById("year-start-select").selectedIndex;
		});

		$("#year-end-select").on("change", (evt) => {
			const yrEnd = evt.target.value;
			appState.ACTIVE_TAB.updateEndPeriod(yrEnd);
		});

		// on the map tab
		$("#unit-num-select-map").on("change", (evt) => {
			const unitNum = parseInt(evt.target.value, 10);
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
		});

		// on the chart tab
		$("#unit-num-select-chart").on("change", (evt) => {
			const unitNum = parseInt(evt.target.value, 10);
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
		});

		// on the table tab
		$("#unit-num-select-table").on("change", (evt) => {
			const unitNum = parseInt(evt.target.value, 10);
			appState.ACTIVE_TAB.updateUnitNum(unitNum);
		});

		$("#show-one-period-checkbox").on("change", (evt) => {
			stopAnimation();
			if (evt.target.checked) {
				// hide the ending period select dropdown and reposition start year container
				$("#startYearContainer").addClass("offset-3");
				$("#endYearContainer").hide();
				// set to enable bar chart
				appState.ACTIVE_TAB.resetTimePeriods();
				appState.ACTIVE_TAB.updateShowBarChart(1);
			} else {
				// show the ending period select dropdown and reposition start year container
				$("#startYearContainer").removeClass("offset-3");
				$("#endYearContainer").show();
				// set to enable line chart
				appState.ACTIVE_TAB.updateShowBarChart(0);
			}
		});

		$("#enable-CI-checkbox").on("change", (evt) => {
			let isChecked = evt.target.checked;
			if (isChecked) appState.ACTIVE_TAB.updateEnableCI(1); // set to enable bar chart
			else appState.ACTIVE_TAB.updateEnableCI(0); // set to enable line chart
		});

		const resetTopics = () => {
			$(".filterCheckbox").prop("checked", false);
			$(".clearAllFilters").hide();
			resetTopicDropdownList();
		};

		$(document).on("click", "#home-btn-reset", (event) => {
			event.stopPropagation();
			resetTopics();
			$(".timePeriodContainer").css("display", "flex");
			appState.ACTIVE_TAB.resetSelections();
			event.preventDefault();
		});

		$(document).on("keyup", ".far-legendItem", (event) => {
			var code = event.key; // recommended to use e.key, it's normalized across devices and languages
			if (code === "Enter" || code === "Space") {
				event.stopPropagation();
				// get the unique id of the legend item
				let legItem = event.target.parentNode.parentNode.id;
				console.log("legItem", legItem);
				console.log("*** legendItem clicked: event.target,item", event.target, legItem);
				appState.ACTIVE_TAB.toggleLegendItem(legItem);
				event.preventDefault();
			}
		});
		$(document).on("click", ".chart-container-svg-legendItem", (event) => {
			event.stopPropagation();
			// get the unique id of the legend item
			let legItem = event.target.parentNode.parentNode.id;
			console.log("*** legendItem clicked: event.target,item", event.target, legItem);
			appState.ACTIVE_TAB.toggleLegendItem(legItem);
			event.preventDefault();
		});

		// click Map then show Map
		$(document).on("click", "a[href='#map-tab']", () => {
			if (!$("#show-one-period-checkbox").prop("checked")) $("#show-one-period-checkbox").click();

			$(".timePeriodContainer").css("display", "none");
			$("#show-one-period-checkbox").prop("disabled", true);
		});

		$(document).on("click", "a[href='#chart-tab'], a[href='#table-tab']", () => {
			stopAnimation();
			$(".timePeriodContainer").css("display", "flex");
			$("#show-one-period-checkbox").prop("disabled", false);
		});

		$(document).on("click", "#classNBreaks", (event) => {
			let classifyBy = event.target.value;
			console.log("radio clicked: event.target,classifyBy", event.target, classifyBy);
			appState.ACTIVE_TAB.updateClassifyType(classifyBy);
		});

		$(document).on("click", "#classQuartiles", (event) => {
			let classifyBy = event.target.value;
			console.log("radio clicked: event.target,classifyBy", event.target, classifyBy);
			appState.ACTIVE_TAB.updateClassifyType(classifyBy);
		});

		$(document)
			.off("click", "#dwn-chart-img")
			.on("click", "#dwn-chart-img", () => {
				let titleChart = document.getElementById("chart-title").textContent;
				if (appState.ACTIVE_TAB.activeTabNumber === 1) {
					const params = {
						contentContainer: "chart-container",
						downloadButton: "dwn-chart-img",
						imageSaveName: titleChart,
					};
					downLoadGenChart(params);
				} else if (appState.ACTIVE_TAB.activeTabNumber === 0) {
					downLoadMap2();
				}
			});

		$(".callFiltersModal").click(() => {
			$("#filtersModal").modal("show");
		});

		$("#submitFilters").click(() => {
			if ($(".filterCheckbox:checkbox:checked").length) $(".clearAllFilters").show();
			else $(".clearAllFilters").hide();
			$("#filtersModal").modal("hide");
			updateTopicDropdownList();
		});

		$("#clearCurrentFilters, .clearAllFilters").click(() => {
			resetTopics();
		});

		ExportEvents.registerEvents();
	},

	setDownloadAriaLabel() {
		let tableText = $("#pop-factors-table-title").text();
		$("#btnPopFactorsExport").attr("aria-label", `Download Data for ${tableText}`);
	},
};
