import api from "./axiosService";

const ApiSymptoms = {};

ApiSymptoms.getTemplates = function (query) {
  return api.get(`/api/v1/symptoms/listTemplate`);
};

export default ApiSymptoms;
