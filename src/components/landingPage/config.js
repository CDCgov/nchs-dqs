import { modal, allFilters } from "./modal";
import { nhisHash, nhisTopics } from "./nhis";

const nhisFilters = `Interview, ${allFilters.filter((a) => a !== "Children" && a !== "Infants").join(",")}`;

export const chartAndTableSelectors = `
	<div id="chart-table-selectors">
		<div>
			<div id="subGroupsSelectorsSection">
				<label for="showAllSubgroupsSlider" class="tableSliderLabel">Show All Subgroups</label>
				<label class="switch">
					<input id="showAllSubgroupsSlider" tabindex="0" type="checkbox" aria-label="show all subgroups">
					<span class="slider round"></span>
				</label>
			</div>				
			<div id="ciTableSlider">
				<label for="confidenceIntervalSlider" class="tableSliderLabel">Show Confidence Interval</label>					
				<label class="switch">
					<input id="confidenceIntervalSlider" tabindex="0"  type="checkbox" aria-label="show all subgroups">
					<span id="ciTableHover" class="slider round"></span>
				</label>
			</div>
		</div>
		<div>
			<div id="estimateTypeDropdown" class="genDropdown">
				<div id="estimateTypeDropdown-label" for="estimateTypeDropdown-select"class="select-label">Estimate Type</div>
			</div>
		</div>
	</div>
`;

export const tabContent = `
	${modal}
	<!-- TOP SELECTORS -->
	<div id="dropdownSelectorGroup" class="row">
		<!--<div class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">-->
		<div class="col homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="topicDropdown-label" for="topicDropdown-select" class="body2">Select a</label>
					<div class="mainSelText heading4">
						Topic
					</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw"></div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div id="topicDropdown" class="genDropdown">
				<label for="topicDropdown-select" id="topicDropdown-label"><div role="button" tabindex="0" id="refineTopicList" aria-label="refine topic list">Refine Topic List</div></label>
			</div>			
		</div>
		<!--<div class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup leftBorderSmallView">-->
			<div class="col homeSelectorGroup leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="classificationDropdown-label" for="classificationDropdown-select" class="body2">Refine by</label>
					<div class="mainSelText heading4">Classification</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw"></div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div id="classificationDropdown" class="genDropdown">
				<label for="classificationDropdown-select" id="classificationDropdown-label">&nbsp;</label>
			</div>
		</div>
		<!--<div class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup leftBorderMediumView leftBorderSmallView">-->		
		<div class="col homeSelectorGroup leftBorderMediumView leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="groupDropdown-label" for="groupDropdown-select" class="body2">View Data by</label>
					<div class="mainSelText heading4">Group</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw"></div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div id="groupDropdown" class="genDropdown">
				<label for="groupDropdown-select" id="groupDropdown-label">&nbsp;</label>
			</div>
		</div>
		<!--<div class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup leftBorderMediumView leftBorderSmallView">-->		
		<div class="col homeSelectorGroup leftBorderMediumView leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="groupDropdown-label" for="groupDropdown-select" class="body2">Filter by</label>
					<div class="mainSelText heading4">Subgroup</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw"></div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div id="subgroupDropdown"></div>
		</div>
		<!--<div class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup leftBorderSmallView">-->
		<div class="col homeSelectorGroup leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<div class="body2" aria-label="Choose from available time periods">Choose from available</div>
					<div class="mainSelText heading4">Time Periods</div>
				</div>
			</div>
			<div class="row" style="text-align: center">
				<div class="col-12">
					<div class="flexRow">
					<!--<div style="margin-top: 0.4vw; line-height: 1vw">-->
						<input style="margin-right: 8px;" type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox" />
						<label class="label-style body2" for="show-one-period-checkbox">View single period</label>
					</div>
				</div>
			</div>
			<div class="row timePeriodContainer">
				<div id="startYearContainer" class="genDropdown col-6" style="text-align: center">
					<label for="startYearContainer-select" id="startYearContainer-label" class="body2">Start Period</label>
				</div>
				<div id="endYearContainer" class="genDropdown col-6" style="text-align: center" class="body2">
					<label for="endYearContainer-select" id="endYearContainer-label">End Period</label>
				</div>
			</div>
		</div>
	</div>

	<div id="resetInfoContainer" class="row homeSmallGroup">
		<!--<div class="col-lg-12 align-self-end d-inline-block" style="text-align: right">-->
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end">
			<i id="resetInfo" class="fas fa-info-circle" style="font-size: 24px; color: #555">&nbsp;</i>
			<button id="home-btn-reset" class="btn-reset body2" type="button"><i class="fas fa-undo"></i> Reset</button>
		</div>
	</div>
	<br />

	<div tabindex="0" class="chart-titles space-util" style="text-align: center">
		<span id="chart-title" class="chart-title"></span><br />
		<span id="chart-subtitle"></span>
	</div>

	<!-- Tabs navs -->
	<div id="tabs">
		<div class="fa-3x genLoader active">
			<i class="fas fa-spinner fa-pulse"></i>
			<div>LOADING</div>
		</div>
		<ul>
			<li id="mapTab-li"><a href="#map-tab"><i class="fas fa-map fa-fw me-2"></i> Map</a></li>
			<li><a href="#chart-tab"><i class="fas fa-chart-line fa-fw me-2"></i> Chart</a></li>
			<li><a href="#table-tab"><i class="fas fa-table fa-fw me-2"></i> Table</a></li>
		</ul>
		<div id="map-tab" aria-labelledby="ex-with-icons-tab-1">
			<div class="content-wrapper" style="background-color: #b3d2ce; margin-top: 0px; padding-top: 1px">
				<div class="adjustUnitContainer">
					<div id="estimateTypeDropdownMap" class="genDropdown">
						<div id="estimateTypeDropdownMap-label" for="estimateTypeDropdownMap-select"class="select-label">Estimate Type</div>
					</div>
				</div>
				<fieldset class="breaksContainer">
					<div class="btnToggle">
						<input type="radio" name="classifyBy" value="natural" id="classNBreaks" checked="checked" />
						<label role="button" for="classNBreaks">Natural Breaks</label>
						<input type="radio" name="classifyBy" value="quartiles" id="classQuartiles" />
						<label role="button" for="classQuartiles">Quartiles</label>
					</div>
				</fieldset>			
				<div id="us-map-container">
					<div id="mapDownloadTitle"></div>
					<div id="us-map" class="general-chart"></div>
					<div id="us-map-time-slider" class="general-chart" data-html2canvas-ignore style="margin-top: 0"></div>
					<div id="us-map-legend" class="general-chart" style="margin-top: 0"></div>
				</div>
				<br />
				<div tabindex="0" class="source-text" id="source-text-map"><b>Source</b>: No source info available.</div>
			</div>
		</div>
		<!-- end map wrapper -->
		<div id="chart-tab" aria-labelledby="ex-with-icons-tab-2">
			<div class="content-wrapper">
				<div id="chartSelectors"></div>
				<div id="chart-container"></div>
				<br />
				<div tabindex="0" class="source-text" id="source-text-chart"><b>Source</b>: Data are unavailable for selections chosen.</div>
			</div>
			<!-- end chart wrapper -->
		</div>
		<div id="table-tab" aria-labelledby="ex-with-icons-tab-3">
			<div class="content-wrapper">
				<div id="tableSelectors"></div>
				<div id="tableResultsCount" style="font-weight: 600">Displaying <span id="filteredTableCount"></span> of <span id="fullTableCount"></span> Results</div>
				<div class="expanded-data-table"></div>
				<br />
			</div>
			<!-- end chart wrapper -->
		</div>
	</div>

	<div class="dwnl-img-container margin-spacer" style="display: flex; justify-content: space-between; text-align: center">
		<span>
			<a id="cdcDataGovButton" class="theme-cyan btn" aria-label="Visit cdc.data.gov" target="_blank" rel="noopener noreferrer">
				View Data on data.cdc.gov <i class="fas fa-download" aria-hidden="true"></i>
			</a>
		</span>
		<span>
			<button tabindex="0" id="dwn-chart-img" class="theme-cyan btn" style="margin-right: 20px">
				Download Image <i class="fas fa-image" aria-hidden="true"></i>
			</button>
			<button id="btnTableExport" class="theme-cyan btn" tabindex="0" aria-label="Download Data">
				Download Data <i class="fas fa-download" aria-hidden="true"></i>
			</button>
		</span>
	</div>

	<div class="data-table-container" id="pageFooterTable" style="margin-top: 10px; margin-bottom: 15px">
		<div role="button" aria-label="footnotes" class="table-toggle closed" id="footer-table-toggle" tabindex="0">
			<h4 class="table-title">Footnotes</h4>
			<div class="table-toggle-icon"><i id="footer-table-header-icon" class="fas fa-plus"></i></div>
		</div>
		<div id="pageFooter" class="data-table closed"></div>
	</div>	
`;

export const topicLookup = {
	footnotes: {
		socrataId: "m6mz-p2ij",
		private: "1",
	},
	nhisFootnotes: {
		socrataId: "dm8v-ubmw",
		private: "1",
	},
	nhis: {
		socrataId: "f8fd-33mw",
		private: "1",
	},

	"obesity-child": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Obesity-among-children-and-adolescents-aged-2-/64sz-mcbq",
		socrataId: "64sz-mcbq",
		private: "1",
		chartTitle: "Obesity among Children",
		filters: "AsianPacific,Black,Children,Hispanic,Poverty,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 5,
	},
	"obesity-adult": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Normal-weight-overweight-and-obesity-among-adu/23va-ejrn",
		socrataId: "23va-ejrn",
		private: "1",
		chartTitle: "Obesity among Adults",
		filters: "Adults,Asian,Black,Hispanic,Poverty,White,Male,Female",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 5,
	},
	suicide: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Death-rates-for-suicide-by-sex-race-Hispanic-o/u9f7-4q6s",
		socrataId: "u9f7-4q6s",
		private: "1",
		chartTitle: "Death Rates for Suicide",
		filters: "Adults,Older,Asian,AsianPacific,Indian,Black,Children,Hispanic,Hawaiian,White,Male,Female",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasClassification: false,
		topicGroup: 4,
	},
	injury: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Initial-injury-related-visits-to-hospital-emer/k99r-jkp7",
		socrataId: "k99r-jkp7",
		private: "1",
		chartTitle: "Initial injury-related visits to hospital emergency departments",
		filters: "Adults,Older,Children,Male,Female",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasClassification: false,
		topicGroup: 10,
	},
	"infant-mortality": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Infant-mortality-rates-by-race-and-Hispanic-or/bzax-vvbx",
		socrataId: "bzax-vvbx",
		private: "1",
		chartTitle: "Infant Mortality",
		filters: "Infants,Indian,AsianPacific,Black,Children,Hispanic,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		topicGroup: 4,
	},
	birthweight: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Low-birthweight-live-births-by-race-and-Hispan/3p8z-99bn",
		socrataId: "3p8z-99bn",
		private: "1",
		chartTitle: "Low birthweight live births",
		filters: "Infants,AsianPacific,Indian,Black,Children,Hispanic,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		topicGroup: 11,
	},
	medicaidU65: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Medicaid-coverage-among-persons-under-age-65-b/2g8y-scu5",
		socrataId: "2g8y-scu5",
		private: "1",
		chartTitle: "Medicaid coverage among persons under age 65",
		filters:
			"Adults,Indian,Asian,AsianPacific,Black,Children,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Marital,Metropolitan,MultipleRace,Hawaiian,Poverty,Region,White",
		classificationId: "NA",
		yAxisUnitId: 2,
		hasCI: true,
		hasClassification: false,
		topicGroup: 3,
	},
	"drug-overdose": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Drug-overdose-death-rates-by-drug-type-sex-age/52ij-h8yw",
		socrataId: "52ij-h8yw",
		private: "1",
		chartTitle: "Deaths from drug overdose",
		filters: "Adults,Indian,Asian,AsianPacific,Black,Children,Female,Hispanic,Male,Hawaiian,Older,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasClassification: true,
		topicGroup: 4,
	},
	"ambulatory-care": {
		dataUrl: "https://data.cdc.gov/resource/tz8d-jy2e.json",
		socrataId: "tz8d-jy2e",
		private: "1",
		chartTitle: "Ambulatory Care Visits",
		filters: "Adults,Black,Children,Female,Male,Older,Region,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasClassification: true,
		topicGroup: 10,
	},
	"access-care": {
		dataUrl: "https://data.cdc.gov/resource/nt5r-ak33.json",
		socrataId: "nt5r-ak33",
		private: "1",
		chartTitle: "Access to Care",
		filters:
			"Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 0,
	},
};

nhisTopics.forEach((t) => {
	topicLookup[t.id] = {
		dataUrl: "https://data.cdc.gov/NCHS/",
		socrataId: `nhis-${t.text}`,
		isNhisData: true,
		chartTitle: t.text,
		filters: nhisFilters,
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: t.topicGroup,
	};
});

export const topicGroups = [
	"Access to care", // 0
	"Cancer", // 1
	"Circulatory system", // 2
	"Coverage", // 3
	"Death", // 4
	"Endocrine system", // 5
	"Health Status", // 6
	"Mental Health", // 7
	"Musculoskeletal system", // 8
	"Nervous system", // 9
	"Outpatient Visit", // 10
	"Perinatal period", // 11
	"Prescription Medication", // 12
	"Respiratory system", // 13
	"Sensory Impairments", // 14
	"Tobacco usage", // 15
	"Vaccination", // 16
];

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules for creating a new hashLookup object
// 1. top-level value must match the ID in the Topic dropdown's Options list
// 2. hash can be any string closely related to the TEXT in Topic dropdown, with "-" replacing any spaces. Do not use "_" as this is reserved
//    to split a tab-hash and the hash-values that follow. I hear you thinking 'hash, value, hash-value ... I'm confused'. Bottom line is,
//    in the object: "hash" is what is read/written to the browser url; "value" is the corresponding "id" from the dropdowns.
//    Use text and "-" characters only for worry-free acceptance. For long text values you might choose to abbreviate a/some words
//    The end-goal is for the hash url to be meaningful to someone it may be shared with before they navigate to it
// 3. "classificationOptions" uses rules #1 and #2 like above, but for the Classification  dropdown
// 4. "groupOptions" uses rules #1 and #2 like above, but for the Group dropdown
//
// For ease of getting the values, after creating the required topicLookup object (above in this code), load the page.
// Once your new dataset successfully loads you can inspect the Classification and Group dropdowns.
export const hashLookup = [
	{
		hash: "obesity-children",
		value: "obesity-child",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "sex",
				value: "1",
			},
			{
				hash: "age",
				value: "2",
			},
			{
				hash: "race-and-hispanic-origin",
				value: "3",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "4",
			},
			{
				hash: "percent-of-poverty-level",
				value: "5",
			},
		],
		classificationOptions: [
			{
				hash: "2-19",
				value: "1",
			},
			{
				hash: "2-5",
				value: "2",
			},
			{
				hash: "6-11",
				value: "3",
			},
			{
				hash: "12-19",
				value: "4",
			},
		],
	},
	{
		hash: "obesity-adults",
		value: "obesity-adult",
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race-and-hispanic-origin",
				value: "3",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "4",
			},
			{
				hash: "percent-of-poverty-level",
				value: "5",
			},
			{
				hash: "sex-and-age",
				value: "6",
			},
		],
		classificationOptions: [
			{
				hash: "BMI-from-18.5-to-24.9",
				value: "1",
			},
			{
				hash: "BMI-greater-than-or-equal-to-25.0",
				value: "2",
			},
			{
				hash: "BMI-greater-than-or-equal-to-30.0",
				value: "3",
			},
			{
				hash: "BMI-from-30.0-to-34.9",
				value: "4",
			},
			{
				hash: "BMI-from-35.0-to-39.9",
				value: "5",
			},
			{
				hash: "BMI-greater-than-or-equal-to-40.0",
				value: "6",
			},
		],
	},
	{
		hash: "suicide-mortality",
		value: "suicide",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "sex-and-race",
				value: "4",
			},
			{
				hash: "sex-age-and-race",
				value: "5",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "6",
			},
			{
				hash: "sex-age-and-race-and-hispanic-origin",
				value: "7",
			},
		],
		classificationOptions: [
			{
				hash: "NA",
				value: "NA",
			},
			{
				hash: "NA",
				value: "0",
			},
		],
	},
	{
		hash: "injury-ed-visits",
		value: "injury",
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "intent-and-mechanism-of-injury",
				value: "2",
			},
			{
				hash: "sex",
				value: "3",
			},
			{
				hash: "sex-intent-and-mechanism-of-injury",
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "5",
			},
			{
				hash: "sex-age-intent-and-mechanism-of-injury",
				value: "6",
			},
		],
		classificationOptions: [
			{
				hash: "NA",
				value: "0",
			},
		],
	},
	{
		hash: "infant-mortality",
		value: "infant-mortality",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		classificationOptions: [
			{
				hash: "All-races",
				value: "1",
			},
			{
				hash: "Not-Hispanic-or-Latina&White",
				value: "2",
			},
			{
				hash: "Not-Hispanic-or-Latina&Black-or-African-American",
				value: "3",
			},
			{
				hash: "Hispanic-or-Latina&All-races",
				value: "4",
			},
			{
				hash: "American-Indian-or-Alaska-Native",
				value: "5",
			},
			{
				hash: "Asian-or-Pacific-Islander",
				value: "6",
			},
		],
	},
	{
		hash: "low-birthweight",
		value: "birthweight",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		classificationOptions: [
			{
				hash: "All-races",
				value: "1",
			},
			{
				hash: "Not-Hispanic-or-Latina&White",
				value: "2",
			},
			{
				hash: "Not-Hispanic-or-Latina&Black-or-African-American",
				value: "3",
			},
			{
				hash: "Hispanic-or-Latina&All-races",
				value: "4",
			},
			{
				hash: "American-Indian-or-Alaska-Native",
				value: "5",
			},
			{
				hash: "Asian-or-Pacific-Islander",
				value: "6",
			},
		],
	},
	{
		hash: "medicaid-coverage-under-65",
		value: "medicaidU65",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-marital-status",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-origin-and-race",
				value: "5",
			},
			{
				hash: "age-and-percent-of-poverty-level",
				value: "6",
			},
			{
				hash: "level-of-difficulty",
				value: "7",
			},
			{
				hash: "geographic-region",
				value: "8",
			},
			{
				hash: "location-of-residence",
				value: "9",
			},
		],
		classificationOptions: [
			{
				hash: "NA",
				value: "NA",
			},
			{
				hash: "NA",
				value: "0",
			},
		],
	},
	{
		hash: "drug-overdose",
		value: "drug-overdose",
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "sex-and-race",
				value: "4",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "5",
			},
		],
		classificationOptions: [
			{
				hash: "all-drug-overdose-deaths",
				value: "1",
			},
			{
				hash: "drug-overdose-deaths-any-opioid",
				value: "2",
			},
			{
				hash: "drug-overdose-deaths-natural-and-semisynthetic-opioids",
				value: "3",
			},
			{
				hash: "drug-overdose-deaths-methadone",
				value: "4",
			},
			{
				hash: "drug-overdose-deaths-synthetic-opioids",
				value: "5",
			},
			{
				hash: "drug-overdose-deaths-heroin",
				value: "6",
			},
		],
	},
	{
		hash: "ambulatory-care",
		value: "ambulatory-care",
		classificationOptions: [
			{
				hash: "all-places",
				value: "1",
			},
			{
				hash: "physician-offices",
				value: "2",
			},
			{
				hash: "hospital-outpatient",
				value: "3",
			},
			{
				hash: "hospital-emergency",
				value: "4",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "race-and-age",
				value: "5",
			},
		],
	},
	{
		hash: "access-care",
		value: "access-care",
		classificationOptions: [
			{
				hash: "nonreceipt-medical-care",
				value: "1",
			},
			{
				hash: "nonreceipt-drugs",
				value: "2",
			},
			{
				hash: "nonreceipt-dental-care",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "3",
			},
			{
				hash: "hispanic-origin-and-race",
				value: "4",
			},
			{
				hash: "education",
				value: "5",
			},
			{
				hash: "percent-of-poverty-level",
				value: "6",
			},
			{
				hash: "hispanic-origin-race-and-percent-of-poverty-level",
				value: "7",
			},
			{
				hash: "health-insurance-status-at-interview",
				value: "8",
			},
			{
				hash: "health-insurance-status-prior-to-interview",
				value: "9",
			},
			{
				hash: "percent-poverty-level-and-health-insurance-status-prior-to-interview",
				value: "10",
			},
			{
				hash: "level-of-difficulty",
				value: "11",
			},
			{
				hash: "geographic-region",
				value: "12",
			},
			{
				hash: "location-of-residence",
				value: "13",
			},
		],
	},
];
// add all NHIS topic to hashLookup
nhisTopics
	.map((t) => t.id)
	.forEach((id) => {
		hashLookup.push({
			hash: id,
			value: id,
			groupOptions: nhisHash.groupOptions,
			classificationOptions: nhisHash.classificationOptions,
		});
	});
