import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.monetization_url };

const ApiMonetization = {};

ApiMonetization.campaigns = function () {
    return api.get(`/api/v1/monetization/campaigns`, baseUrl);
};

ApiMonetization.services = function (b2c_id) {
    return api.get(`/api/v1/monetization/services?b2c_id=${b2c_id}`, baseUrl);
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

ApiMonetization.billingHistory = function (b2c_id) {
    return api.get(`/api/v1/monetization/billing-history?b2c_id=${b2c_id}`, baseUrl);
};

export default ApiMonetization;