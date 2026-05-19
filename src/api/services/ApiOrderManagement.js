import config from "../../config";
import api from "./axiosService";

const baseUrl = { customBaseUrl: config.order_management_api_url };

const ApiOrderManagement = {};

ApiOrderManagement.zyIpdOrderMedicineAndInvestigation = function ({
  patientId,
  admissionId,
  consultationId,
  isCreated,
  medication,
  labInvestigation,
}) {
  return api.post(
    `/genx/zyIpdOrderMedicineAndInvestigation?patientId=${patientId}&admissionId=${admissionId}&consultationId=${consultationId}`,
    { isCreated, medication, labInvestigation },
    baseUrl
  );
};

export default ApiOrderManagement;
