import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = {
  customBaseUrl: "https://conscious-ivory-rachel-friendly.trycloudflare.com",
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

export const updateObstetricData = async function (id, payload) {
  let res = {};
  try {
    res = await api.patch(`/obstetric/${id}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const deleteObstetricData = async function (id) {
  let res = {};
  try {
    res = await api.delete(`/obstetric/${id}`, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};
