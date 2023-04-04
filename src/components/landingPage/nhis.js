export const NHISHash = {
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

const NHISAdult = [
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
];

// NHAMCS topics
const NHAMCSChild = [
	{
		id: "emergency-department-visits-for-all-diagnoses",
		text: "Emergency department visits for all diagnoses",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-all-reasons-patient-reported",
		text: "Emergency department visits for all reasons (patient reported)",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-accident-not-otherwise-specified",
		text: "Emergency department visits for accident, not otherwise specified",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-back-symptoms",
		text: "Emergency department visits for back symptoms",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-certain-infectious-and-parasitic-diseases",
		text: "Emergency department visits for certain infectious and parasitic diseases",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-chest-pain-and-related-symptoms-not-referable-to-body-systems",
		text: "Emergency department visits for chest pain and related symptoms (not referable to body systems)",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-cough",
		text: "Emergency department visits for cough",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-circulatory-system",
		text: "Emergency department visits for diseases of the circulatory system",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-digestive-system",
		text: "Emergency department visits for diseases of the digestive system",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-genitourinary-system",
		text: "Emergency department visits for diseases of the genitourinary system",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-musculoskeletal-system-and-connective-tissue",
		text: "Emergency department visits for diseases of the musculoskeletal system and connective tissue",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-respiratory-system",
		text: "Emergency department visits for diseases of the respiratory system",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-diseases-of-the-skin-and-subcutaneous-tissue",
		text: "Emergency department visits for diseases of the skin and subcutaneous tissue",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-fever",
		text: "Emergency department visits for fever",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-headache-pain-in-head",
		text: "Emergency department visits for headache, pain in head",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-injury-and-poisoning",
		text: "Emergency department visits for injury and poisoning",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-mental-behavioral-and-neurodevelopmental-disorders",
		text: "Emergency department visits for mental, behavioral, and neurodevelopmental disorders",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-other-symptomsproblems-related-to-psychological-and-mental-disorders",
		text: "Emergency department visits for other symptoms/problems related to psychological and mental disorders",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-pain-site-not-referable-to-a-specific-body-system",
		text: "Emergency department visits for pain, site not referable to a specific body system",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-shortness-of-breath",
		text: "Emergency department visits for shortness of breath",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-stomach-and-abdominal-pain-cramps-and-spasms",
		text: "Emergency department visits for stomach and abdominal pain, cramps and spasms",
		topicGroup: 1,
	},
	{
		id: "emergency-department-visits-for-symptoms-signs-and-abnormal-clinical-and-laboratory-findings",
		text: "Emergency department visits for symptoms, signs, and abnormal clinical and laboratory findings",
		topicGroup: 1,
	},
];

export const NHISTopics = [
	...NHISAdult.map((d) => ({ ...d, prefix: "NHIS" })),
	...NHAMCSChild.map((d) => ({ ...d, prefix: "NHAMCS" })),
];
