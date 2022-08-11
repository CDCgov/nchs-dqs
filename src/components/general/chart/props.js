// A copy-paste version of all chart props available is at the bottom of this file in
// the /* ** COPY-PAST-CONFIG ** */ section, below

export const getProps = (props) => {
	return {
		/* ***************************************************************************
		 * These are the REQUIRED constructor elements                               */
		data: props.data, // should typically be all data, un-filtered, un-flattened
		vizId: props.vizId, // matches the name given in html id for chart container
		chartProperties: props.chartProperties, // the json pull properties { xAxis, yLeft1, yLeft2, yRight, bars, stackedBars }
		// if using multi-line left axis, apply prop id to yLeft1 in chartProperties
		genTooltipConstructor: props.genTooltipConstructor, // find generalTooltip instructions here: src\components\general\genTooltip.js

		/* ***************************************************************************
		/* OPTIONAL (or REQUIRED but defaults are set, making optional               *
		 * If any 'uses' are false, simply leave them out of the constructor         */
		usesDateDomainSlider: props.usesDateDomainSlider || false, // to use the slider see the /* SLIDER */ section, below
		usesChartTitle: props.usesChartTitle || false, // you can choose to include a title here but adding it manually with html is another choice
		usesLeftAxis: props.usesLeftAxis || false, // the ticks and tick values on the left axis
		usesLeftAxisTitle: props.usesLeftAxisTitle || false, // text describing the left axis
		usesRightAxis: props.usesRightAxis || false, // the ticks and tick values on the right axis
		usesRightAxisTitle: props.usesRightAxisTitle || false, // text describing the right axis
		usesBottomAxis: props.usesBottomAxis || false, // the ticks and tick values on the bottom axis
		usesTopAxis: props.usesTopAxis || false, // the ticks and tick values on the top axis
		usesXAxisTitle: props.usesXAxisTitle || false, // text describing the bottom axis. If it is a date, leave blank
		usesLeftLine1: props.usesLeftLine1 || false, // primary line associated to the left axis scale
		usesLeftLine2: props.usesLeftLine2 || false, // secondary line associated to the left axis scale (e.g. an average line) around wildly swinging leftLine1 values
		usesRightLine: props.usesRightLine || false, // primary line associated to the right axis scale (e.g. the right axis on US Trends)
		usesBars: props.usesBars || false, // these can be date or numeric ranged bars (e.g. US Trends tab) OR categorical bars (e.g. MIS-C tab)
		usesStackedBars: props.usesStackedBars || false, // pass the total property to chartProperties.bars and an array of properties to chartProperties.stackedBars
		usesLegend: props.usesLegend || false, // e.g. Demographic Trends (pop-factors) and e.g. Health Care Personnel (a stacked bar with legend)
		usesHoverBars: props.usesHoverBars || false, // the very faint bars that highlight, when hovered, over full y range. Enable tooltip to show anywhere in chart area
		usesDateAsXAxis: props.usesDateAsXAxis || false, // this ensures there is enough margin right/left for the first and last dates to stay within chart visible area
		needsScaleTime: props.needsScaleTime || false, // uneven time periods for data reporting need the xAxis scaled with scaleTime() instead of default of scaleBand()
		usesMultiLineLeftAxis: props.usesMultiLineLeftAxis || false, // multiple lines centered on a key within a data set, each displaying the same json property for that key
		usesTwoLineXAxisLabels: props.usesTwoLineXAxisLabels || false, // doubles the calculated margin-bottom; handle algorithm of how to split the label with genChart returned values; e.g. MIS-C "Patients by Race & Ethnicity" chart
		usesDateCallout: props.usesDateCallout || false, // adds a dashed line and label to give info about a specific date in a date range chart
		usesDomainCallout: props.usesDomainCallout || false, // adds a dashed line and label to give info about a specific domain y value in on the chart
		/* ************************************************************************ */
		/* Optional properties	with no consequence by leaving out of constructor   */
		legendCoordinatePercents: props.legendCoordinatePercents, // e.g. [0.1, 0.2] translated top left of legend by x=10%, y=20% of svg's width/height (not the entire viz); can be negative
		leftLegendText: props.leftLegendText, // used if adding a leftLine1 to a multi-line chart; text is the title
		left2LegendText: props.left2LegendText, // used if adding a leftLine2 to a multi-line chart; text is the title
		rightLegendText: props.rightLegendText, // used if adding a rightLine to a multi-line chart; text is the title
		chartTitle: props.chartTitle || "",
		bottomAxisTitle: props.bottomAxisTitle || "",
		leftAxisTitle: props.leftAxisTitle || "",
		rightAxisTitle: props.rightAxisTitle || "",
		leftDomain: props.leftDomain, // this is an override; normally this is calculated from input data; e.g. [0, 40]; useful to lower a line compared to another, by making its y-max higher than the dataset's y-max
		rightDomain: props.rightDomain, // same as above but for right yAxis
		leftDomainMin: props.leftDomainMin, // handles case when all data points are 0 (often seen only when looking at Territories); applied like this ".domain([0, leftDomainMin])"
		rightDomainMin: props.rightDomainMin, // same as above but for right axis
		leftDomainOverageScale: props.leftDomainOverageScale || 1.05, // default of 1.05 applies a 5% buffer from highest y-data-point to top of chart area
		rightDomainOverageScale: props.rightDomainOverageScale || 1.05, // same as above but for right axis
		leftTickCount: props.leftTickCount || 6, // how many ticks shown on left axis; d3 may override this to best fit
		rightTickCount: props.rightTickCount || 6, // how many ticks shown on right axis; d3 may override this to best fit
		leftAxisColor: props.leftAxisColor || "black", // color applied to left axis title, tick labels, and tick lines
		rightAxisColor: props.rightAxisColor || "black", // color applied to right axis title, tick labels, and tick lines
		leftLine1Color: props.leftLine1Color, // color of line and ellipses (on hover) for left1 data; defaults to leftAxisColor when left blank
		leftLine2Color: props.leftLine2Color || "black", // color of line and ellipses (on hover) for left2 data;
		rightLineColor: props.rightLineColor, // color of line and ellipses (on hover) for right axis data; defaults to rightAxisColor when left blank
		left1DashArrayScale: props.left1DashArrayScale, // used when something other than a solid line is desired (e.g. a value of (2, 2) ... parens, not square brackets)
		left2DashArrayScale: props.left2DashArrayScale, // same as above for leftLine2 line; an example is the dashed line in MIS-C line chart;
		rightDashArrayScale: props.rightDashArrayScale, // same as above for right line
		left1ScaleType: props.left1ScaleType || "linear", // use this to set a "log" scale type by adding this prop with text type "log"
		numberOfEquallySpacedDates: props.numberOfEquallySpacedDates || 7, // how many dates shown on x axis
		bottomAxisRotation: props.bottomAxisRotation, // used with transform(rotate) for bottom axis label (e.g. when using too many labels to fit) +/- 0 to 359
		xLabelRotatedXAdjust: props.xLabelRotatedXAdjust || 0, // rotating axis labels needs tweaking to put in correct x,y location related to the tick mark
		xLabelRotatedYAdjust: props.xLabelRotatedYAdjust || 0, // these need trial and error to get right
		barColor: props.barColor, // color applied to all bars; defaults to leftLine1Color if set ... if not set, defaults to leftAxisColor
		barColors: props.barColors, // this is an array of colors for a category or stacked bar chart
		barLayout: props.barLayout || { horizontal: false, size: null }, // size (height or width in px) for a bar chart dependent on only one set of data (e.g. a list of percents or magnitudes)
		finalDataPointsDaysCount: props.finalDataPointsDaysCount, // how many final days in the dataset to apply some special condition to (see lines below)
		finalDataPointsType: props.finalDataPointsType, // a string. currently only have one type, "rect", applied over some final days range (in MIS-C)
		rectColorForFinalDataPoints: props.rectColorForFinalDataPoints, // add a transparent rect over the top of the final data points; (e.g. MIS-C line chart)
		edgeCaseForFinalDataPointBarColorPercentAdjust: props.edgeCaseForFinalDataPointBarColorPercentAdjust, // a decimal value, -1.0 to 1.0, to change the color luminance of the final n count of bars
		hideLeft1InFinalDataPoints: props.hideLeft1InFinalDataPoints, // no left-axis line 1 past a final date specified by number of data points (days)
		hideLeft2InFinalDataPoints: props.hideLeft2InFinalDataPoints, // no left-axis line 2 past a final date specified by number of data points (days)
		hideRightInFinalDataPoints: props.hideRightInFinalDataPoints, // no right-axis line  past a final date specified by number of data points (days)
		finalDataPointsNoLine: props.finalDataPointsNoLine || false,
		edgeCaseFinalBarColor: props.edgeCaseFinalBarColor, // a hard-coded html color value to set the final n count of bars to (overrides use of percent adjust, seen above)
		dateCalloutDate: props.dateCalloutDate, // set usesDateCallout to true ... this specifies date for adding a dashed line to a specific date
		dateCalloutLabel: props.dateCalloutLabel, // set usesDateCallout to true ... this specifies label for a specific date
		dateCalloutLineColor: props.dateCalloutLineColor || "red", // set usesDateCallout to true ... specifies color for a specific line to add a callout annotation for a date
		domainCalloutY: props.domainCalloutY, // set usesDomainCallout to true ... this specifies domain y value for adding a dashed line to a chart
		domainCalloutLabel: props.domainCalloutLabel, // set usesDomainCallout to true ... this specifies label for a specific y line callout
		domainCalloutLineColor: props.domainCalloutLineColor || "red", // set usesDomainCallout to true ... specifies color for a specific line to add a callout annotation for a domain
		multiLineLeftAxisKey: props.multiLineLeftAxisKey, // from a flat data set (like list of states), this is the property name on which to use d3.nest to make multiple lines or stacked bars
		multiLineColors: props.multiLineColors, // an array of html colors to choose for multi-line chart
		formatXAxis: props.formatXAxis || "none", // a string that applies d3.format to xAxis labels; Find the possible format options from 'datumType' in src\utils\genFormat.js
		formatYAxisLeft: props.formatYAxisLeft || "none", // same as above for left axis labels
		formatYAxisRight: props.formatYAxisRight || "none", // same as above for right axis labels
		chartTitleFontScale: props.chartTitleFontScale || 1.2, // adjusts size of chart title font; multiplied by 1rem for the tab
		axisTitleFontScale: props.axisTitleFontScale || 0.8, // adjusts size of all axes title fonts; multiplied by 1rem for the tab
		axisLabelFontScale: props.axisLabelFontScale || 0.55, // adjusts size of all axes tick label fonts; multiplied by 1rem for the tab
		yLeftLabelScale: props.yLeftLabelScale || 2, // axis tick labels have differing length (e.g. 1k vs 1,000) and need margin padding; this sets amount of margin for left axis
		yRightLabelScale: props.yRightLabelScale || 2, // same as above for right axis
		xLabelScale: props.xLabelScale || 1, // same as above for bottom axis
		labelPaddingScale: props.labelPaddingScale || 1.1, // decreases padding buffer to axes titles; rarely needed;
		marginRightMin: props.marginRightMin || (props.usesDateAsXAxis ? 35 : 0), // left/right margins are calculated based on other (above) properties; this sets a minimum margin size (px)
		marginLeftMin: props.marginLeftMin || (props.usesDateAsXAxis ? 35 : 0), // same as above for left margin
		legendBottom: props.legendBottom, // true/false to put the legend in the margin-bottom area, below axis title, but above a slider, if used
		firefoxReversed: props.firefoxReversed || false, // this prop is used when firefox reverses the order of the bars compared to chrome
		noDataMessage: props.noDataMessage || "There is no data for your selections. Please change your options.", // message to be displayed in place of chart when no data array is passed into genChart (CVI-4549 Tech Debt: Display message to user when no data is passed into genChart component)
		chartRotate: props.chartRotate, // true/false on ewhether to rotate the entire chart
		chartRotationPercent: props.chartRotationPercent, // (TT) this is used to rotate bar chart
		enableCI: props.enableCI || 0, // (TT) enable confidence intervals
	};
};

/* ** COPY-PAST-CONFIG ** */
// const genChartProperties = {
// /* REQUIRED */
// data: ,
// vizId: ,
// chartProperties: ,
// genTooltipConstructor: genTooltipConstructor(),

// /* OPTIONAL or REQUIRED with defaults set */
// usesDateDomainSlider: true,
// usesChartTitle: true,
// usesLeftAxis: true,
// usesLeftAxisTitle: true,
// usesRightAxis: true,
// usesRightAxisTitle: true,
// usesBottomAxis: true,
// usesXAxisTitle: true,
// usesLeftLine1: true,
// usesLeftLine2: true,
// usesRightLine: true,
// usesBars: true,
// usesStackedBars: true,
// usesLegend: true,
// usesHoverBars: true,
// usesDateAsXAxis: true,
// needsScaleTime: true,
// usesMultiLineLeftAxis: true,
// usesTwoLineXAxisLabels: true,
// usesDateCallout: true,
// usesDomainCallout: true,
// legendCoordinatePercents: ,
// leftLegendText: ,
// left2LegendText: ,
// rightLegendText: ,
// chartTitle: ,
// bottomAxisTitle: ,
// leftAxisTitle: "",
// rightAxisTitle: "",
// leftDomain: ,
// rightDomain: ,
// leftDomainMin: ,
// rightDomainMin: ,
// leftDomainOverageScale: ,
// rightDomainOverageScale: ,
// leftTickCount: 6,
// rightTickCount: 6,
// leftAxisColor: "black",
// rightAxisColor: "black",
// leftLine1Color: ,
// leftLine2Color: "black",
// rightLineColor: ,
// left1DashArrayScale: ,
// left2DashArrayScale: ,
// rightDashArrayScale: ,
// numberOfEquallySpacedDates: 7,
// bottomAxisRotation: ,
// xLabelRotatedXAdjust: 0,
// xLabelRotatedYAdjust: 0,
// barColor: ,
// barColors: ,
// finalDataPointsDaysCount: ,
// finalDataPointsType: ,
// rectColorForFinalDataPoints: ,
// hideLeft1InFinalDataPoints: ,
// finalDataPointsNoLine: conditional true? ,
// edgeCaseFinalBarColor: ,
// dateCalloutDate: ,
// dateCalloutLabel: ,
// dateCalloutLineColor: ,
// domainCalloutY: ,
// domainCalloutLabel: ,
// domainCalloutLineColor: ,
// multiLineLeftAxisKey: ,
// multiLineColors: ,
// formatXAxis: ,
// formatYAxisLeft: ,
// formatYAxisRight: ,
// chartTitleFontScale: 1.2,
// axisTitleFontScale: 0.8,
// axisLabelFontScale: 0.55,
// yLeftLabelScale: 2,
// yRightLabelScale: 2,
// xLabelScale: 1,
// labelPaddingScale: 1.1,
// marginRightMin: (props.usesDateAsXAxis ? 35 : 0),
// marginLeftMin: (props.usesDateAsXAxis ? 35 : 0),
// legendBottom: true,
// firefoxReversed: false,

// };
/* ** END-COPY-PAST-CONFIG ** */

/* ** SLIDER ** */
// generate the genChart and send its return values into a 'renderSlider' function
// when tab selections (radios, dropdowns, etc) change without reloading the chart
// pass the updated slider domain back into the chart

// the following are usually called from the main tab page
// setCurrentSliderDomain(sd) {
// 	this.currentSliderDomain = sd;
// }
//
// const genChart = new GenChart(props);
// config.renderSlider(genChart.render(), this.currentSliderDomain);

// the following lines are usually placed in a functions or config file
// export const renderSlider = (
// 	{ vizId, svgWidth, margin, data },
// 	selectedDomain
// ) => {
// 	const slider = new GenTrendsSlider(`${vizId}slider-viz-div`, vizId);
// 	slider.render(
// 		d3.extent(data.map((d) => d.date)),
// 		svgWidth,
// 		margin,
// 		0,
// 		selectedDomain
// 	);
// };

// the following lines are usually called in an events page
// const getCurrentSliderDomain = () => {
// 	const selectedStartDate = $(
// 		"#popFactors-chart-container #slider-label-left"
// 	)
// 		?.html()
// 		?.replace(`'`, "");
// 	const selectedEndDate = $("#popFactors-chart-container #slider-label-right")
// 		?.html()
// 		?.replace(`'`, "");
// 	let selectedDateDomain;
// 	if (selectedStartDate && selectedEndDate) {
// 		selectedDateDomain = [
// 			new Date(selectedStartDate),
// 			new Date(selectedEndDate),
// 		];
// 		return selectedDateDomain;
// 	}
// 	return false;
// };

// example for radios
// $( list of radios)
// 	"#view-select-radios, #measure-select-radios, #location-select, #classification-select"
// ).change(() => {
// 	appState.ACTIVE_TAB.setCurrentSliderDomain(
// 		getCurrentSliderDomain()
// 	);
// });
// example for dropdown
// $(".delete.icon, #category-select-list > .item").click(() => {
// 	appState.ACTIVE_TAB.setCurrentSliderDomain(
// 		getCurrentSliderDomain()
// 	);
// });
/* ** END-SLIDER ** */
