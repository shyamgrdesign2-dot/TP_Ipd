import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.casemanager_api_url }

const ApiCaseManager = {};

ApiCaseManager.addCaseManager = function (data) {
    return api.post(`/api/v1/casemanager/addCaseManager`, data, baseUrl);
};

ApiCaseManager.viewCaseManager = function (data) {
    return api.post(`/api/v1/casemanager/viewCaseManager`, data, baseUrl);
};

export default ApiCaseManager;
