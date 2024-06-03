import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.appointment_api_url }

const ApiMedicalCertificate = {};

ApiMedicalCertificate.listCertificate = function () {
  return api.get(`/api/v1/appointment/listCertificate`, baseUrl);
};

ApiMedicalCertificate.addPatientCertificate = function (data) {
  return api.post(`/api/v1/appointment/addPatientCertificate`, data, baseUrl);
};

ApiMedicalCertificate.addCertificate = function (data) {
  return api.post(`/api/v1/appointment/addCertificate`, data, baseUrl);
};

export default ApiMedicalCertificate;
