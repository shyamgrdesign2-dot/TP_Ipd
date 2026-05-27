import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

import { Container, Navbar } from "react-bootstrap";
import { PDFGenerator } from "../../../components/PDFGenerator";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOtNotesData } from "../../../redux/ipd/otNotesSlice";
import {
  handleDownloadDischargeSummary,
  printDischargeSummary,
} from "../dischargeSummary/utils/helper";
import usePrintPreviewSetup from "../../../hooks/usePrintPreviewSetup";
import useResolvedAssetUrl from "../../../hooks/useResolvedAssetUrl";
import { useResolvedPatientInfo } from "../../../hooks/useTpmlReferenceId";
import { sanitizePrintSettingsForPdf } from "../../../utils/printSettings";

const PrintPreviewOTNotes = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { state } = useLocation();
  const { patientDetails, fromTab, otNotesData: stateOtNotesData } = state || {};
  const dispatch = useDispatch();
  const resolvedPatientInfo = useResolvedPatientInfo(patientDetails);

  // Use custom hook to handle patient details and print settings
  usePrintPreviewSetup();
  
  const { printSettings } = useSelector((state) => state.printSettings);
  const { otNotesData: storeOtNotesData } = useSelector((state) => state.otNotes);
  const { otNotes: currentSettings } = printSettings;
  const footerHeight =
    useSelector(
      (state) =>
        state.printSettings.fileStates?.otNotes?.fileFooter
          ?.renderedFooterImageHeight
    ) ||
    currentSettings?.headerFooter?.footer?.renderedFooterImageHeight;
  const resolvedHeaderImg = useResolvedAssetUrl({
    moduleType: "otNotes",
    assetKey: "headerImg",
    assetValue: currentSettings?.headerFooter?.header?.headerImg,
    fileType: "fileHeader",
    settingsPath: ["headerFooter", "header", "headerImg"],
  });
  const resolvedFooterImg = useResolvedAssetUrl({
    moduleType: "otNotes",
    assetKey: "footerImg",
    assetValue: currentSettings?.headerFooter?.footer?.footerImg,
    fileType: "fileFooter",
    settingsPath: ["headerFooter", "footer", "footerImg"],
  });
  const resolvedLogo = useResolvedAssetUrl({
    moduleType: "otNotes",
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

  useEffect(() => {
    if (
      patientDetails?.details?.id &&
      (!storeOtNotesData ||
        (storeOtNotesData && !Object.keys(storeOtNotesData).length))
    )
      dispatch(
        getOtNotesData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      )
        .then((res) => {
          // if (res.payload && !res.error) {
          //   addDischargeDataToStore(res.payload, dispatch);
          // }
        })
        .catch((error) => {
          console.error("Error fetching discharge summary data:", error);
        });
  }, []);

  const resolvedOtNotesData = useMemo(() => {
    if (Array.isArray(stateOtNotesData)) {
      return stateOtNotesData;
    }
    return storeOtNotesData;
  }, [stateOtNotesData, storeOtNotesData]);

  useEffect(() => {
    if (
      sanitizedWithFooterDimensions &&
      resolvedOtNotesData &&
      Object.keys(resolvedOtNotesData || {}).length &&
      footerReady
    ) {
      makePDFUrl(sanitizedWithFooterDimensions, resolvedOtNotesData);
    }
  }, [sanitizedWithFooterDimensions, resolvedOtNotesData, footerReady, resolvedPatientInfo]);

  const makePDFUrl = async (settings, data) => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={settings}
          data={data}
          documentType="otNotes"
          patientData={resolvedPatientInfo}
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDrawerConfigureSettings = () => {
    navigate("/ipd/ot-notes/configure-print-settings", {
      state: {
        moduleType: "otNotes",
        data: resolvedOtNotesData,
        printSettings: currentSettings,
        returnPath: "/ipd/ot-notes/preview",
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
    // navigate(-1, {
    //   replace: true
    // });
    navigate(`/ipd/patient-details`, {
      state: { ...state, activeTab: "otNotes", isEditable: false, fromTab },
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
                  Print Preview (OT Notes)
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

export default React.memo(PrintPreviewOTNotes);
