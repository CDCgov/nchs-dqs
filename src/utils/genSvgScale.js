export const getGenSvgScale = (vizId) => {
	const fullSvgWidth = parseInt(d3.select(`#${vizId}`).style("width"), 10);
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

	return { fullSvgWidth, overallScale, svgHeightRatio, svgScale };
};
