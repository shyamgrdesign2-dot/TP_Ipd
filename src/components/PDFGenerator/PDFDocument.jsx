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
import PDFFooter from "./components/PDFFooter";

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

  const { pageSize = "A4", fontFamily, fontSize = 9 } = pageFormat;

  const {
    header = {},
    footer = {},
    displayPatientInfo = {},
    letterHeadFormat = 0,
    margins: formatMargins = {},
  } = headerFooter;

  // Get page dimensions
  const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  // Get margins based on current letterhead format
  // Use format-specific margins if available, otherwise fall back to footer margins (legacy)
  const currentMargins =
    formatMargins[letterHeadFormat] || footer.margins || {};
  const margins = getMargins(currentMargins);

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
        <PDFHeader
          headerSettings={header}
          fontFamily={fontFamily}
          letterHeadFormat={letterHeadFormat}
        />

        {/* Patient Information */}
        <PatientInfo
          displaySettings={displayPatientInfo}
          patientData={patientData}
          fontFamily={fontFamily}
        />

        {/* Content */}
        <View style={documentStyles.content}>{children}</View>

        {/* Footer */}
        <PDFFooter
          footerSettings={footer}
          fontFamily={fontFamily}
          letterHeadFormat={letterHeadFormat}
          showPageNumbers={pageFormat?.pagination}
        />
      </Page>
    </Document>
  );
};

export default PDFDocument;
