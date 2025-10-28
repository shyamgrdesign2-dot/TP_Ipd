import { Button, Col, Drawer, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

import { Container, Navbar } from "react-bootstrap";
import { getSortedSections, PDFGenerator } from "../../../components/PDFGenerator";
import {
  handleDownloadProgressNotes,
  printProgressNotes,
} from "./utils/helper";
import { transformProgressNotesData } from "./utils/dataMapper";

import { useDispatch, useSelector } from "react-redux";
import { updatePrintSettings } from "../../../redux/ipd/printSettingsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getPatientInformation } from "../../../utils/utils";
import { downloadDocument, printDocument } from "../dischargeSummary/utils/helper";

const PreviewProgressNotes = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [showConfigureSettings, setShowConfigureSettings] = useState(false);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const dispatch = useDispatch();
  const { printSettings } = useSelector((state) => state.printSettings);
  const { progressNotes } = useSelector(
    (state) => state.progressNotes
  );
  const { progressNotes: currentSettings } = printSettings;



  // const patientData = progressNotesData?.patientInformation || {};
  const patientInformation = getPatientInformation(patientDetails);

  // const sortedProgressNotes = rawProgressNotesData?.slice()?.sort((a, b) => {
  //   const dateA = new Date(a?.rawProgressNotesData?.date || a?.createdAt || 0);
  //   const dateB = new Date(b?.rawProgressNotesData?.date || b?.createdAt || 0);
  //   return dateB - dateA; // Most recent first
  // });

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (currentSettings && progressNotes.length > 0) {
      makePDFUrl(currentSettings);
    }
  }, [currentSettings, progressNotes]);


  const makePDFUrl = async () => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={currentSettings}
          data={{ patientInformation, progressNotes }}
          documentType="progressNotes"
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDrawerConfigureSettings = () => {
    navigate("/ipd/progress-notes/configure-print-settings", {
      state: {
        moduleType: "progressNotes",
        data: { patientInformation, progressNotes },
        printSettings: currentSettings,
        returnPath: "/ipd/progress-notes/preview",
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
    printDocument(printBlob, patientDetails?.details?.id, "progressNotes");
  };

  const handleDownloadClick = () => {
    downloadDocument(pdfUrl, printBlob, patientDetails, "progressNotes");
  };

  const handleSettingsUpdate = (newSettings) => {
    dispatch(updatePrintSettings(newSettings));
  };

  const handleBackToProgressNotes = () => {
    // navigate(`/ipd/patient-details`, {state: {activeTab: "progress", isEditable: false}, replace: true});
    navigate(-1);
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
                    onClick={handleBackToProgressNotes}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right" />
                  </div>
                </div>
                <span className="title-digitise-card">
                  Print Preview (Progress Notes)
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
                className="d-flex align-items-center justify-content-end h-38"
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
          <Col md={17} sm={17} xl={12}>
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

export default React.memo(PreviewProgressNotes);
