//import { allowedURL } from "../utils/whitelist";

export const Analytics = {
	// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript#8809472
	generateUUID() {
		let d = new Date().getTime();
		let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
		});
		return uuid;
	},

	triggerOmniturePageView(str) {
		if (typeof s !== "undefined" && typeof s.t === "function") {
			// Get the name of the selected tab from the hash value of the current URL.
			let currentUrl = str || window.location.href;
			let tabName = "";
			const skipLinks = ["titleSection", "pageFooter", "viewHistoricLink", "topOfTable", "bottomOfTable"];
/* 			if (currentUrl.indexOf("#") > 0) {
				let liveURL = currentUrl.split("#")[1];
				let isAllowed = allowedURL.includes(liveURL);
				let checkLinks = skipLinks.includes(liveURL);
				if (isAllowed && !checkLinks) {
					tabName = liveURL.trim();
					s.pageURL = currentUrl;
					s.pageName = `${document.title} - ${tabName}`;
					console.info(s.pageName);
					s.channel = "Coronavirus";
					siteCatalyst.setLevel1("ATSDR");
					siteCatalyst.setLevel2("ATSDR_DTHHS");
					siteCatalyst.setLevel3("OD");
					siteCatalyst.setLevel4("GRASP");
					siteCatalyst.setLevel5("CDC COVID Data Tracker");
					siteCatalyst.setLevel6("CDC COVID Data Tracker v1.0");
					updateVariables(s);
					s.t();
				}
			} */
		} else {
			console.info("Adobe Analytics library is not available on this page");
		}
	},

	triggerOmnitureInteractions(interactionData) {
		if (interactionData) interactionData = `cdt-interaction: ${interactionData}`;
		if (typeof s !== "undefined" && typeof s.tl === "function") {
			s.linkTrackVars = "prop40,prop49,prop46,prop2,prop31,channel";
			s.pageName = null;
			s.prop40 = interactionData;
			s.tl(true, "o", "CDC COVID Data Tracker");
			console.info(s.prop40);
		} else {
			console.info("Adobe Analytics library is not available on this page");
		}
	},
};
