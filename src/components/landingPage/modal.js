const modalTopics = [
	{
		id: "filterIndian",
		text: "American Indian or Alaska Native",
	},
	{
		id: "filterInfants",
		text: "Infants",
	},
	{
		id: "filterFuncLimitStatus",
		text: "Functional limitation Status",
	},
	{
		id: "filterAsian",
		text: "Asian",
	},
	{
		id: "filterChildren",
		text: "Children and Adolescents",
	},
	{
		id: "filterInsuranceStatus",
		text: "Health Insurance Status",
	},
	{
		id: "filterAsianPacific",
		text: "Asian or Pacific Islander",
	},
	{
		id: "filterAdults",
		text: "Adults",
	},
	{
		id: "filterMarital",
		text: "Marital Status",
	},
	{
		id: "filterBlack",
		text: "Black or African American",
	},
	{
		id: "filterOlder",
		text: "Older Adults",
	},
	{
		id: "filterPoverty",
		text: "Poverty Status",
	},
	{
		id: "filterHispanic",
		text: "Hispanic or Latino",
	},
	{
		id: "filterMale",
		text: "Male",
	},
	{
		id: "filterMetropolitan",
		text: "Metropolitan and nonmetropolitan",
	},
	{
		id: "filterMultipleRace",
		text: "Multiple Race",
	},
	{
		id: "filterFemale",
		text: "Female",
	},
	{
		id: "filterRegion",
		text: "Region",
	},
	{
		id: "filterHawaiian",
		text: "Native Hawaiian or Other Pacific Islander",
	},
	{
		id: "blank1",
		text: "",
	},
	{
		id: "filterEducation",
		text: "Education",
	},
	{
		id: "filterWhite",
		text: "White",
	},
	// {
	// 	id: "filterInterview",
	// 	text: "National Health Interview Survey",
	// },
];
const topicsHtml = () => {
	const htmlArray = [];
	modalTopics.forEach((mt) => {
		if (mt.id === "blank1")
			htmlArray.push(`
				<div class="col-md-4 nowrap flexRow left">&nbsp;</div>`);
		else
			htmlArray.push(`
				<div class="col-md-4 nowrap flexRow left">
					<input type="checkbox" class="filterCheckbox selectableIcon" id="${mt.id}" />
					<label for="${mt.id}">${mt.text}</label>
				</div>`);
	});

	return htmlArray.join("");
};

export const modal = `
	<div class="modal fade" id="filtersModal" tabindex="-1" role="dialog">
	    <div class="modal-dialog" role="document">
	        <div class="modal-content" aria-describedby="modalLabel">
	            <div class="modal-header text-center d-block">
	                <h4 aria-hidden="false" tabindex="0" id="modalLabel" class="heading4">Refine Topic List</h4>
					<h5 class="body2" tabindex="0"><b>Select one or more</b></h5>
	                <button id="closeAdvancedFilters" type="button" class="close" data-bs-dismiss="modal" aria-label="close refine topic list modal"  aria-hidden="false"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <div class="modal-body" aria-hidden="false">
					<div class="row">
						<div class="col-md-4 heading6">Race</div>
						<div class="col-md-4 heading6">Age/Sex</div>
						<div class="col-md-4 heading6">Status/Location</div>
					</div>
					<div class="row">
						${topicsHtml()}
					</div>
	            </div>
				<div class="modal-footer text-center d-block">
					<div id="refineInfoRow" class="flexRow">
						<i id="refineInfoIcon" class="fas fa-info-circle" style="font-size: 24px; margin-right: 6px"></i>
						<div>Show results for: <span id="filterResults">All.</span></div>
					</div>
					<button id="clearCurrentFilters" class="btn-sm btn-danger" aria-hidden="false">Clear Selections</button>
					<button id="submitFilters" class="btn-sm btn-primary" aria-hidden="false">Submit Filters</button>
				</div>
	        </div>
	    </div>
	</div>
`;

export const allFilters = modalTopics.map((t) => t.id.replace("filter", ""));
