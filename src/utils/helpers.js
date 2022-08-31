import "core-js/es6/promise";

export const Helpers = {
	groupBy(objectArray, property) {
		return objectArray.reduce(function (acc, obj) {
			let key = obj[property];
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(obj);
			return acc;
		}, {});
	},
	mapBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	},
	svgTextWrap(text, width, position) {
		text.each(function () {
			let text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1,
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				tspan = text
					.text(null)
					.append("tspan")
					.attr("class", "wrapped")
					.attr("x", position ? 75 : width / 2)
					.attr("y", y)
					.attr("dy", `${dy}em`);
			while ((word = words.pop())) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text
						.append("tspan")
						.attr("x", position ? 75 : width / 2)
						.attr("y", y)
						.attr("dy", `${++lineNumber * lineHeight + dy}em`)
						.text(word);
				}
			}
		});
	},
	maxByValueArrayOfObjects(array, objectKey) {
		//it returns the max value (number)
		// of an array of objects in the specified key
		return Math.max.apply(
			Math,
			array.map(function (x) {
				return x[objectKey];
			})
		);
	},
	turnArrayToObject(array, key) {
		array.reduce((obj, item) => {
			obj[item[key]] = item;
			return obj;
		}, {});
	},
};

export const stateAbbrToFull = (abbr) => {
	const states = {
		AL: "Alabama",
		AK: "Alaska",
		AS: "American Samoa",
		AZ: "Arizona",
		AR: "Arkansas",
		CA: "California",
		CO: "Colorado",
		CT: "Connecticut",
		DE: "Delaware",
		DC: "District of Columbia",
		FM: "Federated States Of Micronesia",
		FL: "Florida",
		GA: "Georgia",
		GU: "Guam",
		HI: "Hawaii",
		ID: "Idaho",
		IL: "Illinois",
		IN: "Indiana",
		IA: "Iowa",
		KS: "Kansas",
		KY: "Kentucky",
		LA: "Louisiana",
		ME: "Maine",
		MH: "Marshall Islands",
		MD: "Maryland",
		MA: "Massachusetts",
		MI: "Michigan",
		MN: "Minnesota",
		MS: "Mississippi",
		MO: "Missouri",
		MT: "Montana",
		NE: "Nebraska",
		NV: "Nevada",
		NH: "New Hampshire",
		NJ: "New Jersey",
		NM: "New Mexico",
		NY: "New York",
		NC: "North Carolina",
		ND: "North Dakota",
		MP: "Northern Mariana Islands",
		OH: "Ohio",
		OK: "Oklahoma",
		OR: "Oregon",
		PW: "Palau",
		PA: "Pennsylvania",
		PR: "Puerto Rico",
		RI: "Rhode Island",
		SC: "South Carolina",
		SD: "South Dakota",
		TN: "Tennessee",
		TX: "Texas",
		UT: "Utah",
		VT: "Vermont",
		VI: "Virgin Islands",
		VA: "Virginia",
		WA: "Washington",
		WV: "West Virginia",
		WI: "Wisconsin",
		WY: "Wyoming",
		US: "United States",
	};
	return states[abbr];
};
export const stateToAbbr = (state) => {
	const states = {
		Alabama: "AL",
		Alaska: "AK",
		"American Samoa": "AS",
		Arizona: "AZ",
		Arkansas: "AR",
		California: "CA",
		Colorado: "CO",
		Connecticut: "CT",
		Delaware: "DE",
		"District of Columbia": "DC",
		"Federated States Of Micronesia": "FM",
		Florida: "FL",
		Georgia: "GA",
		Guam: "GU",
		Hawaii: "HI",
		Idaho: "ID",
		Illinois: "IL",
		Indiana: "IN",
		Iowa: "IA",
		Kansas: "KS",
		Kentucky: "KY",
		Louisiana: "LA",
		Maine: "ME",
		"Marshall Islands": "MH",
		Maryland: "MD",
		Massachusetts: "MA",
		Michigan: "MI",
		Minnesota: "MN",
		Mississippi: "MS",
		Missouri: "MO",
		Montana: "MT",
		Nebraska: "NE",
		Nevada: "NV",
		"New Hampshire": "NH",
		"New Jersey": "NJ",
		"New Mexico": "NM",
		"New York": "NY",
		"North Carolina": "NC",
		"North Dakota": "ND",
		"Northern Mariana Islands": "MP",
		Ohio: "OH",
		Oklahoma: "OK",
		Oregon: "OR",
		Palau: "PW",
		Pennsylvania: "PA",
		"Puerto Rico": "PR",
		"Rhode Island": "RI",
		"South Carolina": "SC",
		"South Dakota": "SD",
		Tennessee: "TN",
		Texas: "TX",
		Utah: "UT",
		Vermont: "VT",
		"Virgin Islands": "VI",
		Virginia: "VA",
		Washington: "WA",
		"West Virginia": "WV",
		Wisconsin: "WI",
		Wyoming: "WY",
		"United States": "US",
	};
	return states[state];
};

export const crossLinks = (tabname) => {};

const mapOrder = (a, order, key) => {
	const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
	return a.sort((a, b) => map[a[key]] - map[b[key]]);
};

export const objectOrder = (array, order, key) => {
	return key === "Category"
		? mapOrder(array, order, key)
		: array.sort((a, b) => {
				if (order.indexOf(a[key]) > order.indexOf(b[key])) {
					return 1;
				}
				return -1;
		  });
};
