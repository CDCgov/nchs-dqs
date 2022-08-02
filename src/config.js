export const tabContent = `
    <div id="content-container" class="ui basic segment">
        <div id="main-widget-container">
            <div id="widget-container-middle" class="layout_middle_A">
                <div id="widget_4" class="widget">
                      <div class="main-ctn" data-html2canvas-ignore>
                        <div class="sub-ctn viz-selections-container">
                            <div class="radio-selection-container" id="compare-trends-selection-options">
                                <div id="view-selection" class="compare-trends-radio-container">
                                    <div tabindex="0" class="radio-title">View:</div>
                                    <form id="view-select-radios">
                                        <div tabindex="0">
                                            <input type="radio" name="view-radio" id="view-radio-cases" value="cases">
                                            <label for="view-radio-cases">Cases</label>
                                        </div>
                                        <div tabindex="0">
                                            <input type="radio" name="view-radio" id="view-radio-deaths" value="deaths">
                                            <label for="view-radio-deaths">Deaths</label>
                                        </div>
                                    </form>
                                </div>
                                <div id="measure-selection" class="compare-trends-radio-container">
                                    <div tabindex="0" class="radio-title">Measure:</div>
                                    <form id="measure-select-radios">
                                        <div tabindex="0">
                                            <input type="radio" name="measure-radio" id="measure-radio-daily" value="daily">
                                            <label for="measure-radio-daily">Daily</label>
                                        </div>
                                        <div tabindex="0">
                                            <input type="radio" name="measure-radio" id="measure-radio-cumulative" value="cumulative">
                                            <label for="measure-radio-cumulative">Cumulative</label>
                                        </div>
                                    </form>
                                </div>
                                <div id="metric-selection" class="compare-trends-radio-container">
                                    <div tabindex="0" class="radio-title">Metric:</div>
                                    <form id="metric-select-radios">
                                        <div tabindex="0">
                                            <input type="radio" name="metric-radio" id="metric-radio-count" value="count">
                                            <label for="metric-radio-count">Raw Totals</label>
                                        </div>
                                        <div tabindex="0">
                                            <input type="radio" name="metric-radio" id="metric-radio-100k" value="100k">
                                            <label for="metric-radio-100k">Rate per 100,000</label>
                                        </div>
                                    </form>
                                </div>
                                <div id="scale-selection" class="compare-trends-radio-container">
                                    <div tabindex="0" class="radio-title">Scale:</div>
                                    <form id="scale-select-radios">
                                        <div tabindex="0">
                                            <input type="radio" name="scale-radio" id="scale-radio-linear" value="linear" checked>
                                            <label for="scale-radio-linear">Linear</label>
                                        </div>
                                        <div tabindex="0">
                                            <input type="radio" name="scale-radio" id="scale-radio-log" value="log">
                                            <label for="scale-radio-log">Logarithmic</label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div id="comparison-chart-selectors" tabindex="0">
                                <div tabindex="0" class="dropdown-title">Select up to 6 states, territories, or HHS regions:</div>
                                <div class="selection-container">
                                    <div tabindex="0" id="state-selector" class="ui fluid multiple search normal selection dropdown">
                                        <input tabindex="0" id="state-select-input" type="hidden" name="states">
                                        <i  tabindex="0" class="dropdown icon"></i>
                                        <div tabindex="0" class="default text">Select Up to 6 States</div>
                                        <div tabindex="0" id="state-select-list" class="menu"></div>
                                    </div>
                                    <div tabindex="0" id="toggle-usa-data" style="text-align: left;">
                                        <input type="checkbox" id="us-data-checkbox" name="compare-us-data-checkbox">
                                        <label style="display: inline;" for="us-data-checkbox">Show full US Data (available only in logarithmic scale)</label>
                                    </div>
                                </div>
                            </div>
                            <div tabindex="0" id="metric_callout_box"> </div>  
                        </div>
                    </div>
                    <div id="compare-trends-chartContainer" class="general-chart">
				    	<div tabindex="0" class="chart-titles space-util">
				    		<h3 id="compare-trends-title"></h3>
				    	</div>
                    	<h3 tabindex="0" id="compare-trends-subtitle" class="pregnancy-chart-title-subline"></h3>
				    </div>
                    <div class="dwnl-img-container margin-spacer" data-html2canvas-ignore>
						<button tabindex="0" id="dwn-compare-trends-img" class="theme-cyan ui btn">Download Chart11</button>
                    </div>
                    <div class="data-table-container" style="margin-top: 10px;" data-html2canvas-ignore>
                        <div id="compare-trends-table-toggle" class="table-toggle closed" tabindex="0" aria-labelledby="compare-trends-table-title">
                            <h4 id="compare-trends-table-title" class="table-title">Data Table for Compare Trends</h4>
                            <div class="table-toggle-icon"><i id="compare-trends-table-header-icon" class="fas fa-plus"></i></div>
                        </div>
                        <div id="compare-trends-table-container" class="data-table closed" tabindex="0" aria-label="Compare Trends table">
                            <div class="table-info">
                                <div tabindex="0" class="general_note" style="margin-top: 10px;" id="table-note"></div>
                                <button id="btnCompareTrendsTableExport" class="btn data-download-btn" tabindex="0" aria-label="Download Data for Data Table for Seven-day moving average of new cases">
                                    Download Data <i class='fas fa-download' aria-hidden="true"></i>
                                </button>
                            </div>
                            <div tabindex="0" id="skipTableLink" class="skipOptions"><a href="#viewHistoricLink">Skip Table</a> </div>
                            <div id="topOfTable" class="scrolling-table-container">
                                <table tabindex="0" id="compare-trends-table" class="expanded-data-table"></table>
                            </div>
                        </div>
                    </div>
                    <div tabindex="0" id="backToTableLink" class="skipOptions"><a href="#topOfTable">Back to top of Table</a> </div>
                </div>
            </div>
        </div>
        <div class="ui active inverted dimmer">
            <div class="ui text loader">Loading</div>
        </div>
    </div>
`;

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

const getPropertyLookup = () => {
	const propertyLookup = {
		statename: { title: "", datumType: "string" },
		date: { title: "Date: ", datumType: "longDate" },
		"": { title: "", datumType: "" },
	};

	Object.values(vizConfig).forEach((value) => {
		propertyLookup[value.ySelect] = {
			title: `${value.tooltipLabel}: `,
			datumType: "number",
		};
	});
	return propertyLookup;
};

const getGenTooltipConstructor = (props) => {
	return {
		propertyLookup: getPropertyLookup(),
		headerProps: ["statename", ""],
		bodyProps: [vizConfig[props.vizKey].ySelect, "date"],
		vizId: props.vizId,
		svgId: `${props.vizId}-svg`,
	};
};

export const getGenChartConfig = (props) => {
	return {
		data: props.data,
		vizId: props.vizId,
		chartProperties: {
			yLeft1: props.ySelect,
			xAxis: "date",
		},
		genTooltipConstructor: getGenTooltipConstructor(props),
		usesLegend: true,
		usesDateDomainSlider: true,
		usesLeftAxis: true,
		usesLeftAxisTitle: true,
		usesBottomAxis: true,
		usesBottomAxisTitle: false,
		usesDateAsXAxis: true,
		usesMultiLineLeftAxis: true,
		legendCoordinatePercents: [0.1, 0.01],
		leftAxisTitle: vizConfig[props.vizKey].yLabel,
		multiLineLeftAxisKey: "statename",
		multiLineColors: ["#88419d", "#57b452", "#0570b0", "#cc4c02", "#690207", "#e1ed3e", "#7c7e82"],
		formatXAxis: "shortDate",
		formatYAxisLeft: "magnitude",
		leftDomainOverageScale: 1.1,
	};
};

export const hashLookup = {
	"data-topic-select": [
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
					hash: "NA",
					value: "1",
				},
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
			],
		},
	],
};
