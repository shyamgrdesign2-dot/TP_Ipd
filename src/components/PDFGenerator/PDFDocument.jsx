/**
 * PDF Document Wrapper
 * Main document component that wraps all pages
 */

import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { PAGE_SIZES } from "./constants";
import { getMargins } from "./utils/pdfUtils";
import { createCommonStyles } from "./styles/commonStyles";
import PDFHeader from "./components/PDFHeader";
import PatientInfo from "./components/PatientInfo";

/**
 * PDFDocument Component
 * @param {Object} props - Component props
 * @param {Object} props.settings - PDF settings
 * @param {Object} props.patientData - Patient information
 * @param {Array} props.children - Content sections
 * @returns {JSX.Element} PDF Document
 */
const PDFDocument = ({ settings, patientData, children }) => {
  if (!settings) return null;

  const { pageFormat = {}, headerFooter = {} } = settings;

  const { pageSize = "A4", fontFamily = "Arial", fontSize = 9 } = pageFormat;

  const { header = {}, footer = {}, displayPatientInfo = {} } = headerFooter;

  // Get page dimensions
  const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  // Get margins from footer settings
  const margins = getMargins(footer.margins);

  // Create styles
  const commonStyles = createCommonStyles(fontSize, fontFamily);

  const documentStyles = StyleSheet.create({
    page: {
      ...commonStyles.page,
      paddingTop: margins.top,
      paddingRight: margins.right,
      paddingBottom: margins.bottom,
      paddingLeft: margins.left,
      ...pageDimensions,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <Document>
      <Page size={pageSize} style={documentStyles.page}>
        {/* Header */}
        <PDFHeader headerSettings={header} fontFamily={fontFamily} />

        {/* Patient Information */}
        <PatientInfo
          displaySettings={displayPatientInfo}
          patientData={patientData}
          fontFamily={fontFamily}
        />

        {/* Content */}
        <View style={documentStyles.content}>{children}</View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
