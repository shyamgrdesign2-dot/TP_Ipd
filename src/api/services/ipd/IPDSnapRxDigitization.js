import api from "../axiosService";
import config from "../../../config";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const IPDSnapRxDigitization = {};

IPDSnapRxDigitization.generateFileUploadToken = function ({
  patientId,
  admissionId,
}) {
  return api.get(
    `/ai/smart-rx/snap-rx/generate-file-upload-token?patientId=${patientId}&admissionId=${admissionId}`,
    baseUrl
  );
};

IPDSnapRxDigitization.uploadSnapRxFiles = function (data) {
  const {
    files,
    fileUploadToken,
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

  return api.post(
    `/ai/smart-rx/snap-rx/upload-files`,
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
    
  } = data;

  

  const query = [];
  if (patientId) query.push(`patientId=${patientId}`);
  if (admissionId) query.push(`admissionId=${admissionId}`);
  if (sessionId) query.push(`sessionId=${sessionId}`);
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
    timeout: 120000,
  };

  return api.post(
    `/ai/smart-rx?schemaKey=${schemaKey}&needGrounding=true&model=gemini`,
    data,
    configWithHeaders
  );
};

export default IPDSnapRxDigitization;
