// initialize a global object "appState" scoped to window
// call it in any javascript simply by appState.someVariableName or appState["someVariableName"]
window.appState = {};

const setDeviceIndicator = () => {
	let doc = window.document;
	let el, deviceType;
	if (window.getComputedStyle && doc.querySelector) {
		el = doc.querySelector("#device-indicator");
		deviceType = window.getComputedStyle(el, ":after").getPropertyValue("content");
	}
	return deviceType.replace(/"/g, "");
};

export function setupAppStateVars() {
	appState.currentDeviceType = setDeviceIndicator();
}
