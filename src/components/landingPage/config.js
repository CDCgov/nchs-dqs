import { modal, allFilters } from "./modal";
import { NHISTopics } from "./nhis";

const NHISFilters = `Interview, ${allFilters.filter((a) => a !== "Children" && a !== "Infants").join(",")}`;

export const chartAndTableSelectors = `
	<div id="chart-table-selectors">
		<div class="viewSelectorsToggle viewSelectorsClosed">
			<div>View Options</div>
		</div>
		<div class="hideShowViewSelectors">
			<div id="estimateDropdownContainer">
				<div id="estimateTypeDropdown" class="genDropdown">
					<div id="estimateTypeDropdown-label" for="estimateTypeDropdown-select"class="select-label">Select Estimate Type</div>
				</div>
			</div>
			<div id="viewSlidersContainer">
				<div id="subGroupsSelectorsSection" class="viewSliders">
					<label for="showAllSubgroupsSlider" class="tableSliderLabel">Show All Subgroups</label>
					<label class="switch">
						<input id="showAllSubgroupsSlider" tabindex="0" type="checkbox" aria-label="show all subgroups">
						<span class="slider round"></span>
					</label>
				</div>
				<div id="ciTableSlider" class="viewSliders">
					<label for="ciToggle" class="tableSliderLabel">Show 
						<span 
							id="ciLabelTooltip"
							tabindex="0" 
							style="border-bottom: 1px dotted #000; cursor: pointer; display: inline-block;">
							Confidence Interval
						</span>
					</label>
					<label class="switch">
						<input id="confidenceIntervalSlider" name="ciToggle" tabindex="0"  type="checkbox" aria-label="show confidence interval">
						<span id="ciTableHover" class="slider round"></span>
					</label>
				</div>			
				<div id="mapBinningTypeSelector" class="viewSliders">
					<label for="mapBinningSlider" class="tableSliderLabel" style="width: unset; margin-right: 10px;">
						Show <span 
							id="qLabelTooltip"
							tabindex="0" 
							style="border-bottom: 1px dotted #000; cursor: pointer; display: inline-block;">
							quartiles
						</span> based on the most recent available period
					</label>
					<label class="switch">
						<input id="mapBinningSlider" tabindex="0" name="mapBinningSlider" type="checkbox" aria-label="show quartiles base on the most recent available period">
						<span class="slider round"></span>
					</label>
				</div>
			</div>
		</div>
	</div>
`;

export const tabContent = `
	${modal}
	<!-- TOP SELECTORS -->
	<div id="dropdownSelectorGroup" class="row dropdown-wrapper">
		<div id="topicDropdownGroup" class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="bi-1-circle-fill"></i>
				</div>
				
				<div class="col-10 homeSelectorText">
					<label class="body1">Select a</label>
					<div class="heading4">
						Topic
					</div>
				</div>
			</div>
			<div class="row spacerContainer">&nbsp;</div>
			<div id="topicDropdown" class="genDropdown">
				<label for="topicDropdown-select" id="topicDropdown-label">
					<div role="button" tabindex="0" id="refineTopicList" aria-label="Advanced Topic Selection">Advanced Topic Selection: <span id="refine-topic-list-switch">OFF</span></div>
				</label>
			</div>			
		</div>
		<div class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup leftBorderSmallView" style="display: none">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="bi-2-circle-fill"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label class="body1" for="classificationDropdown-select">Select a</label>
					<div class="heading4">Classification</div>
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
					<i class="bi-2-circle-fill"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label class="body1" for="groupDropdown-select">Select a</label>
					<div class="heading4">Group</div>
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
					<i class="bi-3-circle-fill"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label class="body1" for="groupDropdown-select">Select</label>
					<div class="heading4">Subgroup</div>
				</div>
			</div>
			<div class="row spacerContainer">&nbsp;</div>
			<div class="row spacerContainer1">&nbsp;</div>
			<div id="subgroupDropdown"></div>
		</div>
		<div class="col col-md-6 col-sm-12 mainDropdown homeSelectorGroup leftBorderMediumView leftBorderSmallView">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="bi-4-circle-fill"></i>
				</div>
				<div class="col-xl-10 col-md-4 col-sm-8 homeSelectorText">
					<div class="body1" aria-label="Select time periods">Select</div>
					<div class="heading4">Time Periods</div>
				</div>
				<div class="col-xl-12 col-md-6 col-sm-12">
					<div class="flexRow singlePeriod">
						<input style="margin-right: 8px;" type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox" />
						<label class="label-style body2">View single period</label>
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

	<div id="resetInfoContainer" class="row homeSmallGroup dropdown-wrapper">
		<!--<div class="col-lg-12 align-self-end d-inline-block" style="text-align: right">-->
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end">
			<button id="home-btn-reset" class="btn-reset body2" type="button"><i class="fas fa-undo"></i> Clear Selections</button>
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
						<div class="legend-items">
							<div id="us-map-legend-title" class="general-chart" tabindex="0">Quartiles</div>
							<div style="display: inline-block; text-align: left;" tabindex="0">
								Data classified using quartiles based on <span style="text-align: left;" id="mapLegendPeriod">2013 - 2015</span>
							</div>
							<div style="text-align: left;" id="us-map-legend" class="general-chart"></div>
						</div>
						<div class="reliability-legend">
							<span class="reliability-box">
								<img src="./images/reliability-indicator.jpg" alt="Reliability Issues" />
							</span>
							<span class="reliability-label">= Reliability Issues</span>
						</div>
					</div>
				</div>
				<br />
				<div tabindex="0" class="source-text defaultNote">For more detail on displayed data, see <a class="viewFootnotes">Notes</a>.</div>
				<div tabindex="0" class="source-text unreliableNote">Symbols such as *, **, ---, or vertical lines are used to indicate differences in reliability, data availability, or survey design. Please see <a class="viewFootnotes">Notes</a> for more information.</div>
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
						<div class="reliability-legend">
							<span class="reliability-box">
								<img src="./images/reliability-indicator.jpg" alt="Reliability Issues" />
							</span>
							<span class="reliability-label">= Reliability Issues</span>
						</div>
					</div>
				</div>
				<br />
				<div tabindex="0" class="source-text defaultNote">For more detail on displayed data, see <a class="viewFootnotes">Notes</a>.</div>
				<div tabindex="0" class="source-text unreliableNote">A vertical line is used to indicate differences in survey design. See <a class="viewFootnotes">Notes</a> for more information.</div>
				<div tabindex="0" class="source-text onlyUnreliableNote">Estimates with reliability or other data issues are either not shown or are shown with a striped line pattern. See <a class="viewFootnotes">Notes</a> for more information.</div>
				<div tabindex="0" class="source-text unreliableNoteWithVerticalLine">Estimates with reliability or other data issues are either not shown or are shown with a striped line pattern. A vertical line is used to indicate differences in survey design. See <a class="viewFootnotes">Notes</a> for more information.</div>
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
				<div tabindex="0" class="source-text defaultNote">For more detail on displayed data, see <a class="viewFootnotes">Notes</a>.</div>
				<div tabindex="0" class="source-text unreliableNote">Estimates with reliability or other data issues are shown with a symbol (such as *, ---, ...). See <a class="viewFootnotes">Notes</a> for more details.</div>
			</div>
			<!-- end chart wrapper -->
		</div>
	</div>

	<div class="dwnl-img-container margin-spacer" style="display: flex; justify-content: space-between; text-align: center">
		<span>
			<a id="cdcDataGovButton" class="theme-cyan btn" aria-label="Visit cdc.data.gov" target="_blank" rel="noopener noreferrer">
				View Data on data.cdc.gov <i class="fas fa-external-link-alt" aria-hidden="true"></i>
			</a>
		</span>
		<span>
			<button tabindex="0" id="dwn-chart-img" class="theme-cyan btn" style="margin-right: 20px">
				Download Image <i class="fas fa-image" aria-hidden="true"></i>
			</button>
			<button id="btnTableExport" class="theme-cyan btn" tabindex="0" aria-label="Download Data">				
				Download Data <i class="fas fa-external-link-alt" aria-hidden="true"></i>
			</button>
		</span>
	</div>

	<div class="data-table-container" id="pageFooterTable" style="margin-top: 10px; margin-bottom: 15px">
		<div role="button" aria-controls="pageFooter" aria-expanded="true" aria-label="footnotes" class="table-toggle" id="footer-table-toggle" tabindex="0">
			<h4 class="table-title">Notes</h4>
			<div class="table-toggle-icon"><i id="footer-table-header-icon" class="fas fa-minus"></i></div>
		</div>
		<div id="pageFooter" class="data-table" aria-hidden="false" tabindex="0"></div>
	</div>
`;

const footnoteDatasets = {
	footnotes: {
		socrataId: "m6mz-p2ij",
		private: "1",
	},
	NHISFootnotes: {
		socrataId: "gpsd-ru5i",
		private: "1",
	},
	NHISChildFootnotes: {
		socrataId: "48ev-2ygq",
		private: "1",
	},
	cshsFootnotes: {
		socrataId: "7kgb-btmk",
		private: "1",
	},
	NHAMCSFootnotes: {
		socrataId: "6vwk-ensg",
		private: "1",
	},
	NHANESFootnotes: {
		socrataId: "iqm3-hbev",
		private: "1",
	},
};

const singleTopicDatasets = {
	"obesity-child": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					// classification: d.classification,
					// classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "https://data.cdc.gov/dataset/dev_dqs_obesity_among_children_and_adolescents_age/w9cp-q6sg",
		socrataId: "w9cp-q6sg",
		private: "1",
		chartTitle: "Obesity among children, measured by age",
		filters: "HUS,NHANES,AsianPacific,Black,Children,Hispanic,Poverty,White",
		dataSystem: "HUS,NHANES",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 18,
		subtopics: [
			{ id: "1", text: "2-19 years" },
			{ id: "2", text: "2-5 years" },
			{ id: "3", text: "6-11 years" },
			{ id: "4", text: "12-19 years" },
		],
	},
	"obesity-adult": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			console.log("obesity-adult: ", data);
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					// classification: d.classification,
					// classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "https://data.cdc.gov/dataset/dev_dqs_Normal_weight__overweight__and_obesity_amo/sqt4-6a3k",
		socrataId: "sqt4-6a3k",
		private: "1",
		chartTitle: "BMI among adults, measured",
		filters: "HUS,NHANES,Adults,Asian,Black,Hispanic,Poverty,White,Male,Female",
		dataSystem: "HUS,NHANES",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 18,
		subtopics: [
			{ id: "1", text: "Normal weight (BMI from 18.5 to 24.9)" },
			{ id: "2", text: "Overweight or obese (BMI greater than or equal to 25.0)" },
			{ id: "3", text: "Obesity (BMI greater than or equal to 30.0)" },
			{ id: "4", text: "Grade 1 obesity (BMI from 30.0 to 34.9)" },
			{ id: "5", text: "Grade 2 obesity (BMI from 35.0 to 39.9)" },
			{ id: "6", text: "Grade 3 obesity (BMI greater than or equal to 40.0)" },
		],
	},
	suicide: {
		dataUrl: "https://data.cdc.gov/resource/e8w2-ekn5.json",
		socrataId: "e8w2-ekn5",
		private: "1",
		chartTitle: "Death Rates for Suicide",
		filters: "HUS,NVSS,Adults,Older,Asian,AsianPacific,Indian,Black,Children,Hispanic,Hawaiian,White,Male,Female",
		dataSystem: "HUS,NVSS",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: true,
		hasClassification: false,
		topicGroup: 6,
	},
	injury: {
		hasCustomMapper: true,
		dataMapper: (data) =>
			data.map((d) => ({
				...d,
				indicator: d.topic,
				panel: "hospital-emergency-department-visits-related-to-injury",
				panel_num: "0",
				stub_label: d.subgroup,
				stub_label_num: d.subgroup_id,
				stub_label_order: d.subgroup_order,
				stub_name: d.group,
				stub_name_num: d.group_id,
				stub_name_order: d.group_order,
				unit: d.estimate_type,
				unit_num: d.estimate_type_id,
				year: d.time_period,
				year_num: d.time_period_id,
				classification_num: d.classification_id,
				age: d.group.includes("By age") ? f.group : "N/A",
			})),
		dataUrl: "data.cdc.gov/resource/qdzf-zqgy.json",
		socrataId: "qdzf-zqgy",
		private: "1",
		chartTitle: "Hospital emergency department visits related to injury",
		filters: "HUS,NHAMCS,Adults,Older,Children,Male,Female",
		dataSystem: "HUS,NHAMCS",
		classificationId: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasClassification: false,
		topicGroup: 12,
	},
	"infant-mortality": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "data.cdc.gov/resource/pjb2-jvdr.json",
		socrataId: "pjb2-jvdr",
		private: "1",
		chartTitle: "Infant Mortality by race",
		filters: "HUS,NVSS,Infants,Indian,AsianPacific,Black,Children,Hispanic,White",
		dataSystem: "HUS,NVSS",
		classificationId: 0,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		binGranularity: 0.1,
		topicGroup: 6,
		subtopics: [
			{
				text: "Total",
				id: "0",
			},
			{
				text: "All races, Hispanic origin",
				id: "1",
			},
			{
				text: "American Indian and Alaska Native",
				id: "2",
			},
			{
				text: "Asian or Pacific Islander",
				id: "3",
			},
			{
				text: "Black, non-Hispanic",
				id: "4",
			},
			{
				text: "White, non-Hispanic",
				id: "5",
			},
		],
	},
	birthweight: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Low-birthweight-live-births-by-race-and-Hispan/3p8z-99bn",
		socrataId: "3p8z-99bn",
		private: "1",
		chartTitle: "Low birthweight live birth by race",
		filters: "HUS,NVSS,Infants,AsianPacific,Indian,Black,Children,Hispanic,White",
		dataSystem: "HUS,NVSS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: true,
		binGranularity: 0.01,
		topicGroup: 21,
		subtopics: [
			{ id: "1", text: "All races" },
			{ id: "2", text: "Not Hispanic or Latina: White" },
			{ id: "3", text: "Not Hispanic or Latina: Black or African American" },
			{ id: "4", text: "Hispanic or Latina: All races" },
			{ id: "5", text: "American Indian or Alaska Native" },
			{ id: "6", text: "Asian or Pacific Islander" },
		],
	},
	medicaidU65: {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					se: d.standard_error,
					estimate: d.estimate,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.topic,
					panel_num: "0",
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "https://data.cdc.gov/dataset/dev_dqs_Medicaid_coverage_among_persons_under_age_/hdja-ybdg",
		socrataId: "hdja-ybdg",
		private: "1",
		chartTitle: "Medicaid coverage among people younger than 65 years",
		filters:
			"HUS,NHIS,Adults,Indian,Asian,AsianPacific,Black,Children,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Marital,Metropolitan,MultipleRace,Hawaiian,Poverty,Region,White",
		dataSystem: "HUS,NHIS",
		classificationId: "NA",
		yAxisUnitId: 2,
		hasCI: true,
		hasClassification: false,
		topicGroup: 13,
	},
	"drug-overdose": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					se: d.standard_error,
					estimate_lci: d.estimate_lci,
					estimate_uci: d.estimate_uci,
					estimate: d.estimate,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "https://data.cdc.gov/dataset/dev_dqs_Drug_overdose_death_rates__by_drug_type__s/dh32-cnpq",
		socrataId: "dh32-cnpq",
		private: "1",
		chartTitle: "Death rates from drug overdose",
		filters: "HUS,NVSS,Adults,Indian,Asian,AsianPacific,Black,Children,Female,Hispanic,Male,Hawaiian,Older,White",
		dataSystem: "HUS,NVSS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 6,
		subtopics: [
			{ id: "1", text: "All drug overdose deaths" },
			{ id: "2", text: "Drug overdose deaths involving any opioid" },
			{ id: "3", text: "Drug overdose deaths involving natural and semisynthetic opioids" },
			{ id: "4", text: "Drug overdose deaths involving methadone" },
			{ id: "5", text: "Drug overdose deaths involving other synthetic opioids (other than methadone)" },
			{ id: "6", text: "Drug overdose deaths involving heroin" },
		],
	},
	"ambulatory-care": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "data.cdc.gov/resource/xmjk-wh9b.json",
		socrataId: "xmjk-wh9b",
		private: "1",
		chartTitle: "Physician office and hospital emergency department visits",
		filters: "HUS,NHAMCS,NAMCS,Adults,Black,Children,Female,Male,Older,Region,White",
		dataSystem: "HUS,NHAMCS,NAMCS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasClassification: true,
		topicGroup: 12,
		subtopics: [
			{ id: "1", text: "Physician offices" },
			{ id: "2", text: "Hospital emergency departments" },
		],
	},
	"access-care": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			console.log("community hospital beds data mapper: ", data);
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "https://data.cdc.gov/dataset/dev_dqs_Delay_or_nonreceipt_of_needed_medical_care/p4r5-qsgs",
		socrataId: "p4r5-qsgs",
		private: "1",
		chartTitle: "Unmet need for health care due to cost",
		filters:
			"HUS,NHIS,Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White",
		dataSystem: "HUS,NHIS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasClassification: true,
		topicGroup: 10,
		subtopics: [
			{ id: "1", text: "Delay or nonreceipt of needed medical care due to cost" },
			{ id: "2", text: "Nonreceipt of needed prescription drugs due to cost" },
			{ id: "3", text: "Nonreceipt of needed dental care due to cost" },
		],
	},
	"community-hospital-beds": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			console.log("community hospital beds data mapper: ", data);
			return data.map((d) => {
				return {
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					// classification: d.classification,
					// classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: "data.cdc.gov/dataset/DQS-Community-hospital-beds-by-state/tjtn-y8d3.json",
		socrataId: "tjtn-y8d3",
		private: "1",
		chartTitle: "Community hospital beds",
		filters: "HUS",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: false,
		disabledNestedGroup: true,
		binGranularity: 0.1,
		topicGroup: 11,
	},
	"active-dentists": {
		hasCustomMapper: true,
		dataMapper: (data) => {
			return data.map((d) => {
				return {
					...d,
					indicator: d.topic,
					panel: "active-dentists",
					panel_num: "0",
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
				};
			});
		},
		dataUrl: " https://data.cdc.gov/dataset/DQS_Active_dentists_by_state_2-23-24/9epi-jrff",
		socrataId: "9epi-jrff",
		private: "1",
		chartTitle: "Dentists",
		filters: "HUS",
		dataSystem: "HUS",
		classificationId: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasMap: true,
		hasClassification: false,
		binGranularity: 0.1,
		topicGroup: 10,
	},
};

const multipleTopicDatasets = {
	NHIS: {
		socrataId: "pg2r-sfcx",
		private: "1",
		dataMapper: (data, dataId) => {
			let filteredToIndicator = data.filter((d) => d.topic === dataId);
			if (filteredToIndicator.length === 0) {
				const dId = NHISTopics.find((t) => t.text === dataId)?.indicator;
				filteredToIndicator = data.filter((d) => d.topic === dId);
			}
			const returnData = [];
			filteredToIndicator.forEach((f) =>
				returnData.push({
					estimate: f.estimate,
					estimate_lci: f.estimate_lci,
					estimate_uci: f.estimate_uci,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.topic,
					panel: f.topic,
					panel_num: "0",
					se: null,
					stub_label: f.subgroup,
					stub_label_order: f.subgroup_order,
					stub_label_num: f.subgroup_id,
					stub_name: f.group,
					stub_name_num: f.group_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.time_period,
					year_num: f.time_period_id,
					age: f.group.includes("By age") ? f.group : "N/A",
				})
			);

			return returnData;
		},

		hasGroupMapper: true,
	},
	"children-summary-statistics": {
		socrataId: "b5qi-b3hv",
		private: "1",
		filters: `Interview, ${allFilters
			.filter((a) => a !== "Adults" && a !== "Infants" && a !== "Older Adults")
			.join(",")}`,
		dataMapper: (data, dataId) => {
			let filteredToIndicator = data.filter((d) => d.topic === dataId);
			if (filteredToIndicator.length === 0) {
				const dId = NHISTopics.find((t) => t.text === dataId)?.indicator;
				filteredToIndicator = data.filter((d) => d.topic === dId);
			}
			const returnData = [];
			filteredToIndicator.forEach((f) =>
				returnData.push({
					estimate: f.estimate,
					estimate_lci: f.estimate_lci,
					estimate_uci: f.estimate_uci,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.topic,
					panel: f.topic,
					panel_num: "0",
					se: null,
					stub_label: f.subgroup,
					stub_label_order: f.subgroup_order,
					stub_label_num: f.subgroup_id,
					stub_name: f.group,
					stub_name_num: f.group_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.time_period,
					year_num: f.time_period_id,
					age: f.group.includes("By age") ? f.group : "N/A",
				})
			);

			return returnData;
		},
	},
	NHAMCS: {
		socrataId: "k6sd-3kb8",
		private: "1",
		filters: `Interview, ${allFilters
			.filter((t) => !["FuncLimitStatus", "Marital", "Education", "Poverty", "SVI"].includes(t))
			.join(",")}`,
		dataMapper: (data, dataId) => {
			const dataIndicator = NHISTopics.find((t) => t.indicator === dataId)?.indicator;
			const filteredToIndicator = data.filter((d) => d.topic === dataIndicator);
			const returnData = [];
			filteredToIndicator.forEach((d) => {
				returnData.push({
					estimate: d.estimate,
					estimate_lci: null,
					estimate_uci: null,
					flag: d.flag,
					footnote_id_list: d.footnote_id_list,
					indicator: d.topic,
					panel: d.subtopic,
					panel_num: d.subtopic_id,
					se: null,
					stub_label: d.subgroup,
					stub_label_num: d.subgroup_id,
					stub_label_order: d.subgroup_order,
					stub_name: d.group,
					stub_name_num: d.group_id,
					stub_name_order: d.group_order,
					unit: d.estimate_type,
					unit_num: d.estimate_type_id,
					year: d.time_period,
					year_num: d.time_period_id,
					classification: d.classification,
					classification_num: d.classification_id,
					age: d.group.includes("By age") ? f.group : "N/A",
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
		socrataId: "59vz-u8kg",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure.toLowerCase() === dataId.toLowerCase());
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.percent,
					estimate_lci: f.lower_95pct_ci,
					estimate_uci: f.upper_95pct_ci,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group,
					stub_name_num: f.group_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"nhanes-infectious-disease": {
		socrataId: "be3w-4inw",
		private: "1",
		dataMapper: (data, dataId) => {
			const filteredToIndicator = data.filter((d) => d.measure.toLowerCase() === dataId.toLowerCase());
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.estimate,
					estimate_lci: f.lower_95pct_ci_limit,
					estimate_uci: f.upper_95pct_ci_limit,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.measure,
					panel: f.subtopic,
					panel_num: f.subtopic_id,
					se: null,
					stub_label: f.subgroup,
					stub_name: f.group,
					stub_name_num: f.group_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.survey_years,
					year_num: "",
					age: f.group.includes("Age Group") ? f.group : "N/A",
				});
			});

			return returnData;
		},
	},
	"wonder-hus-heart-disease": {
		socrataId: "4892-xxjy",
		private: "1",
		dataMapper: (data, dataId) => {
			const dataIndicator = NHISTopics.find((t) => t.indicator === dataId)?.indicator;
			const filteredToIndicator = data.filter((d) => d.topic === dataIndicator);
			const returnData = [];
			filteredToIndicator.forEach((f) => {
				returnData.push({
					estimate: f.estimate,
					estimate_lci: f.estimate_lci,
					estimate_uci: f.estimate_uci,
					flag: f.flag,
					footnote_id_list: f.footnote_id_list,
					indicator: f.topic,
					panel: f.topic,
					panel_num: "0",
					se: null,
					stub_label: f.subgroup,
					stub_label_order: f.subgroup_order,
					stub_label_num: f.subgroup_id,
					stub_name: f.group,
					stub_name_num: f.group_id,
					unit: f.estimate_type,
					unit_num: f.estimate_type_id,
					year: f.time_period,
					year_num: f.time_period_id,
					age: f.group.includes("By age") ? f.group : "N/A",
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
	if (t.filters) {
		filters = `${NHISFilters},${t.filters.join(",")}`;
	}

	topicLookup[t.id] = {
		dataUrl: t.dataUrl,
		socrataId: t.indicator || t.text,
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
		...(t.subtopics && { subtopics: t.subtopics }),
	};
});

export const topicGroups = [
	"Arthritis", // 0
	"Asthma", // 1
	"Attention deficit/hyperactivity disorder", // 2
	"Cancer", // 3
	"Cardiovascular diseases", // 4
	"Chronic obstructive pulmonary disease", // 5
	"Death and fatality rates", // 6
	"Diabetes", // 7
	"Disabilities", // 8
	"Employment status", // 9
	"Healthcare access and quality", // 11 -> 10
	"Healthcare capacity", // 12 -> 11
	"Healthcare system use", // 13 -> 12
	"Health insurance", // 14 -> 13
	"Healthy eating and nutrition", // 10 -> temp -> 14
	"Infectious diseases", // 15
	"Mass screening", // 16
	"Mental wellness", // 17
	"Overweight and obesity", // 18
	"Oral health", // 19
	"Pain", // 20
	"Pregnancy", // 21
	"Public health indicators", // 22
	"School attendance", // 23
	"Substance use and abuse", // 24
	"Treatment", // 25
	"Vaccines and vaccination", // 26
];
// "Diseases and conditions", // 0
// "Epidemiology and health metrics", // 1
// "Health behavior and risks", // 2
// "Health systems", // 3
// "Mental Health  ", // 4
// "Oral Health", // 5
// "Prevention, control, and treatment", // 6

window.topicLookup = topicLookup;
window.NHISTopics = NHISTopics;
