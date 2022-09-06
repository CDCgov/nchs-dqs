import { HtmlTooltip } from "../general/htmlTooltip";

// this is the function that cleans up Socrata data
export const addMissingProps = (cols, rows) => {
	let newArray = [];
	rows.forEach((row) => {
		const keys = Object.keys(row);
		const difference = cols.filter((col) => !keys.includes(col));
		if (difference.length > 0) {
			difference.forEach((item) => {
				row[item] = null;
			});
			newArray.push(row);
		} else {
			newArray.push(row);
		}
	});
	return newArray;
};

export const addHtmlTooltips = () => {
	const resetInfoTooltip = new HtmlTooltip({
		h3: "Reset all selections except for Topic selection.",
		containerId: "resetInfoContainer",
	});
	resetInfoTooltip.render();

	$("#resetInfo").mouseover((e) => resetInfoTooltip.mouseover(e));
	$("#resetInfo").mousemove((e) => resetInfoTooltip.mousemove(e));
	$("#resetInfo").mouseleave((e) => resetInfoTooltip.mouseout(e));

	const addFiltersTooltip = new HtmlTooltip({
		h3: "This feature is a work in progress.",
		containerId: "resetInfoContainer",
	});
	addFiltersTooltip.render();

	$("#addFiltersTextContainer").mouseover((e) => addFiltersTooltip.mouseover(e));
	$("#addFiltersTextContainer").mousemove((e) => addFiltersTooltip.mousemove(e));
	$("#addFiltersTextContainer").mouseleave((e) => addFiltersTooltip.mouseout(e));

	const editFiltersTooltip = new HtmlTooltip({
		h3: "This feature is a work in progress.",
		containerId: "resetInfoContainer",
	});
	editFiltersTooltip.render();

	$("#editFiltersTextContainer").mouseover((e) => editFiltersTooltip.mouseover(e));
	$("#editFiltersTextContainer").mousemove((e) => editFiltersTooltip.mousemove(e));
	$("#editFiltersTextContainer").mouseleave((e) => editFiltersTooltip.mouseout(e));
};

export const getYear = (period) => parseInt(period.split("-")[0], 10);

const getTooltipConstructor = (vizId, chartValueProperty, hasCI) => {
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
		age: {
			title: "Age Group: ",
			datumType: "string",
		},
		flag: {
			title: "Flag: ",
			datumType: "string",
		},
		estimate_lci: {
			title: "95% confidence LCI: ",
			datumType: "string",
		},
		estimate_uci: {
			title: "95% confidence UCI: ",
			datumType: "string",
		},
		"": { title: "", datumType: "empty" },
	};

	const headerProps = ["stub_name", "stub_label"];
	let bodyProps = ["panel", "unit", chartValueProperty];
	if (hasCI) bodyProps.push("estimate_uci", "estimate_lci");
	bodyProps.push("year", "age", "flag");

	return {
		propertyLookup,
		headerProps,
		bodyProps,
		svgId: `${vizId}-svg`,
		vizId,
	};
};

export const getAllChartProps = (data, showBarChart, config) => {
	const chartValueProperty = "estimate";
	const xAxisTitle = $("#stub-name-num-select option:selected").text(); // X Axis Title is the "Characteristic" selected
	const vizId = "chart-container";
	const scaleTimeIndicators = ["suicide", "Medicaid"];
	const needsScaleTime = scaleTimeIndicators.some((ind) => data[0]?.indicator.includes(ind));

	return {
		data,
		chartProperties: {
			yLeft1: showBarChart ? "stub_label" : chartValueProperty,
			xAxis: showBarChart ? chartValueProperty : needsScaleTime ? "date" : "year",
			bars: "estimate",
		},
		enableCI: config.enableCI,
		usesLegend: true,
		legendBottom: true,
		usesDateDomainSlider: false,
		usesBars: showBarChart,
		usesHoverBars: showBarChart,
		barLayout: showBarChart ? { horizontal: true, size: 60 } : { horizontal: false, size: null },
		barColors: [
			"#6a3d9a",
			"#cab2d6",
			"#ff7f00",
			"#fdbf6f",
			"#e31a1c",
			"#fb9a99",
			"#33a02c",
			"#b2df8a",
			"#1f78b4",
			"#a6cee3",
			"#A6A6A6",
			"#fb9a99",
			"#e31a1c",
			"#cab2d6",
			"#a6cee3",
		],
		marginRightMin: 20,
		axisLabelFontScale: showBarChart ? 0.5 : 1,
		usesChartTitle: true,
		usesLeftAxis: true,
		usesLeftAxisTitle: true,
		usesBottomAxis: !showBarChart,
		usesTopAxis: showBarChart,
		usesXAxisTitle: true,
		usesDateAsXAxis: !showBarChart,
		needsScaleTime: !showBarChart && needsScaleTime,
		yLeftLabelScale: showBarChart ? 10 : 3,
		bottomAxisTitle: xAxisTitle,
		formatXAxis: "string",
		formatYAxisLeft: "magnitude",
		usesMultiLineLeftAxis: !showBarChart,
		multiLineColors: [
			"#88419d",
			"#1f78b4",
			"#b2df8a",
			"#33a02c",
			"#0b84a5",
			"#cc4c02",
			"#690207",
			"#e1ed3e",
			"#7c7e82",
			"#8dddd0",
			"#A6A6A6",
			"#fb9a99",
			"#e31a1c",
			"#cab2d6",
			"#a6cee3",
		],
		multiLineLeftAxisKey: "subLine",
		vizId,
		genTooltipConstructor: getTooltipConstructor(vizId, chartValueProperty, config.hasCI),
	};
};
