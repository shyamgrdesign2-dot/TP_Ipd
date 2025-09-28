import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiOtNotes = {};

ApiOtNotes.getOtNotes = function ({ patientId, admissionId, filterStartDate, filterEndDate, _id }) {
  let url = `/ot-notes?patientId=${patientId}&admissionId=${admissionId}`;
  if (filterStartDate) url += `&filterStartDate=${filterStartDate}`;
  if (filterEndDate) url += `&filterEndDate=${filterEndDate}`;
  if (_id) url += `&_id=${_id}`;
  return api.get(url, baseUrl);
};

ApiOtNotes.addOtNotes = function ({ patientId, admissionId, data }) {
  return api.post(`/ot-notes?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
};

ApiOtNotes.updateOtNotes = function ({ patientId, admissionId, _id, data }) {
  
  return api.put(`/ot-notes?patientId=${patientId}&admissionId=${admissionId}${_id ? `&_id=${_id}` : ''}`, data, baseUrl);
};

export default ApiOtNotes;
