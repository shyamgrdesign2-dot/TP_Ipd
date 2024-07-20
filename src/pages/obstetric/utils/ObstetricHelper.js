export const ExaminationColumns = [
  {
    title: "Visits",
    key: "date",
    width: "20%",
  },
  {
    title: "Pallor",
    key: "pallor",
    width: "5%",
  },
  {
    title: "Oedema",
    key: "oedema",
    width: "5%",
  },
  {
    title: "BMI",
    key: "mothersBMI",
    width: "8%",
  },
  {
    title: "BP",
    key: "bp",
    width: "8%",
  },
  {
    title: "Fundus Height",
    key: "heightOfFundus",
    width: "8%",
  },
  {
    title: "Presentation",
    key: "presentation",
    width: "8%",
  },
  {
    title: "Fluid Index",
    key: "fluidIndex",
    width: "8%",
  },
  {
    title: "Fetal Heart Rate",
    key: "foetalHeartRate",
    width: "10%",
  },
  {
    title: "Note",
    key: "note",
    width: "27%",
  },
  {
    title: "Action",
    key: "action",
    width: "5%",
  },
];

export const obstetricTabListColumns = [
  {
    title: "Pallor",
    key: "pallor",
    siUnit: "",
  },
  {
    title: "Oedema",
    key: "oedema",
    siUnit: "",
  },
  {
    title: "BMI",
    key: "mothersBMI",
    siUnit: " kg/m2",
  },
  {
    title: "Systolic",
    key: "systolic",
    siUnit: " mmHg",
  },
  {
    title: "Diastolic",
    key: "diastolic",
    siUnit: " mmHg",
  },
  {
    title: "Fundus",
    key: "heightOfFundus",
    siUnit: " cm",
  },
  {
    title: "Presentation",
    key: "presentation",
    siUnit: "",
  },
  {
    title: "Fluid Index",
    key: "fluidIndex",
    siUnit: " cm",
  },
  {
    title: "FHR",
    key: "foetalHeartRate",
    siUnit: " bpm",
  },
  {
    title: "Notes",
    key: "notes",
    siUnit: "",
  },
];

export const LiveColumns = [
  {
    title: "Mode of delivery",
    key: "deliveryMode",
    width: "22%",
  },
  {
    title: "Date of delivery",
    key: "dateOfDelivery",
    width: "12%",
  },
  {
    title: "Gender",
    key: "gender",
    width: "12%",
  },
  {
    title: "Baby's Weight",
    key: "babysWeight",
    width: "12%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

export const EctopicColumns = [
  {
    title: "Period of gestation",
    key: "monthOfPregnancy",
    width: "22%",
  },
  {
    title: "Location",
    key: "location",
    width: "18%",
  },
  {
    title: "Mode of management",
    key: "modeOfAbortion",
    width: "18%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

export const AbortionColumns = [
  {
    title: "Period of gestation",
    key: "monthOfPregnancy",
    width: "22%",
  },
  {
    title: "Type of abortion",
    key: "typeOfAbortion",
    width: "18%",
  },
  {
    title: "Mode of abortion",
    key: "modeOfAbortion",
    width: "18%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

export const BloodGroupOptions = [
  { value: "A+", label: "A+ (A positive)" },
  { value: "A-", label: "A- (A negative)" },
  { value: "B+", label: "B+ (B positive)" },
  { value: "B-", label: "B- (B negative)" },
  { value: "AB+", label: "AB+ (AB positive)" },
  { value: "AB-", label: "AB- (AB negative)" },
  { value: "O+", label: "O+ (O positive)" },
  { value: "O-", label: "O- (O negative)" },
];

export const ConsangOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const MaritalStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

export const OutcomeOptions = {
  live: "Live",
  stillBirth: "Still Birth",
  abortion: "Abortion",
  ectopic: "Ectopic",
};
