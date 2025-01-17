import { Button, Col, Drawer, Row, Spin } from "antd";
import HeaderPrescriptionPrint from "../../common/HeaderPrescriptionPrint";
import { isMobile } from "react-device-detect";
import { useEffect, useRef, useState } from "react";
import ConfigureBillSettings from "./components/configureBillSettings/ConfigureBillSettings";
import { Document, Page } from "react-pdf";
import ViewBillPdf from "./components/viewBillPdf/ViewBillPdf";
import { pdf } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { fetchPrintSetting } from "./service";
import { setBillPrintSettings } from "../../redux/billingSlice";
import { useDispatch } from "react-redux";

const patient_data = {
  pm_salutation: "Mr",
  pm_fullname: "A A RATHVA",
  pm_first_name: "A A RATHVA",
  pm_contact_no: "7567784027",
  pm_gender: "Male",
  pm_dob: "1982-06-12",
  pm_pincode: "",
  pm_city: "",
  pm_image: "",
  pm_image_path: "",
  pm_state: "",
  pm_address: "",
  pm_reference_id: "10012020049092",
  doctor_unique_id: "2cAKe9FUbvGRJtN",
  mobile_no: "9742639958",
  clinic_id: "368",
  hospital_business_id: "754811713438773",
  user_id: 493,
  patient_unique_id: 833190707254,
  pm_pid: "PAT0450",
  pm_id: 6942,
  ageYears: 42,
  ageMonths: 6,
  ageDays: 27,
};

const PreviewBill = () => {
  const dispatch = useDispatch();
  const { billPrintSettings } = useSelector((state) => state.billing);
  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [showConfigureSettings, setShowConfigureSettings] = useState(false);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

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
      <ViewBillPdf printSettings={billPrintSettings} />
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

  return (
    <div>
      <HeaderPrescriptionPrint patient_data={patient_data} tcm_id={6222} />
      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 prescription-wrapper`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={7} sm={7} xl={5}>
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
                  icon={<i className="icon-Print"></i>}
                >
                  <span className="fw-semibold">Print Bill</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                  icon={<i className="icon-download"></i>}
                >
                  <span className="fw-semibold">Download Bill</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                  icon={<i className="icon-Edit"></i>}
                >
                  <span className="fw-semibold">Refund</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
              </div>
            </div>
          </Col>
          <Col md={17} sm={17} xl={12}>
            <div className={isMobile ? "p-20" : ""}>
              <div className="d-flex align-itms-center justify-content-between">
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
          />
        </Drawer>
      )}
    </div>
  );
};

export default PreviewBill;
