import { modal, allFilters } from "./modal";
import { NHISHash, NHISTopics } from "./nhis";

const NHISFilters = `Interview, ${allFilters.filter((a) => a !== "Children" && a !== "Infants").join(",")}`;

export const chartAndTableSelectors = `
	<div id="chart-table-selectors">
		<div class="viewSelectorsToggle viewSelectorsClosed">
			<div>View Options</div>
		</div>
		<div class="hideShowViewSelectors">
			<div id="viewSlidersContainer">
				<div id="subGroupsSelectorsSection" class="viewSliders">
					<label for="showAllSubgroupsSlider" class="tableSliderLabel">Show All Subgroups</label>
					<label class="switch">
						<input id="showAllSubgroupsSlider" tabindex="0" type="checkbox" aria-label="show all subgroups">
						<span class="slider round"></span>
					</label>
				</div>
				<div id="ciTableSlider" class="viewSliders">
					<label for="confidenceIntervalSlider" class="tableSliderLabel">Show Confidence Interval</label>
					<label class="switch">
						<input id="confidenceIntervalSlider" tabindex="0"  type="checkbox" aria-label="show all subgroups">
						<span id="ciTableHover" class="slider round"></span>
					</label>
				</div>			
				<div id="mapBinningTypeSelector" class="viewSliders">
					<label for="mapBinningSlider" class="tableSliderLabel" style="width: unset; margin-right: 10px;">Show quartiles based on the most recent available period</label>
					<label class="switch">
						<input id="mapBinningSlider" tabindex="0"  type="checkbox" checked aria-label="show quartiles base on the most recent available period">
						<span class="slider round"></span>
					</label>
				</div>
			</div>
			<div id="estimateDropdownContainer">
				<div id="estimateTypeDropdown" class="genDropdown">
					<div id="estimateTypeDropdown-label" for="estimateTypeDropdown-select"class="select-label">Estimate Type</div>
				</div>
			</div>
		</div>
	</div>
`;

export const tabContent = `
	${modal}
	<!-- TOP SELECTORS -->
	<div id="dropdownSelectorGroup" class="row">
		<div id="topicDropdownGroup" class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup">
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
			<div class="row spacerContainer">&nbsp;</div>
			<div id="topicDropdown" class="genDropdown">
				<label for="topicDropdown-select" id="topicDropdown-label"><div role="button" tabindex="0" id="refineTopicList" aria-label="refine topic list">Refine Topic List</div></label>
				<i id="refineTopicIcon" class="fas fa-info-circle" style="color: #555">&nbsp;</i>
			</div>			
		</div>
			<div class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="classificationDropdown-label" for="classificationDropdown-select" class="body2">Refine by</label>
					<div class="mainSelText heading4">Classification</div>
				</div>
			</div>
			<div class="row spacerContainer2">&nbsp;</div>
			<div id="classificationDropdown" class="genDropdown">
				<label for="classificationDropdown-select" id="classificationDropdown-label">&nbsp;</label>
			</div>
		</div>
		<div class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup leftBorderMediumView leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="groupDropdown-label" for="groupDropdown-select" class="body2">View Data by</label>
					<div class="mainSelText heading4">Group</div>
				</div>
			</div>
			<div class="row spacerContainer">&nbsp;</div>
			<div class="row spacerContainer1">&nbsp;</div>
			<div id="groupDropdown" class="genDropdown">
				<label for="groupDropdown-select" id="groupDropdown-label">&nbsp;</label>
			</div>
		</div>
		<div class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label id="groupDropdown-label" for="groupDropdown-select" class="body2">Filter by</label>
					<div class="mainSelText heading4">Subgroup</div>
				</div>
			</div>
			<div class="row spacerContainer">&nbsp;</div>
			<div class="row spacerContainer1">&nbsp;</div>
			<div id="subgroupDropdown"></div>
		</div>
		<div class="col col-12 mainDropdown homeSelectorGroup leftBorderMediumView leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-xl-10 col-md-4 col-sm-8 homeSelectorText">
					<div class="body2" aria-label="Choose from available time periods">Choose from available</div>
					<div class="mainSelText heading4">Time Periods</div>
				</div>
				<div class="col-xl-12 col-md-6 col-sm-12">
					<div class="flexRow singlePeriod">
						<input style="margin-right: 8px;" type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox" />
						<label class="label-style body2" for="show-one-period-checkbox">View single period</label>
					</div>
				</div>
			</div>
			<div class="row timePeriodContainer">
				<div id="startYearContainer" class="genDropdown col-6" style="text-align: center;">
					<label for="startYearContainer-select" id="startYearContainer-label">Start Period</label>
				</div>
				<div id="endYearContainer" class="genDropdown col-6" style="text-align: center;">
					<label for="endYearContainer-select" id="endYearContainer-label">End Period</label>
				</div>
			</div>
		</div>
	</div>

	<div id="resetInfoContainer" class="row homeSmallGroup">
		<!--<div class="col-lg-12 align-self-end d-inline-block" style="text-align: right">-->
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end">
			<i id="resetInfo" class="fas fa-info-circle">&nbsp;</i>
			<button id="home-btn-reset" class="btn-reset body2" type="button"><i class="fas fa-undo"></i> Reset</button>
		</div>
	</div>
	<br />

	<div tabindex="0" class="chart-titles space-util" style="text-align: center">
		<span id="chart-title" class="chart-title"></span><br style="display: block; content:''; margin-top: -4px" />
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
		<!-- map wrapper -->
		<div id="map-tab" aria-labelledby="ex-with-icons-tab-1">
			<div id="mapContentWrapper" class="content-wrapper" style="background-color: #ceece7; margin-top: 0px; padding-top: 1px">
				<div id="mapSelectors"></div>
				<div id="us-map-container">
					<div id="mapDownloadTitle" style="width: 100%"></div>
					<div id="us-map-time-slider" class="general-chart" data-html2canvas-ignore></div>
					<div id="us-map" class="general-chart"></div>
					<div class="usMapLegendContainer">
						<div> <!-- styling found in main.scss #usMapLegendContainer > div -->
							<div id="us-map-legend-title" class="general-chart" tabindex="0">Legend</div>
							<div style="display: inline-block; text-align: left;" tabindex="0">
								Data classified using <a class="viewFootnotes" tabindex="0">quartiles</a> based on <span style="text-align: left;" id="mapLegendPeriod">2013 - 2015</span>
							</div>
							<div style="text-align: left;" id="us-map-legend" class="general-chart"></div>
						</div>
					</div>
				</div>
				<br />
				<div tabindex="0" class="source-text unreliableNote">Some estimates are considered not reliable. <a class="viewFootnotes">See Notes</a> for more details.</div>
			</div>
		</div>
		<!-- end map wrapper -->
		<div id="chart-tab" aria-labelledby="ex-with-icons-tab-2">
			<div class="content-wrapper">
				<div id="chartSelectors"></div>				
				<div id="chartContainer" class="row">
					<div id="chart-container" class="col-xxl-10 col-xl-9 col-lg-12"></div>
					<div id="chartLegend" class="col-xxl-2 col-xl-3 col-lg-12">
						<div style="margin: auto; border: 1px solid #e0e0e0; border-radius: 5px;">
							<div id="chartLegendTitle" tabindex="0"></div>
							<hr style="margin: 0 10px" />
							<div id="chartLegendContent"></div>
						</div>
					</div>
				</div>
				<br />
				<div tabindex="0" class="source-text unreliableNote">Some estimates are considered not reliable. <a class="viewFootnotes">See Notes</a> for more details.</div>
			</div>
			<!-- end chart wrapper -->
		</div>
		<div id="table-tab" aria-labelledby="ex-with-icons-tab-3">
			<div id="tableContentWrapper" class="content-wrapper">
				<div id="tableSelectors"></div>
				<table id="nchsHeaderTable" style="background-color: #e0e0e0;">
					<thead>
						<tr>
							<th id="tableYearHeader">Year</th>
							<th id="tableEstimateHeader"></th>
						</tr>
					</thead>
				</table>
				<div class="expanded-data-table"></div>
				<br />
				<div tabindex="0" class="source-text unreliableNote">Symbols (e.g. * and ---) are used as reliability indicators. <a class="viewFootnotes">See Notes</a> for more details.</div>
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
			<h4 class="table-title">Notes</h4>
			<div class="table-toggle-icon"><i id="footer-table-header-icon" class="fas fa-plus"></i></div>
		</div>
		<div id="pageFooter" class="data-table closed"></div>
	</div>	
`;

const footnoteDatasets = {
	footnotes: {
		socrataId: "m6mz-p2ij",
		private: "1",
	},
	NHISFootnotes: {
		socrataId: "pr96-nsm2",
		private: "1",
	},
	cshsFootnotes: {
		socrataId: "7kgb-btmk",
		private: "1",
	},
	NHAMCSFootnotes: {
		socrataId: "42t3-uyny",
		private: "1",
	},
	NHANESFootnotes: {
		socrataId: "vv6f-2hmj",
		private: "1",
	},
};

const singleTopicDatasets = {
	"obesity-child": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Obesity-among-children-and-adolescents-aged-2-/64sz-mcbq",
		socrataId: "64sz-mcbq",
		private: "1",
		chartTitle: "Obesity among Children (HUS)",
		filters: "HUS,AsianPacific,Black,Children,Hispanic,Poverty,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 0,
	},
	"obesity-adult": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Normal-weight-overweight-and-obesity-among-adu/23va-ejrn",
		socrataId: "23va-ejrn",
		private: "1",
		chartTitle: "Obesity among Adults (HUS)",
		filters: "HUS,Adults,Asian,Black,Hispanic,Poverty,White,Male,Female",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 0,
	},
	suicide: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Death-rates-for-suicide-by-sex-race-Hispanic-o/e8w2-ekn5",
		socrataId: "u9f7-4q6s",
		private: "1",
		chartTitle: "Death Rates for Suicide",
		filters: "HUS,Adults,Older,Asian,AsianPacific,Indian,Black,Children,Hispanic,Hawaiian,White,Male,Female",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: true,
		hasClassification: false,
		topicGroup: 1,
	},
	injury: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Initial-injury-related-visits-to-hospital-emer/k99r-jkp7",
		socrataId: "k99r-jkp7",
		private: "1",
		chartTitle: "Initial injury-related visits to hospital emergency departments (HUS)",
		filters: "HUS,Adults,Older,Children,Male,Female",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasClassification: false,
		topicGroup: 1,
	},
	"infant-mortality": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Infant-mortality-rates-by-race-and-Hispanic-or/bzax-vvbx",
		socrataId: "bzax-vvbx",
		private: "1",
		chartTitle: "Infant Mortality",
		filters: "HUS,Infants,Indian,AsianPacific,Black,Children,Hispanic,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		binGranularity: 0.1,
		topicGroup: 1,
	},
	birthweight: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Low-birthweight-live-births-by-race-and-Hispan/3p8z-99bn",
		socrataId: "3p8z-99bn",
		private: "1",
		chartTitle: "Low birthweight live births",
		filters: "HUS,Infants,AsianPacific,Indian,Black,Children,Hispanic,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		binGranularity: 0.01,
		topicGroup: 1,
	},
	medicaidU65: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Medicaid-coverage-among-persons-under-age-65-b/2g8y-scu5",
		socrataId: "2g8y-scu5",
		private: "1",
		chartTitle: "Medicaid coverage among persons under age 65 (HUS)",
		filters:
			"HUS,Adults,Indian,Asian,AsianPacific,Black,Children,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Marital,Metropolitan,MultipleRace,Hawaiian,Poverty,Region,White",
		dataSystem: "HUS",
		classificationId: "NA",
		yAxisUnitId: 2,
		hasCI: true,
		hasClassification: false,
		topicGroup: 3,
	},
	"drug-overdose": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Drug-overdose-death-rates-by-drug-type-sex-age/gp4d-kizt",
		socrataId: "52ij-h8yw",
		private: "1",
		chartTitle: "Deaths from drug overdose",
		filters: "HUS,Adults,Indian,Asian,AsianPacific,Black,Children,Female,Hispanic,Male,Hawaiian,Older,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 1,
	},
	"ambulatory-care": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Visits-to-physician-offices-hospital-outpatien/tz8d-jy2e",
		socrataId: "tz8d-jy2e",
		private: "1",
		chartTitle: "Ambulatory Care Visits (HUS)",
		filters: "HUS,Adults,Black,Children,Female,Male,Older,Region,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasClassification: true,
		topicGroup: 1,
	},
	"access-care": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Delay-or-nonreceipt-of-needed-medical-care-pre/nt5r-ak33",
		socrataId: "nt5r-ak33",
		private: "1",
		chartTitle: "Access to Care (HUS)",
		filters:
			"HUS,Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 3,
	},
	"community-hospital-beds": {
		dataUrl: "https://data.cdc.gov/dataset/DQS-Community-hospital-beds-by-state/udap-6a7e",
		socrataId: "udap-6a7e",
		private: "1",
		chartTitle: "Community Hospital Beds",
		filters: "HUS",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		binGranularity: 0.1,
		topicGroup: 3,
	},
};

const multipleTopicDatasets = {
	NHIS: {
		socrataId: "4u68-shzr",
		private: "1",
		dataMapper: (data, dataId) => {
			let filteredToIndicator = data.filter((d) => d.outcome_or_indicator === dataId);
			if (filteredToIndicator.length === 0) {
				const dId = NHISTopics.find((t) => t.text === dataId)?.indicator;
				filteredToIndicator = data.filter((d) => d.outcome_or_indicator === dId);
			}
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				const ci = f.confidence_interval?.split(",") ?? ["0", "0"];
				returnData.push({
					estimate: f.percentage,
					estimate_lci: ci[0].trim(),
					estimate_uci: ci[1].trim(),
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.outcome_or_indicator,
					panel: f.subtopic,
					panel_num: f.subtopicid,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_byid,
					unit: f.unit,
					unit_num: f.unit_id,
					year: f.year,
					year_num: "",
					age: f.group_by.includes("By age") ? f.group_by : "N/A",
				});
			});

			return returnData;
		},
	},
	"children-summary-statistics": {
		socrataId: "rkv8-xf9z",
		private: "1",
		filters: `Interview, ${allFilters
			.filter((a) => a !== "Adults" && a !== "Infants" && a !== "Older Adults")
			.join(",")}`,
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.outcome_or_indicator === dataId);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				const ci = f.confidence_interval?.split(",") ?? ["0", "0"];
				returnData.push({
					estimate: f.percentage,
					estimate_lci: ci[0].trim(),
					estimate_uci: ci[1].trim(),
					flag: f.flag,
					footnote_id_list: f.footnote_id,
					indicator: f.outcome_or_indicator,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_by_id,
					unit: f.unit,
					unit_num: f.unit_id,
					year: f.year,
					year_num: "",
					age: f.group_by.includes("By age") ? f.group_by : "N/A",
				});
			});

			return returnData;
		},
	},
	NHAMCS: {
		socrataId: "pcav-mejc",
		private: "1",
		filters: `Interview, ${allFilters
			.filter((t) => !["FuncLimitStatus", "Marital", "Education", "Poverty", "SVI"].includes(t))
			.join(",")}`,
		dataMapper: (data, dataId) => {
			const dataIndicator = NHISTopics.find((t) => t.text === dataId)?.indicator;
			const filteredToIndicator = data.filter((d) => d.measure_type === dataIndicator);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.estimate,
					estimate_lci: f.lower_95_ci,
					estimate_uci: f.upper_95_ci,
					flag: f.flag,
					footnote_id_list: f.footnote_id,
					indicator: f.measure_type,
					panel: f.measure,
					panel_num: f.measure_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.groupby,
					stub_name_num: f.groupby_id,
					unit: f.estimate_type,
					unit_num: f.estimatetype_id,
					year: f.year,
					year_num: "",
					age: f.groupby.includes("By age") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"nhanes-chronic-conditions": {
		socrataId: "i2dc-ja7d",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure === dataId);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.percent,
					estimate_lci: f.lower_95_ci_limit,
					estimate_uci: f.upper_95_ci_limit,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_by_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group_by.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"nhanes-dietary-behaviors": {
		socrataId: "j4m9-2puq",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure === dataId);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.mean,
					estimate_lci: f.lower_95_ci_limit,
					estimate_uci: f.upper_95_ci_limit,
					flag: f.flag,
					footnote_id_list: f.footnote_id,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_by_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group_by.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"nhanes-oral-health": {
		socrataId: "i3dq-buv5",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure === dataId);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.percent,
					estimate_lci: f.lower_95_ci_limit,
					estimate_uci: f.upper_95_ci_limit,
					flag: f.flag,
					footnote_id_list: f.footnote_id,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_by_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group_by.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"nhanes-infectious-disease": {
		socrataId: "fuy5-tcrb",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure === dataId);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.percent,
					estimate_lci: f.lower_95_ci_limit,
					estimate_uci: f.upper_95_ci_limit,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group_by,
					stub_name_num: f.group_by_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group_by.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
};

export const topicLookup = {
	...footnoteDatasets,
	...singleTopicDatasets,
	...multipleTopicDatasets,
};

// load all the topics with the associated groupings (i.e. topicGroup) into 'topicLookup' object
NHISTopics.forEach((t) => {
	// check if the topic group has custom filters
	let filters = NHISFilters;
	if (t.topicLookupKey && topicLookup[t.topicLookupKey]?.filters) {
		filters = topicLookup[t.topicLookupKey].filters;
	}
	topicLookup[t.id] = {
		dataUrl: t.dataUrl,
		socrataId: t.text,
		isNhisData: true,
		chartTitle: t.text,
		filters,
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: t.topicGroup,
		topicLookupId: t.topicLookupKey,
		dataSystem: t.dataSystem,
	};
});

export const topicGroups = [
	"Diseases and conditions", // 0
	"Epidemiology and health metrics", // 1
	"Health behavior and risks", // 2
	"Health systems", // 3
	"Mental Health	", // 4
	"Oral Health", // 5
	"Prevention, control, and treatment", // 6
];

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules for creating a new hashLookup object
// 1. top-level value must match the ID in the Topic dropdown's Options list
// 2. hash can be any string closely related to the TEXT in Topic dropdown, with "-" replacing any spaces. Do not use "_" as this is reserved
//    to split a tab-hash and the hash-values that follow. I hear you thinking 'hash, value, hash-value ... I'm confused'. Bottom line is,
//    in the object: "hash" is what is read/written to the browser url; "value" is the corresponding "id" from the dropdowns.
//    Use text and "-" characters only for worry-free acceptance. For long text values you might choose to abbreviate a/some words
//    The end-goal is for the hash url to be meaningful to someone it may be shared with before they navigate to it
// 3. "classificationOptions" uses rules #1 and #2 like above, but for the Classification dropdown
// 4. "groupOptions" uses rules #1 and #2 like above, but for the Group dropdown
//
// For ease of getting the values, after creating the required topicLookup object (above in this code), load the page.
// Once your new dataset successfully loads you can inspect the Classification and Group dropdowns.
export const hashLookup = [
	{
		hash: "angina-pectoris",
		value: "angina-pectoris",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-communicating",
		value: "any-difficulty-communicating",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-hearing",
		value: "any-difficulty-hearing",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-remembering-or-concentrating",
		value: "any-difficulty-remembering-or-concentrating",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-seeing",
		value: "any-difficulty-seeing",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-walking-or-climbing-steps",
		value: "any-difficulty-walking-or-climbing-steps",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-difficulty-with-self-care",
		value: "any-difficulty-with-self-care",
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-skin-cancer",
		value: "any-skin-cancer",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "any-type-of-cancer",
		value: "any-type-of-cancer",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "arthritis-diagnosis",
		value: "arthritis-diagnosis",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "asthma-episode-attack",
		value: "asthma-episode-attack",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "breast-cancer",
		value: "breast-cancer",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "cervical-cancer",
		value: "cervical-cancer",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "COPD-emphysema-chronic-bronchitis",
		value: "COPD-emphysema-chronic-bronchitis",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "coronary-heart-disease",
		value: "coronary-heart-disease",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "current-asthma",
		value: "current-asthma",
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "current-asthma-among-children",
		value: "current-asthma-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "diagnosed-diabetes",
		value: "diagnosed-diabetes",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "diagnosed-hypertension",
		value: "diagnosed-hypertension",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "disability-status-(composite)",
		value: "disability-status-(composite)",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "ever-having-a-learning-disability",
		value: "ever-having-a-learning-disability",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "ever-having-asthma",
		value: "ever-having-asthma",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "ever-having-attention-deficit/hyperactivity-disorder",
		value: "ever-having-attention-deficit/hyperactivity-disorder",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "heart-attack-myocardial-infarction",
		value: "heart-attack-myocardial-infarction",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "herpes-simplex-virus-type-1-hsv-1",
		value: "herpes-simplex-virus-type-1-hsv-1",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "herpes-simplex-virus-type-2-hsv-2",
		value: "herpes-simplex-virus-type-2-hsv-2",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "high-cholesterol",
		value: "high-cholesterol",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "high-total-cholesterol",
		value: "high-total-cholesterol",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "hypertension",
		value: "hypertension",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "obesity-nhanes",
		value: "obesity-nhanes",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "obesity",
		value: "obesity",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "obesity-adult",
		value: "obesity-adult",
		classificationOptions: [
			{
				hash: "normal-weight-bmi-from-185-to-249",
				value: "1",
			},
			{
				hash: "overweight-or-obese-bmi-greater-than-or-equal-to-250",
				value: "2",
			},
			{
				hash: "obesity-bmi-greater-than-or-equal-to-300",
				value: "3",
			},
			{
				hash: "grade-1-obesity-bmi-from-300-to-349",
				value: "4",
			},
			{
				hash: "grade-2-obesity-bmi-from-350-to-399",
				value: "5",
			},
			{
				hash: "grade-3-obesity-bmi-greater-than-or-equal-to-400",
				value: "6",
			},
		],
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
	},
	{
		hash: "obesity-child",
		value: "obesity-child",
		classificationOptions: [
			{
				hash: "2-19-years",
				value: "1",
			},
			{
				hash: "2-5-years",
				value: "2",
			},
			{
				hash: "6-11-years",
				value: "3",
			},
			{
				hash: "12-19-years",
				value: "4",
			},
		],
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
				hash: "age",
				value: "2",
			},
		],
	},
	{
		hash: "prostate-cancer",
		value: "prostate-cancer",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "regularly-experienced-chronic-pain",
		value: "regularly-experienced-chronic-pain",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "regularly-had-feelings-of-depression",
		value: "regularly-had-feelings-of-depression",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "regularly-had-feelings-of-worry-nervousness-or-anxiety",
		value: "regularly-had-feelings-of-worry-nervousness-or-anxiety",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "ambulatory-care",
		value: "ambulatory-care",
		classificationOptions: [
			{
				hash: "physician-offices",
				value: "1",
			},
			{
				hash: "hospital-emergency-departments",
				value: "2",
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
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "race-and-age",
				value: "5",
			},
		],
	},
	{
		hash: "suicide",
		value: "suicide",
		classificationOptions: [
			{
				hash: "na",
				value: "0",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-age-and-race-and-hispanic-origin",
				value: "7",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "6",
			},
			{
				hash: "sex-age-and-race",
				value: "5",
			},
			{
				hash: "sex-and-race",
				value: "4",
			},
			{
				hash: "sex-age-and-race-and-hispanic-origin-single-race",
				value: "11",
			},
			{
				hash: "sex-and-race-and-hispanic-origin-single-race",
				value: "10",
			},
			{
				hash: "sex-age-and-race-single-race",
				value: "9",
			},
			{
				hash: "sex-and-race-single-race",
				value: "8",
			},
		],
	},
	{
		hash: "drug-overdose",
		value: "drug-overdose",
		classificationOptions: [
			{
				hash: "all-drug-overdose-deaths",
				value: "1",
			},
			{
				hash: "drug-overdose-deaths-involving-heroin",
				value: "6",
			},
			{
				hash: "drug-overdose-deaths-involving-methadone",
				value: "4",
			},
			{
				hash: "drug-overdose-deaths-involving-any-opioid",
				value: "2",
			},
			{
				hash: "drug-overdose-deaths-involving-natural-and-semisynthetic-opioids",
				value: "3",
			},
			{
				hash: "drug-overdose-deaths-involving-other-synthetic-opioids-other-than-methadone",
				value: "5",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-race-and-hispanic-origin-single-race",
				value: "7",
			},
			{
				hash: "sex-and-race-single-race",
				value: "6",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "5",
			},
			{
				hash: "sex-and-race",
				value: "4",
			},
		],
	},
	{
		hash: "doctor-visit",
		value: "doctor-visit",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "doctor-visit-among-children",
		value: "doctor-visit-among-children",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "by-primary-diagnosis",
		value: "by-primary-diagnosis",
		classificationOptions: [
			{
				hash: "certain-infectious-and-parasitic-diseases",
				value: "5",
			},
			{
				hash: "diseases-of-the-circulatory-system",
				value: "8",
			},
			{
				hash: "diseases-of-the-digestive-system",
				value: "9",
			},
			{
				hash: "diseases-of-the-genitourinary-system",
				value: "10",
			},
			{
				hash: "diseases-of-the-respiratory-system",
				value: "12",
			},
			{
				hash: "diseases-of-the-musculoskeletal-system-and-connective-tissue",
				value: "11",
			},
			{
				hash: "diseases-of-the-skin-and-subcutaneous-tissue",
				value: "13",
			},
			{
				hash: "injury-and-poisoning",
				value: "16",
			},
			{
				hash: "mental-behavioral-and-neurodevelopmental-disorders",
				value: "17",
			},
			{
				hash: "all-diagnoses",
				value: "1",
			},
			{
				hash: "symptoms-signs-and-abnormal-clinical-and-laboratory-findings",
				value: "22",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "by-sex",
				value: "3",
			},
			{
				hash: "by-age",
				value: "2",
			},
			{
				hash: "by-raceethnicity",
				value: "4",
			},
			{
				hash: "by-region",
				value: "6",
			},
			{
				hash: "by-metropolitan-statistical-area-msa",
				value: "5",
			},
			{
				hash: "by-primary-payment-source",
				value: "7",
			},
		],
	},
	{
		hash: "by-reason-for-visit",
		value: "by-reason-for-visit",
		classificationOptions: [
			{
				hash: "accident-not-otherwise-specified",
				value: "3",
			},
			{
				hash: "chest-pain-and-related-symptoms-not-referable-to-body-systems",
				value: "6",
			},
			{
				hash: "cough",
				value: "7",
			},
			{
				hash: "fever",
				value: "14",
			},
			{
				hash: "headache-pain-in-head",
				value: "15",
			},
			{
				hash: "shortness-of-breath",
				value: "20",
			},
			{
				hash: "other-symptomsproblems-related-to-psychological-and-mental-disorders",
				value: "18",
			},
			{
				hash: "pain-site-not-referable-to-a-specific-body-system",
				value: "19",
			},
			{
				hash: "stomach-and-abdominal-pain-cramps-and-spasms",
				value: "21",
			},
			{
				hash: "all-reasons-patient-reported",
				value: "2",
			},
			{
				hash: "back-symptoms",
				value: "4",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "by-sex",
				value: "3",
			},
			{
				hash: "by-age",
				value: "2",
			},
			{
				hash: "by-raceethnicity",
				value: "4",
			},
			{
				hash: "by-region",
				value: "6",
			},
			{
				hash: "by-metropolitan-statistical-area-msa",
				value: "5",
			},
			{
				hash: "by-primary-payment-source",
				value: "7",
			},
		],
	},
	{
		hash: "fair-or-poor-health-status",
		value: "fair-or-poor-health-status",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "fair-or-poor-health-status-among-children",
		value: "fair-or-poor-health-status-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "hospital-emergency-department-visit",
		value: "hospital-emergency-department-visit",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "infant-mortality",
		value: "infant-mortality",
		classificationOptions: [
			{
				hash: "all-races",
				value: "1",
			},
			{
				hash: "not-hispanic-or-latina-white",
				value: "2",
			},
			{
				hash: "not-hispanic-or-latina-black-or-african-american",
				value: "3",
			},
			{
				hash: "hispanic-or-latina-all-races",
				value: "4",
			},
			{
				hash: "american-indian-or-alaska-native",
				value: "5",
			},
			{
				hash: "asian-or-pacific-islander",
				value: "6",
			},
		],
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
	},
	{
		hash: "injury",
		value: "injury",
		classificationOptions: [
			{
				hash: "na",
				value: "0",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "3",
			},
			{
				hash: "intent-and-mechanism-of-injury",
				value: "2",
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
	},
	{
		hash: "birthweight",
		value: "birthweight",
		classificationOptions: [
			{
				hash: "all-races",
				value: "1",
			},
			{
				hash: "not-hispanic-or-latina-white",
				value: "2",
			},
			{
				hash: "not-hispanic-or-latina-black-or-african-american",
				value: "3",
			},
			{
				hash: "hispanic-or-latina-all-races",
				value: "4",
			},
			{
				hash: "american-indian-or-alaska-native",
				value: "5",
			},
			{
				hash: "asian-or-pacific-islander",
				value: "6",
			},
		],
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
	},
	{
		hash: "missing-11-or-more-school-days-due-to-illness-or-injury",
		value: "missing-11-or-more-school-days-due-to-illness-or-injury",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "six-or-more-workdays-missed-due-to-illness-injury-or-disability",
		value: "six-or-more-workdays-missed-due-to-illness-injury-or-disability",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "blood-pressure-check",
		value: "blood-pressure-check",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "calcium-intake",
		value: "calcium-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "current-cigarette-smoking",
		value: "current-cigarette-smoking",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "current-electronic-cigarette-use",
		value: "current-electronic-cigarette-use",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "dietary-fiber-intake",
		value: "dietary-fiber-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "iron-intake",
		value: "iron-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "potassium-intake",
		value: "potassium-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "saturated-fat-intake",
		value: "saturated-fat-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "sodium-intake",
		value: "sodium-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "vitamin-d-intake",
		value: "vitamin-d-intake",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	{
		hash: "access-care",
		value: "access-care",
		classificationOptions: [
			{
				hash: "delay-or-nonreceipt-of-needed-medical-care-due-to-cost",
				value: "1",
			},
			{
				hash: "nonreceipt-of-needed-prescription-drugs-due-to-cost",
				value: "2",
			},
			{
				hash: "nonreceipt-of-needed-dental-care-due-to-cost",
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
				hash: "sex-18-64-years",
				value: "2",
			},
			{
				hash: "race-18-64-years",
				value: "3",
			},
			{
				hash: "hispanic-origin-and-race-18-64-years",
				value: "4",
			},
			{
				hash: "education-25-64-years",
				value: "5",
			},
			{
				hash: "percent-of-poverty-level-18-64-years",
				value: "6",
			},
			{
				hash: "hispanic-origin-and-race-and-percent-of-poverty-level-18-64-years",
				value: "7",
			},
			{
				hash: "health-insurance-status-at-the-time-of-interview-18-64-years",
				value: "8",
			},
			{
				hash: "level-of-difficulty-18-64-years",
				value: "11",
			},
			{
				hash: "geographic-region-18-64-years",
				value: "12",
			},
			{
				hash: "location-of-residence-18-64-years",
				value: "13",
			},
		],
	},
	{
		hash: "community-hospital-beds",
		value: "community-hospital-beds",
		classificationOptions: [
			{
				hash: "community-hospital-beds",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state",
				value: "1",
			},
		],
	},
	{
		hash: "delayed-getting-medical-care-due-to-cost",
		value: "delayed-getting-medical-care-due-to-cost",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "delayed-getting-medical-care-due-to-cost-among-children",
		value: "delayed-getting-medical-care-due-to-cost-among-children",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "did-not-get-needed-medical-care-due-to-cost",
		value: "did-not-get-needed-medical-care-due-to-cost",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "did-not-get-needed-mental-health-care-due-to-cost",
		value: "did-not-get-needed-mental-health-care-due-to-cost",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "did-not-take-medication-as-prescribed-to-save-money",
		value: "did-not-take-medication-as-prescribed-to-save-money",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "exchange-based-coverage-coverage-at-time-of-interview",
		value: "exchange-based-coverage-coverage-at-time-of-interview",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: null,
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "has-a-usual-place-of-care",
		value: "has-a-usual-place-of-care",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "has-a-usual-place-of-care-among-children",
		value: "has-a-usual-place-of-care-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "medicaidU65",
		value: "medicaidU65",
		classificationOptions: [
			{
				hash: "na",
				value: "0",
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
				hash: "sex-and-marital-status-14-64-years",
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
				hash: "level-of-difficulty-18-64-years",
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
			{
				hash: "sex-and-marital-status-18-64-years",
				value: "10",
			},
		],
	},
	{
		hash: "private-health-insurance-coverage-at-time-of-interview",
		value: "private-health-insurance-coverage-at-time-of-interview",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "public-health-plan-coverage-at-time-of-interview",
		value: "public-health-plan-coverage-at-time-of-interview",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: null,
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "two-or-more-hospital-emergency-department-visits-among-children",
		value: "two-or-more-hospital-emergency-department-visits-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "two-or-more-urgent-care-center-or-retail-health-clinic-visits-among-children",
		value: "two-or-more-urgent-care-center-or-retail-health-clinic-visits-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "uninsured-at-time-of-interview",
		value: "uninsured-at-time-of-interview",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "uninsured-at-time-of-interview-among-children",
		value: "uninsured-at-time-of-interview-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "uninsured-for-at-least-part-of-the-past-year",
		value: "uninsured-for-at-least-part-of-the-past-year",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "uninsured-for-more-than-one-year",
		value: "uninsured-for-more-than-one-year",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "urgent-care-center-or-retail-health-clinic-visit",
		value: "urgent-care-center-or-retail-health-clinic-visit",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "daily-feelings-of-worry-nervousness-or-anxiety",
		value: "daily-feelings-of-worry-nervousness-or-anxiety",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "receive-services-for-mental-health-problems",
		value: "receive-services-for-mental-health-problems",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "complete-tooth-loss",
		value: "complete-tooth-loss",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "dental-exam-or-cleaning",
		value: "dental-exam-or-cleaning",
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "total-dental-caries-in-permanent-teeth",
		value: "total-dental-caries-in-permanent-teeth",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "total-dental-caries-in-primary-teeth",
		value: "total-dental-caries-in-primary-teeth",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "untreated-dental-caries-in-permanent-teeth",
		value: "untreated-dental-caries-in-permanent-teeth",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "untreated-dental-caries-in-primary-teeth",
		value: "untreated-dental-caries-in-primary-teeth",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	{
		hash: "counseled-by-a-mental-health-professional",
		value: "counseled-by-a-mental-health-professional",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "ever-received-a-pneumococcal-vaccination",
		value: "ever-received-a-pneumococcal-vaccination",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "prescription-medication-use",
		value: "prescription-medication-use",
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "prescription-medication-use-among-children",
		value: "prescription-medication-use-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "receipt-of-influenza-vaccination",
		value: "receipt-of-influenza-vaccination",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "receipt-of-influenza-vaccination-among-children",
		value: "receipt-of-influenza-vaccination-among-children",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
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
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "receiving-special-education-or-early-intervention-services",
		value: "receiving-special-education-or-early-intervention-services",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "taking-prescription-medication-for-feelings-of-depression",
		value: "taking-prescription-medication-for-feelings-of-depression",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety",
		value: "taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	{
		hash: "well-child-check-up",
		value: "well-child-check-up",
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	{
		hash: "wellness-visit",
		value: "wellness-visit",
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
];
