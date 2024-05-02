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
  hospitalId = "798251708943588",
  patientUid = "1311432893"
) => {
  let result = {};
  try {
    result = await api.get(
      `/vaccination/patientDetails?hospital_bid=${hospitalId}&patient_uid=${patientUid}`,
      baseUrl
    );
    if (result?.detail) {
      return result.detail;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};
