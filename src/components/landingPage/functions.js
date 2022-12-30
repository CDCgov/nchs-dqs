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
		body: "Reset all selections except for Topic selection.",
		containerId: "resetInfoContainer",
	});

	const editFiltersTooltip = new HtmlTooltip({
		body: "Advanced filters to limit options in dropdown lists",
		containerId: "dropdownSelectorGroup",
	});

	const removeFiltersTooltip = new HtmlTooltip({
		body: "Clear advanced filters selections",
		containerId: "dropdownSelectorGroup",
	});

	resetInfoTooltip.render();
	editFiltersTooltip.render();
	removeFiltersTooltip.render();

	$(".generalTooltip.tooltip").css("visibility", "hidden");

	$("#resetInfo").mouseover((e) => resetInfoTooltip.mouseover(e));
	$("#resetInfo").mousemove((e) => resetInfoTooltip.mousemove(e));
	$("#resetInfo").mouseleave((e) => resetInfoTooltip.mouseout(e));

	$(".editFiltersIcon").mouseover((e) => editFiltersTooltip.mouseover(e));
	$(".editFiltersIcon").mousemove((e) => editFiltersTooltip.mousemove(e));
	$(".editFiltersIcon").mouseleave((e) => editFiltersTooltip.mouseout(e));

	$(".clearFiltersIcons").mouseover((e) => removeFiltersTooltip.mouseover(e));
	$(".clearFiltersIcons").mousemove((e) => removeFiltersTooltip.mousemove(e));
	$(".clearFiltersIcons").mouseleave((e) => removeFiltersTooltip.mouseout(e));
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
		STATE_NAME: {
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

export const getMapTooltipConstructor = (chartConstructor) => {
	const constructor = chartConstructor;
	constructor.vizId = "us-map-container";
	constructor.svgId = "us-map-svg";
	constructor.headerProps = ["", "STATE_NAME"];
	return constructor;
};

export const getAllChartProps = (data, showBarChart, config) => {
	const chartValueProperty = "estimate";
	const xAxisTitle = $("#characteristic option:selected").text(); // X Axis Title is the "Characteristic" selected
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
		usesLeftAxisTitle: !showBarChart,
		usesBottomAxis: !showBarChart,
		usesTopAxis: showBarChart,
		usesXAxisTitle: true,
		usesDateAsXAxis: !showBarChart,
		needsScaleTime: !showBarChart && needsScaleTime,
		bottomAxisTitle: xAxisTitle,
		formatXAxis: showBarChart ? "magnitude" : "string",
		formatYAxisLeft: showBarChart ? "string" : "magnitude",
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

export const linkify = (t) => {
	const m = t.match(/(\b(https?|http|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi);
	if (!m) return t;
	const a = [];
	m.forEach((x) => {
		const [t1, ...t2] = t.split(x);
		a.push(t1);
		t = t2.join(x);
		const y = (!x.match(/(http(s?)|ftp):\/\//) ? "https://" : "") + x;
		a.push('<a href="' + y + '" target="_blank" rel="noreferrer" noopener>' + y.split("/")[2] + "</a>");
	});
	a.push(t);
	return a.join("");
};

export const resetTopicDropdownList = () => $("#topicDropdown-select .genDropdownOption").each((i, el) => $(el).show());

export const updateTopicDropdownList = () => {
	const selectedFilters = $(".filterCheckbox:checked")
		.map((i, el) => el.id.replace("filter", ""))
		.toArray();

	let needToChangeSelected = false;
	if (selectedFilters.length) {
		let firstFiltered;
		const currentSelected = $("#topicDropdown-select .genOptionSelected").data("val");
		$("#topicDropdown-select .genDropdownOption").each((i, el) => {
			const availableFilters = $(el).data("filter").split(",");
			const value = $(el).data("val");
			if (selectedFilters.some((sF) => availableFilters.includes(sF))) {
				if (!firstFiltered) firstFiltered = value;
				$(el).show();
			} else {
				$(el).hide();
				if (value === currentSelected) {
					needToChangeSelected = true;
					$(el).removeClass("genOptionSelected");
				}
			}
		});
		if (needToChangeSelected) {
			$("#topicDropdown .genDropdownOption").each((i, el) => {
				if ($(el).css("display") === "block") {
					$(el).addClass("genOptionSelected").trigger("click");
					$("#topicDropdown-select").trigger("click");
					return false;
				}
			});
		}
	} else resetTopicDropdownList();
};
