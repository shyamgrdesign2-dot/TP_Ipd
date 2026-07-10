// Doctor Agent (doctor-facing, IPD) public surface.
export { default as DoctorAgentMount } from "./DoctorAgentMount";
export { setAgentPatient, clearAgentPatient } from "./stores/patientContext";
export { openPanel, closePanel } from "./stores/panelStore";
