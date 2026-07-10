import { useEffect, useState } from "react";
import { Header, TPIcon } from "@dhspl-tatvacare/tesseract-ui";
import { useAgentPatient } from "../stores/patientContext.js";
import { useProgressPrint, closeProgressPrint } from "../stores/progressPrintStore.js";
import { fetchProgressTimeline } from "../services/doctorAgentService.js";
import { toDateTimeLabel } from "../utils/format.js";

/**
 * ProgressNotesPrintView - opened from the Source affordance on a progress-notes
 * card. Renders EVERY progress note of the chosen kind (nursing | mo) charted
 * since the doctor's last visit as one scrollable, printable sheet, so the doctor
 * can read all of them end to end (or print/save as a PDF).
 */

const dash = (v) => (v != null && String(v).trim() !== "" ? String(v) : "-");

const KIND_META = {
  nursing: { title: "Nursing progress notes", tag: "Nursing", heading: "Inpatient Nursing Progress Notes" },
  mo: { title: "MO progress notes", tag: "Medical Officer", heading: "Inpatient MO Progress Notes" },
};

export function ProgressNotesPrintView() {
  const { open, kind } = useProgressPrint();
  const patient = useAgentPatient();
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    fetchProgressTimeline(patient).then((t) => { if (alive) setTimeline(t); });
    return () => { alive = false; };
  }, [open, patient]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") closeProgressPrint(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const meta = KIND_META[kind] || KIND_META.nursing;
  const anchor = timeline?.lastConsultantNoteAt || null;
  const all = (kind === "mo" ? timeline?.mo : timeline?.nursing) || [];
  const notes = all
    .filter((n) => !anchor || !n.recordedAt || new Date(n.recordedAt) >= new Date(anchor))
    .slice()
    .sort((a, b) => new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0));

  const name = patient?.name || "Patient";
  const uhid = patient?.uhid || patient?.patientId || "-";
  const strip = [patient?.age ? `${patient.age}y` : null, patient?.gender, patient?.ward, patient?.bed].filter(Boolean).join(" · ");
  const since = anchor ? toDateTimeLabel(anchor) : null;

  return (
    <>
      <div className="da-pv-backdrop" onClick={closeProgressPrint} aria-hidden />
      <aside className="da-pv-panel" role="dialog" aria-modal="true" aria-label={`${meta.title} print view`}>
        <Header
          height={50}
          bordered
          back
          onBack={closeProgressPrint}
          backIcon="close-circle"
          backIconVariant="bold"
          background="var(--tesseract-slate-0, #ffffff)"
          leading={(
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tp-slate-800, #2C2C35)", whiteSpace: "nowrap" }}>{meta.title}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--tp-slate-500, #717179)", background: "var(--tp-slate-100, #F1F1F5)", borderRadius: 4, padding: "2px 6px" }}>{notes.length}</span>
            </span>
          )}
          actions={[
            {
              type: "node",
              node: (
                <button type="button" className="da-pv-tbtn" onClick={() => window.print()} aria-label="Print" style={{ color: "var(--tp-slate-600, #545460)" }}>
                  <TPIcon name="printer" variant="linear" size={20} color="var(--tp-slate-600, #545460)" />
                </button>
              ),
            },
            { type: "cta", icon: "document-download", variant: "ghost", theme: "neutral", ariaLabel: "Download", onClick: () => window.print() },
          ]}
        />

        <div className="da-pv-scroll">
          <div className="da-pv-sheet">
            {/* Letterhead */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--tp-blue-500, #4B4AD5)", paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tp-slate-900, #171725)" }}>Zydus Hospital</div>
                <div style={{ fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>{meta.heading}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>
                <div>{notes.length} note{notes.length === 1 ? "" : "s"}</div>
                {since && <div>Since {since}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <PvField label="Patient" value={name} />
              <PvField label="UHID" value={uhid} />
              <PvField label="Details" value={strip || "-"} />
            </div>

            {notes.length ? notes.map((n, i) => {
              const author = n.author || n.recordedBy || "-";
              const role = n.authorRole || (kind === "mo" ? "Medical Officer" : "Staff Nurse");
              const shift = n.shiftType ? String(n.shiftType).charAt(0) + String(n.shiftType).slice(1).toLowerCase() : null;
              const v = n.vitals || {};
              const vitals = [
                v.bp ? ["BP", `${v.bp} mmHg`] : null,
                v.hr != null ? ["HR", `${v.hr} /min`] : null,
                v.rr != null ? ["RR", `${v.rr} /min`] : null,
                v.spo2 != null ? ["SpO2", `${v.spo2} %`] : null,
                v.temp != null ? ["Temp", `${v.temp} C`] : null,
                v.pain != null ? ["Pain", `${v.pain}/10`] : null,
              ].filter(Boolean);
              return (
                <div key={n.id || i} className="da-note-page" style={{ marginBottom: 16, pageBreakBefore: i > 0 ? "always" : "auto" }}>
                  {i > 0 && <div className="da-page-divider" aria-hidden />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--tp-slate-200, #E2E2EA)", paddingBottom: 5, marginBottom: 8, breakInside: "avoid" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tp-slate-900, #171725)" }}>Progress note {i + 1}</span>
                    <span style={{ fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>{[shift, n.recordedAt ? toDateTimeLabel(n.recordedAt) : null].filter(Boolean).join(" · ")}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--tp-slate-500, #717179)", marginBottom: 8 }}>By: <b style={{ color: "var(--tp-slate-800, #2C2C35)" }}>{author}</b>, {role}</div>
                  {n.summary && <p style={{ margin: "0 0 8px", fontSize: 12, lineHeight: 1.55, color: "var(--tp-slate-700, #454551)" }}>{n.summary}</p>}
                  {vitals.length > 0 && (
                    <div style={{ marginBottom: 8, breakInside: "avoid" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tp-slate-600, #545460)", marginBottom: 5 }}>Vitals</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px 12px" }}>
                        {vitals.map(([k, val], vi) => (
                          <div key={vi} style={{ fontSize: 12 }}>
                            <span style={{ color: "var(--tp-slate-400, #A2A2A8)" }}>{k}: </span>
                            <b style={{ color: "var(--tp-slate-800, #2C2C35)" }}>{val}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(n.fields) && n.fields.map((f, fi) => (
                    <div key={fi} style={{ marginBottom: 6, breakInside: "avoid" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tp-slate-600, #545460)", marginBottom: 2 }}>{f.label}</div>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "var(--tp-slate-700, #454551)" }}>{dash(f.value)}</p>
                    </div>
                  ))}
                </div>
              );
            }) : <p style={{ margin: 0, fontSize: 12, color: "var(--tp-slate-400, #A2A2A8)" }}>No progress notes recorded since your last visit.</p>}

            <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px dashed var(--tp-slate-200, #E2E2EA)", fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>
              Electronically recorded in the IPD record.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function PvField({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.3, color: "var(--tp-slate-400, #A2A2A8)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tp-slate-800, #2C2C35)" }}>{value}</div>
    </div>
  );
}
