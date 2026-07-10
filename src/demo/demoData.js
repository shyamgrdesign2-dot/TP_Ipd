const DEMO_DOCTOR = {
  id: 9001,
  doctor_unique_id: "DEMO-DR-001",
  first_name: "Dr. Rajesh",
  last_name: "Sharma",
  mobile_no: "9876543210",
  email: "dr.sharma@demo.tatvacare.in",
  speciality: "Internal Medicine",
  degree: "MD, MBBS",
  clinic_name: "TatvaCare Demo Hospital",
  hospital_id: 1001,
  hospital_name: "TatvaCare Demo Hospital",
  clinics: [
    { id: 1001, name: "TatvaCare Demo Hospital", is_default: 1 },
  ],
  userSettingFlag: [],
  b2c: false,
  plan_name: "Premium",
  plan_expiry: "2027-12-31",
};

function makeMockJwt() {
  var header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  var payload = btoa(
    JSON.stringify({
      result: {
        id: DEMO_DOCTOR.id,
        doctor_unique_id: DEMO_DOCTOR.doctor_unique_id,
        mobile_no: DEMO_DOCTOR.mobile_no,
        first_name: DEMO_DOCTOR.first_name,
        last_name: DEMO_DOCTOR.last_name,
        hospital_id: DEMO_DOCTOR.hospital_id,
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 365,
    })
  );
  var sig = btoa("demo-signature");
  return header + "." + payload + "." + sig;
}

var MOCK_PATIENTS = [
  {
    id: "p1",
    admissionId: "ADM-2026-001",
    admission_id: "ADM-2026-001",
    patientId: "PAT-001",
    patient_id: "PAT-001",
    uhid: "UHID-10045",
    first_name: "Anil",
    last_name: "Kapoor",
    name: "Anil Kapoor",
    age: 62,
    gender: "Male",
    mobile: "9812345001",
    ward: "General Ward A",
    ward_name: "General Ward A",
    bed: "GW-A-12",
    bed_name: "GW-A-12",
    consultant: "Dr. Rajesh Sharma",
    consultant_name: "Dr. Rajesh Sharma",
    admittedOn: "2026-07-05T10:30:00Z",
    admitted_on: "2026-07-05T10:30:00Z",
    admission_date: "2026-07-05",
    primary_diagnosis: "Community Acquired Pneumonia",
    status: "admitted",
    discharge_info: null,
  },
  {
    id: "p2",
    admissionId: "ADM-2026-002",
    admission_id: "ADM-2026-002",
    patientId: "PAT-002",
    patient_id: "PAT-002",
    uhid: "UHID-10046",
    first_name: "Sunita",
    last_name: "Deshmukh",
    name: "Sunita Deshmukh",
    age: 45,
    gender: "Female",
    mobile: "9812345002",
    ward: "ICU",
    ward_name: "ICU",
    bed: "ICU-04",
    bed_name: "ICU-04",
    consultant: "Dr. Rajesh Sharma",
    consultant_name: "Dr. Rajesh Sharma",
    admittedOn: "2026-07-07T14:00:00Z",
    admitted_on: "2026-07-07T14:00:00Z",
    admission_date: "2026-07-07",
    primary_diagnosis: "Diabetic Ketoacidosis",
    status: "admitted",
    discharge_info: null,
  },
  {
    id: "p3",
    admissionId: "ADM-2026-003",
    admission_id: "ADM-2026-003",
    patientId: "PAT-003",
    patient_id: "PAT-003",
    uhid: "UHID-10047",
    first_name: "Ramesh",
    last_name: "Patel",
    name: "Ramesh Patel",
    age: 71,
    gender: "Male",
    mobile: "9812345003",
    ward: "General Ward B",
    ward_name: "General Ward B",
    bed: "GW-B-08",
    bed_name: "GW-B-08",
    consultant: "Dr. Rajesh Sharma",
    consultant_name: "Dr. Rajesh Sharma",
    admittedOn: "2026-07-08T09:15:00Z",
    admitted_on: "2026-07-08T09:15:00Z",
    admission_date: "2026-07-08",
    primary_diagnosis: "Acute Exacerbation of COPD",
    status: "admitted",
    discharge_info: null,
  },
  {
    id: "p4",
    admissionId: "ADM-2026-004",
    admission_id: "ADM-2026-004",
    patientId: "PAT-004",
    patient_id: "PAT-004",
    uhid: "UHID-10048",
    first_name: "Priya",
    last_name: "Nair",
    name: "Priya Nair",
    age: 34,
    gender: "Female",
    mobile: "9812345004",
    ward: "Maternity Ward",
    ward_name: "Maternity Ward",
    bed: "MW-02",
    bed_name: "MW-02",
    consultant: "Dr. Rajesh Sharma",
    consultant_name: "Dr. Rajesh Sharma",
    admittedOn: "2026-07-09T16:45:00Z",
    admitted_on: "2026-07-09T16:45:00Z",
    admission_date: "2026-07-09",
    primary_diagnosis: "Pre-eclampsia, mild",
    status: "admitted",
    discharge_info: null,
  },
  {
    id: "p5",
    admissionId: "ADM-2026-005",
    admission_id: "ADM-2026-005",
    patientId: "PAT-005",
    patient_id: "PAT-005",
    uhid: "UHID-10049",
    first_name: "Vikram",
    last_name: "Singh",
    name: "Vikram Singh",
    age: 55,
    gender: "Male",
    mobile: "9812345005",
    ward: "Surgical Ward",
    ward_name: "Surgical Ward",
    bed: "SW-06",
    bed_name: "SW-06",
    consultant: "Dr. Rajesh Sharma",
    consultant_name: "Dr. Rajesh Sharma",
    admittedOn: "2026-07-06T08:00:00Z",
    admitted_on: "2026-07-06T08:00:00Z",
    admission_date: "2026-07-06",
    primary_diagnosis: "Post Laparoscopic Cholecystectomy",
    status: "admitted",
    discharge_info: null,
  },
];

var MOCK_VITALS = {
  "PAT-001": {
    latest: {
      temperature: 101.2,
      heart_rate: 98,
      spo2: 93,
      respiratory_rate: 24,
      systolic_bp: 128,
      diastolic_bp: 82,
      blood_sugar: 142,
      recorded_at: "2026-07-10T06:30:00Z",
    },
    trend: [
      { temperature: 102.4, heart_rate: 110, spo2: 91, respiratory_rate: 28, systolic_bp: 135, diastolic_bp: 88, blood_sugar: 156, recorded_at: "2026-07-09T18:00:00Z" },
      { temperature: 101.8, heart_rate: 105, spo2: 92, respiratory_rate: 26, systolic_bp: 130, diastolic_bp: 85, blood_sugar: 148, recorded_at: "2026-07-10T00:00:00Z" },
      { temperature: 101.2, heart_rate: 98, spo2: 93, respiratory_rate: 24, systolic_bp: 128, diastolic_bp: 82, blood_sugar: 142, recorded_at: "2026-07-10T06:30:00Z" },
    ],
  },
  "PAT-002": {
    latest: {
      temperature: 99.1,
      heart_rate: 118,
      spo2: 88,
      respiratory_rate: 30,
      systolic_bp: 88,
      diastolic_bp: 54,
      blood_sugar: 428,
      recorded_at: "2026-07-10T07:00:00Z",
    },
    trend: [
      { temperature: 99.8, heart_rate: 132, spo2: 85, respiratory_rate: 34, systolic_bp: 82, diastolic_bp: 48, blood_sugar: 520, recorded_at: "2026-07-09T14:00:00Z" },
      { temperature: 99.4, heart_rate: 125, spo2: 87, respiratory_rate: 32, systolic_bp: 85, diastolic_bp: 50, blood_sugar: 480, recorded_at: "2026-07-09T20:00:00Z" },
      { temperature: 99.1, heart_rate: 118, spo2: 88, respiratory_rate: 30, systolic_bp: 88, diastolic_bp: 54, blood_sugar: 428, recorded_at: "2026-07-10T07:00:00Z" },
    ],
  },
  "PAT-003": {
    latest: {
      temperature: 98.6,
      heart_rate: 82,
      spo2: 89,
      respiratory_rate: 22,
      systolic_bp: 145,
      diastolic_bp: 92,
      blood_sugar: 108,
      recorded_at: "2026-07-10T05:45:00Z",
    },
    trend: [
      { temperature: 99.0, heart_rate: 88, spo2: 87, respiratory_rate: 26, systolic_bp: 152, diastolic_bp: 96, blood_sugar: 115, recorded_at: "2026-07-09T12:00:00Z" },
      { temperature: 98.8, heart_rate: 85, spo2: 88, respiratory_rate: 24, systolic_bp: 148, diastolic_bp: 94, blood_sugar: 112, recorded_at: "2026-07-09T22:00:00Z" },
      { temperature: 98.6, heart_rate: 82, spo2: 89, respiratory_rate: 22, systolic_bp: 145, diastolic_bp: 92, blood_sugar: 108, recorded_at: "2026-07-10T05:45:00Z" },
    ],
  },
};

var MOCK_MAR = {
  "PAT-001": [
    { drug: "Ceftriaxone 1g IV", frequency: "BD", lastGiven: "2026-07-10T06:00:00Z", nextDue: "2026-07-10T18:00:00Z", status: "given" },
    { drug: "Paracetamol 650mg PO", frequency: "TDS", lastGiven: "2026-07-10T06:00:00Z", nextDue: "2026-07-10T14:00:00Z", status: "given" },
    { drug: "Nebulization (Salbutamol + Ipratropium)", frequency: "QID", lastGiven: "2026-07-10T06:00:00Z", nextDue: "2026-07-10T12:00:00Z", status: "given" },
    { drug: "Pantoprazole 40mg IV", frequency: "OD", lastGiven: "2026-07-10T06:00:00Z", nextDue: "2026-07-11T06:00:00Z", status: "given" },
  ],
  "PAT-002": [
    { drug: "Insulin Infusion (Actrapid)", frequency: "Continuous", lastGiven: "2026-07-10T07:00:00Z", nextDue: null, status: "running", rate: "6 units/hr" },
    { drug: "NS 0.9% IV", frequency: "Continuous", lastGiven: "2026-07-10T04:00:00Z", nextDue: null, status: "running", rate: "200 ml/hr" },
    { drug: "KCl 20 mEq in 100ml NS", frequency: "Stat", lastGiven: "2026-07-10T05:00:00Z", nextDue: null, status: "given" },
    { drug: "Enoxaparin 40mg SC", frequency: "OD", lastGiven: "2026-07-10T06:00:00Z", nextDue: "2026-07-11T06:00:00Z", status: "given" },
  ],
};

var MOCK_FLUID = {
  "PAT-001": { intake: 2400, output: 1800, net: 600, period: "24h" },
  "PAT-002": { intake: 4200, output: 2100, net: 2100, period: "24h" },
  "PAT-003": { intake: 1800, output: 1600, net: 200, period: "24h" },
};

var MOCK_LABS = {
  "PAT-001": [
    { test: "WBC", value: 14.2, unit: "x10^3/uL", refRange: "4.5-11.0", flag: "H", recordedAt: "2026-07-10T04:00:00Z" },
    { test: "CRP", value: 86, unit: "mg/L", refRange: "<10", flag: "H", recordedAt: "2026-07-10T04:00:00Z" },
    { test: "Procalcitonin", value: 2.8, unit: "ng/mL", refRange: "<0.5", flag: "H", recordedAt: "2026-07-10T04:00:00Z" },
  ],
  "PAT-002": [
    { test: "Blood Glucose", value: 428, unit: "mg/dL", refRange: "70-110", flag: "H", recordedAt: "2026-07-10T07:00:00Z" },
    { test: "HbA1c", value: 12.4, unit: "%", refRange: "<6.5", flag: "H", recordedAt: "2026-07-09T10:00:00Z" },
    { test: "Potassium", value: 3.1, unit: "mEq/L", refRange: "3.5-5.0", flag: "L", recordedAt: "2026-07-10T05:00:00Z" },
    { test: "Arterial pH", value: 7.18, unit: "", refRange: "7.35-7.45", flag: "L", recordedAt: "2026-07-10T07:00:00Z" },
  ],
  "PAT-003": [
    { test: "ABG pO2", value: 58, unit: "mmHg", refRange: "80-100", flag: "L", recordedAt: "2026-07-10T05:00:00Z" },
    { test: "ABG pCO2", value: 52, unit: "mmHg", refRange: "35-45", flag: "H", recordedAt: "2026-07-10T05:00:00Z" },
  ],
};

var MOCK_RISK_SCORES = {
  "PAT-001": [
    { scale: "Braden", score: 16, maxScore: 23, risk: "Mild", recordedAt: "2026-07-10T06:00:00Z" },
    { scale: "Fall Risk (Morse)", score: 35, maxScore: 125, risk: "Low", recordedAt: "2026-07-10T06:00:00Z" },
  ],
  "PAT-002": [
    { scale: "Braden", score: 11, maxScore: 23, risk: "High", recordedAt: "2026-07-10T07:00:00Z" },
    { scale: "Fall Risk (Morse)", score: 75, maxScore: 125, risk: "High", recordedAt: "2026-07-10T07:00:00Z" },
    { scale: "qSOFA", score: 2, maxScore: 3, risk: "High", recordedAt: "2026-07-10T07:00:00Z" },
  ],
  "PAT-003": [
    { scale: "Braden", score: 14, maxScore: 23, risk: "Moderate", recordedAt: "2026-07-10T05:00:00Z" },
    { scale: "Fall Risk (Morse)", score: 55, maxScore: 125, risk: "Moderate", recordedAt: "2026-07-10T05:00:00Z" },
  ],
};

var MOCK_NURSING_NOTES = {
  "PAT-001": [
    { note: "Patient resting comfortably. O2 via nasal cannula at 4L/min. SpO2 maintaining 93%. Fever trending down. Cough productive with yellowish sputum.", author: "Nurse Meena", recordedAt: "2026-07-10T06:30:00Z" },
    { note: "IV antibiotics administered on time. Patient tolerated well. Oral intake improved, had breakfast.", author: "Nurse Meena", recordedAt: "2026-07-10T08:00:00Z" },
  ],
  "PAT-002": [
    { note: "CRITICAL: Patient on insulin drip, titrating as per DKA protocol. Current rate 6 units/hr. Blood sugar 428 (down from 520). Still acidotic, pH 7.18. Potassium 3.1, replacement started. GCS 14/15 (E4V4M6). Strict I/O charting.", author: "Nurse Anitha", recordedAt: "2026-07-10T07:00:00Z" },
    { note: "Hourly glucose monitoring in progress. Patient awake, oriented. Complains of mild abdominal pain. NS infusion running at 200ml/hr.", author: "Nurse Anitha", recordedAt: "2026-07-10T08:00:00Z" },
  ],
  "PAT-003": [
    { note: "Patient on 2L O2 via nasal prongs. SpO2 89% on room air, improves to 93% on O2. Wheezing heard bilaterally. Nebulization given, slight improvement noted.", author: "Nurse Rekha", recordedAt: "2026-07-10T05:45:00Z" },
  ],
};

export {
  DEMO_DOCTOR,
  makeMockJwt,
  MOCK_PATIENTS,
  MOCK_VITALS,
  MOCK_MAR,
  MOCK_FLUID,
  MOCK_LABS,
  MOCK_RISK_SCORES,
  MOCK_NURSING_NOTES,
};
