import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiProgressNotes = {};

ApiProgressNotes.getProgressNotes = function ({ patientId, admissionId }) {
  return api.get(`/progress-notes?patientId=${patientId}&admissionId=${admissionId}`, baseUrl);
};

// ApiProgressNotes.addProgressNotesData = function ({ patientId, admissionId, data }) {
//   return api.post(`/progress-notes?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
// };

// ApiProgressNotes.updateProgressNotesData = function ({ patientId, data }) {
//   return api.put(`/progress-notes?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
// };

ApiProgressNotes.updateProgressNotes = function ({
  patientId,
  admissionId,
  _id,
  data,
}) {
  return api.put(
    `/progress-notes?patientId=${patientId}&admissionId=${admissionId}${
      _id ? `&_id=${_id}` : ""
    }`,
    data,
    baseUrl
  );
};

export default ApiProgressNotes;
