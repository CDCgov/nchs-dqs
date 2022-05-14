import { Utils } from "../utils/utils";
import { resetAppStateVars, setDeviceIndicator } from "../utils/appState";
import { Analytics } from "./analytics";
import { LandingPage } from "../tabs/landingpage";
import { PageEvents } from "./pageevents";
import { applyHash, applySelects } from "../utils/hashTab";
//import { alert } from "../components/alerts";

export const TabEvents = {
	registerEvents() {
/* 		const navButtons = [...document.querySelectorAll(".boxbtn")];
		// state report profile is now external but is nested and in order to keep its styling it is filtered out.
		let externalLinksList = ["state-profile-report", "community-profile-report"];
		let excludedNavButtons = navButtons.filter((btn) => !externalLinksList.includes(btn.id));
		const statusBarButtons = document.querySelectorAll(".status-item");
		const homeDataTrackerBtn = document.querySelectorAll(".homeBtn");
		const externalLinksBtns = document.querySelectorAll(".extLink");
		const individualPrntButton = document.querySelectorAll(".indPrtButton");

		PageEvents.addButtonsClickListers(excludedNavButtons);
		PageEvents.addButtonsClickListers(statusBarButtons);
		PageEvents.addButtonsClickListers(homeDataTrackerBtn);
		PageEvents.addButtonsClickListers(externalLinksBtns);
		PageEvents.addButtonsClickListers(individualPrntButton);
		PageEvents.addMobileHamburgerCollapse(); */
		PageEvents.tableToggle(); 
	},
	tabHTMLHandler(hash) {
		// common page elements
		const pe = {
			title: "title",
			subTitle: "subTitle",
			footnotes: "footnotes",
			links: "crossLinks",
			dTable: "dataTable",
			dButton: "dataButton",
			footerLink: "footerLink",
		};

		let hashSplit = hash.split("_");
		let mainTab = hashSplit[0].split("?")[0].substr(1);
		let subNav = hashSplit[1];
		hash = hash.split("&")[0];

		//alert();

		if (hash) appState.CURRENT_TAB = mainTab;

		//Updatecrosslinks(mainTab);
		appState.NAV_ITEM = mainTab;
		//Utils.hideCommonPageElements();
		switch (mainTab) {
			case "nchs-home":
				appState.PAGE_NAME = "Home";
				appState.ACTIVE_TAB = new LandingPage();
				appState.ACTIVE_TAB.renderTab();
				break;
			case "county-level-covid-policy":
				appState.PAGE_NAME = "State-Issued Prevention Measures at the County-Level";
				appState.NAV_ITEM_GROUP = appState.NAV_ITEM_GROUP ?? "prevention-measures-social-impact";
				appState.ACTIVE_TAB = new CountyLevelCovidPolicy();
				appState.ACTIVE_TAB.renderTab();
				footNoteDownloadNav({ type: "footnote" });
				Utils.applyFootnotes("County Level Policy");
				Utils.showCommonPageElements([pe.subTitle, pe.footnotes]);
				break;
			default:
				appState.NAV_ITEM = "nchs-home";
		}

		//Analytics.triggerOmniturePageView();
		//PageEvents.setNavBar();
		document.title = `NCHS: ${appState.PAGE_NAME}`;
		applyHash();
	},
};
