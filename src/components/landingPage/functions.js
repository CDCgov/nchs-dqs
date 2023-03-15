import { ClassifyData } from "../../utils/ClassifyDataNT";
import { HtmlTooltip } from "../general/htmlTooltip";
import { topicGroups } from "./config";

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

	const ciToggleTooltip = new HtmlTooltip({
		body: "Confidence interval not available for this set of data",
		containerId: "ciTableSlider",
	});

	const refineTopicInfoTooltip = new HtmlTooltip({
		body: "E.g. Select <b>Female, Asian, Infant</b> to show all results for Female <b>OR</b> Asian <b>OR</b> Infant.",
		containerId: "refineInfoRow",
	});

	const staticBinningTooltip = new HtmlTooltip({
		body: "Freeze data bin ranges for all time periods for ease of comparison",
		containerId: "staticBinningContainer",
	});
	staticBinningTooltip.render();

	resetInfoTooltip.render();
	editFiltersTooltip.render();
	removeFiltersTooltip.render();
	ciToggleTooltip.render();
	refineTopicInfoTooltip.render();

	$(".generalTooltip.tooltip").css("visibility", "hidden");

	$("#resetInfo").mouseover((e) => resetInfoTooltip.mouseover(e));
	$("#resetInfo").mousemove((e) => resetInfoTooltip.mousemove(e));
	$("#resetInfo").mouseleave((e) => resetInfoTooltip.mouseout(e));
	$("#resetInfo").mouseleave((e) => refineTopicInfoTooltip.mouseout(e));

	$(".editFiltersIcon").mouseover((e) => editFiltersTooltip.mouseover(e));
	$(".editFiltersIcon").mousemove((e) => editFiltersTooltip.mousemove(e));
	$(".editFiltersIcon").mouseleave((e) => editFiltersTooltip.mouseout(e));
	$(".editFiltersIcon").mouseleave((e) => refineTopicInfoTooltip.mouseout(e));

	$(".clearFiltersIcons").mouseover((e) => removeFiltersTooltip.mouseover(e));
	$(".clearFiltersIcons").mousemove((e) => removeFiltersTooltip.mousemove(e));
	$(".clearFiltersIcons").mouseleave((e) => removeFiltersTooltip.mouseout(e));

	$("#ciTableHover").mouseover((e) => ciToggleTooltip.mouseover(e));
	$("#ciTableHover").mousemove((e) => ciToggleTooltip.mousemove(e));
	$("#ciTableHover").mouseleave((e) => ciToggleTooltip.mouseout(e));

	$("#refineInfoIcon").mouseover((e) => refineTopicInfoTooltip.mouseover(e));
	$("#refineInfoIcon").mousemove((e) => refineTopicInfoTooltip.mousemove(e));
	$("#refineInfoIcon").mouseleave((e) => refineTopicInfoTooltip.mouseout(e));

	$("#staticBinningLabel").mouseover((e) => staticBinningTooltip.mouseover(e));
	$("#staticBinningLabel").mousemove((e) => staticBinningTooltip.mousemove(e));
	$("#staticBinningLabel").mouseleave((e) => staticBinningTooltip.mouseout(e));
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
			title: "Classification: ",
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

export const getAllChartProps = (data, showBarChart, config, xAxisTitle) => {
	const chartValueProperty = "estimate";
	const vizId = "chart-container";
	const scaleTimeIndicators = ["suicide", "Medicaid"];
	const needsScaleTime = scaleTimeIndicators.some((ind) => data[0]?.indicator.includes(ind));
	const colors = [
		"#6A3D9A",
		"#A35200",
		"#E31A1C",
		"#298023",
		"#1B6CA1",
		"#549CC9",
		"#A880BC",
		"#E67300",
		"#FC5D5A",
		"#62A02C",
	];

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
		barColors: colors,
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
		multiLineColors: colors,
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

export const resetTopicDropdownList = () => {
	$("#topicDropdown-select .genDropdownOption").each((i, el) => {
		$(el).removeClass("genOptionFilteredOut");
		$(el).attr("style", "");
	});

	topicGroups.forEach((group, i) => {
		$("#topicGroup" + i)
			.attr("hidden", false)
			.removeClass("genOptionFilteredOut");
	});

	$(".genDropdownOpened").removeClass("genDropdownOpened");
};

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
				$(el).removeClass("genOptionFilteredOut");
			} else {
				$(el).hide();
				$(el).addClass("genOptionFilteredOut");
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

		topicGroups.forEach((group, i) => {
			const someVisible = $(`.topicGroup${i}`).not(".genOptionFilteredOut").length > 0;
			if (someVisible) {
				$("#topicGroup" + i)
					.attr("hidden", false)
					.removeClass("genOptionFilteredOut");
			} else
				$("#topicGroup" + i)
					.attr("hidden", true)
					.addClass("genOptionFilteredOut");
		});
	} else resetTopicDropdownList();
};

export const binData = (data) => {
	return ClassifyData(data, "estimate", 4, 1);
};
