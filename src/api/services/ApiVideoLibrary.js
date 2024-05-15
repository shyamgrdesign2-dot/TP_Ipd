import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.videolibrary_api_url }

const ApiVideoLibrary = {};

ApiVideoLibrary.listVideo = function () {
  return api.get(`/api/v1/videolibrary/listVideo`, baseUrl);
};

export default ApiVideoLibrary;
