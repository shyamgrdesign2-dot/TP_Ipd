import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.lab_params_api_url };

export const fetchPrintSetting = async function () {
  let res = {};
  try {
    res = await api.get(`/api/v1/billing/printSetting`, baseUrl);
  } catch (e) {
    console.error("Error while fetching Print settings details: ", e);
  }
  return res;
};

export const updatePrintSetting = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/printSetting`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updating Billing Print Setting Data: ", e);
  }
  return res;
};

export const deletePrintSetting = async function () {
  let res = [];
  try {
    res = await api.delete(`/api/v1/billing/printSetting`, baseUrl);
  } catch (e) {
    console.error("Error while deleting the Print Setting: ", e);
  }
  return res;
};

export const createBill = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/bill`, payload, baseUrl);
  } catch (e) {
    console.error("Error while Creating Bill: ", e);
  }
  return res;
};

export const fetchAdvanceSetting = async function () {
  let res = {};
  try {
    res = await api.get(`/api/v1/billing/advancedSetting`, baseUrl);
  } catch (e) {
    console.error("Error while fetching Advance settings details: ", e);
  }
  return res;
};