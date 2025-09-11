import config from "../../../config";
import api from "../axiosService";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiConsultantNotes = {};

ApiConsultantNotes.getConsultantNotes = function ({ patientId, admissionId }) {
  return api.get(
    `/consultant-notes?patientId=${patientId}&admissionId=${admissionId}`,
    baseUrl
  );
};

ApiConsultantNotes.updateConsultantNotes = function ({
  patientId,
  admissionId,
  _id,
  data,
}) {
  return api.put(
    `/consultant-notes?patientId=${patientId}&admissionId=${admissionId}${
      _id ? `&_id=${_id}` : ""
    }`,
    data,
    baseUrl
  );
};

export default ApiConsultantNotes;
