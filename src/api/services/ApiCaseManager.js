import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.casemanager_api_url }

const ApiCaseManager = {};

ApiCaseManager.addTemplate = function (template) {
    return api.post(`/api/v1/casemanager/addTemplate`, template, baseUrl);
};

ApiCaseManager.updateTemplate = function (template) {
    return api.post(`/api/v1/casemanager/editTemplate`, template, baseUrl);
};

ApiCaseManager.deleteTemplate = function (templateId) {
    return api.get(`/api/v1/casemanager/deleteTemplate/${templateId}`, baseUrl);
};

ApiCaseManager.getOneClickTemplates = function (query) {
    return api.get(`/api/v1/casemanager/oneclickTemplateList`, baseUrl);
};

ApiCaseManager.singleOneClickTemplateDetails = function (templateId) {
    return api.get(`/api/v1/casemanager/singleOneClickTemplateDetails/${templateId}`, baseUrl);
};

ApiCaseManager.addCaseManager = function (data) {
    return api.post(`/api/v1/casemanager/addCaseManager`, data, baseUrl);
};

ApiCaseManager.editCaseManager = function (data) {
    return api.post(`/api/v1/casemanager/editCaseManager`, data, baseUrl);
};

ApiCaseManager.viewCaseManager = function (data) {
    return api.post(`/api/v1/casemanager/viewCaseManager`, data, baseUrl);
};

export default ApiCaseManager;