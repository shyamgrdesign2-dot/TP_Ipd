import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.medication_api_url }

const ApiMedication = {};

ApiMedication.addTemplate = function (template) {
    return api.post(`/api/v1/medicine/addTemplate`, template, baseUrl);
};

ApiMedication.updateTemplate = function (template) {
    return api.post(`/api/v1/medicine/editTemplate`, template, baseUrl);
};

ApiMedication.deleteTemplate = function (templateId) {
  return api.get(`/api/v1/medicine/deleteTemplate/${templateId}`, baseUrl);
};

ApiMedication.getMedicationTemplates = function (query) {
  return api.get(`/api/v1/medicine/listTemplate`, baseUrl);
};

ApiMedication.getFrequentlySearchedMedication = function () {
  return api.post(`/api/v1/medicine/searchMedicine`, {
      search: "dolo"
  }, baseUrl);
};

ApiMedication.searchMedication = function (query) {
  return api.post(`/api/v1/medicine/searchMedicine`, {
      search: query
  }, baseUrl);
};

export default ApiMedication;
