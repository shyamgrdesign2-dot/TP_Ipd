/**
 * Doctor Agent data adapter (doctor-facing). Pulls the NURSING -> DOCTOR data for a
 * patient from the local mock backend (:4000) and normalizes it into the shape the
 * card builders consume. Every call degrades gracefully (returns null / [] on
 * failure) so the panel keeps working. Repointing to a real backend is config.
 */
import { agentNursingGet, agentGraphql, ensureAgentAuth } from "./agentApi.js";
import {
  MOCK_VITALS,
  MOCK_MAR,
  MOCK_FLUID,
  MOCK_LABS,
  MOCK_RISK_SCORES,
  MOCK_NURSING_NOTES,
  MOCK_WARD_TASKS,
  MOCK_PROGRESS_TIMELINE,
} from "../../../../demo/demoData";

var IS_DEMO = process.env.REACT_APP_DEMO === "true";

// Unwrap either a paginate() body ({ data:[...] }) or a nursingSuccess() body
// ({ data:<payload> }). Both expose the payload at `.data`.
function payload(body) {
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

async function safe(promise, fallback) {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

/**
 * Fan out to the nursing streams for one patient and normalize.
 * @param {object} patient normalized patient context (patientId, admissionId, visitId, ...)
 */
export async function fetchDoctorEntries(patient) {
  if (!patient) return null;
  const patientId = patient.patientId ?? patient.id;
  const admissionId = patient.admissionId;
  const visitId = patient.visitId ?? patient.admissionId;
  if (patientId == null) return null;

  if (IS_DEMO) {
    var v = MOCK_VITALS[patientId] || MOCK_VITALS["PAT-001"];
    return {
      patient: {
        name: patient.name,
        uhid: patient.uhid,
        ward: patient.ward,
        bed: patient.bed,
        admittedOn: patient.admittedOn,
        consultant: patient.consultant,
        gender: patient.gender,
        age: patient.age,
        primaryDiagnosis: patient.primaryDiagnosis,
      },
      vitals: v,
      mar: MOCK_MAR[patientId] || [],
      fluid: MOCK_FLUID[patientId] || null,
      labs: MOCK_LABS[patientId] || [],
      risk: MOCK_RISK_SCORES[patientId] || [],
      notes: MOCK_NURSING_NOTES[patientId] || [],
    };
  }

  const [vitalsBody, marBody, fluidBody, labsBody, riskBody, notesBody] = await Promise.all([
    safe(agentNursingGet(`/vitals/${patientId}`, { for_chart: 1 }), null),
    safe(agentNursingGet(`/drug-admin/visit/${visitId}`), null),
    safe(agentNursingGet(`/fluid-balance/patient/${patientId}`), null),
    safe(agentNursingGet(`/labs/flagged/patient/${patientId}`), null),
    safe(agentNursingGet(`/risk-scores/patient/${patientId}`), null),
    admissionId != null ? safe(agentNursingGet(`/nursing-daily-notes/by-admission/${admissionId}`), null) : Promise.resolve(null),
  ]);

  const vitals = payload(vitalsBody) || [];
  const fluidRows = payload(fluidBody) || [];
  const marPayload = payload(marBody) || {};
  const riskPayload = payload(riskBody) || {};

  return {
    patient: {
      name: patient.name,
      uhid: patient.uhid,
      ward: patient.ward,
      bed: patient.bed,
      admittedOn: patient.admittedOn,
      consultant: patient.consultant,
      gender: patient.gender,
      age: patient.age,
      primaryDiagnosis: patient.primaryDiagnosis,
    },
    vitals: { latest: vitals[0] || null, trend: vitals },
    mar: Array.isArray(marPayload.orders) ? marPayload.orders : [],
    fluid: Array.isArray(fluidRows) ? fluidRows[0] || null : fluidRows || null,
    labs: payload(labsBody) || [],
    risk: Array.isArray(riskPayload.scores) ? riskPayload.scores : [],
    notes: payload(notesBody) || [],
  };
}

/**
 * Progress-notes timeline for one patient: everything charted SINCE the doctor's
 * last consultant note (the last time they rounded), split into nursing rounds and
 * MO progress notes. Returns { consultant, lastConsultantNoteAt, nursing[], mo[] }
 * or null on failure so the card degrades to an empty state.
 * @param {object} patient normalized patient context (needs admissionId)
 */
export async function fetchProgressTimeline(patient) {
  if (!patient) return null;
  const admissionId = patient.admissionId;
  if (admissionId == null) return null;

  if (IS_DEMO) {
    var tl = MOCK_PROGRESS_TIMELINE[admissionId];
    if (!tl) return null;
    return {
      consultant: tl.consultant || patient.consultant || null,
      lastConsultantNoteAt: tl.lastConsultantNoteAt || null,
      nursing: tl.nursing || [],
      mo: tl.mo || [],
    };
  }

  const body = await safe(agentNursingGet(`/progress-timeline/by-admission/${admissionId}`), null);
  const data = payload(body);
  if (!data) return null;
  return {
    consultant: data.consultant || patient.consultant || null,
    lastConsultantNoteAt: data.lastConsultantNoteAt || null,
    nursing: Array.isArray(data.nursing) ? data.nursing : [],
    mo: Array.isArray(data.mo) ? data.mo : [],
  };
}

/** Aggregated pending items across the ward (list/home view). */
export async function fetchDoctorTasks() {
  if (IS_DEMO) return MOCK_WARD_TASKS;
  return [];
}

// Wiring check for the mount's console diagnostic (login + one IPD data call).
export async function verifyWiring() {
  if (IS_DEMO) return { ok: true, admissions: 5, demo: true };
  const ok = await ensureAgentAuth();
  if (!ok) return { ok: false, admissions: 0 };
  try {
    const data = await agentGraphql(
      "ListPatientAdmissions",
      "query ListPatientAdmissions { listPatientAdmissions { ADMISSION_ID PATIENT_ID UHID } }",
      {}
    );
    const rows = data?.listPatientAdmissions ?? [];
    return { ok: true, admissions: rows.length };
  } catch (e) {
    return { ok: false, admissions: 0, error: e?.message };
  }
}
