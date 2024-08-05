import api from "../../api/services/axiosService";
import config from "../../config";
import { getDecodedToken } from "../../utils/localStorage";

const baseUrl = { customBaseUrl: config.obstetric_api_url };
const decodedToken = getDecodedToken();
const doctorId = decodedToken?.result?.user_id;

export const fetchAllObstetricDetails = async function (patient_unique_id) {
  let res = {};
  try {
    res = await api.get(`/obstetric/${patient_unique_id}/${doctorId}`, baseUrl);

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

export const updateObstetricData = async function (id, payload) {
  let res = {};
  try {
    res = await api.patch(`/obstetric/${id}/${doctorId}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const deleteObstetricData = async function (id) {
  let res = {};
  try {
    res = await api.delete(`/obstetric/${id}/${doctorId}`, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};
