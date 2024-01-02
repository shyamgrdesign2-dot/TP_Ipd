import api from "./axiosService";
import config from "../../config";
import { generateMockData } from "../../utils/utils";
import { IS_DEV } from "../../utils/constants";

const baseUrl = { customBaseUrl: config.appointment_api_url };

const ApiAppointments = {};

ApiAppointments.getAll = function (params) {
  console.log('Params: ', params);
  if (IS_DEV) {
    return {
      status: true,
      data: {
        queue_count: 34,
        finished_count: 22,
        cancelled_count: 41,
        app_data: generateMockData(),
      },
    };
  } else {
    return api.post(`/api/v1/appointment/listAppointment`, params, baseUrl);
  }
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

ApiAppointments.cancelAppointments = function (body) {
  return api.post(`/api/v1/appointment/cancelAppointment`, body, baseUrl);
};

ApiAppointments.changeHospital = function (body) {
  return api.post(`/api/v1/appointment/changeHospital`, body, baseUrl);
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

ApiAppointments.endVisit = function (appointment) {
  return api.post(`/api/v1/appointment/cancelAppointment`, appointment, baseUrl);
};

ApiAppointments.getCaseTypes = function () {
  return api.post(`/api/v1/appointment/listCasetype`, {}, baseUrl);
};

ApiAppointments.listSalutation = function () {
  return api.get(`/api/v1/appointment/showSalutation`, baseUrl);
};

export default ApiAppointments;
