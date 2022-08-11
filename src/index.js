import "./sass/styles.scss";
import { setupAppStateVars } from "./utils/appState";
//import { PageEvents } from "./eventhandlers/pageevents";
// import { DataCache } from "./utils/datacache";
// import { Utils } from "./utils/utils";
import { TabEvents } from "./eventhandlers/tabevents";
import { allowedURL } from "./utils/whitelist";
// import { Analytics } from "./eventhandlers/analytics";

// self executing function
(function () {

	// page initialization code
	// the DOM will be available
	setupAppStateVars();
	TabEvents.registerEvents(); // THIS IS WHAT CREATES FIRST MAIN PAGE

	let hash;
	if (window.location.hash) {
		hash = window.location.hash;
	} else {
		window.location.hash = "nchs-home";
		hash = "#nchs-home";
	}

	TabEvents.tabHTMLHandler(hash); // render nchs-home page

	function setFooterDate() {
		const date = moment().format("YYYY, MMMM DD");
		const dateSpan = document.getElementById("footer-citation-date");
		if (dateSpan) dateSpan.textContent = date;
	}
	setFooterDate();

	/////////////////////////////////////////////////////////////////////////////////////////////
	// If this site gets more tabs, revisit this section which is not needed with only one tab
	/////////////////////////////////////////////////////////////////////////////////////////////
	// window.addEventListener("hashchange", function () {
	// 	debugger;
	// 	if (!window.location.hash.includes("?")) {
	// 		window.appState.LAST_TAB = appState.PREV_TAB;
	// 	} else {
	// 		window.appState.LAST_TAB = window.appState.LAST_TAB;
	// 	}

	// 	let oldMainTab = appState.PREV_TAB;
	// 	let newMainTab;
	// 	let skipLinks = ["titleSection", "pageFooter", "viewHistoricLink", "topOfTable", "bottomOfTable"];

	// 	// Below, "allowedURL.includes(location.hash.slice(1).split("?")[0]"
	// 	// allows parameters to be applied without bloating the whitelist. this is for hash url navigation

	// 	let isAllowed = !!(
	// 		location.hash &&
	// 		(allowedURL.includes(location.hash.slice(1)) || allowedURL.includes(location.hash.slice(1).split("?")[0]))
	// 	);
	// 	if (location.href && location.href.includes("#")) {
	// 		newMainTab = location.href.split("#")[1].split("_")[0].split("?")[0];
	// 	}

	// 	let checkLinks = skipLinks.includes(newMainTab);
	// 	if (checkLinks) {
	// 		return;
	// 	}
	// 	let hash = location.hash && isAllowed ? location.hash : "#nchs-home";
	// 	// console.log("index: hash = " + hash);
	// 	//let navItems = document.querySelectorAll("#navButtons *");

	// 	/* check to see if we're actually changing page on a hash change before using HTMLHandler
	//        if main tab isn't changing, presumably it's a subnav changing, and HTMLHandler is
	//        unnecessary. Add additonal check if the hashchange comes from a status bar button is clicked
	//        need to pass the hash if it did */
	// 	if (isAllowed) {
	// 		if (appState.statusBarClick) {
	// 			appState.PREV_TAB = newMainTab;
	// 			TabEvents.tabHTMLHandler(hash);
	// 			appState.statusBarClick = false;
	// 		} else if (oldMainTab !== newMainTab) {
	// 			appState.PREV_TAB = newMainTab;
	// 			TabEvents.tabHTMLHandler(hash);
	// 		} else if (oldMainTab !== newMainTab) {
	// 			//Analytics.triggerOmniturePageView();
	// 		}
	// 	}
	// });

	$(document).ready(function () {
		$(".cdc-logo > a").attr("href", "https://www.cdc.gov");
	});

	// turn off focus on mouseup, enterup or spaceup.
	document.addEventListener("keyup", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			if (document.activeElement.toString() === "[object HTMLButtonElement]") {
				document.activeElement.blur();
			}
		}
	});
	document.addEventListener("mouseup", () => {
		if (document.activeElement.toString() === "[object HTMLButtonElement]") {
			document.activeElement.blur();
		}
	});
})();
