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
const PDFGenerator = ({ settings, data, documentType }) => {
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
  const patientData = data.patientInformation || data.patient || {};

  // Get format settings
  const formatSettings = settings.formatStyle || {};
  const fontFamily = settings.pageFormat?.fontFamily || "Arial";

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
      // TODO: Implement assessment renderer
      console.warn("Assessment renderer not yet implemented");
      break;

    case "progressNotes":
      // TODO: Implement progress notes renderer
      console.warn("Progress notes renderer not yet implemented");
      break;

    case "consultationNotes":
      // TODO: Implement consultation notes renderer
      console.warn("Consultation notes renderer not yet implemented");
      break;

    case "otNotes":
      // TODO: Implement OT notes renderer
      console.warn("OT notes renderer not yet implemented");
      break;

    case "crossReferral":
      // TODO: Implement cross referral renderer
      console.warn("Cross referral renderer not yet implemented");
      break;

    default:
      console.error(`Unknown document type: ${documentType}`);
  }

  return (
    <PDFDocument settings={settings} patientData={patientData}>
      {contentSections}
    </PDFDocument>
  );
};

export default PDFGenerator;
