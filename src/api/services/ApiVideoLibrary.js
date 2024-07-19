import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.videolibrary_api_url }

const ApiVideoLibrary = {};

ApiVideoLibrary.listVideo = function () {
  return api.get(`/api/v1/videolibrary/listVideo`, baseUrl);
};

ApiVideoLibrary.viewDoctorWebsite = function () {
  return api.get(`/api/v1/doctorwebsite/viewDoctorWebsite`, baseUrl);
};

ApiVideoLibrary.listLanguage = function () {
  return api.get(`/api/v1/doctorwebsite/listLanguage`, baseUrl);
};

export default ApiVideoLibrary;
