import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.lab_params_api_url };

const LabParams = {};

ApiLabParams.addUpdateLabParams = function (data) {
  return api.post(`/api/v1/labParams/addLabParams`, data, baseUrl);
};

ApiLabParams.getLabParams = function (data) {
  return api.post(`/api/v1/labParams/listLabParams`, data, baseUrl);
};

export default ApiLabParams;
