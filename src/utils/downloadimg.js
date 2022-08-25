import html2canvas from "html2canvas";
import { saveSvgAsPng } from "../../node_modules/save-svg-as-png";
import { Analytics } from "../eventhandlers/analytics";

const saveCanvasAs = (uri, filename) => {
	const link = document.createElement("a");
	if (link.download !== undefined) {
		link.href = uri;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else {
		window.open(uri);
	}
};

export const downLoadMap2 = function () {
	let mapImageContainer = document.getElementById("us-map-container");
	let imageHeightContainer = document.getElementById("us-map-container");
	//let imageTargetName = document.getElementById("maptitle").textContent;
	let downloadButton = document.getElementById("dwn-chart-img");
	let downloadButtonContent = document.getElementById("dwn-chart-img");
	downloadButtonContent.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
	downloadButtonContent.classList.add("disabled");
	const updateSVG = (clone) => {
		const svgHeight = clone.getElementById("us-map-container").clientHeight;

		let chart = clone.getElementById("svgviz005_uscases");

		const heightShift = appState.currentDeviceType !== "desktop" ? -200 : 0;
		chart.setAttribute("height", svgHeight);
		chart.setAttribute("width", window.innerWidth - 300);
		let viewBox = chart.getAttribute("viewBox").split(", ");
		chart.setAttribute(
			"viewBox",
			`-200, ${heightShift}, ${parseInt(viewBox[2]) + 350}, ${parseInt(viewBox[3]) + 40}`
		);
		chart.setAttribute("height", svgHeight);
		chart.setAttribute("width", window.innerWidth - 300);
	};

	if (appState.currentDeviceType !== "desktop") {
		scrollTo(0, 0);
	}

	setTimeout(() => {
		console.log(mapImageContainer);
		html2canvas(mapImageContainer, {
			// scrollY: -window.pageYOffset + 500,
			// scrollX: -50,
			// scale: 2,
			// height: imageHeightContainer.clientHeight,
			// width: imageHeightContainer.clientWidth,
			// width: window.innerWidth - 650,
			//onclone: (clone) => updateSVG(clone),

			onclone: (clone) => {
				let titleChart = clone.getElementById("chart-title").textContent;
				clone.getElementById("mapDownloadTitle").innerHTML =
					"<div style='line-height: 46.7057px; font-size: 42.4597px;'>" + titleChart + "</div>";
			},
		}).then((canvas) => {
			// let titleChart = document.getElementById("chart-title").textContent;
			// document.getElementById("us-map-container").innerHTML = "<div>" + titleChart + "<br />" + "Test</div>";
			let titleChart = document.getElementById("chart-title").textContent;
			let imgName = `${titleChart}.png`;
			saveCanvasAs(canvas.toDataURL(), imgName);
			downloadButton.innerHTML = "Download Image";
			downloadButton.classList.remove("disabled");
			downloadButtonContent.classList.remove("fa-circle-notch", "fa-spin");
			// let interaction = `Download Image > ${imageTargetName}`;
			// Analytics.triggerOmnitureInteractions(interaction);
		});
	}, 100);
};

export const downLoadGenChart = (params) => {
	// console.log("params", params);
	//if (params.needToShowHide) $("#chart-container").show();
	const contentContainer = document.getElementById(params.contentContainer);
	const svgContainer = document.getElementById("chart-container-svg");
	const height = document.getElementById("chart-container").clientHeight + 500;
	// const width = "175%";
	const downloadButton = document.getElementById(params.downloadButton);
	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
	downloadButton.classList.add("disabled");
	// console.log("height", height);
	// console.log("width", width);
	// Any elements that come on the page prior to the current selection for html2Canvas
	// that have the data-html2canvas-ignore attribute will throw off the correct y-page
	// position that we need to scroll to. This is only a problem on pages with multiple
	// image download buttons. Get the outer height of each element that has the
	// data-html2canvas-ignore attribute. If it comes prior to the current image
	// download, sum it's height and remove it from the scrollY value.
	const html2CanvaseIgnoreElements = document.querySelectorAll("*[data-html2canvas-ignore]");

	let ignoredElementsHeight = 0;
	const topOfContainer = contentContainer.getBoundingClientRect().top;
	html2CanvaseIgnoreElements.forEach((d) => {
		const bbox = d.getBoundingClientRect();
		// if (bbox.top < topOfContainer) ignoredElementsHeight += bbox.height;
		if (d.id !== "chart-container-svg-chart-legend") ignoredElementsHeight += bbox.height;
	});

	setTimeout(() => {
		// console.log(contentContainer.clientHeight);
		// console.log(ignoredElementsHeight);

		const heightWithoutHiddenElements = contentContainer.clientHeight - ignoredElementsHeight;

		html2canvas(contentContainer, {
			scrollY: -window.scrollY,
			backgroundColor: "#ffffff",
			onclone: (clone) => {
				let titleChart = clone.getElementById("chart-title").textContent;
				let subTitle = clone.getElementById("chart-subtitle").textContent;
				clone.getElementById("chart-container-svg");
				clone.getElementById("chart-container-chartTitle").innerHTML = `
					<div style='font-size: 33.66px'>${titleChart}</div>
					<div style='font-size: 24px'>${subTitle}</div>
				`;
			},
		}).then((canvas) => {
			let imgName = `${params.imageSaveName}.png`;
			saveCanvasAs(canvas.toDataURL(), imgName);
			downloadButton.innerHTML = "Download Image";
			downloadButton.classList.remove("disabled");
		});
	}, 100);
};

export { saveSvgAsPng };
