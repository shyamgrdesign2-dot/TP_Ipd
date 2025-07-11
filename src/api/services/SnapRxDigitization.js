import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.snap_rx_api_url };

const SnapRxDigitization = {};

SnapRxDigitization.uploadSnapRxFiles = function ({
  file: fileObjects,
  patient_unique_id: patientId,
  session_id: sessionId,
}) {
  const formData = new FormData();

  fileObjects.forEach((f) => {
    formData.append("file", f.file);
  });
  formData.append("patient_unique_id", patientId);
  formData.append("session_id", sessionId);

  return api.post(
    `/api/v1/digitization/snap-rx/upload-files`,
    formData,
    baseUrl
  );
};

SnapRxDigitization.getFiles = function ({
  patient_unique_id: patientId,
  tcm_id: tcmId,
  session_id: sessionId,
}) {
  return api.get(
    `/api/v1/digitization/snap-rx/get-files?patient_unique_id=${patientId}${
      tcmId ? `&tcm_id=${tcmId}` : ""
    }${sessionId ? `&session_id=${sessionId}` : ""}`,
    baseUrl
  );
};

export default SnapRxDigitization;
