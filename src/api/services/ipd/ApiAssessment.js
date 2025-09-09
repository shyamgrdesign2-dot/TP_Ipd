import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiAssessment = {};

ApiAssessment.getAssessmentsData = function ({ patientId }) {
  return api.get(`/assessments?patientId=${patientId}`, baseUrl);
};

ApiAssessment.addAssessmentsData = function ({ patientId, data }) {
  return api.post(`/assessments?patientId=${patientId}`, data, baseUrl);
};

ApiAssessment.updateAssessmentsData = function ({ patientId, data }) {
  return api.put(`/assessments?patientId=${parseInt(patientId, 10)}`, data, baseUrl);
};

ApiAssessment.lastPrescriptionData = function ({ patientId, caseId }) {
  return api.get(
    `/assessments/prescriptions/last-prescription?patientId=${patientId}&caseId=${caseId}`,
    baseUrl
  );
};

ApiAssessment.lastPrescriptionDate = function ({ patientId }) {
  return api.get(
    `/assessments/prescriptions/last-prescription-date?patientId=${patientId}`,
    baseUrl
  );
};

export default ApiAssessment;
