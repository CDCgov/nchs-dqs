import { ExportEvents } from "./exportevents";
import { downLoadGenChart, downLoadMap2 } from "../utils/downloadimg";
import {
	resetTopicDropdownList,
	updateTopicDropdownList,
	getSelectedTopicCount,
} from "../components/landingPage/functions";

import { filterHtml } from "../components/landingPage/modal";

export class MainEvents {
	constructor(animationInterval) {
		this.animationInterval = animationInterval;
	}

	stopAnimation = () => {
		clearInterval(this.animationInterval);
		$("#animatePlayIcon").css("fill", "white");
		$(".animatePauseIcon").css("fill", "none");
		appState.ACTIVE_TAB.animating = false;
		$("#mapPlayButtonContainer").hide();
	};

	playAnimation = () => {
		if (appState.ACTIVE_TAB.animating) {
			this.stopAnimation();
			return;
		}

		const allYears = appState.ACTIVE_TAB.allYearsOptions;
		let next = appState.ACTIVE_TAB.currentTimePeriodIndex;
		const { length } = allYears;

		const moveNext = (restart) => {
			if (!restart && next === 0) {
				this.stopAnimation();
				return;
			}
			next++;
			if (next === length) next = 0;
			const { value } = allYears[next];
			appState.ACTIVE_TAB.updateStartPeriod(value);
			appState.ACTIVE_TAB.updateStartTimePeriodDropdown(value);
		};
		appState.ACTIVE_TAB.animating = true;
		moveNext(next === 0);
		this.animationInterval = setInterval(() => moveNext(), 1000);
	};

	registerEvents = () => {
		$(document)
			.off("click", "#mapBackward")
			.on("click", "#mapBackward", () => {
				this.stopAnimation();
				const { currentTimePeriodIndex, allYearsOptions } = appState.ACTIVE_TAB;
				const nextIndex =
					currentTimePeriodIndex === 0 ? allYearsOptions.length - 1 : currentTimePeriodIndex - 1;
				const { value } = allYearsOptions[nextIndex];
				appState.ACTIVE_TAB.updateStartPeriod(value);
				appState.ACTIVE_TAB.updateStartTimePeriodDropdown(value);
			})
			.off("click", "#mapForward")
			.on("click", "#mapForward", () => {
				this.stopAnimation();
				const { currentTimePeriodIndex, allYearsOptions } = appState.ACTIVE_TAB;
				const nextIndex =
					currentTimePeriodIndex === allYearsOptions.length - 1 ? 0 : currentTimePeriodIndex + 1;
				const { value } = allYearsOptions[nextIndex];
				appState.ACTIVE_TAB.updateStartPeriod(value);
				appState.ACTIVE_TAB.updateStartTimePeriodDropdown(value);
			})
			.off("click", ".mapPlayButton, .animatePauseIcon")
			.on("click", ".mapPlayButton, .animatePauseIcon", () => {
				this.playAnimation();
			})
			.on("keypress enter", ".mapPlayButton, .animatePauseIcon", () => {
				this.playAnimation();
			});

		$(document)
			.off("click", ".mapAnimateAxisPoint")
			.on("click", ".mapAnimateAxisPoint", (e) => {
				this.stopAnimation();
				const indexClicked = $(e.target).data("index");
				const { value } = appState.ACTIVE_TAB.allYearsOptions[indexClicked];
				appState.ACTIVE_TAB.updateStartPeriod(value);
				appState.ACTIVE_TAB.updateStartTimePeriodDropdown(value);
			});

		$("#show-one-period-checkbox").on("change", (e) => {
			this.stopAnimation();
			if (e.target.checked) {
				// hide the ending period select dropdown and reposition start year container
				// $("#startYearContainer").addClass("offset-3");
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

		// on load check if 'view single period' is checked or not to adjust <label> display
		$(document).ready(() => {
			const checkbox = $("#show-one-period-checkbox");
			if (checkbox?.length && checkbox[0].checked) {
				$("#startYearContainer-label").html("");
				$("#startYearContainer").removeClass("offset-3");
			}
		});

		$(document)
			.off("click", "#confidenceIntervalSlider")
			.on("click", "#confidenceIntervalSlider", (e) => {
				const { checked } = e.currentTarget;
				if (checked) appState.ACTIVE_TAB.updateEnableCI(1); // set to enable bar chart
				else appState.ACTIVE_TAB.updateEnableCI(0); // set to enable line chart
			})
			.off("click", "#showAllSubgroupsSlider")
			.on("click", "#showAllSubgroupsSlider", (e) => {
				appState.ACTIVE_TAB.renderDataVisualizations(e.currentTarget);
			})
			.off("click", "#mapBinningSlider")
			.on("click", "#mapBinningSlider", (e) => {
				const { checked } = e.currentTarget;
				appState.ACTIVE_TAB.updateBinningMethod(checked);
			});

		const resetTopics = () => {
			$(".filterCheckbox").prop("checked", false);
			$(".clearAllFilters").hide();
			$("#refineTopicList").attr("style", "");
			resetTopicDropdownList();
		};

		$(document)
			.off("click", "#home-btn-reset")
			.on("click", "#home-btn-reset", (e) => {
				e.stopPropagation();
				resetTopics();
				$(".timePeriodContainer").css("display", "flex");
				// check if notes footer has been closed and expand if it is
				if ($(".table-toggle-icon").children("i").hasClass("fa-plus")) {
					$(".table-toggle-icon").children("i").toggleClass("fa-minus fa-plus");
					$(".footer-table-toggle").toggleClass("closed");
					$("#pageFooter").toggleClass("closed");
				}
				appState.ACTIVE_TAB.resetSelections();
				e.preventDefault();
			});

		// click Map then show Map
		$(document).on("click", "a[href='#map-tab']", () => {
			if (!$("#show-one-period-checkbox").prop("checked")) {
				$("#show-one-period-checkbox").click();
			}
			$(".timePeriodContainer").css("display", "none");
			$("#show-one-period-checkbox").prop("disabled", true);
		});

		$(document).on("click", "a[href='#chart-tab'], a[href='#table-tab']", () => {
			this.stopAnimation();
			$(".timePeriodContainer").css("display", "flex");
			$("#show-one-period-checkbox").prop("disabled", false);
			if (!$("#show-one-period-checkbox").prop("checked") && $("#startYearContainer-label").text() === "") {
				$("#startYearContainer-label").html("From");
			}
		});

		$(document)
			.off("click", "#dwn-chart-img")
			.on("click", "#dwn-chart-img", () => {
				const chartTitle = document.getElementById("chart-title").textContent;
				if (appState.ACTIVE_TAB.activeTabNumber === 1) {
					const params = {
						contentContainer: "chartContainer",
						downloadButton: "dwn-chart-img",
						imageSaveName: chartTitle,
					};
					downLoadGenChart(params);
				} else if (appState.ACTIVE_TAB.activeTabNumber === 0) {
					downLoadMap2();
				}
			})
			.off("click keypress", "#refineTopicList")
			.on("click keypress", "#refineTopicList", (e) => {
				if (e.type === "keypress" && e.key !== "Enter") return;
				$("#filtersModal").modal("show");

				const selectedFilters = $(".filterCheckbox:checked")
					.map((i, el) => el.id.replace("filter", ""))
					.toArray();

				appState.PREVIOUS_FILTERS = selectedFilters;
				const topicCount =
					selectedFilters.length === 0
						? $("#topicDropdown-select .genDropdownOption").length
						: getSelectedTopicCount();

				$("#filter-summary-content").html(filterHtml({ topicCount }));
			})
			.off("click", "#submitFilters")
			.on("click", "#submitFilters", () => {
				$("#refineTopicList").attr("style", "color: #800080 !important");
				$("#filtersModal").modal("hide");
				updateTopicDropdownList();
			})
			.off("click", "#closeAdvancedFilters")
			.on("click", "#closeAdvancedFilters", () => {
				$("#refineTopicList").attr("style", "color: #800080 !important");
				$("#filtersModal").modal("hide");
				$(".filterCheckbox").prop("checked", false);

				// since I closed without applying filters, restore the previous state (if any)
				if (appState.PREVIOUS_FILTERS && appState.PREVIOUS_FILTERS.length > 0) {
					appState.PREVIOUS_FILTERS.forEach((filterId) => $(`#filter${filterId}`).prop("checked", true));
				}
			})
			.off("click", ".filterCheckbox")
			.on("click", ".filterCheckbox", () => {
				const selectedFilters = $(".filterCheckbox:checked")
					.map((i, el) => el.id.replace("filter", ""))
					.toArray();

				const topicCount =
					selectedFilters.length === 0
						? $("#topicDropdown-select .genDropdownOption").length
						: getSelectedTopicCount();

				$("#filter-summary-content").html(filterHtml({ topicCount }));
			})
			.off("click keyup", ".viewFootnotes")
			.on("click keyup", ".viewFootnotes", (e) => {
				if (!e.key || (e.type === "keyup" && e.key === "Enter")) {
					e.stopPropagation();
					document.getElementById("pageFooterTable").scrollIntoView();
					if ($("#pageFooterTable .table-toggle").hasClass("closed"))
						$("#pageFooterTable .table-toggle").trigger("click");
				}
			})
			.off("click keyup tap", ".viewSelectorsToggle")
			.on("click keyup tap", ".viewSelectorsToggle", (e) => {
				if (!e.key || (e.type === "keyup" && e.key === "Enter")) {
					const { classList } = e.currentTarget;
					if (classList.contains("viewSelectorsClosed")) {
						$(".hideShowViewSelectors").css("display", "flex");
						$(".viewSelectorsToggle > div").html("Hide Options");
						classList.remove("viewSelectorsClosed");
					} else {
						$(".hideShowViewSelectors").css("display", "none");
						$(".viewSelectorsToggle > div").html("View Options");
						classList.add("viewSelectorsClosed");
					}
				}
			})
			.on("click", ".remove-filter-pill", (e) => {
				$(`#${$(e.currentTarget).attr("data-id")}`).click();
			});

		$("#clearCurrentFilters, .clearAllFilters").click(() => {
			$("#filterResults").html("All");
			resetTopics();
			$(".callFiltersModal").show();
			$("#filter-summary-content").html(
				filterHtml({ topicCount: $("#topicDropdown-select .genDropdownOption").length })
			);
			appState.PREVIOUS_FILTERS = null;
		});

		ExportEvents.registerEvents();
	};
}
