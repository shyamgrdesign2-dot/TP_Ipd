import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

import { Container, Navbar } from "react-bootstrap";
import { PDFGenerator } from "../../../components/PDFGenerator";
// import {
//   handleDownloadDischargeSummary,
//   printDischargeSummary,
// } from "./utils/helper";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDischargeSummaryData } from "../../../redux/ipd/dischargeSummarySlice";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper";
import { getPrintSettings } from "../../../redux/ipd/printSettingsSlice";
// import PrintPreviewShimmer from "./components/PrintPreviewShimmer/PrintPreviewShimmer";
import { getAssessmentsData } from "../../../redux/ipd/assessmentsFormSlice";
import {
  handleDownloadDischargeSummary,
  printDischargeSummary,
} from "../dischargeSummary/utils/helper";
import { getPatientInformation } from "../../../utils/utils";
import usePrintPreviewSetup from "../../../hooks/usePrintPreviewSetup";
import useResolvedAssetUrl from "../../../hooks/useResolvedAssetUrl";
import { sanitizePrintSettingsForPdf } from "../../../utils/printSettings";

const PreviewAdmissionAssessment = () => {
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
  const { assessmentsData } = useSelector((state) => state.assessment);
  const { assessments: currentSettings } = printSettings;
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const footerHeight =
    useSelector(
      (state) =>
        state.printSettings.fileStates?.assessments?.fileFooter
          ?.renderedFooterImageHeight
    ) ||
    currentSettings?.headerFooter?.footer?.renderedFooterImageHeight;
  const footerImg = currentSettings?.headerFooter?.footer?.footerImg || null;

  const resolvedHeaderImg = useResolvedAssetUrl({
    moduleType: "assessments",
    assetKey: "headerImg",
    assetValue: currentSettings?.headerFooter?.header?.headerImg,
    fileType: "fileHeader",
    settingsPath: ["headerFooter", "header", "headerImg"],
  });
  const resolvedFooterImg = useResolvedAssetUrl({
    moduleType: "assessments",
    assetKey: "footerImg",
    assetValue: currentSettings?.headerFooter?.footer?.footerImg,
    fileType: "fileFooter",
    settingsPath: ["headerFooter", "footer", "footerImg"],
  });
  const resolvedLogo = useResolvedAssetUrl({
    moduleType: "assessments",
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
        footer: {
          ...footer,
          renderedFooterImageHeight: footerHeight,
        },
      },
    };
  }, [sanitizedSettings, footerHeight]);

  const footerReady = !resolvedFooterImg || footerHeight != null;
  //   const patientData = dischargeSummaryData?.patientInformation || {};

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  usePrintPreviewSetup();

  useEffect(() => {
    if (
      patientDetails?.details?.id &&
      (!assessmentsData ||
        (assessmentsData && !Object.keys(assessmentsData).length))
    )
      dispatch(
        getAssessmentsData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      )
        .then((res) => {
          if (res.payload && !res.error) {
            // addDischargeDataToStore(res.payload, dispatch);
          }
        })
        .catch((error) => {
          console.error("Error fetching discharge summary data:", error);
        });
  }, []);

  useEffect(() => {
    if (
      sanitizedWithFooterDimensions &&
      Object.keys(assessmentsData).length &&
      footerReady
    ) {
      makePDFUrl();
    }
  }, [sanitizedWithFooterDimensions, assessmentsData, footerReady]);

  const makePDFUrl = async () => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={sanitizedWithFooterDimensions}
          data={assessmentsData}
          documentType="assessments"
          patientData={getPatientInformation(patientDetails)}
          frequencyList={frequencyList}
          timingList={timingList}
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDrawerConfigureSettings = () => {
    navigate("/ipd/admission-assessment/configure-print-settings", {
      state: {
        moduleType: "assessments",
        data: assessmentsData,
        printSettings: currentSettings,
        returnPath: "/ipd/admission-assessment/preview",
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
    printDischargeSummary(printBlob, patientDetails?.details?.id);
  };

  const handleDownloadClick = () => {
    handleDownloadDischargeSummary(
      pdfUrl,
      printBlob,
      patientDetails?.details?.id
    );
  };

  const handleBackToSummary = () => {
    navigate(`/ipd/patient-details`, {
      state: { ...state, activeTab: "assessment", isEditable: false, fromTab },
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
                  Print Preview (Admission Assessment)
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 over-flow-y-hidden prescription-wrapper`}
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

export default React.memo(PreviewAdmissionAssessment);
