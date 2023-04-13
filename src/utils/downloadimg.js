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

export const downLoadMap2 = () => {
	let mapImageContainer = document.getElementById("us-map-container");
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
		html2canvas(mapImageContainer, {
			onclone: (clone) => {
				let titleChart = clone.getElementById("chart-title").textContent;
				clone.getElementById(
					"mapDownloadTitle"
				).innerHTML = `<div style='line-height: 46.7057px; font-size: 42.4597px; text-align: center; padding: 10px 0;'>${titleChart}</div>`;
			},
		}).then((canvas) => {
			let titleChart = document.getElementById("chart-title").textContent;
			let imgName = `${titleChart}.png`;
			saveCanvasAs(canvas.toDataURL(), imgName);
			downloadButton.innerHTML = "Download Image";
			downloadButton.classList.remove("disabled");
			downloadButtonContent.classList.remove("fa-circle-notch", "fa-spin");
		});
	}, 100);
};

export const downLoadGenChart = (params) => {
	const contentContainer = document.getElementById(params.contentContainer);
	const downloadButton = document.getElementById(params.downloadButton);
	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
	downloadButton.classList.add("disabled");

	setTimeout(() => {
		html2canvas(contentContainer, {
			scrollY: -window.scrollY,
			backgroundColor: "#ffffff",
			onclone: (clone) => {
				const titleChart = clone.getElementById("chart-title").textContent;
				const subTitle = clone.getElementById("chart-subtitle").textContent;
				let target = clone.getElementById("chart-container-svg");
				target.style.margin = 0;
				const currViewBox = target.getAttribute("viewBox").split(",");
				const leftMargin = $("#chart-container-svg").css("margin-left").replace("px", "");
				target.setAttribute("viewBox", `${-leftMargin}, 0, ${currViewBox[2]}, ${currViewBox[3]}`);
				clone.getElementById("chart-container-chartTitle").innerHTML = `
					<div style='font-size: 33.66px;'>${titleChart}</div>
					<div style='font-size: 24px;'>${subTitle}</div>
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
