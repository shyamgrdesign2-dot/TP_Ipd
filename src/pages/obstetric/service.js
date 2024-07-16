import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.obstetric_api_url };

export const getAllObstetricDetails = async function (patient_unique_id) {
  let res = {};
  try {
    res = await api.get(`/obstetric-all/${patient_unique_id}`, baseUrl);

    res = res.data;
  } catch (e) {
    console.error("Error while fetching obstetric details: ", e);
  }
  return res;
};
