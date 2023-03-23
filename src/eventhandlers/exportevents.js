export const ExportEvents = {
	registerEvents() {
		let basicUSTable = document.getElementById("btnTableExport");
		if (typeof basicUSTable !== "undefined" && basicUSTable != null) {
			document.getElementById("btnTableExport").addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV();
			});
		}
	},
};
