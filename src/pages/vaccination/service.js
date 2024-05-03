import api from "../../../src/api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_url };

export const getVaccineTemplates = async () => {
  let result = {};
  try {
    result = await api.get(`/vaccination/standardTemplate`, baseUrl);
    if (result?.template) {
      return result.template;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};

export const getPaientDetails = async (
  patientUid = "1311432893",
  patientPid = "PAT0020",
  hospitalBid = "798251708943588"
) => {
  let result = {};
  try {
    result = await api.get(
      `/vaccination/patientTemplateForBid?patient_uid=${patientUid}&patient_pid=${patientPid}&hospital_bid=${hospitalBid}`,
      baseUrl
    );
    if (result?.template) {
      return result.template;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};
