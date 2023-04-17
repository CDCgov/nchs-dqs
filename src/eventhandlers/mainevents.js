import { ExportEvents } from "./exportevents";
import { downLoadGenChart, downLoadMap2 } from "../utils/downloadimg";
import { resetTopicDropdownList, updateTopicDropdownList } from "../components/landingPage/functions";

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

		$(document).ready(() => {
			const checkbox = $("#show-one-period-checkbox");
			console.log(checkbox);
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
				appState.ACTIVE_TAB.resetSelections();
				e.preventDefault();
			});

		// click Map then show Map
		$(document).on("click", "a[href='#map-tab']", () => {
			if (!$("#show-one-period-checkbox").prop("checked")) $("#show-one-period-checkbox").click();
			$(".timePeriodContainer").css("display", "none");
			$("#show-one-period-checkbox").prop("disabled", true);
		});

		$(document).on("click", "a[href='#chart-tab'], a[href='#table-tab']", () => {
			this.stopAnimation();
			$(".timePeriodContainer").css("display", "flex");
			$("#show-one-period-checkbox").prop("disabled", false);
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
			})
			.off("click", "#submitFilters, #closeAdvancedFilters")
			.on("click", "#submitFilters, #closeAdvancedFilters", () => {
				$("#refineTopicList").attr("style", "color: #800080 !important");
				$("#filtersModal").modal("hide");
				updateTopicDropdownList();
			})
			.off("click", ".filterCheckbox")
			.on("click", ".filterCheckbox", () => {
				const windowWidth = $(window).width();
				const selected = $(".filterCheckbox:checkbox:checked").length;
				if (selected) {
					let message = "";
					if (windowWidth < 1200) {
						message = `${selected} selected`;
					} else {
						$(".filterCheckbox:checkbox:checked").each((i, el) => {
							message += $(el).parent().siblings("label").text() + " <b>OR</b> ";
						});
						message = message.slice(0, -11);
					}
					$("#filterResults").html(message);
				} else {
					$("#filterResults").html("All");
				}
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
			});

		$("#clearCurrentFilters, .clearAllFilters").click(() => {
			$("#filterResults").html("All");
			resetTopics();
			$(".callFiltersModal").show();
		});

		ExportEvents.registerEvents();
	};
}
