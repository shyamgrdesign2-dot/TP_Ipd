import api from "../../api/services/axiosService";
import config from "../../config";
import { getDecodedToken } from "../../utils/localStorage";

const baseUrl = { customBaseUrl: config.obstetric_api_url };
const ancImmunisationbaseUrl = { customBaseUrl: config.growth_chart_api_url };

export const fetchAllObstetricDetails = async function (
  patient_unique_id,
  userId,
  todaysExamination,
  gravidaNumber
) {
  let res = {};
  try {
    const decodedToken = getDecodedToken();
    const doctorId = decodedToken?.result?.user_id;
    res = await api.get(
      `/obstetric/${patient_unique_id}/${userId || doctorId}${
        todaysExamination ? "?todaysExamination=true" : ""
      }${gravidaNumber ? `&gravidaNumber=${gravidaNumber}` : ""}`,
      baseUrl
    );
    res = res.data;
  } catch (e) {
    console.error("Error while fetching obstetric details: ", e);
  }
  return res;
};

export const addObstetricData = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/obstetric`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const updateObstetricData = async function (id, payload, userId) {
  let res = {};
  try {
    res = await api.patch(`/obstetric/${id}/${userId}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const fetchPrefillObstetricDetails = async function (patient_unique_id) {
  let res = {};
  try {
    res = await api.get(`/prefilled/${patient_unique_id}`, baseUrl);
    res = res.data;
  } catch (e) {
    console.error("Error while fetching prefill obstetric details: ", e);
  }
  return res;
};

export const updatePrefillObstetricData = async function (payload, userId) {
  let res = {};
  try {
    res = await api.patch(`/prefilled/${userId}`, payload, baseUrl);
  } catch (e) {
    console.error("Error while addObstetricData: ", e);
  }
  return res;
};

export const fetchDefaultAnc = async function () {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/anc-scheduler/default-list`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while fetching default ANC Scheduler details: ", e);
  }
  return res;
};

export const fetchSearchAnc = async function (searchQuery, patientUniqueId) {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/anc-scheduler/search?search=${searchQuery}&patient_unique_id=${patientUniqueId}`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error(
      "Error while fetching serach diagnosis for ANC Scheduler: ",
      e
    );
  }
  return res;
};

export const upsertCustomAncScheduler = async function (payload) {
  let res = {};
  try {
    res = await api.post(
      `/api/v1/gyneac/anc-scheduler`,
      payload,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while upserting custom ANC Scheduler: ", e);
  }
  return res;
};

export const deleteCustomAncScheduler = async function (id) {
  let res = {};
  try {
    res = await api.delete(
      `/api/v1/gyneac/anc-scheduler/${id}`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while deleting custom ANC Scheduler: ", e);
  }
  return res;
};

export const fetchDefaultImmunisation = async function () {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/immunisation/default-list`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while fetching default Immunisation details: ", e);
  }
  return res;
};

export const fetchSearchImmunisation = async function (
  searchQuery,
  patientUniqueId
) {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/immunisation/search?search=${searchQuery}&patient_unique_id=${patientUniqueId}`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error(
      "Error while fetching serach diagnosis for Immunisation: ",
      e
    );
  }
  return res;
};

export const upsertCustomImmunisation = async function (payload) {
  let res = {};
  try {
    res = await api.post(
      `/api/v1/gyneac/immunisation`,
      payload,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while upserting custom Immunisation: ", e);
  }
  return res;
};

export const deleteCustomImmunisation = async function (id) {
  let res = {};
  try {
    res = await api.delete(
      `/api/v1/gyneac/immunisation/${id}`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error("Error while deleting custom Immunisation: ", e);
  }
  return res;
};

export const fetchImmunisationDoctorList = async function () {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/immunisation/doctor-list`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error(
      "Error while fetching doctor list for Immunisation details: ",
      e
    );
  }
  return res;
};

export const fetchAncDoctorList = async function () {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/gyneac/anc-scheduler/doctor-list`,
      ancImmunisationbaseUrl
    );
  } catch (e) {
    console.error(
      "Error while fetching doctor list for ANC Scheduler details: ",
      e
    );
  }
  return res;
};
