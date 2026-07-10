/**
 * Deterministic context engine for the doctor-facing IPD agent: maps the current
 * view (patient vs ward/list) to the panel greeting, subtitle, context chip,
 * input placeholder, suggestive pills, and welcome canned cards. Pure + data-only.
 *
 * Mirrors the HIMS sectionMeta shape so the ported panel renders unchanged.
 */

const PATIENT = {
  label: "this patient",
  greeting: "Doctor Agent",
  subtitle: "Everything nursing recorded for this patient, in one place.",
  contextLabel: "This patient",
  placeholder: "Ask about this patient's nursing data...",
  pills: [
    { label: "Rounds snapshot", message: "Show rounds snapshot" },
    { label: "Nursing progress notes", message: "Show nursing progress notes" },
    { label: "MO progress notes", message: "Show MO progress notes" },
    { label: "Latest vitals", message: "Show latest vitals" },
    { label: "Active medications", message: "Show active medications" },
    { label: "Vital trends", message: "Show vital trends" },
    { label: "Fluid balance", message: "Show fluid balance" },
    { label: "Flagged labs", message: "Show flagged labs" },
    { label: "Risk scores", message: "Show risk scores" },
    { label: "Cross-referrals", message: "Show cross-referrals" },
    { label: "OT notes", message: "Show OT notes" },
    { label: "Patient info", message: "Show patient info" },
  ],
  cannedCards: [
    { title: "Rounds snapshot", subtitle: "Stability, orders, red flags at a glance", message: "Show rounds snapshot" },
    { title: "Progress notes", subtitle: "Nursing rounds since your last visit", message: "Show nursing progress notes" },
    { title: "MO progress notes", subtitle: "Medical officer reviews since your visit", message: "Show MO progress notes" },
    { title: "Latest vitals", subtitle: "Last value and trend", message: "Show latest vitals" },
  ],
};

const LIST = {
  label: "your ward",
  greeting: "Your in-patients",
  subtitle: "A ranked view of what needs your attention across the ward.",
  contextLabel: "All in-patients",
  placeholder: "Ask about your in-patients...",
  pills: [
    { label: "What needs my attention?", message: "Show ward tasks" },
    { label: "Critical patients", message: "Show critical patients" },
    { label: "Today's referrals", message: "Show today's referrals" },
    { label: "Flagged labs", message: "Show flagged labs across ward" },
    { label: "OT schedule", message: "Show OT schedule" },
  ],
  cannedCards: [
    { title: "Ward tasks", subtitle: "Ranked by urgency across your patients", message: "Show ward tasks" },
    { title: "Critical patients", subtitle: "Alert tier first", message: "Show critical patients" },
  ],
};

/**
 * @param {"patient"|"list"} view
 * @param {string|null} _section  reserved for IPD sub-view variation
 */
export function sectionMeta(view, _section) {
  return view === "patient" ? PATIENT : LIST;
}
