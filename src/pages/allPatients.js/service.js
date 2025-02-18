import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.visit_api_url };

export const fetchAllPatients = async function (params) {
  let res = {};
  try {
    const queryParams = {
      search: params.search ?? "",
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      limit: params.limit || 25,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    res = await api.get(
      `/api/v1/patient/listDashboard?${queryString}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching all patients lists : ", e);
  }
  return res;
};
