import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiAssessment = {};

ApiAssessment.getAssessmentsData = function ({ patientId, admissionId }) {
  return api.get(`/assessments?patientId=${patientId}&admissionId=${admissionId}`, baseUrl);
};

ApiAssessment.addAssessmentsData = function ({ patientId, admissionId, data }) {
  return api.post(`/assessments?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
};

ApiAssessment.updateAssessmentsData = function ({ patientId, admissionId, data }) {
  return api.put(`/assessments?patientId=${patientId}&admissionId=${admissionId}`, data, baseUrl);
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
