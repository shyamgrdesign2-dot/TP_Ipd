import config from "../../../config";
import api from "../axiosService";
import { convertBlobToFile } from "../../../utils/utils";

const baseUrl = { customBaseUrl: config.ipd_api_url };
const symptomTemplateBaseUrl = { customBaseUrl: config.symptoms_api_url };

const ApiIpdService = {};

ApiIpdService.getCustomization = function (doctorId) {
  let url = `/customization`;
  if (doctorId) {
    url += `?doctorId=${encodeURIComponent(doctorId)}`;
  }
  return api.get(url, baseUrl);
};

ApiIpdService.updateCustomization = function ({ doctorId, customization } = {}) {
  let url = `/customization`;
  if (doctorId) {
    url += `?doctorId=${encodeURIComponent(doctorId)}`;
  }
  return api.put(url, customization, baseUrl);
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
  return api.post(`/patients/create-admission`, data, baseUrl);
};

ApiIpdService.editAdmission = function ({ admissionId, data }) {
  return api.put(`/patients/edit-admission?admissionId=${admissionId}`, data, baseUrl);
};

ApiIpdService.getWards = function ({ includeAll = true } = {}) {
  const query = includeAll ? "?all=true" : "";
  return api.get(`/patients/wards${query}`, baseUrl);
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

ApiIpdService.fetchAbhaDetails = function ({ patientUniqueId }) {
  return api.get(
    `/patients/fetch-abha-details?patientUniqueId=${encodeURIComponent(patientUniqueId)}`,
    baseUrl
  );
};

ApiIpdService.getTpmlReferenceId = function ({ patientUniqueId }) {
  return api.get(
    `/patients/tpml-reference-id?patient_unique_id=${encodeURIComponent(patientUniqueId)}`,
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

ApiIpdService.markIntimationDischarge = function ({
  admissionId,
  dateOfIntimationDischarge,
  timeOfIntimationDischarge,
  revert = false,
}) {
  return api.put(
    `/patients/mark-intimation?admissionId=${encodeURIComponent(admissionId)}`,
    { dateOfIntimationDischarge, timeOfIntimationDischarge, revert },
    baseUrl
  );
};

ApiIpdService.magicPen = function ({ patientId, admissionId, paragraph }) {
  return api.post(
    `/ai/magic-pen?patientId=${patientId}&admissionId=${admissionId}`,
    { paragraph },
    {
      ...baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

ApiIpdService.voiceRx = function ({
  patientId,
  admissionId,
  schemaKey,
  audioFile,
  filename,
  mimeType,
  previousOutput,
}) {
  // Convert Blob to File if it's a Blob object
  let fileToUpload = audioFile;
  if (audioFile instanceof Blob && !(audioFile instanceof File)) {
    fileToUpload = convertBlobToFile(audioFile, filename, mimeType);
  }

  const formData = new FormData();
  formData.append("audio_file", fileToUpload);
  // Only append previousOutput if it is not null/undefined/empty object
  let shouldAppendPreviousOutput = false;
  let previousOutputToSend = previousOutput;

  if (
    previousOutput !== null &&
    previousOutput !== undefined &&
    !(typeof previousOutput === "object" && Object.keys(previousOutput).length === 0)
  ) {
    shouldAppendPreviousOutput = true;
    if (typeof previousOutput === "string") {
      try {
        previousOutputToSend = JSON.stringify(JSON.parse(previousOutput));
      } catch (e) {
        previousOutputToSend = previousOutput; // Not a JSON string, leave as-is
      }
    } else if (typeof previousOutput === "object") {
      previousOutputToSend = JSON.stringify(previousOutput);
    }
  }

  if (shouldAppendPreviousOutput) {
    formData.append("previousOutput", previousOutputToSend);
  }
  return api.post(
    `/ai/voice-rx?patientId=${patientId}&admissionId=${admissionId}&schemaKey=${schemaKey}`,
    formData,
    {
      ...baseUrl,
      timeout: 120000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

ApiIpdService.transferWardBed = function ({ wardId, roomId, admissionId }) {
  return api.put(
    `/patients/transfer-ward?wardId=${wardId}&roomId=${roomId}&admissionId=${admissionId}`,
    {},
    baseUrl
  );
};

ApiIpdService.transferDepartmentDoctor = function ({ dpId, umId, admissionId }) {
  return api.put(
    `/patients/transfer-department?dpId=${dpId}&umId=${umId}&admissionId=${admissionId}`,
    {},
    baseUrl
  );
};

export default ApiIpdService;
