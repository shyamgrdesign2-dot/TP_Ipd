import api from "../axiosService";
import config from "../../../config";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const IPDSnapRxDigitization = {};

const getAuthToken = () => {
  try {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    return token ? JSON.parse(token) : null;
  } catch (e) {
    return null;
  }
};

IPDSnapRxDigitization.generateFileUploadToken = function ({
  patientId,
  admissionId,
  schemaKey,
}) {
  const query = [`patientId=${patientId}`, `admissionId=${admissionId}`];
  if (schemaKey) query.push(`form=${schemaKey}`);
  const authToken = getAuthToken();

  return api.get(
    `/ai/smart-rx/snap-rx/generate-file-upload-token?${query.join("&")}`,
    {
      ...baseUrl,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }
  );
};

IPDSnapRxDigitization.uploadSnapRxFiles = function (data) {
  const {
    files,
    fileUploadToken,
    schemaKey,
  } = data;

  const formData = new FormData();

  (files || []).forEach((f) => {
    formData.append("file", f.file || f);
  });


  const configWithHeaders = {
    ...baseUrl,
    headers: {
      Authorization: `Bearer ${fileUploadToken}`,
    },
    snapRxFileUpload: true,
    timeout: 120000,
  };

  const formQuery = schemaKey ? `?form=${schemaKey}` : "";
  console.log('INTEL ==> DATA in api call', data, formQuery)

  return api.post(
    `/ai/smart-rx/snap-rx/upload-files${formQuery}`,
    formData,
    configWithHeaders
  );
};

IPDSnapRxDigitization.getFiles = function (data = {}) {
  const {
    patientId,
    admissionId,
    sessionId,
    fileUploadToken,
    type,
    schemaKey,
    
  } = data;

  

  const query = [];
  if (patientId) query.push(`patientId=${patientId}`);
  if (admissionId) query.push(`admissionId=${admissionId}`);
  if (sessionId) query.push(`sessionId=${sessionId}`);
  const formKey = type || schemaKey;
  if (formKey) query.push(`form=${formKey}`);
  const qs = query.length ? `?${query.join("&")}` : "";

  const configWithHeaders = {
    ...baseUrl,
    headers: {
      ...(fileUploadToken ? { Authorization: `Bearer ${fileUploadToken}` } : {}),
    },
    ipdSnapRxGetFiles: true
  };

  return api.get(
    `/ai/smart-rx/snap-rx/get-session-files${qs}`,
    configWithHeaders
  );
};

IPDSnapRxDigitization.getFilesOnMobile = function (params) {
  return IPDSnapRxDigitization.getFiles(params);
};

IPDSnapRxDigitization.digitize = function ({
  schemaKey,
  data = {},
  fileUploadToken,
}) {
  const configWithHeaders = {
    ...baseUrl,
    headers: {
      "Content-Type": "application/json",
      ...(fileUploadToken ? { Authorization: `Bearer ${fileUploadToken}` } : {}),
    },
    ipdSnapRxGetFiles: true,
    timeout: 600000,
  };

  return api.post(
    `/ai/smart-rx?schemaKey=${schemaKey}&needGrounding=true&model=gemini${
      schemaKey ? `&form=${schemaKey}` : ""
    }`,
    data,
    configWithHeaders
  );
};

export default IPDSnapRxDigitization;
