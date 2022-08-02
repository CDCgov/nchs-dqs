export const ExportEvents = {
	registerEvents() {
		let basicUSTable = document.getElementById("btnTableExport");
		if (typeof basicUSTable !== "undefined" && basicUSTable != null) {
			document.getElementById("btnTableExport").addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV();
			});
		}

		const usTrendsTable = document.getElementById("btnUSTrendsTableExport");
		if (typeof usTrendsTable !== "undefined" && usTrendsTable != null) {
			usTrendsTable.addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV();
			});
		}

		const miscRace = document.getElementById("mis-c-table-container-race");
		if (typeof miscRace !== "undefined" && miscRace != null) {
			const buttonId = "mis-c-table-button-race";
			miscRace.children[0].children[1].id = buttonId;
			miscRace.children[0].children[1].addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV(buttonId, miscRace, "race");
			});
		}
		const miscCase = document.getElementById("mis-c-table-container-case");
		if (typeof miscCase !== "undefined" && miscCase != null) {
			const buttonId = "mis-c-table-button-case";
			miscCase.children[0].children[1].id = buttonId;
			miscCase.children[0].children[1].addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV(buttonId, miscCase, "case");
			});
		}
		const miscAge = document.getElementById("mis-c-table-container-age");
		if (typeof miscAge !== "undefined" && miscAge != null) {
			const buttonId = "mis-c-table-button-age";
			miscAge.children[0].children[1].id = buttonId;
			miscAge.children[0].children[1].addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV(buttonId, miscAge, "age");
			});
		}
		const miscGender = document.getElementById("mis-c-table-container-gender");
		if (typeof miscGender !== "undefined" && miscGender != null) {
			const buttonId = "mis-c-table-button-gender";
			miscGender.children[0].children[1].id = buttonId;
			miscGender.children[0].children[1].addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV(buttonId, miscGender, "gender");
			});
		}
		const miscMap = document.getElementById("mis-c-table-container-map");
		if (typeof miscMap !== "undefined" && miscMap != null) {
			const buttonId = "mis-c-table-button-map";
			miscMap.children[0].children[1].id = buttonId;
			miscMap.children[0].children[1].addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV(buttonId, miscMap, "map");
			});
		}
		const popFactors = document.getElementById("btnPopFactorsExport");
		if (typeof popFactors !== "undefined" && popFactors != null) {
			popFactors.addEventListener("click", (evt) => {
				evt.preventDefault();
				appState.ACTIVE_TAB.exportCSV();
			});
		}
		const Vaccinations = document.getElementById("btnVaccinationsExport");
		if (typeof Vaccinations !== "undefined" && Vaccinations != null) {
			Vaccinations.addEventListener("click", (evt) => {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				appState.ACTIVE_TAB.exportCSV();
			});
		}

		const UrbanRuralData = document.getElementById("btnUrbanRuralExport");
		if (typeof UrbanRuralData !== "undefined" && UrbanRuralData != null) {
			UrbanRuralData.addEventListener("click", (evt) => {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				appState.ACTIVE_TAB.UrbanRural.exportCSV2();
			});
		}

		const vaxEquity = document.getElementById("dwnload-csv-vaccinations-vax-equity");
		if (typeof vaxEquity !== "undefined" && vaxEquity != null) {
			vaxEquity.addEventListener("click", (evt) => {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				appState.ACTIVE_TAB.VaxEquity.exportCSV();
			});
		}

		const VaccinationsCaseRate = document.getElementById("btnVaccinationsCaseRateExport");
		if (typeof VaccinationsCaseRate !== "undefined" && VaccinationsCaseRate != null) {
			VaccinationsCaseRate.addEventListener("click", (evt) => {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				appState.ACTIVE_TAB.exportCSV();
			});
		}
	},
};
