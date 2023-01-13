import { hashLookup } from "../components/landingPage/config";

const classificationOptions = "classificationOptions";
const groupOptions = "groupOptions";
const showOnePeriodCheckboxId = "show-one-period-checkbox";

export const writeHashToUrl = (topicId, classificationId, groupId) => {
	const singlePeriod = $(`#${showOnePeriodCheckboxId}`)[0].checked ? "single-time-period" : "all-time-periods";
	const currentHash = window.location.hash;
	const hashPrefix = currentHash ? currentHash.split("_")[0] : "";

	try {
		const topicHash = hashLookup.find((l) => l.value == topicId).hash;

		const classificationHash = hashLookup
			.find((l) => l.value === topicId)
			[classificationOptions].find((s) => s.value == classificationId).hash;

		const groupHash = hashLookup
			.find((l) => l.value === topicId)
			[groupOptions].find((c) => c.value == groupId).hash;

		window.location.hash = `${hashPrefix.replace(
			"#",
			""
		)}_${topicHash}/${classificationHash}/${groupHash}/${singlePeriod}`;
	} catch {
		/* do nothing */
	}
};

export const getSelections = () => {
	const { hash } = window.location;
	if (hash) {
		let selections = hash.split("_");
		if (selections.length <= 1) return null;

		selections = selections[1].split("/");
		const topic = hashLookup.find((l) => l.hash === selections[0]).value;
		const classification = hashLookup
			.find((l) => l.hash === selections[0])
			[classificationOptions].find((s) => s.hash === selections[1]).value;
		const group = hashLookup
			.find((l) => l.hash === selections[0])
			[groupOptions].find((c) => c.hash === selections[2]).value;
		const viewSinglePeriod = selections[3] === "single-time-period";
		$(`#${showOnePeriodCheckboxId}`).prop("checked", viewSinglePeriod);

		return {
			topic,
			classification,
			group,
			viewSinglePeriod,
		};
	}
	return null;
};
