import api from "./axiosService";

const ApiAppointments = {};

ApiAppointments.getAll = function (params) {
  console.log(params);
  return api.post(`/api/v1/appointment/listAppointment`, params);
};

ApiAppointments.search = function (query) {
  return api.post(`/api/v1/appointment/searchPatient`, {
    search: query,
  });
};

ApiAppointments.searchDiagnosis = function (query) {
  return api.post(`/api/v1/diagnosis/searchDiagnosis`, {
    search: query,
  });
};

ApiAppointments.getDiagnosisTemplates = function (query) {
  return api.get(`/api/v1/diagnosis/listTemplate`);
};

ApiAppointments.addTemplate = function (template) {
  return api.post(`/api/v1/diagnosis/addTemplate`, template);
};

ApiAppointments.getProfile = function () {
  return api.get(`/api/v1/appointment/showProfile`);
};

ApiAppointments.searchPincode = function (body) {
  return api.post(`/api/v1/appointment/searchPincode`, body);
};

ApiAppointments.addPatient = function (formData) {
  return api.post(`/api/v1/appointment/addPatient`, formData);
};

export default ApiAppointments;
