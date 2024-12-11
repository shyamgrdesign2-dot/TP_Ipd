import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.bulk_messages };

const ApiBulkMessages = {};

ApiBulkMessages.userCredit = function () {
    return api.get(`/api/v1/communication/userCredit`, baseUrl);
};

ApiBulkMessages.userCampaign = function (data) {
    return api.post(`/api/v1/campaign/userCampaign`, data, baseUrl);
};

ApiBulkMessages.userCampaignDetails = function (id) {
    return api.get(`/api/v1/campaign/userCampaign/${id}`, baseUrl);
};

ApiBulkMessages.listAllTemplate = function () {
    return api.get(`/api/v1/communication/listAllTemplate`, baseUrl);
};

ApiBulkMessages.listDoctor = function () {
    return api.get(`/api/v1/doctor`, baseUrl);
};

ApiBulkMessages.searchPatient = function (data) {
    return api.post(`/api/v1/patient/searchPatient`, data, baseUrl);
};

ApiBulkMessages.userCampaignAdd = function (data) {
    return api.post(`/api/v1/campaign/userCampaignAdd`, data, baseUrl);
};

ApiBulkMessages.userCampaignEdit = function (data) {
    return api.put(`/api/v1/campaign/userCampaignEdit`, data, baseUrl);
};

ApiBulkMessages.userCampaignDelete = function (id) {
    return api.delete(`/api/v1/campaign/userCampaignDelete/${id}`, baseUrl);
};

ApiBulkMessages.paymentOrder = function (data) {
    return api.post(`/api/v1/payment/paymentOrder`, data, baseUrl);
};

ApiBulkMessages.verifyPayment = function (data) {
    return api.post(`/api/v1/payment/verifyPayment`, data, baseUrl);
};

ApiBulkMessages.paymentHistory = function (data) {
    return api.post(`/api/v1/payment/paymentHistory`, data, baseUrl);
};

export default ApiBulkMessages;