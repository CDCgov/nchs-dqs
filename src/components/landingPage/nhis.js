
// These are subgroups!
export const nhisGroups = {
	Total: {
		group: "Total",
		groupId: 0,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"18-34 years": {
		group: "Age Groups with 65+",
		groupId: 1,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"35-49 years": {
		group: "Age Groups with 65+",
		groupId: 1,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"50-64 years": {
		group: "Age Groups with 65+",
		groupId: 1,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"65 years and over": {
		group: "Age Groups with 65+",
		groupId: 1,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"18-44 years": {
		group: "Age Groups with 75+",
		groupId: 2,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"45-64 years": {
		group: "Age Groups with 75+",
		groupId: 2,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"65-74 years": {
		group: "Age Groups with 75+",
		groupId: 2,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"75 years and over": {
		group: "Age Groups with 75+",
		groupId: 2,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Little to no social vulnerability": {
		group: "CDC Social Vulnerability Index",
		groupId: 3,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Low social vulnerability": {
		group: "CDC Social Vulnerability Index",
		groupId: 3,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Medium social vulnerability": {
		group: "CDC Social Vulnerability Index",
		groupId: 3,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"High social vulnerability": {
		group: "CDC Social Vulnerability Index",
		groupId: 3,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"White, single race": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Black or African American, single race": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"American Indian or Alaska Native, single race": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Asian, single race": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Native Hawaiian or Other Pacific Islander, single race": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Black or African American and White": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"American Indian or Alaska Native and White": {
		group: "Race",
		groupId: 13,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"With disability": {
		group: "Disability Status",
		groupId: 4,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Without disability": {
		group: "Disability Status",
		groupId: 4,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Less than high school diploma": {
		group: "Education",
		groupId: 5,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"High school diploma or GED": {
		group: "Education",
		groupId: 5,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Some college": {
		group: "Education",
		groupId: 5,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"College degree or higher": {
		group: "Education",
		groupId: 5,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	Employed: {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Not employed": {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Full-time": {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Part-time": {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Not employed but has worked previously": {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Not employed and has never worked": {
		group: "Employment Status",
		groupId: 6,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Less than 100% FPL": {
		group: "Family Income",
		groupId: 7,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"100% to less than 200% FPL": {
		group: "Family Income",
		groupId: 7,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"200% and greater FPL": {
		group: "Family Income",
		groupId: 7,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	Private: new Map([
		[
			"20",
			{
				group: "Health insurance coverage 65+",
				groupId: 9,
				classification: "Socio-economic status",
				classificationId: 2,
			},
		],
		[
			"19",
			{
				group: "Health insurance coverage under 65",
				groupId: 8,
				classification: "Socio-economic status",
				classificationId: 2,
			},
		],
	]),
	"Medicare and Medicaid": {
		group: "Health insurance coverage 65+",
		groupId: 9,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Medicare Advantage": {
		group: "Health insurance coverage 65+",
		groupId: 9,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Medicare only (no Advantage)": {
		group: "Health insurance coverage 65+",
		groupId: 9,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Other coverage": new Map([
		[
			"20",
			{
				group: "Health insurance coverage 65+",
				groupId: 9,
				classification: "Socio-economic status",
				classificationId: 2,
			},
		],
		[
			"19",
			{
				group: "Health insurance coverage under 65",
				groupId: 8,
				classification: "Socio-economic status",
				classificationId: 2,
			},
		],
	]),
	"Medicaid or other public": {
		group: "Health insurance coverage under 65",
		groupId: 8,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	Uninsured: {
		group: "Health insurance coverage under 65",
		groupId: 8,
		classification: "Socio-economic status",
		classificationId: 2,
	},
	"Hispanic or Latino": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Mexican or Mexican American": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Not Hispanic or Latino": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Not Hispanic or Latino, White, single race": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Not Hispanic or Latino, Black or African American, single race": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Other, non-Hispanic": {
		group: "Hispanic or Latino origin and race",
		groupId: 10,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Married: {
		group: "Marital Status",
		groupId: 11,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Widowed: {
		group: "Marital Status",
		groupId: 11,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Divorced or separated": {
		group: "Marital Status",
		groupId: 11,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Never married": {
		group: "Marital Status",
		groupId: 11,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Living with a partner": {
		group: "Marital Status",
		groupId: 11,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"U.S.-born": {
		group: "Nativity",
		groupId: 12,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Foreign-born": {
		group: "Nativity",
		groupId: 12,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Male: {
		group: "Sex",
		groupId: 14,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Female: {
		group: "Sex",
		groupId: 14,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Gay/lesbian": {
		group: "Sexual Orientation",
		groupId: 15,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Straight: {
		group: "Sexual Orientation",
		groupId: 15,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Bisexual: {
		group: "Sexual Orientation",
		groupId: 15,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	Veteran: {
		group: "Veteran status",
		groupId: 16,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Non-veteran": {
		group: "Veteran status",
		groupId: 16,
		classification: "Demographic Characteristics",
		classificationId: 0,
	},
	"Large MSA": {
		group: "Metropolitan statistical area status",
		groupId: 17,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Small MSA": {
		group: "Metropolitan statistical area status",
		groupId: 17,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Not in MSA": {
		group: "Metropolitan statistical area status",
		groupId: 17,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	Northeast: {
		group: "Region",
		groupId: 18,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	Midwest: {
		group: "Region",
		groupId: 18,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	South: {
		group: "Region",
		groupId: 18,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	West: {
		group: "Region",
		groupId: 18,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Large central metro": {
		group: "Urbanicity",
		groupId: 19,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Large fringe metro": {
		group: "Urbanicity",
		groupId: 19,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	"Medium and small metro": {
		group: "Urbanicity",
		groupId: 19,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
	Nonmetropolitan: {
		group: "Urbanicity",
		groupId: 19,
		classification: "Geographic Characteristics",
		classificationId: 1,
	},
};

export const nhisHash = {
	groupOptions: [
		{
			hash: "total",
			value: "0",
		},
		{
			hash: "age-groups-with-65+",
			value: "1",
		},
		{
			hash: "age-groups-with-75+",
			value: "2",
		},
		{
			hash: "CDC-social-vulnerability-index",
			value: "3",
		},
		{
			hash: "disability-status",
			value: "4",
		},
		{
			hash: "education",
			value: "5",
		},
		{
			hash: "employment-status",
			value: "6",
		},
		{
			hash: "family-income",
			value: "7",
		},
		{
			hash: "health-insurance-coverage-under-65",
			value: "8",
		},
		{
			hash: "health-insurance-coverage-65+",
			value: "9",
		},
		{
			hash: "hispanic-or-latino-origin-and-race",
			value: "10",
		},
		{
			hash: "marital-status",
			value: "11",
		},
		{
			hash: "nativity",
			value: "12",
		},
		{
			hash: "race",
			value: "13",
		},
		{
			hash: "sex",
			value: "14",
		},
		{
			hash: "sexual-orientation",
			value: "15",
		},
		{
			hash: "veteran-status",
			value: "16",
		},
		{
			hash: "metropolitan-statistical-area-status",
			value: "17",
		},
		{
			hash: "region",
			value: "18",
		},
		{
			hash: "urbanicity",
			value: "19",
		},
	],
	classificationOptions: [
		{
			hash: "demographics",
			value: "0",
		},
		{
			hash: "geographic",
			value: "1",
		},
		{
			hash: "socio-economic-status",
			value: "2",
		},
	],
};

export const nhisTopics = [
	{ id: "angina-pectoris", text: "Angina/angina pectoris", topicGroup: 0 },
	{ id: "any-difficulty-communicating", text: "Any difficulty communicating", topicGroup: 0 },
	{ id: "any-difficulty-hearing", text: "Any difficulty hearing", topicGroup: 0 },
	{
		id: "any-difficulty-remembering-or-concentrating",
		text: "Any difficulty remembering or concentrating",
		topicGroup: 0,
	},
	{ id: "any-difficulty-seeing", text: "Any difficulty seeing", topicGroup: 0 },
	{
		id: "any-difficulty-walking-or-climbing-steps",
		text: "Any difficulty walking or climbing steps",
		topicGroup: 0,
	},
	{ id: "any-difficulty-with-self-care", text: "Any difficulty with self care", topicGroup: 0 },
	{ id: "any-skin-cancer", text: "Any skin cancer", topicGroup: 0 },
	{ id: "any-type-of-cancer", text: "Any type of cancer", topicGroup: 0 },
	{ id: "arthritis-diagnosis", text: "Arthritis diagnosis", topicGroup: 0 },
	{ id: "asthma-episode-attack", text: "Asthma episode/attack", topicGroup: 0 },
	{ id: "blood-pressure-check", text: "Blood pressure check", topicGroup: 2 },
	{ id: "breast-cancer", text: "Breast cancer", topicGroup: 0 },
	{ id: "cervical-cancer", text: "Cervical cancer", topicGroup: 0 },
	{ id: "COPD-emphysema-chronic-bronchitis", text: "COPD, emphysema, chronic bronchitis", topicGroup: 0 },
	{ id: "coronary-heart-disease", text: "Coronary heart disease", topicGroup: 0 },
	{
		id: "counseled-by-a-mental-health-professional",
		text: "Counseled by a mental health professional",
		topicGroup: 6,
	},
	{ id: "current-asthma", text: "Current asthma among adults", indicator: "Current asthma", topicGroup: 0 },
	{ id: "current-cigarette-smoking", text: "Current cigarette smoking", topicGroup: 2 },
	{ id: "current-electronic-cigarette-use", text: "Current electronic cigarette use", topicGroup: 2 },
	{
		id: "delayed-getting-medical-care-due-to-cost",
		text: "Delayed getting medical care due to cost among adults",
		indicator: "Delayed getting medical care due to cost",
		topicGroup: 3,
	},
	{ id: "dental-exam-or-cleaning", text: "Dental exam or cleaning", topicGroup: 5 },
	{ id: "diagnosed-diabetes", text: "Diagnosed diabetes (NHIS)", indicator: "Diagnosed diabetes", topicGroup: 0 },
	{
		id: "diagnosed-hypertension",
		text: "Diagnosed hypertension (NHIS)",
		indicator: "Diagnosed hypertension",
		topicGroup: 0,
	},
	{
		id: "did-not-get-needed-medical-care-due-to-cost",
		text: "Did not get needed medical care due to cost",
		topicGroup: 3,
	},
	{
		id: "did-not-get-needed-mental-health-care-due-to-cost",
		text: "Did not get needed mental health care due to cost",
		topicGroup: 3,
	},
	{
		id: "did-not-take-medication-as-prescribed-to-save-money",
		text: "Did not take medication as prescribed to save money",
		topicGroup: 3,
	},
	{ id: "disability-status-(composite)", text: "Disability status (composite)", topicGroup: 0 },
	{
		id: "doctor-visit",
		text: "Doctor visit among adults (NHIS)",
		indicator: "Doctor visit among adults",
		topicGroup: 1,
	},
	{
		id: "ever-received-a-pneumococcal-vaccination",
		text: "Ever received a pneumococcal vaccination",
		topicGroup: 6,
	},
	{
		id: "exchange-based-coverage-coverage-at-time-of-interview",
		text: "Exchange-based coverage at time of interview",
		indicator: "Exchange-based coverage coverage at time of interview",
		topicGroup: 3,
	},
	// { id: "fair-or-Less-than-100%-FPL-health-status", text: "Fair or Less than 100% FPL health status", topicGroup: 1 },
	{
		id: "fair-or-poor-health-status",
		text: "Fair or poor health status among adults",
		indicator: "Fair or poor health status",
		topicGroup: 1,
	},
	{
		id: "has-a-usual-place-of-care",
		text: "Has a usual place of care among adults",
		indicator: "Has a usual place of care",
		topicGroup: 3,
	},
	{ id: "heart-attack-myocardial-infarction", text: "Heart attack/myocardial infarction", topicGroup: 0 },
	{ id: "high-cholesterol", text: "High cholesterol (NHIS)", indicator: "High cholesterol", topicGroup: 0 },
	{
		id: "hospital-emergency-department-visit",
		text: "Hospital emergency department visit (NHIS)",
		indicator: "Hospital emergency department visit",
		topicGroup: 1,
	},
	{ id: "obesity", text: "Obesity (NHIS)", indicator: "Obesity", topicGroup: 0 },
	{
		id: "prescription-medication-use",
		text: "Prescription medication use among adults",
		indicator: "Prescription medication use",
		topicGroup: 6,
	},
	{
		id: "private-health-insurance-coverage-at-time-of-interview",
		text: "Private health insurance coverage at time of interview",
		topicGroup: 3,
	},
	{ id: "prostate-cancer", text: "Prostate cancer", topicGroup: 0 },
	{
		id: "public-health-plan-coverage-at-time-of-interview",
		text: "Public health plan coverage at time of interview",
		topicGroup: 3,
	},
	{
		id: "receipt-of-influenza-vaccination",
		text: "Receipt of influenza vaccination among adults",
		indicator: "Receipt of influenza vaccination",
		topicGroup: 6,
	},
	{ id: "regularly-experienced-chronic-pain", text: "Regularly experienced chronic pain", topicGroup: 0 },
	{ id: "regularly-had-feelings-of-depression", text: "Regularly had feelings of depression", topicGroup: 0 },
	{
		id: "regularly-had-feelings-of-worry-nervousness-or-anxiety",
		text: "Regularly had feelings of worry, nervousness, or anxiety",
		topicGroup: 0,
	},
	{
		id: "six-or-more-workdays-missed-due-to-illness-injury-or-disability",
		text: "Six or more workdays missed due to illness, injury, or disability",
		topicGroup: 1,
	},
	{
		id: "taking-prescription-medication-for-feelings-of-depression",
		text: "Taking prescription medication for feelings of depression",
		topicGroup: 6,
	},
	{
		id: "taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety",
		text: "Taking prescription medication for feelings of worry, nervousness, or anxiety",
		topicGroup: 6,
	},
	{
		id: "uninsured-at-time-of-interview",
		text: "Uninsured at time of interview among adults",
		indicator: "Uninsured at time of interview",
		topicGroup: 3,
	},
	{
		id: "uninsured-for-at-least-part-of-the-past-year",
		text: "Uninsured for at least part of the past year",
		topicGroup: 3,
	},
	{ id: "uninsured-for-more-than-one-year", text: "Uninsured for more than one year", topicGroup: 3 },
	{
		id: "urgent-care-center-or-retail-health-clinic-visit",
		text: "Urgent care center or retail health clinic visit",
		topicGroup: 3,
	},
	{ id: "wellness-visit", text: "Wellness visit", topicGroup: 6 },
	{ id: "current-asthma-among-children", text: "Current asthma among children", topicGroup: 0 },
	{
		id: "daily-feelings-of-worry,-nervousness,-or-anxiety",
		text: "Daily feelings of worry, nervousness, or anxiety",
		topicGroup: 4,
		prefix: 'cshs'
	},
	{
		id: "delayed-getting-medical-care-due-to-cost-among-children",
		text: "Delayed getting medical care due to cost among children",
		topicGroup: 3,
		prefix: 'cshs'
	},
	{ id: "doctor-visit-among-children", text: "Doctor visit among children", topicGroup: 1, prefix: 'cshs' },
	{ id: "ever-having-a-learning-disability", text: "Ever having a learning disability", topicGroup: 0, prefix: 'cshs' },
	{ id: "ever-having-asthma", text: "Ever having asthma", topicGroup: 0, prefix: 'cshs' },
	{
		id: "ever-having-attention-deficit/hyperactivity-disorder",
		text: "Ever having attention-deficit/hyperactivity disorder",
		topicGroup: 0,
		prefix: 'cshs'
	},
	{
		id: "fair-or-poor-health-status-among-children",
		text: "Fair or poor health status among children",
		topicGroup: 1,
		prefix: 'cshs'
	},
	{
		id: "has-a-usual-place-of-care-among-children",
		text: "Has a usual place of care among children",
		topicGroup: 3,
		prefix: 'cshs'
	},
	{
		id: "missing-11-or-more-school-days-due-to-illness-or-injury",
		text: "Missing 11 or more school days due to illness or injury",
		topicGroup: 1,
		prefix: 'cshs'
	},
	{
		id: "prescription-medication-use-among-children",
		text: "Prescription medication use among children",
		topicGroup: 6,
		prefix: 'cshs'
	},
	{
		id: "receipt-of-influenza-vaccination-among-children",
		text: "Receipt of influenza vaccination among children",
		topicGroup: 6,
		prefix: 'cshs'
	},
	{
		id: "receive-services-for-mental-health-problems",
		text: "Receive services for mental health problems",
		topicGroup: 4,
		prefix: 'cshs'
	},
	{
		id: "receiving-special-education-or-early-intervention-services",
		text: "Receiving special education or early intervention services",
		topicGroup: 6,
		prefix: 'cshs'
	},
	{
		id: "two-or-more-hospital-emergency-department-visits-among-children",
		text: "Two or more hospital emergency department visits among children",
		topicGroup: 3,
		prefix: 'cshs'
	},
	{
		id: "two-or-more-urgent-care-center-or-retail-health-clinic-visits-among-children",
		text: "Two or more urgent care center or retail health clinic visits among children",
		topicGroup: 3,
		prefix: 'cshs'
	},
	{
		id: "uninsured-at-time-of-interview-among-children",
		text: "Uninsured at time of interview among children",
		topicGroup: 3,
		prefix: 'cshs'
	},
	{ id: "well-child-check-up", text: "Well child check-up", topicGroup: 6, prefix: 'cshs' },
];
