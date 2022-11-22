import { hashLookup } from "../components/landingPage/config";

const topicId = "topic";
const subTopicId = "subtopic";
const subtopicOptions = "subtopicOptions";
const characteristicId = "characteristic";
const characteristicOptions = "characteristicOptions";
const showOnePeriodCheckboxId = "show-one-period-checkbox";

export const writeHashToUrl = () => {
	const topic = $(`#${topicId} :selected`)[0].value;
	const subTopic = $(`#${subTopicId} :selected`)[0].value;
	const characteristic = $(`#${characteristicId} :selected`)[0].value;
	const singlePeriod = $(`#${showOnePeriodCheckboxId}`)[0].checked ? "single-time-period" : "all-time-periods";
	const currentHash = window.location.hash;
	const hashPrefix = currentHash ? currentHash.split("_")[0] : "";

	try {
		const topicHash = hashLookup.find((l) => l.value === topic).hash;

		const subtopicHash = hashLookup
			.find((l) => l.value === topic)
			[subtopicOptions].find((s) => s.value === subTopic).hash;

		const characteristicHash = hashLookup
			.find((l) => l.value === topic)
			[characteristicOptions].find((c) => c.value === characteristic).hash;

		window.location.hash = `${hashPrefix.replace(
			"#",
			""
		)}_${topicHash}/${subtopicHash}/${characteristicHash}/${singlePeriod}`;
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
		const subTopic = hashLookup
			.find((l) => l.hash === selections[0])
			[subtopicOptions].find((s) => s.hash === selections[1]).value;
		const characteristic = hashLookup
			.find((l) => l.hash === selections[0])
			[characteristicOptions].find((c) => c.hash === selections[2]).value;
		const viewSinglePeriod = selections[3] === "single-time-period";

		$(`#${topicId}`).val(topic);
		$(`#${characteristicId}`).val(characteristic);
		$(`#${showOnePeriodCheckboxId}`).prop("checked", viewSinglePeriod);

		return {
			topic,
			subTopic,
			characteristic,
			viewSinglePeriod,
		};
	}
	return null;
};
