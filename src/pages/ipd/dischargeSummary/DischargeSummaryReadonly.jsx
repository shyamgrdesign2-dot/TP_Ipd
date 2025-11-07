import { Button, Col, Row, Spin } from "antd";
import { isMobile } from "react-device-detect";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import "./styles.scss";
import { PDFGenerator } from "../../../components/PDFGenerator";
import {
  handleDownloadDischargeSummary,
  printDischargeSummary,
} from "./utils/helper";

import { useSelector } from "react-redux";
import DischargeSummaryTracker from "./components/CollapsibleSummaryTracker/DischargeSummaryTracker";
import PrintPreviewShimmer from "./components/PrintPreviewShimmer/PrintPreviewShimmer";
import { getPatientInformation } from "../../../utils/utils";
import { useLocation } from "react-router-dom";

const DischargeSummaryReadonly = forwardRef((props, ref) => {
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
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const patientData = dischargeSummaryData?.patientInformation || {};

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (currentSettings && Object.keys(dischargeSummaryData).length) {
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
          <div className="rounded-20px bg-white">
            {(!Object.keys(dischargeSummaryData).length || !pdfUrl) ? (
              <PrintPreviewShimmer />
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
