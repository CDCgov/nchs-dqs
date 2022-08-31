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
		$(".cdc-logo > a").attr({
			href: "https://www.cdc.gov",
			target: "_blank",
		});
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
