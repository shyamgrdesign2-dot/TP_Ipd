import api from "./axiosService";

const ApiAppointments = {};

ApiAppointments.getAll = function (params) {
  console.log(params);
  return api.post(`/api/v1/appointment/listAppointment`, params);
};

ApiAppointments.search = function (query) {
  console.log(query);
  return api.post(`/api/v1/appointment/searchPatient`, {
    search: query,
  });
};

ApiAppointments.getProfile = function () {
  return api.get(`/api/v1/appointment/showProfile`);
};

ApiAppointments.searchPincode = function (body) {
  return api.post(`/api/v1/appointment/searchPincode`, body);
};

export default ApiAppointments;
