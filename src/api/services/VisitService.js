import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.visit_api_url };

export const updateVisitStatus = async function (pamId, payload) {
  try {
    await api.put(
      `/api/v1/kea/appointment/web/${pamId}/status`,
      payload,
      baseUrl
    );
  } catch (e) {
    console.error("Error while updateVisitStatus: ", e);
  }
};
