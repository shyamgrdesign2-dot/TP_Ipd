import moment from "moment";

const EMPTY_DISCHARGE_VALUES = new Set([
  "",
  "-",
  "na",
  "n/a",
  "null",
  "undefined",
  "invalid date",
]);

const hasMeaningfulValue = (value) => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return !EMPTY_DISCHARGE_VALUES.has(normalized);
};

const isValidDischargeDate = (value) => {
  if (!hasMeaningfulValue(value)) return false;

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    const str = value.trim();
    if (!str) return false;
    const withFormat = moment(str, ["DD-MM-YYYY", "DD/MM/YYYY", moment.ISO_8601], true);
    if (withFormat.isValid()) return true;
    return moment(str).isValid();
  }

  return false;
};

const isValidDischargeNo = (value) => {
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (!hasMeaningfulValue(value)) return false;
  return String(value).trim() !== "0";
};

export const isDischargedByDischargeInfo = (patient) => {
  const dateOfDischarge =
    patient?.dateOfDischarge ??
    patient?.patientData?.dateOfDischarge ??
    patient?.patientData?.date_of_discharge;
  const dischargeNo =
    patient?.dischargeNo ??
    patient?.patientData?.dischargeNo ??
    patient?.patientData?.discharge_no;

  return (
    patient?.is_discharged || (isValidDischargeDate(dateOfDischarge) && isValidDischargeNo(dischargeNo))
  );
};
