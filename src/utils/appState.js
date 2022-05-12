window.appState = {};
// For Internet Explorer, set key in appState to redirect to unsupported browser page
appState.IE_DETECTED = false;
let ua = window.navigator.userAgent;
let isIE = /MSIE|Trident/.test(ua);
if (isIE) appState.IE_DETECTED = true;
export function setupAppStateVars() {
	appState.globalMap = {};
	//* *******  WIDGETS  **********\\
	// Top level var's - Only one widget can be maximized at a time
	appState.WIDGET_MAXIMIZED = false;
	appState.MAXIMIZED_BUTTON; // 508 - Needed for ESC key
	// not using tabs yet
	//appState.CURRENT_TAB; // current tab name
	//appState.PREVIOUS_TAB; // previous tab name
	appState.RedrawTimer;
	appState.downloadBarStart = null;
	appState.statusBarClick = false;
	appState.hideFooter = false;
	appState.panel_notes = [];
}
export function resetAppStateVars() {
	appState.WIDGET_MAXIMIZED = false;
	appState.MAXIMIZED_BUTTON = null; // 508 - Needed for ESC key
	appState.CURRENT_TAB = "";
	appState.RedrawTimer = null;
}

export function setDeviceIndicator() {
	let doc = window.document;
	let el, deviceType;
	if (window.getComputedStyle && doc.querySelector) {
		el = doc.querySelector("#device-indicator");
		deviceType = window.getComputedStyle(el, ":after").getPropertyValue("content");
	}

	appState.currentDeviceType = deviceType.replace(/"/g, "");
}
