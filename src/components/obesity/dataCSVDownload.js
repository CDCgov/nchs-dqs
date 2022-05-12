import { downloadCSV } from "../../utils/downloadCSV";

export class CSVDownload {
	constructor(props) {
		this.data = props.data.Booster_eligibility;
	}

	init() {
		window.appState.ACTIVE_TAB.VaxEquity = this;
	}

	exportCSV() {
		const csvData = this.data;
		this.getCSVData(csvData);
		downloadCSV(this.csv);
	}

	getCSVData(data) {
		const groupNameHash = {
			Race_eth_Hispanic: { name: "Hispanic/Latino", index: 0 },
			Race_eth_NHAIAN: { name: "American Indian / Alaska Native Non-Hispanic", index: 1 },
			Race_eth_NHAsian: { name: "Asian Non-Hispanic", index: 2 },
			Race_eth_NHBlack: { name: "Black Non-Hispanic", index: 3 },
			Race_eth_NHMult_Oth: { name: "Multiple, Non-Hispanic", index: 6 },
			Race_eth_NHNHOPI: { name: "Native Hawaiian / Other Pacific Islander Non-Hispanic", index: 4 },
			Race_eth_NHWhite: { name: "White Non-Hispanic", index: 5 },
		};

		const cols = [
			"Race/Ethnicity",
			"Count of Booster Eligible ",
			"% Eligible People, Received Booster",
			"% Eligible People, No Booster",
		];

		const keys = [
			"group",
			"Booster_Eligible_18Plus",
			"Booster_Eligible_Boosted_18Plus_Pct",
			"Booster_Eligible_NotBoosted_18Plus_Pct",
		];

		const dataForDownload = Object.keys(data)
			.map((key) => data[key][0])
			.reduce((arr, obj) => {
				const {
					Booster_Eligible_18Plus,
					Booster_Eligible_Boosted_18Plus_Pct,
					Booster_Eligible_NotBoosted_18Plus_Pct,
					Category,
				} = obj;

				if (groupNameHash[Category]) {
					arr.push({
						index: groupNameHash[Category].index,
						group: groupNameHash[Category].name,
						Booster_Eligible_18Plus,
						Booster_Eligible_Boosted_18Plus_Pct,
						Booster_Eligible_NotBoosted_18Plus_Pct,
					});
				}

				return arr;
			}, [])
			.sort((a, b) => a.index - b.index);

		const csvData = dataForDownload;
		const csvTitle =
			"Percentages of Booster Eligible Population Ages 18+ with and without a Booster Dose, by Race/Ethnicity";

		this.csv = {
			data: csvData,
			dataKeys: keys,
			title: csvTitle,
			headers: cols,
		};
	}
}
