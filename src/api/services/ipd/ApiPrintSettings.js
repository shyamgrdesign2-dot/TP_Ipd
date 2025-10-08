import config from "../../../config";
import api from "../axiosService";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiPrintSettings = {};

ApiPrintSettings.getPrintSettings = function () {
  return api.get(`/print-settings`, baseUrl);
};

ApiPrintSettings.getFileUrlByFilename = function ({ filename }) {
  return api.get(`/print-settings/upload?filename=${filename}`, baseUrl);
};

ApiPrintSettings.uploadFile = function ({ file }) {
  return api.put(`/print-settings/upload`, file, baseUrl);
};

ApiPrintSettings.updatePrintSettings = function ({ printSettings }) {
  return api.put(`/print-settings`, printSettings, baseUrl);
};

export default ApiPrintSettings;
