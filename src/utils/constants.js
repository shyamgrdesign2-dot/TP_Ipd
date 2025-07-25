import { v4 as uuidv4 } from "uuid";

export const PERSISTANT_STORAGE_KEY_AUTH_TOKEN =
  "persistant.storage.key.auth-token";
export const PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN =
  "persistant.storage.key.zydus-token";
export const PERSISTANT_STORAGE_KEY_MEDECO_TOKEN =
  "persistant.storage.key.medeco-token";
export const PERSISTANT_STORAGE_KEY_EXTRA = "persistant.storage.key.extra";
export const MESSAGE_KEY = "message_key";
export const IS_DEV = true;
export const PAGE_SIZE = 10;

export const TAB_QUEUE = 0;
export const TAB_FINISHED = 3;
export const TAB_CANCELLED = 4;
export const TAB_ZYDUS_ENCOUNTER = 11;
export const TAB_ZYDUS_APPOINTMENT = 12;

export const TAB_CAMPAIGN = 0;
export const TAB_DRAFT = 1;
export const TAB_PURCHASE = 2;

export const TAB_PRESCRIPTION = 1;
export const TAB_HEADER_FOOTER = 2;
export const TAB_PAGE_FORMAT = 3;

export const TAB_ADDRESS = "1";
export const TAB_TIMINGS = "2";
export const TAB_PHOTOS = "3";

export const ADD = "ADD";
export const EDIT = "EDIT";

export const NORMAL = "NORMAL";
export const WHATSAPP = "WHATSAPP";

export const WEBSOCKET_ADDRESS = "ws://localhost:5001/iScribeSocket";
export const WS_CONTROL_URL = "ws://localhost:5002/iScribeControlSocket";
export const WEBSOCKET_ERROR_MESSAGE =
  "Error connecting the server, Please check device connectivity";
export const WHATS_APP_API = "/api/v1/casemanager/smart-rx/send";
export const SMART_RX_UPLOAD = "/api/v1/casemanager/smart-rx/upload";
export const RX_DIGITIZATION = "/api/v1/rxdigitize/rx";
export const UNFINISHED_RX_CASE = "//api/v1/casemanager/get-ufinished-case";

export const LAB_PARAMS_RESULTS = "/api/v1/lab-parameters/results";
export const IS_RX_DIGI_API_CALL = false;
export const FETCH_SMART_RX = "/api/v1/casemanager/smart-rx";
export const OPD_API_KEY = "lChjFRJce3bxmoS3TSQk5w==";
export const WTSAP_ERR_MESSAGE =
  "Error sending the prescription, Please try again";

export const GB_ISCRIBE = "iscribe";
export const GB_SMARTSYNC_CONNECT = "smartsync-connect";
export const GB_SMARTSYNC_CVT = "smartsync-cvt";
export const GB_TALKATIVE = "Talkative";
export const GB_GYNEC_HISTORY = "obs-gynec-history";
export const GB_ZYDUS_USER = "zydus-hospital-user";
export const GB_PILLUP_MEDICINE = "pillup-medicine-switch";
export const GB_APOLLO_DISABLE_FEATURE = "apollo-disable-feature";

export const GYNAECOLOGY = "Gynaecology";
export const PAEDIATRICS = "Paediatrics";

export const FREE = "FREE";
export const TRIAL = "TRIAL";
export const PAID = "PAID";
export const PENDING = "PENDING";
export const APPROVED = "APPROVED";
export const REJECTED = "REJECTED";
export const FAILED_VERIFICATION = "FAILED-VERIFICATION";
export const PENDING_VERIFICATION = "PENDING-VERIFICATION";
export const S_TATVA_PRACTICE = "tatva_practice";
export const S_VOICE_RX = "voice_rx";
export const S_SMARTSYNC = "smartsync";
export const S_RX_DIGITIZATION = "rx_digitization";
export const S_DDX = "ddx";
export const S_ASK_TATVA = "ask_tatva";
export const S_BILLING = "billing";
export const S_PHARMACY = "pharmacy";
export const S_IPD = "ipd";
export const S_OPD_BILLING = "opd_billing";
export const S_RECEPTIONIST_AGENT = "receptionist_agent";

export const EXTRA_OPTIONS = [
  {
    key: JSON.stringify({
      value: "STAT",
      label: "Stat",
      tmm_days: parseInt(0),
      unique_id: uuidv4(),
    }),
    value: "STAT",
    label: "Stat",
  },
  {
    key: JSON.stringify({
      value: "to be continued",
      label: "To Be Continued",
      tmm_days: parseInt(0),
      unique_id: uuidv4(),
    }),
    value: "to be continued",
    label: "To Be Continued",
  },
  {
    key: JSON.stringify({
      value: "till required",
      label: "Till Required",
      tmm_days: parseInt(0),
      unique_id: uuidv4(),
    }),
    value: "till required",
    label: "Till Required",
  },
];

export const ABORTION = "Abortion";
export const MISCARRIAGE = "Miscarriage";
export const IS_DDX_DIAGNOSIS_OPEN = "isDdxDiagnosisOpen";
export const IS_DDX_LAB_INVESTIGATION_OPEN = "isDdxLabInvestigationOpen";

export const FONTS_FAMILY_LIST = [
  {
    value: "Times-Roman",
    label: <div className="fonttimesroman">Times Roman</div>,
  },
  {
    value: "Verdana",
    label: <div className="fontverdana">Verdana</div>,
  },
  {
    value: "Calibri",
    label: <div className="fontcalibri">Calibri</div>,
  },
  {
    value: "Tahoma",
    label: <div className="fonttahoma">Tahoma</div>,
  },
  {
    value: "Roboto",
    label: <div className="fontroboto">Roboto</div>,
  },
];

export const FONTS_SIZE_LIST = [
  {
    value: 8,
    label: "8",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 12,
    label: "12",
  },
  {
    value: 14,
    label: "14",
  },
  {
    value: 16,
    label: "16",
  },
];

export const PAEDIATRIC_DP_ID = 9;
