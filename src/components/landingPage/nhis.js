const NHISAdult = [
	{ id: "angina-pectoris", text: "Angina/angina pectoris", topicGroup: 4 },
	{ id: "any-difficulty-communicating", text: "Any difficulty communicating", topicGroup: 8 },
	{ id: "any-difficulty-hearing", text: "Any difficulty hearing", topicGroup: 8 },
	{
		id: "any-difficulty-remembering-or-concentrating",
		text: "Any difficulty remembering or concentrating",
		topicGroup: 8,
	},
	{ id: "any-difficulty-seeing", text: "Any difficulty seeing", topicGroup: 8 },
	{
		id: "any-difficulty-walking-or-climbing-steps",
		text: "Any difficulty walking or climbing steps",
		topicGroup: 8,
	},
	{ id: "any-difficulty-with-self-care", text: "Any difficulty with self care", topicGroup: 8 },
	{ id: "any-skin-cancer", text: "Any skin cancer", topicGroup: 3 },
	{ id: "any-type-of-cancer", text: "Any type of cancer", topicGroup: 3 },
	{ id: "arthritis-diagnosis", text: "Arthritis diagnosis", topicGroup: 0 },
	{ id: "asthma-episode-attack", text: "Asthma episode/attack", topicGroup: 1 },
	{ id: "blood-pressure-check", text: "Blood pressure check", topicGroup: 16 },
	{ id: "breast-cancer", text: "Breast cancer", topicGroup: 3 },
	{ id: "cervical-cancer", text: "Cervical cancer", topicGroup: 3 },
	{ id: "COPD-emphysema-chronic-bronchitis", text: "COPD, emphysema, chronic bronchitis", topicGroup: 5 },
	{ id: "coronary-heart-disease", text: "Coronary heart disease", topicGroup: 4 },
	{
		id: "counseled-by-a-mental-health-professional",
		text: "Counseled by a mental health professional",
		topicGroup: 17,
	},
	{ id: "current-asthma", text: "Current asthma in adults", indicator: "Current asthma among adults", topicGroup: 1 },
	{ id: "current-cigarette-smoking", text: "Current cigarette smoking", topicGroup: 24 },
	{ id: "current-electronic-cigarette-use", text: "Current electronic cigarette use", topicGroup: 24 },
	{
		id: "delayed-getting-medical-care-due-to-cost",
		text: "Delayed getting medical care due to cost among adults (NHIS)",
		indicator: "Delayed getting medical care due to cost among adults",
		topicGroup: 11,
	},
	{ id: "dental-exam-or-cleaning", text: "Dental exam or cleaning", topicGroup: 19 },
	{
		id: "diagnosed-diabetes",
		text: "Diagnosed diabetes, self-reported (NHIS)",
		indicator: "Diagnosed diabetes",
		topicGroup: 7,
	},
	{
		id: "diagnosed-hypertension",
		text: "Hypertension diagnosis, self-reported (NHIS)",
		indicator: "Diagnosed hypertension",
		topicGroup: 4,
	},
	{
		id: "did-not-get-needed-medical-care-due-to-cost",
		text: "Did not get needed medical care due to cost (NHIS)",
		indicator: "Did not get needed medical care due to cost",
		topicGroup: 11,
	},
	{
		id: "did-not-get-needed-mental-health-care-due-to-cost",
		text: "Did not get needed mental health care due to cost (NHIS)",
		indicator: "Did not get needed mental health care due to cost",
		topicGroup: 11,
	},
	{
		id: "did-not-take-medication-as-prescribed-to-save-money",
		text: "Did not take medication as prescribed to save money (NHIS)",
		indicator: "Did not take medication as prescribed to save money",
		topicGroup: 11,
	},
	{ id: "disability-status-(composite)", text: "Disability status (composite)", topicGroup: 8 },
	{
		id: "doctor-visit",
		text: "Doctor visit among adults (NHIS)",
		indicator: "Doctor visit among adults",
		topicGroup: 13,
	},
	{
		id: "ever-received-a-pneumococcal-vaccination",
		text: "Ever received a pneumococcal vaccination",
		topicGroup: 26,
	},
	{
		id: "exchange-based-coverage-coverage-at-time-of-interview",
		text: "Exchange-based coverage at time of interview",
		indicator: "Exchange-based coverage coverage at time of interview",
		topicGroup: 14,
	},
	{
		id: "fair-or-poor-health-status",
		text: "Fair or poor health status in adults",
		indicator: "Fair or poor health status among adults",
		topicGroup: 22,
	},
	{
		id: "has-a-usual-place-of-care",
		text: "Has a usual place of care among adults",
		indicator: "Has a usual place of care among adults",
		topicGroup: 11,
	},
	{ id: "heart-attack-myocardial-infarction", text: "Heart attack/myocardial infarction", topicGroup: 4 },
	{
		id: "high-cholesterol",
		text: "High cholesterol diagnosis, self reported (NHIS)",
		indicator: "High cholesterol",
		topicGroup: 4,
	},
	{
		id: "hospital-emergency-department-visit",
		text: "Hospital emergency department visit (NHIS)",
		indicator: "Hospital emergency department visit",
		topicGroup: 13,
	},
	{ id: "obesity", text: "Obesity, self-reported (NHIS)", indicator: "Obesity (NHIS)", topicGroup: 18 },
	{
		id: "prescription-medication-use",
		text: "Prescription medication use among adults",
		indicator: "Prescription medication use among adults",
		topicGroup: 25,
	},
	{
		id: "private-health-insurance-coverage-at-time-of-interview",
		text: "Private health insurance coverage at time of interview (NHIS)",
		indicator: "Private health insurance coverage at time of interview",
		topicGroup: 14,
	},
	{ id: "prostate-cancer", text: "Prostate cancer", topicGroup: 3 },
	{
		id: "public-health-plan-coverage-at-time-of-interview",
		text: "Public health plan coverage at time of interview (NHIS)",
		indicator: "Public health plan coverage at time of interview",
		topicGroup: 14,
	},
	{
		id: "receipt-of-influenza-vaccination",
		text: "Receipt of influenza vaccination among adults",
		indicator: "Receipt of influenza vaccination among adults",
		topicGroup: 26,
	},
	{ id: "regularly-experienced-chronic-pain", text: "Regularly experienced chronic pain", topicGroup: 20 },
	{ id: "regularly-had-feelings-of-depression", text: "Regularly had feelings of depression", topicGroup: 17 },
	{
		id: "regularly-had-feelings-of-worry-nervousness-or-anxiety",
		text: "Regularly had feelings of worry, nervousness, or anxiety",
		topicGroup: 17,
	},
	{
		id: "six-or-more-workdays-missed-due-to-illness-injury-or-disability",
		text: "Six or more workdays missed due to illness, injury, or disability",
		topicGroup: 9,
	},
	{
		id: "taking-prescription-medication-for-feelings-of-depression",
		text: "Taking prescription medication for feelings of depression",
		topicGroup: 17,
	},
	{
		id: "taking-prescription-medication-for-feelings-of-worry-nervousness-or-anxiety",
		text: "Taking prescription medication for feelings of worry, nervousness, or anxiety",
		topicGroup: 17,
	},
	{
		id: "uninsured-at-time-of-interview",
		text: "Uninsured at time of interview among adults",
		indicator: "Uninsured at time of interview among adults",
		topicGroup: 14,
	},
	{
		id: "uninsured-for-at-least-part-of-the-past-year",
		text: "Uninsured for at least part of the past year",
		topicGroup: 14,
	},
	{ id: "uninsured-for-more-than-one-year", text: "Uninsured for more than one year", topicGroup: 14 },
	{
		id: "urgent-care-center-or-retail-health-clinic-visit",
		text: "Urgent care center or retail health clinic visit",
		topicGroup: 13,
	},
	{ id: "wellness-visit", text: "Wellness visit", topicGroup: 13 },
];

const NHISChild = [
	{
		id: "current-asthma-among-children",
		text: "Current asthma in children",
		indicator: "Current asthma among children",
		topicGroup: 1,
	},
	{
		id: "daily-feelings-of-worry-nervousness-or-anxiety",
		text: "Daily feelings of worry, nervousness, or anxiety in children",
		indicator: "Daily feelings of worry, nervousness, or anxiety among children",
		topicGroup: 17,
	},
	{
		id: "delayed-getting-medical-care-due-to-cost-among-children",
		text: "Delayed getting medical care due to cost among children (NHIS)",
		indicator: "Delayed getting medical care due to cost among children",
		topicGroup: 11,
	},
	{
		id: "doctor-visit-among-children",
		text: "Doctor visit among children (NHIS)",
		indicator: "Doctor visit among children",
		topicGroup: 13,
	},
	{
		id: "ever-having-a-learning-disability",
		text: "Ever having a learning disability",
		topicGroup: 8,
	},
	{
		id: "ever-having-asthma",
		text: "Ever having asthma",
		topicGroup: 1,
	},
	{
		id: "ever-having-attention-deficit/hyperactivity-disorder",
		text: "Ever having attention-deficit/hyperactivity disorder",
		topicGroup: 2,
	},
	{
		id: "fair-or-poor-health-status-among-children",
		text: "Fair or poor health status in children",
		indicator: "Fair or poor health status among children",
		topicGroup: 22,
	},
	{
		id: "has-a-usual-place-of-care-among-children",
		text: "Has a usual place of care among children",
		topicGroup: 11,
	},
	{
		id: "missing-11-or-more-school-days-due-to-illness-or-injury",
		text: "Missing 11 or more school days due to illness or injury",
		topicGroup: 23,
	},
	{
		id: "prescription-medication-use-among-children",
		text: "Prescription medication use among children",
		topicGroup: 25,
	},
	{
		id: "receipt-of-influenza-vaccination-among-children",
		text: "Receipt of influenza vaccination among children",
		topicGroup: 26,
	},
	{
		id: "receive-services-for-mental-health-problems",
		text: "Receive services for mental health problems among children",
		indicator: "Receive services for mental health problems among children",
		topicGroup: 17,
	},
	{
		id: "receiving-special-education-or-early-intervention-services",
		text: "Receiving special education or early intervention services",
		topicGroup: 17,
	},
	{
		id: "two-or-more-hospital-emergency-department-visits-among-children",
		text: "Two or more hospital emergency department visits among children",
		topicGroup: 13,
	},
	{
		id: "two-or-more-urgent-care-center-or-retail-health-clinic-visits-among-children",
		text: "Two or more urgent care center or retail health clinic visits among children",
		topicGroup: 13,
	},
	{
		id: "uninsured-at-time-of-interview-among-children",
		text: "Uninsured at time of interview among children",
		topicGroup: 14,
	},
	{
		id: "well-child-check-up",
		text: "Well child check-up",
		topicGroup: 13,
	},
];

const NHAMCSChild = [
	{
		id: "by-reason-for-visit",
		text: "Emergency department visits by reason for visit",
		indicator: "By reason for visit",
		topicGroup: 13,
		subtopics: [
			{ id: "2", text: "All reasons (patient reported)" },
			{ id: "3", text: "Accident, not otherwise specified" },
			{ id: "4", text: "Back symptoms" },
			{ id: "6", text: "Chest pain and related symptoms (not referable to body systems)" },
			{ id: "7", text: "Cough" },
			{ id: "14", text: "Fever" },
			{ id: "15", text: "Headache, pain in head" },
			{ id: "18", text: "Other symptoms/problems related to psychological and mental disorders" },
			{ id: "19", text: "Pain, site not referable to a specific body system" },
			{ id: "20", text: "Shortness of breath" },
			{ id: "21", text: "Stomach and abdominal pain, cramps and spasms" },
		],
	},
	{
		id: "by-primary-diagnosis",
		text: "Emergency department visits by primary diagnosis",
		indicator: "By primary diagnosis",
		topicGroup: 13,
		subtopics: [
			{ id: "1", text: "All diagnoses" },
			{ id: "5", text: "Certain infectious and parasitic diseases" },
			{ id: "8", text: "Diseases of the circulatory system" },
			{ id: "9", text: "Diseases of the digestive system" },
			{ id: "10", text: "Diseases of the genitourinary system" },
			{ id: "11", text: "Diseases of the musculoskeletal system and connective tissue" },
			{ id: "12", text: "Diseases of the respiratory system" },
			{ id: "13", text: "Diseases of the skin and subcutaneous tissue" },
			{ id: "16", text: "Injury and poisoning" },
			{ id: "17", text: "Mental, behavioral, and neurodevelopmental disorders" },
			{ id: "22", text: "Symptoms, signs, and abnormal clinical and laboratory findings" },
		],
	},
];

// start NHANES chronic conditions
const NHANESChronic = [
	{ id: "obesity-nhanes", text: "Obesity, measured (NHANES)", indicator: "Obesity (NHANES)", topicGroup: 18 },
	{
		id: "high-total-cholesterol",
		indicator: "Obesity (NHANES)",
		text: "High cholesterol, total, measured (NHANES)",
		topicGroup: 4,
	},
	{ id: "hypertension", indicator: "Hypertension", text: "Hypertension, measured (NHANES)", topicGroup: 4 },
];

// start NHANES Dietary behaviors
const NHANESDietary = [
	{ id: "calcium-intake", text: "Calcium Intake", topicGroup: 10 },
	{ id: "dietary-fiber-intake", text: "Dietary Fiber Intake", topicGroup: 10 },
	{ id: "iron-intake", text: "Iron Intake", topicGroup: 10 },
	{ id: "potassium-intake", text: "Potassium Intake", topicGroup: 10 },
	{ id: "saturated-fat-intake", text: "Saturated Fat Intake", topicGroup: 10 },
	{ id: "sodium-intake", text: "Sodium Intake", topicGroup: 10 },
	{ id: "vitamin-d-intake", text: "Vitamin D Intake", topicGroup: 10 },
];

// NHANES oral health
const NHANESOralHealth = [
	{
		id: "total-dental-caries-in-primary-teeth",
		text: "Total Dental Caries in Primary Teeth",
		topicGroup: 19,
	},
	{
		id: "total-dental-caries-in-permanent-teeth",
		text: "Total Dental Caries in Permanent Teeth",
		topicGroup: 19,
	},
	{
		id: "complete-tooth-loss",
		text: "Complete Tooth Loss",
		topicGroup: 19,
	},
	{
		id: "untreated-dental-caries-in-primary-teeth",
		text: "Untreated Dental Caries in Primary Teeth",
		topicGroup: 19,
	},
	{
		id: "untreated-dental-caries-in-permanent-teeth",
		text: "Untreated Dental Caries in Permanent Teeth",
		topicGroup: 19,
	},
];

// NHANES Infectious disease
const NHANESInfectious = [
	{
		id: "herpes-simplex-virus-type-1-hsv-1",
		text: "Herpes Simplex Virus Type 1 (HSV-1)",
		topicGroup: 15,
	},
	{
		id: "herpes-simplex-virus-type-2-hsv-2",
		text: "Herpes Simplex Virus Type 2 (HSV-2)",
		topicGroup: 15,
	},
];

// Wonder/HUS heart disease
const WONDERHUSHeartDisease = [
	{
		id: "death-rates-for-diseases-of-heart",
		indicator: "Death rates for diseases of heart",
		text: "Deaths from Heart Disease",
		topicGroup: 6,
	},
];

export const NHISTopics = [
	...NHISAdult.map((d) => ({
		...d,
		topicLookupKey: "NHIS",
		dataUrl: "https://data.cdc.gov/NCHS/DEV-DQS-NHIS-Adult-Summary-Statistics/4u68-shzr",
		dataSystem: "NHIS",
	})),
	...NHISChild.map((d) => ({
		...d,
		topicLookupKey: "children-summary-statistics",
		dataUrl: "https://data.cdc.gov/dataset/DQS-NHIS-Child-Summary-Health-Statistics/rkv8-xf9z",
		dataSystem: "NHIS",
	})),
	...NHAMCSChild.map((d) => ({
		...d,
		topicLookupKey: "NHAMCS",
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Estimates-of-Emergency-Department-Visits-in-th/pcav-mejc",
		dataSystem: "NHAMCS",
	})),
	...NHANESChronic.map((d) => ({
		...d,
		dataSystem: "NHANES",
		topicLookupKey: "nhanes-chronic-conditions",
		dataUrl: "https://data.cdc.gov/NCHS/DQS-NHANES-Select-Chronic-Conditions-Prevalence-Es/i2dc-ja7d",
	})),
	...NHANESDietary.map((d) => ({
		...d,
		dataSystem: "NHANES",
		topicLookupKey: "nhanes-dietary-behaviors",
		dataUrl: "https://data.cdc.gov/dataset/DQS-NHANES-Select-Mean-Dietary-Intake-Estimates/j4m9-2puq",
	})),
	...NHANESOralHealth.map((d) => ({
		...d,
		dataSystem: "NHANES",
		topicLookupKey: "nhanes-oral-health",
		dataUrl: "https://data.cdc.gov/NCHS/DQS-NHANES-Select-Oral-Health-Prevalence-Estimates/i3dq-buv5",
	})),
	...NHANESInfectious.map((d) => ({
		...d,
		dataSystem: "NHANES",
		topicLookupKey: "nhanes-infectious-disease",
		dataUrl: "https://data.cdc.gov/NCHS/DQS-NHANES-Select-Infectious-Diseases-Prevalence-E/fuy5-tcrb",
	})),
	...WONDERHUSHeartDisease.map((d) => ({
		...d,
		dataSystem: "HUS,NVSS",
		filters: ["HUS", "NVSS"],
		topicLookupKey: "wonder-hus-heart-disease",
		dataUrl: "https://data.cdc.gov/NCHS/DQS-Death-rates-for-heart-disease-by-sex-race-Hisp/w86r-2336",
	})),
];
