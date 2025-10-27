import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiMedicalRecords = {};

// GET: List documents
// Maps to: GET /api/v1/docs?patientId=...&admissionId=...&category=...
ApiMedicalRecords.getDocuments = function ({ patientId, admissionId, category = "medical_records" }) {
  const query = new URLSearchParams();
  if (patientId) query.append("patientId", patientId);
  if (admissionId) query.append("admissionId", admissionId);
  if (category) query.append("category", category);
  
  return api.get(`/docs?${query.toString()}`, baseUrl);
};

// PUT: Upload/Update a document via multipart form
// Maps to: PUT /api/v1/docs?patientId=...&admissionId=...
// Form fields: category, subCategory, file, name, thumbnail
ApiMedicalRecords.putDocument = function ({
  patientId,
  admissionId,
  category,
  subCategory,
  file,
  name,
  thumbnail,
  notes,
}) {
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
  if (thumbnail) {
    console.log("putDocument thumbnail:", { name: thumbnail?.name, type: thumbnail?.type, size: thumbnail?.size });
    formData.append("thumbnail", thumbnail, thumbnail.name || "thumbnail.bin");
  }
  if (notes) formData.append("notes", notes);

  return api.put(
    `/docs?${query.toString()}`,
    formData,
    baseUrl
  );
};

// DELETE: Delete a document
// Maps to: DELETE /api/v1/docs?patientId=...&_id=...&admissionId=...
ApiMedicalRecords.deleteDocument = function ({ patientId, admissionId, id }) {
  const query = new URLSearchParams();
  if (patientId) query.append("patientId", patientId);
  if (id) query.append("_id", id);
  if (admissionId) query.append("admissionId", admissionId);

  return api.delete(`/docs?${query.toString()}`, baseUrl);
};

export default ApiMedicalRecords;
