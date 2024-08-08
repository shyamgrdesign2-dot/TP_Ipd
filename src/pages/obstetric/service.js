import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.obstetric_api_url };

export const fetchAllObstetricDetails = async function (patient_unique_id, userId) {
  let res = {};
  try {
    res = await api.get(`/obstetric/${patient_unique_id}/${userId}`, baseUrl);

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
