import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.gen_rx_api_url, timeout: 120000 };
const symptomsCollectorBaseUrl = {
  customBaseUrl: config.symptoms_collector_api_url,
  timeout: 120000,
};

export const generateRx = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/voice-digitize`, payload, baseUrl);
  } catch (e) {
    console.error("Error while generating rx: ", e);
  }
  return res;
};

export const updateGenRx = async function (payload, id) {
  let res = {};
  try {
    res = await api.put(`/api/v1/voice-digitize/${id}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updating gen rx: ", e);
  }
  return res;
};

export const editGenRxDetails = async function (payload, id) {
  let res = {};
  try {
    res = await api.patch(`/api/v1/voice-digitize/${id}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updating gen rx: ", e);
  }
  return res;
};

export const getGenRx = async function (id) {
  let res = {};
  try {
    res = await api.get(`/api/v1/voice-digitize/${id}`, baseUrl);
  } catch (e) {
    console.error("Error while fetching patient gynec details: ", e);
  }
  return res;
};

export const fetchSymptomsCollectorData = async function (payload) {
  let res = {};
  try {
    res = await api.post(
      `/api/v1/agents/get-symptoms`,
      payload,
      symptomsCollectorBaseUrl
    );
  } catch (e) {
    console.error("Error while fetching symptoms collector data: ", e);
  }
  return res;
};

export const checkSymptomsCollectorTour = async function (payload) {
  let res = {};
  try {
    res = await api.post(
      `/api/v1/agents/get-appointment-ids`,
      payload,
      symptomsCollectorBaseUrl
    );
    res = res?.pam_ids?.length === 1;
  } catch (e) {
    console.error("Error while checking symptoms collector tour: ", e);
  }
  return res;
};
