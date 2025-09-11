import config from "../../../config";
import api from "../axiosService";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiConsultantNotes = {};

ApiConsultantNotes.getConsultantNotes = function ({ patientId }) {
  return api.get(`/consultant-notes?patientId=${patientId}`, baseUrl);
};

ApiConsultantNotes.updateConsultantNotes = function ({ patientId, _id, data }) {
  return api.put(
    `/consultant-notes?patientId=${patientId}${_id ? `&_id=${_id}` : ""}`,
    data,
    baseUrl
  );
};

export default ApiConsultantNotes;
