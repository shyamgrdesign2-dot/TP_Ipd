import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.growth_chart_api_url };

export const getAllGrowthChartParams = async function ({ pm_id, pm_pid }) {
  let res = {};
  try {
    res = await api.get(
      `growthChart/all?pm_id=${pm_id}&pm_pid=${pm_pid}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching patient details: ", e);
  }
  return res;
};
