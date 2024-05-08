import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_api_url };

export const getPatientDetails = async function ({
  hospital_bid,
  patient_uid,
  hospital_id,
}) {
  let res = {};
  try {
    res = await api.get(
      `/vaccination/patientDetails?hospital_bid=${hospital_bid}&patient_uid=${patient_uid}&hospital_id=${hospital_id}`,
      baseUrl
    );

    res = res?.detail?.length ? res.detail[0] : {};
  } catch (e) {
    console.error("Error while fetching patient details: ", e);
  }
  return res;
};

export const getVaccineBrands = async function () {
  let vaccineBrands = [];
  try {
    vaccineBrands = await api.get(`/vaccination/companyList`, baseUrl);
    if (vaccineBrands?.detail) {
      vaccineBrands = vaccineBrands.detail;
    }
  } catch (e) {
    console.error("Error while fetching vaccine brands", e);
  }
  return vaccineBrands;
};

export const updateDob = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/vaccination/updatedob`, payload, baseUrl);
  } catch (e) {
    console.error("Error while fetching update DOB: ", e);
  }
  return res;
};

export const updateVaccine = async function (payload) {
  let res = {};
  try {
    res = await api.post(
      `/vaccination/updatePatientTemplate`,
      payload,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching update vaccine: ", e);
  }
  return res;
};

export const updateDueDate = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/vaccination/overrideduedate`, payload, baseUrl);
  } catch (e) {
    console.error("Error while fetching update due date: ", e);
  }
  return res;
};

export const getOverridenDueDate = async (
  patientUid = "6302066347",
  patientPid = "36207"
) => {
  let res = [];
  try {
    res = await api.get(
      `/vaccination/overridenduedates?patient_uid=${patientUid}&patient_pid=${patientPid}`,
      baseUrl
    );
    if (res?.detail) {
      res = res.detail;
    }
  } catch (e) {
    console.error("Error while fetching overriden due date vaccines: ", e);
  }
  return res;
};

export const getVaccineTemplates = async () => {
  let result = [];
  try {
    result = await api.get(`/vaccination/standardTemplate`, baseUrl);
    if (result?.template) {
      result = result.template;
    }
  } catch (error) {
    console.error("Error while fetching vaccine template: ", error);
  }
  return result;
};

export const getPatientVaccineDetails = async (
  patientUid = 6302066347,
  patientPid = 36207
  // hospitalBid = 234659817
) => {
  let result = [];
  try {
    // &hospital_bid=${hospitalBid} patientTemplateForBid - prod
    // https://pm-vaccination-uat.mytatva.in/vaccination/patientTemplateForBid?patient_uid=6302066347&patient_pid=36207 - prod
    result = await api.get(
      `/vaccination/patientTemplate?patient_uid=${patientUid}&patient_pid=${patientPid}`,
      baseUrl
    );
    if (result?.template) {
      result = result.template;
    }
  } catch (error) {
    console.error("Error while fetching patient details: ", error);
  }
  return result;
};

export const checkToShowVaccination = async (
  doctorUniqueId = "ZV7s4PYh8z3JguW"
) => {
  let result = "false";
  try {
    result = await api.get(
      `/vaccination/isAuthorized?doctor_unique_id=${doctorUniqueId}`,
      baseUrl
    );
    if (result?.isAuthorized) {
      result = "true";
    }
  } catch (error) {
    console.error(
      "Error while fetching to show vaccination on prescription: ",
      error
    );
  }
  return result;
};

export const createPatient = async (payload) => {
  let res;
  try {
    res = await api.post("vaccination/patientrecord", payload, baseUrl);
    if (res.status === 200) {
      res = payload;
    }
  } catch (error) {
    console.error("Error while creating patient: ", error);
  }
  return res;
};
