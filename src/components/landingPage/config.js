import { modal } from "./modal";
import { nhisHash, nhisTopics } from "./nhis";

export const tabContent = `
	${modal}
	<!-- TOP SELECTORS -->
	<div id="dropdownSelectorGroup" class="row">
		<div id="topicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="data-topic-select" class="preSelText" aria-label="Select a Topic">Select a</label>
					<div class="mainSelText">
						Topic
						<span>
							<span id="clearFiltersContainer" class="fa-stack clearAllFilters" style="display: none">
								<i class="clearFiltersIcons fa fa-filter fa-stack-1x"></i>
  								<i class="clearFiltersIcons fa fa-slash fa-stack-1x"></i>
							</span>
							<span id="editFiltersContainer" class="fa-stack callFiltersModal">
								<i class="editFiltersIcon fa fa-filter fa-stack-1x"></i>
							</span>
						</span>						
					</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="data-topic-select-box" id="data-topic-select" form="select-view-options">
					<option value="obesity-child" selected data-filters="AsianPacific,Black,Children,Hispanic,Poverty,White">Obesity among Children</option>
					<option value="obesity-adult" data-filters="Adults,Asian,Black,Hispanic,Poverty,White,Male,Female">Obesity among Adults</option>
					<option value="suicide" data-filters="Adults,Older,Asian,AsianPacific,Indian,Black,Children,Hispanic,Hawaiian,White,Male,Female">Death Rates for Suicide</option>
					<option value="injury" data-filters="Adults,Older,Children,Male,Female">Initial injury-related visits to hospital emergency departments</option>
					<option value="infant-mortality" data-filters="Infants,Indian,AsianPacific,Black,Children,Hispanic,White">Infant Mortality</option>
					<option value="birthweight" data-filters="Infants,AsianPacific,Indian,Black,Children,Hispanic,White">Low birthweight live births</option>
					<option value="medicaidU65" data-filters="Adults,Indian,Asian,AsianPacific,Black,Children,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Marital,Metropolitan,MultipleRace,Hawaiian,Poverty,Region,White">Medicaid coverage among persons under age 65</option>
					<option value="drug-overdose" data-filters="Adults,Indian,Asian,AsianPacific,Black,Children,Female,Hispanic,Male,Hawaiian,Older,White">Deaths from drug overdose</option>
					<option value="ambulatory-care" data-filters="Adults,Black,Children,Female,Male,Older,Region,White">Ambulatory Care Visits</option>
					<option value="access-care" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Access to Care</option>
					<option value="angina-pectoris" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Angina/angina pectoris</option>
					<option value="any-skin-cancer" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Any skin cancer</option>
					<option value="any-type-of-cancer" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Any type of cancer</option>
					<option value="arthritis-diagnosis" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Arthritis diagnosis</option>
					<option value="asthma-episode-attack" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Asthma episode/attack</option>
					<option value="blood-pressure-check" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Blood pressure check</option>
					<option value="breast-cancer" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Breast cancer</option>
					<option value="cervical-cancer" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Cervical cancer</option>
					<option value="COPD-emphysema-chronic-bronchitis" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">COPD, emphysema, chronic bronchitis</option>
					<option value="coronary-heart-disease" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Coronary Heart Disease</option>
					<option value="counseled-by-a-mental-health-professional" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Counseled by a mental health professional</option>
					<option value="current-asthma" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Current asthma</option>
					<option value="current-cigarette-smoking" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Current cigarette smoking</option>
					<option value="current-electronic-cigarette-use" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Current electronic cigarette use</option>
					<option value="delayed-getting-medical-care-due-to-cost" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Delayed getting medical care due to cost</option>
					<option value="dental-exam-or-cleaning" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Dental exam or cleaning</option>
					<option value="diagnosed-diabetes" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Diagnosed diabetes</option>
					<option value="diagnosed-hypertension" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Diagnosed hypertension</option>
					<option value="did-not-get-needed-medical-care-due-to-cost" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Did not get needed medical care due to cost</option>
					<option value="did-not-get-needed-mental-health-care-due-to-cost" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Did not get needed mental health care due to cost</option>
					<option value="did-not-take-medication-as-prescribed-to-save-money" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Did not take medication as prescribed to save money</option>
					<option value="difficulty-communicating" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty communicating</option>
					<option value="difficulty-hearing" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty hearing</option>
					<option value="difficulty-remembering-or-concentrating" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty remembering or concentrating</option>
					<option value="difficulty-seeing" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty seeing</option>
					<option value="difficulty-walking-or-climbing-steps" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty walking or climbing steps</option>
					<option value="difficulty-with-self-care" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Difficulty with self care</option>
					<option value="disability-status-(composite)" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Disability status (composite)</option>
					<option value="doctor-visit" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Doctor visit</option>
					<option value="ever-received-a-pneumococcal-vaccination" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Ever received a pneumococcal vaccination</option>
					<option value="exchange-based-coverage-coverage-at-time-of-interview" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Exchange-based coverage coverage at time of interview</option>
					<option value="fair-or-Less-than-100%-FPL-health-status" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Fair or Less than 100% FPL health status</option>
					<option value="fair-or-poor-health-status" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Fair or poor health status</option>
					<option value="has-a-usual-place-of-care" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Has a usual place of care</option>
					<option value="heart-attack-myocardial-infarction" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Heart attack/myocardial infarction</option>
					<option value="high-cholesterol" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">High cholesterol</option>
					<option value="hospital-emergency-department-visit" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Hospital emergency department visit</option>
					<option value="obesity" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Obesity</option>
					<option value="prescription-medication-use" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Prescription medication use</option>
					<option value="private-health-insurance-coverage-at-time-of-interview" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Private health insurance coverage at time of interview</option>
					<option value="prostate-cancer" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Prostate cancer</option>
					<option value="public-health-plan-coverage-at-time-of-interview" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Public health plan coverage at time of interview</option>
					<option value="receipt-of-influenza-vaccination" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Receipt of influenza vaccination</option>
					<option value="regularly-experienced-chronic-pain" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Regularly experienced chronic pain</option>
					<option value="regularly-had-feelings-of-depression" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Regularly had feelings of depression</option>
					<option value="regularly-had-feelings-of-worry-nervousness-or-anxiety" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Regularly had feelings of worry, nervousness, or anxiety</option>
					<option value="six-or-more-workdays-missed-due-to-illness-injury-or-disability" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Six or more workdays missed due to illness, injury, or disability</option>
					<option value="taking-prescription-medication-for-feelings-of-depression" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Taking prescription medication for feelings of depression</option>
					<option value="taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Taking prescription medication for feelings of worry, nervousness, or anxiety</option>
					<option value="uninsured-at-time-of-interview" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Uninsured at time of interview</option>
					<option value="uninsured-for-at-least-part-of-the-past-year" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Uninsured for at least part of the past year</option>
					<option value="uninsured-for-more-than-one-year" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Uninsured for more than one year</option>
					<option value="urgent-care-center-or-retail-health-clinic-visit" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Urgent care center or retail health clinic visit</option>
					<option value="wellness-visit" data-filters="Adults,Indian,Asian,Black,Children,Education,Female,FuncLimitStatus,InsuranceStatus,Hispanic,Male,Metropolitan,MultipleRace,Hawaiian,Older,Poverty,Region,White">Wellness visit</option>
				</select>
			</div>
		</div>
		<div id="subtopicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="subtopicSelect" class="preSelText" aria-label="Refine to a Subtopic">Refine to a</label>
					<div class="mainSelText">Subtopic</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="subtopic select" id="subtopicSelect" form="select-view-options"></select>						
			</div>
		</div>
		<div id="characteristicSelectorGroup" class="col-lg-3 col-md-6 col-sm-12 homeSelectorGroup">
			<div class="row">
				<div class="col-2 homeIcon">
					<i class="fas fa-arrow-circle-right"></i>
				</div>
				<div class="col-10 homeSelectorText">
					<label for="characteristicSelect" class="preSelText" aria-label="View Data by Characteristic">View Data by</label>
					<div class="mainSelText">
						Characteristic
						<!--<span>
							<span class="fa-stack clearAllFilters" style="display: none">
								<i class="fa fa-filter fa-stack-1x"></i>
  								<i class="fa fa-slash fa-stack-1x"></i>
							</span>
							<span class="fa-stack callFiltersModal">
								<i class="fa fa-filter fa-stack-1x"></i>  							
							</span>
						</span>-->
					</div>
				</div>
			</div>
			<div class="row label-style" style="margin-top: 0.4vw; line-height: 1vw">&nbsp</div>
			<div class="row label-style timePeriodContainer">&nbsp;</div>
			<div class="styled-select">
				<select name="characteristic select" id="characteristicSelect" form="select-view-options">
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

	<div id="resetInfoContainer" class="row homeSmallGroup">
		<div class="col-lg-12 align-self-end d-inline-block" style="text-align: right">
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
	nhis: {
		socrataId: "25m4-6qqq",
		private: "0",
	},

	"obesity-child": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Obesity-among-children-and-adolescents-aged-2-/64sz-mcbq",
		socrataId: "64sz-mcbq",
		private: "1",
		chartTitle: "Obesity among Children",
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasSubtopic: true,
	},
	"obesity-adult": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Normal-weight-overweight-and-obesity-among-adu/23va-ejrn",
		socrataId: "23va-ejrn",
		private: "1",
		chartTitle: "Obesity among Adults",
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasSubtopic: true,
	},
	suicide: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Death-rates-for-suicide-by-sex-race-Hispanic-o/u9f7-4q6s",
		socrataId: "u9f7-4q6s",
		private: "1",
		chartTitle: "Death Rates for Suicide",
		panelNum: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasSubtopic: false,
	},
	injury: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Initial-injury-related-visits-to-hospital-emer/k99r-jkp7",
		socrataId: "k99r-jkp7",
		private: "1",
		chartTitle: "Initial injury-related visits to hospital emergency departments",
		panelNum: 1,
		yAxisUnitId: 2,
		hasCI: false,
		hasSubtopic: false,
	},
	birthweight: {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Low-birthweight-live-births-by-race-and-Hispan/3p8z-99bn",
		socrataId: "3p8z-99bn",
		private: "1",
		chartTitle: "Low birthweight live births",
		panelNum: 1,
		yAxisUnitId: 1,
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
		yAxisUnitId: 1,
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
		yAxisUnitId: 2,
		hasCI: true,
		hasSubtopic: false,
	},
	"drug-overdose": {
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Drug-overdose-death-rates-by-drug-type-sex-age/52ij-h8yw",
		socrataId: "52ij-h8yw",
		private: "1",
		chartTitle: "Deaths from drug overdose",
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	"ambulatory-care": {
		dataUrl: "https://data.cdc.gov/resource/tz8d-jy2e.json",
		socrataId: "tz8d-jy2e",
		private: "1",
		chartTitle: "Ambulatory Care Visits",
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: false,
		hasSubtopic: true,
	},
	"access-care": {
		dataUrl: "https://data.cdc.gov/resource/nt5r-ak33.json",
		socrataId: "nt5r-ak33",
		private: "1",
		chartTitle: "Access to Care",
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasSubtopic: true,
	},
};

nhisTopics.forEach((t) => {
	topicLookup[t.id] = {
		dataUrl: "https://data.cdc.gov/NCHS/",
		socrataId: `nhis-${t.text}`,
		isNhisData: true,
		chartTitle: t.text,
		panelNum: 1,
		yAxisUnitId: 1,
		hasCI: true,
		hasSubtopic: true,
	};
});

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules for creating a new hashLookup object
// 1. top-level value must match the ID in the Topic dropdown's Options list
// 2. hash can be any string closely related to the TEXT in Topic dropdown, with "-" replacing any spaces. Do not use "_" as this is reserved
//    to split a tab-hash and the hash-values that follow. I hear you thinking 'hash, value, hash-value ... I'm confused'. Bottom line is,
//    in the object: "hash" is what is read/written to the browser url; "value" is the corresponding "id" from the dropdowns.
//    Use text and "-" characters only for worry-free acceptance. For long text values you might choose to abbreviate a/some words
//    The end-goal is for the hash url to be meaningful to someone it may be shared with before they navigate to it
// 3. "subtopicOptions" uses rules #1 and #2 like above, but for the Subtopic dropdown
// 4. "characteristicOptions" uses rules #1 and #2 like above, but for the Characteristic dropdown
//
// For ease of getting the values, after creating the required topicLookup object (above in this code), load the page.
// Once your new dataset successfully loads you can inspect the Subtopic and Characteristic dropdowns.
export const hashLookup = [
	{
		hash: "obesity-children",
		value: "obesity-child",
		characteristicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
			{
				hash: "NA",
				value: "0",
			},
		],
	},
	{
		hash: "infant-mortality",
		value: "infant-mortality",
		characteristicOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		subtopicOptions: [
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
		characteristicOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
		subtopicOptions: [
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
		characteristicOptions: [
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
			characteristicOptions: nhisHash.characteristicOptions,
			subtopicOptions: nhisHash.subtopicOptions,
		});
	});
