import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.ipd_api_url };
const IpdService = {};

IpdService.getPatients = function (params = {}) {
  return api.get(
    `/patients?page=${params.page}&limit=${params.limit}&search=${params.search}&ward=${params.ward}&patientId=${params.patientId}&startDate=${params.startDate}&endDate=${params.endDate}&doctorIdsFilter=${params.doctorIdsFilter}&sort=${params.sort}&isDischarged=${params.isDischarged}`,
    baseUrl
  );
};

IpdService.getFilters = function (params = {}) {
  return api.get(`/patients/filters?field=${params.field}`, baseUrl);
};

export default IpdService;
