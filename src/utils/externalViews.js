export const externalViews = {
	"learn-more": {
		name: "COVID-19 Home",
		view() {
			window.location = "https://www.cdc.gov/coronavirus/2019-nCoV/index.html";
		},
	},
	"communications-resources": {
		name: "Communications Resources",
		view() {
			window.open("https://www.cdc.gov/coronavirus/2019-ncov/communication/coviddatatracker.html");
		},
	},
	"tracker-wkly-review": {
		name: "COVID Data Tracker Weekly Review",
		view() {
			window.open("https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html");
		},
	},
	"state-profile-report": {
		name: "State Profile Report",
		view() {
			window.open("https://healthdata.gov/browse?tags=covid-19-spr");
		},
	},
	"community-profile-report": {
		name: "Community Profile Report",
		view() {
			window.open("https://healthdata.gov/Health/COVID-19-Community-Profile-Report/gqxm-d9w9");
		},
	},
	vaccines: {
		name: "COVID Data Tracker Weekly Review",
		view() {
			window.open("https://www.cdc.gov/coronavirus/2019-ncov/vaccines/How-Do-I-Get-a-COVID-19-Vaccine.html");
		},
	},
};
