import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.medicalhistory_api_url }

const ApiMedicalHistory = {};

ApiMedicalHistory.listSectionwithTag = function () {
  return api.get(`/api/v1/medicalhistory/listSectionwithTag`, baseUrl);
};

ApiMedicalHistory.addTag = function (data) {
  return api.post(`/api/v1/medicalhistory/addTag`, data, baseUrl);
};

ApiMedicalHistory.searchTag = function (data) {
  return api.post(`/api/v1/medicalhistory/searchTag`, data, baseUrl);
};

export default ApiMedicalHistory;
