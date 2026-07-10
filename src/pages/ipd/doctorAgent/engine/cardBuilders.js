/**
 * Card builders (doctor-facing). Map the normalized nursing data for a patient
 * (from doctorAgentService.fetchDoctorEntries, live off the :4000 mock) into
 * AgentCardShell configs. Deterministic (AI-last). The card shapes match the HIMS
 * AgentCardShell contract so the UI renders identically.
 */
import { to12h, toDateTimeLabel, toShortDate, dayOfStay } from "../utils/format.js";
import { tierFor, fluidTier } from "./alertEngine.js";
import { ALERT_TIER } from "../constants.js";

const dash = (v) => (v != null && String(v).trim() !== "" ? String(v) : "-");
const forPt = (pt) => (pt ? ` for **${pt}**` : "");
const worstTier = (tiers) => (tiers.includes("critical") ? "critical" : tiers.includes("warning") ? "warning" : null);

/* ── Vitals ──────────────────────────────────────────────────────────────────── */
function vitalsItems(v) {
  if (!v) return { items: [], tiers: [] };
  const defs = [
    { key: "BP", value: `${v.systolicBP}/${v.diastolicBP}`, tier: tierFor("sbp", v.systolicBP) },
    { key: "HR", value: `${v.heartRate}`, tier: tierFor("hr", v.heartRate) },
    { key: "SpO2", value: `${v.spo2}%`, tier: tierFor("spo2", v.spo2) },
    { key: "Temp", value: `${v.temperature} C`, tier: tierFor("temp", v.temperature) },
    { key: "RR", value: `${v.respiratoryRate}`, tier: tierFor("rr", v.respiratoryRate) },
  ];
  return {
    items: defs.map((d) => ({ key: d.key, value: d.value, tone: d.tier || undefined })),
    tiers: defs.map((d) => d.tier).filter(Boolean),
  };
}

function buildVitalsCard(e, pt) {
  const v = e?.vitals?.latest;
  const { items, tiers } = vitalsItems(v);
  const accent = worstTier(tiers);
  return {
    intro: v ? `**Latest vitals**${forPt(pt)}${v.recordedBy ? `, charted by **${v.recordedBy}**` : ", from the nursing chart"}.` : "No vitals recorded yet.",
    config: {
      kind: "vitals_trend",
      header: {
        icon: "activity",
        title: "Latest vitals",
        date: v?.recordedAt ? to12h(v.recordedAt) : undefined,
        badge: accent ? { label: ALERT_TIER[accent].label, tone: accent } : undefined,
        accent,
      },
      content: items.length
        ? [{ type: "keyvalue", items }]
        : [{ type: "text", body: "No vitals recorded for this patient yet." }],
    },
  };
}

/* ── Vital Trends ───────────────────────────────────────────────────────────── */
function buildVitalTrendsCard(e, pt) {
  const trend = e?.vitals?.trend || [];
  if (!trend.length) {
    return {
      intro: `No vital trend data available${pt ? ` for **${pt}**` : ""}.`,
      config: {
        kind: "vital_trends",
        header: { icon: "chart", title: "Vital trends" },
        content: [{ type: "text", body: "No vitals trend data recorded yet." }],
      },
    };
  }

  const sorted = trend.slice().sort((a, b) => new Date(a.recordedAt || 0) - new Date(b.recordedAt || 0));

  const bpRows = sorted.map((r) => [
    r.recordedAt ? toDateTimeLabel(r.recordedAt) : "-",
    r.systolicBP != null && r.diastolicBP != null ? `${r.systolicBP}/${r.diastolicBP}` : "-",
    r.recordedBy || "-",
  ]);
  const hrRows = sorted.map((r) => [
    r.recordedAt ? toDateTimeLabel(r.recordedAt) : "-",
    r.heartRate != null ? `${r.heartRate}` : "-",
    r.recordedBy || "-",
  ]);
  const spo2Rows = sorted.map((r) => [
    r.recordedAt ? toDateTimeLabel(r.recordedAt) : "-",
    r.spo2 != null ? `${r.spo2}%` : "-",
    r.recordedBy || "-",
  ]);
  const tempRows = sorted.map((r) => [
    r.recordedAt ? toDateTimeLabel(r.recordedAt) : "-",
    r.temperature != null ? `${r.temperature} C` : "-",
    r.recordedBy || "-",
  ]);
  const rrRows = sorted.map((r) => [
    r.recordedAt ? toDateTimeLabel(r.recordedAt) : "-",
    r.respiratoryRate != null ? `${r.respiratoryRate}` : "-",
    r.recordedBy || "-",
  ]);

  const content = [];
  content.push({ type: "text", variant: "heading", body: "BP Trend (mmHg)" });
  content.push({ type: "table", columns: ["Time", "BP", "By"], rows: bpRows });
  content.push({ type: "text", variant: "heading", body: "Heart Rate Trend (bpm)" });
  content.push({ type: "table", columns: ["Time", "HR", "By"], rows: hrRows });
  content.push({ type: "text", variant: "heading", body: "SpO2 Trend (%)" });
  content.push({ type: "table", columns: ["Time", "SpO2", "By"], rows: spo2Rows });
  content.push({ type: "text", variant: "heading", body: "Temperature Trend (C)" });
  content.push({ type: "table", columns: ["Time", "Temp", "By"], rows: tempRows });
  content.push({ type: "text", variant: "heading", body: "Respiratory Rate Trend (/min)" });
  content.push({ type: "table", columns: ["Time", "RR", "By"], rows: rrRows });

  return {
    intro: `**Vital trends**${pt ? ` for **${pt}**` : ""}, showing ${sorted.length} reading${sorted.length === 1 ? "" : "s"} over time.`,
    config: {
      kind: "vital_trends",
      header: {
        icon: "chart",
        title: "Vital trends",
        date: `${sorted.length} readings`,
        badge: { label: `${sorted.length}`, tone: "info" },
      },
      content,
    },
  };
}

/* ── MAR ─────────────────────────────────────────────────────────────────────── */
const MAR_STATUS = { ADMINISTERED: "Given", DUE: "Pending", PENDING: "Pending", MISSED: "Missed", HELD: "Held" };

function buildMarCard(e, pt) {
  const orders = e?.mar || [];
  const meds = orders.map((o) => ({
    name: o.drugName,
    dose: o.dose,
    timing: [o.route, o.frequency].filter(Boolean).join(", "),
    note: MAR_STATUS[o.status] || o.status,
  }));
  return {
    intro: orders.length ? `**${orders.length} active medication order${orders.length === 1 ? "" : "s"}**${forPt(pt)} on the MAR.` : "No active medications on the MAR.",
    config: {
      kind: "mar_grid",
      header: { icon: "capsule", title: "Active medications", badge: orders.length ? { label: `${orders.length}`, tone: "info" } : undefined },
      content: meds.length ? [{ type: "medlist", meds }] : [{ type: "text", body: "No active medication orders." }],
    },
  };
}

/* ── Fluid balance ───────────────────────────────────────────────────────────── */
function buildFluidCard(e, pt) {
  const f = e?.fluid;
  if (!f) {
    return { intro: "No fluid balance recorded yet.", config: { kind: "fluid_balance", header: { icon: "drop", title: "Fluid balance (24h)" }, content: [{ type: "text", body: "No fluid balance recorded." }] } };
  }
  const net = f.balance != null ? f.balance : (f.totalIntake || 0) - (f.totalOutput || 0);
  const tier = fluidTier(net);
  return {
    intro: `**24-hour fluid balance**${forPt(pt)}, from the nursing chart.`,
    config: {
      kind: "fluid_balance",
      header: {
        icon: "drop",
        title: "Fluid balance (24h)",
        date: f.balanceDate ? String(f.balanceDate) : undefined,
        badge: tier ? { label: ALERT_TIER[tier].label, tone: tier } : undefined,
        accent: tier,
      },
      content: [
        {
          type: "keyvalue",
          items: [
            { key: "Intake", value: `${f.totalIntake ?? "-"} ml` },
            { key: "Output", value: `${f.totalOutput ?? "-"} ml` },
            { key: "Net", value: `${net > 0 ? "+" : ""}${net} ml`, tone: tier || undefined },
          ],
        },
      ],
    },
  };
}

/* ── Flagged labs ────────────────────────────────────────────────────────────── */
function buildLabsCard(e, pt) {
  const labs = e?.labs || [];
  const anyCritical = labs.some((l) => l.critical);
  const rows = labs.map((l) => [l.name, `${l.flag === "low" ? "v " : l.flag === "high" ? "^ " : ""}${l.value}${l.unit ? ` ${l.unit}` : ""}`, dash(l.refRange)]);
  return {
    intro: labs.length ? `**${labs.length} flagged lab result${labs.length === 1 ? "" : "s"}**${forPt(pt)} in the last 24h.` : "No flagged lab results.",
    config: {
      kind: "lab_panel",
      header: {
        icon: "ai-flask",
        title: "Flagged labs",
        badge: labs.length ? { label: `${labs.length} flagged`, tone: anyCritical ? "critical" : "warning" } : undefined,
        accent: anyCritical ? "critical" : labs.length ? "warning" : null,
      },
      content: labs.length
        ? [{ type: "table", columns: ["Test", "Value", "Ref"], rows }]
        : [{ type: "text", body: "No flagged (abnormal) lab results in the last 24 hours." }],
    },
  };
}

/* ── Risk strip ──────────────────────────────────────────────────────────────── */
function buildRiskCard(e, pt) {
  const scores = e?.risk || [];
  const items = scores.map((s) => {
    const tier = s.key === "fall" ? (s.value >= 51 ? "critical" : s.value >= 45 ? "warning" : null) : tierFor(s.key, s.value);
    return { key: s.label, value: String(s.value), tone: tier || undefined, _tier: tier };
  });
  const accent = worstTier(items.map((i) => i._tier).filter(Boolean));
  return {
    intro: scores.length ? `Current **nursing risk scores**${forPt(pt)}.` : "No risk scores recorded yet.",
    config: {
      kind: "risk_strip",
      header: {
        icon: "shield",
        title: "Risk scores",
        badge: accent ? { label: ALERT_TIER[accent].label, tone: accent } : undefined,
        accent,
      },
      content: items.length
        ? [{ type: "keyvalue", items: items.map(({ key, value, tone }) => ({ key, value, tone })) }]
        : [{ type: "text", body: "No risk scores recorded." }],
    },
  };
}

/* ── Nursing notes ───────────────────────────────────────────────────────────── */
function buildNotesCard(e, pt) {
  const notes = (e?.notes || []).slice(0, 2);
  return {
    intro: notes.length ? `The most recent **nursing notes**${forPt(pt)}.` : "No nursing notes recorded yet.",
    config: {
      kind: "nursing_notes",
      header: { icon: "note-2", title: "Nursing notes", badge: notes.length ? { label: `${notes.length}`, tone: "info" } : undefined },
      content: notes.length
        ? notes.flatMap((n, i) => {
            const meta = [n.shiftType, n.recordedBy, n.recordedAt ? to12h(n.recordedAt) : null].filter(Boolean).join(" - ");
            const blocks = [{ type: "text", body: n.nursingPlan || n.generalCondition || "Nursing note recorded." }];
            if (meta) blocks.push({ type: "keyvalue", items: [{ key: "By", value: meta }] });
            return blocks;
          })
        : [{ type: "text", body: "No nursing notes recorded." }],
    },
  };
}

/* ── Rounds snapshot (the flagship — the 5-second read on rounds) ─────────────── */
function buildSummaryCard(e, patient, timeline) {
  const p = e?.patient || patient || {};
  const v = e?.vitals?.latest;
  const { items: vItems, tiers: vTiers } = vitalsItems(v);
  const labs = e?.labs || [];
  const critLabs = labs.filter((l) => l.critical);
  const scores = e?.risk || [];
  const fluid = e?.fluid;
  const net = fluid ? (fluid.balance != null ? fluid.balance : (fluid.totalIntake || 0) - (fluid.totalOutput || 0)) : null;
  const fTier = net != null ? fluidTier(net) : null;
  const mar = e?.mar || [];
  const marBad = mar.filter((o) => ["HELD", "MISSED", "REFUSED"].includes(String(o.status).toUpperCase()));

  const riskItems = scores.map((s) => {
    const tier = s.key === "fall" ? (s.value >= 51 ? "critical" : s.value >= 45 ? "warning" : null) : tierFor(s.key, s.value);
    return { key: s.label.replace(/\s*\(.*\)/, ""), value: String(s.value), tone: tier || undefined, _tier: tier };
  });

  const allTiers = [...vTiers, fTier, ...riskItems.map((r) => r._tier), critLabs.length ? "critical" : null, marBad.length ? "warning" : null].filter(Boolean);
  const accent = worstTier(allTiers);

  // Deterministic "red flags" - only what needs the doctor's attention now.
  const flags = [];
  const worstVital = vItems.find((i) => i.tone === "critical") || vItems.find((i) => i.tone === "warning");
  if (worstVital) flags.push(`${worstVital.key} ${worstVital.value}`);
  if (critLabs.length) flags.push(`${critLabs.length} critical lab${critLabs.length === 1 ? "" : "s"} (${critLabs.map((l) => l.name).slice(0, 2).join(", ")})`);
  if (marBad.length) flags.push(`${marBad.length} dose${marBad.length === 1 ? "" : "s"} held/missed`);
  if (fTier === "critical") flags.push(`Fluid net ${net > 0 ? "+" : ""}${net} ml`);
  riskItems.filter((r) => r._tier === "critical").forEach((r) => flags.push(`${r.key} ${r.value}`));

  const meta = [];
  if (p.uhid) meta.push({ key: "UHID", value: p.uhid });
  if (p.ward) meta.push({ key: "Ward", value: p.ward });
  if (p.bed) meta.push({ key: "Bed", value: p.bed });
  if (p.admittedOn) meta.push({ key: "Stay", value: dayOfStay(p.admittedOn) });

  const content = [];
  if (accent) content.push({ type: "banner", tone: accent, icon: accent === "critical" ? "danger" : "info-circle", text: accent === "critical" ? "Deteriorating. Critical values present. Review the flags below." : "Some values are outside the normal range." });
  if (flags.length) content.push({ type: "text", variant: "alert", body: `Red flags: ${flags.join("  ·  ")}` });

  if (meta.length) content.push({ type: "keyvalue", items: meta });

  content.push({ type: "text", variant: "heading", body: "Vitals" });
  if (vItems.length) content.push({ type: "keyvalue", items: vItems });

  content.push({ type: "text", variant: "heading", body: "Orders and Labs" });
  const glance = [];
  if (net != null) glance.push({ key: "Fluid net", value: `${net > 0 ? "+" : ""}${net} ml`, tone: fTier || undefined });
  glance.push({ key: "MAR", value: marBad.length ? `${marBad.length} held/missed` : `${mar.length} on track`, tone: marBad.length ? "warning" : undefined });
  glance.push({ key: "Labs", value: `${labs.length} flagged${critLabs.length ? `, ${critLabs.length} crit` : ""}`, tone: critLabs.length ? "critical" : undefined });
  content.push({ type: "keyvalue", items: glance });

  if (riskItems.length) {
    content.push({ type: "text", variant: "heading", body: "Risk Scores" });
    content.push({ type: "keyvalue", items: riskItems.map(({ key, value, tone }) => ({ key, value, tone })) });
  }
  // Latest progress note since the doctor last rounded - whichever of the nursing
  // vs MO note is the most recent. Only that single note is surfaced (the rest live
  // behind the progress-notes pills), so the snapshot stays a 5-second read.
  const anchor = timeline?.lastConsultantNoteAt || null;
  const sinceNotes = [...(timeline?.nursing || []), ...(timeline?.mo || [])]
    .filter((n) => !anchor || !n.recordedAt || new Date(n.recordedAt) >= new Date(anchor))
    .sort((a, b) => new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0));
  const latest = sinceNotes[0];
  if (latest) {
    content.push({ type: "text", variant: "heading", body: "Latest Note" });
    const kindLabel = latest.role === "MO" ? "MO note" : "Nursing note";
    const who = latest.author || latest.recordedBy || "";
    const when = latest.recordedAt ? toDateTimeLabel(latest.recordedAt) : "";
    const body = latest.summary || latest.nursingPlan || latest.generalCondition || "";
    const noteItems = [];
    noteItems.push({ key: "Type", value: kindLabel });
    if (who) noteItems.push({ key: "By", value: who });
    if (when) noteItems.push({ key: "At", value: when });
    content.push({ type: "keyvalue", items: noteItems });
    if (body) content.push({ type: "deflist", items: [{ key: "Summary", value: body }] });
  } else {
    const lastNote = (e?.notes || [])[0];
    if (lastNote) {
      const overnightBody = lastNote.nursingPlan || lastNote.generalCondition || "";
      if (overnightBody) {
        content.push({ type: "text", variant: "heading", body: "Latest Note" });
        content.push({ type: "deflist", items: [{ key: "Overnight", value: overnightBody }] });
      }
    }
  }
  // Cross-referrals
  const refs = (e?.crossReferrals || []).filter((r) => !r.cancel);
  if (refs.length) {
    content.push({ type: "text", variant: "heading", body: "Referrals" });
    const refItems = [];
    refs.forEach((r) => {
      const to = r.crossReferral?.referralInformation?.referringTo || {};
      const hasNotes = (r.crossReferral?.consultantNotes || []).length > 0;
      refItems.push({ key: to.speciality || "Referral", value: `${to.name || "Pending"}`, tone: hasNotes ? undefined : "warning" });
    });
    content.push({ type: "keyvalue", items: refItems });
  }

  // OT / Post-op
  const ot = e?.otNotes || [];
  if (ot.length) {
    content.push({ type: "text", variant: "heading", body: "Post-op" });
    const otItems = [];
    ot.forEach((n) => {
      const sd = n.otNotes?.surgeryDetails || {};
      const proc = Array.isArray(sd.procedureName) ? sd.procedureName[0] : sd.procedureName;
      if (proc) otItems.push({ key: "Procedure", value: proc });
      if (sd.surgeryDate) otItems.push({ key: "Date", value: sd.surgeryDate });
    });
    if (otItems.length) content.push({ type: "keyvalue", items: otItems });
  }

  if (!content.length) content.push({ type: "text", body: "No nursing data recorded for this patient yet." });

  const sexAge = [p.gender, p.age ? `${p.age}y` : null].filter(Boolean).join(", ");
  const status = accent === "critical" ? "**deteriorating** - review the flags" : accent === "warning" ? `${flags.length || "a few"} thing${flags.length === 1 ? "" : "s"} to review` : "stable, nothing flagged";
  return {
    intro: `Rounds snapshot for **${p.name || "the patient"}** - ${status}.`,
    config: {
      kind: "patient_summary",
      sources: [
        { label: "Latest progress note", description: "The single most-recent note (nursing or MO) charted since your last consultant visit - the one thing that changed since you saw the patient." },
        { label: "Red flags", description: "Only values that cross a fixed clinical threshold (critical vital, critical lab, held/missed dose, high fluid net, critical risk) - what should change a rounds decision." },
        { label: "Nursing chart", description: "Vitals, MAR, fluid balance, flagged labs and risk scores compiled from the ward nursing modules." },
      ],
      header: {
        icon: "activity",
        title: "Rounds snapshot",
        date: sexAge || undefined,
        badge: { label: accent ? ALERT_TIER[accent].label : "Stable", tone: accent || "success" },
        accent,
      },
      content,
    },
  };
}

/* ── Progress-notes timeline (nursing rounds + MO notes since last visit) ─────── */
const PROGRESS_KIND = {
  // Nursing progress notes = the nursing module's daily-progress notes, written by
  // any ward nurse across their shift rounds.
  nursing: {
    key: "nursing",
    title: "Nursing progress notes",
    icon: "note-2",
    noun: "nursing progress note",
    source: { label: "Nursing progress notes", description: "Nursing daily-progress module, charted by ward nurses" },
  },
  // MO progress notes = the IPD EMR progress notes, written by medical officers
  // between the consultant's rounds.
  mo: {
    key: "mo",
    title: "MO progress notes",
    icon: "user-tick",
    noun: "MO progress note",
    source: { label: "MO progress notes", description: "IPD EMR progress notes, written by medical officers" },
  },
};

// Distinct authors, in first-seen (newest-first) order, for the intro line.
function authorList(notes) {
  const seen = [];
  notes.forEach((n) => {
    const a = n.author || n.recordedBy;
    if (a && !seen.includes(a)) seen.push(a);
  });
  return seen;
}

function joinNames(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return `**${names[0]}**`;
  if (names.length === 2) return `**${names[0]}** and **${names[1]}**`;
  return `**${names[0]}**, **${names[1]}** and ${names.length - 2} other${names.length - 2 === 1 ? "" : "s"}`;
}

// Map a charted section heading to a relevant (neutral) icon. Only names known to
// exist in the Tesseract icon set are used; anything unmatched falls back to note-2.
const SECTION_ICONS = [
  [/vital/, "pulse"],
  [/\bgcs\b|conscious|neuro|\bcns\b|sensorium/, "user"],
  [/general|condition/, "profile-circle"],
  [/respir|breath|lung|airway|chest/, "health"],
  [/cardio|\bcvs\b|circulation/, "activity"],
  [/diet|\bgi\b|gastro|bowel|nutrition|abdomen|feed/, "menu-board"],
  [/genito|urin|\bgu\b|output|bladder|renal|catheter/, "drop"],
  [/wound|surgical|dressing|incision|skin|stoma/, "band-aids"],
  [/\biv\b|line|drain|cannula|device|infus/, "drop"],
  [/pain/, "danger"],
  [/temp|fever|pyrex/, "health"],
  [/medic|drug|analges|antibiot/, "capsule"],
  [/mobil|adl|ambul|physio/, "activity"],
  [/sleep|comfort|rest/, "user"],
  [/subjective|complaint|\bhistory\b/, "message-text"],
  [/objective|exam/, "search-normal"],
  [/assessment|impression|diagnos/, "clipboard-tick"],
  [/investigat|\blab\b|result|imaging/, "ai-flask"],
  [/advice|recommend|instruction|advis/, "lamp-charge"],
  [/plan/, "clipboard-text"],
];
function sectionIcon(label) {
  const s = String(label || "").toLowerCase();
  for (const [re, icon] of SECTION_ICONS) if (re.test(s)) return icon;
  return "note-2";
}

// The vitals a nurse/MO charts on each round, in the order they read them.
function noteVitalsItems(v) {
  if (!v) return [];
  const items = [];
  if (v.bp) items.push({ key: "BP", value: String(v.bp) });
  if (v.hr != null) items.push({ key: "HR", value: `${v.hr}` });
  if (v.rr != null) items.push({ key: "RR", value: `${v.rr}` });
  if (v.spo2 != null) items.push({ key: "SpO2", value: `${v.spo2}%` });
  if (v.temp != null) items.push({ key: "Temp", value: `${v.temp} C` });
  if (v.pain != null) items.push({ key: "Pain", value: `${v.pain}/10` });
  return items;
}

// One full AgentCardShell config per progress note (its own chat card). Newest
// expanded, older collapsed. Content mirrors the fields charted in the nursing /
// MO progress-note form: vitals row + each documented section verbatim.
function noteCardConfig(n, i, meta, kindKey) {
  const shift = n.shiftType ? String(n.shiftType).charAt(0) + String(n.shiftType).slice(1).toLowerCase() : null;
  const time = n.recordedAt ? toDateTimeLabel(n.recordedAt) : null;
  const author = n.author || n.recordedBy || null;
  const role = n.authorRole || (kindKey === "mo" ? "Medical Officer" : "Staff Nurse");

  const content = [];
  const by = [author, role].filter(Boolean).join(", ");
  if (by) content.push({ type: "keyvalue", items: [{ key: "By", value: by }] });
  if (n.summary) content.push({ type: "text", body: n.summary });
  // Each charted cluster becomes a full-width section: vitals first (as chips),
  // then every documented field as its own heading + body.
  const sections = [];
  const vitals = noteVitalsItems(n.vitals);
  if (vitals.length) sections.push({ heading: "Vitals", icon: "pulse", chips: vitals });
  (Array.isArray(n.fields) ? n.fields : []).forEach((f) => sections.push({ heading: f.label, icon: sectionIcon(f.label), body: f.value }));
  if (sections.length) content.push({ type: "sections", items: sections });
  if (!content.length) content.push({ type: "text", body: "Progress note recorded." });

  return {
    kind: `progress_note_${meta.key}`,
    sources: [meta.source],
    header: {
      icon: meta.icon,
      title: `Progress note ${i + 1}`,
      date: [shift, time].filter(Boolean).join(" - ") || undefined,
      collapsible: true,
      defaultCollapsed: i !== 0,
    },
    content,
  };
}

/**
 * Build the progress-notes response: a two-line intro plus ONE card per note,
 * stacked as separate chat cards (not a single bubble). Returns
 * { intro, cards:[config], sources }.
 */
function buildProgressNotesCards(timeline, patient, kindKey) {
  const meta = PROGRESS_KIND[kindKey] || PROGRESS_KIND.nursing;
  const pt = patient?.name || null;
  const anchor = timeline?.lastConsultantNoteAt || null;
  // Only what was charted after the doctor last rounded; newest first.
  const all = (kindKey === "mo" ? timeline?.mo : timeline?.nursing) || [];
  const notes = all
    .filter((n) => !anchor || !n.recordedAt || new Date(n.recordedAt) >= new Date(anchor))
    .slice()
    .sort((a, b) => new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0));

  const sinceLabel = anchor ? toDateTimeLabel(anchor) : null;

  if (!notes.length) {
    return {
      intro: `No ${meta.noun}s recorded${sinceLabel ? ` since your last visit on ${sinceLabel}` : ""}.`,
      cards: [],
      sources: [meta.source],
    };
  }

  const authors = authorList(notes);
  const line1 = `**${notes.length} ${meta.noun}${notes.length === 1 ? "" : "s"}**${pt ? ` for **${pt}**` : ""}${sinceLabel ? `, since your last visit on **${sinceLabel}**.` : "."}`;
  const line2 = authors.length ? `Charted by ${joinNames(authors)}, newest first.` : "";
  const intro = [line1, line2].filter(Boolean).join("\n");

  return {
    intro,
    cards: notes.map((n, i) => noteCardConfig(n, i, meta, kindKey)),
    sources: [meta.source],
    // Source hand-off: one link that opens every note of this kind as a scrollable
    // print sheet (view / save as PDF).
    print: { kind: "progress", noteKind: meta.key, label: `View all ${notes.length} ${meta.noun}${notes.length === 1 ? "" : "s"}` },
  };
}

/* ── Patient info (the header pills, as an on-demand card) ────────────────────── */
function buildPatientInfoCard(e, patient) {
  const p = e?.patient || patient || {};
  const rows = [];
  if (p.uhid) rows.push({ key: "UHID", value: String(p.uhid) });
  const sexAge = [p.gender, p.age ? `${p.age}y` : null].filter(Boolean).join(", ");
  if (sexAge) rows.push({ key: "Sex / Age", value: sexAge });
  if (p.ward || p.bed) rows.push({ key: "Ward / Bed", value: [p.ward, p.bed].filter(Boolean).join(" - ") });
  if (p.consultant) rows.push({ key: "Consultant", value: String(p.consultant) });
  if (p.admittedOn) rows.push({ key: "Admitted", value: `${toShortDate(p.admittedOn)}${dayOfStay(p.admittedOn) ? ` (${dayOfStay(p.admittedOn)})` : ""}` });
  if (p.primaryDiagnosis) rows.push({ key: "Diagnosis", value: String(p.primaryDiagnosis) });
  return {
    intro: `Patient details${p.name ? ` for **${p.name}**` : ""}.`,
    config: {
      kind: "patient_info",
      sources: [{ label: "Admission record", description: "Patient demographics and admission" }],
      header: { icon: "profile-circle", title: p.name || "Patient info", date: sexAge || undefined },
      content: rows.length ? [{ type: "keyvalue", items: rows }] : [{ type: "text", body: "No patient details available." }],
    },
  };
}

/* ── Cross-referrals ────────────────────────────────────────────────────────── */
function slateToText(slate) {
  if (!slate) return "";
  if (typeof slate === "string") return slate;
  if (Array.isArray(slate)) return slate.map((n) => (n.children || []).map((c) => c.text || "").join("")).join(" ").trim();
  return "";
}

function buildCrossReferralCard(e, pt) {
  const refs = e?.crossReferrals || [];
  if (!refs.length) {
    return {
      intro: `No cross-referrals recorded${pt ? ` for **${pt}**` : ""}.`,
      config: {
        kind: "cross_referral",
        header: { icon: "arrow-swap-horizontal", title: "Cross-referrals" },
        content: [{ type: "text", body: "No cross-referrals found for this patient." }],
      },
    };
  }

  const active = refs.filter((r) => !r.cancel);
  const content = [];

  active.forEach((r, idx) => {
    const info = r.crossReferral?.referralInformation || {};
    const to = info.referringTo || {};
    const consNotes = r.crossReferral?.consultantNotes || [];
    const status = consNotes.length ? "Reviewed" : "Pending";

    if (idx > 0) content.push({ type: "text", variant: "heading", body: `Referral ${idx + 1}` });

    const headerItems = [];
    if (to.name) headerItems.push({ key: "Referred to", value: `${to.name}${to.speciality ? ` (${to.speciality})` : ""}` });
    if (info.referringDepartment) headerItems.push({ key: "From", value: info.referringDepartment });
    if (info.referralDate) headerItems.push({ key: "Date", value: info.referralDate });
    headerItems.push({ key: "Status", value: status, tone: consNotes.length ? "success" : "warning" });
    content.push({ type: "keyvalue", items: headerItems });

    const reason = slateToText(info.reasonForReferral);
    if (reason) content.push({ type: "deflist", items: [{ key: "Reason", value: reason }] });

    if (consNotes.length) {
      const latest = consNotes[consNotes.length - 1];
      const noteItems = [];
      const impression = slateToText(latest.impression);
      if (impression) noteItems.push({ key: "Impression", value: impression });
      if (latest.followUp) noteItems.push({ key: "Follow-up", value: latest.followUp });
      if (noteItems.length) content.push({ type: "deflist", items: noteItems });
    }
  });

  const pending = active.filter((r) => !(r.crossReferral?.consultantNotes || []).length);
  const badge = pending.length ? { label: `${pending.length} pending`, tone: "warning" } : { label: `${active.length} total`, tone: "info" };

  return {
    intro: `**${active.length} cross-referral${active.length === 1 ? "" : "s"}**${pt ? ` for **${pt}**` : ""}${pending.length ? `, ${pending.length} pending review` : ", all reviewed"}.`,
    config: {
      kind: "cross_referral",
      sources: [{ label: "Cross-referral records", description: "IPD cross-referral module" }],
      header: { icon: "arrow-swap-horizontal", title: "Cross-referrals", badge, accent: pending.length ? "warning" : null },
      content,
    },
  };
}

/* ── OT Notes ───────────────────────────────────────────────────────────────── */
function buildOtNotesCard(e, pt) {
  const notes = e?.otNotes || [];
  if (!notes.length) {
    return {
      intro: `No OT notes recorded${pt ? ` for **${pt}**` : ""}.`,
      config: {
        kind: "ot_notes",
        header: { icon: "scissor", title: "OT Notes" },
        content: [{ type: "text", body: "No OT notes or surgical records for this patient." }],
      },
    };
  }

  const content = [];
  notes.forEach((n, idx) => {
    const sd = n.otNotes?.surgeryDetails || {};
    const team = n.otNotes?.surgeryTeam || {};
    const intra = n.otNotes?.intraOperativeNotes || {};
    const postOp = n.otNotes?.postOperativeNotes || {};
    const opNotes = n.otNotes?.operativeNotes || {};

    if (idx > 0) content.push({ type: "text", variant: "heading", body: `Record ${idx + 1}` });

    // Surgery details
    content.push({ type: "text", variant: "heading", body: "Surgery Details" });
    const detailItems = [];
    const proc = Array.isArray(sd.procedureName) ? sd.procedureName.join(", ") : sd.procedureName;
    if (proc) detailItems.push({ key: "Procedure", value: proc });
    if (sd.anaesthesiaType) detailItems.push({ key: "Anaesthesia", value: sd.anaesthesiaType });
    if (sd.surgeryDate) detailItems.push({ key: "Date", value: sd.surgeryDate });
    if (sd.surgeryStartTime && sd.surgeryEndTime) detailItems.push({ key: "Duration", value: `${sd.surgeryStartTime} - ${sd.surgeryEndTime}` });
    if (detailItems.length) content.push({ type: "keyvalue", items: detailItems });
    const diag = slateToText(sd.diagnosis);
    if (diag) content.push({ type: "deflist", items: [{ key: "Diagnosis", value: diag }] });

    // Surgical team
    const teamItems = [];
    if (team.primarySurgeon?.length) teamItems.push({ key: "Primary Surgeon", value: team.primarySurgeon.map((s) => s.name).join(", ") });
    if (team.secondarySurgeon?.length) teamItems.push({ key: "Secondary", value: team.secondarySurgeon.map((s) => s.name).join(", ") });
    if (team.anaesthesiologist) teamItems.push({ key: "Anaesthesiologist", value: team.anaesthesiologist });
    if (team.scrubNurse?.length) teamItems.push({ key: "Scrub Nurse", value: team.scrubNurse.map((s) => s.name).join(", ") });
    if (teamItems.length) {
      content.push({ type: "text", variant: "heading", body: "Surgical Team" });
      content.push({ type: "keyvalue", items: teamItems });
    }

    // Operative findings
    const findings = slateToText(opNotes.operativeFindings);
    const procedure = slateToText(opNotes.operativeProcedure);
    if (findings || procedure) {
      content.push({ type: "text", variant: "heading", body: "Operative Notes" });
      const opItems = [];
      if (findings) opItems.push({ key: "Findings", value: findings });
      if (procedure) opItems.push({ key: "Procedure", value: procedure });
      content.push({ type: "deflist", items: opItems });
    }

    // Intra-operative
    const intraItems = [];
    if (intra.estimatedBloodLoss) intraItems.push({ key: "Blood Loss", value: `${intra.estimatedBloodLoss} ml` });
    if (intra.swabCount) intraItems.push({ key: "Swab Count", value: `${intra.swabCount}` });
    if (intra.fluidCount) intraItems.push({ key: "Fluids", value: `${intra.fluidCount} ml` });
    if (intra.sutureType) intraItems.push({ key: "Suture", value: intra.sutureType });
    if (intraItems.length) {
      content.push({ type: "text", variant: "heading", body: "Intra-operative" });
      content.push({ type: "keyvalue", items: intraItems });
    }

    // Post-operative
    const postInstructions = slateToText(postOp.additionalInstructions);
    if (postInstructions) {
      content.push({ type: "text", variant: "heading", body: "Post-operative" });
      content.push({ type: "deflist", items: [{ key: "Instructions", value: postInstructions }] });
    }
  });

  return {
    intro: `**${notes.length} OT record${notes.length === 1 ? "" : "s"}**${pt ? ` for **${pt}**` : ""}.`,
    config: {
      kind: "ot_notes",
      sources: [{ label: "OT notes", description: "IPD OT notes module - surgical records" }],
      header: { icon: "scissor", title: "OT Notes", badge: { label: `${notes.length}`, tone: "info" } },
      content,
    },
  };
}

/* ── Ward task list (list view) ──────────────────────────────────────────────── */
function buildTaskListCard(tasks) {
  const list = Array.isArray(tasks) ? tasks : [];
  const urgent = list.filter((t) => t.priority === "Urgent").length;
  return {
    intro: list.length ? `${list.length} item${list.length === 1 ? "" : "s"} need your attention${urgent ? `, ${urgent} urgent` : ""}.` : "Nothing needs your attention right now.",
    config: {
      kind: "task_list",
      header: { icon: "clipboard-text", title: "Ward tasks", date: "Ranked by urgency", badge: list.length ? { label: `${list.length}`, tone: "info" } : undefined },
      content: list.length ? [{ type: "tasklist", tasks: list }] : [{ type: "text", body: "No pending items across your in-patients." }],
    },
  };
}

/**
 * Route a tapped/typed message to a card. Deterministic keyword match.
 * @returns {{intro:string, config:object}|null}
 */
export function buildCardForMessage(message, ctx = {}) {
  const m = String(message || "").toLowerCase();
  const e = ctx.entries || {};
  const pt = ctx.patient?.name || null;

  if (ctx.view === "list" || !ctx.patient) {
    if (/critical/.test(m)) return buildTaskListCard((ctx.tasks || []).filter((t) => t.priority === "Urgent"));
    if (/referral/.test(m)) return buildTaskListCard((ctx.tasks || []).filter((t) => t.kind === "Referral"));
    if (/flag.*lab|lab.*flag|concerning/.test(m)) return buildTaskListCard((ctx.tasks || []).filter((t) => t.kind === "Labs"));
    if (/\bot\b|schedule|surgery/.test(m)) return buildTaskListCard((ctx.tasks || []).filter((t) => t.kind === "OT"));
    return buildTaskListCard(ctx.tasks);
  }

  if (/summary|glance|overview|rounds|snapshot|at a glance/.test(m)) return buildSummaryCard(e, ctx.patient, ctx.timeline);
  // Progress-notes timeline: two explicit streams (checked before the generic notes card).
  if (/\b(mo|medical officer)\b.*(progress|note)|progress.*\b(mo|medical officer)\b/.test(m)) return buildProgressNotesCards(ctx.timeline, ctx.patient, "mo");
  if (/(nursing|nurse).*(progress|note)|progress.*(nursing|nurse)/.test(m)) return buildProgressNotesCards(ctx.timeline, ctx.patient, "nursing");
  if (/patient (info|detail|profile)|about (this|the) patient/.test(m)) return buildPatientInfoCard(e, ctx.patient);
  if (/vital\s*trend|trend/.test(m)) return buildVitalTrendsCard(e, pt);
  if (/vital|bp|spo2|sat|temp|pulse|heart/.test(m)) return buildVitalsCard(e, pt);
  if (/med|mar|drug/.test(m)) return buildMarCard(e, pt);
  if (/fluid|intake|output|balance/.test(m)) return buildFluidCard(e, pt);
  if (/lab|investigation|result/.test(m)) return buildLabsCard(e, pt);
  if (/risk|braden|fall|sepsis|qsofa|pain/.test(m)) return buildRiskCard(e, pt);
  if (/referral|cross.?ref|consult.?request/.test(m)) return buildCrossReferralCard(e, pt);
  if (/\bot\b|surgery|surgical|operat|pre.?op|post.?op|ot note/.test(m)) return buildOtNotesCard(e, pt);
  if (/note|progress|handover/.test(m)) return buildNotesCard(e, pt);

  // Generic phrasing in a patient context defaults to the summary.
  return buildSummaryCard(e, ctx.patient, ctx.timeline);
}
