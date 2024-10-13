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

export const DEFAULT_TESTS_DATA =[
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Haemoglobin (Hb)",
        "value": "",
        "units": "Gms %"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Neutrophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Total WBC Count",
        "value": "",
        "units": "Cells/cu mm"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Lymphocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Eosinophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Monocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Total Red Cell Count (RBC)",
        "value": "",
        "units": "Million Cells/cu mm"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Erythrocyte Sedimentation Rate (ESR)",
        "value": "",
        "units": "mm/hour"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Platelets Count",
        "value": "",
        "units": " lakh/cu mm"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Haematocrit (PCV)",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Mean Corpuscular Volume (MCV)",
        "value": "",
        "units": "fL"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Mean Corpuscular Haemoglobin (MCH)",
        "value": "",
        "units": "pg"
    },
    {
        "reportName": "Complete Blood Count - CBC",
        "testName": "Mean Corpuscular Haemoglobin Concentration (MCHC)",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Haemoglobin (Hb)",
        "value": "",
        "units": "Gms %"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Haematocrit (PCV)",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Total Red Cell Count (RBC)",
        "value": "",
        "units": "Million Cells/cu mm"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "RBCs",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "WBCs",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Platelets",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Differential Count",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Peripheral Blood Smear",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Total WBC Count",
        "value": "",
        "units": "Cells/cu mm"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Platelets Count",
        "value": "",
        "units": "lakh/cu mm"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Neutrophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Lymphocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Eosinophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Monocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Complete Blood Picture - CBP",
        "testName": "Basophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Haemoglobin (Hb)",
        "value": "",
        "units": "Gms %"
    },
    {
        "reportName": "Urine Test",
        "testName": "Haematocrit (PCV)",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Fasting Blood Sugar (FBS)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Post Prandial Blood Sugar (PPBS)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Glycosylated Haemoglobin - HbA1c",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Creatinine",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Uric Acid",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Alkaline Phosphatase",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Urine Creatinine",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Spot Albumin Creatinine Ratio",
        "value": "",
        "units": "mg/g Cr"
    },
    {
        "reportName": "Urine Test",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Luteinizing Hormone (LH)",
        "value": "",
        "units": "mIU/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Follicle Stimulating Hormone (FSH)",
        "value": "",
        "units": "mIU/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Prolactin",
        "value": "",
        "units": "ng/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Testosterone Total",
        "value": "",
        "units": "ng/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "RBCs",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "WBCs",
        "value": "",
        "units": "thousand cells/ÂµL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Platelets",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Haemoparasites",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Impression",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Fasting Urine Sugar (FUS)",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Post Prandial Urine Sugar - PPUS",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Mean Blood Glucose (Calculated from HbA1c)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Random Urine Sugar",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Ketone",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Protein",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Sodium (Na+)",
        "value": "",
        "units": "mEq/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Chloride (Cl+)",
        "value": "",
        "units": "mEq/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Electrolyte Bicarbonate",
        "value": "",
        "units": "mEq/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Urine Albumin",
        "value": "",
        "units": "mg/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Volume",
        "value": "",
        "units": "mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Colour",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Appearance",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Reaction",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Albumin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Sugar",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Bile Salt",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Bile Pigment",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Casts",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Crystals",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Urine Bacteria",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Urobilinogen",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "TG Antibodies",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Testosterone Free",
        "value": "",
        "units": "ng/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "DHEAS",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "SHBG",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Oestridiol",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "FGW - Scoring",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "ECG",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "ULTRASOUND",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "FNAC",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Blood Urea Nitrogen (BUN)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "T3",
        "value": "",
        "units": "ng/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "T4",
        "value": "",
        "units": "µg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Free T3",
        "value": "",
        "units": "ng/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Free T4",
        "value": "",
        "units": "ng/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Anitbodies TPO",
        "value": "",
        "units": " IU/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Anti Thyroglobulin Antibody (Anti Tg)",
        "value": "",
        "units": "U/mL"
    },
    {
        "reportName": "Urine Test",
        "testName": "eGFR  Creatinine Clearance",
        "value": "",
        "units": "mL/min/1.73m²"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Bilirubin Total",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Bilirubin Direct",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Bilirubin Indirect",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Protein  Total",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Protein  Albumin",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Protein  Globulin",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "SGOT (AST)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "SGPT (AST)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Gamma Glutamyl Transpeptidase (GGT)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Magnesium (Mg+)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Pus Cells",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Epithelial Cells",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Urine PH",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Specific Gravity",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Mean Corpuscular Haemoglobin Concentration (MCHC)",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Random Blood Sugar  RBS",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Total Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum HDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Triglycerides",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum VLDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Total Cholesterol/ HDL Ratio",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "LDL Cholesterol / HDL Cholesterol Ratio",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "TRIGLYCERIDES / HDL RATIO",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Non HDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Blood Urea",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Potassium (K+)",
        "value": "",
        "units": "mEq/L"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum Calcium",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Urine pH",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Test",
        "testName": "Absolute Eosinophil Count",
        "value": "",
        "units": "cells/cumm"
    },
    {
        "reportName": "Urine Test",
        "testName": "Total WBC Count",
        "value": "",
        "units": "Cells/cu mm"
    },
    {
        "reportName": "Urine Test",
        "testName": "Neutrophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Lymphocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Eosinophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Monocytes",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "Basophils",
        "value": "",
        "units": "%"
    },
    {
        "reportName": "Urine Test",
        "testName": "RBC  Red Blood Cells",
        "value": "",
        "units": "million cells/cu mm"
    },
    {
        "reportName": "Urine Test",
        "testName": "Erythrocyte Sedimentation Rate (ESR)",
        "value": "",
        "units": "mm/hour"
    },
    {
        "reportName": "Urine Test",
        "testName": "Mean Corpuscular Volume (MCV)",
        "value": "",
        "units": "fL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Mean Corpuscular Haemoglobin (MCH)",
        "value": "",
        "units": "pg"
    },
    {
        "reportName": "Urine Test",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "Thyroid Profile",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "Thyroid Stimulating Hormone - TSH",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "COMMON-TESTS",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "Free Thyroid Profile",
        "testName": "TSH (Thyroid Stimulating Hormone)",
        "value": "",
        "units": "mIU/L"
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Volume",
        "value": "",
        "units": "mL"
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Colour",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Appearance",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Reaction",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Albumin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Sugar",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Blood (U)",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Acetone",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Ketone",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Urobilinogen",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Bile Salt",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Bile Pigment",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Nitrite",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Leucocyte",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Protein",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "RBCs",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Casts",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Crystals",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Routine - UA",
        "testName": "Others",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Specimen",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Colony Count",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Urine Wetmount",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Culture Yields",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Organisms Isolated",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Ciprofloxacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Cefepime",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Netillimicin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Co-Trimoxazole",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Gatifloxacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Ofloxacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Norfloxacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Gentamicin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Cefpodoxime",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Ceftazidime",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Amikacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Imipenum",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Piperacillin/Tazobactum",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Nitrofurantoin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Ceftazidime & Clavulanic Acid",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Lomefloxacin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Nalidixic Acid",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Cefuroxime",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Amoxycillin & Clavulanic Acid",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Urine Culture and Sensitivity",
        "testName": "Anti Microbial Agent",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Blood Widal Test",
        "testName": "Agglutination to Salmonella - Typhi O",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Blood Widal Test",
        "testName": "Agglutination to Salmonella - Typhi H",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Blood Widal Test",
        "testName": "Agglutination to S.Paratyphi AH",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Blood Widal Test",
        "testName": "Agglutination to S.Paratyphi BH",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Volume",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Colour",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Appearance",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Reaction",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Albumin",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Sugar",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Blood (U)",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Acetone",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Ketone",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Urobilinogen",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Bile Salt",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Bile Pigment",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Nitrite",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Leucocyte",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Protein",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "RBCs",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Casts",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Crystals",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Others",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Physical Examination",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Chemical Examination",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Complete Urine Evaluation - CUE",
        "testName": "Microscopic Examination",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum Triglycerides",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum HDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum VLDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Total Cholesterol/ HDL Ratio",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Non HDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Kidney Function Test - KFT",
        "testName": "Urine Creatinine",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Kidney Function Test - KFT",
        "testName": "Estimated Protein Excretion",
        "value": "",
        "units": "g/day"
    },
    {
        "reportName": "Kidney Function Test - KFT",
        "testName": "Urine Protein Excretion",
        "value": "",
        "units": "g/day"
    },
    {
        "reportName": "Kidney Function Test - KFT",
        "testName": "Protein/Creatinine Ratio",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Alkaline Phosphatase",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Bilirubin Total",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Bilirubin Direct",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Bilirubin Indirect",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "SGOT (AST)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "SGPT (AST)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Protein  Total",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Protein  Albumin",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Protein  Globulin",
        "value": "",
        "units": "g/dL"
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Serum Albumin/Globulin Ratio",
        "value": "",
        "units": ""
    },
    {
        "reportName": "Liver Function Tests - LFT",
        "testName": "Gamma Glutamyl Transpeptidase (GGT)",
        "value": "",
        "units": "IU/L"
    },
    {
        "reportName": "Spot Urine Sodium",
        "testName": "Spot Urine Sodium",
        "value": "",
        "units": "mmol/L"
    },
    {
        "reportName": "Spot Urine Electrolytes",
        "testName": "Spot Urine Sodium",
        "value": "",
        "units": "mmol/L"
    },
    {
        "reportName": "Spot Urine Electrolytes",
        "testName": "Spot Urine Potassium",
        "value": "",
        "units": "mmol/L"
    },
    {
        "reportName": "Fasting Lipid Profile  FLP",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Common Tests",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Urine Test",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Serum LDL Cholesterol",
        "testName": "LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "Non Fasting Lipid Profile",
        "testName": "Serum LDL Cholesterol (Non Fasting)",
        "value": "",
        "units": "mg/dL"
    },
    {
        "reportName": "ipad_test",
        "testName": "Serum LDL Cholesterol",
        "value": "",
        "units": "mg/dL"
    }
]

