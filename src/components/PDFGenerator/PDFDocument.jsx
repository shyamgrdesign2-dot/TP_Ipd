/**
 * PDF Document Wrapper
 * Main document component that wraps all pages
 */

import React, { useState, useEffect } from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { PAGE_SIZES, LETTERHEAD_FORMATS } from "./constants";
import { getMargins } from "./utils/pdfUtils";
import { createCommonStyles } from "./styles/commonStyles";
import { getFooterImageHeight } from "../../utils/utils";
import PDFHeader from "./components/PDFHeader";
import PatientInfo from "./components/PatientInfo";
import PDFFooter from "./components/PDFFooter";
import PageNumber from "./components/PageNumber";

/**
 * PDFDocument Component
 * @param {Object} props - Component props
 * @param {Object} props.settings - PDF settings
 * @param {Object} props.patientData - Patient information
 * @param {Object} props.fullData - Full discharge summary data
 * @param {Array} props.children - Content sections
 * @returns {JSX.Element} PDF Document
 */
const PDFDocument = ({
  settings,
  patientData,
  children,
  documentType,
  fullData,
  isIpdDynamicDischargeHeadingEnabled = false,
}) => {
  const { pageFormat = {}, headerFooter = {} } = settings || {};
  const {
    header = {},
    footer = {},
    displayPatientInfo = {},
    letterHeadFormat = 0,
    margins: formatMargins = {},
    printMode = "allPages",
    showHeaderFooterPage,
  } = headerFooter;

  const [computedFooterImageHeight, setComputedFooterImageHeight] = useState(null);
  const footerImg = footer?.footerImg;
  const needsFooterHeight = footerImg && (footer.renderedFooterImageHeight == null);

  useEffect(() => {
    if (!needsFooterHeight) return;
    setComputedFooterImageHeight(null);
    let cancelled = false;
    const fetchHeight = async () => {
      const height = await getFooterImageHeight(footerImg);
      if (!cancelled && height != null) {
        setComputedFooterImageHeight(height);
      }
    };
  
    fetchHeight();
    return () => { cancelled = true; };
  }, [needsFooterHeight, footerImg]);

  const footerWithHeight = needsFooterHeight && computedFooterImageHeight != null
    ? { ...footer, renderedFooterImageHeight: computedFooterImageHeight }
    : footer;
  
  if (!settings) return null;

  const {
    pageSize = "A4",
    fontFamily,
    fontSize = 10,
    patientInfoFontSize = 10,
    pagination = false,
  } = pageFormat;

  // Get page dimensions
  const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  // Get margins based on current letterhead format
  // Use format-specific margins if available, otherwise fall back to footer margins (legacy)
  const currentMargins =
    formatMargins[letterHeadFormat] || footer.margins || {};
  const margins = getMargins(currentMargins);
  const baseMargins = getMargins();
  const resolvedPrintMode =
    printMode ||
    (showHeaderFooterPage === "first" ? "firstPage" : "allPages");
  const isOwnLetterheadFirstPageOnly =
    letterHeadFormat === LETTERHEAD_FORMATS.OWN && resolvedPrintMode === "firstPage";
  const firstPageExtraTop = Math.max(0, margins.top - baseMargins.top);

  // Create styles
  const commonStyles = createCommonStyles(fontSize, fontFamily);

  const documentStyles = StyleSheet.create({
    page: {
      ...commonStyles.page,
      paddingTop: isOwnLetterheadFirstPageOnly ? baseMargins.top : margins.top,
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
        {isOwnLetterheadFirstPageOnly && firstPageExtraTop > 0 && (
          <View style={{ height: firstPageExtraTop }} />
        )}
        {/* Header */}
        <PDFHeader
          headerSettings={header}
          letterHeadFormat={letterHeadFormat}
          patientData={patientData}
          documentType={documentType}
          fixed={resolvedPrintMode === "allPages"}
        />

        {/* Patient Information */}
        <PatientInfo
          displaySettings={displayPatientInfo}
          patientData={patientData}
          patientInfoFontSize={patientInfoFontSize}
          documentType={documentType}
          fullData={fullData}
          isIpdDynamicDischargeHeadingEnabled={isIpdDynamicDischargeHeadingEnabled}
        />

        {/* Content */}
        <View style={documentStyles.content}>{children}</View>

        {/* Footer */}
        <View
          fixed
          render={({ pageNumber }) =>
            ((pageNumber === 1 && resolvedPrintMode === "firstPage") || resolvedPrintMode === "allPages") ? (
              <PDFFooter
                footerSettings={footerWithHeight}
                fontFamily={fontFamily}
                letterHeadFormat={letterHeadFormat}
                showPageNumbers={pageFormat?.pagination}
                fixed={false}
              />
            ) : null
          }
        />

        {pagination && <PageNumber />}
      </Page>
    </Document>
  );
};

export default PDFDocument;
