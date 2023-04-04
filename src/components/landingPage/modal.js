const modalGroups = [
	{
		group: "demographic",
		header: `<div class="col-12 heading6">Demographic</div><hr />`,
		itemLayout: "col-xs-12, col-md-6",
	},
	{
		group: "socioeconomic",
		header: `<div class="col-xs-12 col-md-6 col-xl-12">Socio-economic</div><hr />`,
		itemLayout: "col-xs-12, col-md-6",
	},
	{
		group: "geographic",
		header: `<div class="col-xs-12 col-md-6 col-xl-12">Socio-economic</div><hr />`,
		itemLayout: "col-xs-12, col-md-6",
	},
	{
		group: "dataSystems",
		header: `<div class="col-12">Data Systems</div><hr />`,
		itemLayout: "col-12",
	},
];

const modalTopics = [
	{
		id: "filterIndian",
		text: "American Indian or Alaska Native",
		group: "demographic1",
	},
	{
		id: "filterAsian",
		text: "Asian",
		group: "demographic1",
	},
	{
		id: "filterAsianPacific",
		text: "Asian or Pacific Islander",
		group: "demographic1",
	},
	{
		id: "filterBlack",
		text: "Black or African American",
		group: "demographic1",
	},
	{
		id: "filterHispanic",
		text: "Hispanic or Latino",
		group: "demographic1",
	},
	{
		id: "filterMultipleRace",
		text: "Multiple Race",
		group: "demographic1",
	},
	{
		id: "filterHawaiian",
		text: "Native Hawaiian or Other Pacific Islander",
		group: "demographic1",
	},
	{
		id: "filterWhite",
		text: "White",
		group: "demographic1",
	},
	{
		id: "filterInfants",
		text: "Infants",
		group: "demographic2",
	},
	{
		id: "filterChildren",
		text: "Children and Adolescents",
		group: "demographic2",
	},
	{
		id: "filterAdults",
		text: "Adults",
		group: "demographic2",
	},
	{
		id: "filterOlder",
		text: "Older Adults",
		group: "demographic2",
	},
	{
		id: "filterMale",
		text: "Male",
		group: "demographic2",
	},
	{
		id: "filterFemale",
		text: "Female",
		group: "demographic2",
	},
	{
		id: "filterFuncLimitStatus",
		text: "Disability (Functional limitation Status)",
		group: "demographic2",
	},
	{
		id: "filterMarital",
		text: "Marital Status",
		group: "demographic2",
	},
	{
		id: "filterEducation",
		text: "Education",
		group: "socioeconomic",
	},
	{
		id: "filterInsuranceStatus",
		text: "Health Insurance Status",
		group: "socioeconomic",
	},
	{
		id: "filterPoverty",
		text: "Poverty Status",
		group: "socioeconomic",
	},
	{
		id: "filterMetropolitan",
		text: "Metropolitan and nonmetropolitan",
		group: "geographic",
	},
	{
		id: "filterRegion",
		text: "Region",
		group: "geographic",
	},
	{
		id: "filterSVI",
		text: "Social Vulnerability Index",
		group: "geographic",
	},
	{
		id: "filterHUS",
		text: "Health, United States (HUS)",
		group: "dataSystems",
	},
	{
		id: "filterNCHS",
		text: "National Center for Health Statistics (NCHS)",
		group: "dataSystems",
	},
	{
		id: "filterNHANES",
		text: "National Health and Nutrition Examination Survey (NHANES)",
		group: "dataSystems",
	},
	{
		id: "filterNHIS",
		text: "National Health Interview Survey (NHIS)",
		group: "dataSystems",
	},
	{
		id: "filterNHAMCS",
		text: "National Hospital Ambulatory Medical Care Survey (NHAMCS)",
		group: "dataSystems",
	},
];

const buildSelections = (group) => {
	let html = [];
	group.forEach((d) => {
		html.push(`
				<div class="nowrap flexRow left">
					<span><input type="checkbox" class="filterCheckbox selectableIcon" id="${d.id}" /></span>
					<label for="${d.id}">${d.text}</label>
				</div>`);
	});
	return html.join("");
};

const topicsHtml = () => {
	return `
	<!-- Demographics -->
	<div class="col-xs-12 col-xl-5">
		<div class="row">
			<div class="col-12 heading6">
				<div>Demographic</div>
			</div>
			<div class="col-xs-12 col-md-6">
				${buildSelections(modalTopics.filter((mt) => mt.group === "demographic1"))}
			</div>
			<div class="col-xs-12 col-md-6">
				${buildSelections(modalTopics.filter((mt) => mt.group === "demographic2"))}
			</div>
		</div>
	</div>
	<!-- Socioeconomic -->
	<div class="col-md-12 col-xl-3">
		<div class="row">
			<div class="col-xs-12 col-md-6 col-xl-12">
				<div class="col-12 heading6">
					<div>Socio-economic</div>
				</div>
				${buildSelections(modalTopics.filter((mt) => mt.group === "socioeconomic"))}
			</div>
			<!-- Geographic -->
			<div class="col-xs-12 col-md-6 col-xl-12">
				<div class="col-12 heading6">
					<div>Geographic</div>
				</div>
				${buildSelections(modalTopics.filter((mt) => mt.group === "geographic"))}
			</div>
		</div>
	</div>
	<!-- Data Systems -->
	<div class="col-xs-12 col-xl-4">
		<div class="row">
			<div class="col-12 heading6">
				<div>Data Systems</div>
			</div>
			${buildSelections(modalTopics.filter((mt) => mt.group === "dataSystems"))}
		</div>
	</div>`;
};

export const modal = `
	<div class="modal fade" id="filtersModal" tabindex="-1" role="dialog">
	    <div class="modal-dialog" role="document">
	        <div class="modal-content" aria-describedby="modalLabel">
	            <div class="modal-header text-center d-block">
	                <h4 aria-hidden="false" tabindex="0" id="modalLabel" class="heading5">Refine Topic List</h4>
					<h5 class="body2" style="margin-top: -4px !important;" tabindex="0">Select one or more:</h5>
	                <button id="closeAdvancedFilters" type="button" class="close" data-bs-dismiss="modal" aria-label="close refine topic list modal"  aria-hidden="false"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <div class="modal-body" aria-hidden="false">
					<div class="row">
						${topicsHtml()}
					</div>					
	            </div>
				<div id="filterModalFooter" class="modal-footer text-center d-block">
					<div id="refineInfoRow" class="flexRow">
						<i id="refineInfoIcon" class="fas fa-info-circle" style="font-size: 24px; margin-right: 6px"></i>
						<div>Show results for: <span id="filterResults">All</span></div>
					</div>
					<button id="clearCurrentFilters" aria-hidden="false">Clear Selections</button>
					<button id="submitFilters" aria-hidden="false">Submit Filters</button>
				</div>
	        </div>
	    </div>
	</div>
`;

export const allFilters = modalTopics.map((t) => t.id.replace("filter", ""));
