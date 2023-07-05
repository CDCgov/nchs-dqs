export const writeHashToUrl = (topicId, classificationId, groupId, tab) => {
	const singlePeriod = $("#show-one-period-checkbox")[0].checked ? "single-time-period" : "all-time-periods";
	const currentHash = window.location.hash;
	const hashPrefix = currentHash ? currentHash.split("_")[0] : "";

	try {
		const lookup = hashLookup[topicId];
		const classificationHash = lookup.classificationOptions.find((s) => s.value == classificationId).hash;
		const groupHash = lookup.groupOptions.find((c) => c.value == groupId).hash;

		window.location.hash = `${hashPrefix.replace(
			"#",
			""
		)}_${topicId}/${classificationHash}/${groupHash}/${singlePeriod}/${tab}`;
	} catch {
		/* do nothing */
	}
};

export const hashLookup = {};

export const getSelections = () => {
	const { hash } = window.location;
	if (hash) {
		let selections = hash.split("_");
		const filtersIndex = selections.findIndex((s) => s.includes("filters"));
		if (filtersIndex !== -1) {
			const filtersSection = selections[filtersIndex];
			return filtersSection;
		}
		if (selections.length <= 1) return null;

		selections = selections[1].split("/");
		const topic = selections[0];

		if (!hashLookup[topic]) return { topic, classification: selections[1] };

		const classification = hashLookup[topic].classificationOptions.find((s) => s.hash === selections[1]).value;
		const group = hashLookup[topic].groupOptions.find((c) => c.hash === selections[2])?.value;
		const viewSinglePeriod = selections[3] === "single-time-period";
		$("#show-one-period-checkbox").prop("checked", viewSinglePeriod);

		return {
			topic,
			classification,
			group,
			viewSinglePeriod,
			tab: selections[4],
		};
	}
	return null;
};

export const slugify = (str) => {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const addToHashLookup = (data, topicId, initialPageLoad = false) => {
	const classifications = [...new Set(data.map((d) => d.panel))];
	const classificationsArray = [];

	classifications.forEach((classification) => {
		const datum = data.find((d) => d.panel === classification);
		classificationsArray.push({
			hash: slugify(classification),
			value: datum.panel_num,
		});
	});

	const groupsArray = [];
	const groups = [...new Set(data.map((d) => d.stub_name))];
	groups.forEach((group) => {
		const datum = data.find((d) => d.stub_name === group);
		groupsArray.push({
			hash: slugify(group),
			value: datum.stub_name_num,
		});
	});

	hashLookup[topicId] = {
		classificationOptions: classificationsArray,
		groupOptions: groupsArray,
	};

	return initialPageLoad ? getSelections() : null;
};
