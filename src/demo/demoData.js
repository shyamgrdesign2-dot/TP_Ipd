var DEMO_DOCTOR = {
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
  hospital_data: [
    { hm_id: 1001, hm_name: "TatvaCare Demo Hospital" },
  ],
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
        clinic_id: DEMO_DOCTOR.hospital_id,
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
    _id: "demo-adm-001",
    admissionId: "ADM-2026-001",
    admissionNo: "ADM-001",
    mrno: "UHID-10045",
    details: { id: "PAT-001", name: "Anil Kapoor", gender: "Male", age: 62, contact: "+91-9812345001" },
    ward: { id: 1, title: "General Ward A" },
    room: { id: 12, title: "GW-A-12" },
    doctor: { id: 9001, name: "Dr. Rajesh Sharma" },
    admittedOn: "2026-07-05T10:30:00Z",
    isDischarged: false,
    isIntimateDischarged: false,
    referral: false,
  },
  {
    _id: "demo-adm-002",
    admissionId: "ADM-2026-002",
    admissionNo: "ADM-002",
    mrno: "UHID-10046",
    details: { id: "PAT-002", name: "Sunita Deshmukh", gender: "Female", age: 45, contact: "+91-9812345002" },
    ward: { id: 2, title: "ICU" },
    room: { id: 4, title: "ICU-04" },
    doctor: { id: 9001, name: "Dr. Rajesh Sharma" },
    admittedOn: "2026-07-07T14:00:00Z",
    isDischarged: false,
    isIntimateDischarged: false,
    referral: false,
  },
  {
    _id: "demo-adm-003",
    admissionId: "ADM-2026-003",
    admissionNo: "ADM-003",
    mrno: "UHID-10047",
    details: { id: "PAT-003", name: "Ramesh Patel", gender: "Male", age: 71, contact: "+91-9812345003" },
    ward: { id: 3, title: "General Ward B" },
    room: { id: 8, title: "GW-B-08" },
    doctor: { id: 9001, name: "Dr. Rajesh Sharma" },
    admittedOn: "2026-07-08T09:15:00Z",
    isDischarged: false,
    isIntimateDischarged: false,
    referral: false,
  },
  {
    _id: "demo-adm-004",
    admissionId: "ADM-2026-004",
    admissionNo: "ADM-004",
    mrno: "UHID-10048",
    details: { id: "PAT-004", name: "Priya Nair", gender: "Female", age: 34, contact: "+91-9812345004" },
    ward: { id: 4, title: "Maternity Ward" },
    room: { id: 2, title: "MW-02" },
    doctor: { id: 9001, name: "Dr. Rajesh Sharma" },
    admittedOn: "2026-07-09T16:45:00Z",
    isDischarged: false,
    isIntimateDischarged: false,
    referral: false,
  },
  {
    _id: "demo-adm-005",
    admissionId: "ADM-2026-005",
    admissionNo: "ADM-005",
    mrno: "UHID-10049",
    details: { id: "PAT-005", name: "Vikram Singh", gender: "Male", age: 55, contact: "+91-9812345005" },
    ward: { id: 5, title: "Surgical Ward" },
    room: { id: 6, title: "SW-06" },
    doctor: { id: 9001, name: "Dr. Rajesh Sharma" },
    admittedOn: "2026-07-06T08:00:00Z",
    isDischarged: false,
    isIntimateDischarged: false,
    referral: false,
  },
];

// ─── Vitals (camelCase for card builders) ────────────────────────────────────
var MOCK_VITALS = {
  "PAT-001": {
    latest: {
      temperature: 101.2, heartRate: 98, spo2: 93, respiratoryRate: 24,
      systolicBP: 128, diastolicBP: 82, bloodSugar: 142,
      recordedAt: "2026-07-10T06:30:00Z", recordedBy: "Nurse Meena",
    },
    trend: [
      { temperature: 102.4, heartRate: 110, spo2: 91, respiratoryRate: 28, systolicBP: 135, diastolicBP: 88, bloodSugar: 156, recordedAt: "2026-07-09T18:00:00Z" },
      { temperature: 101.8, heartRate: 105, spo2: 92, respiratoryRate: 26, systolicBP: 130, diastolicBP: 85, bloodSugar: 148, recordedAt: "2026-07-10T00:00:00Z" },
      { temperature: 101.2, heartRate: 98, spo2: 93, respiratoryRate: 24, systolicBP: 128, diastolicBP: 82, bloodSugar: 142, recordedAt: "2026-07-10T06:30:00Z" },
    ],
  },
  "PAT-002": {
    latest: {
      temperature: 99.1, heartRate: 118, spo2: 88, respiratoryRate: 30,
      systolicBP: 88, diastolicBP: 54, bloodSugar: 428,
      recordedAt: "2026-07-10T07:00:00Z", recordedBy: "Nurse Anitha",
    },
    trend: [
      { temperature: 99.8, heartRate: 132, spo2: 85, respiratoryRate: 34, systolicBP: 82, diastolicBP: 48, bloodSugar: 520, recordedAt: "2026-07-09T14:00:00Z" },
      { temperature: 99.4, heartRate: 125, spo2: 87, respiratoryRate: 32, systolicBP: 85, diastolicBP: 50, bloodSugar: 480, recordedAt: "2026-07-09T20:00:00Z" },
      { temperature: 99.1, heartRate: 118, spo2: 88, respiratoryRate: 30, systolicBP: 88, diastolicBP: 54, bloodSugar: 428, recordedAt: "2026-07-10T07:00:00Z" },
    ],
  },
  "PAT-003": {
    latest: {
      temperature: 98.6, heartRate: 82, spo2: 89, respiratoryRate: 22,
      systolicBP: 145, diastolicBP: 92, bloodSugar: 108,
      recordedAt: "2026-07-10T05:45:00Z", recordedBy: "Nurse Rekha",
    },
    trend: [
      { temperature: 99.0, heartRate: 88, spo2: 87, respiratoryRate: 26, systolicBP: 152, diastolicBP: 96, bloodSugar: 115, recordedAt: "2026-07-09T12:00:00Z" },
      { temperature: 98.8, heartRate: 85, spo2: 88, respiratoryRate: 24, systolicBP: 148, diastolicBP: 94, bloodSugar: 112, recordedAt: "2026-07-09T22:00:00Z" },
      { temperature: 98.6, heartRate: 82, spo2: 89, respiratoryRate: 22, systolicBP: 145, diastolicBP: 92, bloodSugar: 108, recordedAt: "2026-07-10T05:45:00Z" },
    ],
  },
  "PAT-004": {
    latest: {
      temperature: 98.4, heartRate: 78, spo2: 98, respiratoryRate: 18,
      systolicBP: 118, diastolicBP: 72, bloodSugar: 92,
      recordedAt: "2026-07-10T06:00:00Z", recordedBy: "Nurse Lakshmi",
    },
    trend: [
      { temperature: 98.6, heartRate: 82, spo2: 97, respiratoryRate: 20, systolicBP: 122, diastolicBP: 76, bloodSugar: 96, recordedAt: "2026-07-09T18:00:00Z" },
      { temperature: 98.4, heartRate: 78, spo2: 98, respiratoryRate: 18, systolicBP: 118, diastolicBP: 72, bloodSugar: 92, recordedAt: "2026-07-10T06:00:00Z" },
    ],
  },
  "PAT-005": {
    latest: {
      temperature: 99.8, heartRate: 92, spo2: 96, respiratoryRate: 20,
      systolicBP: 134, diastolicBP: 86, bloodSugar: 118,
      recordedAt: "2026-07-10T06:15:00Z", recordedBy: "Nurse Divya",
    },
    trend: [
      { temperature: 100.2, heartRate: 96, spo2: 95, respiratoryRate: 22, systolicBP: 138, diastolicBP: 88, bloodSugar: 124, recordedAt: "2026-07-09T06:00:00Z" },
      { temperature: 100.0, heartRate: 94, spo2: 95, respiratoryRate: 21, systolicBP: 136, diastolicBP: 87, bloodSugar: 120, recordedAt: "2026-07-09T18:00:00Z" },
      { temperature: 99.8, heartRate: 92, spo2: 96, respiratoryRate: 20, systolicBP: 134, diastolicBP: 86, bloodSugar: 118, recordedAt: "2026-07-10T06:15:00Z" },
    ],
  },
};

// ─── MAR (card builders expect drugName, dose, route, frequency, status) ─────
var MOCK_MAR = {
  "PAT-001": [
    { drugName: "Ceftriaxone", dose: "1g", route: "IV", frequency: "BD", status: "ADMINISTERED" },
    { drugName: "Paracetamol", dose: "650mg", route: "PO", frequency: "TDS", status: "ADMINISTERED" },
    { drugName: "Nebulization (Salbutamol + Ipratropium)", dose: "2.5mg+500mcg", route: "INH", frequency: "QID", status: "ADMINISTERED" },
    { drugName: "Pantoprazole", dose: "40mg", route: "IV", frequency: "OD", status: "ADMINISTERED" },
  ],
  "PAT-002": [
    { drugName: "Insulin Infusion (Actrapid)", dose: "6 units/hr", route: "IV", frequency: "Continuous", status: "ADMINISTERED" },
    { drugName: "Normal Saline 0.9%", dose: "200 ml/hr", route: "IV", frequency: "Continuous", status: "ADMINISTERED" },
    { drugName: "KCl", dose: "20 mEq in 100ml NS", route: "IV", frequency: "Stat", status: "ADMINISTERED" },
    { drugName: "Enoxaparin", dose: "40mg", route: "SC", frequency: "OD", status: "ADMINISTERED" },
  ],
  "PAT-003": [
    { drugName: "Deriphylline", dose: "200mg", route: "IV", frequency: "BD", status: "ADMINISTERED" },
    { drugName: "Budesonide + Formoterol Neb", dose: "0.5mg+20mcg", route: "INH", frequency: "TDS", status: "ADMINISTERED" },
    { drugName: "Hydrocortisone", dose: "100mg", route: "IV", frequency: "TDS", status: "MISSED" },
    { drugName: "Amlodipine", dose: "5mg", route: "PO", frequency: "OD", status: "ADMINISTERED" },
  ],
  "PAT-004": [
    { drugName: "Iron Sucrose", dose: "200mg in 100ml NS", route: "IV", frequency: "OD", status: "ADMINISTERED" },
    { drugName: "Folic Acid", dose: "5mg", route: "PO", frequency: "OD", status: "ADMINISTERED" },
    { drugName: "Calcium + Vit D3", dose: "500mg+250IU", route: "PO", frequency: "BD", status: "ADMINISTERED" },
  ],
  "PAT-005": [
    { drugName: "Cefuroxime", dose: "1.5g", route: "IV", frequency: "BD", status: "ADMINISTERED" },
    { drugName: "Metronidazole", dose: "500mg", route: "IV", frequency: "TDS", status: "ADMINISTERED" },
    { drugName: "Tramadol", dose: "50mg", route: "IV", frequency: "TDS", status: "HELD" },
    { drugName: "Pantoprazole", dose: "40mg", route: "IV", frequency: "OD", status: "ADMINISTERED" },
    { drugName: "Enoxaparin", dose: "40mg", route: "SC", frequency: "OD", status: "ADMINISTERED" },
  ],
};

// ─── Fluid balance (card builders expect totalIntake, totalOutput, balance) ───
var MOCK_FLUID = {
  "PAT-001": { totalIntake: 2400, totalOutput: 1800, balance: 600, balanceDate: "2026-07-10" },
  "PAT-002": { totalIntake: 4200, totalOutput: 2100, balance: 2100, balanceDate: "2026-07-10" },
  "PAT-003": { totalIntake: 1800, totalOutput: 1600, balance: 200, balanceDate: "2026-07-10" },
  "PAT-004": { totalIntake: 2000, totalOutput: 1900, balance: 100, balanceDate: "2026-07-10" },
  "PAT-005": { totalIntake: 2800, totalOutput: 2200, balance: 600, balanceDate: "2026-07-10" },
};

// ─── Labs (card builders expect name, value, unit, refRange, flag, critical) ──
var MOCK_LABS = {
  "PAT-001": [
    { name: "WBC", value: 14.2, unit: "x10^3/uL", refRange: "4.5-11.0", flag: "high", critical: false },
    { name: "CRP", value: 86, unit: "mg/L", refRange: "<10", flag: "high", critical: true },
    { name: "Procalcitonin", value: 2.8, unit: "ng/mL", refRange: "<0.5", flag: "high", critical: true },
  ],
  "PAT-002": [
    { name: "Blood Glucose", value: 428, unit: "mg/dL", refRange: "70-110", flag: "high", critical: true },
    { name: "HbA1c", value: 12.4, unit: "%", refRange: "<6.5", flag: "high", critical: false },
    { name: "Potassium", value: 3.1, unit: "mEq/L", refRange: "3.5-5.0", flag: "low", critical: true },
    { name: "Arterial pH", value: 7.18, unit: "", refRange: "7.35-7.45", flag: "low", critical: true },
    { name: "Bicarbonate", value: 8.2, unit: "mEq/L", refRange: "22-26", flag: "low", critical: true },
  ],
  "PAT-003": [
    { name: "ABG pO2", value: 58, unit: "mmHg", refRange: "80-100", flag: "low", critical: true },
    { name: "ABG pCO2", value: 52, unit: "mmHg", refRange: "35-45", flag: "high", critical: false },
    { name: "D-Dimer", value: 1.8, unit: "mg/L", refRange: "<0.5", flag: "high", critical: false },
  ],
  "PAT-004": [
    { name: "Hemoglobin", value: 9.8, unit: "g/dL", refRange: "12.0-16.0", flag: "low", critical: false },
    { name: "Serum Ferritin", value: 8, unit: "ng/mL", refRange: "12-150", flag: "low", critical: false },
  ],
  "PAT-005": [
    { name: "WBC", value: 13.8, unit: "x10^3/uL", refRange: "4.5-11.0", flag: "high", critical: false },
    { name: "CRP", value: 42, unit: "mg/L", refRange: "<10", flag: "high", critical: false },
    { name: "Creatinine", value: 1.4, unit: "mg/dL", refRange: "0.7-1.3", flag: "high", critical: false },
  ],
};

// ─── Risk scores (card builders expect key, label, value) ────────────────────
var MOCK_RISK_SCORES = {
  "PAT-001": [
    { key: "braden", label: "Braden Scale", value: 16 },
    { key: "fall", label: "Fall Risk (Morse)", value: 35 },
  ],
  "PAT-002": [
    { key: "braden", label: "Braden Scale", value: 11 },
    { key: "fall", label: "Fall Risk (Morse)", value: 75 },
    { key: "qsofa", label: "qSOFA", value: 2 },
  ],
  "PAT-003": [
    { key: "braden", label: "Braden Scale", value: 14 },
    { key: "fall", label: "Fall Risk (Morse)", value: 55 },
  ],
  "PAT-004": [
    { key: "braden", label: "Braden Scale", value: 20 },
    { key: "fall", label: "Fall Risk (Morse)", value: 15 },
  ],
  "PAT-005": [
    { key: "braden", label: "Braden Scale", value: 15 },
    { key: "fall", label: "Fall Risk (Morse)", value: 45 },
  ],
};

// ─── Nursing notes (card builders expect nursingPlan, generalCondition, shiftType, recordedBy, recordedAt) ──
var MOCK_NURSING_NOTES = {
  "PAT-001": [
    { nursingPlan: "Continue IV antibiotics, monitor fever curve. O2 via nasal cannula at 4L/min. SpO2 maintaining 93%. Cough productive with yellowish sputum. Encourage deep breathing exercises.", generalCondition: "Conscious, oriented, febrile", shiftType: "Morning", recordedBy: "Nurse Meena", recordedAt: "2026-07-10T06:30:00Z" },
    { nursingPlan: "IV antibiotics administered on time. Patient tolerated well. Oral intake improved, had breakfast. Continue monitoring vitals 4-hourly.", generalCondition: "Stable, appetite improving", shiftType: "Morning", recordedBy: "Nurse Meena", recordedAt: "2026-07-10T08:00:00Z" },
  ],
  "PAT-002": [
    { nursingPlan: "CRITICAL: Patient on insulin drip, titrating as per DKA protocol. Current rate 6 units/hr. Blood sugar 428 (down from 520). Still acidotic, pH 7.18. Potassium 3.1, replacement started. Strict I/O charting.", generalCondition: "Drowsy but arousable, GCS 14/15", shiftType: "Morning", recordedBy: "Nurse Anitha", recordedAt: "2026-07-10T07:00:00Z" },
    { nursingPlan: "Hourly glucose monitoring in progress. Patient awake, oriented. Complains of mild abdominal pain. NS infusion running at 200ml/hr. Continue potassium replacement.", generalCondition: "Improving, more alert", shiftType: "Morning", recordedBy: "Nurse Anitha", recordedAt: "2026-07-10T08:00:00Z" },
  ],
  "PAT-003": [
    { nursingPlan: "Patient on 2L O2 via nasal prongs. SpO2 89% on room air, improves to 93% on O2. Wheezing heard bilaterally. Nebulization given, slight improvement noted. Monitor respiratory status closely.", generalCondition: "Dyspneic at rest, using accessory muscles", shiftType: "Night", recordedBy: "Nurse Rekha", recordedAt: "2026-07-10T05:45:00Z" },
  ],
  "PAT-004": [
    { nursingPlan: "Post-delivery Day 1. Vitals stable. Lochia normal. Breastfeeding initiated, latching well. Iron infusion to be given today. Encourage ambulation.", generalCondition: "Comfortable, bonding with baby", shiftType: "Morning", recordedBy: "Nurse Lakshmi", recordedAt: "2026-07-10T06:00:00Z" },
  ],
  "PAT-005": [
    { nursingPlan: "Post-op Day 4 (Laparoscopic cholecystectomy). Drain output minimal (15ml serosanguinous). Wound site clean, no signs of infection. Pain managed with IV Tramadol - to be reviewed. Tolerating soft diet.", generalCondition: "Stable, ambulant with support", shiftType: "Morning", recordedBy: "Nurse Divya", recordedAt: "2026-07-10T06:15:00Z" },
    { nursingPlan: "Patient complaining of mild nausea after meals. Anti-emetic given. Drain to be reviewed for removal. Continue antibiotics.", generalCondition: "Stable, mild nausea", shiftType: "Evening", recordedBy: "Nurse Priya", recordedAt: "2026-07-09T18:00:00Z" },
  ],
};

// ─── Ward tasks (for Dr. Agent list view) ────────────────────────────────────
// Shape: { patientId, patientName, bed, title, summary, priority, kind }
var MOCK_WARD_TASKS = [
  // Urgent
  { patientId: "PAT-002", patientName: "Sunita Deshmukh", bed: "ICU-04", title: "DKA protocol review", summary: "Blood sugar 428, pH 7.18, K+ 3.1. Insulin drip at 6u/hr. Review electrolytes and adjust.", priority: "Urgent", kind: "Labs" },
  { patientId: "PAT-002", patientName: "Sunita Deshmukh", bed: "ICU-04", title: "Potassium replacement", summary: "K+ 3.1 mEq/L (critical low). 20 mEq KCl started. Repeat levels in 2 hours.", priority: "Urgent", kind: "Labs" },
  { patientId: "PAT-003", patientName: "Ramesh Patel", bed: "GW-B-08", title: "Missed dose: Hydrocortisone", summary: "100mg IV TDS - morning dose missed. Nurse reports patient was in radiology.", priority: "Urgent", kind: "Meds" },
  // Referrals today
  { patientId: "PAT-001", patientName: "Anil Kapoor", bed: "GW-A-12", title: "Referral: Pulmonology consult pending", summary: "Referred to Dr. Anand Kulkarni (Pulmonology) today. Pneumonia not responding to Ceftriaxone after 5 days. Awaiting pulmonology review.", priority: "Today", kind: "Referral" },
  { patientId: "PAT-003", patientName: "Ramesh Patel", bed: "GW-B-08", title: "Referral: Pulmonology consult pending", summary: "Referred to Dr. Anand Kulkarni (Pulmonology) today. COPD exacerbation with Type 2 respiratory failure. BiPAP consideration pending.", priority: "Today", kind: "Referral" },
  // Flagged labs
  { patientId: "PAT-001", patientName: "Anil Kapoor", bed: "GW-A-12", title: "Flagged labs: CRP 86, PCT 2.8", summary: "CRP 86 mg/L (critical high), Procalcitonin 2.8 ng/mL (high). Inflammatory markers not improving. Consider blood culture and antibiotic escalation.", priority: "Today", kind: "Labs" },
  { patientId: "PAT-003", patientName: "Ramesh Patel", bed: "GW-B-08", title: "Flagged labs: ABG concerning", summary: "SpO2 89% on room air. ABG: pO2 58 (low), pCO2 52 (high). Type 2 respiratory failure. Review O2 and BiPAP.", priority: "Today", kind: "Labs" },
  // OT schedule
  { patientId: "PAT-005", patientName: "Vikram Singh", bed: "SW-06", title: "Post-op Day 4: Drain removal due", summary: "Lap Chole (6 Jul). Drain output 15ml (minimal). Pre-op checklist complete, vitals stable. Consider drain removal today.", priority: "Today", kind: "OT" },
  // Meds
  { patientId: "PAT-005", patientName: "Vikram Singh", bed: "SW-06", title: "Held dose: Tramadol", summary: "50mg IV TDS held by nurse due to nausea. Switching to oral Paracetamol + Aceclofenac per consultant note.", priority: "Today", kind: "Meds" },
  // Info
  { patientId: "PAT-001", patientName: "Anil Kapoor", bed: "GW-A-12", title: "Repeat blood culture", summary: "Day 5 of antibiotics, fever persisting. Consider repeat cultures before escalation.", priority: "Today", kind: "Labs" },
  { patientId: "PAT-004", patientName: "Priya Nair", bed: "MW-02", title: "Anemia correction", summary: "Hb 9.8 g/dL, Ferritin 8. Iron sucrose infusion scheduled today. Check for transfusion need.", priority: "Info", kind: "Labs" },
  { patientId: "PAT-002", patientName: "Sunita Deshmukh", bed: "ICU-04", title: "Referral: Endocrinology reviewed", summary: "Dr. Sanjay Mehta (Endocrinology) reviewed yesterday. DKA resolving, pH 7.28. Plan transition to SC insulin. Follow-up in OPD 18 Jul.", priority: "Info", kind: "Referral" },
];

// ─── Progress timeline (for Dr. Agent patient view) ──────────────────────────
var MOCK_PROGRESS_TIMELINE = {
  "ADM-2026-001": {
    consultant: "Dr. Rajesh Sharma",
    lastConsultantNoteAt: "2026-07-09T10:00:00Z",
    nursing: [
      {
        recordedAt: "2026-07-10T06:30:00Z", author: "Nurse Meena", role: "Nurse", shiftType: "Morning",
        vitals: { bp: "128/82", hr: 98, rr: 24, spo2: 93, temp: 101.2 },
        fields: [
          { label: "General Condition", value: "Conscious, oriented, febrile. Resting comfortably. Oral intake improving." },
          { label: "Respiratory", value: "O2 via nasal cannula 4L/min. Bilateral creps in lower zones. Productive cough, yellowish sputum." },
          { label: "IV Lines", value: "Right forearm IV patent, no signs of phlebitis. Due for change tomorrow." },
          { label: "Diet", value: "Tolerating soft diet. Oral intake improved since yesterday." },
        ],
      },
      {
        recordedAt: "2026-07-09T22:00:00Z", author: "Nurse Sunita", role: "Nurse", shiftType: "Night",
        vitals: { bp: "130/85", hr: 105, rr: 26, spo2: 92, temp: 101.8 },
        fields: [
          { label: "General Condition", value: "Restless due to fever. Sponging done. Took oral fluids." },
          { label: "Respiratory", value: "Increased work of breathing during fever spike. Settled after antipyretic. SpO2 dipped to 91%, O2 increased to 4L." },
          { label: "Monitoring", value: "Fever spike to 102.4F at 18:00. Paracetamol given, came down to 101.8. Hourly SpO2 monitoring." },
        ],
      },
    ],
    mo: [
      {
        recordedAt: "2026-07-10T08:30:00Z", author: "Dr. Priya Mehta", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "128/82", hr: 98, rr: 24, spo2: 93, temp: 101.2 },
        fields: [
          { label: "Chief Complaint", value: "Persistent fever Day 5. Cough improving but still productive. Appetite better." },
          { label: "Findings", value: "Febrile 101.2F. Bilateral basal creps, reduced compared to admission. SpO2 93% on 4L O2. No new findings on examination." },
          { label: "Additional Remarks", value: "CAP Day 5, slow response to Ceftriaxone. CRP 86, PCT 2.8 still elevated. Send repeat blood culture. Add Azithromycin 500mg IV OD if no improvement by evening. Repeat CRP tomorrow." },
        ],
      },
      {
        recordedAt: "2026-07-09T20:00:00Z", author: "Dr. Priya Mehta", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "130/85", hr: 105, rr: 26, spo2: 92, temp: 101.8 },
        fields: [
          { label: "Chief Complaint", value: "High-grade fever spike to 102.4F at 18:00. Breathlessness increased." },
          { label: "Findings", value: "Febrile, tachycardic. Bilateral creps in lower zones, no change. SpO2 dipped to 91%, increased O2 to 4L." },
          { label: "Additional Remarks", value: "Fever spike likely disease progression. Paracetamol given. Increase O2 to 4L. Monitor SpO2 hourly. Consider escalation if no response to current antibiotics by morning round." },
        ],
      },
    ],
  },
  "ADM-2026-002": {
    consultant: "Dr. Rajesh Sharma",
    lastConsultantNoteAt: "2026-07-09T16:00:00Z",
    nursing: [
      {
        recordedAt: "2026-07-10T07:00:00Z", author: "Nurse Anitha", role: "Nurse", shiftType: "Morning",
        vitals: { bp: "88/54", hr: 118, rr: 30, spo2: 88, temp: 99.1 },
        fields: [
          { label: "General Condition", value: "Drowsy but arousable, GCS 14/15 (E4V4M6). Kussmaul breathing present." },
          { label: "IV Lines", value: "Central line right subclavian - patent. Insulin infusion via syringe pump at 6u/hr. NS running at 200ml/hr." },
          { label: "Monitoring", value: "Hourly blood sugar. 2-hourly ABG. Continuous SpO2 and ECG monitoring. Strict I/O charting." },
          { label: "Fluid Balance", value: "Intake 2800ml (IV). Output 1200ml (urine). Net +1600ml in 24 hours." },
        ],
      },
      {
        recordedAt: "2026-07-10T04:00:00Z", author: "Nurse Priya", role: "Nurse", shiftType: "Night",
        vitals: { bp: "85/50", hr: 125, rr: 32, spo2: 87, temp: 99.4 },
        fields: [
          { label: "General Condition", value: "Intermittently confused. GCS fluctuating 13-14. Dehydrated, poor skin turgor." },
          { label: "IV Lines", value: "Central line patent. Insulin infusion rate increased to 6u/hr from 4u/hr per MO order." },
          { label: "Fluid Balance", value: "Intake 2100ml (IV). Output 900ml (urine). Net +1200ml in 12 hours." },
          { label: "Monitoring", value: "Blood sugar 480 at midnight. K+ 3.3 at 02:00. Continuous ECG monitoring, no arrhythmia." },
        ],
      },
    ],
    mo: [
      {
        recordedAt: "2026-07-10T07:30:00Z", author: "Dr. Amit Shah", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "88/54", hr: 118, rr: 30, spo2: 88, temp: 99.1 },
        fields: [
          { label: "Chief Complaint", value: "DKA Day 3. Blood sugar trending down but still elevated. Patient drowsy." },
          { label: "Findings", value: "GCS 14/15. Kussmaul breathing present. Dehydrated, poor skin turgor. pH 7.18 (improving from 7.12). K+ 3.1, on replacement." },
          { label: "Additional Remarks", value: "DKA resolving slowly. Anion gap closing. Continue DKA protocol. Repeat ABG at 10:00, repeat K+ at 09:00. Start oral sips if alert. Endocrine consult for insulin regimen planning. Transition to SC insulin when pH > 7.3." },
        ],
      },
      {
        recordedAt: "2026-07-09T20:00:00Z", author: "Dr. Amit Shah", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "85/50", hr: 125, rr: 32, spo2: 87, temp: 99.4 },
        fields: [
          { label: "Chief Complaint", value: "DKA Day 2. Blood sugar 480 at 18:00. Confused intermittently." },
          { label: "Findings", value: "GCS fluctuating 13-14. Tachycardic, hypotensive. Kussmaul breathing. K+ 3.3 at 18:00. Urine output 40ml/hr." },
          { label: "Additional Remarks", value: "Increase insulin rate to 6u/hr from 4u/hr. Bolus 500ml NS over 1 hour. KCl 40mEq in next NS bag. Hourly blood sugar. 2-hourly ABG. Strict I/O. Call if GCS drops below 13." },
        ],
      },
    ],
  },
  "ADM-2026-003": {
    consultant: "Dr. Rajesh Sharma",
    lastConsultantNoteAt: "2026-07-09T11:00:00Z",
    nursing: [
      {
        recordedAt: "2026-07-10T05:45:00Z", author: "Nurse Rekha", role: "Nurse", shiftType: "Night",
        vitals: { bp: "145/92", hr: 82, rr: 22, spo2: 89, temp: 98.6 },
        fields: [
          { label: "General Condition", value: "Anxious, unable to lie flat. Propped up on 3 pillows. Sleeping in intervals." },
          { label: "Respiratory", value: "Using accessory muscles. Bilateral expiratory wheeze. Air entry reduced in bases. Nebulization given x3 overnight." },
          { label: "IV Lines", value: "Left hand peripheral IV patent, no signs of phlebitis. IV Deriphylline running." },
        ],
      },
      {
        recordedAt: "2026-07-09T18:30:00Z", author: "Nurse Fatima", role: "Nurse", shiftType: "Evening",
        vitals: { bp: "148/95", hr: 88, rr: 24, spo2: 91, temp: 98.8 },
        fields: [
          { label: "General Condition", value: "Conscious, oriented. Dyspneic at rest. Sitting upright, reluctant to lie down." },
          { label: "Respiratory", value: "SpO2 91% on 2L O2. Bilateral wheeze present. Nebulization with Salbutamol + Ipratropium given, partial relief." },
          { label: "Monitoring", value: "Continuous SpO2 monitoring. O2 via nasal cannula 2L/min. ABG sent at 18:00." },
        ],
      },
    ],
    mo: [
      {
        recordedAt: "2026-07-10T07:00:00Z", author: "Dr. Kavita Rao", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "145/92", hr: 82, rr: 22, spo2: 89, temp: 98.6 },
        fields: [
          { label: "Chief Complaint", value: "Worsening breathlessness overnight. Unable to sleep supine." },
          { label: "Findings", value: "Bilateral expiratory wheeze. Accessory muscle use. Air entry reduced bilaterally in lower zones. No pedal edema." },
          { label: "Additional Remarks", value: "AECOPD with type 2 respiratory failure (pCO2 52). Not improving adequately. Consider NIV if further deterioration. Increase O2 to 2L, add IV Hydrocortisone 100mg TDS, continue nebulization QID, repeat ABG in morning, keep NIV on standby." },
        ],
      },
      {
        recordedAt: "2026-07-09T22:00:00Z", author: "Dr. Kavita Rao", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "148/95", hr: 88, rr: 24, spo2: 91, temp: 98.8 },
        fields: [
          { label: "Chief Complaint", value: "Acute worsening of dyspnea since afternoon. SpO2 dropping on room air." },
          { label: "Findings", value: "Tachypneic, using accessory muscles. Bilateral rhonchi. No crepitations. JVP not raised." },
          { label: "Additional Remarks", value: "Acute exacerbation of COPD on GOLD Stage III. Type 2 respiratory failure. Start O2 2L via NC, nebulization QID, IV Deriphylline. Chest physiotherapy. Repeat ABG at 22:00." },
        ],
      },
    ],
  },
  "ADM-2026-004": {
    consultant: "Dr. Rajesh Sharma",
    lastConsultantNoteAt: "2026-07-09T18:00:00Z",
    nursing: [
      {
        recordedAt: "2026-07-10T06:00:00Z", author: "Nurse Lakshmi", role: "Nurse", shiftType: "Morning",
        vitals: { bp: "118/72", hr: 78, rr: 18, spo2: 98, temp: 98.4 },
        fields: [
          { label: "General Condition", value: "Conscious, oriented. Post-delivery Day 1. Ambulant, tolerating diet. Mild discomfort managed with ice pack." },
          { label: "IV Lines", value: "Left hand IV removed. Oral medications started." },
          { label: "Pain", value: "Pain score 3/10 at rest. Paracetamol given at 06:00." },
        ],
      },
      {
        recordedAt: "2026-07-09T22:30:00Z", author: "Nurse Deepa", role: "Nurse", shiftType: "Night",
        vitals: { bp: "120/76", hr: 80, rr: 17, spo2: 99, temp: 98.6 },
        fields: [
          { label: "General Condition", value: "Comfortable, resting well. Tolerating oral fluids and soft diet. Voiding normally." },
          { label: "Monitoring", value: "Vitals stable throughout shift. Urine output adequate. No complaints." },
          { label: "Wound Care", value: "Perineum clean, no swelling or discharge. Ice pack applied for comfort." },
        ],
      },
    ],
    mo: [
      {
        recordedAt: "2026-07-10T09:00:00Z", author: "Dr. Neha Gupta", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "118/72", hr: 78, rr: 18, spo2: 98, temp: 98.4 },
        fields: [
          { label: "Chief Complaint", value: "Post normal vaginal delivery Day 1. Mild perineal discomfort." },
          { label: "Findings", value: "Vitals stable. Abdomen soft, non-tender. Uterus well-contracted. No pallor. Hemoglobin 9.8 g/dL noted." },
          { label: "Additional Remarks", value: "Uncomplicated post-delivery Day 1. Start oral Iron + Folic acid. Continue Paracetamol PRN. Plan discharge tomorrow if stable. Advise follow-up in OPD after 1 week." },
        ],
      },
      {
        recordedAt: "2026-07-09T20:00:00Z", author: "Dr. Neha Gupta", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "120/76", hr: 80, rr: 17, spo2: 99, temp: 98.6 },
        fields: [
          { label: "Chief Complaint", value: "Post normal delivery. Evening round review." },
          { label: "Findings", value: "Afebrile. Ambulant. Tolerating orals. Urine output adequate. No bleeding concerns." },
          { label: "Additional Remarks", value: "Stable post-delivery. Remove IV cannula. Start oral medications. Continue monitoring vitals 4-hourly." },
        ],
      },
    ],
  },
  "ADM-2026-005": {
    consultant: "Dr. Rajesh Sharma",
    lastConsultantNoteAt: "2026-07-09T10:00:00Z",
    nursing: [
      {
        recordedAt: "2026-07-10T06:15:00Z", author: "Nurse Divya", role: "Nurse", shiftType: "Morning",
        vitals: { bp: "134/86", hr: 92, rr: 20, spo2: 96, temp: 99.8 },
        fields: [
          { label: "General Condition", value: "Post-op Day 4 (Lap Cholecystectomy). Ambulant independently. Low-grade fever persisting." },
          { label: "Wound Care", value: "All 4 port sites clean and dry. No erythema or discharge. Dressing intact." },
          { label: "IV Lines", value: "Subhepatic drain in situ. Output last 24h: 15ml serosanguinous. No bile staining. Right hand IV patent." },
          { label: "Diet", value: "Tolerating soft diet. Mild nausea after meals, anti-emetic given. Passing flatus, no bowel movement yet." },
        ],
      },
      {
        recordedAt: "2026-07-09T18:00:00Z", author: "Nurse Priya", role: "Nurse", shiftType: "Evening",
        vitals: { bp: "136/87", hr: 94, rr: 21, spo2: 95, temp: 100.0 },
        fields: [
          { label: "General Condition", value: "Post-op Day 3. Ambulant with support. Started soft diet at dinner. Passed flatus." },
          { label: "Pain", value: "Pain score 5/10 at rest, 7/10 on movement. Tramadol given, nausea developed 30 mins later." },
          { label: "Wound Care", value: "Port sites checked, all clean and dry. Drain output 30ml serosanguinous since morning." },
        ],
      },
    ],
    mo: [
      {
        recordedAt: "2026-07-10T08:00:00Z", author: "Dr. Suresh Kumar", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "134/86", hr: 92, rr: 20, spo2: 96, temp: 99.8 },
        fields: [
          { label: "Chief Complaint", value: "Post-op Day 4 Lap Cholecystectomy. Low-grade fever persisting. Nausea with IV Tramadol." },
          { label: "Findings", value: "Afebrile at morning check (99.8F). Abdomen soft, port sites clean. Drain output 15ml serosanguinous. Bowel sounds present. No tenderness." },
          { label: "Additional Remarks", value: "Uncomplicated recovery. Remove drain today (output < 20ml). Switch Tramadol to Paracetamol + Aceclofenac PO. Upgrade to regular diet. Plan discharge tomorrow if afebrile. Continue DVT prophylaxis till discharge." },
        ],
      },
      {
        recordedAt: "2026-07-09T20:00:00Z", author: "Dr. Suresh Kumar", role: "MO", authorRole: "Medical Officer",
        vitals: { bp: "136/87", hr: 94, rr: 21, spo2: 95, temp: 100.0 },
        fields: [
          { label: "Chief Complaint", value: "Post-op Day 3. Low-grade fever 100.2F. Nausea after Tramadol administration." },
          { label: "Findings", value: "Low-grade fever, likely post-op inflammatory response. Port sites clean. Drain output 30ml. Started tolerating soft diet." },
          { label: "Additional Remarks", value: "Fever likely post-op, no signs of surgical site infection. Continue current antibiotics for 24 more hours. Anti-emetic before Tramadol dose. Start soft diet. Monitor drain output." },
        ],
      },
    ],
  },
};

// ─── IPD clinical form data (assessments, progress notes, consultant notes) ──

var SLATE_TEXT = function (text) {
  return [{ type: "paragraph", children: [{ text: text }] }];
};

var MOCK_ASSESSMENTS = {
  "ADM-2026-001": {
    _id: "assess-001",
    createdByName: "Dr. Rajesh Sharma",
    createdByRole: "Consultant - Internal Medicine",
    createdAt: "2026-07-05T11:00:00Z",
    updates: [{ updatedByName: "Dr. Rajesh Sharma", updatedByRole: "Consultant - Internal Medicine", updatedAt: "2026-07-05T11:00:00Z" }],
    assessment: {
      date: "2026-07-05",
      time: "11:00:00",
      basicInfo: {
        presentingComplaints: SLATE_TEXT("High-grade fever with productive cough and breathlessness for 5 days. Not responding to oral antibiotics given by local physician."),
        topInformant: "Self",
        historyOfPresentIllness: SLATE_TEXT("62-year-old male, known diabetic and hypertensive, presents with fever up to 103F for 5 days, productive cough with yellowish sputum, and progressive breathlessness (mMRC Grade 3). Started on oral Amoxicillin-Clavulanate by local physician 3 days ago with no improvement. History of decreased oral intake and generalized weakness."),
        pastMedicalHistory: [
          { title: "Condition", children: [{ title: "Type 2 Diabetes Mellitus", duration: "8 years", selected: true, medical_history_remarks: "On Metformin 500mg BD + Glimepiride 2mg OD" }, { title: "Hypertension", duration: "5 years", selected: true, medical_history_remarks: "On Telmisartan 40mg OD" }] },
          { title: "Allergies to", children: [{ title: "No known drug allergies", selected: true }] },
          { title: "Habit", children: [{ title: "Ex-smoker", duration: "20 pack-years, quit 5 yrs ago", selected: true }] },
        ],
      },
      physicalExamination: {
        vitals: { temperature: 101.8, heartRate: 102, spo2: 92, respiratoryRate: 26, systolicBP: 134, diastolicBP: 84 },
        examination: { pallor: 1, clubbing: 2, cynosis: 2, lymphadenopathy: 2, edema: 2, hydration: 1, cvs: 1, breast_chest: 2, abdomen: 1, neurological_psychosocial: 1, back: 1, heent: 1 },
        others: SLATE_TEXT("Bilateral basal crepitations, more on right. Reduced air entry right lower zone. Vocal resonance increased right infra-scapular area."),
      },
      functionalAssessment: { bedActivity: 2, sitting: 1, standing: 2, ambulation: 2, stairClimbing: 2, bedSoreOnAdmission: 2 },
      provisionalDiagnosis: [{ id: "diag-1", name: "Community-Acquired Pneumonia" }, { id: "diag-2", name: "Type 2 Diabetes Mellitus" }],
      treatmentPlan: {
        immediateManagement: SLATE_TEXT("IV Ceftriaxone 1g BD, IV Azithromycin 500mg OD, Nebulisation with Salbutamol + Ipratropium QID, O2 via nasal prongs 4L/min, IV NS 1L over 8hrs, Paracetamol 650mg SOS for fever."),
        monitoringPlan: SLATE_TEXT("4-hourly vitals, SpO2 monitoring, I/O charting, Blood sugar QID, Repeat CRP and CBC on Day 3."),
        desiredOutcome: SLATE_TEXT("Defervescence within 48-72 hours, SpO2 > 95% on room air, improving CXR findings."),
      },
      additionalNotes: {
        notes: SLATE_TEXT("Patient counselled regarding need for IV antibiotics. Diabetic diet advised. Physiotherapy referral for chest PT."),
      },
    },
  },
  "ADM-2026-002": {
    _id: "assess-002",
    createdByName: "Dr. Rajesh Sharma",
    createdByRole: "Consultant - Internal Medicine",
    createdAt: "2026-07-07T14:30:00Z",
    updates: [{ updatedByName: "Dr. Rajesh Sharma", updatedByRole: "Consultant - Internal Medicine", updatedAt: "2026-07-07T14:30:00Z" }],
    assessment: {
      date: "2026-07-07",
      time: "14:30:00",
      basicInfo: {
        presentingComplaints: SLATE_TEXT("Found unresponsive at home by family. Known diabetic, non-compliant with medications for 2 weeks."),
        topInformant: "Family (Husband)",
        historyOfPresentIllness: SLATE_TEXT("45-year-old female, known T1DM on insulin (irregular compliance), brought by family after being found drowsy and breathing heavily. Had complaints of polyuria, polydipsia, and abdominal pain for 2 days. Missed insulin doses for past 2 weeks after running out of supply. Blood sugar in ER: 520 mg/dL. ABG: pH 7.12, pCO2 18, HCO3 6."),
        pastMedicalHistory: [
          { title: "Condition", children: [{ title: "Type 1 Diabetes Mellitus", duration: "12 years", selected: true, medical_history_remarks: "On Insulin (irregular compliance)" }, { title: "Hypothyroidism", duration: "5 years", selected: true, medical_history_remarks: "On Levothyroxine 50mcg" }] },
          { title: "Allergies to", children: [{ title: "Sulfonamides", selected: true, medical_history_remarks: "Causes skin rash" }] },
          { title: "Surgery", children: [{ title: "No prior surgeries", selected: true }] },
        ],
      },
      physicalExamination: {
        vitals: { temperature: 98.2, heartRate: 118, spo2: 97, respiratoryRate: 32, systolicBP: 96, diastolicBP: 58 },
        examination: { pallor: 1, clubbing: 2, cynosis: 2, lymphadenopathy: 2, edema: 2, hydration: 2, cvs: 1, breast_chest: 1, abdomen: 2, neurological_psychosocial: 2, back: 1, heent: 1 },
        others: SLATE_TEXT("Kussmaul breathing present. Fruity odour in breath. Abdomen diffusely tender, no guarding. GCS 12/15 (E3V4M5). Dry mucous membranes, reduced skin turgor."),
      },
      functionalAssessment: { bedActivity: 3, sitting: 3, standing: 3, ambulation: 3, stairClimbing: 3, bedSoreOnAdmission: 2 },
      provisionalDiagnosis: [{ id: "diag-3", name: "Diabetic Ketoacidosis" }, { id: "diag-4", name: "Type 1 Diabetes Mellitus" }],
      treatmentPlan: {
        immediateManagement: SLATE_TEXT("DKA protocol: IV NS 1L bolus then 500ml/hr for 2hrs. Insulin infusion 0.1u/kg/hr. K+ replacement per protocol. Hourly blood sugar, 2-hourly ABG. Strict I/O. NPO. Foley catheter."),
        monitoringPlan: SLATE_TEXT("Hourly GCS, blood sugar, urine output. 2-hourly ABG, electrolytes. Continuous SpO2 and cardiac monitoring. Anion gap calculation q4h."),
        desiredOutcome: SLATE_TEXT("pH > 7.3, blood sugar < 250, anion gap closure, resolution of ketosis, transition to SC insulin within 24-48hrs."),
      },
      additionalNotes: {
        notes: SLATE_TEXT("Family counselled regarding severity of DKA. Social work referral for medication compliance support. Endocrine consult requested."),
      },
    },
  },
  "ADM-2026-003": {
    _id: "assess-003",
    createdByName: "Dr. Rajesh Sharma",
    createdByRole: "Consultant - Internal Medicine",
    createdAt: "2026-07-08T09:45:00Z",
    updates: [{ updatedByName: "Dr. Rajesh Sharma", updatedByRole: "Consultant - Internal Medicine", updatedAt: "2026-07-08T09:45:00Z" }],
    assessment: {
      date: "2026-07-08",
      time: "09:45:00",
      basicInfo: {
        presentingComplaints: SLATE_TEXT("Acute worsening of breathlessness with wheezing for 2 days. Unable to walk 10 steps without stopping."),
        topInformant: "Self",
        historyOfPresentIllness: SLATE_TEXT("71-year-old male, known COPD GOLD Stage III, presents with acute worsening of dyspnea for 2 days. Increased sputum production, greenish in color. Unable to perform activities of daily living. Using 3 inhalers at home (Tiotropium + Formoterol/Budesonide + Salbutamol PRN). Last exacerbation 4 months ago required 5-day hospitalization."),
        pastMedicalHistory: [
          { title: "Condition", children: [{ title: "COPD GOLD Stage III", duration: "8 years", selected: true }, { title: "Hypertension", duration: "15 years", selected: true, medical_history_remarks: "On Amlodipine 5mg + Losartan 50mg" }, { title: "Cor Pulmonale", duration: "2 years", selected: true }] },
          { title: "Allergies to", children: [{ title: "Aspirin", selected: true, medical_history_remarks: "Causes bronchospasm" }] },
          { title: "Habit", children: [{ title: "Ex-smoker", duration: "40 pack-years, quit 3 yrs ago", selected: true }] },
        ],
      },
      physicalExamination: {
        vitals: { temperature: 99.4, heartRate: 108, spo2: 86, respiratoryRate: 30, systolicBP: 152, diastolicBP: 88 },
        examination: { pallor: 2, clubbing: 1, cynosis: 1, lymphadenopathy: 2, edema: 1, hydration: 1, cvs: 2, breast_chest: 2, abdomen: 1, neurological_psychosocial: 1, back: 1, heent: 1 },
        others: SLATE_TEXT("Barrel chest. Accessory muscles of respiration in use. Diffuse bilateral rhonchi with prolonged expiration. Pedal edema bilateral. Raised JVP. Pursed-lip breathing."),
      },
      functionalAssessment: { bedActivity: 2, sitting: 2, standing: 3, ambulation: 3, stairClimbing: 3, bedSoreOnAdmission: 2 },
      provisionalDiagnosis: [{ id: "diag-5", name: "Acute Exacerbation of COPD" }, { id: "diag-6", name: "Type 2 Respiratory Failure" }],
      treatmentPlan: {
        immediateManagement: SLATE_TEXT("O2 via Venturi mask 28% (target SpO2 88-92%). Nebulisation Salbutamol 2.5mg + Ipratropium 500mcg Q4H. IV Methylprednisolone 40mg BD. IV Piperacillin-Tazobactam 4.5g TID. Aminophylline infusion if no improvement. NIV on standby."),
        monitoringPlan: SLATE_TEXT("Continuous SpO2, 4-hourly vitals, ABG in morning, daily CRP, chest physiotherapy TID. Watch for CO2 narcosis."),
        desiredOutcome: SLATE_TEXT("SpO2 maintained 88-92%, reduced work of breathing, sputum clearing, able to tolerate oral medications within 48-72 hours."),
      },
      additionalNotes: {
        notes: SLATE_TEXT("Patient on home O2 (intermittent). Pulmonology consult if no improvement in 48 hours. DNAR status to be discussed with family."),
      },
    },
  },
  "ADM-2026-004": {
    _id: "assess-004",
    createdByName: "Dr. Neha Gupta",
    createdByRole: "Consultant - Obstetrics & Gynaecology",
    createdAt: "2026-07-09T17:00:00Z",
    updates: [{ updatedByName: "Dr. Neha Gupta", updatedByRole: "Consultant - Obstetrics & Gynaecology", updatedAt: "2026-07-09T17:00:00Z" }],
    assessment: {
      date: "2026-07-09",
      time: "17:00:00",
      basicInfo: {
        presentingComplaints: SLATE_TEXT("G2P1L1, 38 weeks gestation, admitted for elective induction due to gestational anemia and borderline oligohydramnios."),
        topInformant: "Self",
        historyOfPresentIllness: SLATE_TEXT("34-year-old female, G2P1L1, 38 weeks by dates (confirmed by first trimester USG). Gestational anemia (Hb 9.8) not responding to oral iron. AFI 6.2 cm on recent scan. Previous normal vaginal delivery 3 years ago, uncomplicated. Current pregnancy: GDM screening negative, anomaly scan normal, growth appropriate."),
        pastMedicalHistory: [
          { title: "Condition", children: [{ title: "Iron Deficiency Anemia", duration: "Diagnosed at 28 weeks", selected: true, medical_history_remarks: "Not responding to oral iron supplementation" }] },
          { title: "Allergies to", children: [{ title: "No known drug allergies", selected: true }] },
          { title: "Surgery", children: [{ title: "No prior surgeries", selected: true }] },
        ],
      },
      physicalExamination: {
        vitals: { temperature: 98.4, heartRate: 88, spo2: 99, respiratoryRate: 18, systolicBP: 118, diastolicBP: 72 },
        examination: { pallor: 1, clubbing: 2, cynosis: 2, lymphadenopathy: 2, edema: 1, hydration: 1, cvs: 1, breast_chest: 1, abdomen: 2, neurological_psychosocial: 1, back: 1, heent: 1 },
        others: SLATE_TEXT("Uterus term size, relaxed. FHS 142/min regular. Cephalic presentation, head 3/5 palpable. Mild bilateral pedal edema. Conjunctival pallor present."),
      },
      functionalAssessment: { bedActivity: 1, sitting: 1, standing: 1, ambulation: 1, stairClimbing: 2, bedSoreOnAdmission: 2 },
      provisionalDiagnosis: [{ id: "diag-7", name: "Term Pregnancy for Induction" }, { id: "diag-8", name: "Iron Deficiency Anemia in Pregnancy" }],
      treatmentPlan: {
        immediateManagement: SLATE_TEXT("IV Iron Sucrose 200mg in 100ml NS over 30 min. Cervical ripening with Dinoprostone gel if Bishop score < 6. ARM when feasible. Oxytocin augmentation per protocol. Continuous CTG during active labor."),
        monitoringPlan: SLATE_TEXT("4-hourly vitals, continuous CTG in active labor, partograph charting, FHS monitoring Q30min in latent phase. CBC post iron infusion."),
        desiredOutcome: SLATE_TEXT("Safe vaginal delivery. Post-delivery Hb > 10 before discharge. No PPH."),
      },
      additionalNotes: {
        notes: SLATE_TEXT("Patient and husband counselled about induction process and possible need for emergency LSCS. Consent obtained. Paediatric team informed."),
      },
    },
  },
  "ADM-2026-005": {
    _id: "assess-005",
    createdByName: "Dr. Rajesh Sharma",
    createdByRole: "Consultant - General Surgery",
    createdAt: "2026-07-06T08:30:00Z",
    updates: [{ updatedByName: "Dr. Rajesh Sharma", updatedByRole: "Consultant - General Surgery", updatedAt: "2026-07-06T08:30:00Z" }],
    assessment: {
      date: "2026-07-06",
      time: "08:30:00",
      basicInfo: {
        presentingComplaints: SLATE_TEXT("Recurrent episodes of right upper quadrant pain with nausea for 3 months. USG showing multiple gallstones with thick-walled gallbladder."),
        topInformant: "Self",
        historyOfPresentIllness: SLATE_TEXT("55-year-old male presents with recurrent colicky RUQ pain radiating to right shoulder, worse after fatty meals, for 3 months. 4-5 episodes, each lasting 2-3 hours. Associated nausea, occasional vomiting. No jaundice, no fever. USG: Multiple gallstones, largest 12mm, GB wall 4mm, no CBD dilatation. Admitted for elective Laparoscopic Cholecystectomy."),
        pastMedicalHistory: [
          { title: "Condition", children: [{ title: "Hypertension", duration: "10 years", selected: true, medical_history_remarks: "On Telmisartan 40mg OD" }, { title: "Dyslipidemia", selected: true, medical_history_remarks: "On Atorvastatin 10mg HS" }] },
          { title: "Allergies to", children: [{ title: "No known drug allergies", selected: true }] },
          { title: "Surgery", children: [{ title: "No prior surgeries", selected: true }] },
          { title: "Habit", children: [{ title: "Social drinker", selected: true, medical_history_remarks: "Weekends only" }] },
        ],
      },
      physicalExamination: {
        vitals: { temperature: 98.6, heartRate: 76, spo2: 98, respiratoryRate: 16, systolicBP: 138, diastolicBP: 86 },
        examination: { pallor: 2, clubbing: 2, cynosis: 2, lymphadenopathy: 2, edema: 2, hydration: 1, cvs: 1, breast_chest: 1, abdomen: 2, neurological_psychosocial: 1, back: 1, heent: 1 },
        others: SLATE_TEXT("Abdomen soft, mild tenderness in RUQ on deep palpation. Murphy sign equivocal. No hepatosplenomegaly. Bowel sounds normal. BMI 28."),
      },
      functionalAssessment: { bedActivity: 1, sitting: 1, standing: 1, ambulation: 1, stairClimbing: 1, bedSoreOnAdmission: 2 },
      provisionalDiagnosis: [{ id: "diag-9", name: "Cholelithiasis" }, { id: "diag-10", name: "Chronic Cholecystitis" }],
      treatmentPlan: {
        immediateManagement: SLATE_TEXT("NPO from midnight. Pre-op labs: CBC, RFT, LFT, coagulation profile, blood grouping. Pre-anaesthetic check-up. DVT prophylaxis: Enoxaparin 40mg SC at 10 PM. IV Cefazolin 1g at induction."),
        monitoringPlan: SLATE_TEXT("Pre-op vitals, post-op Q4H vitals for 24 hours, drain output monitoring if drain placed, pain score assessment Q6H."),
        desiredOutcome: SLATE_TEXT("Uncomplicated Laparoscopic Cholecystectomy. Tolerating orals by Day 1 post-op. Discharge by Day 2-3."),
      },
      additionalNotes: {
        notes: SLATE_TEXT("Patient counselled about lap chole procedure, risks including conversion to open. Written informed consent obtained. Anaesthesia fitness: ASA II."),
      },
    },
  },
};

var MOCK_PROGRESS_NOTES_IPD = {
  "ADM-2026-001": [
    {
      _id: "pn-001-a",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("Fever persisting, cough improving slightly. SpO2 93% on O2."),
        findings: SLATE_TEXT("Bilateral basal creps, reduced compared to yesterday. No new findings. WBC 14.2, CRP 86."),
        vitals: { temperature: 101.2, heartRate: 98, spo2: 93, respiratoryRate: 24, systolicBP: 128, diastolicBP: 82 },
        additionalRemarks: SLATE_TEXT("Continue current antibiotics. If no improvement by tomorrow, escalate to Piperacillin-Tazobactam. Send repeat blood culture."),
        date: "2026-07-10", time: "09:00:00",
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant" },
      createdAt: "2026-07-10T09:00:00Z", updatedAt: "2026-07-10T09:00:00Z",
    },
    {
      _id: "pn-001-b",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("High-grade fever spike to 102.4F in evening. Increased breathlessness."),
        findings: SLATE_TEXT("Bilateral creps more prominent. SpO2 dropped to 91%, O2 increased to 4L. Sputum culture pending."),
        vitals: { temperature: 102.4, heartRate: 110, spo2: 91, respiratoryRate: 28, systolicBP: 135, diastolicBP: 88 },
        additionalRemarks: SLATE_TEXT("Fever not responding. Consider adding Azithromycin to cover atypicals. Chest X-ray in morning."),
        date: "2026-07-09", time: "19:00:00",
      },
      filledByDetails: { doctorName: "Dr. Priya Mehta", designation: "Medical Officer" },
      createdAt: "2026-07-09T19:00:00Z", updatedAt: "2026-07-09T19:00:00Z",
    },
  ],
  "ADM-2026-002": [
    {
      _id: "pn-002-a",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("DKA - Day 3 of management. Blood sugar trending down but still acidotic."),
        findings: SLATE_TEXT("Blood sugar 428 (down from 520). pH 7.18 (up from 7.12). K+ 3.1 on replacement. GCS 14/15."),
        vitals: { temperature: 99.1, heartRate: 118, spo2: 88, respiratoryRate: 30, systolicBP: 88, diastolicBP: 54 },
        additionalRemarks: SLATE_TEXT("Continue DKA protocol. Repeat ABG at 10:00. Plan endocrine consult for long-term insulin regimen."),
        date: "2026-07-10", time: "08:00:00",
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant" },
      createdAt: "2026-07-10T08:00:00Z", updatedAt: "2026-07-10T08:00:00Z",
    },
    {
      _id: "pn-002-b",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("DKA - Day 2. Patient more drowsy. Blood sugar 480 at midnight."),
        findings: SLATE_TEXT("Kussmaul breathing present. Dehydrated. pH 7.15, K+ 3.3. Insulin rate increased to 6u/hr."),
        vitals: { temperature: 99.4, heartRate: 125, spo2: 87, respiratoryRate: 32, systolicBP: 85, diastolicBP: 50 },
        additionalRemarks: SLATE_TEXT("Aggressive fluid resuscitation ongoing. Monitor K+ 2-hourly. Maintain strict I/O. Urine culture sent."),
        date: "2026-07-09", time: "21:00:00",
      },
      filledByDetails: { doctorName: "Dr. Amit Shah", designation: "Medical Officer" },
      createdAt: "2026-07-09T21:00:00Z", updatedAt: "2026-07-09T21:00:00Z",
    },
  ],
  "ADM-2026-003": [
    {
      _id: "pn-003-a",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("AECOPD Day 2. Still dyspneic at rest. SpO2 89% on room air."),
        findings: SLATE_TEXT("Bilateral expiratory wheeze, air entry reduced in bases. ABG: pO2 58, pCO2 52 (Type 2 failure). Using accessory muscles."),
        vitals: { temperature: 98.6, heartRate: 82, spo2: 89, respiratoryRate: 22, systolicBP: 145, diastolicBP: 92 },
        additionalRemarks: SLATE_TEXT("Add IV steroids. Continue bronchodilators. Keep NIV on standby. Chest physiotherapy. Review ABG in AM."),
        date: "2026-07-10", time: "08:30:00",
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant" },
      createdAt: "2026-07-10T08:30:00Z", updatedAt: "2026-07-10T08:30:00Z",
    },
  ],
  "ADM-2026-004": [
    {
      _id: "pn-004-a",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("Post-delivery Day 1. Mother and baby doing well."),
        findings: SLATE_TEXT("Vitals stable. Uterus well contracted. Lochia normal. Breastfeeding established. Hb 9.8 - iron infusion planned."),
        vitals: { temperature: 98.4, heartRate: 78, spo2: 98, respiratoryRate: 18, systolicBP: 118, diastolicBP: 72 },
        additionalRemarks: SLATE_TEXT("Start Iron Sucrose infusion today. Encourage early ambulation. Continue calcium and folic acid."),
        date: "2026-07-10", time: "09:30:00",
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant" },
      createdAt: "2026-07-10T09:30:00Z", updatedAt: "2026-07-10T09:30:00Z",
    },
  ],
  "ADM-2026-005": [
    {
      _id: "pn-005-a",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("Post-op Day 4 (Lap Chole). Low-grade fever. Drain output minimal."),
        findings: SLATE_TEXT("Afebrile this morning (99.8F, down from 100.2). All port sites clean. Drain 15ml serosanguinous. Tolerating soft diet. Mild nausea."),
        vitals: { temperature: 99.8, heartRate: 92, spo2: 96, respiratoryRate: 20, systolicBP: 134, diastolicBP: 86 },
        additionalRemarks: SLATE_TEXT("Remove drain today. Switch to oral analgesics (Paracetamol + Aceclofenac). Upgrade to regular diet. Plan discharge tomorrow if afebrile."),
        date: "2026-07-10", time: "09:00:00",
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant" },
      createdAt: "2026-07-10T09:00:00Z", updatedAt: "2026-07-10T09:00:00Z",
    },
    {
      _id: "pn-005-b",
      progressNotes: {
        chiefComplaint: SLATE_TEXT("Post-op Day 3. Low-grade fever 100.2F. Drain output 30ml."),
        findings: SLATE_TEXT("Port sites clean. No signs of infection. Started soft diet. WBC 13.8, CRP 42 - post-op inflammatory response."),
        vitals: { temperature: 100.2, heartRate: 96, spo2: 95, respiratoryRate: 22, systolicBP: 138, diastolicBP: 88 },
        additionalRemarks: SLATE_TEXT("Continue antibiotics. Monitor temperature. If fever persists, get USG abdomen to rule out collection."),
        date: "2026-07-09", time: "10:00:00",
      },
      filledByDetails: { doctorName: "Dr. Suresh Kumar", designation: "Medical Officer" },
      createdAt: "2026-07-09T10:00:00Z", updatedAt: "2026-07-09T10:00:00Z",
    },
  ],
};

var MOCK_CONSULTANT_NOTES_IPD = {
  "ADM-2026-001": [
    {
      _id: "cn-001-a",
      consultationNotes: {
        clinicalAssessmentPlan: SLATE_TEXT("Community-acquired pneumonia, not responding to first-line antibiotics. Day 5 of Ceftriaxone. Inflammatory markers elevated. Plan: Blood culture, consider adding Azithromycin if no response by tomorrow. Continue supportive care."),
        vitals: { temperature: 101.2, heartRate: 98, spo2: 93, respiratoryRate: 24, systolicBP: 128, diastolicBP: 82 },
        medication: [
          { name: "Ceftriaxone 1g IV BD", status: "Continue" },
          { name: "Paracetamol 650mg PO TDS", status: "Continue" },
          { name: "Azithromycin 500mg IV OD", status: "Add if no improvement by evening" },
        ],
        labInvestigation: [
          { name: "Blood Culture", status: "Ordered" },
          { name: "Repeat CRP", status: "Tomorrow" },
          { name: "Chest X-ray PA", status: "Tomorrow morning" },
        ],
        additionalRemarks: SLATE_TEXT("Patient counseled about expected course. Family informed about possibility of antibiotic escalation."),
        date: "2026-07-10", time: "09:30:00",
      },
      updates: [],
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdByName: "Dr. Rajesh Sharma", createdByRole: "Consultant",
      createdAt: "2026-07-10T09:30:00Z", updatedAt: "2026-07-10T09:30:00Z",
    },
  ],
  "ADM-2026-002": [
    {
      _id: "cn-002-a",
      consultationNotes: {
        clinicalAssessmentPlan: SLATE_TEXT("DKA Day 3, resolving slowly. Anion gap closing. pH improving from 7.12 to 7.18. K+ 3.1 on replacement. Plan: Continue protocol, transition to SC insulin when pH > 7.3 and tolerating orals. Endocrine consult for long-term management."),
        vitals: { temperature: 99.1, heartRate: 118, spo2: 88, respiratoryRate: 30, systolicBP: 88, diastolicBP: 54 },
        medication: [
          { name: "Insulin Infusion 6u/hr", status: "Continue per protocol" },
          { name: "NS 0.9% 200ml/hr", status: "Continue" },
          { name: "KCl 20mEq in 100ml NS", status: "Repeat based on levels" },
        ],
        labInvestigation: [
          { name: "ABG", status: "Repeat at 10:00" },
          { name: "Serum K+", status: "Repeat at 09:00" },
          { name: "Urine Culture", status: "Pending" },
        ],
        additionalRemarks: SLATE_TEXT("High-risk patient. Family counseled about severity and expected hospital stay (5-7 days). Endocrine consult requested."),
        date: "2026-07-10", time: "08:30:00",
      },
      updates: [],
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdByName: "Dr. Rajesh Sharma", createdByRole: "Consultant",
      createdAt: "2026-07-10T08:30:00Z", updatedAt: "2026-07-10T08:30:00Z",
    },
  ],
  "ADM-2026-003": [
    {
      _id: "cn-003-a",
      consultationNotes: {
        clinicalAssessmentPlan: SLATE_TEXT("AECOPD with Type 2 respiratory failure. Not responding adequately to bronchodilators alone. Added IV steroids. Keep NIV on standby. Plan: Repeat ABG in morning, chest physiotherapy, pulmonology consult if no improvement."),
        vitals: { temperature: 98.6, heartRate: 82, spo2: 89, respiratoryRate: 22, systolicBP: 145, diastolicBP: 92 },
        medication: [
          { name: "Deriphylline 200mg IV BD", status: "Continue" },
          { name: "Budesonide + Formoterol Neb TDS", status: "Continue" },
          { name: "Hydrocortisone 100mg IV TDS", status: "Added" },
        ],
        labInvestigation: [
          { name: "ABG", status: "Repeat in morning" },
          { name: "Sputum Culture", status: "Sent" },
          { name: "2D Echo", status: "To rule out cor pulmonale progression" },
        ],
        additionalRemarks: SLATE_TEXT("Elderly patient with multiple comorbidities. Risk of NIV/ventilator explained to family. Code status discussed - Full code."),
        date: "2026-07-10", time: "09:00:00",
      },
      updates: [],
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdByName: "Dr. Rajesh Sharma", createdByRole: "Consultant",
      createdAt: "2026-07-10T09:00:00Z", updatedAt: "2026-07-10T09:00:00Z",
    },
  ],
  "ADM-2026-005": [
    {
      _id: "cn-005-a",
      consultationNotes: {
        clinicalAssessmentPlan: SLATE_TEXT("Post Lap Chole Day 4. Uncomplicated recovery. Low-grade fever settling. Drain output minimal. Plan: Remove drain, switch to oral analgesics, discharge tomorrow."),
        vitals: { temperature: 99.8, heartRate: 92, spo2: 96, respiratoryRate: 20, systolicBP: 134, diastolicBP: 86 },
        medication: [
          { name: "Cefuroxime 1.5g IV BD", status: "Last dose today, then stop" },
          { name: "Metronidazole 500mg IV TDS", status: "Last dose today" },
          { name: "Paracetamol 650mg + Aceclofenac 100mg PO BD", status: "Start (replacing IV Tramadol)" },
        ],
        labInvestigation: [],
        additionalRemarks: SLATE_TEXT("Patient and family counseled about discharge plan. Follow-up in 1 week for suture removal. Diet instructions given."),
        date: "2026-07-10", time: "09:15:00",
      },
      updates: [],
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdByName: "Dr. Rajesh Sharma", createdByRole: "Consultant",
      createdAt: "2026-07-10T09:15:00Z", updatedAt: "2026-07-10T09:15:00Z",
    },
  ],
};

var MOCK_OT_NOTES_IPD = {
  "ADM-2026-005": [
    {
      _id: "ot-005-a",
      createdByName: "Dr. Rajesh Sharma",
      createdByRole: "Consultant Surgeon",
      updates: [],
      otNotes: {
        surgeryDetails: {
          procedureName: ["Laparoscopic Cholecystectomy"],
          anaesthesiaType: "General",
          surgeryDate: "6 Jul 2026",
          surgeryStartTime: "10:00 AM",
          surgeryEndTime: "11:30 AM",
          diagnosis: SLATE_TEXT("Cholelithiasis with Chronic Cholecystitis"),
        },
        surgeryTeam: {
          primarySurgeon: [{ id: 9001, name: "Dr. Rajesh Sharma" }],
          secondarySurgeon: [{ id: 9002, name: "Dr. Suresh Kumar" }],
          assistant: [],
          anaesthesiologist: "Dr. Meera Iyer",
          scrubNurse: [{ name: "Nurse Divya" }],
          floorCirculatingNurse: [{ name: "Nurse Priya" }],
        },
        operativeNotes: {
          operativeFindings: SLATE_TEXT("Gallbladder thick-walled, distended, with multiple stones (largest 12mm). Adhesions to omentum. Calot's triangle clearly identified. CBD normal caliber. No bile leak."),
          operativeProcedure: SLATE_TEXT("Standard 4-port laparoscopic cholecystectomy. Calot's triangle dissected, cystic artery and duct clipped and divided. GB dissected from liver bed using electrocautery. Retrieved via epigastric port in endobag. Hemostasis confirmed. Subhepatic drain placed."),
          operativeAdditionalNotes: SLATE_TEXT("No intra-operative complications. Drain placed in Morrison's pouch."),
        },
        intraOperativeNotes: {
          estimatedBloodLoss: 50,
          swabCount: 5,
          fluidCount: 1500,
          sutureType: "Absorbable (Vicryl 2-0)",
          complicationsSeverity: SLATE_TEXT("None. Uneventful procedure."),
          specimensSent: SLATE_TEXT("Gallbladder sent for histopathology."),
          implantsUsed: SLATE_TEXT("None."),
        },
        postOperativeNotes: {
          postOpDestination: "Surgical Ward",
          additionalInstructions: SLATE_TEXT("Monitor vitals q2h for 6 hours. Start oral sips after 6 hours. DVT prophylaxis with Enoxaparin 40mg SC OD. Check drain output q4h. Pain management with IV Tramadol 50mg TDS PRN."),
        },
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant Surgeon" },
      createdAt: "2026-07-06T11:30:00Z", updatedAt: "2026-07-06T11:30:00Z",
    },
  ],
};

// ─── Cross Referrals ────────────────────────────────────────────────────────
var MOCK_CROSS_REFERRALS = {
  "ADM-2026-001": [
    {
      _id: "cr-001-a",
      createdByName: "Dr. Rajesh Sharma",
      createdByRole: "Consultant",
      cancel: false,
      crossReferral: {
        referralInformation: {
          referringDepartment: "Internal Medicine",
          referringTo: { id: "9003", name: "Dr. Anand Kulkarni", role: "Consultant", speciality: "Pulmonology" },
          referralDate: "10 Jul 2026",
          reasonForReferral: SLATE_TEXT("Community-acquired pneumonia not responding to Ceftriaxone after 5 days. Persistent fever, elevated CRP (86), Procalcitonin 2.8. SpO2 93% on 4L O2. Request pulmonology opinion for antibiotic escalation and possible bronchoscopy."),
          relativesInformed: {
            informedByDoctor: { id: "9001", name: "Dr. Rajesh Sharma", role: "Consultant", speciality: "Internal Medicine" },
            informedTo: "Son",
            informedOnDate: "10 Jul 2026",
            informedOnTime: "9:30 AM",
          },
        },
        consultantNotes: [],
        customModules: [],
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdAt: "2026-07-10T09:30:00Z", updatedAt: "2026-07-10T09:30:00Z",
    },
  ],
  "ADM-2026-002": [
    {
      _id: "cr-002-a",
      createdByName: "Dr. Rajesh Sharma",
      createdByRole: "Consultant",
      cancel: false,
      crossReferral: {
        referralInformation: {
          referringDepartment: "Internal Medicine",
          referringTo: { id: "9004", name: "Dr. Sanjay Mehta", role: "Consultant", speciality: "Endocrinology" },
          referralDate: "9 Jul 2026",
          reasonForReferral: SLATE_TEXT("DKA in Type 1 DM. Blood sugar 428 (down from 520), pH 7.18. On insulin drip protocol. Potassium 3.1. Request endocrinology review for insulin regimen optimization and transition to subcutaneous insulin once DKA resolved."),
          relativesInformed: {
            informedByDoctor: { id: "9001", name: "Dr. Rajesh Sharma", role: "Consultant", speciality: "Internal Medicine" },
            informedTo: "Father",
            informedOnDate: "9 Jul 2026",
            informedOnTime: "3:00 PM",
          },
        },
        consultantNotes: [
          {
            clinicalAssessment: SLATE_TEXT("DKA resolving. pH improved to 7.28. Blood sugar trending down. Insulin drip reduced to 4u/hr. Anion gap closing. Plan transition to SC insulin once eating."),
            impression: SLATE_TEXT("Diabetic Ketoacidosis - resolving. Will need basal-bolus insulin regimen. Consider CGM trial."),
            additionalRemarks: SLATE_TEXT("Follow up in OPD 1 week post-discharge for insulin dose titration. Diabetes education team consulted."),
            followUp: "18 Jul 2026",
          },
        ],
        customModules: [],
      },
      filledByDetails: { doctorName: "Dr. Sanjay Mehta", designation: "Consultant - Endocrinology" },
      createdAt: "2026-07-09T15:00:00Z", updatedAt: "2026-07-09T18:00:00Z",
    },
  ],
  "ADM-2026-003": [
    {
      _id: "cr-003-a",
      createdByName: "Dr. Rajesh Sharma",
      createdByRole: "Consultant",
      cancel: false,
      crossReferral: {
        referralInformation: {
          referringDepartment: "Internal Medicine",
          referringTo: { id: "9003", name: "Dr. Anand Kulkarni", role: "Consultant", speciality: "Pulmonology" },
          referralDate: "10 Jul 2026",
          reasonForReferral: SLATE_TEXT("Acute exacerbation of COPD with Type 2 respiratory failure. ABG: pO2 58, pCO2 52, pH 7.32. On 2L O2, SpO2 89% on room air. Bilateral wheeze. Not responding adequately to nebulization. Request pulmonology review for BiPAP consideration and steroid optimization."),
          relativesInformed: {
            informedByDoctor: { id: "9001", name: "Dr. Rajesh Sharma", role: "Consultant", speciality: "Internal Medicine" },
            informedTo: "Wife",
            informedOnDate: "10 Jul 2026",
            informedOnTime: "7:00 AM",
          },
        },
        consultantNotes: [],
        customModules: [],
      },
      filledByDetails: { doctorName: "Dr. Rajesh Sharma", designation: "Consultant - Internal Medicine" },
      createdAt: "2026-07-10T07:00:00Z", updatedAt: "2026-07-10T07:00:00Z",
    },
  ],
};

// Helper to find admission by patient or admission ID from a URL
function findAdmissionId(url) {
  var m = url.match(/admissionId=([A-Z0-9-]+)/i) || url.match(/admission[_-]?[Ii]d[=/]([A-Z0-9-]+)/);
  return m ? m[1] : null;
}

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
  MOCK_WARD_TASKS,
  MOCK_PROGRESS_TIMELINE,
  MOCK_ASSESSMENTS,
  MOCK_PROGRESS_NOTES_IPD,
  MOCK_CONSULTANT_NOTES_IPD,
  MOCK_OT_NOTES_IPD,
  MOCK_CROSS_REFERRALS,
  findAdmissionId,
};
