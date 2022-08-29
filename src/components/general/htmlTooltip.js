/** *******************************************************************
********** Instructions for creation of HtmlTooltip    ****************
***********************************************************************


********************************************************************* */

const template = `
            <div class="generalTooltip tooltip">
                <div class="tip-header">
                    <h3></h3>
                    <h4></h4>
                </div>
                <div class="tip-body"></div>
            </div>
            `;

export class HtmlTooltip {
	constructor({ h3, h4, body, containerId }) {
		this.h3 = h3;
		this.h4 = h4;
		this.body = body;
		this.containerId = containerId;
		this.incomingElement = null;
	}

	render() {
		$(`#${this.containerId}`).append(template);
	}

	getWhichSvgSides = (event) => {
		const boundingBox = $(`#${this.containerId}`)[0].getBoundingClientRect();
		const centerX = boundingBox.width / 2;
		const centerY = boundingBox.height / 2;
		const sides = {
			x: event.clientX < centerX ? "left" : "right",
			y: event.clientY < centerY ? "top" : "bottom",
		};
		return { sides, leftBounds: boundingBox.left };
	};

	mouseover(event) {
		this.incomingElement = event.target;
		const { sides, leftBounds } = this.getWhichSvgSides(event);

		this.incomingElement.style.transform = "scale(1.1)";

		const tip = d3.select(`#${this.containerId} .tooltip`);
		if (this.h3) tip.select("h3").html(this.h3);
		else tip.select("h3").html("");
		if (this.h4) tip.select("h4").html(this.h4);
		else tip.select("h4").html("");
		if (this.body) tip.select(".tip-body").html(this.body);
		else tip.select(".tip-body").html("");

		const tipHeight = d3.select(`#${this.containerId} .generalTooltip`)._groups[0][0].offsetHeight;
		const tipWidth = d3.select(`#${this.containerId} .generalTooltip`)._groups[0][0].offsetWidth;

		const { clientX, clientY } = event;
		const widthToLeftBounds = clientX - leftBounds;

		// prevent tooltipWidth from going out of bounds for low resolution display
		if (tipWidth > widthToLeftBounds && sides.x === "right") tip.style("width", widthToLeftBounds + "px");
		else tip.style("width", "inherit");

		tip.style("left", sides.x === "left" ? `${clientX + 10}px` : `${clientX - tipWidth - 10}px`)
			.style("top", sides.y === "top" ? `${clientY + 10}px` : `${clientY - tipHeight - 10}px`)
			.transition()
			.duration(400)
			.style("visibility", "visible")
			.style("z-index", 2);

		if (!this.h3 && !this.h4) tip.select(`#${this.containerId} .tip-header`).style("display", "none");
		if (!this.body) tip.select(".tip-header").style("border-bottom", "none");
	}

	mousemove(event) {
		const { sides } = this.getWhichSvgSides(event);
		const tipHeight = d3.select(`#${this.containerId} .generalTooltip.tooltip`)._groups[0][0].offsetHeight;
		const tipWidth = d3.select(`#${this.containerId} .generalTooltip.tooltip`)._groups[0][0].offsetWidth;
		d3.select(`#${this.containerId} .tooltip`)
			.style("left", sides.x === "left" ? `${event.clientX + 10}px` : `${event.clientX - tipWidth - 10}px`)
			.style("top", sides.y === "top" ? `${event.clientY + 10}px` : `${event.clientY - tipHeight - 10}px`);
	}

	mouseout() {
		this.incomingElement.style.transform = "scale(1)";
		d3.select(`#${this.containerId} .tooltip`).transition().duration(150).style("visibility", "hidden");
	}
}