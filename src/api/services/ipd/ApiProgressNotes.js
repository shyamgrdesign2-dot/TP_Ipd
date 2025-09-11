import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiProgressNotes = {};

ApiProgressNotes.getProgressNotesData = function ({ patientId }) {
  return api.get(`/progress-notes?patientId=${patientId}`, baseUrl);
};

ApiProgressNotes.addProgressNotesData = function ({ patientId, data }) {
  return api.post(`/progress-notes?patientId=${patientId}`, data, baseUrl);
};

ApiProgressNotes.updateProgressNotesData = function ({ patientId, data }) {
  return api.put(`/progress-notes?patientId=${patientId}`, data, baseUrl);
};

export default ApiProgressNotes;
