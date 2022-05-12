import { GenTrendsSlider } from "../general/genTrendsSlider";

export const config = {
	mapId: "vaccinations-map-wrapper",
	colors: [
		"#FFF",
		"rgb(204, 255, 204)",
		"rgb(127, 205, 187)",
		"rgb(65, 182, 196)",
		"rgb(29, 145, 192)",
		"rgb(34, 94, 168)",
		"rgb(0, 51, 102)",
	],
	inverse: ["#000", "#000", "#000", "#000", "#FFF", "#FFF", "#FFF"],
	countyStroke: "0.4px",

	colorSchemeAndCategoryMap: [
		["4A", "#56a7da", "Low SVI", "High VC", "#000000", "4"],
		["4B", "#6176a9", "Low-Mod SVI", "High VC", "#000000", "8"],
		["4C", "#624d8d", "Mod-High SVI", "High VC", "#FFFFFF", "12"],
		["4D", "#630e74", "High SVI", "High VC", "#FFFFFF", "16"],
		["3A", "#8abce2", "Low SVI", "Mod-High VC", "#000000", "3"],
		["3B", "#8d8cb1", "Low-Mod SVI", "Mod-High VC", "#000000", "7"],
		["3C", "#8a628d", "Mod-High SVI", "Mod-High VC", "#000000", "11"],
		["3D", "#80396b", "High SVI", "Mod-high VC", "#FFFFFF", "15"],
		["2A", "#bbd1eb", "Low SVI", "Low-Mod VC", "#000000", "2"],
		["2B", "#b7a2b8", "Low-Mod SVI", "Low-Mod VC", "#000000", "6"],
		["2C", "#b1768e", "Mod-High SVI", "Low-Mod VC", "#000000", "10"],
		["2D", "#984962", "High SVI", "Low-Mod VC", "#FFFFFF", "14"],
		["1A", "#ede7f2", "Low SVI", "Low VC", "#000000", "1"],
		["1B", "#e2b8c0", "Low-Mod SVI", "Low VC", "#000000", "5"],
		["1C", "#d88a8e", "Mod-High SVI", "Low VC", "#000000", "9"],
		["1D", "#cd5a5a", "High SVI", "Low VC", "#000000", "13"],
	],

	colorSchemeAndCategoryMap2: new Map([
		[
			"SVI",
			[
				["4A", "#56a7da", "Low SVI", "High VC", "#000000", "4"],
				["4B", "#6176a9", "Low-Mod SVI", "High VC", "#000000", "8"],
				["4C", "#624d8d", "Mod-High SVI", "High VC", "#FFFFFF", "12"],
				["4D", "#630e74", "High SVI", "High VC", "#FFFFFF", "16"],
				["3A", "#8abce2", "Low SVI", "Mod-High VC", "#000000", "3"],
				["3B", "#8d8cb1", "Low-Mod SVI", "Mod-High VC", "#000000", "7"],
				["3C", "#8a628d", "Mod-High SVI", "Mod-High VC", "#000000", "11"],
				["3D", "#80396b", "High SVI", "Mod-high VC", "#FFFFFF", "15"],
				["2A", "#bbd1eb", "Low SVI", "Low-Mod VC", "#000000", "2"],
				["2B", "#b7a2b8", "Low-Mod SVI", "Low-Mod VC", "#000000", "6"],
				["2C", "#b1768e", "Mod-High SVI", "Low-Mod VC", "#000000", "10"],
				["2D", "#984962", "High SVI", "Low-Mod VC", "#FFFFFF", "14"],
				["1A", "#ede7f2", "Low SVI", "Low VC", "#000000", "1"],
				["1B", "#e2b8c0", "Low-Mod SVI", "Low VC", "#000000", "5"],
				["1C", "#d88a8e", "Mod-High SVI", "Low VC", "#000000", "9"],
				["1D", "#cd5a5a", "High SVI", "Low VC", "#000000", "13"],
			],
		],
		[
			"Metro",
			[
				["4A", "#08519c", "Low SVI", "High VC", "#000000", "4"],
				["4B", "#006d2c", "Low-Mod SVI", "High VC", "#000000", "8"],
				["3A", "#2171b5", "Low SVI", "Mod-High VC", "#000000", "3"],
				["3B", "#31a354", "Low-Mod SVI", "Mod-High VC", "#000000", "7"],
				["2A", "#6baed6", "Low SVI", "Low-Mod VC", "#000000", "2"],
				["2B", "#74c476", "Low-Mod SVI", "Low-Mod VC", "#000000", "6"],
				["1A", "#bdd7e7", "Low SVI", "Low VC", "#000000", "1"],
				["1B", "#bae4b3", "Low-Mod SVI", "Low VC", "#000000", "5"],
			],
		],
	]),

	percentagesHeatMap1218Total: [
		["0-49.9%", "0-0.25"],
		["50-64.9%", "0.2501-0.50"],
		["65-79.9%", "0.5001-0.75"],
		["80+%", "0.7501-1.0"],
	],

	percentagesHeatMap: new Map([
		[
			"Metro",
			new Map([
				[1, ["0-49.9%", "Metro"]],
				[2, ["50-64.9%", "Non-Metro"]],
				[3, "65-79.9%"],
				[4, "80+%"],
				["Label", ["% of total population fully vaccinated"]],
			]),
		],[
			"boosterDose Metro",
			new Map([
				[1, ["0-29.9%", "Metro"]],
				[2, ["30-39.9%", "Non-Metro"]],
				[3, "40-49.9%"],
				[4, "50+%"],
				["Label", ["% of total population fully vaccinated"]],
			]),
		],
    [
			"boosterDose Metro65",
			new Map([
				[1, ["0-49.9%", "Metro"]],
				[2, ["50-64.9%", "Non-Metro"]],
				[3, "65-79.9%"],
				[4, "80+%"],
				["Label", ["% of total population fully vaccinated"]],
			]),
		],    
		[
			"Metro5To17",
			new Map([
				[1, ["0-29.9%", "Metro"]],
				[2, ["30-39.9%", "Non-Metro"]],
				[3, "40-49.9%"],
				[4, "50+%"],
				["Label", ["% of population 5-17 fully vaccinated"]],
			]),
		],
		[
			"fullyVaccinated SVI",
			new Map([
				[1, ["0-49.9%", "0-0.25"]],
				[2, ["50-64.9%", "0.2501-0.50"]],
				[3, ["65-79.9%", "0.5001-0.75"]],
				[4, ["80+%", "0.7501-1.0"]],
				["Label", ["% of population fully vaccinated"]],
			]),
		],
		[
			"boosterDose SVI",
			new Map([
				[1, ["0-29.9%", "0-0.25"]],
				[2, ["30-39.9%", "0.2501-0.50"]],
				[3, ["40-49.9%", "0.5001-0.75"]],
				[4, ["50+%", "0.7501-1.0"]],
				["Label", ["% of population fully vaccinated"]],
			]),
		],
    [
			"65YearsBooster",
			new Map([
				[1, ["0-49.9%", "0-0.25"]],
				[2, ["50-64.9%", "0.2501-0.50"]],
				[3, ["65-79.9%", "0.5001-0.75"]],
				[4, ["80+%", "0.7501-1.0"]],
				["Label", ["% of population fully vaccinated"]],
			]),
		],  
		[
			"5To17",
			new Map([
				[1, ["0-29.9%", "0-0.25"]],
				[2, ["30-39.9%", "0.2501-0.50"]],
				[3, ["40-49.9%", "0.5001-0.75"]],
				[4, ["50+%", "0.7501-1.0"]],
				["Label", ["% of population fully vaccinated"]],
			]),
		],
	]),

	getCategoryName2: new Map([
		[1, "Large Central Metro"],
		[2, "Large Fringe Metro"],
		[3, "Medium Metro"],
		[4, "Small Metro"],
		[5, "Micropolitan"],
		[6, "Non-core (Rural)"],
    [7, "Metro"],
    [8, "Non-Metro"]
	]),
		
};

export const colorMap = new Map([
	[
		"SVI",
		new Map([
			[1, "#ede7f2"],
			[2, "#bbd1eb"],
			[3, "#8abce2"],
			[4, "#56a7da"],
			[5, "#e2b8c0"],
			[6, "#b7a2b8"],
			[7, "#8d8cb1"],
			[8, "#6176a9"],
			[9, "#d88a8e"],
			[10, "#b1768e"],
			[11, "#8a628d"],
			[12, "#624d8d"],
			[13, "#cd5a5a"],
			[14, "#984962"],
			[15, "#80396b"],
			[16, "#630e74"],
			["XX", "grey"],
		]),
	],
	[
		"Metro",
		new Map([
			[1, "#bdd7e7"],
			[2, "#6baed6"],
			[3, "#2171b5"],
			[4, "#08519c"],
			[5, "#bae4b3"],
			[6, "#74c476"],
			[7, "#31a354"],
			[8, "#006d2c"],
			["XX", "grey"],
		]),
	],
]);

export const SVI = new Map([
	["A", "Low"],
	["B", "Low-Mod"],
	["C", "Mod-High"],
	["D", "High"],
	["", "N/A"],
]);

export const SVIDataTable = new Map([
	["4A", "High VC/Low SVI"],
	["4B", "High VC/Low-Mod SVI"],
	["4C", "High VC/Mod-High SVI"],
	["4D", "High VC/High SVI"],
	["3A", "Mod-High VC/Low SVI"],
	["3B", "Mod-High VC/Low-Mod SVI"],
	["3C", "Mod-High VC/Mod-High SVI"],
	["3D", "Mod-High VC/High SVI"],
	["2A", "Low-Mod VC/Low SVI"],
	["2B", "Low-Mod SVI/Low-Mod VC"],
	["2C", "Low-Mod VC/Mod-High SVI"],
	["2D", "Low-Mod VC/High SVI"],
	["1A", "Low VC/Low SVI"],
	["1B", "Low VC/Low-Mod SVI"],
	["1C", "Low VC/Mod-High SVI"],
	["1D", "Low VC/High SVI"],
]);

export const summaryTable = new Map([
	[
		"SVI",
		new Map([
			[
				"fullyVaccinated Total_Population",
				new Map([
					["1", ["0-0.25", "0 - <50%"]],
					["2", ["0-0.25", "50 - <65%"]],
					["3", ["0-0.25", "65 - <80%"]],
					["4", ["0-0.25", ">=80%"]],
					["5", ["0.2501-0.50", "0 - <50%"]],
					["6", ["0.2501-0.50", "50 - <65%"]],
					["7", ["0.2501-0.50", "65 - <80%"]],
					["8", ["0.2501-0.50", ">=80%"]],
					["9", ["0.5001-0.75", "0 - <50%"]],
					["10", ["0.5001-0.75", "50 - <65%"]],
					["11", ["0.5001-0.75", "65 - <80%"]],
					["12", ["0.5001-0.75", ">=80%"]],
					["13", ["0.7501-1.0", "0 - <50%"]],
					["14", ["0.7501-1.0", "50 - <65%"]],
					["15", ["0.7501-1.0", "65 - <80%"]],
					["16", ["0.7501-1.0", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"boosterDose Total_Population",
				new Map([
					["1", ["0-0.25", "0 - <30%"]],
					["2", ["0-0.25", "30 - <40%"]],
					["3", ["0-0.25", "40 - <50%"]],
					["4", ["0-0.25", ">=50%"]],
					["5", ["0.2501-0.50", "0 - <30%"]],
					["6", ["0.2501-0.50", "30 - <40%"]],
					["7", ["0.2501-0.50", "40 - <50%"]],
					["8", ["0.2501-0.50", ">=50%"]],
					["9", ["0.5001-0.75", "0 - <30%"]],
					["10", ["0.5001-0.75", "30 - <40%"]],
					["11", ["0.5001-0.75", "40 - <50%"]],
					["12", ["0.5001-0.75", ">=50%"]],
					["13", ["0.7501-1.0", "0 - <30%"]],
					["14", ["0.7501-1.0", "30 - <40%"]],
					["15", ["0.7501-1.0", "40 - <50%"]],
					["16", ["0.7501-1.0", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],      
			[
				"fullyVaccinated Population_5_17",
				new Map([
					["1", ["0-0.25", "0 - <30%"]],
					["2", ["0-0.25", "30 - <40%"]],
					["3", ["0-0.25", "40 - <50%"]],
					["4", ["0-0.25", ">=50%"]],
					["5", ["0.2501-0.50", "0 - <30%"]],
					["6", ["0.2501-0.50", "30 - <40%"]],
					["7", ["0.2501-0.50", "40 - <50%"]],
					["8", ["0.2501-0.50", ">=50%"]],
          ["9", ["0.5001-0.75", "0 - <30%"]],
          ["10", ["0.5001-0.75", "30 - <40%"]],
          ["11", ["0.5001-0.75", "40 - <50%"]],
          ["12", ["0.5001-0.75", ">=50%"]],
          ["13", ["0.7501-1.0", "0 - <30%"]],
          ["14", ["0.7501-1.0", "30 - <40%"]],
          ["15", ["0.7501-1.0", "40 - <50%"]],
          ["16", ["0.7501-1.0", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"fullyVaccinated Population_Over_12",
				new Map([
					["1", ["0-0.25", "0 - <50%"]],
					["2", ["0-0.25", "50 - <65%"]],
					["3", ["0-0.25", "65 - <80%"]],
					["4", ["0-0.25", ">=80%"]],
					["5", ["0.2501-0.50", "0 - <50%"]],
					["6", ["0.2501-0.50", "50 - <65%"]],
					["7", ["0.2501-0.50", "65 - <80%"]],
					["8", ["0.2501-0.50", ">=80%"]],
					["9", ["0.5001-0.75", "0 - <50%"]],
					["10", ["0.5001-0.75", "50 - <65%"]],
					["11", ["0.5001-0.75", "65 - <80%"]],
					["12", ["0.5001-0.75", ">=80%"]],
					["13", ["0.7501-1.0", "0 - <50%"]],
					["14", ["0.7501-1.0", "50 - <65%"]],
					["15", ["0.7501-1.0", "65 - <80%"]],
					["16", ["0.7501-1.0", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"boosterDose Population_Over_12",
				new Map([
					["1", ["0-0.25", "0 - <30%"]],
					["2", ["0-0.25", "30 - <40%"]],
					["3", ["0-0.25", "40 - <50%"]],
					["4", ["0-0.25", ">=50%"]],
					["5", ["0.2501-0.50", "0 - <30%"]],
					["6", ["0.2501-0.50", "30 - <40%"]],
					["7", ["0.2501-0.50", "40 - <50%"]],
					["8", ["0.2501-0.50", ">=50%"]],
					["9", ["0.5001-0.75", "0 - <30%"]],
					["10", ["0.5001-0.75", "30 - <40%"]],
					["11", ["0.5001-0.75", "40 - <50%"]],
					["12", ["0.5001-0.75", ">=50%"]],
					["13", ["0.7501-1.0", "0 - <30%"]],
					["14", ["0.7501-1.0", "30 - <40%"]],
					["15", ["0.7501-1.0", "40 - <50%"]],
					["16", ["0.7501-1.0", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],      
			[
				"fullyVaccinated Population_Over_18",
				new Map([
					["1", ["0-0.25", "0 - <50%"]],
					["2", ["0-0.25", "50 - <65%"]],
					["3", ["0-0.25", "65 - <80%"]],
					["4", ["0-0.25", ">=80%"]],
					["5", ["0.2501-0.50", "0 - <50%"]],
					["6", ["0.2501-0.50", "50 - <65%"]],
					["7", ["0.2501-0.50", "65 - <80%"]],
					["8", ["0.2501-0.50", ">=80%"]],
					["9", ["0.5001-0.75", "0 - <50%"]],
					["10", ["0.5001-0.75", "50 - <65%"]],
					["11", ["0.5001-0.75", "65 - <80%"]],
					["12", ["0.5001-0.75", ">=80%"]],
					["13", ["0.7501-1.0", "0 - <50%"]],
					["14", ["0.7501-1.0", "50 - <65%"]],
					["15", ["0.7501-1.0", "65 - <80%"]],
					["16", ["0.7501-1.0", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"boosterDose Population_Over_18",
				new Map([
					["1", ["0-0.25", "0 - <30%"]],
					["2", ["0-0.25", "30 - <40%"]],
					["3", ["0-0.25", "40 - <50%"]],
					["4", ["0-0.25", ">=50%"]],
					["5", ["0.2501-0.50", "0 - <30%"]],
					["6", ["0.2501-0.50", "30 - <40%"]],
					["7", ["0.2501-0.50", "40 - <50%"]],
					["8", ["0.2501-0.50", ">=50%"]],
					["9", ["0.5001-0.75", "0 - <30%"]],
					["10", ["0.5001-0.75", "30 - <40%"]],
					["11", ["0.5001-0.75", "40 - <50%"]],
					["12", ["0.5001-0.75", ">=50%"]],
					["13", ["0.7501-1.0", "0 - <30%"]],
					["14", ["0.7501-1.0", "30 - <40%"]],
					["15", ["0.7501-1.0", "40 - <50%"]],
					["16", ["0.7501-1.0", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],      
			[
				"fullyVaccinated Population_65_plus",
				new Map([
					["1", ["0-0.25", "0 - <50%"]],
					["2", ["0-0.25", "50 - <65%"]],
					["3", ["0-0.25", "65 - <80%"]],
					["4", ["0-0.25", ">=80%"]],
					["5", ["0.2501-0.50", "0 - <50%"]],
					["6", ["0.2501-0.50", "50 - <65%"]],
					["7", ["0.2501-0.50", "65 - <80%"]],
					["8", ["0.2501-0.50", ">=80%"]],
					["9", ["0.5001-0.75", "0 - <50%"]],
					["10", ["0.5001-0.75", "50 - <65%"]],
					["11", ["0.5001-0.75", "65 - <80%"]],
					["12", ["0.5001-0.75", ">=80%"]],
					["13", ["0.7501-1.0", "0 - <50%"]],
					["14", ["0.7501-1.0", "50 - <65%"]],
					["15", ["0.7501-1.0", "65 - <80%"]],
					["16", ["0.7501-1.0", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"boosterDose Population_65_plus",
				new Map([
					["1", ["0-0.25", "0 - <30%"]],
					["2", ["0-0.25", "30 - <50%"]],
					["3", ["0-0.25", "50 - <70%"]],
					["4", ["0-0.25", ">=70%"]],
					["5", ["0.2501-0.50", "0 - <30%"]],
					["6", ["0.2501-0.50", "30 - <50%"]],
					["7", ["0.2501-0.50", "50 - <70%"]],
					["8", ["0.2501-0.50", ">=70%"]],
					["9", ["0.5001-0.75", "0 - <30%"]],
					["10", ["0.5001-0.75", "30 - <50%"]],
					["11", ["0.5001-0.75", "50 - <70%"]],
					["12", ["0.5001-0.75", ">=70%"]],
					["13", ["0.7501-1.0", "0 - <30%"]],
					["14", ["0.7501-1.0", "30 - <50%"]],
					["15", ["0.7501-1.0", "50 - <70%"]],
					["16", ["0.7501-1.0", ">=70%"]],
					["", ["N/A", "N/A"]],
				]),
			],      
			[
				"fullyVaccinated Population_5",
				new Map([
					["1", ["0-0.25", "0 - <50%"]],
					["2", ["0-0.25", "50 - <65%"]],
					["3", ["0-0.25", "65 - <80%"]],
					["4", ["0-0.25", ">=80%"]],
					["5", ["0.2501-0.50", "0 - <50%"]],
					["6", ["0.2501-0.50", "50 - <65%"]],
					["7", ["0.2501-0.50", "65 - <80%"]],
					["8", ["0.2501-0.50", ">=80%"]],
					["9", ["0.5001-0.75", "0 - <50%"]],
					["10", ["0.5001-0.75", "50 - <65%"]],
					["11", ["0.5001-0.75", "65 - <80%"]],
					["12", ["0.5001-0.75", ">=80%"]],
					["13", ["0.7501-1.0", "0 - <50%"]],
					["14", ["0.7501-1.0", "50 - <65%"]],
					["15", ["0.7501-1.0", "65 - <80%"]],
					["16", ["0.7501-1.0", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
		]),
	],
	[
		"Metro",
		new Map([
			[
				"fullyVaccinated Total_Population",
				new Map([
					["1", ["Metro", "0 - <50%"]],
					["2", ["Metro", "50 - <65%"]],
					["3", ["Metro", "65 - <80%"]],
					["4", ["Metro", ">=80%"]],
					["5", ["Non-Metro", "0 - <50%"]],
					["6", ["Non-Metro", "50 - <65%"]],
					["7", ["Non-Metro", "65 - <80%"]],
					["8", ["Non-Metro", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],[
				"boosterDose Total_Population",
				new Map([
					["1", ["Metro", "0 - <30%"]],
					["2", ["Metro", "30 - <40%"]],
					["3", ["Metro", "40 - <50%"]],
					["4", ["Metro", ">=50%"]],
					["5", ["Non-Metro", "0 - <30%"]],
					["6", ["Non-Metro", "30 - <40%"]],
					["7", ["Non-Metro", "40 - <50%"]],
					["8", ["Non-Metro", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"fullyVaccinated Population_Over_12",
				new Map([
					["1", ["Metro", "0 - <50%"]],
					["2", ["Metro", "50 - <65%"]],
					["3", ["Metro", "65 - <80%"]],
					["4", ["Metro", ">=80%"]],
					["5", ["Non-Metro", "0 - <50%"]],
					["6", ["Non-Metro", "50 - <65%"]],
					["7", ["Non-Metro", "65 - <80%"]],
					["8", ["Non-Metro", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],[
				"boosterDose Population_Over_12",
				new Map([
					["1", ["Metro", "0 - <30%"]],
					["2", ["Metro", "30 - <40%"]],
					["3", ["Metro", "40 - <50%"]],
					["4", ["Metro", ">=50%"]],
					["5", ["Non-Metro", "0 - <30%"]],
					["6", ["Non-Metro", "30 - <40%"]],
					["7", ["Non-Metro", "40 - <50%"]],
					["8", ["Non-Metro", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],      
			[
				"fullyVaccinated Population_Over_18",
				new Map([
					["1", ["Metro", "0 - <50%"]],
					["2", ["Metro", "50 - <65%"]],
					["3", ["Metro", "65 - <80%"]],
					["4", ["Metro", ">=80%"]],
					["5", ["Non-Metro", "0 - <50%"]],
					["6", ["Non-Metro", "50 - <65%"]],
					["7", ["Non-Metro", "65 - <80%"]],
					["8", ["Non-Metro", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],[
				"boosterDose Population_Over_18",
				new Map([
					["1", ["Metro", "0 - <30%"]],
					["2", ["Metro", "30 - <40%"]],
					["3", ["Metro", "40 - <50%"]],
					["4", ["Metro", ">=50%"]],
					["5", ["Non-Metro", "0 - <30%"]],
					["6", ["Non-Metro", "30 - <40%"]],
					["7", ["Non-Metro", "40 - <50%"]],
					["8", ["Non-Metro", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"fullyVaccinated Population_65_plus",
				new Map([
					["1", ["Metro", "0 - <50%"]],
					["2", ["Metro", "50 - <65%"]],
					["3", ["Metro", "65 - <80%"]],
					["4", ["Metro", ">=80%"]],
					["5", ["Non-Metro", "0 - <50%"]],
					["6", ["Non-Metro", "50 - <65%"]],
					["7", ["Non-Metro", "65 - <80%"]],
					["8", ["Non-Metro", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],			[
				"boosterDose Population_65_plus",
				new Map([
					["1", ["Metro", "0 - <30%"]],
					["2", ["Metro", "30 - <50%"]],
					["3", ["Metro", "50 - <70%"]],
					["4", ["Metro", ">=70%"]],
					["5", ["Non-Metro", "0 - <30%"]],
					["6", ["Non-Metro", "30 - <50%"]],
					["7", ["Non-Metro", "50 - <70%"]],
					["8", ["Non-Metro", ">=70%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"fullyVaccinated Population_5",
				new Map([
					["1", ["Metro", "0 - <50%"]],
					["2", ["Metro", "50 - <65%"]],
					["3", ["Metro", "65 - <80%"]],
					["4", ["Metro", ">=80%"]],
					["5", ["Non-Metro", "0 - <50%"]],
					["6", ["Non-Metro", "50 - <65%"]],
					["7", ["Non-Metro", "65 - <80%"]],
					["8", ["Non-Metro", ">=80%"]],
					["", ["N/A", "N/A"]],
				]),
			],
			[
				"fullyVaccinated Population_5_17",
				new Map([
					["1", ["Metro", "0 - <30%"]],
					["2", ["Metro", "30 - <40%"]],
					["3", ["Metro", "40 - <50%"]],
					["4", ["Metro", ">=50%"]],
					["5", ["Non-Metro", "0 - <30%"]],
					["6", ["Non-Metro", "30 - <40%"]],
					["7", ["Non-Metro", "40 - <50%"]],
					["8", ["Non-Metro", ">=50%"]],
					["", ["N/A", "N/A"]],
				]),
			],
		]),
	],
]);

const getTooltipConstructor = (vizId, chartValueProperty) => {
	const propertyLookup = {
		// list properties needed in tooltip body and give their line titles and datum types
		LongName: {
			title: "",
			datumType: "string",
		},
		subLine: {
			title: "",
			datumType: "string",
		},
		date: {
			title: "Date: ",
			datumType: "longDate",
		},
		Avg_Series_Complete_Pop_Pct: {
			title: "Avg % population fully vaccinated: ",
			datumType: "percent1",
		},
    Avg_Booster_Pop_Pct: {
			title: "Avg % fully vaccinated pop with a 1st booster dose: ",
			datumType: "percent1",
		},    
		NCHS_Pct: {
			title: "% Population in: ",
			datumType: "percent1",
		},
		NCHS_txt: {
			title: "",
			datumType: "string",
		},
	};

	const headerProps = ["LongName", "subLine"]; // tooltip currently has no headers
	const bodyProps = [chartValueProperty, "NCHS_txt", "date"];

	return {
		propertyLookup,
		headerProps,
		bodyProps,
		svgId: `${vizId}-svg`,
		vizId,
	};
};

export const getAllChartProps = (data, chartBaseProps) => {
	const { chartValueProperty, yAxisTitle,chartTitle } = chartBaseProps;
	const vizId = "urbanRuralChartEquity";

	let props;
	props = {
		data,
		chartProperties: {
			yLeft1: chartValueProperty,
			xAxis: "date",
		},

		usesLegend: true,
		usesDateDomainSlider: true,
		usesChartTitle: true,
		usesLeftAxis: true,
		usesLeftAxisTitle: true,
		usesBottomAxis: true,
		usesDateAsXAxis: true,
		yLeftLabelScale: 3,
		legendCoordinatePercents: [0.05, 0.01],
		leftAxisTitle: yAxisTitle,
		formatXAxis: "shortDate",
		usesMultiLineLeftAxis: true,
    chartTitle:chartTitle,
		multiLineColors: [
			"#88419d",
			"#57b452",
			"#0b84a5",
			"#cc4c02",
			"#690207",
			"#e1ed3e",
			"#7c7e82",
			"#8dddd0",
			"#A6A6A6",
		],
		multiLineLeftAxisKey: "subLine",
		vizId,
		genTooltipConstructor: getTooltipConstructor(vizId, chartValueProperty),
	};

	return props;
};

export const getChartBaseProps = () => {
	const chartValueProperty = "Avg_Series_Complete_Pop_Pct";
	const yAxisTitle = "Average % of total population fully vaccinated";
	return { chartValueProperty, yAxisTitle };
};
	
export const renderSlider = ({ vizId, svgWidth, margin, data }, selectedDomain) => {
	const slider = new GenTrendsSlider(`${vizId}slider-viz-div`, vizId);
	slider.render(d3.extent(data.map((d) => d.date)), svgWidth, margin, 0, selectedDomain);
};
