import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.medicalhistory_api_url };

export const getDDxDetails = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/cdss/ai-diagnosis`, payload, baseUrl);
  } catch (error) {
    console.error("Error while generating ddx: ", error);
  }
  return res?.data;
};
