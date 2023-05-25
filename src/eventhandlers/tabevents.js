import { LandingPage } from "../tabs/landingpage";
import { PageEvents } from "./pageevents";

export const TabEvents = {
	registerEvents() {
		PageEvents.tableToggle();
		PageEvents.closeDropdowns();
		PageEvents.screenWidthChange();
	},
	tabHTMLHandler(hash) {
		let hashSplit = hash.split("_");
		let mainTab = hashSplit[0].split("?")[0].substr(1);
		hash = hash.split("&")[0];

		appState.CURRENT_TAB = mainTab;

		appState.NAV_ITEM = mainTab;
		switch (mainTab) {
			case "nchs-home":
				appState.PAGE_NAME = "Home";
				appState.ACTIVE_TAB = new LandingPage();
				appState.ACTIVE_TAB.renderTab();
				break;
			default:
				appState.NAV_ITEM = "nchs-home";
		}

		document.title = "NCHS: Data Query System";
	},
};
