import { Analytics } from "./analytics";
import { externalViews } from "../utils/externalViews";
import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
// import { NULL } from "node-sass";

function addHasAnyClass() {
	$.fn.hasAnyClass = function hasAnyClass(...args) {
		for (let i = 0; i < args.length; i++) {
			let classes = args[i].split(",");
			for (let j = 0; j < classes.length; j++) {
				if (this.hasClass(classes[j])) {
					return true;
				}
			}
		}
		return false;
	};
}

function removeNavSelected() {
	$(".indPrtButton").removeClass("individualBtnSelected");
	$(".indPrtButton").removeClass("navSelectedFromSubLanding");
	$(".homeBtn").removeClass("individualBtnSelected");
	$(".parentNav").removeClass("parentboxbtnSelected");
	$(".sub-content").removeClass("active");
}

export const PageEvents = {
/* 	addButtonsClickListers(buttons) {
		const externalKeys = Object.keys(externalViews);
		buttons.forEach((button) => {
			button.addEventListener(
				"click",
				(event) => {
					event.stopPropagation();
					event.preventDefault();
					if (externalKeys.includes(event.currentTarget.dataset.tabname)) {
						let tab = externalViews[event.currentTarget.dataset.tabname];
						let interaction = `external tab view > ${tab.name}`;
						//Analytics.triggerOmnitureInteractions(interaction);
						tab.view();
					}

					let clickedTabname = externalKeys.includes(event.currentTarget.dataset.tabname)
						? appState.CURRENT_TAB
						: event.currentTarget.dataset.tabname;
					let statusBarItem = event.currentTarget.dataset.tabname;
					let clickedMainTab = clickedTabname.split("_")[0];
					appState.CURRENT_TAB = clickedMainTab;

					if (button.classList.contains("status-item")) {
						appState.statusBarClick = true;
						if (appState.NAV_ITEM === statusBarItem) {
							let interaction = `statsbar > ${appState.NAV_ITEM}`;
							Analytics.triggerOmnitureInteractions(interaction);
						}
					} else {
						window.scroll(0, 160);
						appState.hash = "";
					}
					appState.NAV_ITEM_GROUP = button.dataset.group;
					window.location.hash = clickedTabname.toLowerCase();
				},
				false
			);
		});
	}, */
	addMobileHamburgerCollapse() {
		document.querySelector("#navMenuHeaderCont").addEventListener("click", () => {
			const icon = $(".mobileMenuHamburger > i");
			if (icon.hasClass("fa-bars")) {
				$("#navButtonsLeft").css("display", "block");
				icon.addClass("fa-times").removeClass("fa-bars");
			} else {
				$("#navButtonsLeft").css("display", "none");
				icon.addClass("fa-bars").removeClass("fa-times");
			}
		});
	},
	setNavBar() {
		removeNavSelected();
		const navItem = appState.NAV_ITEM_GROUP ?? appState.NAV_ITEM;
		let selectedNavButton = document.querySelector(`#navButtonsLeft [data-tabname=${navItem}]`);
		if (selectedNavButton) {
			$(selectedNavButton).addClass("individualBtnSelected");
			$(".sub-content").css("display", "none");
			if (appState.NAV_ITEM_GROUP) $(selectedNavButton).addClass("navSelectedFromSubLanding");
		}

		if (window.matchMedia("(max-width: 1000px)").matches) {
			$("#viewDataText").text(selectedNavButton?.textContent ?? "");
			$("#navButtonsLeft").css("display", "none");
			$(".sub-content").css("display", "none");
			const icon = $(".mobileMenuHamburger > i");
			icon.addClass("fa-bars").removeClass("fa-times");
		}

		appState.NAV_ITEM_GROUP = selectedNavButton?.getAttribute("data-group");
	},
	tableToggle() {
		const toggleTable = (e) => {
			e.preventDefault();
			// dont add space bar 32 here for 508 compliance bc that is used for scrolling the page (TT)
			if (!e.keyCode || e.keyCode === 13) {
				$(e.currentTarget).children(".table-toggle-icon").children("i").toggleClass("fa-minus fa-plus");
				$(e.currentTarget).toggleClass("closed");
				$(e.currentTarget).next(".data-table").toggleClass("closed");
				const action = $(e.currentTarget).hasClass("closed") ? "closed." : "opened.";
				const tableTitle = $(e.currentTarget).children(".table-title").text();
				let interaction = `${appState.NAV_ITEM}: ${tableTitle} ${action}`;
				//Analytics.triggerOmnitureInteractions(interaction);
			}
		};

		$(document).on("click", ".table-toggle", toggleTable);
		$(document).on("keyup", ".table-toggle", toggleTable);
	},
};
