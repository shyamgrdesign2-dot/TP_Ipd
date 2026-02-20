import { pdf } from "@react-pdf/renderer";
import { PDFGenerator } from "../../../components/PDFGenerator";
import { downloadDocument, printDocument } from "../dischargeSummary/utils/helper";
import { getPatientInformation } from "../../../utils/utils";
import { sanitizePrintSettingsForPdf } from "../../../utils/printSettings";
import { store } from "../../../redux/store";

const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

const prepareSettingsForPdf = (documentType, settings) => {
  if (!settings) return settings;
  const state = store.getState();
  const fileStates = state?.printSettings?.fileStates || {};
  const moduleType = settingsKeyByDocType[documentType];
  const moduleFiles = moduleType ? fileStates[moduleType] || {} : {};

  const resolveAsset = (pathVal, fileObj) =>
    (fileObj && isHttpUrl(fileObj.showFile) && fileObj.showFile) || pathVal;

  const next = JSON.parse(JSON.stringify(settings));
  const header =
    next?.headerFooter?.header || next?.header_footer?.header || next?.headerFooter?.header || {};
  const footer =
    next?.headerFooter?.footer || next?.header_footer?.footer || next?.headerFooter?.footer || {};

  const fileHeader = moduleFiles.fileHeader;
  const fileFooter = moduleFiles.fileFooter;
  const fileLogo = moduleFiles.fileLogo;

  if (fileHeader) {
    if (fileHeader.showFile) header.headerImg = resolveAsset(header.headerImg, fileHeader);
  }
  if (fileLogo) {
    if (fileLogo.showFile) header.logo = resolveAsset(header.logo, fileLogo);
  }
  if (fileFooter) {
    if (fileFooter.showFile) footer.footerImg = resolveAsset(footer.footerImg, fileFooter);
    if (fileFooter.renderedFooterImageHeight != null) {
      footer.renderedFooterImageHeight = fileFooter.renderedFooterImageHeight;
    }
  }

  if (next.headerFooter) {
    next.headerFooter.header = { ...(next.headerFooter.header || {}), ...header };
    next.headerFooter.footer = { ...(next.headerFooter.footer || {}), ...footer };
  }

  if (next.header_footer) {
    next.header_footer.header = { ...(next.header_footer.header || {}), ...header };
    next.header_footer.footer = { ...(next.header_footer.footer || {}), ...footer };
  }

  return sanitizePrintSettingsForPdf(next);
};

export const generatePdfBlob = async (documentType, settings, data, patientDetails, frequencyList, timingList) => {
  if (!settings) throw new Error("Missing print settings");
  const prepared = prepareSettingsForPdf(documentType, settings);
  const element = (
    <PDFGenerator
      settings={prepared}
      data={data}
      documentType={documentType}
      patientData={patientDetails ? getPatientInformation(patientDetails) : undefined}
      frequencyList={frequencyList}
      timingList={timingList}
    />
  );
  return await pdf(element).toBlob();
};

export const printWithGenerator = async (
  documentType,
  settings,
  data,
  patientDetails,
  frequencyList,
  timingList
) => {
  const blob = await generatePdfBlob(documentType, settings, data, patientDetails, frequencyList, timingList);
  const patientId = patientDetails?.details?.id;
  printDocument(blob, patientId, documentType);
};

export const downloadWithGenerator = async (
  documentType,
  settings,
  data,
  patientDetails,
  frequencyList,
  timingList
) => {
  const blob = await generatePdfBlob(documentType, settings, data, patientDetails, frequencyList, timingList);
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
  assessments: "assessments",
  progressNotes: "progressNotes",
  consultationNotes: "consultationNotes",
  otNotes: "otNotes",
  crossReferral: "crossReferral",
  admissionDetails: "admissionDetails",
};

// Build the data object expected by PDFGenerator for each document type
export const buildPdfData = (documentType, patientDetails, rawData) => {
  if (documentType === "progressNotes") {
    const patientInformation = patientDetails ? getPatientInformation(patientDetails) : undefined;
    return { patientInformation, progressNotes: rawData };
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

export const printModule = async (documentType, printSettings, patientDetails, rawData, frequencyList = [], timingList = []) => {
  const settingsKey = settingsKeyByDocType[documentType];
  const settings = settingsKey ? printSettings?.[settingsKey] : undefined;
  if (!settings) return;
  const data = buildPdfData(documentType, patientDetails, rawData);
  if (!hasPrintableData(data)) return;
  await printWithGenerator(documentType, settings, data, patientDetails, frequencyList, timingList);
};

export const downloadModule = async (
  documentType,
  printSettings,
  patientDetails,
  rawData,
  frequencyList = [],
  timingList = []
) => {
  const settingsKey = settingsKeyByDocType[documentType];
  const settings = settingsKey ? printSettings?.[settingsKey] : undefined;
  if (!settings) return;
  const data = buildPdfData(documentType, patientDetails, rawData);
  if (!hasPrintableData(data)) return;
  await downloadWithGenerator(documentType, settings, data, patientDetails, frequencyList, timingList);
};
