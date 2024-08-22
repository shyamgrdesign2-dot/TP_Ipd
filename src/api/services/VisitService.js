import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.visit_api_url };

export const updateVisitStatus = async function (payload) {
  try {
    await api.put(`/api/v1/kea/appointment/web/6666/status`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updateVisitStatus: ", e);
  }
};
