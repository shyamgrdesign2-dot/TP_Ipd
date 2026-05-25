import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.lab_params_api_url };

export async function fetchOpthalPrescriptionByVisit({ tcmId, patientId, signal }) {
  if (tcmId == null || patientId == null || patientId === "") {
    return null;
  }
  const qs = new URLSearchParams({
    tcm_id: String(tcmId),
    patientId: String(patientId),
  });
  try {
    const res = await api.get(`/api/v1/opthal-prescription?${qs.toString()}`, {
      ...baseUrl,
      ...(signal ? { signal } : {}),
    });
    return res ?? null;
  } catch (e) {
    if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") {
      return null;
    }
    console.error("fetchOpthalPrescriptionByVisit:", e);
    return null;
  }
}
