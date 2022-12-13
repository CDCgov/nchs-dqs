import { topicLookup } from "./config";

const modalTopics = [
	{
		id: "filterAdults",
		text: "Adults",
	},
	{
		id: "filterFuncLimitStatus",
		text: "Functional limitation Status",
	},
	{
		id: "filterHawaiian",
		text: "Native Hawaiian or Other Pacific Islander",
	},
	{
		id: "filterIndian",
		text: "American Indian or Alaska Native",
	},
	{
		id: "filterInsuranceStatus",
		text: "Health Insurance Status",
	},
	{
		id: "filterOlder",
		text: "Older Adults",
	},
	{
		id: "filterAsian",
		text: "Asian",
	},
	{
		id: "filterHispanic",
		text: "Hispanic or Latino",
	},
	{
		id: "filterPoverty",
		text: "Poverty Status",
	},
	{
		id: "filterAsianPacific",
		text: "Asian or Pacific Islander",
	},
	{
		id: "filterInfants",
		text: "Infants",
	},
	{
		id: "filterRegion",
		text: "Region",
	},
	{
		id: "filterBlack",
		text: "Black or African American",
	},
	{
		id: "filterMale",
		text: "Male",
	},
	{
		id: "filterWhite",
		text: "White",
	},
	{
		id: "filterChildren",
		text: "Children and Adolescents",
	},
	{
		id: "filterMarital",
		text: "Marital Status",
	},
	{
		id: "filterEducation",
		text: "Education",
	},
	{
		id: "filterMetropolitan",
		text: "Metropolitan and nonmetropolitan",
	},
	{
		id: "filterFemale",
		text: "Female",
	},
	{
		id: "filterMultipleRace",
		text: "Multiple Race",
	},
	{
		id: "filterInterview",
		text: "Health Interview Survey",
	},
	{
		id: "filterNHIS",
		text: "NHIS",
	},
];
const topicsHtml = () => {
	const htmlArray = [];
	modalTopics
		.sort((a, b) => a.text.localeCompare(b.text))
		.forEach((mt) =>
			htmlArray.push(`
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="${mt.id}" />
					<label for="filterAdults">${mt.text}</label>
				</div>`)
		);
	return htmlArray.join("");
};

export const modal = `
	<div id="filtersModal" class="ui modal">
		<div class="header" style="text-align: center">
			Advanced Filter for Topic
	        <div class="actions" style="float: right">
				<div class="ui cancel" aria-label="Close" aria-hidden="true"><i class="fa fa-times"></i></div>
			</div>
	    </div>
	    <div class="description padding-descrp">
			<div class="row">
				${topicsHtml()}
			</div>
	    </div>
		<div id="filterModalFooter">
			<button id="clearCurrentFilters" class="btn-sm btn-danger">Clear Selections</button>
			<button id="submitFilters" class="btn-sm btn-primary">Submit Filters</button>
		</div>
	</div>
`;

export const allFilters = modalTopics.map((t) => t.id.replace("filter", ""));
