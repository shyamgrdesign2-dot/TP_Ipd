import api from "../../../src/api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_url };

const ApiVaccination = {};

ApiVaccination.getVaccinationTemplates = function () {
  console.log("baseUrl", baseUrl);
  return api.get(`/vaccination/standardTemplate`, baseUrl);
};

ApiVaccination.getPaientDetails = function (
  hospitalId = "798251708943588",
  patientUid = "1311432893"
) {
  return api.get(
    `/vaccination/patientDetails?hospital_bid=${hospitalId}&patient_uid=${patientUid}`,
    baseUrl
  );
};

export const getVaccineTemplates = async () => {
  let result = {};
  try {
    result = await ApiVaccination.getVaccinationTemplates();
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};

export const getPaientDetails = async () => {
  let result = {};
  try {
    result = await ApiVaccination.getPaientDetails();
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};
