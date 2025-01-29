import { Button, Col, Row, Spin, Tabs, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MESSAGE_KEY,
  TAB_HEADER_FOOTER,
  TAB_PAGE_FORMAT,
} from "../../../../utils/constants";
import { isMobile } from "react-device-detect";
import { Container, Navbar } from "react-bootstrap";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import visitEnd from "./../../../../assets/images/end-visit.svg";
import autofill from "./../../../../assets/images/autofill.svg";
import imgCloseVisit from "./../../../../assets/images/close-visit.svg";
import { Document, Page, pdfjs } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import BillPageFormatLayout from "./BillPageFormatLayout";
import BillHeaderFooterLayout from "./BillHeaderFooterLayout";
import ViewBillPdf from "../viewBillPdf/ViewBillPdf";
import { deletePrintSetting, updatePrintSetting } from "../../service";
import { useSelector } from "react-redux";
import { setBillPrintSettings } from "../../../../redux/billingSlice";
import { useDispatch } from "react-redux";
const worker = require("pdfjs-dist/build/pdf.worker.min.js");
pdfjs.GlobalWorkerOptions.workerSrc = worker;

const ConfigureBillSettings = ({
  handleDrawerConfigureSettings,
  patientData,
  billData,
}) => {
  const dispatch = useDispatch();
  const { defaultPrintSettings, profile } = useSelector(
    (state) => state.doctors
  );
  const { billPrintSettings } = useSelector((state) => state.billing);
  const TabsPrintSetting = [
    {
      key: TAB_HEADER_FOOTER,
      label: "Header & Footer",
    },
    {
      key: TAB_PAGE_FORMAT,
      label: "Page Format",
    },
  ];

  const [printSettings, setPrintSettings] = useState({});
  const [selectedTab, setSelectedTab] = useState(TAB_HEADER_FOOTER);
  const [isBackModalOpen, setIsBackModalOpen] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState();
  const [loadSuccess, setLoadSuccesss] = useState(false);
  const [divWidth, setDivWidth] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (billPrintSettings && Object.keys(billPrintSettings)?.length > 0) {
      setPrintSettings(billPrintSettings);
    }
  }, []);

  useEffect(() => {
    if (printSettings && Object.keys(printSettings)?.length > 0) {
      makePDFUrl();
    }
  }, [printSettings]);

  const makePDFUrl = async () => {
    const blob = await pdf(
      <ViewBillPdf
        printSettings={printSettings}
        patientData={patientData}
        profile={profile}
        billData={billData}
      />
    ).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  const onTabChange = useCallback(
    (key) => {
      setSelectedTab(key);
    },
    [selectedTab]
  );

  const showHideBackModal = (type) => {
    setIsBackModalOpen(type);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoadSuccesss(true);
  };

  const handleDefaultSettings = async () => {
    await deletePrintSetting();
    showHideBackModal(null);
  };

  const handleSaveBtn = async () => {
    const formData = new FormData();
    formData.append(
      "headerFooter",
      JSON.stringify(printSettings?.headerFooter)
    );
    formData.append("pageFormat", JSON.stringify(printSettings?.pageFormat));

    formData.append(
      "logoFile",
      printSettings?.headerFooter?.header?.logo?.file
    );
    formData.append("headerFile", printSettings?.headerFooter?.header?.file);
    formData.append("footerFile", printSettings?.headerFooter?.footer?.file);

    formData.append(
      "waterMarkFile",
      printSettings?.headerFooter?.otherSettings?.waterMark?.file
    );
    if (printSettings?.headerFooter?.otherSettings?.signature?.file) {
      formData.append(
        "signatureFile",
        printSettings?.headerFooter?.otherSettings?.signature?.file
      );
    } else {
      formData.append("deleteSignature", true);
    }

    const updatePrintSettingRes = await updatePrintSetting(formData);
    if (updatePrintSettingRes?.status === 200) {
      dispatch(setBillPrintSettings(printSettings));
      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" />
            <div>
              <div className="title-common text-start fontroboto">
                {"Updated Bill Print Settings successfully."}
              </div>
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              onClick={() => message.destroy()}
            />
          </div>
        ),
        duration: 3,
      });
    }
    handleDrawerConfigureSettings();
  };

  const handleAutofillFromRx = () => {
    const {
      page_format,
      header_footer,
      letterhead_format,
      qrcode_enable,
      signature_enable,
      signature_image,
      water_mark_enable,
      water_mark_image,
      logo_enable,
      logo_image,
      header_image,
    } = defaultPrintSettings;
    const {
      custom_margin,
      header,
      footer,
      margin,
      letterhead_margin,
      other_settings,
    } = header_footer || {};
    const { clinic_info, doctor_info } = header || {};
    setPrintSettings((prev) => {
      return {
        ...prev,
        headerFooter: {
          ...prev.headerFooter,
          customLetterHeadMargin: { ...custom_margin },
          footer: { ...footer, fontSize: footer?.font_size },
          header: {
            clinicInfo: {
              enabled: clinic_info.enable === "Y",
              header: clinic_info.header,
              position: clinic_info.place === "R" ? "right" : "left",
              subheader: clinic_info.subheader,
            },
            doctorInfo: {
              enabled: doctor_info.enable === "Y",
              header: doctor_info.header,
              position: doctor_info.place === "R" ? "right" : "left",
              subheader: doctor_info.subheader,
            },

            file: header_image,
            logo: {
              enabled: logo_enable === "Y",
              file: logo_image,
            },
          },
          letterHeadFormat: letterhead_format,
          margin: { ...margin },
          otherSettings: {
            qrCode: {
              enabled: qrcode_enable === "Y",
            },
            signature: {
              enabled: signature_enable === "Y",
              doctorNameEnabled: other_settings?.name_of_doctor_enable === "Y",
              file: signature_image,
              position:
                other_settings?.signature_place === "R" ? "right" : "left",
              qualification: other_settings?.qualification,
              qualificationEnabled:
                other_settings?.qualification_enable === "Y",
              registrationEnabled: other_settings?.registration_no_enable,
            },
            waterMark: {
              enabled: water_mark_enable === "Y",
              file: water_mark_image,
            },
          },
          uploadedLetterHeadMargin: { ...letterhead_margin },
        },
        pageFormat: {
          fontFamily: page_format?.font_family,
          fontSize: page_format?.font_size,
          pageType: prev?.pageFormat?.pageType,
        },
      };
    });
  };

  return (
    <>
      <Navbar className="headerprescription p-0">
        <Container fluid className="h-100 gx-0 w-100">
          <Row className="h-100 align-items-center w-100 justify-content-between">
            <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
                <div className="border-end h-100 text-center">
                  <div
                    onClick={() => showHideBackModal("back")}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right" />
                  </div>
                  {isBackModalOpen && (
                    <CommonModal
                      isModalOpen={isBackModalOpen}
                      onCancel={() => showHideBackModal(null)}
                      modalWidth={500}
                      title={"You may lose your data"}
                      modalBody={
                        <>
                          <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                              <img
                                className="me-3"
                                src={alertIcon}
                                alt="Warning"
                              />
                              <span>
                                Are you sure you want to leave? <br />
                                You will permanently lose your data.
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                              <div
                                onClick={
                                  isBackModalOpen === "default"
                                    ? handleDefaultSettings
                                    : handleDrawerConfigureSettings
                                }
                                className="me-4 text-decoration-underline btn p-0 text-main"
                              >
                                {isBackModalOpen === "default"
                                  ? "Yes"
                                  : "Yes Leave"}
                              </div>
                              <Button
                                onClick={() => showHideBackModal(null)}
                                className="lh-lg btn btn-primary3 btn-41 px-4"
                              >
                                <span>
                                  {isBackModalOpen === "default"
                                    ? "No"
                                    : "No, Stay"}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </>
                      }
                    />
                  )}
                </div>
                <span className="title-digitise-card">
                  Configure Bill Print Setting
                </span>
              </div>
            </Col>
            <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
                <button
                  className="btn btn-text me-14"
                  onClick={() => showHideBackModal("default")}
                >
                  <span>Default Settings</span>
                </button>
                <Button
                  type="button"
                  className="btn-41 btn px-4 btn-primary3 me-4"
                  onClick={handleSaveBtn}
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <div className={"w-100 bg-body wrapper2"}>
        <Row justify="space-between">
          {printSettings && Object.keys(printSettings)?.length > 0 && (
            <Col xl={8} sm={10} className="pe-3">
              <div
                className="bg-white overflow-y-auto"
                style={{ height: "calc(100vh - 60px)" }}
              >
                <Tabs
                  defaultActiveKey="1"
                  items={TabsPrintSetting}
                  onChange={onTabChange}
                  className="print-tabs"
                />
                <Button
                  type="button"
                  className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex m-3"
                  onClick={handleAutofillFromRx}
                  icon={<img src={autofill} alt="autofill" />}
                >
                  Autofill Details from Rx Print Settings
                </Button>
                {selectedTab === TAB_HEADER_FOOTER &&
                printSettings &&
                Object.keys(printSettings).length ? (
                  <BillHeaderFooterLayout
                    headerFooter={printSettings?.headerFooter}
                    setPrintSettings={setPrintSettings}
                  />
                ) : (
                  selectedTab === TAB_PAGE_FORMAT && (
                    <BillPageFormatLayout
                      pageFormat={printSettings?.pageFormat}
                      setPrintSettings={setPrintSettings}
                    />
                  )
                )}
              </div>
            </Col>
          )}
          <Col xl={16} sm={14}>
            <div
              className="mx-auto overflow-y-auto "
              style={{ width: isMobile ? 580 : 900 }}
            >
              <div className="titleprint mt-20">Preview</div>
              <div
                ref={divRef}
                className="rounded-20px bg-white mt-20 overflow-hidden"
              >
                <div className="position-relative printheight">
                  {pdfUrl && (
                    <Document
                      loading={
                        <Spin
                          style={{
                            position: "absolute",
                            zIndex: 0,
                            left: "50%",
                            top: "50%",
                            height: "100%",
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
                                loadSuccess ? "react-pdf__Page_afterload" : null
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
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ConfigureBillSettings;
