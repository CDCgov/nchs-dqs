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

		$("#topic").on("change", (e) => {
			stopAnimation();
			let dataTopic = e.target.value;
			appState.ACTIVE_TAB.selections = null;
			appState.ACTIVE_TAB.updateTopic(dataTopic);
		});

		$("#subtopic").on("change", (e) => {
			stopAnimation();
			let subtopicId = e.target.value;
			appState.ACTIVE_TAB.updateSubtopic(subtopicId);
		});

		$("#characteristic").on("change", (e) => {
			stopAnimation();
			let stubNum = parseInt(e.target.value, 10);
			appState.ACTIVE_TAB.updateCharacteristic(stubNum);
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
				animationInterval = setInterval(() => moveNext(), 1000);
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

		$("#year-start-select").on("change", (e) => {
			const yrStart = e.target.value;
			appState.ACTIVE_TAB.updateStartPeriod(yrStart);
			appState.ACTIVE_TAB.currentTimePeriodIndex = document.getElementById("year-start-select").selectedIndex;
		});

		$("#year-end-select").on("change", (e) => {
			const yrEnd = e.target.value;
			appState.ACTIVE_TAB.updateEndPeriod(yrEnd);
		});

		// on the map tab
		$("#unit-num-select-map").on("change", (e) => {
			const yAxisUnitId = parseInt(e.target.value, 10);
			appState.ACTIVE_TAB.updateYAxisUnitId(yAxisUnitId);
		});

		// on the chart tab
		$("#unit-num-select-chart").on("change", (e) => {
			const yAxisUnitId = parseInt(e.target.value, 10);
			appState.ACTIVE_TAB.updateYAxisUnitId(yAxisUnitId);
		});

		// on the table tab
		$("#unit-num-select-table").on("change", (e) => {
			const yAxisUnitId = parseInt(e.target.value, 10);
			appState.ACTIVE_TAB.updateYAxisUnitId(yAxisUnitId);
		});

		$("#show-one-period-checkbox").on("change", (e) => {
			stopAnimation();
			if (e.target.checked) {
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

		$("#enable-CI-checkbox").on("change", (e) => {
			let isChecked = e.target.checked;
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
			e.preventDefault();
		});

		$(document).on("keyup", ".far-legendItem", (e) => {
			const code = e.key; // recommended to use e.key, it's normalized across devices and languages
			if (code === "Enter" || code === "Space") {
				e.stopPropagation();
				// get the unique id of the legend item
				let legItem = e.target.parentNode.parentNode.id;
				appState.ACTIVE_TAB.toggleLegendItem(legItem);
				e.preventDefault();
			}
		});
		$(document).on("click", ".far-legendItem", (e) => {
			e.stopPropagation();
			// get the unique id of the legend item
			const legItem = e.target.parentNode.parentNode.id;
			appState.ACTIVE_TAB.toggleLegendItem(legItem);
			e.preventDefault();
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

		$(document).on("click", "#classNBreaks", (e) => appState.ACTIVE_TAB.updateClassifyType(e.target.value));
		$(document).on("click", "#classQuartiles", (e) => appState.ACTIVE_TAB.updateClassifyType(e.target.value));

		$(document)
			.off("click", "#dwn-chart-img")
			.on("click", "#dwn-chart-img", () => {
				const chartTitle = document.getElementById("chart-title").textContent;
				if (appState.ACTIVE_TAB.activeTabNumber === 1) {
					const params = {
						contentContainer: "chart-container",
						downloadButton: "dwn-chart-img",
						imageSaveName: chartTitle,
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
			if ($(".filterCheckbox:checkbox:checked").length) {
				$(".clearAllFilters").show();
				$(".callFiltersModal").hide();
			} else $(".clearAllFilters").hide();
			$("#filtersModal").modal("hide");
			updateTopicDropdownList();
		});

		$("#clearCurrentFilters, .clearAllFilters").click(() => {
			resetTopics();
			$(".callFiltersModal").show();
		});

		ExportEvents.registerEvents();
	},
};
