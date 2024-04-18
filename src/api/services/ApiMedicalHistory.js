import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.medicalhistory_api_url }

const ApiMedicalHistory = {};

ApiMedicalHistory.listSectionwithTag = function () {
  return api.get(`/api/v1/medicalhistory/listSectionwithTag`, baseUrl);
};

export default ApiMedicalHistory;
