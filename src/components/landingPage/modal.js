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
		text: "National Health Interview Survey",
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
					<label for="${mt.id}">${mt.text}</label>
				</div>`)
		);
	return htmlArray.join("");
};

export const modal = `
	<div class="modal fade" id="filtersModal" tabindex="-1" role="dialog">
	    <div class="modal-dialog" role="document">
	        <div class="modal-content" aria-describedby="modalLabel">
	            <div class="modal-header text-center d-block">
	                <h4 aria-hidden="false" tabindex="0" id="modalLabel">Advanced Filter for Topic</h4>
	                <button type="button" class="close" data-bs-dismiss="modal" aria-label="close advanced filters modal"  aria-hidden="false"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <div class="modal-body" aria-hidden="false">
					<div class="row">
						${topicsHtml()}
					</div>
	            </div>
				<div class="modal-footer text-center d-block">
					<button id="clearCurrentFilters" class="btn-sm btn-danger" aria-hidden="false">Clear Selections</button>
					<button id="submitFilters" class="btn-sm btn-primary" aria-hidden="false">Submit Filters</button>
				</div>
	        </div>
	    </div>
	</div>
`;

export const allFilters = modalTopics.map((t) => t.id.replace("filter", ""));
