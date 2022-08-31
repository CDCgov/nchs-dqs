import "core-js/es/promise";

export const Utils = {
	getJsonFile(fname) {
		return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.overrideMimeType("application/json");
			xhr.open("GET", fname, true);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText,
					});
				}
			};
			xhr.onerror = function () {
				reject({
					status: this.status,
					statusText: xhr.statusText,
				});
			};

			xhr.send(null);
		});
	},
	searchJSONArray(dataArray, searchObj) {
		if (!dataArray) {
			return [
				{
					page_note: "Data not found. Please reload your browser or try again later.",
				},
			];
		}
		let rtnArray = [];
		for (let j = 0; j < dataArray.length; j++) {
			let bv = lookForValue(dataArray[j], searchObj);
			if (bv == true) rtnArray.push(dataArray[j]);
		}

		return rtnArray;

		function lookForValue(dataObj, sobj) {
			let isitthere = [];

			for (let m in sobj) {
				if (dataObj[m] == sobj[m]) {
					// Theres a match so push a 1/true
					isitthere.push(1);
				} else {
					isitthere.push(0);
				}
			}
			// Check for any 0s false
			if (isitthere.indexOf(0) != -1) return false;
			return true;
		}
	},
	isDevice_iOS() {
		return (
			["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes("Mac") && "ontouchend" in document)
		);
	},

	// this function takes a color (hex with optional hash out front, html color name, or rgb) value
	// and returns a hex color increased or decreased by percentage of luminosity
	// Valid range for percentAdjust is -1 to 1.
	adjustColorLuminance(inputColor, percentAdjust) {
		// converts css color name to hex or returns input hex-value string
		const colorNameToHex = (color) => {
			const colors = {
				aliceblue: "f0f8ff",
				antiquewhite: "faebd7",
				aqua: "00ffff",
				aquamarine: "7fffd4",
				azure: "f0ffff",
				beige: "f5f5dc",
				bisque: "ffe4c4",
				black: "000000",
				blanchedalmond: "ffebcd",
				blue: "0000ff",
				blueviolet: "8a2be2",
				brown: "a52a2a",
				burlywood: "deb887",
				cadetblue: "5f9ea0",
				chartreuse: "7fff00",
				chocolate: "d2691e",
				coral: "ff7f50",
				cornflowerblue: "6495ed",
				cornsilk: "fff8dc",
				crimson: "dc143c",
				cyan: "00ffff",
				darkblue: "00008b",
				darkcyan: "008b8b",
				darkgoldenrod: "b8860b",
				darkgray: "a9a9a9",
				darkgreen: "006400",
				darkkhaki: "bdb76b",
				darkmagenta: "8b008b",
				darkolivegreen: "556b2f",
				darkorange: "ff8c00",
				darkorchid: "9932cc",
				darkred: "8b0000",
				darksalmon: "e9967a",
				darkseagreen: "8fbc8f",
				darkslateblue: "483d8b",
				darkslategray: "2f4f4f",
				darkturquoise: "00ced1",
				darkviolet: "9400d3",
				deeppink: "ff1493",
				deepskyblue: "00bfff",
				dimgray: "696969",
				dodgerblue: "1e90ff",
				firebrick: "b22222",
				floralwhite: "fffaf0",
				forestgreen: "228b22",
				fuchsia: "ff00ff",
				gainsboro: "dcdcdc",
				ghostwhite: "f8f8ff",
				gold: "ffd700",
				goldenrod: "daa520",
				gray: "808080",
				green: "008000",
				greenyellow: "adff2f",
				honeydew: "f0fff0",
				hotpink: "ff69b4",
				"indianred ": "cd5c5c",
				indigo: "4b0082",
				ivory: "fffff0",
				khaki: "f0e68c",
				lavender: "e6e6fa",
				lavenderblush: "fff0f5",
				lawngreen: "7cfc00",
				lemonchiffon: "fffacd",
				lightblue: "add8e6",
				lightcoral: "f08080",
				lightcyan: "e0ffff",
				lightgoldenrodyellow: "fafad2",
				lightgrey: "d3d3d3",
				lightgreen: "90ee90",
				lightpink: "ffb6c1",
				lightsalmon: "ffa07a",
				lightseagreen: "20b2aa",
				lightskyblue: "87cefa",
				lightslategray: "778899",
				lightsteelblue: "b0c4de",
				lightyellow: "ffffe0",
				lime: "00ff00",
				limegreen: "32cd32",
				linen: "faf0e6",
				magenta: "ff00ff",
				maroon: "800000",
				mediumaquamarine: "66cdaa",
				mediumblue: "0000cd",
				mediumorchid: "ba55d3",
				mediumpurple: "9370d8",
				mediumseagreen: "3cb371",
				mediumslateblue: "7b68ee",
				mediumspringgreen: "00fa9a",
				mediumturquoise: "48d1cc",
				mediumvioletred: "c71585",
				midnightblue: "191970",
				mintcream: "f5fffa",
				mistyrose: "ffe4e1",
				moccasin: "ffe4b5",
				navajowhite: "ffdead",
				navy: "000080",
				oldlace: "fdf5e6",
				olive: "808000",
				olivedrab: "6b8e23",
				orange: "ffa500",
				orangered: "ff4500",
				orchid: "da70d6",
				palegoldenrod: "eee8aa",
				palegreen: "98fb98",
				paleturquoise: "afeeee",
				palevioletred: "d87093",
				papayawhip: "ffefd5",
				peachpuff: "ffdab9",
				peru: "cd853f",
				pink: "ffc0cb",
				plum: "dda0dd",
				powderblue: "b0e0e6",
				purple: "800080",
				rebeccapurple: "663399",
				red: "ff0000",
				rosybrown: "bc8f8f",
				royalblue: "4169e1",
				saddlebrown: "8b4513",
				salmon: "fa8072",
				sandybrown: "f4a460",
				seagreen: "2e8b57",
				seashell: "fff5ee",
				sienna: "a0522d",
				silver: "c0c0c0",
				skyblue: "87ceeb",
				slateblue: "6a5acd",
				slategray: "708090",
				snow: "fffafa",
				springgreen: "00ff7f",
				steelblue: "4682b4",
				tan: "d2b48c",
				teal: "008080",
				thistle: "d8bfd8",
				tomato: "ff6347",
				turquoise: "40e0d0",
				violet: "ee82ee",
				wheat: "f5deb3",
				white: "ffffff",
				whitesmoke: "f5f5f5",
				yellow: "ffff00",
				yellowgreen: "9acd32",
			};
			return colors[color.toLowerCase()] ?? color;
		};

		// validate hex string
		let hexColor = colorNameToHex(inputColor);

		// convert any rgb to hex
		let convertedHexColor = String(hexColor).replace(/[^0-9a-f]/gi, "");
		if (convertedHexColor.length < 6) {
			convertedHexColor =
				convertedHexColor[0] +
				convertedHexColor[0] +
				convertedHexColor[1] +
				convertedHexColor[1] +
				convertedHexColor[2] +
				convertedHexColor[2];
		}

		const luminosity = percentAdjust || 0;

		// convert to decimal, change luminosity, and then back to hex
		let luminosityAdjustedHexColor = "#",
			c,
			i;
		for (i = 0; i < 3; i++) {
			c = parseInt(convertedHexColor.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + c * luminosity), 255)).toString(16);
			luminosityAdjustedHexColor += ("00" + c).substr(c.length);
		}

		return luminosityAdjustedHexColor;
	},

	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	},

	getPowerOf10ArrayWithinBounds(min, max) {
		const tensArray = [];
		for (let i = -10; i <= 10; i++) tensArray.push(10 ** i);
		const outputArray = [];
		const startIndex = tensArray.findIndex((t) => t > min);
		const reversedTens = [...tensArray].reverse();
		let endIndex = -reversedTens.findIndex((t) => t < max);
		endIndex += 20;
		for (let i = startIndex; i <= endIndex; i++) outputArray.push(tensArray[i]);
		return outputArray;
	},
};
