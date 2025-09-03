import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiAssessment = {};

ApiAssessment.getAssessmentsData = function ({
    patientId,
}) {
  return api.get(
    `/api/v1/assessments?patientId=${patientId}`,
    baseUrl
  );
};

export default ApiAssessment;