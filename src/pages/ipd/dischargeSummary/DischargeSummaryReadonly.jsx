import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import "./styles.scss";
import { Container, Navbar } from "react-bootstrap";
import { PDFGenerator } from "../../../components/PDFGenerator";
import {
  handleDownloadDischargeSummary,
  printDischargeSummary,
} from "./utils/helper";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDischargeSummaryData } from "../../../redux/ipd/dischargeSummarySlice";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper";
// import DischargeSummaryTracker from "../../../components/CollapsibleSection/DischargeSummaryTracker";
import DischargeSummaryTracker from "./components/CollapsibleSummaryTracker/DischargeSummaryTracker";

const DischargeSummaryReadonly = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const dispatch = useDispatch();
  const { printSettings } = useSelector((state) => state.printSettings);
  const { actualDischargeSummaryData: dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { dischargeSummary: currentSettings } = printSettings;

  const patientData = dischargeSummaryData?.patientInformation || {};

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (patientDetails?.details?.id)
      dispatch(
        getDischargeSummaryData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      )
        .then((res) => {
          if (res.payload && !res.error) {
            addDischargeDataToStore(res.payload, dispatch);
          }
        })
        .catch((error) => {
          console.error("Error fetching discharge summary data:", error);
        });
  }, []);

  useEffect(() => {
    if (currentSettings && dischargeSummaryData) {
      makePDFUrl();
    }
  }, [currentSettings, dischargeSummaryData]);

  const makePDFUrl = async () => {
    try {
      const blob = await pdf(
        <PDFGenerator
          settings={currentSettings}
          data={dischargeSummaryData}
          documentType="dischargeSummary"
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDrawerConfigureSettings = () => {
    // Navigate to IPD Configure Print Settings page
    navigate("/ipd/discharge-summary/configure-print-settings", {
      state: {
        moduleType: "dischargeSummary",
        data: dischargeSummaryData,
        printSettings: currentSettings,
        returnPath: "/ipd/discharge-summary/preview", // Add return path for navigation back
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
    printDischargeSummary(printBlob, patientData.patientId);
  };

  const handleDownloadClick = () => {
    handleDownloadDischargeSummary(pdfUrl, printBlob, patientData);
  };

  const handleBackToSummary = () => {
    navigate("/ipd/patient-details/discharge-summary");
  };

  return (
    <div>
      <div
        className={`${isMobile ? "p-0" : ""}  rounded-4 no-scrollbar d-flex`}
      >
        <DischargeSummaryTracker />
        <div className="discharge-summary-print-preview">
          <div className="rounded-20px bg-white overflow-hidden no-scrollbar">
            <div ref={divRef} className="printheight  no-scrollbar">
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
      </div>
    </div>
  );
};

export default React.memo(DischargeSummaryReadonly);
