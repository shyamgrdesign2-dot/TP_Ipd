import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.symptoms_api_url }

const ApiSymptoms = {};

ApiSymptoms.addTemplate = function (template) {
  return api.post(`/api/v1/symptoms/addTemplate`, template, baseUrl);
};

ApiSymptoms.updateTemplate = function (template) {
  return api.post(`/api/v1/symptoms/editTemplate`, template, baseUrl);
};

ApiSymptoms.deleteTemplate = function (templateId) {
  return api.get(`/api/v1/symptoms/deleteTemplate/${templateId}`, baseUrl);
};

ApiSymptoms.getSymptomsTemplates = function (query) {
  return api.get(`/api/v1/symptoms/listTemplate`, baseUrl);
};

ApiSymptoms.getFrequentlySearchedSymptoms = function () {
  return api.get(`/api/v1/symptoms/frequentlySymptoms`, baseUrl);
};

ApiSymptoms.searchSymptoms = function (query) {
  return api.post(`/api/v1/symptoms/searchSymptoms`, {
    search: query
  }, baseUrl);
};

export default ApiSymptoms;
