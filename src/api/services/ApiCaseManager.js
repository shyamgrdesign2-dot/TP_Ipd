import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.casemanager_api_url }

const ApiCaseManager = {};
const smartrxUrl = "http://192.168.29.94:3012"

ApiCaseManager.oneClickAddTemplate = function (template) {
    return api.post(`/api/v1/casemanager/oneclickAddTemplate`, template, baseUrl);
};

ApiCaseManager.oneClickUpdateTemplate = function (template) {
    return api.post(`/api/v1/casemanager/oneclickEditTemplate`, template, baseUrl);
};

ApiCaseManager.oneClickDeleteTemplate = function (templateId) {
    return api.get(`/api/v1/casemanager/oneclickDeleteTemplate/${templateId}`, baseUrl);
};

ApiCaseManager.oneClickTemplatesList = function () {
    return api.get(`/api/v1/casemanager/oneclickTemplateList`, baseUrl);
};

ApiCaseManager.oneClickSingleTemplateDetails = function (templateId) {
    return api.get(`/api/v1/casemanager/oneclickSingleTemplateDetails/${templateId}`, baseUrl);
};

ApiCaseManager.addFollowupTemplate = function (template) {
    return api.post(`/api/v1/casemanager/addFollowupTemplate`, template, baseUrl);
};

ApiCaseManager.editFollowupTemplate = function (template) {
    return api.post(`/api/v1/casemanager/editFollowupTemplate`, template, baseUrl);
};

ApiCaseManager.deleteFollowupTemplate = function (templateId) {
    return api.get(`/api/v1/casemanager/deleteFollowupTemplate/${templateId}`, baseUrl);
};

ApiCaseManager.listFollowupTemplate = function () {
    return api.get(`/api/v1/casemanager/listFollowupTemplate`, baseUrl);
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

ApiCaseManager.getSmartRxToken = function (data) {
    return api.get(`/api/v1/casemanager/smartrx/token`, data, smartrxUrl);
};

ApiCaseManager.getSmartRx = function (data) {
    return api.get(`/api/v1/casemanager/smartrx`, data, smartrxUrl);
};

ApiCaseManager.saveSmartRx = function (data) {
    return api.post(`/api/v1/casemanager/smartrx`, data, smartrxUrl);
};

ApiCaseManager.sendSmartRxLinkOnWhatsapp = function (data) {
    return api.post(`/api/v1/casemanager/smartrx/send`, data, smartrxUrl);
};

export default ApiCaseManager;