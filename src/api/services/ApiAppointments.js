import api from "./axiosService";
import config from "../../config";
import { generateMockData } from "../../utils/utils";
import { IS_DEV } from "../../utils/constants";

const baseUrl = { customBaseUrl: config.appointment_api_url };

const ApiAppointments = {};

// ApiAppointments.getAll = function (params) {
//   if (IS_DEV) {
//     return {
//       status: true,
//       data: {
//         queue_count: 34,
//         finished_count: 22,
//         cancelled_count: 41,
//         app_data: generateMockData(),
//       },
//     };
//   } else {
//     return api.post(`/api/v1/appointment/listAppointment`, params, baseUrl);
//   }
// };

ApiAppointments.getProfile = function () {
  return api.get(`/api/v1/appointment/showProfile`, baseUrl);
};

ApiAppointments.changeHospital = function (data) {
  return api.post(`/api/v1/appointment/changeHospital`, data, baseUrl);
};

ApiAppointments.getCaseTypes = function () {
  return api.post(`/api/v1/appointment/listCasetype`, {}, baseUrl);
};

ApiAppointments.getAllAppointment = function (data) {
  return api.post(`/api/v1/appointment/listAppointment`, data, baseUrl);
};

ApiAppointments.cancelAppointments = function (data) {
  return api.post(`/api/v1/appointment/cancelAppointment`, data, baseUrl);
};

ApiAppointments.endVisit = function (data) {
  return api.post(`/api/v1/appointment/endVisit`, data, baseUrl);
};

ApiAppointments.searchPatients = function (query) {
  return api.post(
    `/api/v1/appointment/searchPatient`,
    {
      search: query,
    },
    baseUrl
  );
};

ApiAppointments.listSalutation = function () {
  return api.get(`/api/v1/appointment/showSalutation`, baseUrl);
};

ApiAppointments.searchPincode = function (body) {
  return api.post(`/api/v1/appointment/searchPincode`, body, baseUrl);
};

ApiAppointments.addPatient = function (formData) {
  return api.post(`/api/v1/appointment/addPatient`, formData, baseUrl);
};

ApiAppointments.editPatient = function (data) {
  return api.post(`/api/v1/appointment/editPatient`, data, baseUrl);
};

ApiAppointments.viewPatient = function (data) {
  return api.post(`/api/v1/appointment/viewPatient`, data, baseUrl);
};

ApiAppointments.customizedPad = function (data) {
  return api.post(`/api/v1/appointment/customizedPad`, data, baseUrl);
};

ApiAppointments.swtichLayout = function (data) {
  return api.post(`/api/v1/appointment/swtichLayout`, data, baseUrl);
};

ApiAppointments.navigatetoTatvaPedia = function () {
  return api.post(`/api/v1/appointment/navigatetoTatvaPedia`, {}, baseUrl);
};


export default ApiAppointments;