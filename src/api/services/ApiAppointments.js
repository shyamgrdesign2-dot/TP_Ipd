import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.appointment_api_url }

const ApiAppointments = {};

ApiAppointments.getAll = function (params) {
  return api.post(`/api/v1/appointment/listAppointment`, params, baseUrl);
};

ApiAppointments.search = function (query) {
  return api.post(`/api/v1/appointment/searchPatient`, {
    search: query
  },
    baseUrl);
};

ApiAppointments.getProfile = function () {
  return api.get(`/api/v1/appointment/showProfile`, baseUrl);
};

ApiAppointments.searchPincode = function (body) {
  return api.post(`/api/v1/appointment/searchPincode`, body, baseUrl);
};

ApiAppointments.addPatient = function (formData) {
  return api.post(`/api/v1/appointment/addPatient`, formData, baseUrl);
};

export default ApiAppointments;
