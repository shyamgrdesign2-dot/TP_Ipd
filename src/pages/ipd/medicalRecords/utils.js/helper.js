import { setMedicalRecords} from "../../../../redux/ipd/medicalRecordsSlice";
import { store } from "../../../../redux/store";
import { getDocuments } from "./service";

export const getAllPatientDocs = async (patientId, admissionId, category = "medical_records" ) => {
  const medicalRecords = await getDocuments({ patientId, admissionId, category });
  store.dispatch(setMedicalRecords(medicalRecords));
};