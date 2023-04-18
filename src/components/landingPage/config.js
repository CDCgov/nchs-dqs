import { modal, allFilters } from "./modal";
import { NHISTopics } from "./nhis";

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
					<div class="body2" aria-label="Select time periods">Select</div>
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
				<div id="startYearContainer" class="genDropdown col-6" style="display: flex; text-align: center; width: 100%">
					<label for="startYearContainer-select" id="startYearContainer-label" style="margin-right: 5px">From</label>
				</div>
				<div id="endYearContainer" class="genDropdown col-6" style="display: flex; text-align: center; width: 100%">
					<label for="endYearContainer-select" id="endYearContainer-label" style="margin-right: 25px">To</label>
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
	"active-dentists": {
		dataUrl: "https://data.cdc.gov/dataset/DQS-Active-dentists-by-state/83hb-kwqf",
		socrataId: "83hb-kwqf",
		private: "1",
		chartTitle: "Active Dentists",
		filters: "HUS",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: false,
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
