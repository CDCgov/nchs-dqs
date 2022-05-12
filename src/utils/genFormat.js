import { format, timeFormat } from "../lib/d3.min";

// Find the conversion you want or create new ones. If you add one/some please document it.
// If you find one that is inaccurate based on your input value consider correcting it for better accuracy.

// 123456.78 to 123,457 or 123456 to "123,456"
const longInt = (d) => format(",")(Math.round(d));

// 12.345 to "12.3"
const decimal1 = (d) => (d === 0 ? 0 : format(".1f")(d));

// 12.345 to "12.35"
const decimal2 = (d) => (d === 0 ? 0 : format(".2f")(d));

// 12.34567 to "12.346"
const decimal3 = (d) => (d === 0 ? 0 : format(".3f")(d));

// 12.34567 to "12.3457"
const decimal4 = (d) => (d === 0 ? 0 : format(".4f")(d));

// 10.0 to 10
const decimal0 = (d) => (d === 0 ? 0 : format(".0f")(d));

// 1,000 into 1 (this is in case theres a need to show thousands without the K at the end)
const kilo = (d) => {
	return Math.abs(Number(d)) >= 1.0e3 ? `${(Math.abs(Number(d)) / 1.0e3).toFixed(0)}` : Math.abs(Number(d));
};
// "12-5-22" or Date type equivalent to "Dec 5, '22"
const shortDate = (d) => d3.timeFormat("%b %e, '%y")(typeof d === "string" ? new Date(d).setHours(0, 0, 0, 0) : d);

// "12-5-22" or Date type equivalent to "Dec 5, 2022"
const tableDate = (d) => d3.timeFormat("%b %e, %Y")(typeof d === "string" ? new Date(d).setHours(0, 0, 0, 0) : d);

// "12-5-22" or Date type equivalent to "December 5, 2022"
const longDate = (d) => timeFormat("%B %e, %Y")(typeof d === "string" ? new Date(d).setHours(0, 0, 0, 0) : d);

const mobileDate = (d) => timeFormat("%m/%d/%y")(typeof d === "string" ? new Date(d).setHours(0, 0, 0, 0) : d);

// JS Date to yyyy-MM-dd
const yyyyMMddDate = (d) => {
	return d.toISOString().split("T")[0];
};

// date with only month and year AUG 2021
const dayYearDate = (d) => {
	let dateFormat = timeFormat("%b %Y");

	return dateFormat(d);
};
// 12.345 or "12.345" to "12.3%"
const percent1 = (d) => format(".1%")(Number(d) / 100);

// 12.345 or "12.345" to "12.35%"
const percent2 = (d) => format(".2%")(Number(d) / 100);

// .12345 to "12.3%"
const perc0fromDec = format(".0%");

// .12345 to "12%"
const perc1fromDec = format(".1%");

// .12345 to "12.35%"
const perc2fromDec = format(".2%");

// 1500 to "1.5k"   1234567 to "1.234567M" DOES NOT APPLY 'm' FOR MILLI.
const magnitude = (d) => (d >= 1 ? format("~s")(d) : d);

// 1500 to "1k"  1234567 to "1M" DOES NOT APPLY 'm' FOR MILLI.
const magnitudeOneSF = (d) => (d >= 1 ? format(".1s")(d) : d);

// 1500 to "1.5k"   1234567 to "1.2M"  DOES NOT APPLY 'm' FOR MILLI.
const magnitudeTwoSF = (d) => (d >= 1 ? format(".2s")(d) : d);

// 1511 to "1.51k"  1234567 to "1.23M" DOES NOT APPLY 'm' FOR MILLI.
const magnitudeThreeSF = (d) => (d >= 1 ? format(".3s")(d) : d);

export const genFormat = (datum, datumType) => {
	switch (datumType) {
		case "numberNoDecimal":
			return decimal0(datum);
		case "number":
			if (Math.abs(datum) > 100) return longInt(datum);
			if (Math.abs(datum) > 10) return Number.isInteger(datum) ? datum : decimal1(datum);
			if (Math.abs(datum) > 1) return Number.isInteger(datum) ? datum : decimal2(datum);
			if (Math.abs(datum) > 0.1) return Number.isInteger(datum) ? datum : decimal3(datum);
			if (datum === null) return "N/A";
			return decimal4(datum);
		case "numberInParens":
			if (Math.abs(datum) > 100) return `(${longInt(datum)})`;
			if (Math.abs(datum) > 10) return Number.isInteger(datum) ? `(${datum})` : `(${decimal1(datum)})`;
			if (Math.abs(datum) > 1) return Number.isInteger(datum) ? `(${datum})` : `(${decimal2(datum)})`;
			if (Math.abs(datum) > 0.1) return Number.isInteger(datum) ? `(${datum})` : `(${decimal3(datum)})`;
			if (datum === null) return "N/A";
			return `(${decimal4(datum)})`;
		case "decimal1":
			return decimal1(datum);
		case "decimal2":
			return decimal2(datum);
		case "longInt":
			return longInt(datum);
		case "kilo":
			return kilo(datum);
		case "healthDeathNumber":
			return datum === null ? "<5" : longInt(datum); // custom for health-care-personnel tab
		case "misCNumber":
			return datum === 0.0000000001 ? "suppressed" : decimal1(datum);
		case "string":
			return datum;
		case "percent1":
			return percent1(datum);
		case "percentOrNA":
			if (datum === null) return "N/A";
			return percent2(datum);
		case "percent2":
			return percent2(datum);
		case "longDate":
			return longDate(datum);
		case "shortDate":
			return shortDate(datum);
		case "tableDate":
			return tableDate(datum);
		case "mobileDate":
			return mobileDate(datum);
		case "yyyyMMddDate":
			return yyyyMMddDate(datum);
		case "perc0fromDec":
			return perc0fromDec(datum);
		case "perc1fromDec":
			return perc1fromDec(datum);
		case "perc2fromDec":
			return perc2fromDec(datum);
		case "dayYearDate":
			return dayYearDate(datum);
		case "magnitude":
			return magnitude(datum);
		case "magnitudeOneSF":
			return magnitudeOneSF(datum);
		case "magnitudeTwoSF":
			return magnitudeTwoSF(datum);
		case "magnitudeThreeSF":
			return magnitudeThreeSF(datum);
		case "none":
			return datum;

		case "empty":
		case "":
		case undefined:
			return "";
		default:
			return "error";
	}
};
