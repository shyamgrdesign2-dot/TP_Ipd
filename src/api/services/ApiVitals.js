import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.vitals_api_url }

const ApiVitals = {};

ApiVitals.addUpdateVitals = function (data) {
    return api.post(`/api/v1/vital/addVitals`, data, baseUrl);
};

ApiVitals.getVitals = function (data) {
    return api.post(`/api/v1/vital/listVitals`, data, baseUrl);
};

export default ApiVitals;
