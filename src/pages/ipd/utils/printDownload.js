import { pdf } from "@react-pdf/renderer";
import { PDFGenerator } from "../../../components/PDFGenerator";
import { downloadDocument, printDocument } from "../dischargeSummary/utils/helper";
import { getPatientInformation } from "../../../utils/utils";

export const generatePdfBlob = async (documentType, settings, data, patientDetails) => {
  if (!settings) throw new Error("Missing print settings");
  const element = (
    <PDFGenerator
      settings={settings}
      data={data}
      documentType={documentType}
      patientData={patientDetails ? getPatientInformation(patientDetails) : undefined}
    />
  );
  return await pdf(element).toBlob();
};

export const printWithGenerator = async (
  documentType,
  settings,
  data,
  patientDetails
) => {
  const blob = await generatePdfBlob(documentType, settings, data, patientDetails);
  const patientId = patientDetails?.details?.id;
  printDocument(blob, patientId, documentType);
};

export const downloadWithGenerator = async (
  documentType,
  settings,
  data,
  patientDetails
) => {
  const blob = await generatePdfBlob(documentType, settings, data, patientDetails);
  const url = URL.createObjectURL(blob);
  try {
    downloadDocument(url, blob, patientDetails, documentType);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
};

// Mapping between document type and settings key
const settingsKeyByDocType = {
  dischargeSummary: "dischargeSummary",
  assessment: "assessment",
  progressNotes: "progressNotes",
  consultationNotes: "consultationNotes",
  otNotes: "otNotes",
  crossReferral: "crossReferral",
};

// Build the data object expected by PDFGenerator for each document type
export const buildPdfData = (documentType, patientDetails, rawData) => {
  if (documentType === "progressNotes") {
    const patientInformation = patientDetails ? getPatientInformation(patientDetails) : undefined;
    return { patientInformation, progressNotes: rawData };
  }
  if (documentType === "consultationNotes") {
    const patientInformation = patientDetails ? getPatientInformation(patientDetails) : undefined;
    const notesArray = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.consultantNotes)
      ? rawData.consultantNotes
      : [];
    const sorted = notesArray.slice().sort((a, b) => {
          const dateA = new Date(a?.consultationNotes?.date || a?.createdAt || 0);
          const dateB = new Date(b?.consultationNotes?.date || b?.createdAt || 0);
          return dateB - dateA;
        });
    return { patientInformation, consultantNotes: sorted };
  }
  // For other types, pass through rawData
  return rawData;
};

// Generic data presence check
export const hasPrintableData = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "object") return Object.keys(data).length > 0;
  return !!data;
};

export const printModule = async (documentType, printSettings, patientDetails, rawData) => {
  const settingsKey = settingsKeyByDocType[documentType];
  const settings = settingsKey ? printSettings?.[settingsKey] : undefined;
  if (!settings) return;
  const data = buildPdfData(documentType, patientDetails, rawData);
  if (!hasPrintableData(data)) return;
  await printWithGenerator(documentType, settings, data, patientDetails);
};

export const downloadModule = async (
  documentType,
  printSettings,
  patientDetails,
  rawData
) => {
  const settingsKey = settingsKeyByDocType[documentType];
  const settings = settingsKey ? printSettings?.[settingsKey] : undefined;
  if (!settings) return;
  const data = buildPdfData(documentType, patientDetails, rawData);
  if (!hasPrintableData(data)) return;
  await downloadWithGenerator(documentType, settings, data, patientDetails);
};


