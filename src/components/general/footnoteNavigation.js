// This function dynamically inserts an anchor and header into the html after it is rendered. The anchor inserted
// acts as a link which scrolls the page to the position of the header element
//
//  The function used to dynamically create and PLACE html elements, along with the implementation in this function,
// is confusing in its naming convention and functionality. It is used because easier, more modern functions are
// still too recent for many browsers CDT website users may be using. It may be enlightening to visit MDN and read
// up on it: https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
//
//    INPUT OBJECT PROPERTIES (the first parameter for footNoteDownloadNav function)
// type: "footnote" - the footnotes section does not have data
// type: "data" - the footnotes section also has data accordion and (optionally) footnotes
//    - prop required, no default value
//
// anchorElement - a native javaScript derived element used to specify where we want to insert the anchor link that
//                 scrolls the user down to the footnotes/data section, below the link
//    - default value: document.querySelector("#titleSection")
//
// headerElement - a native javaScript derived element used to specify where we want to place the header text telling
//                 the user that the info below is either 'Footnotes' or 'Data' (which is specified by the "type" prop)
//    - default value: document.querySelector(".data-table-container")
//
// extraClass - a string of space delimited classes desired to append to the anchor element
//    - prop not required, no default value
//
// aboutTheseDataUrl - a url used to attach to an (optional) 'About These Data' link. If this is null then
//                   - the 'About These Data' link will not be dynamically added
//    - prop not required, no default value
//
// vizId - a string (such as "030") that gets the JSON creation dates from Utils.getPanelNotes(vizId). The fetch process
//         happens on the homepage so we get it, after initial load, from appState.panel_notes.
//
//
//    The second parameter is named "below" in the footNoteDownloadNav function's param list)
// This parameter tells the function whether to put the dynamically inserted anchor above the current element
// that comes into the function with the property name "anchorElement" or above the nextSibling of the current
// "anchorElement". "Above the next sibling" of the incoming "anchorElement" property is the same thing as saying
// "below the incoming 'anchorElement' element". So, if the intent is to put the dynamic anchor below "anchorElement", 'below' can be left out
// of the object as it's default value is 'false'. If the intent is to put the dynamic anchor above, specify the
// incoming object with the property { below: false }.

import { DataCache } from "../../utils/datacache";

export const footNoteDownloadNav = (
	{ type, anchorElement, headerElement, extraClass, aboutTheseDataUrl, vizId },
	below = true
) => {
	const anchorText = type === "footnote" ? "Additional Information" : "Download Data";
	let headerText =
		type === "data" || type === "historic-only" ? "Data Downloads" : "Footnotes and Additional Information";
	if (type === "data") headerText += " and Footnotes";
	const expandText =
		type === "footnote" || type === "footnote-and-historic-buttons" ? "footnotes" : "data table and download data";
	const extraClassConst = extraClass || "";
	const anchorEl = anchorElement ?? document.querySelector("#titleSection");

	if (aboutTheseDataUrl) {
		[...anchorEl].forEach((a) => {
			const aboutTheseDataDiv = document.createElement("div");
			const aboutAnchor = document.createElement("a");
			aboutAnchor.setAttribute("class", `reverseAnchorUnderline`);
			aboutAnchor.setAttribute("tabindex", "0");
			aboutAnchor.innerHTML = `About These Data`;
			aboutAnchor.href = aboutTheseDataUrl;
			aboutAnchor.rel = "noreferrer noopener";
			aboutAnchor.target = "_blank";
			aboutTheseDataDiv.append(aboutAnchor);
			aboutTheseDataDiv.append(` | `);
			const anchor = document.createElement("a");
			anchor.setAttribute("class", `viewFootnotes reverseAnchorUnderline ${extraClassConst}`);
			anchor.setAttribute("tabindex", "0");
			anchor.innerHTML = type === "historic-only" ? anchorText : `View Footnotes and ${anchorText}`;

			const dataDatesDiv = document.createElement("div");
			dataDatesDiv.setAttribute("class", "jsonDataPullDates");
			dataDatesDiv.innerHTML = vizId ? DataCache.JSONReleaseWithPullSet6am : "";

			aboutTheseDataDiv.append(anchor);
			const containerDiv = document.createElement("div");
			containerDiv.id = "dynamic-anchors-and-json-dates";
			containerDiv.setAttribute("tabindex", "0");
			
			if (appState.currentDeviceType === "desktop")
				containerDiv.setAttribute("style", "display: flex; justify-content: space-between");
			containerDiv.append(aboutTheseDataDiv);
			containerDiv.append(dataDatesDiv);
			a.parentNode.insertBefore(containerDiv, below ? a.nextSibling : a);
		});
	} else {
		const anchor = document.createElement("a");
		anchor.setAttribute("class", `viewFootnotes ${extraClassConst}`);
		anchor.setAttribute("tabindex", "0");
		anchor.innerHTML = type === "historic-only" ? anchorText : `View Footnotes and ${anchorText}`;
		const anchorEl = anchorElement ?? document.querySelector("#titleSection");
		anchorEl.parentNode.insertBefore(anchor, below ? anchorEl.nextSibling : anchorEl);
	}

	const parentDiv = document.getElementById("outRightMainContainer");
	const childDiv = document.querySelector(".viewFootnotesBtn");
	if (parentDiv.contains(childDiv)) {
		childDiv.remove();
	}

	const footnoteHeader = document.createElement("div");
	footnoteHeader.setAttribute("class", "viewFootnotesBtn");
	footnoteHeader.setAttribute("data-html2canvas-ignore", "");
	footnoteHeader.setAttribute("tabindex", "0");
	if (type !== "historic-only") {
		footnoteHeader.innerHTML = `
        	<p id="footnoteContentTitle" title="Click back to Top">${headerText}</p>
			<p style="text-align:left">Expand each accordion to view ${expandText}</p>
		`;
	} else footnoteHeader.innerHTML = `<p id="footnoteContentTitle" title="Click back to Top">${headerText}</p>`;
	function updateQuerySelector() {  
		//if page name is not there just use default value could refactor add more params((pagename,refNode)) after tesing but seems like county view is an exception.
	  return  appState.NAV_ITEM === "county-view"|| appState.PAGE_NAME === "County View" 
		  ? document.querySelector(".historic-data-container")
		  : document.querySelector(".data-table-container");
	  }
	  
	const headerEl = headerElement ?? updateQuerySelector();
	headerEl.parentNode.insertBefore(footnoteHeader, headerEl);

	$(".viewFootnotes").click(() => footnoteHeader.scrollIntoView());
	$(".viewFootnotes").keyup((evt) => {
		if (evt.type === "keyup" && evt.key === "Enter") {
			footnoteHeader.scrollIntoView();
			evt.stopPropagation();
		}
	});

	$(".viewFootnotesBtn").click((evt) => {
		document.documentElement.scrollIntoView();
		evt.stopPropagation();
	});
	$(".viewFootnotesBtn").keyup((evt) => {
		if (evt.type == "keyup" && evt.key === "Enter") {
			document.documentElement.scrollIntoView();
			evt.stopPropagation();
		}
	});
};
