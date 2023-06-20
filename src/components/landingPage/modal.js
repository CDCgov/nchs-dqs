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
	// {
	// 	id: "filterNCHS",
	// 	text: "National Center for Health Statistics (NCHS)",
	// 	group: "dataSystems",
	// },
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

const filterByTypeHtml = () => {
	return `
		<div class="col-md-4 col-xs-12 heading5">1. Select a filter category:</div>
		<div class="col-md-8 col-xs-12 filter-buttons-wrap">
			<button class="btn selection-button selected"
				data-id="population-characteristics">Population Characterisics</button><button class="btn selection-button"
				data-id="data-systems">Sources</button>
		</div>
	`;
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
		</div>
	</div>
	<!-- Geographic -->
	<div class="col-md-12 col-xl-3">
		<div class="row">
			<div class="col-xs-12 col-md-6 col-xl-12">
				<div class="col-12 heading6">
					<div>Geographic</div>
				</div>
				${buildSelections(modalTopics.filter((mt) => mt.group === "geographic"))}
			</div>
		</div>
	</div>
	`;
};

const dataSystemsHtml = () => {
	return `
		<!-- Data Systems -->
		<div class="col-xs-12 col-xl-6" style="margin: 0 auto">
			<div class="row">
				<div class="col-12 heading6">
					<div>Sources</div>
				</div>
				${buildSelections(modalTopics.filter((mt) => mt.group === "dataSystems"))}
			</div>
		</div>`;
};

export const filterHtml = ({ topicCount = 0 }) => {
	const selected = $(".filterCheckbox:checkbox:checked").length;

	if (selected) {
		let filterResults = "";
		$(".filterCheckbox:checkbox:checked").each((i, el) => {
			filterResults += `<span class="badge rounded-pill">
				${$(el).parent().siblings("label").text()}
				<button type="button" class="btn-close remove-filter-pill" aria-label="Close" data-id="${$(el).attr("id")}"></button>
			</span>`;
		});

		return `
			<div class="filter-text">There are <strong>
				<span id="filter-summary-count">${topicCount}</span> topics available</strong> 
			relating to <strong>any</strong> of these filters:</div>
			<div id="filter-results">${filterResults}</div>
		`;
	}

	return `
		<div class="filter-text">There are <strong><span id="filter-summary-count">
				${topicCount}
		</span> topics available</strong> with <strong>0</strong> filters applied.</div>
		<div class="text-center" style="font-size: 14px">Please select filters to proceed with advanced topic selection.</div>
	`;
};

const clearFilters = () => {
	$(".filterCheckbox").prop("checked", false);
	$("#filter-summary-content").html(filterHtml({ topicCount: $("#topicDropdown-select .genDropdownOption").length }));
};

export const modal = `
	<div class="modal fade" id="filtersModal" tabindex="-1" role="dialog">
	    <div class="modal-dialog" role="document">
	        <div class="modal-content" aria-describedby="modalLabel">
	            <div class="modal-header text-center d-block">
	                <h4 aria-hidden="false" tabindex="0" id="modalLabel" class="heading5"><strong>Advanced Topic Selection</strong></h4>
	                <button id="closeAdvancedFilters" type="button" class="close" data-bs-dismiss="modal" aria-label="close Advanced Topic Selection modal"  aria-hidden="false"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <div class="modal-body refine-topics" aria-hidden="false">
					<div class="row">
						${filterByTypeHtml()}
					</div>
					<hr />
					<div class="col-xs-12">
						<span class="heading5">2. Select filter(s) to help refine your topic selection:</span>
						<div class="float-right"><a href="#" class="clear-all-filters">Clear All Filters</a></div>
					</div>
					<div class="row toggle-display" data-id="population-characteristics" aria-hidden="false">
						${topicsHtml()}
					</div>
					<div class="row toggle-display" data-id="data-systems" style="display: none" aria-hidden="true">
						${dataSystemsHtml()}
					</div>

					<hr />

					<div class="row filter-summary">
						<div class="text-center filter-header">Your Filter Summary</div>
						<div id="filter-summary-content">${filterHtml({})}</div>
					</div>
	            </div>
				<div id="filterModalFooter" class="modal-footer">
					<span class="heading5">3. Apply changes to the topic dropdown:</span>
					<button id="submitFilters" aria-hidden="false">Apply</button>
				</div>
	        </div>
	    </div>
	</div>
`;

$(() => {
	$(".modal .selection-button").on("click", (elem) => {
		const displayItem = elem.currentTarget.getAttribute("data-id");
		$(".toggle-display").hide();
		$(".selection-button").removeClass("selected");
		$(`.toggle-display[data-id="${displayItem}"]`).show();
		$(`.selection-button[data-id="${displayItem}"]`).addClass("selected");

		clearFilters();
	});

	$(".modal .clear-all-filters").on("click", () => {
		clearFilters();
	});
});

export const allFilters = modalTopics.map((t) => t.id.replace("filter", ""));
