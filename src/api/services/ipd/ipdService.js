import config from "../../../config";
import api from "../axiosService";

const baseUrl = { customBaseUrl: config.ipd_api_url };
const symptomTemplateBaseUrl = { customBaseUrl: config.symptoms_api_url };

const ApiIpdService = {};

ApiIpdService.getCustomization = function () {
  return api.get(`/customization`, baseUrl);
};

ApiIpdService.updateCustomization = function (data) {
  return api.put(`/customization`, data, baseUrl);
};

ApiIpdService.doctorDepartmentRoles = function () {
  return api.get(`/patients/doctors-departments-roles`, baseUrl);
};

ApiIpdService.fetchSingleTemplate = function ({ templateId, type }) {
  return api.get(
    `/api/v1/${type}/singleTemplateDetails/${templateId}`,
    symptomTemplateBaseUrl
  );
};

/** ---------------- NEW: Admissions + Masters ---------------- */
ApiIpdService.createAdmission = function (data) {
  // POST /patients/create-admission
  return api.post(`/patients/create-admission`, data, baseUrl);
};

ApiIpdService.getWards = function () {
  return api.get(`/patients/wards`, baseUrl);
};

ApiIpdService.getDepartments = function () {
  return api.get(`/patients/departments`, baseUrl);
};

ApiIpdService.getPatientUniqueId = function ({ mrno }) {
  return api.get(`/patients/patient-unique-id?mrno=${mrno}`, baseUrl);
};

ApiIpdService.checkPatientAdmitted = function ({ patientId }) {
  return api.get(
    `/patients/check-patient-admitted?patientId=${patientId}`,
    baseUrl
  );
};

ApiIpdService.markPatientAsDischarged = function ({
  admissionId,
  dateOfDischarge,
  dischargeType,
  timeOfDischarge,
  dischargeRemarks,
}) {
  return api.put(
    `/patients/mark-discharged?admissionId=${admissionId}`,
    { dateOfDischarge, dischargeType, timeOfDischarge, dischargeRemarks },
    baseUrl
  );
};

ApiIpdService.sendForDischargeApproval = function ({
  admissionId,
  dateOfDischarge,
  dischargeType,
  timeOfDischarge,
  dischargeRemarks,
}) {
  return api.put(
    `/patients/mark-discharged-approval?admissionId=${admissionId}`,
    { dateOfDischarge, dischargeType, timeOfDischarge, dischargeRemarks },
    baseUrl
  );
};

export default ApiIpdService;
