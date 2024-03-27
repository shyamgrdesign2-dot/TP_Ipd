import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.printsettings_api_url }

const ApiPrintSettings = {};

ApiPrintSettings.getDefaultPrintsettings = function () {
    return api.post(`/api/v1/printsettings/getDefaultPrintsettings`,{default:true}, baseUrl);
};

ApiPrintSettings.savePrintsettings = function (formData) {
    return api.post(`/api/v1/printsettings/savePrintsettings`, formData, baseUrl);
};

export default ApiPrintSettings;
