// to create a new hashLookup uncomment the code at the top of getFlattenedFilteredData() in landingpage.js
const hashLookup = {
	"angina-pectoris": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-communicating": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-hearing": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-remembering-or-concentrating": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-seeing": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-walking-or-climbing-steps": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-difficulty-with-self-care": {
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-skin-cancer": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"any-type-of-cancer": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"arthritis-diagnosis": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"asthma-episode-attack": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"breast-cancer": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"cervical-cancer": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"COPD-emphysema-chronic-bronchitis": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"coronary-heart-disease": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"current-asthma": {
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"current-asthma-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"diagnosed-diabetes": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"diagnosed-hypertension": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"disability-status-(composite)": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"ever-having-a-learning-disability": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"ever-having-asthma": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"ever-having-attention-deficit/hyperactivity-disorder": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"heart-attack-myocardial-infarction": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"herpes-simplex-virus-type-1-hsv-1": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"herpes-simplex-virus-type-2-hsv-2": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"high-cholesterol": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"high-total-cholesterol": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	hypertension: {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	"obesity-nhanes": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
		],
	},
	obesity: {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"obesity-adult": {
		classificationOptions: [
			{
				hash: "normal-weight-bmi-from-185-to-249",
				value: "1",
			},
			{
				hash: "overweight-or-obese-bmi-greater-than-or-equal-to-250",
				value: "2",
			},
			{
				hash: "obesity-bmi-greater-than-or-equal-to-300",
				value: "3",
			},
			{
				hash: "grade-1-obesity-bmi-from-300-to-349",
				value: "4",
			},
			{
				hash: "grade-2-obesity-bmi-from-350-to-399",
				value: "5",
			},
			{
				hash: "grade-3-obesity-bmi-greater-than-or-equal-to-400",
				value: "6",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race-and-hispanic-origin",
				value: "3",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "4",
			},
			{
				hash: "percent-of-poverty-level",
				value: "5",
			},
			{
				hash: "sex-and-age",
				value: "6",
			},
		],
	},
	"obesity-child": {
		classificationOptions: [
			{
				hash: "2-19-years",
				value: "1",
			},
			{
				hash: "2-5-years",
				value: "2",
			},
			{
				hash: "6-11-years",
				value: "3",
			},
			{
				hash: "12-19-years",
				value: "4",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "sex",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin",
				value: "3",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "4",
			},
			{
				hash: "percent-of-poverty-level",
				value: "5",
			},
			{
				hash: "age",
				value: "2",
			},
		],
	},
	"prostate-cancer": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"regularly-experienced-chronic-pain": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"regularly-had-feelings-of-depression": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"regularly-had-feelings-of-worry-nervousness-or-anxiety": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	suicide: {
		classificationOptions: [
			{
				hash: "physician-offices",
				value: "1",
			},
			{
				hash: "hospital-emergency-departments",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "race-and-age",
				value: "5",
			},
		],
	},
	"ambulatory-care": {
		classificationOptions: [
			{
				hash: "physician-offices",
				value: "1",
			},
			{
				hash: "hospital-emergency-departments",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "race-and-age",
				value: "5",
			},
		],
	},
	"drug-overdose": {
		classificationOptions: [
			{
				hash: "all-drug-overdose-deaths",
				value: "1",
			},
			{
				hash: "drug-overdose-deaths-involving-heroin",
				value: "6",
			},
			{
				hash: "drug-overdose-deaths-involving-methadone",
				value: "4",
			},
			{
				hash: "drug-overdose-deaths-involving-any-opioid",
				value: "2",
			},
			{
				hash: "drug-overdose-deaths-involving-natural-and-semisynthetic-opioids",
				value: "3",
			},
			{
				hash: "drug-overdose-deaths-involving-other-synthetic-opioids-other-than-methadone",
				value: "5",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "sex-and-age",
				value: "3",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-race-and-hispanic-origin-single-race",
				value: "7",
			},
			{
				hash: "sex-and-race-single-race",
				value: "6",
			},
			{
				hash: "sex-and-race-and-hispanic-origin",
				value: "5",
			},
			{
				hash: "sex-and-race",
				value: "4",
			},
		],
	},
	"doctor-visit": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"doctor-visit-among-children": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"by-primary-diagnosis": {
		classificationOptions: [
			{
				hash: "certain-infectious-and-parasitic-diseases",
				value: "5",
			},
			{
				hash: "diseases-of-the-circulatory-system",
				value: "8",
			},
			{
				hash: "diseases-of-the-digestive-system",
				value: "9",
			},
			{
				hash: "diseases-of-the-genitourinary-system",
				value: "10",
			},
			{
				hash: "diseases-of-the-respiratory-system",
				value: "12",
			},
			{
				hash: "diseases-of-the-musculoskeletal-system-and-connective-tissue",
				value: "11",
			},
			{
				hash: "diseases-of-the-skin-and-subcutaneous-tissue",
				value: "13",
			},
			{
				hash: "injury-and-poisoning",
				value: "16",
			},
			{
				hash: "mental-behavioral-and-neurodevelopmental-disorders",
				value: "17",
			},
			{
				hash: "all-diagnoses",
				value: "1",
			},
			{
				hash: "symptoms-signs-and-abnormal-clinical-and-laboratory-findings",
				value: "22",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "by-sex",
				value: "3",
			},
			{
				hash: "by-age",
				value: "2",
			},
			{
				hash: "by-raceethnicity",
				value: "4",
			},
			{
				hash: "by-region",
				value: "6",
			},
			{
				hash: "by-metropolitan-statistical-area-msa",
				value: "5",
			},
			{
				hash: "by-primary-payment-source",
				value: "7",
			},
		],
	},
	"by-reason-for-visit": {
		classificationOptions: [
			{
				hash: "accident-not-otherwise-specified",
				value: "3",
			},
			{
				hash: "chest-pain-and-related-symptoms-not-referable-to-body-systems",
				value: "6",
			},
			{
				hash: "cough",
				value: "7",
			},
			{
				hash: "fever",
				value: "14",
			},
			{
				hash: "headache-pain-in-head",
				value: "15",
			},
			{
				hash: "shortness-of-breath",
				value: "20",
			},
			{
				hash: "other-symptomsproblems-related-to-psychological-and-mental-disorders",
				value: "18",
			},
			{
				hash: "pain-site-not-referable-to-a-specific-body-system",
				value: "19",
			},
			{
				hash: "stomach-and-abdominal-pain-cramps-and-spasms",
				value: "21",
			},
			{
				hash: "all-reasons-patient-reported",
				value: "2",
			},
			{
				hash: "back-symptoms",
				value: "4",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "by-sex",
				value: "3",
			},
			{
				hash: "by-age",
				value: "2",
			},
			{
				hash: "by-raceethnicity",
				value: "4",
			},
			{
				hash: "by-region",
				value: "6",
			},
			{
				hash: "by-metropolitan-statistical-area-msa",
				value: "5",
			},
			{
				hash: "by-primary-payment-source",
				value: "7",
			},
		],
	},
	"fair-or-poor-health-status": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"fair-or-poor-health-status-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"hospital-emergency-department-visit": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"infant-mortality": {
		classificationOptions: [
			{
				hash: "all-races",
				value: "1",
			},
			{
				hash: "not-hispanic-or-latina-white",
				value: "2",
			},
			{
				hash: "not-hispanic-or-latina-black-or-african-american",
				value: "3",
			},
			{
				hash: "hispanic-or-latina-all-races",
				value: "4",
			},
			{
				hash: "american-indian-or-alaska-native",
				value: "5",
			},
			{
				hash: "asian-or-pacific-islander",
				value: "6",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state-or-territory",
				value: "1",
			},
		],
	},
	birthweight: {
		classificationOptions: [
			{
				hash: "na",
				value: "0",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "3",
			},
			{
				hash: "intent-and-mechanism-of-injury",
				value: "2",
			},
			{
				hash: "sex-intent-and-mechanism-of-injury",
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "5",
			},
			{
				hash: "sex-age-intent-and-mechanism-of-injury",
				value: "6",
			},
		],
	},
	injury: {
		classificationOptions: [
			{
				hash: "na",
				value: "0",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "3",
			},
			{
				hash: "intent-and-mechanism-of-injury",
				value: "2",
			},
			{
				hash: "sex-intent-and-mechanism-of-injury",
				value: "4",
			},
			{
				hash: "sex-and-age",
				value: "5",
			},
			{
				hash: "sex-age-intent-and-mechanism-of-injury",
				value: "6",
			},
		],
	},
	"missing-11-or-more-school-days-due-to-illness-or-injury": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"six-or-more-workdays-missed-due-to-illness-injury-or-disability": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"blood-pressure-check": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"calcium-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"current-cigarette-smoking": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"current-electronic-cigarette-use": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"dietary-fiber-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"iron-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"potassium-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"saturated-fat-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"sodium-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"vitamin-d-intake": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "race-and-hispanic-origin-and-age-group",
				value: "2",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
		],
	},
	"access-care": {
		classificationOptions: [
			{
				hash: "delay-or-nonreceipt-of-needed-medical-care-due-to-cost",
				value: "1",
			},
			{
				hash: "nonreceipt-of-needed-prescription-drugs-due-to-cost",
				value: "2",
			},
			{
				hash: "nonreceipt-of-needed-dental-care-due-to-cost",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex-18-64-years",
				value: "2",
			},
			{
				hash: "race-18-64-years",
				value: "3",
			},
			{
				hash: "hispanic-origin-and-race-18-64-years",
				value: "4",
			},
			{
				hash: "education-25-64-years",
				value: "5",
			},
			{
				hash: "percent-of-poverty-level-18-64-years",
				value: "6",
			},
			{
				hash: "hispanic-origin-and-race-and-percent-of-poverty-level-18-64-years",
				value: "7",
			},
			{
				hash: "health-insurance-status-at-the-time-of-interview-18-64-years",
				value: "8",
			},
			{
				hash: "level-of-difficulty-18-64-years",
				value: "11",
			},
			{
				hash: "geographic-region-18-64-years",
				value: "12",
			},
			{
				hash: "location-of-residence-18-64-years",
				value: "13",
			},
		],
	},
	"community-hospital-beds": {
		classificationOptions: [
			{
				hash: "community-hospital-beds",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "state",
				value: "1",
			},
		],
	},
	"delayed-getting-medical-care-due-to-cost": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"delayed-getting-medical-care-due-to-cost-among-children": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"did-not-get-needed-medical-care-due-to-cost": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"did-not-get-needed-mental-health-care-due-to-cost": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"did-not-take-medication-as-prescribed-to-save-money": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"exchange-based-coverage-coverage-at-time-of-interview": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: null,
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"has-a-usual-place-of-care": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"has-a-usual-place-of-care-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	medicaidU65: {
		classificationOptions: [
			{
				hash: "na",
				value: "0",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "0",
			},
			{
				hash: "age",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "sex-and-marital-status-14-64-years",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-origin-and-race",
				value: "5",
			},
			{
				hash: "age-and-percent-of-poverty-level",
				value: "6",
			},
			{
				hash: "level-of-difficulty-18-64-years",
				value: "7",
			},
			{
				hash: "geographic-region",
				value: "8",
			},
			{
				hash: "location-of-residence",
				value: "9",
			},
			{
				hash: "sex-and-marital-status-18-64-years",
				value: "10",
			},
		],
	},
	"private-health-insurance-coverage-at-time-of-interview": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"public-health-plan-coverage-at-time-of-interview": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: null,
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"two-or-more-hospital-emergency-department-visits-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"two-or-more-urgent-care-center-or-retail-health-clinic-visits-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"uninsured-at-time-of-interview": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"uninsured-at-time-of-interview-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"uninsured-for-at-least-part-of-the-past-year": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"uninsured-for-more-than-one-year": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"urgent-care-center-or-retail-health-clinic-visit": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"daily-feelings-of-worry-nervousness-or-anxiety": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"receive-services-for-mental-health-problems": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"complete-tooth-loss": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	"dental-exam-or-cleaning": {
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"total-dental-caries-in-permanent-teeth": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	"total-dental-caries-in-primary-teeth": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	"untreated-dental-caries-in-permanent-teeth": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	"untreated-dental-caries-in-primary-teeth": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
		],
		groupOptions: [
			{
				hash: "age-group",
				value: "1",
			},
			{
				hash: "sex-and-age-group",
				value: "3",
			},
			{
				hash: "race-and-hispanic-and-age-group",
				value: "2",
			},
		],
	},
	"counseled-by-a-mental-health-professional": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"ever-received-a-pneumococcal-vaccination": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"prescription-medication-use": {
		classificationOptions: [
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"prescription-medication-use-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"receipt-of-influenza-vaccination": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"receipt-of-influenza-vaccination-among-children": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"receiving-special-education-or-early-intervention-services": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"taking-prescription-medication-for-feelings-of-depression": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
	"well-child-check-up": {
		classificationOptions: [
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "parental-employment",
				value: "7",
			},
			{
				hash: "parental-education",
				value: "8",
			},
			{
				hash: "age",
				value: "3",
			},
			{
				hash: "race",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "5",
			},
			{
				hash: "family-structure",
				value: "6",
			},
			{
				hash: "family-income",
				value: "9",
			},
			{
				hash: "health-insurance-coverage",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "11",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "urbanicity",
				value: "14",
			},
			{
				hash: "region",
				value: "13",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
		],
	},
	"wellness-visit": {
		classificationOptions: [
			{
				hash: "demographic-characteristics",
				value: "1",
			},
			{
				hash: "socio-economic-status",
				value: "3",
			},
			{
				hash: "geographic-characteristics",
				value: "2",
			},
		],
		groupOptions: [
			{
				hash: "age-groups-with-65",
				value: "4",
			},
			{
				hash: "total",
				value: "1",
			},
			{
				hash: "sex",
				value: "2",
			},
			{
				hash: "age-groups-with-75",
				value: "5",
			},
			{
				hash: "race",
				value: "6",
			},
			{
				hash: "hispanic-or-latino-origin-and-race",
				value: "7",
			},
			{
				hash: "education",
				value: "17",
			},
			{
				hash: "marital-status",
				value: "8",
			},
			{
				hash: "employment-status",
				value: "16",
			},
			{
				hash: "urbanicity",
				value: "13",
			},
			{
				hash: "region",
				value: "14",
			},
			{
				hash: "metropolitan-statistical-area-status",
				value: "12",
			},
			{
				hash: "health-insurance-coverage-under-65",
				value: "19",
			},
			{
				hash: "health-insurance-coverage-65",
				value: "20",
			},
			{
				hash: "family-income",
				value: "18",
			},
			{
				hash: "nativity",
				value: "10",
			},
			{
				hash: "disability-status",
				value: "9",
			},
			{
				hash: "sexual-orientation",
				value: "3",
			},
			{
				hash: "cdc-social-vulnerability-index",
				value: "15",
			},
			{
				hash: "veteran-status",
				value: "11",
			},
		],
	},
};

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
		const classification = hashLookup[topic].classificationOptions.find((s) => s.hash === selections[1]).value;
		const group = hashLookup[topic].groupOptions.find((c) => c.hash === selections[2]).value;
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
