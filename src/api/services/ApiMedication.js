import api from "./axiosService";
import config from '../../config';

const baseUrl = { customBaseUrl: config.medication_api_url }
const doseBaseUrl = { customBaseUrl: config.upload_doc_api_url }

const ApiMedication = {};

ApiMedication.addTemplate = function (template) {
  return api.post(`/api/v1/medicine/addTemplate`, template, baseUrl);
};

ApiMedication.updateTemplate = function (template) {
  return api.post(`/api/v1/medicine/editTemplate`, template, baseUrl);
};

ApiMedication.deleteTemplate = function (templateId) {
  return api.get(`/api/v1/medicine/deleteTemplate/${templateId}`, baseUrl);
};

ApiMedication.getMedicationTemplates = function () {
  return api.get(`/api/v1/medicine/listTemplate`, baseUrl);
};

ApiMedication.singleTemplateDetails = function (templateId) {
  return api.get(`/api/v1/medicine/singleTemplateDetails/${templateId}`, baseUrl);
};

ApiMedication.getMedicineDetails = function (query) {
  return api.post(`/api/v1/medicine/getMedicineDetails`, {
    tmm_id: query
  }, baseUrl);
};

ApiMedication.getFrequentlySearchedMedication = function () {
  return api.get(`/api/v1/medicine/frequentlyMedicine`, baseUrl);
};

// ApiMedication.getFrequentlySearchedMedication = function () {
//   return api.post(`/api/v1/medicine/searchMedicine`, {
//     search: "dolo"
//   }, baseUrl);
// };

ApiMedication.searchMedication = function (query) {
  return api.post(`/api/v1/medicine/searchMedicine`, {
    search: query
  }, baseUrl);
};

ApiMedication.showMedicineFrequency = function () {
  return api.get(`/api/v1/medicine/showMedicineFrequency`, baseUrl);
};

ApiMedication.showMedicineTime = function () {
  return api.get(`/api/v1/medicine/showMedicineTime`, baseUrl);
};

ApiMedication.getMedicineType = function () {
  return api.get(`/api/v1/medicine/getMedicineType`, baseUrl);
};

ApiMedication.searchGeneric = function (query) {
  return api.post(`/api/v1/medicine/searchGeneric`, {
    search: query
  }, baseUrl);
};

ApiMedication.addMedicine = function (data) {
  return api.post(`/api/v1/medicine/addMedicine`, data, baseUrl);
};

ApiMedication.editMedicine = function (data) {
  return api.post(`/api/v1/medicine/editMedicine`, data, baseUrl);
};

ApiMedication.getLoadPreviousRx = function (data) {
  return api.post(`/api/v1/medicine/getLoadPreviousRx`, data, baseUrl);
};

ApiMedication.getAllDoses = function () {
  return api.get(`/api/v1/doses`, doseBaseUrl);
};

ApiMedication.createDose = function (data) {
  return api.post(`/api/v1/doses`, data, doseBaseUrl);
};

ApiMedication.updateDose = function (data) {
  return api.put(`/api/v1/doses/${data?.id}`, data, doseBaseUrl);
};

ApiMedication.deleteDose = function (id) {
  return api.delete(`/api/v1/doses/${id}`, doseBaseUrl);
};

export default ApiMedication;