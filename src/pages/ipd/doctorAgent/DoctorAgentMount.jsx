import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@dhspl-tatvacare/tesseract-ui/styles.css";
import "./styles/doctorAgent.css";
import { DoctorAgentFab } from "./DoctorAgentFab.jsx";
import { DoctorAgentPanel } from "./DoctorAgentPanel.jsx";
import { NursingNotePrintView } from "./panel/NursingNotePrintView.jsx";
import { ProgressNotesPrintView } from "./panel/ProgressNotesPrintView.jsx";
import { useAgentOpen, openPanel, closePanel } from "./stores/panelStore.js";
import { setAgentPatient, clearAgentPatient } from "./stores/patientContext.js";
import { ensureAgentAuth } from "./services/agentApi.js";
import { verifyWiring } from "./services/doctorAgentService.js";
import { IPD_PATH_PREFIX } from "./constants.js";

/**
 * Root-level mount for the doctor-facing Doctor Agent. Self-gates to the IPD module
 * (whole module: board + patient hub) so it survives the IPD split routing. When
 * open, toggles a body class so the app content shrinks and the panel docks beside.
 */
export function DoctorAgentMount() {
  const location = useLocation();
  const open = useAgentOpen();
  const onIpd = (location.pathname || "").startsWith(IPD_PATH_PREFIX);
  const active = onIpd && open;

  // Push-content dock (body class drives #root padding-right in the css).
  useEffect(() => {
    document.body.classList.toggle("da-panel-open", active);
    return () => document.body.classList.remove("da-panel-open");
  }, [active]);

  // Close the panel when leaving the IPD module.
  useEffect(() => {
    if (!onIpd && open) closePanel();
  }, [onIpd, open]);

  // Standalone dev bootstrap: get a :4000 JWT on first IPD visit + log a one-time
  // wiring check (login + one IPD data call).
  useEffect(() => {
    if (!onIpd) return undefined;
    let cancelled = false;
    ensureAgentAuth().then(() => {
      if (cancelled) return;
      verifyWiring().then((r) => {
        // eslint-disable-next-line no-console
        console.info("[DoctorAgent] wiring:", r.ok ? `OK (${r.admissions} admissions on :4000)` : "FAILED", r);
      });
    });
    return () => { cancelled = true; };
  }, [onIpd]);

  // Dev-only QA affordance: drive patient context + panel from the console.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    window.__doctorAgent = { setAgentPatient, clearAgentPatient, openPanel, closePanel };
  }, []);

  if (!onIpd) return null;
  return (
    <>
      <DoctorAgentFab hidden={open} />
      <DoctorAgentPanel />
      <NursingNotePrintView />
      <ProgressNotesPrintView />
    </>
  );
}

export default DoctorAgentMount;
