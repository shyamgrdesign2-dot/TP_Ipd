import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiCrossReferral = {};

ApiCrossReferral.getCrossReferral = function ({ patientId, admissionId, filterStartDate, filterEndDate, _id }) {
  let url = `/cross-referral?patientId=${patientId}&admissionId=${admissionId}`;
  if (filterStartDate) url += `&filterStartDate=${filterStartDate}`;
  if (filterEndDate) url += `&filterEndDate=${filterEndDate}`;
  if (_id) url += `&_id=${_id}`;
  return api.get(url, baseUrl);
};

ApiCrossReferral.addCrossReferral = function ({ patientId, admissionId, data }) {
  return api.post(`/cross-referral?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
};

ApiCrossReferral.updateCrossReferral = function ({ patientId, admissionId, _id, data }) {
  
return api.put(`/cross-referral?patientId=${patientId}&admissionId=${admissionId}${_id ? `&_id=${_id}` : ''}`, data, baseUrl);
};

export default ApiCrossReferral;
