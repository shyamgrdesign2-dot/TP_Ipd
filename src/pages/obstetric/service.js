import api from "../../api/services/axiosService";
import config from "../../config";
import { getDecodedToken } from "../../utils/localStorage";

const baseUrl = { customBaseUrl: config.obstetric_api_url };

export const fetchAllObstetricDetails = async function (patient_unique_id, userId) {
  let res = {};
  try {
    const decodedToken = getDecodedToken();
    const doctorId = decodedToken?.result?.user_id;
    res = await api.get(`/obstetric/${patient_unique_id}/${userId || doctorId}`, baseUrl);
    res = res.data;
  } catch (e) {
    console.error("Error while fetching obstetric details: ", e);
  }
  return res;
};

export const addObstetricData = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/obstetric`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const updateObstetricData = async function (id, payload, userId) {
  let res = {};
  try {
    res = await api.patch(`/obstetric/${id}/${userId}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const deleteObstetricData = async function (id, userId) {
  let res = {};
  try {
    res = await api.delete(`/obstetric/${id}/${userId}`, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const fetchPrefillObstetricDetails = async function (patient_unique_id) {
  let res = {};
  try {
    res = await api.get(`/prefilled/${patient_unique_id}`, baseUrl);
    res = res.data;
  } catch (e) {
    console.error("Error while fetching prefill obstetric details: ", e);
  }
  return res;
};

export const updatePrefillObstetricData = async function (payload, userId) {
  let res = {};
  try {
    res = await api.patch(`/prefilled/${userId}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};
