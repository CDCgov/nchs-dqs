import { hashLookup } from "../config";

const topicId = "data-topic-select";
const subTopicId = "panel-num-select";
const characteristicId = "stub-name-num-select";
const showOnePeriodCheckboxId = "show-one-period-checkbox";

export const writeHashToUrl = () => {
	const topic = $(`#${topicId} :selected`)[0].value;
	const subTopic = $(`#${subTopicId} :selected`)[0].value;
	const characteristic = $(`#${characteristicId} :selected`)[0].value;
	const singlePeriod = $(`#${showOnePeriodCheckboxId}`)[0].checked ? "1" : "0";
	const view = $("a.nav-link.active").text().toLocaleLowerCase();
	const currentHash = window.location.hash;
	const hashPrefix = currentHash ? currentHash.split("_")[0] : "";

	window.location.hash = `
		${hashPrefix.replace("#", "")}_
		${hashLookup[topicId].find((l) => l.value === topic).hash}/
		${hashLookup[subTopicId].find((l) => l.value === subTopic).hash}/
		${hashLookup[topicId].find((l) => l.value === topic)[characteristicId].find((c) => c.value === characteristic).hash}/
		${singlePeriod}/
		${view}
	`;
};

export const getSelections = () => {
	const { hash } = window.location;
	if (hash) {
		let selections = hash.split("_");
		if (selections.length > 1) selections = selections[1].split("/");
		const topic = hashLookup[topicId].find((l) => l.hash === selections[0]).value;
		const subTopic = hashLookup[subTopicId].find((l) => l.hash === selections[1]).value;
		const characteristic = hashLookup[topicId]
			.find((l) => l.hash === selections[0])
			[characteristicId].find((c) => c.hash === selections[2]).value;
		const viewSinglePeriod = selections[3] !== "0";

		$(`#${topicId}`).val(topic);
		$(`#${subTopicId}`).val(subTopic);
		$(`#${characteristicId}`).val(characteristic);
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
