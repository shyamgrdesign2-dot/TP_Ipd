import ApiMedication from "../../../api/services/ApiMedication";
import ApiInvestigation from "../../../api/services/ApiInvestigation";

const toList = (res) =>
  Array.isArray(res) ? res : res?.status ? res.data ?? [] : res?.data ?? [];

const norm = (s) => String(s || "").trim().toLowerCase();

const indexMeds = (list) => {
  const byId = new Map();
  list.forEach((m) => {
    if (m.tmm_id != null) byId.set(String(m.tmm_id), m);
  });
  return byId;
};

const indexLabs = (list) => {
  const byName = new Map();
  list.forEach((l) => {
    if (l.investigation_name) byName.set(norm(l.investigation_name), l);
  });
  return byName;
};

export async function enrichZydusIpdOrderPayload(
  medication = [],
  labInvestigation = []
) {
  const [freqMeds, freqLabs] = await Promise.all([
    ApiMedication.getFrequentlySearchedMedication().catch(() => null),
    ApiInvestigation.getFrequentlySearchedInvestigation().catch(() => null),
  ]);

  const medCatalog = indexMeds(toList(freqMeds));
  const labCatalog = indexLabs(toList(freqLabs));

  const medNames = [
    ...new Set(
      medication
        .filter((m) => !m.reference_id && m.tmm_id && String(m.tmm_id) !== "0")
        .map((m) => m.tmm_medicine_name)
        .filter(Boolean)
    ),
  ];
  const labNames = [
    ...new Set(
      labInvestigation
        .filter((l) => !l.service_code && l.name)
        .map((l) => l.name)
    ),
  ];

  await Promise.all([
    ...medNames.map(async (name) => {
      const res = await ApiMedication.searchMedication(name).catch(() => null);
      toList(res).forEach((m) => {
        if (m.tmm_id != null) medCatalog.set(String(m.tmm_id), m);
      });
    }),
    ...labNames.map(async (name) => {
      const res = await ApiInvestigation.searchInvestigation(name).catch(() => null);
      toList(res).forEach((l) => {
        if (l.investigation_name) labCatalog.set(norm(l.investigation_name), l);
      });
    }),
  ]);

  return {
    medication: medication.map((med) => {
      if (med.reference_id) return med;
      const match = medCatalog.get(String(med.tmm_id));
      return match?.reference_id
        ? { ...med, reference_id: match.reference_id }
        : med;
    }),
    labInvestigation: labInvestigation.map((lab) => {
      if (lab.service_code) return lab;
      const match = labCatalog.get(norm(lab.name));
      return match?.service_code
        ? { ...lab, service_code: match.service_code }
        : lab;
    }),
  };
}
