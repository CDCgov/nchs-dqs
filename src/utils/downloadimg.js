import html2canvas from "html2canvas";
import { doc } from "prettier";
import { saveSvgAsPng } from "../../node_modules/save-svg-as-png";
import { Analytics } from "../eventhandlers/analytics";

// export const downLoadCasesTrendsTab = function (viztype) {
// 	let totalDeathBtn = document.getElementById("btnUSMapTotalDeaths");
// 	let toggleChartBtnContainer = document.querySelectorAll("#chart-toggle-container button")[0];

// 	let parentContainerByQuery = document.querySelector("#viz005_uscases");
// 	let child = parentContainerByQuery.firstChild; // dont have to be concerned if ids change on svg or element
// 	let subchild = child.firstChild;
// 	let totalCasesChartSvg = document.querySelector("#viz005_uscases svg"); // total cases chart svg
// 	if (viztype === "map") {
// 		let imgName = "usa-maps.png";
// 		saveSvgAsPng(child, imgName, { scale: 2.0 });
// 		let interaction = `Download Image > ${imgName}`;
// 		Analytics.triggerOmnitureInteractions(interaction);
// 	}
// 	// for charts that are not svgs and are acutally 2 divs
// 	else if (viztype === "chart") {
// 		let imgName = "usa-charts.png";
// 		saveSvgAsPng(subchild, imgName, { scale: 2.0 });
// 		let interaction = `Download Image > ${imgName}`;
// 		Analytics.triggerOmnitureInteractions(interaction);
// 	}
// 	// special case Total deaths tab has differnt markup semantics than other chart tabs  BUT is an svg
// 	else if (
// 		viztype === "chart" &&
// 		appState.CURRENT_TAB === "cases" &&
// 		totalDeathBtn.classList.contains("active") &&
// 		toggleChartBtnContainer.classList.contains("active")
// 	) {
// 		let imgName = "usa-charts.png";
// 		saveSvgAsPng(totalCasesChartSvg, imgName, { scale: 2.0 });
// 		let interaction = `Download Image > ${imgName}`;
// 		Analytics.triggerOmnitureInteractions(interaction);
// 	}
// };

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

// export const downLoadUsCaseandChartMap = function (cont, btnID) {
// 	let casesBtnContainer = document.getElementById(cont.id);
// 	let chartContainerHeight = document.getElementById("viz005_uscases").clientWidth - 200;
// 	let chartSelected = [...document.getElementById("chart-toggle-btn").classList];
// 	let adjustSVG = function (clone) {
// 		// for map viz005_uscases  | for chart viz_area_us_cases
// 		if (chartSelected.includes("active")) {
// 			let chartAxisWidth = clone.getElementById("territory-top-x-axis").clientWidth;
// 			clone.getElementById("territory-top-x-axis").children[0].setAttribute("transform", "translate(17,1)");
// 			clone.getElementById("territory-bottom-x-axis").children[0].setAttribute("transform", "translate(17,1)");
// 			clone.getElementById("territory-top-x-axis").children[0].setAttribute("width", chartAxisWidth);
// 			clone.getElementById("territory-bottom-x-axis").children[0].setAttribute("width", chartAxisWidth);
// 			//  //viz_area_us_cases
// 			let svgTarget = clone.getElementById("widget_4");
// 			let chart = document.getElementById("territory-chart");
// 			let chartWidth = svgTarget.clientWidth;
// 			let chartHeight = svgTarget.clientHeight;
// 			svgTarget.setAttribute("height", chartHeight + 200);
// 			svgTarget.setAttribute("width", chartWidth);
// 			svgTarget.setAttribute("viewBox", `0, 29, ${chartWidth + 37},${chartHeight + 200}`);
// 		} else {
// 			let svgTarget = clone.getElementById("viz005_uscases").children[0];
// 			let chartWidth = svgTarget.clientWidth;
// 			let chartHeight = svgTarget.clientHeight;
// 			svgTarget.setAttribute("height", chartHeight + 20);
// 			svgTarget.setAttribute("width", chartWidth);
// 			svgTarget.setAttribute("viewBox", `-20, 40, ${chartWidth + 37},${chartHeight + 20}`);
// 		}
// 	};
// 	let downLoadButton = document.getElementById(btnID);
// 	let buttonSpinner = downLoadButton.children[0];
// 	buttonSpinner.classList.add("fa-circle-notch", "fa-spin");
// 	downLoadButton.classList.add("disabled");
// 	let imageTarget = document.getElementById(cont.id);
// 	let chart = document.getElementById("territory-chart");
// 	chart !== null ? chart.setAttribute("style", "height:auto") : "";
// 	if (chartSelected.includes("active")) {
// 		document.getElementById("territory-top-x-axis").children[0].setAttribute("transform", "translate(17,1)");
// 		document.getElementById("territory-bottom-x-axis").children[0].setAttribute("transform", "translate(17,1)");
// 	}
// 	setTimeout(() => {
// 		html2canvas(casesBtnContainer, {
// 			scrollY: -window.pageYOffset,
// 			scrollX: 0,
// 			scale: 1,
// 			removeContainer: true,
// 			onclone: (clone) => adjustSVG(clone),
// 		}).then((canvas) => {
// 			let imgName = `${btnID}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downLoadButton.classList.remove("disabled");
// 			buttonSpinner.classList.remove("fa-spin", "fa-circle-notch");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 			chart !== null
// 				? chart.setAttribute("style", `overflow-y: scroll; height: ${chartContainerHeight - 20}px;`)
// 				: "";
// 		});
// 	}, 100);
// };

export const downLoadUsCaseandChartMap2 = function (viz) {
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
			saveCanvasAs(canvas.toDataURL(), titleChart);
			downloadButton.innerHTML = "Download Image";
			downloadButton.classList.remove("disabled");
			downloadButtonContent.classList.remove("fa-circle-notch", "fa-spin");
			// let interaction = `Download Image > ${imageTargetName}`;
			// Analytics.triggerOmnitureInteractions(interaction);
		});
	}, 100);
};

export const downLoadGenChart = (params) => {
	console.log("params", params);
	//if (params.needToShowHide) $("#chart-container").show();
	const contentContainer = document.getElementById(params.contentContainer);
	const svgContainer = document.getElementById("chart-container-svg");
	const height = document.getElementById("chart-container").clientHeight + 500;
	// const width = "175%";
	const downloadButton = document.getElementById(params.downloadButton);
	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
	downloadButton.classList.add("disabled");
	console.log("height", height);
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
		if (bbox.top < topOfContainer) ignoredElementsHeight += bbox.height;
	});

	svgContainer;

	setTimeout(() => {
		console.log(contentContainer);
		const timePeriodCheckbox = $("#show-one-period-checkbox").is(":checked");
		html2canvas(contentContainer, {
			scrollY: -window.scrollY,
			// height,
			// width,
			backgroundColor: "#ffffff",
			//removeContainer: true,

			onclone: (clone) => {
				console.log($("#show-one-period-checkbox").is(":checked"));

				const timePeriodCheckbox = $("#show-one-period-checkbox").is(":checked");

				let titleChart = clone.getElementById("chart-title").textContent;
				if (timePeriodCheckbox == false) {
					clone
						.getElementById("chart-container-svg")
						.setAttribute("style", "margin-top:10px; height:100%; width:100%; overflow:visible; ");
				} else {
					//clone.getElementById("chart-container-svg").setAttribute("transform", "rotate(45)");
					// const heightShift = appState.currentDeviceType !== "desktop" ? -200 : 0;
					// //let viewBox = clone.getElementById("chart-container-svg").getAttribute("viewBox").split(", ");
					// clone.getElementById("chart-container-svg").setAttribute("viewBox", "-200, 50 , 350 , 40");
					clone.querySelector("#chart-container-svg").setAttribute(
						"style",
						";"
						// 	"transform: rotate(0.125turn)  scaleY(1.0) translate(-350px, 0%); margin-top:500px; margin-left:200px; border: 1px solid blue"
						// 	//"transform: rotate(0.125turn)  scaleY(1.0); margin-top:500px; margin-left:200px; border: 1px solid blue"
					);
					clone.querySelector("#chart-container-svg").setAttribute("width", "2000");
					clone.querySelector("#chart-container-svg").setAttribute("height", "1200");

					if (navigator.userAgent.indexOf("Firefox") != -1) {
						clone
							.querySelector("#chart-container-svg")
							.setAttribute("transform", "rotate(90) translate(50,50)");
						clone.querySelector("#chart-container-svg").setAttribute("viewBox", "-250 800 1800 600");
					} else {
						clone
							.querySelector("#chart-container-svg")
							.setAttribute("transform", "rotate(45) translate(300,0)");
						clone.querySelector("#chart-container-svg").setAttribute("viewBox", "0 0 2700 1500");
					}
					clone.querySelector("#chart-container").setAttribute("style", " ");
					//clone.querySelector("#chart-container-svg").setAttribute("viewBox", "0 0 3500 2700");
					//clone.querySelector("#chart-container-svg").setAttribute("preserveAspectRatio", " ");
					// clone.querySelector("#chart-container-svg").setAttribute(
					// 	"style",
					// 	"transform:  margin-top:500px; margin-left:200px; border: 1px solid blue"
					// 	// 	"transform: rotate(0.125turn)  scaleY(1.0) translate(-350px, 0%); margin-top:500px; margin-left:200px; border: 1px solid blue"
					// 	// 	//"transform: rotate(0.125turn)  scaleY(1.0); margin-top:500px; margin-left:200px; border: 1px solid blue"
					// );
				}
				//clone.body.appendChild(clone.getElementById("chart-container"));
				//console.log(clone.getElementById("chart-container").innerHTML);
				//doc.getElementById("chart-container-svg").setAttribute("height", "500px!important");
				// $("#chart-container-svg").css("background-color", "red!important");
				// $("#chart-container-svg").css("padding-bottom", "0px!important");
				clone.getElementById("chart-container-chartTitle").setAttribute("style", "font-size: 33.66px ");
				clone.getElementById("chart-container-chartTitle").innerHTML = "<div>" + titleChart + "</div>";
			},
		}).then((canvas) => {
			//console.log("canvas", canvas);
			//document.body.appendChild(canvas);
			let imgName = `${params.imageSaveName}.png`;
			saveCanvasAs(canvas.toDataURL(), imgName);
			downloadButton.innerHTML = "Download Image";
			downloadButton.classList.remove("disabled");
			//document.getElementById("chart-container-svg").setAttribute("transform", "rotate(45)");
			// document.getElementById("chart-container-svg").style.paddingBottom = "0";
			// document.getElementById("chart-container-svg").style.height = "";
			//let interaction = `Download Image > ${imgName}`;
			// Analytics.triggerOmnitureInteractions(interaction);
			// if (params.needToShowHide) $("#download_image").hide();
		});
	}, 100);
};

// export const downLoadGenChartButtonText = (params) => {
// 	if (params.needToShowHide) $("#download_image").show();
// 	const contentContainer = document.getElementById(params.contentContainer);
// 	const height = contentContainer.clientHeight;
// 	const width = contentContainer.clientWidth;
// 	const downloadButton = document.getElementById(params.downloadButton);
// 	const initialButtonText = downloadButton.innerHTML;
// 	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
// 	downloadButton.classList.add("disabled");

// 	// Any elements that come on the page prior to the current selection for html2Canvas
// 	// that have the data-html2canvas-ignore attribute will throw off the correct y-page
// 	// position that we need to scroll to. This is only a problem on pages with multiple
// 	// image download buttons. Get the outer height of each element that has the
// 	// data-html2canvas-ignore attribute. If it comes prior to the current image
// 	// download, sum it's height and remove it from the scrollY value.
// 	const html2CanvaseIgnoreElements = document.querySelectorAll("*[data-html2canvas-ignore]");
// 	let ignoredElementsHeight = 0;
// 	const topOfContainer = contentContainer.getBoundingClientRect().top;
// 	html2CanvaseIgnoreElements.forEach((d) => {
// 		const bbox = d.getBoundingClientRect();
// 		if (bbox.top < topOfContainer) ignoredElementsHeight += bbox.height;
// 	});

// 	setTimeout(() => {
// 		html2canvas(contentContainer, {
// 			scrollY: -window.pageYOffset + ignoredElementsHeight,
// 			height,
// 			width,
// 		}).then((canvas) => {
// 			let imgName = `${params.imageSaveName}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downloadButton.innerHTML = initialButtonText;
// 			downloadButton.classList.remove("disabled");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 			if (params.needToShowHide) $("#download_image").hide();
// 		});
// 	}, 100);
// };

// export const downLoadChart = function (params) {
// 	const imageContainer = document.getElementById(params.imageContainer);
// 	const topOfPage = document.getElementById(params.contentContainer).getBoundingClientRect().top;
// 	const topOfImage = imageContainer.getBoundingClientRect().top;
// 	const scrollYoffset = topOfImage - topOfPage;
// 	const height = imageContainer.clientHeight;
// 	const width = imageContainer.clientWidth;
// 	const svgContainer = document.getElementById(params.svgContainer);
// 	const topOfSvg = svgContainer.getBoundingClientRect().top;
// 	const heightShift = topOfSvg - topOfImage;
// 	const additionalTitleCalloutId = params.additionalTitleCalloutId ?? "";

// 	const updateSVG = (clone) => {
// 		const chart = clone.getElementById(params.svgContainer);
// 		chart.setAttribute("height", height);
// 		chart.setAttribute("width", width);
// 		const viewBox = chart.getAttribute("viewBox").split(", ");
// 		chart.setAttribute("viewBox", `${viewBox[0]}, ${viewBox[1]}, ${parseInt(viewBox[2]) * 1.015}, ${viewBox[3]}`);
// 		$(additionalTitleCalloutId).hide();
// 	};

// 	const downloadButton = document.getElementById(params.downloadButton);
// 	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
// 	downloadButton.classList.add("disabled");
// 	$(additionalTitleCalloutId).show();

// 	setTimeout(() => {
// 		html2canvas(imageContainer, {
// 			scrollY: params.useScrollYoffset ? scrollYoffset - window.pageYOffset : heightShift - window.pageYOffset,
// 			scale: 2,
// 			height,
// 			width,
// 			onclone: (clone) => updateSVG(clone),
// 		}).then((canvas) => {
// 			let imgName = `${params.imageSaveName}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downloadButton.innerHTML = "Download Chart";
// 			downloadButton.classList.remove("disabled");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downLoadPregnancyCharts = function (cont, btnID) {
// 	let pregancyChartContainer = document.getElementById(cont.id);
// 	let downLoadButton = document.getElementById(btnID);
// 	let buttonSpinner = downLoadButton.children[0];
// 	buttonSpinner.classList.add("fa-circle-notch", "fa-spin");
// 	downLoadButton.classList.add("disabled");
// 	let imageTarget = document.getElementById(cont.id);
// 	setTimeout(() => {
// 		html2canvas(pregancyChartContainer, {
// 			scrollY: -window.pageYOffset + 80,
// 			scrollX: 0,
// 			scale: 1,
// 		}).then((canvas) => {
// 			let imgName = `${btnID}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downLoadButton.classList.remove("disabled");
// 			buttonSpinner.classList.remove("fa-spin", "fa-circle-notch");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downloadDemographics = function (viz) {
// 	let imageTargetName = document.getElementById(`card-title-${viz}`).textContent;
// 	imageTargetName = imageTargetName.replace(/ /g, "-").replace(/\//g, "-").replace(/:/g, "");
// 	let imgName = `${imageTargetName}-Chart.png`;
// 	let vaccineDemographicContainer = document.getElementById(`viz-${viz}`);
// 	let menuButtons = document.getElementById(`viz-${viz}`).getElementsByClassName("viz-cntrl-btns")[0];
// 	menuButtons.style.display = "none";
// 	const updateSVG = (clone) => {
// 		clone.getElementById(`age-filter-viz-${viz}`).style.display = "none";

// 		const svgHeight = clone.getElementById(`viz-${viz}-viz`).clientHeight;
// 		const svgWidth = clone.getElementById(`viz-${viz}-viz`).clientWidth;
// 		const chart = clone.getElementById(`viz-${viz}-viz`).firstChild;
// 		const heightShift = appState.currentDeviceType !== "desktop" ? -20 : 0;
// 		chart.setAttribute("height", svgHeight);
// 		chart.setAttribute("width", svgWidth);

// 		const legendHeight = clone.getElementById(`demographics-legend-${viz}`).clientHeight;
// 		const legendWidth = clone.getElementById(`demographics-legend-${viz}`).clientWidth;
// 		const legend = clone.getElementById(`demographics-legend-${viz}`);
// 		const legendHeightShift = appState.currentDeviceType !== "desktop" ? -20 : 0;
// 		legend.setAttribute("height", legendHeight);
// 		legend.setAttribute("width", legendWidth);

// 		let redText = clone.querySelectorAll(`[id=viz-legend-${viz}]`);
// 		for (let i = 0; i < redText.length; i++) {
// 			redText[i].style.fontSize = "10px";
// 		}

// 		let grayText = clone.querySelectorAll("[id='gray-text']");
// 		for (let i = 0; i < grayText.length; i++) {
// 			grayText[i].style.fontSize = "10px";
// 		}
// 	};
// 	setTimeout(() => {
// 		html2canvas(vaccineDemographicContainer, {
// 			scrollY: -window.pageYOffset + 30,
// 			scrollX: 0,
// 			scale: 1.5,
// 			onclone: (clone) => {
// 				updateSVG(clone);
// 			},
// 		}).then((canvas) => {
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			menuButtons.style.display = "block";
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downloadCountyView = (params) => {
// 	const contentContainer = document.getElementById(params.contentContainer);
// 	const title = document.createElement("h4");
// 	title.setAttribute("class", "bootstrap-h4-font-size");
// 	title.textContent = params.imageTitle;
// 	title.style.paddingBottom = "1rem";
// 	contentContainer.prepend(title);
// 	const titleHeight = title.clientHeight;
// 	contentContainer.removeChild(title);

// 	const addTitle = (clone) => {
// 		if (params.map) {
// 			const contentContainer = clone.getElementById(params.contentContainer);
// 			contentContainer.prepend(title);
// 		}
// 	};
// 	const height = params.map ? contentContainer.clientHeight + titleHeight : contentContainer.clientHeight;
// 	const width = params.map ? contentContainer.clientWidth * 1.0625 : contentContainer.clientWidth;
// 	const downloadButton = document.getElementById(params.downloadButton);
// 	downloadButton.innerHTML = 'Downloading <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>';
// 	downloadButton.classList.add("disabled");

// 	// Any elements that come on the page prior to the current selection for html2Canvas
// 	// that have the data-html2canvas-ignore attribute will throw off the correct y-page
// 	// position that we need to scroll to. This is only a problem on pages with multiple
// 	// image download buttons. Get the outer height of each element that has the
// 	// data-html2canvas-ignore attribute. If it comes prior to the current image
// 	// download, sum it's height and remove it from the scrollY value.
// 	const html2CanvaseIgnoreElements = document.querySelectorAll("*[data-html2canvas-ignore]");
// 	let ignoredElementsHeight = 0;
// 	const topOfContainer = contentContainer.getBoundingClientRect().top;
// 	html2CanvaseIgnoreElements.forEach((d) => {
// 		const bbox = d.getBoundingClientRect();
// 		if (bbox.top < topOfContainer) ignoredElementsHeight += bbox.height;
// 	});

// 	setTimeout(() => {
// 		html2canvas(contentContainer, {
// 			scrollY: -window.pageYOffset + ignoredElementsHeight,
// 			height,
// 			width,
// 			onclone: (clone) => {
// 				$(clone).find("#countyViewDownloadDate").css("visibility", "visible");
// 				addTitle(clone);
// 			},
// 		}).then((canvas) => {
// 			let imgName = `${params.imageSaveName}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downloadButton.innerHTML = "Download Image";
// 			downloadButton.classList.remove("disabled");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downloadVaccinationInUS = function (viz) {
// 	const mapVizName = {
// 		vaccinationsBarChart: "U.S.-COVID-19-Vaccine-Administration-by-Vaccine-Type-Chart",
// 		vaccinationsBarChart2: "U.S.-COVID-19-Vaccine-Delivered-by-Vaccine-Type-Chart",
// 		vaccinationsBarChart3: "Number-of-People-Fully-Vaccinated-in-the-U.S.-by-COVID-19-Vaccine-Series-Type-Chart",
// 		vaccinationsBarChart4: "Number-of-People-with-Booster-Dose-in-the-U.S.-by-COVID-19-Vaccine-Type-Chart",
// 		vaccinationsBarChart5:
// 			"Number-of-People-with-Booster-Dose-in-the-U.S.-by-COVID-19-Vaccine-Primary-Series-Chart",
// 	};
// 	let demographicsBtncontianer = document.getElementById(`${viz}`);
// 	if (
// 		demographicsBtncontianer.childNodes.length > 0 &&
// 		demographicsBtncontianer.childNodes[3] instanceof SVGSVGElement
// 	) {
// 		let imageTarget = demographicsBtncontianer.childNodes[3];
// 		let imgName = `${mapVizName[viz]}.png`;
// 		let cordinates = {
// 			left: -80,
// 			top: -80,
// 		};
// 		if (viz == "vaccinationsBarChart5") {
// 			cordinates = {
// 				left: -180,
// 				top: -60,
// 			};
// 		}
// 		saveSvgAsPng(imageTarget, imgName, {
// 			scale: 2.0,
// 			backgroundColor: "#FFF",
// 			left: cordinates.left,
// 			top: cordinates.top,
// 			fonts: [
// 				{
// 					url: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2",
// 					format: "woff2",
// 					text: `@font-face {
//                     font-family: 'Open Sans';
//                     font-style: normal;
//                     font-weight: 400;
//                     src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2) format('woff2');
//                     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;`,
// 				},
// 			],
// 		});
// 		let interaction = `Download Image > ${imgName}`;
// 		Analytics.triggerOmnitureInteractions(interaction);
// 	}
// };

// export const downloadVaccinationLTC = function (viz, name) {
// 	let demographicsBtncontianer = document.getElementById(`${viz}`);
// 	if (
// 		demographicsBtncontianer.childNodes.length > 0 &&
// 		demographicsBtncontianer.childNodes[3] instanceof SVGSVGElement
// 	) {
// 		let imageTarget = demographicsBtncontianer.childNodes[3];
// 		let imageTargetName = name;
// 		imageTargetName = imageTargetName.replace(/ /g, "-").replace(/\//g, "-").replace(/:/g, "");
// 		let imgName = `${imageTargetName}-Chart.png`;
// 		saveSvgAsPng(imageTarget, imgName, {
// 			scale: 2.0,
// 			backgroundColor: "#FFF",
// 			left: -80,
// 			top: -70,
// 			fonts: [
// 				{
// 					url: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2",
// 					format: "woff2",
// 					text: `@font-face {
//                     font-family: 'Open Sans';
//                     font-style: normal;
//                     font-weight: 400;
//                     src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2) format('woff2');
//                     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;`,
// 				},
// 			],
// 		});
// 		let interaction = `Download Image > ${imgName}`;
// 		Analytics.triggerOmnitureInteractions(interaction);
// 	}
// };

// export const downloadVaccineDemographics = function (viz) {
// 	let imageTargetName = document.getElementById(`card-title-${viz}`).textContent;
// 	imageTargetName = imageTargetName.replace(/ /g, "-").replace(/\//g, "-").replace(/:/g, "");
// 	let imgName = `${imageTargetName}-Chart.png`;
// 	let vaccineDemographicContainer = document.getElementById(`viz-${viz}`);
// 	let menuButtons = document.getElementById(`viz-${viz}`).getElementsByClassName("viz-cntrl-btns")[0];
// 	menuButtons.style.display = "none";
// 	const updateSVG = (clone) => {
// 		const svgHeight = clone.getElementById(`viz-${viz}-viz`).clientHeight;
// 		const svgWidth = clone.getElementById(`viz-${viz}-viz`).clientWidth;
// 		const chart = clone.getElementById(`viz-${viz}-viz`).firstChild;
// 		const heightShift = appState.currentDeviceType !== "desktop" ? -20 : 0;
// 		chart.setAttribute("height", svgHeight);
// 		chart.setAttribute("width", svgWidth);

// 		const legendHeight = clone.getElementById(`demographics-legend-${viz}`).clientHeight;
// 		const legendWidth = clone.getElementById(`demographics-legend-${viz}`).clientWidth;
// 		const legend = clone.getElementById(`demographics-legend-${viz}`);
// 		const legendHeightShift = appState.currentDeviceType !== "desktop" ? -20 : 0;
// 		legend.setAttribute("height", legendHeight);
// 		legend.setAttribute("width", legendWidth);

// 		let redText = clone.querySelectorAll(`[id=viz-legend-${viz}]`);
// 		for (let i = 0; i < redText.length; i++) {
// 			redText[i].style.fontSize = "10px";
// 		}

// 		let grayText = clone.querySelectorAll("[id='gray-text']");
// 		for (let i = 0; i < grayText.length; i++) {
// 			grayText[i].style.fontSize = "10px";
// 		}
// 	};
// 	setTimeout(() => {
// 		html2canvas(vaccineDemographicContainer, {
// 			scrollY: -window.pageYOffset + 30,
// 			scrollX: 0,
// 			scale: 1.5,
// 			onclone: (clone) => {
// 				updateSVG(clone);
// 			},
// 		}).then((canvas) => {
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			menuButtons.style.display = "block";
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downloadVaccinations = function (cont, btnID) {
// 	let vaccinationBtnContainer = document.getElementById(cont.id);
// 	let adjustSVG = function (clone) {
// 		let svgTarget = clone.getElementById("vaccinations-map-wrapper").children[0];
// 		let chartWidth = svgTarget.clientWidth;
// 		let chartHeight = svgTarget.clientHeight;
// 		svgTarget.setAttribute("height", chartHeight);
// 		svgTarget.setAttribute("width", chartWidth);

// 		svgTarget.setAttribute("viewBox", `-20, 0, ${chartWidth + 37},${chartHeight}`);
// 	};
// 	let downLoadButton = document.getElementById(btnID);
// 	let buttonSpinner = downLoadButton.children[0];
// 	buttonSpinner.classList.add("fa-circle-notch", "fa-spin");
// 	downLoadButton.classList.add("disabled");
// 	let imageTarget = document.getElementById(cont.id);
// 	setTimeout(() => {
// 		html2canvas(vaccinationBtnContainer, {
// 			scrollY: -window.pageYOffset,
// 			scrollX: 0,
// 			scale: 1,
// 			onclone: (clone) => adjustSVG(clone),
// 		}).then((canvas) => {
// 			let imgName = `${btnID}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downLoadButton.classList.remove("disabled");
// 			buttonSpinner.classList.remove("fa-spin", "fa-circle-notch");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

// export const downloadVaccinationsEquity = function (cont, btnID) {
// 	let vaccinationBtnContainer = document.getElementById(cont.id);
// 	let adjustSVG = function (clone) {
// 		let svgTarget = clone.getElementById("vaccinations-map-wrapper").children[0];
// 		let chartWidth = svgTarget.clientWidth;
// 		let chartHeight = svgTarget.clientHeight;
// 		svgTarget.setAttribute("height", chartHeight);
// 		svgTarget.setAttribute("width", chartWidth);
// 		if (btnID === "download-img-vaccination-other-outcomes-maps") {
// 			svgTarget.setAttribute("viewBox", `-120, 0, ${chartWidth + 37},${chartHeight}`);
// 		} else {
// 			svgTarget.setAttribute("viewBox", `-20, 0, ${chartWidth + 179},${chartHeight}`);
// 		}
// 	};
// 	let downLoadButton = document.getElementById(btnID);
// 	let buttonSpinner = downLoadButton.children[0];
// 	buttonSpinner.classList.add("fa-circle-notch", "fa-spin");
// 	downLoadButton.classList.add("disabled");
// 	let imageTarget = document.getElementById(cont.id);
// 	setTimeout(() => {
// 		html2canvas(vaccinationBtnContainer, {
// 			scrollY: -window.pageYOffset,
// 			scrollX: 0,
// 			scale: 1,
// 			onclone: (clone) => adjustSVG(clone),
// 		}).then((canvas) => {
// 			let imgName = `${btnID}.png`;
// 			saveCanvasAs(canvas.toDataURL(), imgName);
// 			downLoadButton.classList.remove("disabled");
// 			buttonSpinner.classList.remove("fa-spin", "fa-circle-notch");
// 			let interaction = `Download Image > ${imgName}`;
// 			Analytics.triggerOmnitureInteractions(interaction);
// 		});
// 	}, 100);
// };

export { saveSvgAsPng };
