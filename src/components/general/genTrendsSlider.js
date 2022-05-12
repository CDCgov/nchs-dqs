import * as d3 from "../../lib/d3.min";

export class GenTrendsSlider {
	constructor(sliderVizId, containerId) {
		this.vizDivID = sliderVizId;
		this.containerId = containerId || "";
	}

	/* US Trends Graph generator */
	render(domain, width, margin, yAdjust, sdd) {
		let selectedDateDomain;
		if (sdd === false) selectedDateDomain = null;
		else selectedDateDomain = sdd;

		// the following handles the scenarios when datasets have different start/end dates.
		// 1. The !selectedDateDomain[x] triggers on NULL and handles when the calling function sent in a selectedDateDomain
		//    with a null value in index 0, 1, or both and expands the selectedDateDomain to match the
		//    bounds of the incoming domain.
		// 2. The domain[x] < or > selectedDateDomain[x] handles when the incoming selectedDateDomain was
		//    too big so we need to reduce it to match the new domain, which has a smaller date range.
		if (selectedDateDomain) {
			// if new data max is less then selected, set it to max - bc you can't be greater than the max
			if (!selectedDateDomain[1] || domain[1] < selectedDateDomain[1]) selectedDateDomain[1] = domain[1];
			// if new data min is greater than selected then set to min - bc you can't have selected outside the range 
			if (!selectedDateDomain[0] || domain[0] > selectedDateDomain[0]) selectedDateDomain[0] = domain[0];
		}

		const height = 20; // v1
		const leftMargin = margin.left < 30 ? 30 : margin.left;
		const rightMargin = margin.right < 30 ? 30 : margin.right;
		const sliderWidth = width - (leftMargin + rightMargin);

		const formatTime = d3.timeFormat("%b %d, '%y");
		const xScale = d3.scaleLinear().domain(domain).range([0, sliderWidth]);

		const deviceType = appState.currentDeviceType;
		const mobile = deviceType === "mobile" || deviceType === "tablet";
		const txRight = rightMargin < leftMargin ? (leftMargin - rightMargin) / 2 : 0;
		const svg = d3
			.select(`#${this.vizDivID}`)
			.append("svg")
			.style("overflow", "visible")
			.attr("height", height)
			.attr("width", sliderWidth)
			.attr("transform", `translate(${txRight}, ${yAdjust})`);

		const slider = svg.append("g");

		const leftLabel = slider
			.append("text")
			.attr("id", "slider-label-left")
			.attr("dominant-baseline", "hanging")
			.attr("font-size", mobile ? "8px" : "10px")
			.attr("text-anchor", "end")
			.attr("y", height + 5);

		const rightLabel = slider
			.append("text")
			.attr("id", "slider-label-right")
			.attr("dominant-baseline", "hanging")
			.attr("font-size", mobile ? "8px" : "10px")
			.attr("text-anchor", "start")
			.attr("y", height + 5);

		const brush = d3
			.brushX()
			.extent([
				[0, 0],
				[sliderWidth, height],
			])
			.on("brush", () => {
				let s = d3.event.selection;
				const leftDate = xScale.invert(s[0]);
				const rightDate = xScale.invert(s[1]);
				leftLabel.attr("x", s[0]).text(formatTime(leftDate));
				rightLabel.attr("x", s[1]).text(formatTime(rightDate));
				handle.attr("display", null).attr("transform", (d, i) => {
					return `translate(${[s[i], -height / 4]})`;
				});
				// fix or over flow of corners
				d3.select("rect.selection").attr("ry", 15).attr("rx", 15);

				const newDomain = [new Date(leftDate).setHours(0, 0, 0, 0), new Date(rightDate).setHours(0, 0, 0, 0)];

				const customSliderEvent = new CustomEvent(`${this.containerId}trendsSliderEvent`, {
					detail: newDomain,
					bubbles: true,
					cancelable: true,
					composed: false,
				});
				document.getElementById(`${this.containerId}sliderEventHandler`).dispatchEvent(customSliderEvent);
			});

		const brushGroup = slider.append("g").attr("class", "sliderBrush").call(brush);

		// add brush handles
		// This path used with permission as released under the GNU General Public License, version 3, from Mike Bostock
		const brushResizePath = (d) => {
			let e = +(d.type === "e"),
				x = e ? 1 : -1,
				y = height / 2;
			return (
				`M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${0.5 * x},${2 * y}Z` +
				`M${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`
			);
		};

		const handle = brushGroup
			.selectAll(".sliderHandles")
			.data([{ type: "w" }, { type: "e" }])
			.enter()
			.append("path")
			.attr("class", "sliderHandles")
			.attr("cursor", "ew-resize")
			.attr("d", brushResizePath);

		brushGroup
			.call(brush.move, selectedDateDomain?.map((s) => xScale(s)) ?? [0, sliderWidth])
			.selectAll(".overlay")
			.attr("rx", 15)
			.each((d) => {
				d.type = "selection";
			})
			.on("mousedown touchstart", brushCentered);

		function brushCentered() {
			const cx = d3.mouse(this)[0];
			const dx = sliderWidth / 10;
			const x0 = cx - dx / 2;
			const x1 = cx + dx / 2;
			d3.select(this.parentNode).call(brush.move, () => {
				if (x1 >= sliderWidth) {
					return [sliderWidth - dx, sliderWidth];
				}
				return x0 <= 0 ? [0, dx] : [x0, x1];
			});
		}
	}
}

export const getCurrentSliderDomain = (genChartSelector) => {
	// Assumes incoming dates pulled from slider strings in format "Jan 20, 2020"
	// - dont just remove the ' in '20 we need a 4 digit year!
	const selectedStartDate = $(`${genChartSelector} #slider-label-left`)?.html()?.replace(`'`, "20");
	const selectedEndDate = $(`${genChartSelector} #slider-label-right`)?.html()?.replace(`'`, "20");
	let selectedDateDomain;
	// here is where components using genTrendsSlider
	// need to use exact name chartConfig in constructor
	// and use that for chart properties AND pass the data
	// as a PROP as well (TT)
	let currentDomain;
	currentDomain = d3.extent(appState.ACTIVE_TAB.chartConfig.data.map((d) => d.date));
	let currentDateDomain;

	if (selectedStartDate && selectedEndDate) {
		//Assumes incoming dates pulled from slider strings in format "Jan 20, 2020"
		let selectedStartDateF = Date.parse(selectedStartDate);
		let sSDF = new Date;
		sSDF.setTime(selectedStartDateF);
		let selectedEndDateF = Date.parse(selectedEndDate);
		let sEDF = new Date;
		sEDF.setTime(selectedEndDateF);
		selectedDateDomain = [new Date(sSDF), new Date(sEDF)];
		// the code below fails and returns NULL, so broke it out above step by step
		//selectedDateDomain = [new Date(`${selectedStartDate}T00:00:00`), new Date(`${selectedEndDate}T00:00:00`)];
		//currentDateDomain = [new Date(`${currentDomain[0]}T00:00:00`), new Date(`${currentDomain[1]}T00:00:00`)];
		currentDateDomain = [new Date(currentDomain[0]), new Date(currentDomain[1])];
		// if the min selected matches the min in the data, then set to null so that it stays pegged at MIN
		if (selectedDateDomain[0].getTime() === currentDateDomain[0].getTime()) selectedDateDomain[0] = null;
		// if the max selected matches the max in the data domain, then set to null so it stays pegged at MAX
		if (selectedDateDomain[1].getTime() === currentDateDomain[1].getTime()) selectedDateDomain[1] = null;

		return selectedDateDomain;
	}
	return false;
};
