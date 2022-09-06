import { hashLookup } from "../components/landingPage/config";

const topicId = "data-topic-select";
const subTopicId = "panel-num-select";
const characteristicId = "stub-name-num-select";
const showOnePeriodCheckboxId = "show-one-period-checkbox";

export const writeHashToUrl = () => {
	const topic = $(`#${topicId} :selected`)[0].value;
	const subTopic = $(`#${subTopicId} :selected`)[0].value;
	const characteristic = $(`#${characteristicId} :selected`)[0].value;
	const singlePeriod = $(`#${showOnePeriodCheckboxId}`)[0].checked ? "single-time-period" : "all-time-periods";
	// const view = $("a.nav-link.active").text().toLocaleLowerCase();
	const currentHash = window.location.hash;
	const hashPrefix = currentHash ? currentHash.split("_")[0] : "";

	//////////  leave for debug of new hashLookup object ///////////////////////////////////////////////////////////////
	// debugger;
	// hashLookup.find((l) => l.value === topic).hash;
	// hashLookup.find((l) => l.value === topic)[subTopicId].find((s) => s.value === subTopic).hash;
	// hashLookup.find((l) => l.value === topic)[characteristicId].find((c) => c.value === characteristic).hash;
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	try {
		const topicHash = hashLookup.find((l) => l.value === topic).hash;

		const subtopicHash = hashLookup
			.find((l) => l.value === topic)
			[subTopicId].find((s) => s.value === subTopic).hash;

		const characteristicConfig = hashLookup
			.find((l) => l.value === topic)
			[characteristicId].find((c) => c.value === characteristic);

		window.location.hash = `${hashPrefix.replace("#", "")}_${topicHash}/${subtopicHash}/${
			characteristicConfig.hash
		}/${singlePeriod}`;

		return characteristicConfig.chartLeftMargin;
	} catch {
		return [3, 10];
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
			[subTopicId].find((s) => s.hash === selections[1]).value;
		const characteristic = hashLookup
			.find((l) => l.hash === selections[0])
			[characteristicId].find((c) => c.hash === selections[2]).value;
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
