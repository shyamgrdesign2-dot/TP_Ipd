import { Button, Col, Drawer, Row, Spin } from "antd";
import HeaderPrescriptionPrint from "../../common/HeaderPrescriptionPrint";
import { isMobile } from "react-device-detect";
import React, { useEffect, useRef, useState } from "react";
import ConfigureBillSettings from "./components/configureBillSettings/ConfigureBillSettings";
import { Document, Page } from "react-pdf";
import ViewBillPdf from "./components/viewBillPdf/ViewBillPdf";
import { pdf } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { fetchPrintSetting } from "./service";
import { setBillPrintSettings } from "../../redux/billingSlice";
import { useDispatch } from "react-redux";
import { Container, Navbar } from "react-bootstrap";
import { handleDownload, printContent } from "./utils/helper";
import { setLoadingStatus } from "../../redux/uploadDocSlice";
import { db } from "../../firebase";
import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { deleteDocsUploadedFromAndroid } from "../medicalRecords/service";
import RefundBill from "./components/billingDashboard/RefundBill/RefundBill";

const PreviewBill = ({
  handleCreateBillDrawer,
  isPreviewFromTable,
  isDepositReceipt,
  billData,
  totalAdvanceBalance,
}) => {
  const { patient = {} } = billData;
  const patientData = {
    pm_pid: patient.id,
    pm_fullname: patient.name,
    pm_gender: patient.gender,
    pm_contact_no: patient.phone,
    pam_ref_id: patient.refId,
    ageDays: patient.ageDays,
    ageMonths: patient.ageMonths,
    ageYears: patient.ageYears,
    pm_salutation: patient.salutation,
    address: patient.address,
  };
  const dispatch = useDispatch();
  const deviceUid = localStorage.getItem("app_device_unique_id");
  const { billPrintSettings, advancedSettings } = useSelector(
    (state) => state.billing
  );
  const { profile } = useSelector((state) => state.doctors);
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [showConfigureSettings, setShowConfigureSettings] = useState(false);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [refundBillDrawer, setRefundBillDrawer] = useState(false);

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (billPrintSettings && Object.keys(billPrintSettings).length > 0) {
      makePDFUrl();
    }
  }, [billPrintSettings]);

  useEffect(() => {
    if (billPrintSettings && Object.keys(billPrintSettings).length === 0) {
      getBillPrintSettings();
    }
  }, []);

  const getBillPrintSettings = async () => {
    const printSettingsResponse = await fetchPrintSetting();
    if (printSettingsResponse) {
      dispatch(setBillPrintSettings(printSettingsResponse));
    }
  };

  const makePDFUrl = async () => {
    const blob = await pdf(
      <ViewBillPdf
        printSettings={billPrintSettings}
        isDepositReceipt={isDepositReceipt}
        patientData={patientData}
        profile={profile}
        billData={billData}
        totalAdvanceBalance={totalAdvanceBalance}
        gstIn={advancedSettings?.GSTIN}
      />
    ).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
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

  const setStartLoader = () => {
    dispatch(setLoadingStatus(true));
  };

  useEffect(() => {
    const checkInFireBase = async () => {
      if (deviceUid) {
        const docCapturedImage = doc(db, "billing", deviceUid);
        try {
          const docCapturedImageSnap = await getDoc(docCapturedImage);
          if (docCapturedImageSnap.exists()) {
            onSnapshot(
              doc(db, "billing", deviceUid),
              async (docSnapshotOfCapturedImage) => {
                const res = docSnapshotOfCapturedImage?.data();
                if (res?.clicked === "no") {
                  dispatch(setLoadingStatus(false));
                  deleteDoc(doc(db, "billing", deviceUid));
                  deleteDocsUploadedFromAndroid(patientData?.patient_unique_id);
                }
              }
            );
          }
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.error("Device UID not found");
      }
    };

    return () => checkInFireBase();
  }, [db, deviceUid]);

  const handleRefundBillDrawer = () => {
    setRefundBillDrawer(!refundBillDrawer);
  };

  return (
    <div>
      {isPreviewFromTable ? (
        <Navbar className="headerprescription p-0">
          <Container fluid className="h-100 gx-0 w-100">
            <Row className="h-100 align-items-center w-100 justify-content-between">
              <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
                <div className="align-items-center d-flex h-100 gap-2">
                  <div className="border-end h-100 text-center">
                    <div
                      onClick={handleCreateBillDrawer}
                      className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                    >
                      <i className="icon-right" />
                    </div>
                  </div>
                  <span className="title-digitise-card">View Bill</span>
                </div>
              </Col>
            </Row>
          </Container>
        </Navbar>
      ) : (
        <HeaderPrescriptionPrint
          patient_data={patientData}
          tcm_id={6222}
          handleGoToAppointment={handleCreateBillDrawer}
        />
      )}

      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 prescription-wrapper`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={7} sm={7} xl={isDepositReceipt ? 6 : 5}>
            {isMobile ? (
              ""
            ) : (
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
                {!isMobile ? (
                  ""
                ) : (
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
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                  icon={<i className="icon-Print" />}
                  onClick={() =>
                    printContent(
                      printBlob,
                      patientData?.patient_unique_id,
                      setStartLoader
                    )
                  }
                >
                  <span className="fw-semibold">
                    {isDepositReceipt ? "Print Deposit Receipt" : "Print Bill"}
                  </span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                  icon={<i className="icon-download" />}
                  onClick={() =>
                    handleDownload(
                      pdfUrl,
                      printBlob,
                      patientData?.patient_unique_id,
                      setStartLoader
                    )
                  }
                >
                  <span className="fw-semibold">
                    {isDepositReceipt
                      ? "Download Deposit Receipt"
                      : "Download Bill"}
                  </span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                {!isDepositReceipt && (
                  <Button
                    type="text"
                    className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                    icon={<i className="icon-Edit" />}
                    onClick={() => handleRefundBillDrawer()}
                    disabled={billData?.paymentStatus === "Refunded"}
                  >
                    <span className="fw-semibold">Refund</span>
                    <i className="icon-right iconrotate180 ms-auto"></i>
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col md={17} sm={17} xl={12}>
            <div className={isMobile ? "p-20" : ""}>
              <div className="d-flex align-itms-center justify-content-between">
                <div className="titleprint">
                  {isDepositReceipt ? "Deposit Receipt Preview" : "Preview"}
                </div>
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
                        />
                      }
                      error={
                        <div
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "42%",
                            top: "50%",
                          }}
                        >
                          {"Failed to load PDF file."}
                        </div>
                      }
                      noData={
                        <div
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "50%",
                            top: "50%",
                          }}
                        >
                          {"No PDF file specified."}
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
      {showConfigureSettings && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerConfigureSettings}
          open={showConfigureSettings}
          width="100%"
          push={false}
        >
          <ConfigureBillSettings
            showConfigureSettings={showConfigureSettings}
            handleDrawerConfigureSettings={handleDrawerConfigureSettings}
            patientData={patientData}
            billData={billData}
            isDepositReceipt={isDepositReceipt}
          />
        </Drawer>
      )}

      {refundBillDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleRefundBillDrawer}
          open={refundBillDrawer}
          width="56%"
        >
          <RefundBill
            handleRefundBillDrawer={handleRefundBillDrawer}
            billData={billData}
            // handleMessageForm3c={handleMessageForm3c}
          />
        </Drawer>
      )}
    </div>
  );
};

export default React.memo(PreviewBill);
