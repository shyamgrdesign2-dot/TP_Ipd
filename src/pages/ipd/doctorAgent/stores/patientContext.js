// Global patient/admission context for the Doctor Agent.
// The IPD patient hub holds its patient in location.state (per-navigation), which a
// root-mounted panel cannot read. So the hub broadcasts here on mount; list views leave
// it null. Mirrors the HIMS agent's workspace/patient broadcast pattern.
import { useSyncExternalStore } from "react";

let current = null; // normalized patient object, or null (list / board view)
const listeners = new Set();

function emit() {
  for (const l of listeners) l();
}

// Normalize the hub's raw `patientDetails` (from location.state) into the agent's shape.
export function normalizePatient(pd) {
  if (!pd || !pd.details) return null;
  const d = pd.details;
  return {
    patientId: d.id ?? null,
    admissionId: pd.admissionId ?? null,
    visitId: pd.visitId ?? d.visitId ?? null,
    uhid: d.uhid ?? d.uhidNumber ?? pd.uhid ?? null,
    name: d.name ?? "",
    gender: d.gender ?? "",
    age: d.age ?? null,
    ward: pd.ward?.title ?? "",
    bed: pd.room?.title ?? pd.bed?.title ?? "",
    consultant: pd.doctor?.name ?? "",
    admittedOn: pd.admittedOn ?? null,
    primaryDiagnosis:
      pd.provisionalDiagnosis ?? d.primaryDiagnosis ?? d.diagnosis ?? "",
    raw: pd,
  };
}

export function setAgentPatient(rawPatientDetails) {
  const next = normalizePatient(rawPatientDetails);
  // Skip redundant updates (same admission) to avoid needless re-renders.
  if (next && current && next.admissionId === current.admissionId) return;
  if (!next && !current) return;
  current = next;
  emit();
}

export function clearAgentPatient() {
  if (!current) return;
  current = null;
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return current;
}

export function useAgentPatient() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
