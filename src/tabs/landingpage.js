import { resetAppStateVars } from "../utils/appState";
import { Utils } from "../utils/utils";
import { DataCache } from "../utils/datacache";
import * as config from "../components/landingPage/config";
//import { MainCard } from "../components/landingPage/mainCard";
//import { SubCard } from "../components/landingPage/subCard";
import { PageEvents } from "../eventhandlers/pageevents";
import { GenChart } from "../components/general/genChart";

//import { CommunityTransmissionMap } from "../components/landingPage/communityMap";
//import { CommunityTransmissionMapLegend } from "../components/landingPage/communityMapLegend";
//import { landingStatusBar } from "../components/landingPage/landingStatusBar";

export class LandingPage {
	constructor() {
		resetAppStateVars();
		appState.CURRENT_TAB = "nchs-home";
		this.allData = null;
		this.currentData = null;
		this.currentLocation = null;
		this.classification = null;
		this.currentCategories = null;
		this.savedCategories = null;
		this.subNav = null;
		this.maxDate = null;
		this.catUpdate = true;
		this.classUpdate = true;
		this.locationUpdate = true;
		this.popFactorsInitURL = `${process.env.API_URL}nchs-home`;
		this.csv = null;
		this.defaultDropdown = null;
		this.chartConfig = null;
		this.currentNamedCategories = [];
		this.yScaleType = null; // linear or log
		this.chartValueProperty = null;
		this.flattenedFilteredData = null;
		this.vizId = "chart-container";
		// select data items - set some defaults
		this.panelNum = 1;
		this.stubNameNum = 0;
		this.startPeriod = null;
		this.endPeriod = null;
	}

	renderTab() {
		document.getElementById("maincontent").innerHTML = this.tabContent;

/* 		const countyViewInput = document.getElementById("county-view-input");
		$(document).on("click", (e) => {
			if (e.target !== countyViewInput) closeSearchArea();
		}); */

		this.getInitialData(); // for starters OBESITY DATA

		/* 		document.addEventListener("DOMContentLoaded", evt => {
			if (evt.target.readyState === "complete") {
				this.addClickListeners();
			}
		}); */

		this.addClickListeners();
	}

	
	renderAfterDataReady() {
		// set default yscale:
		if (!this.yScaleType) {
			this.yScaleType = "linear";
			this.storedScaleState = "linear";
		}

		console.log("Panel Num", this.panelNum);

		//updateTitle(this.charttype, this.numbertype, this.neworcumulative);
		$(".dimmer").attr("class", "ui inverted dimmer");
		this.renderChart();
	}

	getInitialData() {
		// Will need to register events here when we get to changing selects
		const getObesityData = () =>
			DataCache.ObesityData ?? Utils.getJsonFile("content/json/HUS_OBESCH_2018.json");
		
		Promise.all([
			getObesityData(),
		]).then((data) => {
			const [destructuredData] = data;
			this.allData = JSON.parse(destructuredData);
			DataCache.ObesityData = this.allData;
			// create a year_pt col from time period
			this.allData = this.allData
				.filter((d) => d.flag !== "- - -") // remove undefined data
				.map((d) => ({ ...d, estimate: parseFloat(d.estimate), year_pt: this.getYear(d.year) }));
			this.renderAfterDataReady();
		}).catch(function (err) {
			console.error(`Runtime error in tabs/landingpage.js: ${err}`);
		});
	
	}

	getYear(period) {
		const yearsArray = period.split("-");
		return parseInt(yearsArray[0]);
	}

/* 	updateComparisonChart(loadingState) {
		if (!loadingState) {
			// only update if not a false update function during initial page load
			renderComparisonChart();
			document
				.getElementById("dwn-chart-img")
				.setAttribute("aria-label", `Download Chart ${$("#main-title").html()}`);
		}
	} */

	renderChart() {
// ${this.updateTitle()} in next line and have function to set it based on selectors
		$("#chart-title").html(`<strong>Obesity in Children and Adolescents</strong>`);
		$("#chart-subtitle").html(`Data from NCHS.`);

		// $("#metric_callout_box").html(config.calloutText.get(this.casesOrDeaths + this.newOrCumulative));

		const flattenedData = this.getFlattenedFilteredData();
		this.flattenedFilteredData = flattenedData;
		console.log("landing obesity filtered data: ", flattenedData);
		this.chartConfig = this.getChartBaseProps();
		this.chartValueProperty = this.chartConfig.chartValueProperty;
		//debugger;
		this.chartConfig = this.getAllChartProps(flattenedData, this.chartConfig);
		this.chartConfig.chartTitle = `Obesity in Children and Adolescents`;

		$(`#${this.chartConfig.vizId}`).empty();
		const genChart = new GenChart(this.chartConfig);
		// not using a slider here
		//config.renderSlider(genChart.render(), this.currentSliderDomain);
		genChart.render();

		// set background to white
		$("#chart-container-svg").style("background-color", '#FFFFFF');
/* 		const removedCategories = this.savedNamedCategories.filter((s) => !this.currentNamedCategories.includes(s));
		removedCategories.forEach((r) => $(`.${r}`).hide()); */
	}

	getFlattenedFilteredData() {
		const { classification } = this;
		let selectedPanelData = this.allData.filter(
			(d) => parseInt(d.panel_num) === this.panelNum && parseInt(d.stub_name_num) === this.stubNameNum
		);
		// now we need to nest by stub_label
/* 		let nestedPanelData = d3.nest() 
    		.key(d => d.stub_label)
			.entries(selectedPanelData); */
		
		selectedPanelData = selectedPanelData.map((d) => ({
			...d,
			subLine: d.stub_label,
		}));
		//debugger;
/* 		const noLocationNamedData = [...classifiedData, ...allCountiesData];
		if (this.currentLocation === "United States")
			return noLocationNamedData.map((d) => ({
				...d,
				date: new Date(`${d.date}T00:00:00`),
				subLine: functions.getCategoryName2(d.Category, classification),
			})); */

		return [...selectedPanelData];
	}

	getChartBaseProps() {
		const chartValueProperty = "estimate";
		
		/* this.newOrCumulative !== "total"
				? `${this.newOrCumulative}_day_avg_new_${this.casesOrDeaths}_per_100k`
				: `total_${this.casesOrDeaths}_per_100k`; */

		//const newTotalText = this.newOrCumulative === "seven" ? "7-day" : "14-day";

		const yAxisTitle = "Percent of Population, crude (%)"

		return { chartValueProperty, yAxisTitle };
	}

	getAllChartProps = (data, chartBaseProps) => {
		const { chartValueProperty, yAxisTitle } = chartBaseProps;
		const vizId = "chart-container";

		let props;
		props = {
			data,
			chartProperties: {
				yLeft1: chartValueProperty,
				xAxis: "year_pt",
				yAxis: "estimate",
			},
			usesLegend: true,
			usesDateDomainSlider: false,
			usesChartTitle: true,
			usesLeftAxis: true,
			usesLeftAxisTitle: true,
			usesBottomAxis: true,
			usesDateAsXAxis: true,
			yLeftLabelScale: 3,
			legendCoordinatePercents: [0.40, 0.58],
			leftAxisTitle: yAxisTitle,
			formatXAxis: "string",
			usesMultiLineLeftAxis: true,
			multiLineColors: [
				"#88419d",
				"#57b452",
				"#0b84a5",
				"#cc4c02",
				"#690207",
				"#e1ed3e",
				"#7c7e82",
				"#8dddd0",
				"#A6A6A6",
			],
			multiLineLeftAxisKey: "subLine",
			vizId,
			genTooltipConstructor: this.getTooltipConstructor(vizId, chartValueProperty),
	    };

	    return props;
	};
	
	getTooltipConstructor = (vizId, chartValueProperty) => {
		const propertyLookup = {
			// list properties needed in tooltip body and give their line titles and datum types
			year: {
				title: "Time Period: ",
				datumType: "string",
			},
			estimate: {
				title: "Estimate: ",
				datumType: "string",
			},
			indicator: {
				title: "Indicator: ",
				datumType: "string",
			},
			unit: {
				title: "Unit: ",
				datumType: "string",
			},
			panel: {
				title: "Subtopic: ",
				datumType: "string",
			},
			stub_name: {
				title: "",
				datumType: "string",
			},
			stub_label: {
				title: "Stub Label: ",
				datumType: "string",
			},
			"": { title: "", datumType: "empty" },
		};

		const headerProps = ["stub_name","stub_label"]; 
		const bodyProps = ["panel","unit", chartValueProperty, "year"];

		return {
			propertyLookup,
			headerProps,
			bodyProps,
			svgId: `${vizId}-svg`,
			vizId,
		};
	};
    

/* 	renderComparisonChart() {
		//const { ySelect } = currentViz;
		const vizKey = getVizKey();
		chartConfig  = config.getGenChartConfig ({
			currentViz,
			data: this.allData,
			vizKey: this.vizKey,
			vizId: this.vizId,
		});

		debugger;
		// use this if we need to adjust data at all
		//this.chartConfig.data = this.updateCurrentData();
		//if (this.yScaleType === "log") this.chartConfig.legendCoordinatePercents = [0.4, 0.65];
		this.chartConfig.left1ScaleType = this.yScaleType;

		const genChart = new GenChart(this.chartConfig);
		genChart.render;
		//functions.renderSlider(genChart.render(this.chartConfig.data), this.currentSliderDomain);
		//this.tableData = this.formatDataForTable(this.chartConfig.data);
		//this.renderComparisonTable(this.tableData);
	} */

	// THIS IS WHERE WE CAN SET WHAT TO VISUALIZE
	// -- compare trends ties viewtype, metric and measure to CORRECT DATA
	// For us we don't need this really until we have 2 or more data sets
	getVizKey() {
/* 		let viewType = this.viewtype; // view: cases vs. deaths
		let numType = this.metric; // metric: count vs. 100k
		let { measure } = this; // measure: daily vs. cumulative
	*/
		// for now we jus thave one
		return "caseObesity";
	
		if (viewType === "cases") {
			// Cases data options
			if (numType === "count") {
				// raw numbers
				if (measure === "daily") {
					// new cases
					return "caseRawNewSubmission";
				} // cumulative cases
				return "caseRawCumulativeSubmission";
			} // rate numbers
			if (measure === "daily") {
				// new cases
				return "caseRateNewSubmission";
			} // cumulative cases
			return "caseRateCumulativeSubmission";
		} // Deaths data options
		if (numType === "count") {
			// raw numbers
			if (measure === "daily") {
				// new deaths
				return "deathRawNewSubmission";
			} // cumulative deaths
			return "deathRawCumulativeSubmission";
		} // rate numbers
		if (measure === "daily") {
			// new deaths
			return "deathRateNewSubmission";
		} // cumulative deaths
		return "deathRateCumulativeSubmission";
	}


	updatePanelNum(panelNum) {
		this.panelNum = parseInt(panelNum);
		//this.setCategoriesSelect();
		console.log("new panel num: ", this.panelNum)
		// now re-render the chart based on updated selection
		this.renderChart();
		//this.renderDataTable();
	}

	updateStubNameNum(stubNameNum) {
		this.stubNameNum = stubNameNum;
		//this.setCategoriesSelect();
		console.log("new stub name num: ", this.stubNameNum)
		// now re-render the chart based on updated selection
		this.renderChart();
		//this.renderDataTable();
	}
	
	updateStartPeriod(start) {
		this.startPeriod = start;
		this.renderChart();
	}

	updateEndPeriod(end) {
		this.endPeriod = end;
		this.renderChart();
	}

	addClickListeners() {
/* 		// this is a weird eslint rule. class methods must use this for assigments unless static.
		const buttons = document.querySelectorAll(".landing-card-main");
		PageEvents.addButtonsClickListers(buttons);
		this.buttons = document.querySelectorAll(".daily-update-card");
		PageEvents.addButtonsClickListers(this.buttons);
		// these are not buttons, but hrefs but this will get the scroll effect we need
		// -- the .landing-link listeners need to be here AND in update-list code
		// -- if you remove these 2 lines below then the non-update-list landing-links don't work (TT)
		this.buttons = document.querySelectorAll(".landing-link");
		PageEvents.addButtonsClickListers(this.buttons);
		this.communityButtons = document.querySelectorAll(".community-links");
		PageEvents.addButtonsClickListers(this.communityButtons); */
	}

	// TO DO: Change the selectors to be filled using data code??
	tabContent = `<!-- TOP SELECTORS --><div class="color-area-wrapper">
	<div class="rectangle-green">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">1</strong>
			</span>
			<span style="padding-bottom:0px; font-family:Open Sans,sans-serif;color: white; font-weight:300; ">Select a topic</span><br>
			<span style="margin-left: 47px; margin-top:-10px; font-family:Open Sans,sans-serif;color: white; font-weight:500;font-size:22px;">Topic</span>
			<br>&nbsp;<br>
			<select name="topic" id="topic" form="select-view-options"  class="select-style">
				<option value="obesity" selected>Obesity among children</option>
				<option value="saab">Saab</option>
				<option value="opel">Opel</option>
				<option value="audi">Audi</option>
			</select>
		</div>
		<div class="chevron-green"></div>
	</div>
	<div class="rectangle-yellow">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">2</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color: #010101; font-weight:300; ">Refine to a</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color: #010101; font-weight:500;font-size:22px;">Subtopic</span>
			<br>&nbsp;<br>
			<select name="panel-num-select" id="panel-num-select" form="select-view-options" class="custom-select">
				<option value="1" selected>2-19 years</option>
				<option value="2">2-5 years</option>
				<option value="3">6-11 years</option>
				<option value="4">12-19 years</option>
			</select>
		</div>
		<div class="chevron-yellow"></div>
	</div>
	<div class="rectangle-white">
		<div class="inner-content-wrapper">
			<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
				<i class="fa fa-circle fa-stack-2x"></i>
				<strong class="fa-stack-1x fa-stack-text fa-inverse">3</strong>
			</span>
			<span style="font-family:Open Sans,sans-serif;color:#010101; font-weight:300; ">View data by</span><br>
			<span style="margin-left: 47px; font-family:Open Sans,sans-serif;color:#010101; font-weight:500;font-size:22px;">Characteristic</span>
			<br>&nbsp;<br>
			<select name="stub-name-num-select" id="stub-name-num-select" form="select-view-options"  class="select-style">
				<option value="0" selected>Total</option>
				<option value="1">Sex</option>
				<option value="2">Age</option>
				<option value="3"">Race and Hispanic origin</option>
        		<option value="4">Sex and race and Hispanic origin</option>
				<option value="5">Percent of poverty level</option>
			</select>
		</div>
		<div class="chevron-white"></div>
	</div>
	<!-- last section with no chevron -->
	<div class="inner-content-wrapper">
		<span class="fa-stack fa-1x" style="color: #008BB0; padding-top:10px; padding-bottom:10px;">
			<i class="fa fa-circle fa-stack-2x"></i>
			<strong class="fa-stack-1x fa-stack-text fa-inverse">4</strong>
		</span>
		<span style="font-family:Open Sans,sans-serif;color:#010101; font-weight:300; ">Choose from available</span><br>
		<span style="margin-left:47px; margin-top:-5px; font-family:Open Sans,sans-serif;color:#010101; font-weight:500;font-size:22px;">Time
			Periods</span>
		<div class="checkbox-style">
			<input type="checkbox" id="show-one-period-checkbox" name="show-one-period-checkbox">
			<label for="show-one-period-checkbox">View single period</label>
		</div>
		<div style="display: flex;">
			<div style="flex-direction: column;">
				<div class="label-style">Start Period <br> </div>
				<div>
					<select name="year-start" id="year-start-select" form="select-view-options" class="select-style" style="width:100px;">
						<option value="1988-1994" selected>1988-1994</option>
						<option value="1999-2002">1999-2002</option>
						<option value="2001-2004">2001-2004</option>
						<option value="2003-2006">2003-2006</option>
						<option value="2005-2008">2005-2008</option>
						<option value="2007-2010">2007-2010</option>
						<option value="2009-2012">2009-2012</option>
						<option value="2011-2014">2011-2014</option>
						<option value="2013-2016">2013-2016</option>
					</select>
				</div>
			</div>
			<div style="flex-direction: column;">
				<div class="label-style" id="year-end-label">End Period</div>
				<div>
					<select name="year-end" id="year-end-select" form="select-view-options" class="select-style" style="width:100px;">
						<option value="1988-1994">1988-1994</option>
						<option value="1999-2002">1999-2002</option>
						<option value="2001-2004">2001-2004</option>
						<option value="2003-2006">2003-2006</option>
						<option value="2005-2008">2005-2008</option>
						<option value="2007-2010">2007-2010</option>
						<option value="2009-2012">2009-2012</option>
						<option value="2011-2014">2011-2014</option>
						<option value="2013-2016" selected>2013-2016</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- #b3d2ce -->
						<div tabindex="0" class="chart-titles space-util">
							<span id="chart-title"></span>
						</div>
						<span tabindex="0" id="chart-subtitle" class=""></span>

<div class="chart-wrapper" style="background-color:#b3d2ce;margin-top:40px;padding-top:1px;">
					<div id="chart-container" class="general-chart">
					</div>
					<div class="dwnl-img-container margin-spacer" data-html2canvas-ignore>
						<button tabindex="0" id="dwn-chart-img" class="theme-cyan ui btn">Download Chart</button>
					</div>
					<div class="data-table-container" style="margin-top: 10px;" data-html2canvas-ignore>
						<div id="compare-trends-table-toggle" class="table-toggle closed" tabindex="0"
							aria-labelledby="compare-trends-table-title">
							<h4 id="compare-trends-table-title" class="table-title">Data Table for Compare Trends</h4>
							<div class="table-toggle-icon"><i id="compare-trends-table-header-icon" class="fas fa-plus"></i></div>
						</div>
						<div id="compare-trends-table-container" class="data-table closed" tabindex="0" aria-label="Compare Trends table">
							<div class="table-info">
								<div tabindex="0" class="general_note" style="margin-top: 10px;" id="table-note"></div>
								<button id="btnCompareTrendsTableExport" class="btn data-download-btn" tabindex="0"
									aria-label="Download Data for Data Table for Seven-day moving average of new cases">
									Download Data <i class='fas fa-download' aria-hidden="true"></i>
								</button>
							</div>
							<div tabindex="0" id="skipTableLink" class="skipOptions"><a href="#viewHistoricLink">Skip Table</a> </div>
							<div id="topOfTable" class="scrolling-table-container">
								<table tabindex="0" id="compare-trends-table" class="expanded-data-table"></table>
							</div>
						</div>
					</div>

</div><!-- end chart wrapper -->

    `;
}
