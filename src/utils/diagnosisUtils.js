import { v4 as uuidv4 } from "uuid";

export const sanitizeProvisionalDiagnosis = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const safeItem = item && typeof item === "object" ? item : {};
    const id =
      safeItem.key || safeItem.objectID || safeItem.unique_id || uuidv4();

    return {
      ...safeItem,
      key: id,
      objectID: safeItem.objectID || id,
      unique_id: safeItem.unique_id || id,
      tds_name: safeItem.name || safeItem.tds_name || "",
      icd_code: safeItem.icd_code || safeItem.icdCode || "",
      notes: safeItem.notes || "",
      icdCode: safeItem.icd_code || safeItem.icdCode || "",
      name: safeItem.name || safeItem.tds_name || "",
    };
  });
};
