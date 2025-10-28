/**
 * PDF Generator Component
 * Main component that generates PDFs based on configurable settings and data
 *
 * @example
 * <PDFGenerator
 *   settings={settingsData.dischargeSummary}
 *   data={dischargeSummaryData}
 * />
 */

import React from "react";
import PDFDocument from "./PDFDocument";
import { registerFonts } from "./utils/fontRegistration";
import { renderDischargeSummary } from "./sections/discharge/DischargeSummaryRenderer";
import { renderConsultantNotes } from "./sections/consultation/ConsultantNotesRenderer";
import { renderProgressNotes } from "./sections/progressNotes/ProgressNotesRenderer";
import { renderAdmissionAssessment } from "./sections/discharge/AdmissionAssessmentRenderer";
import { IPD } from "../../utils/locale";
import { renderOTNotes } from "./sections/discharge/OTNotesRenderer";
import { renderCrossReferral } from "./sections/discharge/CrossReferralRenderer";

// Register fonts once
let fontsRegistered = false;
if (!fontsRegistered) {
  try {
    registerFonts();
    fontsRegistered = true;
  } catch (error) {
    console.error("Error registering fonts:", error);
  }
}

/**
 * PDFGenerator Component
 * @param {Object} props - Component props
 * @param {Object} props.settings - Configuration settings for the document
 * @param {Object} props.data - Content data to display
 * @param {Object} props.documentType - Document type
 * @returns {JSX.Element} PDF Document
 */
const PDFGenerator = ({
  settings,
  data,
  documentType,
  patientData: patientDataFromProps,
}) => {
  // Validate props
  if (!settings) {
    console.error("PDFGenerator: settings prop is required");
    return null;
  }

  if (!data) {
    console.error("PDFGenerator: data prop is required");
    return null;
  }

  // Extract patient data
  const patientData =
    patientDataFromProps || data.patientInformation || data.patient || {};

  // Get format settings - formatStyle is now always an array
  const formatSettings = settings.formatStyle || [];
  const fontFamily = settings.pageFormat?.fontFamily;

  // Render content based on document type
  let contentSections = [];

  switch (documentType) {
    case "dischargeSummary":
      contentSections = renderDischargeSummary(
        data,
        formatSettings,
        fontFamily
      );
      break;

    case "assessment":
      contentSections = renderAdmissionAssessment(
        data,
        formatSettings,
        fontFamily
      );
      break;

    case "progressNotes":
      contentSections = renderProgressNotes(data, formatSettings, fontFamily);
      break;

    case "consultationNotes":
      contentSections = renderConsultantNotes(data, formatSettings, fontFamily);
      break;

    case "otNotes":
      contentSections = renderOTNotes(data, formatSettings, fontFamily);
      break;

    case "crossReferral":
      contentSections = renderCrossReferral(data, formatSettings, fontFamily);
      break;

    default:
      console.error(`Unknown document type: ${documentType}`);
      break;
  }

  return (
    <PDFDocument settings={settings} patientData={patientData}>
      {contentSections}
    </PDFDocument>
  );
};

export default PDFGenerator;
