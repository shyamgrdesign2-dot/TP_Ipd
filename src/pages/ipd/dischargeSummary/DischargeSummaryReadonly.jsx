import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import "./styles.scss";
import { PDFGenerator } from "../../../components/PDFGenerator";
import {
  handleDownloadDischargeSummary,
  printDischargeSummary,
} from "./utils/helper";

import { useSelector } from "react-redux";
import DischargeSummaryTracker from "./components/CollapsibleSummaryTracker/DischargeSummaryTracker";
import DischargeSummaryLoading from "./components/DischargeSummaryLoading/DischargeSummaryLoading";
import { useLocation } from "react-router-dom";
import { useResolvedPatientInfo } from "../../../hooks/useTpmlReferenceId";
import { GB_IPD_DYNAMIC_DISCHARGE_HEADING } from "../../../utils/constants";
import {
  getSasExpiryInfo,
  sanitizePrintSettingsForPdf,
} from "../../../utils/printSettings";
import useResolvedAssetUrl from "../../../hooks/useResolvedAssetUrl";
import useFooterImageHeight from "../../../hooks/useFooterImageHeight";
import { LETTERHEAD_FORMATS } from "../../../components/PDFGenerator";

const DischargeSummaryReadonly = forwardRef((props, ref) => {
  const isIpdDynamicDischargeHeadingEnabled = useFeatureIsOn(
    GB_IPD_DYNAMIC_DISCHARGE_HEADING
  );
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { printSettings } = useSelector((state) => state.printSettings);
  const { actualDischargeSummaryData: dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { dischargeSummary: currentSettings } = printSettings;
  const resolvedHeaderImg = useResolvedAssetUrl({
    moduleType: "dischargeSummary",
    assetKey: "headerImg",
    assetValue: currentSettings?.headerFooter?.header?.headerImg,
    fileType: "fileHeader",
    settingsPath: ["headerFooter", "header", "headerImg"],
  });
  const resolvedFooterImg = useResolvedAssetUrl({
    moduleType: "dischargeSummary",
    assetKey: "footerImg",
    assetValue: currentSettings?.headerFooter?.footer?.footerImg,
    fileType: "fileFooter",
    settingsPath: ["headerFooter", "footer", "footerImg"],
  });
  const usesUploadedLetterhead =
    currentSettings?.headerFooter?.letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD;
  const configuredFooterImg = usesUploadedLetterhead
    ? currentSettings?.headerFooter?.footer?.footerImg
    : null;
  const footerHeight = useFooterImageHeight({
    moduleType: "dischargeSummary",
    footerImg: resolvedFooterImg,
    enabled: Boolean(resolvedFooterImg),
  });
  const footerReady =
    !configuredFooterImg ||
    (Boolean(resolvedFooterImg) &&
      typeof footerHeight === "number" &&
      footerHeight > 0);
  const resolvedLogo = useResolvedAssetUrl({
    moduleType: "dischargeSummary",
    assetKey: "logo",
    assetValue: currentSettings?.headerFooter?.header?.logo,
    fileType: "fileLogo",
    settingsPath: ["headerFooter", "header", "logo"],
  });
  const sanitizedSettings = useMemo(() => {
    if (!currentSettings) return currentSettings;
    const next = JSON.parse(JSON.stringify(currentSettings));
    if (!next.headerFooter) next.headerFooter = {};
    if (!next.headerFooter.header) next.headerFooter.header = {};
    if (!next.headerFooter.footer) next.headerFooter.footer = {};

    if (!usesUploadedLetterhead) {
      next.headerFooter.header.headerImg = "";
      next.headerFooter.footer.footerImg = "";
    } else if (resolvedHeaderImg) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.header) next.headerFooter.header = {};
      next.headerFooter.header.headerImg = resolvedHeaderImg;
    }
    if (usesUploadedLetterhead && resolvedFooterImg) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.footer) next.headerFooter.footer = {};
      next.headerFooter.footer.footerImg = resolvedFooterImg;
    }
    if (resolvedLogo) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.header) next.headerFooter.header = {};
      next.headerFooter.header.logo = resolvedLogo;
    }
    return sanitizePrintSettingsForPdf(next);
  }, [
    currentSettings,
    usesUploadedLetterhead,
    resolvedHeaderImg,
    resolvedFooterImg,
    resolvedLogo,
  ]);
  const sanitizedSettingsWithFooterDimensions = useMemo(() => {
    if (!sanitizedSettings) return sanitizedSettings;
    if (!usesUploadedLetterhead) return sanitizedSettings;
    if (!resolvedFooterImg || !footerReady) return sanitizedSettings;

    const headerFooter = sanitizedSettings.headerFooter || {};
    const footer = headerFooter.footer || {};
    if (!footer.footerImg) return sanitizedSettings;

    return {
      ...sanitizedSettings,
      headerFooter: {
        ...headerFooter,
        footer: {
          ...footer,
          renderedFooterImageHeight: footerHeight,
        },
      },
    };
  }, [
    sanitizedSettings,
    usesUploadedLetterhead,
    resolvedFooterImg,
    footerReady,
    footerHeight,
  ]);
  useEffect(() => {
    const header = currentSettings?.headerFooter?.header || {};
    const other = currentSettings?.headerFooter?.otherSettings || {};
    const candidates = [
      { label: "header.logo", url: header.logo },
      { label: "header.headerImg", url: header.headerImg },
      { label: "otherSettings.signatureImg", url: other.signatureImg },
      { label: "otherSettings.watermarkImg", url: other.watermarkImg },
    ];
    const info = candidates
      .map((item) => {
        const result = getSasExpiryInfo(item.url);
        if (!result) return null;
        return {
          label: item.label,
          url: result.url,
          expiry: result.expiry.toISOString(),
          expired: result.expired,
        };
      })
      .filter(Boolean);
    if (info.length) {
      console.log("[DischargeSummary Readonly] SAS image URLs", info);
    }
  }, [currentSettings]);
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const patientData = dischargeSummaryData?.patientInformation || {};
  const resolvedPatientInfo = useResolvedPatientInfo(patientDetails);
  const isLoading = !Object.keys(dischargeSummaryData).length || !pdfUrl;

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (!sanitizedSettingsWithFooterDimensions) return;
    if (!Object.keys(dischargeSummaryData).length) return;
    if (!footerReady) return;
    makePDFUrl();
  }, [
    sanitizedSettingsWithFooterDimensions,
    dischargeSummaryData,
    footerReady,
    resolvedPatientInfo,
  ]);

  const makePDFUrl = async () => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={sanitizedSettingsWithFooterDimensions}
          data={dischargeSummaryData}
          documentType="dischargeSummary"
          patientData={resolvedPatientInfo}
          frequencyList={frequencyList}
          timingList={timingList}
          isIpdDynamicDischargeHeadingEnabled={
            isIpdDynamicDischargeHeadingEnabled
          }
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const handlePrintClick = () => {
    printDischargeSummary(printBlob, patientData.patientId);
  };

  const handleDownloadClick = () => {
    handleDownloadDischargeSummary(pdfUrl, printBlob, patientData);
  };

  useImperativeHandle(ref, () => ({
    handlePrintClick,
    handleDownloadClick,
  }));

  return (
    <div>
      <div className={`${isMobile ? "p-0" : ""}  rounded-4 d-flex`}>
        <DischargeSummaryTracker />
        <div className="discharge-summary-print-preview no-scrollbar">
          <div
            className={`rounded-20px bg-white ${isLoading ? "ds-loading-wrapper" : ""}`}
          >
            {isLoading ? (
              <DischargeSummaryLoading />
            ) : (
              <div ref={divRef} className="printheight">
                <div className="position-relative h-100">
                  <Document
                    loading={
                      <Spin
                        style={{
                          position: "absolute",
                          zIndex: 0,
                          left: "50%",
                          top: "50%",
                        }}
                        tip="Loading PDF..."
                      />
                    }
                    error={
                      <Spin
                        style={{
                          position: "absolute",
                          zIndex: 0,
                          left: "50%",
                          top: "50%",
                        }}
                        tip="Loading PDF..."
                      />
                    }
                    noData={
                      <Spin
                        style={{
                          position: "absolute",
                          zIndex: 0,
                          left: "50%",
                          top: "50%",
                        }}
                        tip="Loading PDF..."
                      />
                    }
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.apply(null, Array(numPages))
                      .map((x, i) => i + 1)
                      .map((page) => {
                        return (
                          <Page
                            key={Math.random()}
                            className={
                              printBlob ? "react-pdf__Page_afterload" : null
                            }
                            loading={null}
                            width={divWidth}
                            pageNumber={page}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        );
                      })}
                  </Document>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default React.memo(DischargeSummaryReadonly);
