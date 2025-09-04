import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };
const symptomTemplateBaseUrl = { customBaseUrl: config.symptoms_api_url };

const ApiIpdService = {};

ApiIpdService.getCustomization = function () {
  return api.get(
    `/customization`,
    baseUrl
  );
};

ApiIpdService.updateCustomization = function (data) {
    return api.put(
      `/customization`,
      data,
      baseUrl
    );
  };

ApiIpdService.fetchSingleTemplate = function ({templateId, type}) {
  return api.get(`/api/v1/${type}/singleTemplateDetails/${templateId}`, symptomTemplateBaseUrl); // TODO: INTEL - Change to ipd_api_url
};

export default ApiIpdService;