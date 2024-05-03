import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_api_url };

export const getPatientDetails = async function (
  hospital_bid = 798251708943588,
  patient_uid = 1311432893
) {
  try {
    const res = await api.get(
      `/patientDetails?hospital_bid=${hospital_bid}&patient_uid=${patient_uid}`,
      baseUrl
    );
    console.log({ res });
    const { detail = [] } = res;
    // detail[0].vac_dob = null;
    return detail;
  } catch (e) {
    console.log({ e });
  }
};

export const getVaccineBrands = async function () {
  try {
    const vaccineBrands = await api.get(`/companyList`, baseUrl);
    console.log({ vaccineBrands });
    const { detail = [] } = vaccineBrands;
    return detail;
  } catch (e) {
    console.log({ e });
  }
};

export const updateDob = async function (payload) {
  try {
    const res = await api.post(`/patientDetails`, payload, baseUrl);
    console.log({ res });
  } catch (e) {
    console.log({ e });
  }
};

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

export const checkToShowVaccination = async (
  doctorUniqueId = "ZV7s4PYh8z3JguW" // true=ZV7s4PYh8z3JguW for false=ZV7s4PYh8z3Jgua => will remove later
) => {
  let result = false;
  try {
    result = await api.get(
      `/vaccination/isAuthorized?doctor_unique_id=${doctorUniqueId}`,
      baseUrl
    );
    if (result) {
      return result.isAuthorized;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};
