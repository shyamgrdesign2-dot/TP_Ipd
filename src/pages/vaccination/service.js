import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_api_url };

export const getPatientDetails = async function ({
  hospital_bid,
  patient_uid,
  hospital_id,
}) {
  try {
    const res = await api.get(
      `/vaccination/patientDetails?hospital_bid=${hospital_bid}&patient_uid=${patient_uid}&hospital_id=${hospital_id}`,
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
    const vaccineBrands = await api.get(`/vaccination/companyList`, baseUrl);
    console.log({ vaccineBrands });
    const { detail = [] } = vaccineBrands;
    return detail;
  } catch (e) {
    console.log({ e });
  }
};

export const updateDob = async function (payload) {
  try {
    const res = await api.post(`/vaccination/updatedob`, payload, baseUrl);
    return res;
  } catch (e) {
    console.log({ e });
  }
};

export const updateVaccine = async function (payload) {
  try {
    const res = await api.post(
      `/vaccination/updatePatientTemplate`,
      payload,
      baseUrl
    );
    console.log({ res });
    return res;
  } catch (e) {
    console.log({ e });
  }
};

export const updateDueDate = async function (payload) {
  try {
    const res = await api.post(
      `/vaccination/overrideduedate`,
      payload,
      baseUrl
    );
    console.log({ res });
    return res;
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
  patientUid = 6302066347,
  patientPid = 36207
  // hospitalBid = 234659817
) => {
  let result = {};
  try {
    // &hospital_bid=${hospitalBid} patientTemplateForBid - prod
    // https://pm-vaccination-uat.mytatva.in/vaccination/patientTemplateForBid?patient_uid=6302066347&patient_pid=36207 - prod
    result = await api.get(
      `/vaccination/patientTemplate?patient_uid=${patientUid}&patient_pid=${patientPid}`,
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
      result.isAuthorized = "true";
      return result.isAuthorized;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template", error);
  }
  return result;
};
