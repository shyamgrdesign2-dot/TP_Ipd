import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.appointment_api_url }

const ApiMedicalCertificate = {};

ApiMedicalCertificate.listCertificate = function () {
  return api.get(`/api/v1/appointment/listCertificate`, baseUrl);
};

export default ApiMedicalCertificate;
