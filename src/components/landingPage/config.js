export const tabContent = `
	<!-- TOP SELECTORS -->
	<div class="row">
		<div id="topicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="data-topic-select" class="preSelText" aria-label="Select a Topic">Select a</label>
					<div class="mainSelText">Topic</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="data-topic-select-box" id="data-topic-select" form="select-view-options">
						<option value="obesity-child" selected>Obesity among Children</option>
						<option value="obesity-adult">Obesity among Adults</option>
						<option value="suicide">Death Rates for Suicide</option>
						<option value="injury">Initial injury-related visits to hospital emergency departments</option>
						<option value="infant-mortality">Infant Mortality</option>
						<option value="birthweight">Low birthweight live births</option>
						<option value="medicaidU65">Medicaid coverage among persons under age 65</option>
						<option value="drug-overdose">Deaths from drug overdose</option>
						<option value="ambulatory-care">Ambulatory Care Visits</option>
						<option value="access-care">Access to Care</option>
				</select>
			</div>
		</div>
		<div id="subtopicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="panel-num-select" class="preSelText" aria-label="Refine to a Subtopic">Refine to a</label>
					<div class="mainSelText">Subtopic</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="panel-num-select-box" id="panel-num-select" form="select-view-options">
				</select>						
			</div>
		</div>
		<div id="characteristicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="stub-name-num-select" class="preSelText" aria-label="View Data by Characteristic">View Data by</label>
					<div class="mainSelText">Characteristic</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="stub-name-num-select-box" id="stub-name-num-select" form="select-view-options">
				</select>
			</div>
		</div>
		<div id="timePeriodsSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<div class="preSelText" aria-label="Choose from available time periods">Choose from available</div>
					<div class="mainSelText">Time Periods</div>
				</div>
			</div>
			<div class="row" style="text-align: center">
				<div class="col-12">
					<div style="margin-top: 0.4vw; line-height: 1vw">
						<input type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox" />
						<label class="label-style" for="show-one-period-checkbox">View single period</label>
					</div>
				</div>
			</div>
			<div class="row timePeriodContainer">
				<div id="startYearContainer" class="col-6" style="text-align: center">
					<label for="year-start-select" class="label-style" id="year-start-label">Start Period</label>
					<div class="styled-select">
						<select name="year-start" id="year-start-select" form="select-view-options">
						</select>
					</div>
				</div>
				<div id="endYearContainer" class="col-6" style="text-align: center">
					<label for="year-end-select" class="label-style" id="year-end-label">End Period</label>
					<div class="styled-select">
						<select name="year-end" id="year-end-select" form="select-view-options">
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- #b3d2ce -->
	<div id="resetInfoContainer" class="row homeSmallGroup">
		<div id="additionalFiltersContainer" class="col-lg-5 col-md-6 col-sm-6">
			<div id="addFiltersTextContainer" class="col homeSmallIcon d-inline-block">
				<i class="fas fa-caret-right"></i>
				<span role="button" class="homeSmallText">View Additional Filters</span>
			</div>
			<div id="editFiltersTextContainer" class="col homeTinyIcon d-inline-block float-right">
				<i class="fas fa-pen fa-xs"></i>
				<span role="button" class="homeTinyText" style="text-decoration-line: underline">Edit Your Filters</span>
			</div>
		</div>

		<div class="col col-lg-4 col-md-3 col-sm-6 align-self-end d-inline-block" style="text-align: right">
			<i id="resetInfo" class="fas fa-info-circle" style="font-size: 0.8em; color: #0033a1">&nbsp;</i>

			<button id="home-btn-reset" class="btn-reset" type="button"><i class="fas fa-undo"></i> Reset</button>
		</div>
	</div>

	<br />

	<div tabindex="0" class="chart-titles space-util" style="text-align: center">
		<span id="chart-title" class="chart-title"></span><br />
		<span tabindex="0" id="chart-subtitle"></span>
	</div>

	<!-- Tabs navs -->
	<div id="tabs">
		<div class="ui inverted dimmer">
			<div class="ui text loader">Loading</div>
		</div>
		<ul>
			<li id="mapTab-li"><a href="#map-tab"><i class="fas fa-map fa-fw me-2"></i> Map</a></li>
			<li><a href="#chart-tab"><i class="fas fa-chart-line fa-fw me-2"></i> Chart</a></li>
			<li><a href="#table-tab"><i class="fas fa-table fa-fw me-2"></i> Table</a></li>
		</ul>
		<div id="map-tab" aria-labelledby="ex-with-icons-tab-1">
			<div class="map-wrapper" style="background-color: #b3d2ce; margin-top: 0px; padding-top: 1px">
				<div class="adjustUnitContainer">
					<label for="unit-num-select-map" aria-label="Adjust Unit">Adjust Unit</label>
                    <br />
					<select name="unit-num-select-map-box" id="unit-num-select-map" form="select-view-options">
						<option value="1" selected>Percent of population, crude</option>
					</select>
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
					<div id="us-map-message" class="chart-title"></div>
					<div id="us-map-time-slider" class="general-chart" data-html2canvas-ignore style="margin-top: 0"></div>
					<div id="us-map-legend" class="general-chart" style="margin-top: 0"></div>
				</div>
				<br />
				<div tabindex="0" class="source-text" id="source-text-map"><b>Source</b>: No source info available.</div>
			</div>
		</div>
		<!-- end map wrapper -->
		<div id="chart-tab" aria-labelledby="ex-with-icons-tab-2">
			<div class="chart-wrapper" style="background-color: #b3d2ce;">
				<div class="adjustUnitContainer">
					<label for="unit-num-select-chart" aria-label="Adjust Unit">Adjust Unit</label>
                    <br />
					<select name="unit-num-select-chart-box" id="unit-num-select-chart" form="select-view-options">
						<option value="1" selected>Percent of population, crude</option>
					</select>

					<div class="checkbox-style" id="enable-CI-checkbox-wrapper" style="display: inline">
						<input type="checkbox" id="enable-CI-checkbox" name="enable-CI-checkbox" />
						<label for="enable-CI-checkbox">Enable 95% Confidence Intervals</label>
					</div>
				</div>
				<div id="chart-container"></div>
				<br />
				<div tabindex="0" class="source-text" id="source-text-chart"><b>Source</b>: Data is unavailable for selections chosen.</div>
			</div>
			<!-- end chart wrapper -->
		</div>
		<div id="table-tab" aria-labelledby="ex-with-icons-tab-3">
			<div class="table-wrapper" style="background-color: #b3d2ce; margin-top: 0px; padding-top: 1px">
				<div class="adjustUnitContainer">
					<label for="unit-num-select-table" aria-label="Adjust Unit">Adjust Unit</label>
                    <br />
					<select name="unit-num-select-table-box" id="unit-num-select-table" form="select-view-options">
						<option value="1" selected>Percent of population, crude</option>
					</select>
				</div>
				<div id="nchs-table-container">
					<div id="table-title" class="title"></div>
				</div>
				<div class="scrolling-table-container">
					<table id="nchs-table" class="expanded-data-table"></table>
				</div>
				<br />
			</div>
			<!-- end chart wrapper -->
		</div>
	</div>

	<div class="dwnl-img-container margin-spacer" style="display: flex; justify-content: space-between; text-align: center">
		<span>
			<a id="cdcDataGovButton" class="theme-cyan ui btn" aria-label="Visit cdc.data.gov" target="_blank" rel="noopener noreferrer">
				View Data on data.cdc.gov <i class="fas fa-download" aria-hidden="true"></i>
			</a>
		</span>
		<span>
			<button tabindex="0" id="dwn-chart-img" class="theme-cyan ui btn" style="margin-right: 20px">
				Download Image <i class="fas fa-image" aria-hidden="true"></i>
			</button>
			<button id="btnTableExport" class="theme-cyan ui btn" tabindex="0" aria-label="Download Data">
				Download Data <i class="fas fa-download" aria-hidden="true"></i>
			</button>
		</span>
	</div>

	<div class="data-table-container" id="pageFooterTable" style="margin-top: 10px; margin-bottom: 15px">
		<div class="table-toggle closed" id="footer-table-toggle" tabindex="0">
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
	"obesity-child": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Obesity-among-children-and-adolescents-aged-2-/64sz-mcbq",
		socrataId: "64sz-mcbq",
		private: "1",
		chartTitle: "Obesity among Children",
		panelNum: 1,
		unitNum: 1,
		hasCI: true,
		hasSubtopic: true,
	},
	"obesity-adult": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Normal-weight-overweight-and-obesity-among-adu/23va-ejrn",
		socrataId: "23va-ejrn",
		private: "1",
		chartTitle: "Obesity among Adults",
		panelNum: 1,
		unitNum: 1,
		hasCI: true,
		hasSubtopic: true,
	},
	suicide: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Death-rates-for-suicide-by-sex-race-Hispanic-o/u9f7-4q6s",
		socrataId: "u9f7-4q6s",
		private: "1",
		chartTitle: "Death Rates for Suicide",
		panelNum: 1,
		unitNum: 2,
		hasCI: false,
		hasSubtopic: false,
	},
	injury: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Initial-injury-related-visits-to-hospital-emer/k99r-jkp7",
		socrataId: "k99r-jkp7",
		private: "1",
		chartTitle: "Initial injury-related visits to hospital emergency departments",
		panelNum: 1,
		unitNum: 2,
		hasCI: false,
		hasSubtopic: false,
	},
	birthweight: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Low-birthweight-live-births-by-race-and-Hispan/3p8z-99bn",
		socrataId: "3p8z-99bn",
		private: "1",
		chartTitle: "Low birthweight live births",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasMap: true,
		hasSubtopic: true,
	},
	"infant-mortality": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Infant-mortality-rates-by-race-and-Hispanic-or/bzax-vvbx",
		socrataId: "bzax-vvbx",
		private: "1",
		chartTitle: "Infant Mortality",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasMap: true,
		hasSubtopic: true,
	},
	medicaidU65: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Medicaid-coverage-among-persons-under-age-65-b/2g8y-scu5",
		socrataId: "2g8y-scu5",
		private: "0",
		chartTitle: "Medicaid coverage among persons under age 65",
		panelNum: "NA",
		unitNum: 2,
		hasCI: true,
		hasSubtopic: false,
	},
	"drug-overdose": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Drug-overdose-death-rates-by-drug-type-sex-age/52ij-h8yw",
		socrataId: "52ij-h8yw",
		private: "1",
		chartTitle: "Deaths from drug overdose",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	access: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Delay-or-nonreceipt-of-needed-medical-care-pre/nt5r-ak33",
		socrataId: "",
		private: "1",
		chartTitle: "",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	visits: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Visits-to-physician-offices-hospital-outpatien/tz8d-jy2e",
		socrataId: "",
		private: "1",
		chartTitle: "",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	"ambulatory-care": {
		dataUrl: "https://data.cdc.gov/resource/tz8d-jy2e.json",
		socrataId: "tz8d-jy2e",
		private: "1",
		chartTitle: "Ambulatory Care Visits",
		panelNum: 1,
		unitNum: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	"access-care": {
		dataUrl: "https://data.cdc.gov/resource/nt5r-ak33.json",
		socrataId: "nt5r-ak33",
		private: "1",
		chartTitle: "Access to Care",
		panelNum: 1,
		unitNum: 1,
		hasCI: true,
		hasSubtopic: true,
	},
};

export const vizConfig = {
	caseObesity: {
		title: "Obesity in Children and Adolescents",
		subtitle: "Total Cases",
		ySelect: "estimate",
		tooltipLabel: "New Cases per 100K",
		yLabel: "Cases",
		subnav: "newcasesper100ksubmission",
		calloutBox: "This is the callout box data explanation",
	},
	deathRawCumulativeSubmission: {
		title: "Cumulative deaths attributed to Covid-19, reported to CDC, in",
		subtitle: "Cumulative deaths by number of days since 100 total deaths first recorded",
		ySelect: "tot_death",
		tooltipLabel: "Total Deaths",
		yLabel: "Deaths",
		subnav: "totaldeathssubmission",
		calloutBox:
			"This allows you to compare trends in the cumulative number of deaths for up to 6 states, territories, or HHS regions.",
	},
};

export const hashLookup = [
	{
		hash: "obesity-children",
		value: "obesity-child",
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
		"panel-num-select": [
			{
				hash: "NA",
				value: "0",
			},
		],
	},
	{
		hash: "infant-mortality",
		value: "infant-mortality",
		"stub-name-num-select": [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		"panel-num-select": [
			{
				hash: "All-races",
				value: "1",
			},
			{
				hash: "Not-Hispanic-or-Latina_White",
				value: "2",
			},
			{
				hash: "Not-Hispanic-or-Latina_Black-or-African-American",
				value: "3",
			},
			{
				hash: "Hispanic-or-Latina_All-races",
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
		"stub-name-num-select": [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		"panel-num-select": [
			{
				hash: "All-races",
				value: "1",
			},
			{
				hash: "Not-Hispanic-or-Latina_White",
				value: "2",
			},
			{
				hash: "Not-Hispanic-or-Latina_Black-or-African-American",
				value: "3",
			},
			{
				hash: "Hispanic-or-Latina_All-races",
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
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
		"panel-num-select": [
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
		"stub-name-num-select": [
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
				hash: "percent-of_poverty_level",
				value: "6",
			},
			{
				hash: "hispanic-origin-race-and-percent-of_poverty_level",
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
