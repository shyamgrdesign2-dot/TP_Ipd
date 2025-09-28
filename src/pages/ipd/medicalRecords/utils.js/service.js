import api from "../../../../api/services/axiosService";
import config from "../../../../config";

const baseUrl = { customBaseUrl: config.ipd_api_url };

// GET: List documents
// Maps to: GET /api/v1/docs?patientId=...&admissionId=...&category=...
export const getDocuments = async function ({ patientId, admissionId, category = "medical_records" }) {
  console.log("getDocuments params:", { patientId, admissionId, category });
  let res = [];
  try {
    const query = new URLSearchParams();
    if (patientId) query.append("patientId", patientId);
    if (admissionId) query.append("admissionId", admissionId);
    if (category) query.append("category", category);
    res = await api.get(`/docs?${query.toString()}`, baseUrl);
  } catch (e) {
    console.error("Error while fetching documents: ", e);
  }
  return res;
};

// PUT: Upload/Update a document via multipart form
// Maps to: PUT /api/v1/docs?patientId=...&admissionId=...
// Form fields: category, subCategory, file, name
export const putDocument = async function ({
  patientId,
  admissionId,
  category,
  subCategory,
  file,
  name,
}) {
  let res = {};
  try {
    const query = new URLSearchParams();
    if (patientId) query.append("patientId", patientId);
    if (admissionId) query.append("admissionId", admissionId);

    const formData = new FormData();
    if (category) formData.append("category", category);
    if (subCategory) formData.append("subCategory", subCategory);
    if (file) {
      console.log("putDocument file:", { name: file?.name, type: file?.type, size: file?.size });
      formData.append("file", file, file.name || "upload.bin");
    }
    if (name) formData.append("name", name);

    res = await api.put(
      `/docs?${query.toString()}`,
      formData,
      baseUrl
    );
  } catch (e) {
    console.error("Error while uploading/updating document: ", e);
  }
  return res;
};

// DELETE: Delete a document
// Maps to: DELETE /api/v1/docs?patientId=...&_id=...&admissionId=...
export const deleteDocument = async function ({ patientId, admissionId, id }) {
  let res = {};
  try {
    const query = new URLSearchParams();
    if (patientId) query.append("patientId", patientId);
    if (id) query.append("_id", id);
    if (admissionId) query.append("admissionId", admissionId);

    res = await api.delete(`/docs?${query.toString()}`, baseUrl);
  } catch (e) {
    console.error("Error while deleting the document: ", e);
  }
  return res;
};
