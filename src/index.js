import "./sass/styles.scss";
import { setupAppStateVars } from "./utils/appState";
import { TabEvents } from "./eventhandlers/tabevents";
// import { Analytics } from "./eventhandlers/analytics";

// self executing function
(() => {
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

	$(() => {
		console.log("jquery init method?");

		$(".cdc-logo > a").attr({
			href: "https://www.cdc.gov",
			target: "_blank",
		});

		//check for satellite object
		console.log(window);
		if (window.hasOwnProperty("_satellite")) {
			console.log("check for satellite object successful");
			var dataObject = {};
			var _satellite = window._satellite;
			dataObject.ch = "NCHS";
			dataObject.pageName = document.title;
			dataObject.prop8 = "Web Page";
			_satellite.track("pageview", dataObject);
		}
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
