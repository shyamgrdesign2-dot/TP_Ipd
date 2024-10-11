import { v4 as uuidv4 } from 'uuid';

export const PERSISTANT_STORAGE_KEY_AUTH_TOKEN = 'persistant.storage.key.auth-token';
export const MESSAGE_KEY = 'message_key';
export const IS_DEV = true;
export const PAGE_SIZE = 10;

export const TAB_QUEUE = 0;
export const TAB_FINISHED = 3;
export const TAB_CANCELLED = 4;

export const TAB_PRESCRIPTION = 1;
export const TAB_HEADER_FOOTER = 2;
export const TAB_PAGE_FORMAT = 3;

export const TAB_ADDRESS = '1';
export const TAB_TIMINGS = '2';
export const TAB_PHOTOS = '3';

export const ADD = 'ADD'
export const EDIT = 'EDIT'

export const NORMAL = 'NORMAL'
export const WHATSAPP = 'WHATSAPP'

export const WEBSOCKET_ADDRESS = "ws://localhost:5001/iScribeSocket"
export const WS_CONTROL_URL = 'ws://localhost:5002/iScribeControlSocket';
export const WEBSOCKET_ERROR_MESSAGE = "Error connecting the server, Please check device connectivity"
export const WHATS_APP_API = "/api/v1/casemanager/smart-rx/send"
export const SMART_RX_UPLOAD = "/api/v1/casemanager/smart-rx/upload"
export const RX_DIGITIZATION = "/api/v1/rxdigitize/rx"
export const UNFINISHED_RX_CASE = "//api/v1/casemanager/get-ufinished-case"

export const LAB_PARAMS_RESULTS = "/api/v1/lab-parameters/results"
export const IS_RX_DIGI_API_CALL = false
export const FETCH_SMART_RX = "/api/v1/casemanager/smart-rx"
export const OPD_API_KEY = "lChjFRJce3bxmoS3TSQk5w=="
export const WTSAP_ERR_MESSAGE = "Error sending the prescription, Please try again"

export const GB_ISCRIBE = "iscribe"
export const GB_SMARTSYNC_CONNECT = "smartsync-connect"
export const GB_SMARTSYNC_CVT = "smartsync-cvt"
export const GB_TALKATIVE = "Talkative"
export const GB_GYNEC_HISTORY = "obs-gynec-history"

export const GYNAECOLOGY = "Gynaecology";
export const PAEDIATRICS = "Paediatrics";

export const EXTRA_OPTIONS = [
    {
        key: JSON.stringify({ value: "STAT", label: "Stat", tmm_days: parseInt(0), unique_id: uuidv4() }),
        value: 'STAT',
        label: 'Stat',
    },
    {
        key: JSON.stringify({ value: "to be continued", label: "To Be Continued", tmm_days: parseInt(0), unique_id: uuidv4() }),
        value: 'to be continued',
        label: 'To Be Continued',
    },
    {
        key: JSON.stringify({ value: "till required", label: "Till Required", tmm_days: parseInt(0), unique_id: uuidv4() }),
        value: 'till required',
        label: 'Till Required',
    }
]

export const ABORTION = "Abortion";
export const MISCARRIAGE = "Miscarriage";

export const DEFAULT_TESTS_DATA = [
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85090",
        "reportName": "Complete Blood Count - CBC",
        "name": "Haemoglobin (Hb)",
        "value": "",
        "unit": "Gms %"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85091",
        "reportName": "Complete Blood Count - CBC",
        "name": "Neutrophils",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85095",
        "reportName": "Complete Blood Count - CBC",
        "name": "Total WBC Count",
        "value": "",
        "unit": "Cells/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85096",
        "reportName": "Complete Blood Count - CBC",
        "name": "Lymphocytes",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85097",
        "reportName": "Complete Blood Count - CBC",
        "name": "Eosinophils",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85098",
        "reportName": "Complete Blood Count - CBC",
        "name": "Monocytes",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d85099",
        "reportName": "Complete Blood Count - CBC",
        "name": "Total Red Cell Count (RBC)",
        "value": "",
        "unit": "Million Cells/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509a",
        "reportName": "Complete Blood Count - CBC",
        "name": "Erythrocyte Sedimentation Rate (ESR)",
        "value": "",
        "unit": "mm/hour"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509b",
        "reportName": "Complete Blood Count - CBC",
        "name": "Platelets Count",
        "value": "",
        "unit": " lakh/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509c",
        "reportName": "Complete Blood Count - CBC",
        "name": "Haematocrit (PCV)",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509d",
        "reportName": "Complete Blood Count - CBC",
        "name": "Mean Corpuscular Volume (MCV)",
        "value": "",
        "unit": "fL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509e",
        "reportName": "Complete Blood Count - CBC",
        "name": "Mean Corpuscular Haemoglobin (MCH)",
        "value": "",
        "unit": "pg"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d8509f",
        "reportName": "Complete Blood Count - CBC",
        "name": "Mean Corpuscular Haemoglobin Concentration (MCHC)",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1b3",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Haemoglobin (Hb)",
        "value": "",
        "unit": "Gms %"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1b4",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Haematocrit (PCV)",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1b5",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Total Red Cell Count (RBC)",
        "value": "",
        "unit": "Million Cells/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f3452fbbe596c40a22a",
        "reportName": "Complete Blood Picture - CBP",
        "name": "RBCs",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f3452fbbe596c40a22b",
        "reportName": "Complete Blood Picture - CBP",
        "name": "WBCs",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f3452fbbe596c40a22c",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Platelets",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4652fbbe596c40a2d8",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Differential Count",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4652fbbe596c40a2d9",
        "reportName": "Complete Blood Picture - CBP",
        "name": "Peripheral Blood Smear",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a2",
        "reportName": "URINE TEST",
        "name": "Haemoglobin (Hb)",
        "value": "",
        "unit": "Gms %"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a3",
        "reportName": "URINE TEST",
        "name": "Haematocrit (PCV)",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a4",
        "reportName": "URINE TEST",
        "name": "Fasting Blood Sugar (FBS)",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a5",
        "reportName": "URINE TEST",
        "name": "Post Prandial Blood Sugar (PPBS)",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a6",
        "reportName": "URINE TEST",
        "name": "Glycosylated Haemoglobin - HbA1c",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a7",
        "reportName": "URINE TEST",
        "name": "Serum Creatinine",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a8",
        "reportName": "URINE TEST",
        "name": "Serum Uric Acid",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850a9",
        "reportName": "URINE TEST",
        "name": "Serum Alkaline Phosphatase",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850aa",
        "reportName": "URINE TEST",
        "name": "Urine Creatinine",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850ab",
        "reportName": "URINE TEST",
        "name": "Spot Albumin Creatinine Ratio",
        "value": "",
        "unit": "mg/g Cr"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850ac",
        "reportName": "URINE TEST",
        "name": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "unit": "mIU/L"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850ad",
        "reportName": "URINE TEST",
        "name": "Luteinizing Hormone (LH)",
        "value": "",
        "unit": "mIU/mL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850ae",
        "reportName": "URINE TEST",
        "name": "Follicle Stimulating Hormone (FSH)",
        "value": "",
        "unit": "mIU/mL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850af",
        "reportName": "URINE TEST",
        "name": "Prolactin",
        "value": "",
        "unit": "ng/mL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850b0",
        "reportName": "URINE TEST",
        "name": "Testosterone Total",
        "value": "",
        "unit": "ng/dL"
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a3",
        "reportName": "URINE TEST",
        "name": "RBCs",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a4",
        "reportName": "URINE TEST",
        "name": "WBCs",
        "value": "",
        "unit": "thousand cells/ÂµL"
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a5",
        "reportName": "URINE TEST",
        "name": "Platelets",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a6",
        "reportName": "URINE TEST",
        "name": "Haemoparasites",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a7",
        "reportName": "URINE TEST",
        "name": "Impression",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a8",
        "reportName": "URINE TEST",
        "name": "Fasting Urine Sugar (FUS)",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4252fbbe596c40a2a9",
        "reportName": "URINE TEST",
        "name": "Post Prandial Urine Sugar - PPUS",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2aa",
        "reportName": "URINE TEST",
        "name": "Mean Blood Glucose (Calculated from HbA1c)",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2ab",
        "reportName": "URINE TEST",
        "name": "Random Urine Sugar",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2ac",
        "reportName": "URINE TEST",
        "name": "Ketone",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2ad",
        "reportName": "URINE TEST",
        "name": "Protein",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2ae",
        "reportName": "URINE TEST",
        "name": "Serum Sodium (Na+)",
        "value": "",
        "unit": "mEq/L"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2af",
        "reportName": "URINE TEST",
        "name": "Serum Chloride (Cl+)",
        "value": "",
        "unit": "mEq/L"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b0",
        "reportName": "URINE TEST",
        "name": "Electrolyte Bicarbonate",
        "value": "",
        "unit": "mEq/L"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b1",
        "reportName": "URINE TEST",
        "name": "Urine Albumin",
        "value": "",
        "unit": "mg/L"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b2",
        "reportName": "URINE TEST",
        "name": "Volume",
        "value": "",
        "unit": "mL"
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324064",
        "reportName": "URINE TEST",
        "name": "Colour",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324065",
        "reportName": "URINE TEST",
        "name": "Appearance",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324066",
        "reportName": "URINE TEST",
        "name": "Reaction",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324067",
        "reportName": "URINE TEST",
        "name": "Albumin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324068",
        "reportName": "URINE TEST",
        "name": "Sugar",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c324069",
        "reportName": "URINE TEST",
        "name": "Bile Salt",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c32406a",
        "reportName": "URINE TEST",
        "name": "Bile Pigment",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c32406b",
        "reportName": "URINE TEST",
        "name": "Casts",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c32406c",
        "reportName": "URINE TEST",
        "name": "Crystals",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f43035b84835c32406d",
        "reportName": "URINE TEST",
        "name": "Urine Bacteria",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b3",
        "reportName": "URINE TEST",
        "name": "Urobilinogen",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b4",
        "reportName": "URINE TEST",
        "name": "TG Antibodies",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b5",
        "reportName": "URINE TEST",
        "name": "Testosterone Free",
        "value": "",
        "unit": "ng/dL"
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b6",
        "reportName": "URINE TEST",
        "name": "DHEAS",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b7",
        "reportName": "URINE TEST",
        "name": "SHBG",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b8",
        "reportName": "URINE TEST",
        "name": "Oestridiol",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2b9",
        "reportName": "URINE TEST",
        "name": "FGW - Scoring",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2ba",
        "reportName": "URINE TEST",
        "name": "ECG",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2bb",
        "reportName": "URINE TEST",
        "name": "ULTRASOUND",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4352fbbe596c40a2bc",
        "reportName": "URINE TEST",
        "name": "FNAC",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4652fbbe596c40a2e5",
        "reportName": "URINE TEST",
        "name": "Blood Urea Nitrogen (BUN)",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a335",
        "reportName": "URINE TEST",
        "name": "T3",
        "value": "",
        "unit": "ng/dL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a336",
        "reportName": "URINE TEST",
        "name": "T4",
        "value": "",
        "unit": "µg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a337",
        "reportName": "URINE TEST",
        "name": "Free T3",
        "value": "",
        "unit": "ng/mL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a338",
        "reportName": "URINE TEST",
        "name": "Free T4",
        "value": "",
        "unit": "ng/dL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a339",
        "reportName": "URINE TEST",
        "name": "Anitbodies TPO",
        "value": "",
        "unit": " IU/mL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a33a",
        "reportName": "URINE TEST",
        "name": "Anti Thyroglobulin Antibody (Anti Tg)",
        "value": "",
        "unit": "U/mL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a33f",
        "reportName": "URINE TEST",
        "name": "eGFR  Creatinine Clearance",
        "value": "",
        "unit": "mL/min/1.73m²"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a340",
        "reportName": "URINE TEST",
        "name": "Serum Bilirubin Total",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4952fbbe596c40a341",
        "reportName": "URINE TEST",
        "name": "Serum Bilirubin Direct",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a342",
        "reportName": "URINE TEST",
        "name": "Bilirubin Indirect",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a343",
        "reportName": "URINE TEST",
        "name": "Serum Protein  Total",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a344",
        "reportName": "URINE TEST",
        "name": "Serum Protein  Albumin",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a345",
        "reportName": "URINE TEST",
        "name": "Serum Protein  Globulin",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a346",
        "reportName": "URINE TEST",
        "name": "SGOT (AST)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a347",
        "reportName": "URINE TEST",
        "name": "SGPT (AST)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a348",
        "reportName": "URINE TEST",
        "name": "Gamma Glutamyl Transpeptidase (GGT)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a349",
        "reportName": "URINE TEST",
        "name": "Serum Magnesium (Mg+)",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34a",
        "reportName": "URINE TEST",
        "name": "Pus Cells",
        "value": "",
        "unit": "/HPF"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34b",
        "reportName": "URINE TEST",
        "name": "Epithelial Cells",
        "value": "",
        "unit": "/HPF"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34c",
        "reportName": "URINE TEST",
        "name": "Urine PH",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34d",
        "reportName": "URINE TEST",
        "name": "Specific Gravity",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34e",
        "reportName": "URINE TEST",
        "name": "Mean Corpuscular Haemoglobin Concentration (MCHC)",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a34f",
        "reportName": "URINE TEST",
        "name": "Random Blood Sugar  RBS",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a350",
        "reportName": "URINE TEST",
        "name": "Total Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a351",
        "reportName": "URINE TEST",
        "name": "Serum HDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a352",
        "reportName": "URINE TEST",
        "name": "Serum Triglycerides",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a353",
        "reportName": "URINE TEST",
        "name": "Serum LDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a354",
        "reportName": "URINE TEST",
        "name": "Serum VLDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a355",
        "reportName": "URINE TEST",
        "name": "Total Cholesterol/ HDL Ratio",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a356",
        "reportName": "URINE TEST",
        "name": "LDL Cholesterol / HDL Cholesterol Ratio",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a357",
        "reportName": "URINE TEST",
        "name": "TRIGLYCERIDES / HDL RATIO",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a358",
        "reportName": "URINE TEST",
        "name": "Non HDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a359",
        "reportName": "URINE TEST",
        "name": "Blood Urea",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a35a",
        "reportName": "URINE TEST",
        "name": "Serum Potassium (K+)",
        "value": "",
        "unit": "mEq/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a35b",
        "reportName": "URINE TEST",
        "name": "Serum Calcium",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4f52fbbe596c40a3b2",
        "reportName": "URINE TEST",
        "name": "Absolute Eosinophil Count",
        "value": "",
        "unit": "cells/cumm"
    },
    {
        "labParametersMasterId": "66fb8f4f52fbbe596c40a3b3",
        "reportName": "URINE TEST",
        "name": "Total WBC Count",
        "value": "",
        "unit": "Cells/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f4f52fbbe596c40a3b4",
        "reportName": "URINE TEST",
        "name": "Neutrophils",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4f52fbbe596c40a3b5",
        "reportName": "URINE TEST",
        "name": "Lymphocytes",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4f52fbbe596c40a3b6",
        "reportName": "URINE TEST",
        "name": "Eosinophils",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0ed5",
        "reportName": "URINE TEST",
        "name": "Monocytes",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0ed6",
        "reportName": "URINE TEST",
        "name": "Basophils",
        "value": "",
        "unit": "%"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0ed7",
        "reportName": "URINE TEST",
        "name": "RBC  Red Blood Cells",
        "value": "",
        "unit": "million cells/cu mm"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0ed8",
        "reportName": "URINE TEST",
        "name": "Erythrocyte Sedimentation Rate (ESR)",
        "value": "",
        "unit": "mm/hour"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0ed9",
        "reportName": "URINE TEST",
        "name": "Mean Corpuscular Volume (MCV)",
        "value": "",
        "unit": "fL"
    },
    {
        "labParametersMasterId": "66fb8f4ffde995b3ccbb0eda",
        "reportName": "URINE TEST",
        "name": "Mean Corpuscular Haemoglobin (MCH)",
        "value": "",
        "unit": "pg"
    },
    {
        "labParametersMasterId": "66fb8f290f04df59a9d850c4",
        "reportName": "Thyroid Stimulating Hormone - TSH",
        "name": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "unit": "mIU/L"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1bf",
        "reportName": "Urine Routine - UA",
        "name": "Volume",
        "value": "",
        "unit": "mL"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c0",
        "reportName": "Urine Routine - UA",
        "name": "Colour",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c1",
        "reportName": "Urine Routine - UA",
        "name": "Appearance",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c2",
        "reportName": "Urine Routine - UA",
        "name": "Reaction",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c3",
        "reportName": "Urine Routine - UA",
        "name": "Albumin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c4",
        "reportName": "Urine Routine - UA",
        "name": "Sugar",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c5",
        "reportName": "Urine Routine - UA",
        "name": "Blood (U)",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c6",
        "reportName": "Urine Routine - UA",
        "name": "Acetone",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c7",
        "reportName": "Urine Routine - UA",
        "name": "Ketone",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c8",
        "reportName": "Urine Routine - UA",
        "name": "Urobilinogen",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1c9",
        "reportName": "Urine Routine - UA",
        "name": "Bile Salt",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1ca",
        "reportName": "Urine Routine - UA",
        "name": "Bile Pigment",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1cb",
        "reportName": "Urine Routine - UA",
        "name": "Nitrite",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1cc",
        "reportName": "Urine Routine - UA",
        "name": "Leucocyte",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1cd",
        "reportName": "Urine Routine - UA",
        "name": "Protein",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1ce",
        "reportName": "Urine Routine - UA",
        "name": "RBCs",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1cf",
        "reportName": "Urine Routine - UA",
        "name": "Casts",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1d0",
        "reportName": "Urine Routine - UA",
        "name": "Crystals",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1d1",
        "reportName": "Urine Routine - UA",
        "name": "Others",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f69",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Specimen",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6a",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Colony Count",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6b",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Urine Wetmount",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6c",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Culture Yields",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6d",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Organisms Isolated",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6e",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Ciprofloxacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f6f",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Cefepime",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f70",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Netillimicin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f71",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Co-Trimoxazole",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f72",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Gatifloxacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f73",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Ofloxacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f74",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Norfloxacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f75",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Gentamicin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f76",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Cefpodoxime",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f77",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Ceftazidime",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f78",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Amikacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f79",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Imipenum",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7a",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Piperacillin/Tazobactum",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7b",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Nitrofurantoin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7c",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Ceftazidime & Clavulanic Acid",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7d",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Lomefloxacin",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7e",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Nalidixic Acid",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f7f",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Cefuroxime",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2c035b84835c323f80",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Amoxycillin & Clavulanic Acid",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f44071a71c4f2dc87bb",
        "reportName": "Urine Culture and Sensitivity",
        "name": "Anti Microbial Agent",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2e52fbbe596c40a201",
        "reportName": "Blood Widal Test",
        "name": "Agglutination to Salmonella - Typhi O",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2e52fbbe596c40a202",
        "reportName": "Blood Widal Test",
        "name": "Agglutination to Salmonella - Typhi H",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2e52fbbe596c40a203",
        "reportName": "Blood Widal Test",
        "name": "Agglutination to S.Paratyphi AH",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f2e52fbbe596c40a204",
        "reportName": "Blood Widal Test",
        "name": "Agglutination to S.Paratyphi BH",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a309",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Serum Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30a",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Serum Triglycerides",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30b",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Serum HDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30c",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Serum LDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30d",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Serum VLDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30e",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Total Cholesterol/ HDL Ratio",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a30f",
        "reportName": "Fasting Lipid Profile  FLP",
        "name": "Non HDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f280f04df59a9d850b3",
        "reportName": "Kidney Function Test -KFT",
        "name": "Urine Creatinine",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f2a52fbbe596c40a1be",
        "reportName": "Kidney Function Test -KFT",
        "name": "Estimated Protein Excretion",
        "value": "",
        "unit": "g/day"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a312",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Bilirubin Total",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a313",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Bilirubin Direct",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a314",
        "reportName": "Liver Function Tests  LFT",
        "name": "Bilirubin Indirect",
        "value": "",
        "unit": "mg/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a315",
        "reportName": "Liver Function Tests  LFT",
        "name": "SGOT (AST)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a316",
        "reportName": "Liver Function Tests  LFT",
        "name": "SGPT (AST)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a317",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Protein  Total",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a318",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Protein  Albumin",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a319",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Protein  Globulin",
        "value": "",
        "unit": "g/dL"
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a31a",
        "reportName": "Liver Function Tests  LFT",
        "name": "Serum Albumin/Globulin Ratio",
        "value": "",
        "unit": ""
    },
    {
        "labParametersMasterId": "66fb8f4852fbbe596c40a31b",
        "reportName": "Liver Function Tests  LFT",
        "name": "Gamma Glutamyl Transpeptidase (GGT)",
        "value": "",
        "unit": "IU/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a35c",
        "reportName": "Spot Urine Electrolytes",
        "name": "Spot Urine Sodium",
        "value": "",
        "unit": "mmol/L"
    },
    {
        "labParametersMasterId": "66fb8f4a52fbbe596c40a35d",
        "reportName": "Spot Urine Electrolytes",
        "name": "Spot Urine Potassium",
        "value": "",
        "unit": "mmol/L"
    },
    {
        "labParametersMasterId": "66fb8f4c035b84835c324070",
        "reportName": "Serum LDL Cholesterol",
        "name": "LDL Cholesterol",
        "value": "",
        "unit": "mg/dL"
    },
]
