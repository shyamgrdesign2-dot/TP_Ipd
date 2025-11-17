import config from "../../../config";
import api from "../axiosService";

const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiPrintSettings = {};

ApiPrintSettings.getPrintSettings = function ({ doctorId } = {}) {
  let url = `/print-settings`;
  if (doctorId) {
    url += `?doctorId=${encodeURIComponent(doctorId)}`;
  }
  return api.get(url, baseUrl);
};

ApiPrintSettings.getFileUrlByFilename = function ({ filename }) {
  return api.get(`/print-settings/upload?filename=${filename}`, baseUrl);
};

ApiPrintSettings.uploadFile = function ({ file }) {
  return api.put(`/print-settings/upload`, file, baseUrl);
};

ApiPrintSettings.updatePrintSettings = function ({ printSettings = {}, doctorId } = {}) {
  let url = `/print-settings`;
  if (doctorId) {
    url += `?doctorId=${encodeURIComponent(doctorId)}`;
  }
  return api.put(url, printSettings, baseUrl);
};

ApiPrintSettings.getDefaultPrintsettings = function ({ doctorId } = {}) {
  let url = `/print-settings/default`;
  if (doctorId) {
    url += `?doctorId=${encodeURIComponent(doctorId)}`;
  }
  return api.get(url, baseUrl);
};

export default ApiPrintSettings;
