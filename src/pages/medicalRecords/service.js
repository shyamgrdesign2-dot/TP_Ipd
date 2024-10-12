import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.upload_doc_api_url };

export const fetchAllDocumentCategories = async function () {
  let res = [];
  try {
    res = await api.get("/api/v1/docs/category/all", baseUrl);
  } catch (e) {
    console.error("Error while fetching all document categories: ", e);
  }
  return res;
};

export const uploadDocument = async function (payload) {
  let res = [];
  try {
    res = await api.post(`/api/v1/docs/upload`, payload, baseUrl);
  } catch (e) {
    console.error("Error while uploading document: ", e);
  }
  return res;
};

export const updateDocument = async function (payload) {
  let res = {};
  try {
    res = await api.put(`/api/v1/docs`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updating document: ", e);
  }
  return res;
};

export const fetchAllPatientDocs = async function (patientUniqueId) {
  let res = [];
  try {
    res = await api.get(
      `/api/v1/docs/all?patient_unique_id=${patientUniqueId}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching all patient documents: ", e);
  }
  return res;
};

export const fetchDocById = async function (docId) {
  let res = [];
  try {
    res = await api.get(`/api/v1/docs/${docId}`, baseUrl);
  } catch (e) {
    console.error("Error while fetching document by id: ", e);
  }
  return res;
};

export const deleteDocById = async function (id) {
  let res = [];
  try {
    res = await api.delete(`/api/v1/docs/${id}`, baseUrl);
  } catch (e) {
    console.error("Error while deleting the document: ", e);
  }
  return res;
};

export const fetchDocsUploadedByPatient = async function (patientUniqueId) {
  let res = [];
  try {
    res = await api.get(
      `api/v1/docs/myt?patient_unique_id=${patientUniqueId}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching documents uploaded by patient: ", e);
  }
  return res;
};
