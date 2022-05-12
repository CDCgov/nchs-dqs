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
  maxByValueArrayOfObjects(array,objectKey){
    //it returns the max value (number)
    // of an array of objects in the specified key
   return  Math.max.apply(Math, array.map(function(x) { return x[objectKey]; }))
  },
  turnArrayToObject(array, key){
   array.reduce((obj, item) => {
     obj[item[key]] = item
     return obj
   }, {})
  }
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
export const crossLinks = (tabname) => {
	let linkContent = {
		"pregnancy-data": `
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/communication/toolkits/pregnant-people-and-new-parents.html"><div class="cross-link-content"><h2>Toolkit for Pregnant People and New Parents</h2></div></a>
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/pregnancy.html"><div class="cross-link-content"><h2>COVID-19 Vaccines While Pregnant or Breastfeeding</h2></div></a>
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/pregnant-people.html"><div class="cross-link-content"><h2>COVID-19 in Pregnant and Recently Pregnant People </h2></div></a>
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/planning-for-pregnancy.html"><div class="cross-link-content"><h2>COVID-19 Vaccines for People Who Would Like to Have a Baby </h2></div></a>
			`,

		cases: `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html"><div class="cross-link-content"><h2>Wondering what all the data mean?</h2>CDC’s new  <span class="under-line"> COVID Data Tracker Weekly Review</span> helps you stay up-to-date on the pandemic with weekly visualizations, analysis, and interpretations of key data and trends.</div></a>
                  <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/transmission/index.html"><div class="cross-link-content"> <h2>How does COVID-19 Spread?</h2>Learn <span class="under-line">more</span> </div></a>
                  <a  class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/transmission/variant-cases.html "><div class="cross-link-content"> <h2>Information on US COVID-19 Cases Caused by Variants</h2> Learn more <span class="under-line">here</span> </div></a>
                  <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html"><div class="cross-link-content"> <h2>Do you need information on testing?</h2>Find it <span class="under-line">here</span> </div></a>`,
		trends: `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html"><div class="cross-link-content"><h2>Wondering what all the data mean?</h2>CDC’s new  <span class="under-line"> COVID Data Tracker Weekly Review</span> helps you stay up-to-date on the pandemic with weekly visualizations, analysis, and interpretations of key data and trends.</div></a>
                   <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/nchs/nvss/vsrr/covid_weekly/index.htm "><div class="cross-link-content"> <h2>Where can I see the number of deaths from death certificate data?</h2>Death certificate data are reported directly to CDC’s National Center for Health Statistics by state vital record offices as part of the National Vital Statistics System (NVSS). You can use <span class="under-line">NVSS data</span> to look at trends in total deaths, COVID-19 deaths, leading causes and excess deaths by geography, age, sex, race/ethnicity, and comorbidities.</div></a>
                   <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#county-view"><div class="cross-link-content"> <h2>How many COVID-19 cases are there in your county?</h2>View your county’s data in the <span class="under-line">County View tab</span></div></a> 
                   `,
		"compare-trends": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#global-trends"><div class="cross-link-content"> <h2>How do your state’s trend lines compare to other countries?</h2>View <span class="under-line">global</span> COVID case and death trends to find out</div></a>`,
		demographics:
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/index.html"><div class="cross-link-content"> <h2>Do you need to take extra precautions to reduce your risk of contracting COVID-19?</h2>Find more <span class="under-line">information and resources</span> for those at increased risk for COVID-19 </div></a>',
		"pop-factors":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#county-view"><div class="cross-link-content"> <h2>Did you know you can find COVID-19 data for any county in the US?</h2>Use COVID Data Tracker’s <span class="under-line">County View tab</div></a>',
		"ed-visits":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/if-you-are-sick/steps-when-sick.html#warning-signs"><div class="cross-link-content"> <h2>When should you seek emergency care?</h2>Find out <span class="under-line">here</span> </div></a>',
		testing:
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html"><div class="cross-link-content"> <h2>Do you need information on testing?</h2>Find it <span class="under-line">here</span> </div></a>',
		"national-lab":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/lab/index.html"><div class="cross-link-content"> <h2>Looking for COVID-19 lab resources?</h2>Find them <span class="under-line">here</span> </div></a>',
		"nationwide-blood-donor-seroprevalence": `<a class="crosslink-styles" href="./#trends_dailycases"><div class="cross-link-content"><h2>Want to know more about trends in COVID-19 US cases? </h2>Find them <span class="under-line">here</span>.</div></a>
                                                 <a class="crosslink-styles" href="./#vaccination-trends"> <div class="cross-link-content"> <h2>Want to know more about trends in COVID-19 US vaccinations? </h2>See the <span class="under-line"> latest trends</span> in the number of COVID-19 vaccinations given in the United States.</div></a>
                                                 <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/lab/index.html"><div class="cross-link-content"><h2>Looking for COVID-19 lab resources?</h2>Find them <span class="under-line">here</span>.</div></a>`,
		"global-counts-rates":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/map-and-travel-notices.html"><div class="cross-link-content"> <h2>Traveling soon?</h2>View COVID-19 <span class="under-line">Travel Recommendations by Destination</span> </div></a> <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/nchs/nvss/covid-19.htm"><div class="cross-link-content"> <h2>More COVID-19 Death Data and Resources</h2> Learn more <span class="under-line">here</span> </div></a>',
		"global-percent-change":
			'<a class="crosslink-styles" href="./#cases_casesper100klast7days"><div class="cross-link-content"> <h2>Interested to see how this compares to the US?</h2><span class="under-line">View</span> US COVID-19 cases and deaths by state </div></a>',
		"global-trends":
			'<a class="crosslink-styles" href="./#trends_dailycases"><div class="cross-link-content"> <h2>Do you want to see how these trends compare to US states and territories?</h2>View US COVID-19 case and death trends <span class="under-line">here</span> </div></a>',
		mobility:
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/daily-life-coping/going-out.html"><div class="cross-link-content"> <h2>Do you know how to protect yourself from COVID-19?</h2><span class="under-line">Learn more</span> about protecting yourself during daily activities and while leaving your home during the COVID-19 pandemic </div></a>',
		"social-impact":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/daily-life-coping/deciding-to-go-out.html"><div class="cross-link-content"> <h2>Should you go out?</h2><span class="under-line">Learn what factors</span> to consider before you decide to go out </div></a>',
		"health-care-personnel":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/index.html"><div class="cross-link-content"> <h2>Are you a healthcare provider?</h2>Find COVID-19 <span class="under-line">resources</span> and guidance for healthcare providers, clinical care, and more </div></a>',
		"covidnet-hospitalization-network":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/racial-ethnic-disparities/disparities-hospitalization.html"><div class="cross-link-content"><h2>Want to learn more about disparities in COVID-19-associated hospitalizations?</h2> Find more <span class="under-line">information and resources.</span></div></a>',
		"pandemic-vulnerability-index":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/index.html"><div class="cross-link-content"> <h2>Are you at increased risk for COVID-19?</h2>Find more <span class="under-line">information and resources</span> </div></a>',
		"pregnant-population": `<a class="crosslink-styles" href="https://covid.cdc.gov/covid-data-tracker/#pregnant-birth-infant"><div class="cross-link-content"> <h2>Looking for data on birth and infant outcomes among pregnant women with COVID-19?</h2>Visit CDC's Birth and Infant Outcomes data page for information on delivery type, preterm birth, and infant test results</div></a>
                            <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/communication/toolkits/pregnant-people-and-new-parents.html"><div class="cross-link-content"> <h2>Want to learn more about COVID-19 risk for pregnant women and those who are breastfeeding?</h2>Find more information and resources for pregnancy, breastfeeding, and caring for newborns during the COVID-19 pandemic,including information on COVID-19 vaccines while pregnant or breastfeeding</div></a>`,
		"correctional-facilities":
			'<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/correction-detention/index.html"><div class="cross-link-content"> <h2>Want to learn more about COVID-19 in correctional facilities?</h2>Find more <span class="under-line">information and resources</span> </div></a>',
		"underlying-med-conditions": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/people-with-medical-conditions.html"><div class="cross-link-content"> <h2>Want to learn more about underlying medical conditions and COVID-19 risk?</h2>Find more <span class="under-line">information and resources</span> </div></a>`,
		"mis-national-surveillance": `<a id="crosslink" class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/mis/index.html"><div class="cross-link-content"> <h2>Want to learn more about Multisystem Inflammatory Syndrome?</h2>Find more <span class="under-line">information on MIS-C</span> </div></a>`,
		vaccinations: `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#vaccinations-dialysis-facilities"><div class="cross-link-content"><h2>Dialysis Vaccination Data Dashboard</h2>Dialysis facilities report weekly COVID-19 vaccination data for patients and healthcare personnel to CDC’s National Healthcare Safety Network (NHSN).</div></a>
									<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#vaccinations-nursing-homes"><div class="cross-link-content"><h2>Nursing Home Vaccination Data Dashboard</h2>Long-term care facilities report weekly COVID-19 vaccination data for residents and healthcare personnel to CDC’s National Healthcare Safety Network (NHSN).</div></a>
                  <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#vaccination-trends"><div class="cross-link-content"><h2>Want to know more about trends in COVID-19 US vaccinations?</h2>See the <span class="under-line">latest trends </span> in the number of COVID-19 vaccinations given in the United States.</div></a>`,
		"vaccination-trends": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html"><div class="cross-link-content"><h2>Wondering what all the data mean?</h2>CDC’s new  <span class="under-line"> COVID Data Tracker Weekly Review</span> helps you stay up-to-date on the pandemic with weekly visualizations, analysis, and interpretations of key data and trends.</div></a>
                              <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/covid-19/index.html"><div class="cross-link-content"><h2>Want to know more about COVID-19 vaccinations?</h2>Learn more about recommendations, product information, and more on CDC’s <span class="under-line">COVID-19 Vaccination Landing Page.</span></div></a>
                              <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#vaccinations"><div class="cross-link-content"><h2>Curious about the total number of vaccines distributed and administered in the United States?</h2>Check out the COVID-19 Vaccinations in the United States <span class="under-line">page.</span></div></a>`,
		"vaccinations-cases-trends": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/covid-19/effectiveness-research/protocols.html"><div class="cross-link-content"><h2>Do COVID-19 vaccines work?</h2><span class="under-line">Learn more about how CDC and other experts are continuing to assess how COVID-19 vaccines work in real-world conditions.</span></div></a>`,
		"vaccination-case-rate": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/covid-19/effectiveness-research/protocols.html"><div class="cross-link-content"><h2>Do COVID-19 vaccines work?</h2><span class="under-line">Learn more about how CDC and other experts are continuing to assess how COVID-19 vaccines work in real-world conditions.</span></div></a>`,
		"vaccinations-pregnant-women": `<a class="crosslink-styles" href="https://covid.cdc.gov/covid-data-tracker/#pregnant-population"><div class="cross-link-content"><h2>Want to learn more about COVID-19 among pregnant people?</h2> Visit CDC's <span class="under-line">COVID-19 during pregnancy data</span> page for more information</div></a>`,
		"variant-proportions": `
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/variant-surveillance.html"><div class="cross-link-content"><h2>Why do we use genomic surveillance to monitor SARS-CoV-2 variants?</h2> Visit the <span class="under-line">Genomic Surveillance for SARS-CoV-2 Variants</span> page to learn more</div></a>
			
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/variants/cdc-role-surveillance.html"><div class="cross-link-content"><h2>How is CDC using genomic sequencing to track SARS-CoV-2 variants?</h2> Visit <span class="under-line">CDC’s Role in Tracking Variants</span> page to learn more</div></a>
            
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/transmission/variant.html"><div class="cross-link-content"><h2>Want to know more about variants of the virus that causes COVID-19?</h2>Visit the <span class="under-line">About Variants of the Virus that Causes COVID-19</span> page to learn more</div></a>
            
			<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/variant-surveillance/variant-info.html"><div class="cross-link-content"><h2>What SARS-CoV-2 variants are being monitored?</h2>Visit the <span class="under-line">SARS-CoV-2 Variant Classifications and Definitions</span> page to learn more about variant attributes and their classifications.</div></a>`,
		"health-equity-data": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/racial-ethnic-disparities/disparities-hospitalization.html"><div class="cross-link-content"><h2>Want to learn more about disparities in COVID-19-associated hospitalizations?</h2>Find more <a href='https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/racial-ethnic-disparities/disparities-hospitalization.html' target='_blank' rel='noopener noreferrer'><span class="under-line">information and resources</span></a> </div></a>
                              <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.atsdr.cdc.gov/placeandhealth/svi/at-a-glance_svi.html"><div class="cross-link-content"><h2>How does SVI estimate vulnerability?</h2>Learn more about the <a href='https://www.atsdr.cdc.gov/placeandhealth/svi/at-a-glance_svi.html' target='_blank' rel='noopener noreferrer'><span class="under-line">CDC/ASTDR Social Vulnerability Index (SVI).</span></a> </div></a>
                              <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/people-with-medical-conditions.html"><div class="cross-link-content"><h2>Want to learn more about underlying medical conditions and COVID-19 risk?</h2>Find more <a href='https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/people-with-medical-conditions.html' target='_blank' rel='noopener noreferrer'><span class="under-line">information and resources</span></a> </div></a>`,
		"pediatric-data": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/schools-childcare/index.html">
												<div class="cross-link-content">
													<h2>Looking for information on COVID-19 in school settings?</h2>
													<a href='https://www.cdc.gov/coronavirus/2019-ncov/community/schools-childcare/index.html' target='_blank' rel='noopener noreferrer'>
														<span class="under-line">See guidance for COVID -19 prevention in K-12 schools and childcare programs.</span>
													</a>
												</div>
											</a>
                      <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/mis/mis-c.html">
												<div class="cross-link-content">
													<h2>Want to learn more about Multisystem Inflammatory Syndrome in Children (MIS-C)?</h2>
													<a href='https://www.cdc.gov/mis/mis-c.html' target='_blank' rel='noopener noreferrer'>
														<span class="under-line">Find more information on MIS-C.</span>
													</a>
												</div>
											</a>
                      <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/adolescents.html">
												<div class="cross-link-content">
													<h2>Looking for information on COVID-19 vaccines for children and teens?</h2>
													<a href='https://www.cdc.gov/coronavirus/2019-ncov/vaccines/recommendations/adolescents.html' target='_blank' rel='noopener noreferrer'>
														<span class="under-line">Find a vaccine provider near you and how to prepare for your vaccine appointment.</span>
													</a>
												</div>
											</a>
                      <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/vaccine-equity.html">
												<div class="cross-link-content">
													<h2>CDC is committed to vaccine equity.</h2>
													<a href='https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/vaccine-equity.html' target='_blank' rel='noopener noreferrer'>
														<span class="under-line">Explore CDC’s efforts to promote fair and just access to COVID-19 vaccines.</span>
													</a>
												</div>
											</a>`,
		"vaccine-confidence": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/imz-managers/coverage/covidvaxview/index.html"><div class="cross-link-content"> <h2> Want to learn more about vaccination uptake and intent to vaccinate?</h2>CDC's COVIDVaxView provides additional information on vaccination intent and attitudes nationally and by jurisdiction.</div></a>
								<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html"><div class="cross-link-content"><h2>Wondering what all the data mean?</h2>CDC’s new  <span class="under-line"> COVID Data Tracker Weekly Review</span> helps you stay up-to-date on the pandemic with weekly visualizations, analysis, and interpretations of key data and trends.</div></a>
								<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/covid-19/index.html"><div class="cross-link-content"><h2>Want to know more about COVID-19 vaccinations?</h2>Learn more about recommendations, product information, and more on CDC’s <span class="under-line">COVID-19 Vaccination Landing Page.</span> </div></a>
								<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#vaccinations"><div class="cross-link-content"><h2>Curious about the total number of vaccines distributed and administered in the United States?</h2>Check out the COVID-19 Vaccinations in the United States <span class="under-line">page.</span> </div></a>`,
		"vaccination-equity": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#vaccination-demographic"><div class="cross-link-content"><h2>Percentages of Booster Eligible Population with and without a Booster Dose</h2><span class="under-line">See Booster Eligibility data by Race/Ethnicity and Age</span></a> </div></a>
                           <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/vaccine-equity.html"><div class="cross-link-content"><h2>CDC is committed to Vaccine Equity</h2><a href='https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/vaccine-equity.html' target='_blank' rel='noopener noreferrer'><span class="under-line">Explore CDC’s efforts to promote fair and just access to COVID-19 vaccines </span></a> </div></a>`,
		"vaccinations-disability-status": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html"><div class="cross-link-content"><h2>Wondering what all the data mean?</h2>CDC’s new  <span class="under-line"> COVID Data Tracker Weekly Review</span> helps you stay up-to-date on the pandemic with weekly visualizations, analysis, and interpretations of key data and trends.</div></a>
								<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/vaccines/covid-19/index.html"><div class="cross-link-content"><h2>Want to know more about COVID-19 vaccinations?</h2>Learn more about recommendations, product information, and more on CDC’s <span class="under-line">COVID-19 Vaccination Landing Page.</span></div></a>
								<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#vaccinations"><div class="cross-link-content"><h2>Curious about the total number of vaccines distributed and administered in the United States?</h2>Check out the COVID-19 Vaccinations in the United States <span class="under-line">page.</span></div></a>`,
		"vaccine-effectiveness": `<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness.html"
									><div class="cross-link-content">
										<h2>Ensuring COVID-19 Vaccines Work</h2>
									</div></a>
								<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/work.html"
									><div class="cross-link-content">
										<h2>COVID-19 Vaccines Work</h2>
									</div></a>
								<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/why-measure-effectiveness.html"
									><div class="cross-link-content">
										<h2>Why CDC Monitors Vaccine Effectiveness</h2>
									</div></a>
								<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/how-they-work.html"
									><div class="cross-link-content">
										<h2>How CDC Monitors Vaccine Effectiveness</h2>
									</div></a>
								<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/vaccines/covid-19/effectiveness-research/protocols.html"
									><div class="cross-link-content">
										<h2>COVID-19 Vaccine Effectiveness Research</h2>
									</div></a>
								<a
									class="crosslink-styles"
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/why-measure-effectiveness/breakthrough-cases.html"
									><div class="cross-link-content">
										<h2>
											The Possibility of COVID-19 Infection after Vaccination:
											Breakthrough Infections
										</h2>
									</div></a>`,

		"rates-by-vaccine-status": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#covidnet-hospitalizations-vaccination"><div class="cross-link-content"><h2>Rate of COVID-19-associated hospitalizations by vaccination status</h2>Want to learn more about COVID-19 hospitalizations? </div></a>
									 <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/why-measure-effectiveness/breakthrough-cases.html"><div class="cross-link-content"><h2>The Possibility of COVID-19 after Vaccination: Breakthrough Infections</h2>Want more information on COVID-19 vaccine breakthrough cases? </div></a>
									 <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness.html"><div class="cross-link-content"><h2>Ensuring Vaccines Work </h2>Want more information on vaccine effectiveness? </div></a>
									
									 `,
		"vaccinations-nursing-homes": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/nhsn/ltc/weekly-covid-vac/index.html"><div class="cross-link-content"><h2>NHSN Weekly HCP & Resident COVID-19 Vaccination </h2></div></a>
									   <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#vaccinations-dialysis-facilities"><div class="cross-link-content"><h2>Dialysis COVID-19 Vaccination Data Dashboard</h2></div></a>`,
		"vaccinations-dialysis-facilities": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/nhsn/hps/weekly-covid-vac/index.html"><div class="cross-link-content"><h2>NHSN Weekly HCP COVID-19 Vaccination</h2></div></a>
											 <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/nhsn/dialysis/pt-covid-vac/index.html"><div class="cross-link-content"><h2>NHSN Weekly Patient COVID-19 Vaccination</h2></div></a>
											 <a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="#vaccinations-nursing-homes"><div class="cross-link-content"><h2>Nursing Home COVID-19 Vaccination Data Dashboard</h2></div></a>`,
		"vaccination-demographics-trends": `<a class="crosslink-styles" target="_blank" rel="noopener noreferrer" href="https://covid.cdc.gov/covid-data-tracker/#vaccine-confidence "><div class="cross-link-content"><h2>See more weekly, self-reported data about COVID-19 vaccination status for US adults by demographic group</h2></div></a>`,
	};
	return linkContent[tabname];
};

export const formatNumber = (num) => {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const abbreviateNumber = (value, fixedValue) => {
	// if set the fixed value to 0 it rounds up, need to figure out a way to stop that

	// Nine Zeroes for Billions
	return Math.abs(Number(value)) >= 1.0e9
		? `${(Math.abs(Number(value)) / 1.0e9).toFixed(fixedValue)}B`
		: // Six Zeroes for Millions
		Math.abs(Number(value)) >= 1.0e6
		? `${(Math.abs(Number(value)) / 1.0e6).toFixed(fixedValue)}M`
		: // Three Zeroes for Thousands
		Math.abs(Number(value)) >= 1.0e3
		? `${(Math.abs(Number(value)) / 1.0e3).toFixed(fixedValue)}k`
		: Math.abs(Number(value));
};

const mapOrder = (a, order, key) => {
	const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
	return a.sort((a, b) => map[a[key]] - map[b[key]]);
};

export const objectOrder = (array, order, key) => {
	return key === "Category" ? mapOrder(array, order, key) : array.sort((a, b) => {
				if (order.indexOf(a[key]) > order.indexOf(b[key])) {
					return 1;
				}
				return -1;
		  });
};