import { ExportEvents } from "../../eventhandlers/exportevents";
import { setCurrentSliderDomain } from "./dataTable";
import { getCurrentSliderDomain } from "../../components/general/genTrendsSlider";

export const dataTableUREvents = {
	registerEvents() {
		$('input[name="currentLocation"]').change(() => {
			setCurrentSliderDomain(
				getCurrentSliderDomain("#urbanRuralChartEquity")
			);
		});
		ExportEvents.registerEvents();
	},
};

//appState.ACTIVE_TAB.