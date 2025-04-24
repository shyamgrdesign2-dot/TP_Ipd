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

export default ApiMonetization;