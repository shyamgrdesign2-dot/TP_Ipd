import React, { useEffect, useRef, useState, useMemo } from "react";
import { Drawer, Button, Spin } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import { PDFGenerator } from "../../../../components/PDFGenerator";
import { getPatientInformation, isZydus } from "../../../../utils/utils";
import { printModule, downloadModule } from "../../utils/printDownload";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdmissionDetailsDrawer.scss";
import { isMobile } from "react-device-detect";

// Configure PDF.js worker
const worker = require("pdfjs-dist/build/pdf.worker.min.js");
pdfjs.GlobalWorkerOptions.workerSrc = worker;

const AdmissionDetailsDrawer = ({ open, onClose, patientData }) => {
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [printBlob, setPrintBlob] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [divWidth, setDivWidth] = useState(null);
  const [loading, setLoading] = useState(true);
  const divRef = useRef(null);

  const { printSettings } = useSelector((state) => state.printSettings);
  const { frequencyList, timingList } = useSelector((state) => state.doctors);

  // Build admission details data for PDF
  const admissionDetailsData = useMemo(() => {
    if (!patientData) return null;

    const details = patientData?.details || {};
    const metadata = patientData?.metadata || {};
    const ward = patientData?.ward || {};
    const room = patientData?.room || {};
    const doctor = patientData?.doctor || {};

    return {
      patientInformation: {
        name: details?.name || "",
        age: details?.age || "",
        gender: details?.gender || "",
        contact: details?.contact || "",
        patientId: details?.id || "",
        pmPid: details?.pm_pid || "",
        address: details?.address || "",
        bloodGroup: details?.bloodGroup || "",
        prefix: details?.prefix || "",
        mrno: patientData?.mrno || "",
      },
      admissionDetails: {
        admittingDoctor: doctor?.name || "",
        admissionId: patientData?.admissionId || "",
        admissionNo: patientData?.admissionNo || "",
        referredBy: patientData?.referredBy || "",
        referralNotes: patientData?.referralNotes || "",
        admissionDate: patientData?.admittedOn || "",
        department: doctor?.speciality || "",
        wardBed: `${ward?.title || ""} / ${room?.title || ""}`,
        patientCategory: metadata?.category || "",
        mlcNumber: metadata?.mlcno === "0" ? "" : metadata?.mlcno || "",

       // Conditional logic
        ...(isZydus()
          ? {
              // For Zydus show both AdmissionNo & MRNO
              admissionNo: patientData?.admissionNo || "",
              mrno: patientData?.mrno || "",
            }
          : {
              // For Non-Zydus show only AdmissionId
              admissionId: patientData?.admissionId || "",
            }),
      },
      careTakerDetails: {
        mobileNumber: metadata?.contactno || "",
        name: metadata?.caretaker || "",
        relation: metadata?.relationship || "",
      },
      insuranceDetails: {
        insuranceNumber: metadata?.insuranceno || "",
        policyNumber: metadata?.policyno || "",
        tpaNumber: metadata?.tpano || "",
        preApprovalId: metadata?.preApprovalId || "",
      },
    };
  }, [patientData]);

  useEffect(() => {
    if (divRef.current) {
      setDivWidth(divRef.current?.offsetWidth);
    }
  }, [open]);

  // Get default print settings if not available
  const getPrintSettings = () => {
    if (printSettings?.admissionDetails) {
      return printSettings.admissionDetails;
    }
    // Return default settings if not configured
    return {
      pageFormat: {
        pageSize: "A4",
        fontSize: 10,
        patientInfoFontSize: 10,
        pagination: false,
      },
      headerFooter: {
        header: {
          title: "Patient Admission Details",
          informationVisible: true,
          showLogo: false, // No logo for admission details
          fontSize: 26,
          lineHeight: 45,
        },
        footer: {},
        displayPatientInfo: {
          // Hide patient info section as it's included in the content
          visible: false,
        },
        letterHeadFormat: 0,
        margins: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
        },
      },
      formatStyle: [],
    };
  };

  useEffect(() => {
    if (open && admissionDetailsData) {
      makePDFUrl();
    }
  }, [open, admissionDetailsData]);

  const makePDFUrl = async () => {
    try {
      setLoading(true);
      const settings = getPrintSettings();

      const patientInfo = getPatientInformation(patientData);
      const blob = await pdf(
        <PDFGenerator
          settings={settings}
          data={admissionDetailsData}
          documentType="admissionDetails"
          patientData={patientInfo}
          frequencyList={frequencyList}
          timingList={timingList}
        />
      ).toBlob();
      
      setPdfUrl(URL.createObjectURL(blob));
      setLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false);
    }
  };

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const handlePrintClick = async () => {
    const settings = getPrintSettings();
    await printModule(
      "admissionDetails",
      { admissionDetails: settings },
      patientData,
      admissionDetailsData,
      frequencyList,
      timingList
    );
  };

  const handleDownloadClick = async () => {
    const settings = getPrintSettings();
    await downloadModule(
      "admissionDetails",
      { admissionDetails: settings },
      patientData,
      admissionDetailsData,
      frequencyList,
      timingList
    );
  };

  const handleEditClick = () => {
    if (!patientData) return;
    
    // Navigate to create admission page with edit mode data
    navigate("/ipd/create-admission", {
      state: {
        isEditMode: true,
        admissionData: patientData,
      },
    });
    onClose(); // Close the drawer
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      width= {isMobile ? "100%" : "55%"}
      className="admission-details-drawer"
      closeIcon={false}
    >
      <div className="admission-details-drawer-container">
        {/* Header */}
        <div className="admission-details-header">
          <div className="header-left">
            <div className="back-button" onClick={onClose}>
              <i className="icon-right"></i>
            </div>
            <div className="header-title">Admission Details</div>
          </div>
          <div className="header-actions">
            {!isZydus() && (
              <Button
                type="text"
                icon={
                  <i className="icon-Edit ms-2" style={{ color: "#4b4ad5" }} />
                }
                onClick={handleEditClick}
                className="header-action-btn"
              />
            )}
            <Button
              type="text"
              icon={
                <i className="icon-Print ms-2" style={{ color: "#4b4ad5" }} />
              }
              onClick={handlePrintClick}
              disabled={!printBlob && !pdfUrl}
              className="header-action-btn"
            />
            <Button
              type="text"
              icon={
                <i
                  className="icon-download ms-2"
                  style={{ color: "#4b4ad5" }}
                />
              }
              onClick={handleDownloadClick}
              disabled={!pdfUrl}
              className="header-action-btn"
            />
          </div>
        </div>

        {/* PDF Preview */}
        <div className="admission-details-content">
          {loading ? (
            <div className="loading-container">
              <Spin tip="Loading PDF..." size="large" />
            </div>
          ) : pdfUrl ? (
            <div ref={divRef} className="pdf-preview-container">
              <Document
                loading={
                  <div className="loading-container">
                    <Spin tip="Loading PDF..." size="large" />
                  </div>
                }
                error={
                  <div className="error-container">
                    <p>Error loading PDF</p>
                  </div>
                }
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.apply(null, Array(numPages))
                  .map((x, i) => i + 1)
                  .map((page) => {
                    return (
                      <Page
                        key={page}
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
          ) : (
            <div className="error-container">
              <p>No PDF available</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AdmissionDetailsDrawer;

