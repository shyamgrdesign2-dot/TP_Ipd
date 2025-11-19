import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiCustomModule = {};

ApiCustomModule.getCustomModules = function ({ userId, form }) {
  return api.get(
    `/dynamic-modules/user_modules/${userId}?form=${form}`,
    baseUrl
  );
};

ApiCustomModule.getModuleContents = function ({ tcmId, data, form }) {
  return api.get(
    `/dynamic-modules/user_modules_rx/${tcmId}?form=${form}`,
    data,
    baseUrl
  );
};

ApiCustomModule.searchModule = function ({ moduleId, keyword, form }) {
  return api.get(
    `/dynamic-modules/search_user_modules_rx?module_id=${moduleId}&keyword=${keyword}&form=${form}`,
    baseUrl
  );
};

ApiCustomModule.updateModules = function ({ data }) {
  return api.post(`/dynamic-modules/user_modules`, data, baseUrl);
};

ApiCustomModule.updateModuleContents = function ({ data }) {
  return api.put(`/dynamic-modules/user_modules_rx`, data, baseUrl);
};

ApiCustomModule.deleteModule = function ({ userId, moduleId, form }) {
  return api.delete(
    `/dynamic-modules/user_modules/${userId}?form=${form}&module_id=${moduleId}`,
    baseUrl
  );
};

export default ApiCustomModule;
