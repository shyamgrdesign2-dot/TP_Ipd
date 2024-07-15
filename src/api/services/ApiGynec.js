import moment from "moment";
import api from "../../api/services/axiosService";
import config from "../../config";

// const baseUrl = { customBaseUrl: config.gynec_api_url };
const baseUrl = { customBaseUrl: config.gynec_api_url };

export const getGynecDetails = async function (patient_unique_id) {
  let res = {};
  try {
    res = await api.get(
      `/gynec/${patient_unique_id}`,
      baseUrl
    );

    res = res.data;
  } catch (e) {
    console.error("Error while fetching patient gynec details: ", e);
  }
  return res;
};

export const postGynecDetails = async function (payload) {
//   const today = moment().format("YYYY-MM-DD");
  let res = {};
  try {
    res = await api.post(
        `/gynec`,
      payload,
      baseUrl
    );
  } catch (error) {
    console.error("Error while updating gynec details: ", error);
  }
  return res;
};