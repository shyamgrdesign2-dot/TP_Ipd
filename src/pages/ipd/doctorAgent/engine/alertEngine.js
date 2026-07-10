// Deterministic alert engine (PDF Section 6). Threshold rules only, no AI, no prediction.
// Returns a tier ("critical" | "warning" | "info" | null) for a parameter+value.
// Thresholds are the V0 starting defaults; clinical team validates per specialty later.

// Critical / warning ranges per vital parameter.
const VITAL_RULES = {
  // key: { critical: (v) => bool, warning?: (v) => bool }
  spo2: { critical: (v) => v < 90 },
  hr: { critical: (v) => v < 40 || v > 130 },
  sbp: { critical: (v) => v < 90 || v > 180 },
  temp: { critical: (v) => v < 35 || v > 39.5 }, // Celsius
  rr: { critical: (v) => v < 8 || v > 30 },
  bg: { critical: (v) => v < 60 || v > 400 }, // blood glucose mg/dL
  pain: { critical: (v) => v >= 8, warning: (v) => v >= 6 },
  braden: { critical: (v) => v <= 9, warning: (v) => v >= 10 && v <= 12 },
  qsofa: { critical: (v) => v >= 2 },
};

export function tierFor(key, value) {
  const v = Number(value);
  if (!isFinite(v)) return null;
  const rule = VITAL_RULES[String(key).toLowerCase()];
  if (!rule) return null;
  if (rule.critical && rule.critical(v)) return "critical";
  if (rule.warning && rule.warning(v)) return "warning";
  return null;
}

// Fluid net balance: warning at +-500ml, critical at +-1000ml cumulative in 24h.
export function fluidTier(netMl) {
  const v = Math.abs(Number(netMl) || 0);
  if (v >= 1000) return "critical";
  if (v >= 500) return "warning";
  return null;
}

// Non-numeric event tiers (used by the alert panel in Phase 2).
export const EVENT_TIER = {
  nurse_sos: "critical",
  transfusion_reaction: "critical",
  sepsis_flag: "critical",
  critical_lab: "critical",
  hypo_hyperglycemia: "critical",
  missed_medication: "warning",
  abnormal_lab: "warning",
  preop_incomplete: "warning",
  discharge_ready: "info",
  new_nursing_note: "info",
  bed_transfer: "info",
};
