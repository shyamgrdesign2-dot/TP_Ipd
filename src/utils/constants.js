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
export const PENDING_DIGITISATION_RX = "/api/v1/casemanager/unfinished-digitize-rx"
export const IS_RX_DIGI_API_CALL = false
export const FETCH_SMART_RX = "/api/v1/casemanager/smart-rx"
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
