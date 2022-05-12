/** *******************************************************************
********** Instructions for creation of GeneralTooltip ****************
***********************************************************************

!!!!! Your chart/graph must use d3 >v5.0.0 which is available at /lib/d3.min.js !!!!

This setup goes in the graph or chart .js file. This example comes from ustrendsgraph.js

The big aha idea here is that our chart objects, be they bars (rects), circles, lines, etc
all contain data. So instead of reinventing the wheel with how we get the tooltip data, we
simply take the data for the tooltip directly from the object which is hovered over.

1. Instantiate a new instance and then call it's render function
	example:
		const genTooltip = new GenTooltip(getTooltipConstructor());
        genTooltip.render();

2. Add mouse functions to the bars, circles, or other objects in the graph/chart
	example:
        d3.selectAll('rect.bar, circle')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);
		
3. The tooltip is in another file and we need to propagate data from the graph to the tooltip
   so we create helper functions to push the data (the data is d3.select(this)).
	example:
		function mouseover() { genTooltip.mouseover(d3.select(this)) };
        function mousemove() { genTooltip.mousemove() };
        function mouseout() { genTooltip.mouseout(d3.select(this)) };

4. Build the constructor object. Four objects are required
	a. property lookup: 
		{
			'id key': {
				title: 'title name',
				datumType: 'number' | 'string' | 'percent1' | 'percent2' | 
				           'longDate' | 'shortDate' | 'empty' | ''
			}
		}
		example:
			const propertyLookup = { // list properties needed in tooltip body and give their line titles and datum types
                'New_case': { title: 'New Cases: ', datumType: 'number' },
                'tot_cases': { title: 'Total Cases: ', datumType: 'number' },
                'new_death': { title: 'New Deaths: ', datumType: 'number' },
                'tot_deaths': { title: 'Total Deaths: ', datumType: 'number' },
                'new_test_results_reported': { title: 'New Tests Performed: ', datumType: 'number' },
                'percent_positive_7_day': { title: '7-day % Positivity: ', datumType: 'percent2' },
                'incidence': { title: 'Total Case Rate per 100K: ', datumType: 'number' },
                'seven_day_cum_new_cases_per_100k': { title: '7-Day Case Rate per 100K: ', datumType: 'number' },
                'death_100k': { title: 'Total Death Rate per 100K: ', datumType: 'number' },
                'seven_day_cum_new_deaths_per_100k': { title: '7-Day Death Rate per 100K: ', datumType: 'number' },
                'avg_7day_pos_ed_visits': { title: '7-Day Avg % of ED Visits: ', datumType: 'percent1' },
                'seven_day_avg_new_cases': { title: '7-day Moving Avg Cases: ', datumType: 'number' },
                'seven_day_avg_new_deaths': { title: '7-day Moving Avg Deaths: ', datumType: 'number' },
                'Administered_7_Day_Rolling_Average': { title: '7-Day Avg Total Doses Daily: ', datumType: 'number' },
                'Admin_Dose_1_Day_Rolling_Average': { title: '7-Day Avg People Receiving at Least 1 Dose: ', datumType: 'number' },
                'Series_Complete_Day_Rolling_Average': { title: '7-Day Avg People Fully Vaccinated: ', datumType: 'number' },
                'state': { title: '', datumType: 'string' },
                'date': { title: 'Date: ', datumType: 'longDate' },
                'select': { title: '', datumType: 'empty' },
                '': { title: '', datumType: 'empty' }
            };

	b. headers - these are the id's in the data
		example: 2 headers
			const headerProps = ['state', 'county'];
	
		example: 1 header
			const headerProps = ['state', ''];
	
		example: 0 headers
			const headerProps = ['', ''];
			
	c. body properties. These contain the id's of the dropdowns, radio buttons, etc, that provide the key for the tooltip body info.
	   This is the order for displaying body tooltip lines
		example:
			const bodyProps = [
                selectionTest.leftAxis, // e.g. 'New_case'
                avgProp, // e.g. some custom value, in this case the 'seven_day_avg_new_cases' or ''
                selectionTest.rightAxis, // e.g. 'death_100k'
                'date' // some hard coded value to show up on every tooltip
            ];
			
	d. The svg Id
		example: 'us-state-trends-chart'
		
5. Create a function and return the constructor like this:
	example:
		function getTooltipConstructor() {
			// build the objects described in step 4 right here and then return them
            return { propertyLookup, headerProps, bodyProps, svgId };
        }
********************************************************************* */

import * as d3 from "../../lib/d3.min";
import { genFormat } from "../../utils/genFormat";

const getWhichSvgSides = (svgId) => {
	const svg = d3.select(`svg#${svgId}`);
	const boundingBox = svg.node().getBoundingClientRect();
	const centerX = boundingBox.width / 2;
	const centerY = boundingBox.height / 2;
	const pointInSvg = d3.mouse(svg.node());
	const sides = {
		x: pointInSvg[0] < centerX ? "left" : "right",
		y: pointInSvg[1] < centerY ? "top" : "bottom",
	};
	return { sides, leftBounds: boundingBox.left };
};

const template = `
            <div class="generalTooltip tooltip">
                <div class="tip-header">
                    <h3></h3>
                    <h4></h4>
                </div>
                <div class="tip-body"></div>
            </div>
            `;

export class GenTooltip {
	constructor({ propertyLookup, headerProps, bodyProps, svgId, vizId }) {
		this.propertyLookup = propertyLookup;
		this.headerProps = headerProps;
		this.bodyProps = bodyProps;
		this.svgId = svgId;
		this.vizId = vizId;
		this.incomingElement = null;
		this.incomingOpacity = 0;
		this.incomingStrokeWidth = 0;
	}

	render() {
		$(`#${this.vizId}`).append(template);
	}

	mouseover(element, additionalProperties) {
		this.incomingElement = element;
		const { sides, leftBounds } = getWhichSvgSides(this.svgId);
		let data = element.data()[0];

		if (additionalProperties) data = data[additionalProperties[0]];
		const bodyData = [];
		let prop;
		this.bodyProps.forEach((bp) => {
			if (Array.isArray(bp)) {
				const values = bp.map((p) => genFormat(data[p], this.propertyLookup[p].datumType));
				const { title } = this.propertyLookup[bp[0]];
				bodyData.push([title, values.join(" ")]);
			} else {
				prop = this.propertyLookup[bp];
				bodyData.push([prop.title, genFormat(data[bp], prop.datumType)]);
			}
		});

		if (additionalProperties) {
			additionalProperties.shift();
			for (let i = 0; i < additionalProperties.length; i++) {
				bodyData.push(additionalProperties[i]);
			}
		} 

		this.incomingOpacity = element.style("opacity");
		this.incomingStrokeWidth = element.style("stroke-width");

		if (element.node().classList[0] === "hover-bar") {
			element.style("opacity", 0.05);
		} else {
			element.style("opacity", 1);
			element.style("stroke-width", 3);
		}

		const tip = d3.select(`#${this.vizId} .tooltip`);
		const h3Prop = this.headerProps[0];
		const h3Lookup = this.propertyLookup[h3Prop];
		tip.select("h3").html(h3Lookup.title + genFormat(data[h3Prop], h3Lookup.datumType));

		const h4Prop = this.headerProps[1];
		const h4Lookup = this.propertyLookup[h4Prop];
		if (h4Prop !== "") tip.select("h4").html(h3Lookup.title + genFormat(data[h4Prop], h4Lookup.datumType));

		d3.select(`#${this.vizId} .tip-body`)
			.selectAll("p")
			.data(bodyData)
			.join("p")
			.attr("class", "generalTooltip tip-info")
			.style("display", (d) => (d[0] === "" && d[1] === "" ? "none" : "block"))
			.html((d) => `<strong>${d[0]}</strong>${d[1]}`);

		const tipHeight = d3.select(`#${this.vizId} .generalTooltip`)._groups[0][0].offsetHeight;
		const tipWidth = d3.select(`#${this.vizId} .generalTooltip`)._groups[0][0].offsetWidth;

		const { clientX, clientY } = d3.event;
		const widthToLeftBounds = clientX - leftBounds;

		// prevent tooltipWidth from going out of bounds for low resolution display
		if (tipWidth > widthToLeftBounds && sides.x === "right") tip.style("width", widthToLeftBounds + "px");
		else tip.style("width", "inherit");

		tip.style("left", sides.x === "left" ? `${clientX + 5}px` : `${clientX - tipWidth - 5}px`)
			.style("top", sides.y === "top" ? `${clientY + 5}px` : `${clientY - tipHeight - 5}px`)
			.transition()
			.duration(400)
			.style("visibility", "visible")
			.style("opacity", 1);

		if (h3Prop === "" && h4Prop === "") tip.select(`#${this.vizId} .tip-header`).style("display", "none");
	}

	mousemove() {
		const { sides } = getWhichSvgSides(this.svgId);
		const tipHeight = d3.select(`#${this.vizId} .generalTooltip.tooltip`)._groups[0][0].offsetHeight;
		const tipWidth = d3.select(`#${this.vizId} .generalTooltip.tooltip`)._groups[0][0].offsetWidth;

		d3.select(`#${this.vizId} .tooltip`)
			.style("left", sides.x === "left" ? `${d3.event.clientX + 5}px` : `${d3.event.clientX - tipWidth - 5}px`)
			.style("top", sides.y === "top" ? `${d3.event.clientY + 5}px` : `${d3.event.clientY - tipHeight - 5}px`);
	}

	mouseout() {
		this.incomingElement.style("opacity", this.incomingOpacity);
		this.incomingElement.style("stroke-width", this.incomingStrokeWidth);

		d3.select(`#${this.vizId} .tooltip`)
			.transition()
			.duration(150)
			.style("visibility", "hidden")
			.style("opacity", 0);
	}
}
