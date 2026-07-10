import { useEffect, useState } from "react";
import { Header, TPIcon } from "@dhspl-tatvacare/tesseract-ui";
import { useAgentPatient } from "../stores/patientContext.js";
import { usePrintView, closePrintView } from "../stores/printViewStore.js";
import { fetchDoctorEntries } from "../services/doctorAgentService.js";
import { to12h } from "../utils/format.js";

/**
 * NursingNotePrintView - the doctor-facing mirror of the HIMS consult-note print
 * view: a right sidebar rendering the NURSING record for the patient (what the
 * nurse charted) as a print-style sheet - vitals, MAR, fluid balance, flagged
 * labs, risk scores, nursing notes. Opened from a card's Source affordance.
 */

const dash = (v) => (v != null && String(v).trim() !== "" ? String(v) : "-");

export function NursingNotePrintView() {
  const { open } = usePrintView();
  const patient = useAgentPatient();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    fetchDoctorEntries(patient).then((e) => { if (alive) setEntries(e); });
    return () => { alive = false; };
  }, [open, patient]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") closePrintView(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const e = entries || {};
  const v = e.vitals?.latest || {};
  const mar = e.mar || [];
  const f = e.fluid || {};
  const labs = e.labs || [];
  const risk = e.risk || [];
  const notes = (e.notes || []).slice(0, 3);
  const net = f.balance != null ? f.balance : (f.totalIntake || 0) - (f.totalOutput || 0);

  const name = patient?.name || "Patient";
  const uhid = patient?.uhid || patient?.patientId || "-";
  const meta = [patient?.age ? `${patient.age}y` : null, patient?.gender, patient?.ward, patient?.bed].filter(Boolean).join(" · ");
  const chartedBy = v.recordedBy || notes[0]?.recordedBy || "Ward nursing";

  return (
    <>
      <div className="da-pv-backdrop" onClick={closePrintView} aria-hidden />
      <aside className="da-pv-panel" role="dialog" aria-modal="true" aria-label="Nursing record print view">
        <Header
          height={50}
          bordered
          back
          onBack={closePrintView}
          backIcon="close-circle"
          backIconVariant="bold"
          background="var(--tesseract-slate-0, #ffffff)"
          leading={(
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tp-slate-800, #2C2C35)", whiteSpace: "nowrap" }}>Nursing record</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--tp-slate-500, #717179)", background: "var(--tp-slate-100, #F1F1F5)", borderRadius: 4, padding: "2px 6px" }}>Nursing chart</span>
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
                <div style={{ fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>Inpatient Nursing Record</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>
                <div>As of: {v.recordedAt ? to12h(v.recordedAt) : "Today"}</div>
                <div>Charted by: <b style={{ color: "var(--tp-slate-800, #2C2C35)" }}>{chartedBy}</b></div>
              </div>
            </div>

            <PvRow>
              <PvField label="Patient" value={name} />
              <PvField label="UHID" value={uhid} />
              <PvField label="Details" value={meta || "-"} />
            </PvRow>

            <PvSection title="Latest vitals">
              <PvGrid items={[
                ["BP", `${dash(v.systolicBP)}/${dash(v.diastolicBP)} mmHg`], ["HR", `${dash(v.heartRate)} /min`], ["SpO2", `${dash(v.spo2)} %`],
                ["Temp", `${dash(v.temperature)} C`], ["RR", `${dash(v.respiratoryRate)} /min`], ["Recorded", v.recordedAt ? to12h(v.recordedAt) : "-"],
              ]} />
            </PvSection>

            <PvSection title={`Active medications - MAR (${mar.length})`}>
              {mar.length ? (
                <table className="da-pv-table">
                  <thead><tr><th>Drug</th><th>Dose</th><th>Route</th><th>Frequency</th><th>Status</th></tr></thead>
                  <tbody>
                    {mar.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{dash(m.drugName)}</td>
                        <td>{dash(m.dose)}</td>
                        <td>{dash(m.route)}</td>
                        <td>{dash(m.frequency)}</td>
                        <td>{dash(m.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <Empty text="No active medications on the MAR." />}
            </PvSection>

            <PvSection title="Fluid balance (24h)">
              <PvGrid items={[["Intake", `${dash(f.totalIntake)} ml`], ["Output", `${dash(f.totalOutput)} ml`], ["Net", `${net > 0 ? "+" : ""}${net} ml`]]} />
            </PvSection>

            <PvSection title={`Flagged labs (${labs.length})`}>
              {labs.length ? (
                <table className="da-pv-table">
                  <thead><tr><th>Test</th><th>Value</th><th>Reference</th></tr></thead>
                  <tbody>
                    {labs.map((l, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{dash(l.name)}</td>
                        <td>{`${l.flag === "low" ? "v " : l.flag === "high" ? "^ " : ""}${dash(l.value)}${l.unit ? ` ${l.unit}` : ""}`}</td>
                        <td>{dash(l.refRange)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <Empty text="No flagged lab results." />}
            </PvSection>

            {risk.length > 0 && (
              <PvSection title="Nursing risk scores">
                <PvGrid items={risk.map((s) => [s.label, String(s.value)])} />
              </PvSection>
            )}

            <PvSection title="Nursing notes">
              {notes.length ? notes.map((n, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--tp-slate-700, #454551)" }}>{dash(n.nursingPlan || n.generalCondition)}</p>
                  <div style={{ fontSize: 10.5, color: "var(--tp-slate-400, #A2A2A8)", marginTop: 2 }}>
                    {[n.shiftType, n.recordedBy, n.recordedAt ? to12h(n.recordedAt) : null].filter(Boolean).join(" · ")}
                  </div>
                </div>
              )) : <Empty text="No nursing notes recorded." />}
            </PvSection>

            <div style={{ marginTop: 18, paddingTop: 10, borderTop: "1px dashed var(--tp-slate-200, #E2E2EA)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--tp-slate-500, #717179)" }}>
              <span>Electronically recorded on the ward</span>
              <span style={{ textAlign: "right" }}><b style={{ color: "var(--tp-slate-800, #2C2C35)" }}>{chartedBy}</b><br />Ward nursing</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Empty({ text }) {
  return <p style={{ margin: 0, fontSize: 12, color: "var(--tp-slate-400, #A2A2A8)" }}>{text}</p>;
}
function PvRow({ children }) {
  return <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>{children}</div>;
}
function PvField({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.3, color: "var(--tp-slate-400, #A2A2A8)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tp-slate-800, #2C2C35)" }}>{value}</div>
    </div>
  );
}
function PvSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--tp-blue-600, #3C3BB5)", marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}
function PvGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px 12px" }}>
      {items.map(([k, val], i) => (
        <div key={i} style={{ fontSize: 12 }}>
          <span style={{ color: "var(--tp-slate-400, #A2A2A8)" }}>{k}: </span>
          <b style={{ color: "var(--tp-slate-800, #2C2C35)" }}>{val}</b>
        </div>
      ))}
    </div>
  );
}
