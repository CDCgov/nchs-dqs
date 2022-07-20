export const getGenSvgScale = (vizId) => {
	//console.log("getGenSvgScale vizId:", vizId);

	const fullSvgWidth = parseInt(d3.select(`#${vizId}`).style("width"), 10);
	// could not get the above line to work so tried the one below
	// but problem was that the map div was not rendered yet PRIOR to me calling renderMap
	//const fullSvgWidth =  parseInt(d3.select(`#${this.mapVizId}`).node().getBoundingClientRect().width);

	let overallScale;
	switch (true) {
		case fullSvgWidth > 1050:
			overallScale = fullSvgWidth / 1400;
			break;
		case fullSvgWidth > 650:
			overallScale = fullSvgWidth / 1050;
			break;
		case fullSvgWidth > 300:
			overallScale = fullSvgWidth / 650;
			break;
		default:
			overallScale = fullSvgWidth / 300;
			break;
	}

	let svgScale = 0.8;
	if (fullSvgWidth <= 1050) svgScale = 1;
	let svgHeightRatio = 0.5;
	if (fullSvgWidth <= 650 && fullSvgWidth > 300) svgHeightRatio = 0.75;
	else if (fullSvgWidth <= 300) svgHeightRatio = 1;

	// Lincoln 2022-07-18 this genSvgScale really only applies to CDC CDT page so for now just setting these
	// scales to 1
	overallScale = 1;
	svgScale = 1;
	return { fullSvgWidth, overallScale, svgHeightRatio, svgScale };
};
