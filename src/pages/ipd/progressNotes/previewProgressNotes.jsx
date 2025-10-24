import { Button, Col, Drawer, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";

import { Container, Navbar } from "react-bootstrap";
import { PDFGenerator } from "../../../components/PDFGenerator";
import {
  handleDownloadProgressNotes,
  printProgressNotes,
} from "./utils/helper";
import { transformProgressNotesData } from "./utils/dataMapper";

import { useDispatch, useSelector } from "react-redux";
import { updatePrintSettings } from "../../../redux/ipd/printSettingsSlice";
import { useNavigate } from "react-router-dom";

const PreviewProgressNotes = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [showConfigureSettings, setShowConfigureSettings] = useState(false);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const dispatch = useDispatch();
  const { printSettings } = useSelector((state) => state.printSettings);
  const { progressNotes: rawProgressNotesData } = useSelector(
    (state) => state.progressNotes
  );
  const { progressNotes: currentSettings } = printSettings;

  // Memoize the data transformation to prevent infinite loops
  const progressNotesData = useMemo(() => {
    console.log("Transforming progress notes data:", rawProgressNotesData);
    
    const transformed = transformProgressNotesData(rawProgressNotesData);
    
    if (transformed) {
      console.log("Transformation successful:", transformed);
      return transformed;
    }
    
    // Fallback data structure
    console.log("Using fallback data structure");
    return {
      patientInformation: {
        name: "Unknown Patient",
        patientId: "N/A",
        age: "N/A",
        gender: "N/A",
        admissionDate: "N/A",
        roomBed: "N/A",
        ward: "N/A",
        admissionDiagnosis: "N/A"
      },
      attendingPhysician: {
        name: "Unknown Doctor",
        specialty: "General Medicine",
        department: "General",
        contact: "N/A",
        email: "N/A",
        licenseNumber: "N/A"
      },
      progressNotesSummary: {
        summary: "No progress notes data available.",
        keyFindings: "No findings recorded.",
        recommendations: "No recommendations available."
      },
      progressNotes: []
    };
  }, [rawProgressNotesData]);

  const patientData = progressNotesData?.patientInformation || {};

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    // Create fallback settings if currentSettings is not available
    const settings = currentSettings || {
      formatStyle: {
        patientInfo: { visible: true, order: 1 },
        attendingPhysician: { visible: true, order: 2 },
        progressNotesSummary: { visible: true, order: 3 },
        progressNotesByDate: { visible: true, order: 4 }
      },
      pageFormat: {
        fontFamily: "Arial",
        fontSize: 10,
        // margin: {
        //   top: 20,
        //   bottom: 20,
        //   left: 20,
        //   right: 20
        // }
      }
    };

    if (settings && progressNotesData) {
      makePDFUrl(settings);
    }
  }, [currentSettings, progressNotesData]);


  const makePDFUrl = async (settings = currentSettings) => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={settings}
          data={progressNotesData}
          documentType="progressNotes"
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDrawerConfigureSettings = () => {
    setShowConfigureSettings(!showConfigureSettings);
  };

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const handlePrintClick = () => {
    printProgressNotes(printBlob, patientData.patientId);
  };

  const handleDownloadClick = () => {
    handleDownloadProgressNotes(pdfUrl, printBlob, patientData);
  };

  const handleSettingsUpdate = (newSettings) => {
    dispatch(updatePrintSettings(newSettings));
  };

  const handleBackToProgressNotes = () => {
    // navigate(`/ipd/patient-details`, {state: {activeTab: "progress", isEditable: false}, replace: true});
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
