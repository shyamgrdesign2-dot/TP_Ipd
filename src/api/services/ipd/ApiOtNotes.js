import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiOtNotes = {};

ApiOtNotes.getOtNotesData = function ({ patientId }) {
  return api.get(`/ot-notes?patientId=${patientId}`, baseUrl);
};

ApiOtNotes.addOtNotesData = function ({ patientId, data }) {
  return api.post(`/ot-notes?patientId=${patientId}`, data, baseUrl);
};

ApiOtNotes.updateOtNotesData = function ({ patientId, data }) {
  return api.put(`/ot-notes?patientId=${patientId}`, data, baseUrl);
};

export default ApiOtNotes;
