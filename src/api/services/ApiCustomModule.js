import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_api_url };

const ApiCustomModule = {};

ApiCustomModule.addModule = function (template) {
  return api.post(`/dynamicmodules/user_modules`, template, baseUrl);
};

ApiCustomModule.getModules = function (userId) {
  return api.get(`/dynamicmodules/user_modules/${userId}`, baseUrl);
};

ApiCustomModule.getModuleContents = function (tcmId) {
  return api.get(`/dynamicmodules/user_modules_rx/${tcmId}`, baseUrl);
};

ApiCustomModule.searchModule = function (moduleId, keyword) {
  return api.get(
    `/dynamicmodules/user_modules_rx/search?module_id=${moduleId}${
      keyword ? `&keyword=${keyword}` : ""
    }`,
    baseUrl
  );
};

ApiCustomModule.userPreModulesRX = function (data) {
  return api.post(`/dynamicmodules/user_pre_modules_rx`, data, baseUrl);
};

export default ApiCustomModule;
