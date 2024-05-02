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
		if (window.hasOwnProperty("_satellite")) {
			// Get the name of the selected tab from the hash value of the current URL.
			let currentUrl = str || window.location.href;
			let tabName = "";
			const skipLinks = ["tpitleSection", "pageFooter", "viewHistoricLink", "topOfTable", "bottomOfTable"];
			if (currentUrl.indexOf("#") > 0) {
				// let splitURL = currentUrl.split("_", 2).join("_");
				let route = currentUrl.split("#")[1];
				let liveURL = route.split("_", 2).join("_");

				let checkLinks = skipLinks.includes(liveURL);
				if (!checkLinks) {
					tabName = liveURL.trim();
					let dataObject = {};
					let { _satellite } = window;
					dataObject.ch = "NCHS";
					dataObject.pageName = "".concat(document.title, " - ").concat(tabName);
					console.info(dataObject.pageName);
					_satellite.track("pageview", dataObject);
				}
			}
		} else {
			console.info("Adobe Launch is not available on this page");
		}
	},

	triggerOmnitureInteractions(interactionData) {
		if (interactionData) interactionData = `nchs-interaction: ${interactionData}`;
		if (typeof s !== "undefined" && typeof s.tl === "function") {
			s.linkTrackVars = "prop40,prop49,prop46,prop2,prop31,channel";
			s.pageName = null;
			s.prop40 = interactionData;
			s.tl(true, "o", "NCHS: Data Query System Application");
			console.info(s.prop40);
		} else {
			console.info("Adobe Analytics library is not available on this page");
		}
	},

	triggerInteraction(eventLabel = "", eventType, eventValue) {
		if (window.hasOwnProperty("_satellite")) {
			const dataObject = {};
			const _satellite = window._satellite;
			eventType = eventType || "o";
			dataObject.ch = "NCHS";
			dataObject.pageName = document.title;
			dataObject.prop40 = eventValue;
			dataObject.label = eventLabel;
			dataObject.interactionType = eventType;
			dataObject.interactionValue = "ci-" + eventLabel + ": " + eventValue;
			console.log("DataObject: ", dataObject);
			_satellite.track("interaction", dataObject);
		}
	},
};
