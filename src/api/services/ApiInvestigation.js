import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.investigation_api_url }

const ApiInvestigation = {};

ApiInvestigation.addTemplate = function (template) {
    return api.post(`/api/v1/investigation/addTemplate`, template, baseUrl);
};

ApiInvestigation.updateTemplate = function (template) {
    return api.post(`/api/v1/investigation/editTemplate`, template, baseUrl);
};

ApiInvestigation.deleteTemplate = function (templateId) {
  return api.get(`/api/v1/investigation/deleteTemplate/${templateId}`, baseUrl);
};

ApiInvestigation.getInvestigationTemplates = function (query) {
  return api.get(`/api/v1/investigation/listTemplate`, baseUrl);
};

ApiInvestigation.getFrequentlySearchedInvestigation = function () {
  return api.get(`/api/v1/investigation/frequentlyInvestigation`, baseUrl);
};

// ApiInvestigation.getFrequentlySearchedInvestigation = function () {
//   return api.post(`/api/v1/investigation/searchInvestigation`, {
//       search: "li"
//   }, baseUrl);
// };

ApiInvestigation.searchInvestigation = function (query) {
  return api.post(`/api/v1/investigation/searchInvestigation`, {
      search: query
  }, baseUrl);
};

export default ApiInvestigation;
