import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.monetization_url };
const baseTatvaAiUrl = { customBaseUrl: config.tatvaAi_api_url };
const baseUserManagementUrl = {
    customBaseUrl: config.user_management_api_url,
    headers: {
        api_key: config.lite_api_key,
        api_secret_key: config.lite_secret_key,
    }
};

const cloneBaseUserManagementUrl = {
    customBaseUrl: config.user_management_api_url,
    headers: {
        api_key: config.api_key,
        api_secret_key: config.api_secret_key,
    },
};

const ApiMonetization = {};

ApiMonetization.campaigns = function () {
    return api.get(`/api/v1/monetization/campaigns`, baseUrl);
};

ApiMonetization.services = function (b2c_id) {
    return api.get(`/api/v1/monetization/services?b2c_id=${b2c_id}`, baseUrl);
};

ApiMonetization.kamList = function (data) {
    return api.post(`/user/tatva/kam-list`, data, baseUserManagementUrl);
};

ApiMonetization.otpSend = function (data) {
    return api.post(`/api/v1/onboarding/otp/send`, data, baseTatvaAiUrl);
};

ApiMonetization.otpVerify = function (data) {
    return api.post(`/api/v1/onboarding/otp/verify`, data, baseTatvaAiUrl);
};

ApiMonetization.paymentOrder = function (data) {
    return api.post(`/api/v1/payment/create-order`, data, baseUrl);
};

ApiMonetization.verifyPayment = function (data) {
    return api.post(`/api/v1/payment/verify-payment`, data, baseUrl);
};

ApiMonetization.purchaseDetails = function (data) {
    return api.post(`/api/v1/monetization/purchase-details?b2c_id=${data.b2c_id}`, data, baseUrl);
};

ApiMonetization.plans = function (b2c_id) {
    return api.get(`/api/v1/monetization/plans?b2c_id=${b2c_id}`, baseUrl);
};

ApiMonetization.checkCredits = function (data) {
    return api.get(`/api/v1/monetization/credits?b2c_id=${data?.b2c_id}&service_name=${data?.service_name}`, baseUrl);
};

ApiMonetization.updateCredits = function (data) {
    return api.put(`/api/v1/monetization/credits?b2c_id=${data?.b2c_id}&service_name=${data?.service_name}`, { action: "DECREASE" }, baseUrl);
};

ApiMonetization.extendFreeTrial = function (b2c_id) {
    return api.get(`/user/pm/info/extend?b2c_id=${b2c_id}`, cloneBaseUserManagementUrl);
};

ApiMonetization.billingHistory = function (b2c_id) {
    return api.get(`/api/v1/monetization/billing-history?b2c_id=${b2c_id}`, baseUrl);
};

ApiMonetization.interest = function (data) {
    return api.post(`/user/tatva/interest`, data, baseUserManagementUrl);
};

ApiMonetization.invoiceGenerate = function (invoice_id) {
    return api.get(`/user/tatva/invoice/${invoice_id}`, baseUserManagementUrl);
};

export default ApiMonetization;