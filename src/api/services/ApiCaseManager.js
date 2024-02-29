import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.casemanager_api_url }

const ApiCaseManager = {};

ApiCaseManager.oneClickAddTemplate = function (template) {
    return api.post(`/api/v1/casemanager/oneclickAddTemplate`, template, baseUrl);
};

ApiCaseManager.oneClickUpdateTemplate = function (template) {
    return api.post(`/api/v1/casemanager/oneclickEditTemplate`, template, baseUrl);
};

ApiCaseManager.oneClickDeleteTemplate = function (templateId) {
    return api.get(`/api/v1/casemanager/oneclickDeleteTemplate/${templateId}`, baseUrl);
};

ApiCaseManager.oneClickTemplatesList = function (query) {
    return api.get(`/api/v1/casemanager/oneclickTemplateList`, baseUrl);
};

ApiCaseManager.oneClickSingleTemplateDetails = function (templateId) {
    return api.get(`/api/v1/casemanager/oneclickSingleTemplateDetails/${templateId}`, baseUrl);
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

ApiCaseManager.sendCashsheetWhatsapp = function (data) {
    return api.post(`/api/v1/casemanager/sendCashsheetWhatsapp`, data, baseUrl);
};

export default ApiCaseManager;