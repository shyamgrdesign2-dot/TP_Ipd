import { getMedicalRecordsDocuments } from "../../../../redux/ipd/medicalRecordsSlice";
import { store } from "../../../../redux/store";

export const getAllPatientDocs = async (patientId, admissionId, category = "medical_records") => {
  return store.dispatch(getMedicalRecordsDocuments({ patientId, admissionId, category }));
};