import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

import { Container, Navbar } from "react-bootstrap";
import { PDFGenerator } from "../../../components/PDFGenerator";
import {
  downloadDocument,
  printDocument,
} from "../dischargeSummary/utils/helper";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getConsultantNotes } from "../../../redux/ipd/consultantNotesSlice";
import { getPrintSettings } from "../../../redux/ipd/printSettingsSlice";
import { getPatientInformation } from "../../../utils/utils";
import usePrintPreviewSetup from "../../../hooks/usePrintPreviewSetup";
import useResolvedAssetUrl from "../../../hooks/useResolvedAssetUrl";
import { sanitizePrintSettingsForPdf } from "../../../utils/printSettings";

const PrintPreview = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { state } = useLocation();
  const { patientDetails, fromTab } = state || {};

  const dispatch = useDispatch();
  const { printSettings } = useSelector((state) => state.printSettings);
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { consultationNotes: currentSettings } = printSettings;
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const footerHeight =
    useSelector(
      (state) =>
        state.printSettings.fileStates?.consultationNotes?.fileFooter
          ?.renderedFooterImageHeight
    ) ||
    currentSettings?.headerFooter?.footer?.renderedFooterImageHeight;
  const resolvedHeaderImg = useResolvedAssetUrl({
    moduleType: "consultationNotes",
    assetKey: "headerImg",
    assetValue: currentSettings?.headerFooter?.header?.headerImg,
    fileType: "fileHeader",
    settingsPath: ["headerFooter", "header", "headerImg"],
  });
  const resolvedFooterImg = useResolvedAssetUrl({
    moduleType: "consultationNotes",
    assetKey: "footerImg",
    assetValue: currentSettings?.headerFooter?.footer?.footerImg,
    fileType: "fileFooter",
    settingsPath: ["headerFooter", "footer", "footerImg"],
  });
  const resolvedLogo = useResolvedAssetUrl({
    moduleType: "consultationNotes",
    assetKey: "logo",
    assetValue: currentSettings?.headerFooter?.header?.logo,
    fileType: "fileLogo",
    settingsPath: ["headerFooter", "header", "logo"],
  });

  const sanitizedSettings = useMemo(() => {
    if (!currentSettings) return currentSettings;
    const next = JSON.parse(JSON.stringify(currentSettings));
    if (resolvedHeaderImg) {
      if (!next.headerFooter) next.headerFooter = {};
      if (!next.headerFooter.header) next.headerFooter.header = {};
      next.headerFooter.header.headerImg = resolvedHeaderImg;
    }
    if (resolvedFooterImg) {
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
  }, [currentSettings, resolvedHeaderImg, resolvedFooterImg, resolvedLogo]);

  const sanitizedWithFooterDimensions = useMemo(() => {
    if (!sanitizedSettings) return sanitizedSettings;
    if (!footerHeight) return sanitizedSettings;
    const headerFooter = sanitizedSettings.headerFooter || {};
    const footer = headerFooter.footer || {};
    if (!footer.footerImg) return sanitizedSettings;
    return {
      ...sanitizedSettings,
      headerFooter: {
        ...headerFooter,
        footer: { ...footer, renderedFooterImageHeight: footerHeight },
      },
    };
  }, [sanitizedSettings, footerHeight]);

  const footerReady = !resolvedFooterImg || footerHeight != null;

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  usePrintPreviewSetup();

  useEffect(() => {
    if (
      patientDetails?.details?.id &&
      (!consultantNotes || (consultantNotes && consultantNotes.length === 0))
    )
      dispatch(
        getConsultantNotes({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      ).catch((error) => {
        console.error("Error fetching consultant notes data:", error);
      });
  }, [
    dispatch,
    consultantNotes,
    patientDetails?.admissionId,
    patientDetails?.details?.id,
  ]);

  const makePDFUrl = useCallback(async () => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={sanitizedWithFooterDimensions}
          data={consultantNotes}
          documentType="consultationNotes"
          patientData={getPatientInformation(patientDetails)}
          frequencyList={frequencyList}
          timingList={timingList}
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, [consultantNotes, sanitizedWithFooterDimensions, frequencyList, timingList, patientDetails]);

  useEffect(() => {
    if (sanitizedWithFooterDimensions && consultantNotes.length > 0 && footerReady) {
      makePDFUrl();
    }
  }, [sanitizedWithFooterDimensions, consultantNotes, makePDFUrl, footerReady]);

  const handleDrawerConfigureSettings = () => {
    navigate("/ipd/consultant-notes/configure-print-settings", {
      state: {
        moduleType: "consultationNotes",
        data: consultantNotes,
        printSettings: currentSettings,
        returnPath: "/ipd/consultant-notes/preview",
        patientDetails,
      },
    });
  };

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const handlePrintClick = () => {
    printDocument(printBlob, patientDetails?.details?.id, "consultantNotes");
  };

  const handleDownloadClick = () => {
    downloadDocument(pdfUrl, printBlob, patientDetails, "consultantNotes");
  };

  const handleBackToSummary = () => {
    // navigate("/ipd/patient-details", {
    //   state: {
    //     patientDetails,
    //     activeTab: "consultantNotes",
    //   },
    //   replace: true
    // });
    navigate(`/ipd/patient-details`, {
      state: { ...state, activeTab: "consultantNotes", isEditable: false, fromTab },
      replace: true,
    });
  };

  return (
    <div>
      <Navbar className="headerprescription p-0">
        <Container fluid className="h-100 gx-0 w-100">
          <Row className="h-100 align-items-center w-100 justify-content-between">
            <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
                <div className="border-end h-100 text-center">
                  <div
                    onClick={handleBackToSummary}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right" />
                  </div>
                </div>
                <span className="title-digitise-card">
                  Print Preview (Consultant Notes)
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 prescription-wrapper`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={7} sm={7} xl={5}>
            {!isMobile && (
              <div
                className="d-flex align-items-center justify-content-center h-38"
                onClick={handleDrawerConfigureSettings}
              >
                <i className="icon-setting me-2"></i>
                <span className="text-decoration-underline fw-medium cursor-pointer">
                  Configure Print Setting
                </span>
              </div>
            )}
            <div
              className={`${
                !isMobile
                  ? "rounded-20px mt-20"
                  : "border-top-0 border-start-0 border-bottom-0"
              } border p-20 bg-white d-flex justify-content-between flex-column`}
              style={{
                height: !isMobile
                  ? "calc(100vh - 160px)"
                  : "calc(100vh - 60px)",
              }}
            >
              <div>
                {isMobile && (
                  <div
                    className="d-flex align-items-center mb-14 h-38"
                    onClick={handleDrawerConfigureSettings}
                  >
                    <i className="icon-setting me-2"></i>
                    <span className="text-decoration-underline fw-medium cursor-pointer">
                      Configure Print Setting
                    </span>
                  </div>
                )}
                <Button
                  type="text"
                  className="btn btnicon20 align-items-center d-flex mb-3 btn-41 w-100 btn-input"
                  icon={<i className="icon-Print" />}
                  onClick={handlePrintClick}
                  disabled={!printBlob}
                >
                  <span className="fw-semibold">Print</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btnicon20 align-items-center d-flex mb-3 btn-41 w-100 btn-input"
                  icon={<i className="icon-download" />}
                  onClick={handleDownloadClick}
                  disabled={!pdfUrl}
                >
                  <span className="fw-semibold">Download</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
              </div>
            </div>
          </Col>
          <Col md={17} sm={17} xl={12} className="overflow-scroll-with-height">
            <div className={isMobile ? "p-20" : ""}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="titleprint">Preview</div>
              </div>
              <div className="rounded-20px bg-white mt-20 overflow-hidden">
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
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default React.memo(PrintPreview);
