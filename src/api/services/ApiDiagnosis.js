import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.diagnosis_api_url }

const ApiDiagnosis = {};

ApiDiagnosis.addTemplate = function (template) {
    return api.post(`/api/v1/diagnosis/addTemplate`, template, baseUrl);
};

ApiDiagnosis.updateTemplate = function (template) {
    return api.post(`/api/v1/diagnosis/editTemplate`, template, baseUrl);
};

ApiDiagnosis.deleteTemplate = function (templateId) {
    return api.get(`/api/v1/diagnosis/deleteTemplate/${templateId}`, baseUrl);
};

ApiDiagnosis.getDiagnosisTemplates = function (query) {
    return api.get(`/api/v1/diagnosis/listTemplate`, baseUrl);
};

ApiDiagnosis.getFrequentlySearchedDiagnosis = function () {
  return api.get(`/api/v1/diagnosis/frequentlyDiagnosis`, baseUrl);
};

// ApiDiagnosis.getFrequentlySearchedDiagnosis = function () {
//     return api.post(`/api/v1/diagnosis/searchDiagnosis`, {
//         search: "ches"
//     }, baseUrl);
// };

ApiDiagnosis.searchDiagnosis = function (query) {
    return api.post(`/api/v1/diagnosis/searchDiagnosis`, {
        search: query
    }, baseUrl);
};

export default ApiDiagnosis;
