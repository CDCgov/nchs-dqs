import { Analytics } from "../eventhandlers/analytics";
/*  
    takes a object 
    csvData is an object with the following parameters:
    title as string, headers as array, dataKeys as array, data as oject or array of objects
    typical input: 
    this.csv = {
        data: tableData,
        dataKeys: keys,
        title: tableTitle,
        headers: cols
    }
*/

export const downloadCSV = (csvObj) => {
	const separateFileName = (fileName) => {
		// file title, remove spaces, commas, forward slashs and hyphens, replace with underscore
		let tempFileName = fileName.toLowerCase();
		tempFileName = tempFileName.replace("-", "");
		tempFileName = tempFileName.replace(/,/g, "");
		tempFileName = tempFileName.replace("/", " ");
		let fileNameParts = tempFileName.split(" ");
		return fileNameParts.join("_");
	};

	const exportFileName = `${separateFileName(csvObj.title)}.csv` || "export.csv";

	const handleNullsAndCommas = (datapoint) => {
		if (typeof datapoint === "string") {
			return datapoint.replace(/,/g, "");
		}
		if (datapoint !== 0 && !datapoint) {
			return "N/A";
		}
		return datapoint;
	};

	let csvContents = "";
	const buildCSV = ({ data, headers, dataKeys, disclaimer, extraLine }) => {
		if (extraLine !== undefined && extraLine.length > 0) {
			csvContents += `${extraLine.replace(/,/g, "")}\r\n\r\n`;
		}
		if (disclaimer && disclaimer.length > 0) {
			csvContents += "Disclaimer:\r\n";
			csvContents += `${disclaimer.replace(/,/g, "")}\r\n\r\n`;
		}
		csvContents = headers.reduce((accum, header, index, arr) => {
			if (index < arr.length - 1) {
				return `${accum + handleNullsAndCommas(header)},`;
			}
			return `${accum + handleNullsAndCommas(header)}\r\n`;
		}, csvContents);
		csvContents = data.reduce((accum, datum) => {
			return (
				accum +
				dataKeys.reduce((accum, key) => {
					let newKey = key;
					let newDataKeys = dataKeys.map((x) => x);
					if (newDataKeys.indexOf(newKey) < newDataKeys.length - 1) {
						return `${accum + handleNullsAndCommas(datum[newKey])},`;
					}
					return `${accum + handleNullsAndCommas(datum[newKey])}\r\n`;
				}, "")
			);
		}, csvContents);
		return csvContents;
	};

	const csv = buildCSV(csvObj);
	const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
		type: "text/csv;charset=utf-8",
	});
	if (navigator.msSaveBlob) {
		// IE 10+
		navigator.msSaveBlob(blob, exportFileName);
	} else {
		let link = document.createElement("a");
		if (link.download !== undefined) {
			// feature detection
			// Browsers that support HTML5 download attribute
			let url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", exportFileName);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blob);
		}
	}
	let interaction = `export > ${exportFileName}`;
	Analytics.triggerOmnitureInteractions(interaction);
};
