import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col, Spin, message } from "antd";
import "./SnapRxPreview.scss";
import {
  isMobile,
  isChrome,
  isSafari,
  osName,
  browserName,
} from "react-device-detect";
import axios from "axios";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";

import { errorMessage, trackEvent } from "../../utils/utils";
import api from "../../api/services/axiosService";

import visitEnd from "../../assets/images/end-visit.svg";
import imgCloseVisit from "../../assets/images/close-visit.svg";
import wtsp from "../../assets/images/wtsp.svg";
import loadingImg from "../../assets/images/loading.png";
import successIcon from "../../assets/images/success-icon.svg";

import HeaderPrescriptionPrint from "../../common/HeaderPrescriptionPrint";

import {
  GB_SNAP_RX_DIGITIZATION,
  MESSAGE_KEY,
  WHATS_APP_API,
  WTSAP_ERR_MESSAGE,
} from "../../utils/constants";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";

import { useSelector, useDispatch } from "react-redux";

import { viewCaseManager } from "../../redux/caseManagerSlice";

import { pdfjs, Document, Page } from "react-pdf";

import { env } from "../../EnvironmentConfig";

import { EVENTS } from "../../utils/events";
import { getDecodedToken } from "../../utils/localStorage";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
const worker = require("pdfjs-dist/build/pdf.worker.min.js");
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function SnapRxPreview() {
  const divRef = useRef(null);
  const printRef = useRef();

  const { loading } = useSelector((state) => state.caseManager);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { state } = useLocation();
  const { patient_data, files } = state || {};

  const [printUrl, setPrintUrl] = useState(
    state !== undefined ? `${state?.print_rx_url || state?.print_url}` : null
  );
  const isSnapRxDigitizationAccessable = useFeatureIsOn(GB_SNAP_RX_DIGITIZATION);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewCaseManagerData, setViewCaseManagerData] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [smartRxFile, setSmartRxFile] = useState(files || []);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send to WhatsApp");

  const { profile } = useSelector((state) => state.doctors);

  const [showProgressbar, setShowProgressbar] = useState(false);
  const [showDigitalRx, setShowDigitalRx] = useState(false);
  const progressRef = useRef(null);

  const baseUrl = { customBaseUrl: env.casemanager_api_url };
  const baseUrlDigitization = env.digitization_api_url;

  const containerStyle = {
    width: "100%",
    height: "25px",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, #DBEFDC 0%, #EDF7ED 50%, #DBEFDC 100%)",
    overflow: "hidden",
  };

  const progressStyle = {
    height: "100%",
    width: "0%",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, #94CF96 0%, #70BF73 50.35%, #94CF96 100%)",
    transition: "width 0.1s ease-in-out",
  };

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    message.open({
      key: MESSAGE_KEY,
      type: "",
      className: "message-appointment",
      content: (
        <div className="d-flex align-items-center">
          <img src={visitEnd} className="me-3" alt="end-visit" />
          <div>
            <div className="title-common-digitised text-start fontroboto">{`${patient_data?.pm_first_name}’s visit ended successfully.`}</div>
            <div className="fontroboto text-start fw-normal mt-1">
              View completed visits in finished tab.
            </div>
          </div>
          <img
            src={imgCloseVisit}
            className="ms-3"
            onClick={() => message.destroy()}
            alt="close-visit"
          />
        </div>
      ),
      duration: 5,
    });
  }, []);

  const getCaseManagerData = async () => {
    try {
      const sendData = {
        patient_unique_id: patient_data?.patient_unique_id || 0,
        tcm_id: state?.tcm_id,
      };
      const action = await dispatch(viewCaseManager(sendData));
      setViewCaseManagerData(action.payload);
      return action.payload; // return the data after it's fetched
    } catch (error) {
      console.error("Error fetching case manager data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (state?.tcm_id && patient_data?.patient_unique_id) {
        const viewCaseManagerData = await getCaseManagerData();
        setShowDigitalRx(
          viewCaseManagerData?.isRxDigitize && state?.page === "digitise"
        );
        setViewCaseManagerData(viewCaseManagerData);
      }
    };
    fetchData();
  }, [state?.tcm_id, patient_data?.patient_unique_id]);

  const fetchRxDigitisedData = async () => {
    try {
      const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
      const cleanedToken = token.replace(/['"]+/g, "");

      // API call for Rx Digitisation
      const response = await axios.get(
        `${baseUrlDigitization}/api/v1/digitization/snap-rx/get-digitization`,
        {
          params: {
            tcm_id: state?.tcm_id,
            patient_unique_id: patient_data?.patient_unique_id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      return response.data; // return the data after it's fetched
    } catch (error) {
      console.error("Error digitizing the prescription:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    if (token) {
      try {
        setToken(token);
        const decoded = jwtDecode(token);
        setTokenData(decoded.result);
        setShowProgressbar(state?.showProgressbar === true ? true : false);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDownload = async () => {
    try {
      if (showDigitalRx) {
        window.Moengage.track_event("TP_Digitised_Prescription_Download", {
          Doctor_Name: profile?.um_name,
          Doctor_Number: profile?.um_contact,
          Doctor_Unique_Id: profile?.doctor_unique_id,
        });
      }
      const response = await axios({
        url: printUrl,
        method: "GET",
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      saveAs(blob, `${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleInAppDownload = async () => {
    if (showDigitalRx) {
      window.Moengage.track_event("TP_Digitised_Prescription_Download", {
        Doctor_Name: profile?.um_name,
        Doctor_Number: profile?.um_contact,
        Doctor_Unique_Id: profile?.doctor_unique_id,
      });
    }
    navigate(`/prescription_print_view/?url=${printUrl}&key=download`, {
      replace: true,
      state: state,
    });
    navigate(0, { replace: true });
  };

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  const handleDigitiseRx = async () => {
    try {
      if (smartRxFile?.length > 0 && token) {
        trackEvent(EVENTS.SNAP_RX.convertButtonClicked, {
          consultation_source: "EMR",
          doctor_id: getDecodedToken()?.user_id,
        });
        navigate("/snap-rx/digitise", {
          state: {
            patient_data: patient_data,
            smartRxFilesData: smartRxFile,
            tcm_id: state?.tcm_id,
            pam_id: state?.pam_id,
            print_url: state.print_rx_url || state.print_url,
            type: "new",
          },
        });
      }
    } catch (error) {
      console.error("Error in handleDigitiseRx:", error);
    }
  };

  const updateRxDigitizeInUrl = (url, showDigitalRx) => {
    const urlObj = new URL(url);

    if (showDigitalRx) {
      urlObj.searchParams.set("rxDigitize", "true");
      setButtonText("Send to WhatsApp");
    } else {
      urlObj.searchParams.delete("rxDigitize");
      setButtonText("Send to WhatsApp");
    }

    return urlObj.toString();
  };

  // Effect to update printUrl when showDigitalRx changes
  useEffect(() => {
    if (printUrl) {
      const updatedUrl = updateRxDigitizeInUrl(printUrl, showDigitalRx);
      setPreviewUrl(updatedUrl);
      setPrintUrl(updatedUrl);
    }
  }, [showDigitalRx]);

  const handleSendToWhatsapp = async () => {
    const body = {
      tcm_id: state?.tcm_id,
      pm_contact_no: state?.patient_data?.pm_contact_no,
      change_mobile_number: false,
      patient_unique_id: state?.patient_data?.patient_unique_id,
      hospital_business_id: tokenData?.hospital_business_id,
      um_id: tokenData?.user_id,
      ...(showDigitalRx && { isRxDigitize: "true" }),
    };

    setIsLoading(true);
    setButtonText("Sending...");
    try {
      const response = await api.post(WHATS_APP_API, body, baseUrl);
      if (response.message) {
        trackEvent(EVENTS.SNAP_RX.digitalRxWhatsappSent, {
          consultation_id: state?.tcm_id || 0,
          phone_number: state?.patient_data?.pm_contact_no,
          status: "success",
        });
        setButtonText("Successfully Sent");

        setTimeout(() => {
          setButtonText("Send to WhatsApp again");
        }, 3000);
      } else {
        trackEvent(EVENTS.SNAP_RX.digitalRxWhatsappSent, {
          consultation_id: state?.tcm_id || 0,
          phone_number: state?.patient_data?.pm_contact_no,
          status: "fail",
        });
        setButtonText("Send to WhatsApp");
      }
    } catch (error) {
      errorMessage(WTSAP_ERR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRxClick = async () => {
    var sendData = {
      patient_unique_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
      tcm_id: state?.tcm_id || 0,
    };
    try {
      const action = await dispatch(viewCaseManager(sendData));

      if (action.meta.requestStatus === "fulfilled") {
        if (showDigitalRx) {
          const response = await fetchRxDigitisedData();
          if (response) {
            navigate("/snap-rx/digitise", {
              state: {
                patient_data: patient_data,
                smartRxFilesData: smartRxFile,
                tcm_id: state?.tcm_id || 0,
                print_url: state?.print_rx_url || state?.print_url,
                digitisedData: response?.digitization,
                pam_id: state?.pam_id,
                type: "edit",
              },
            });
          }
        } else {
          navigate("/snap-rx", {
            state: {
              patient_data,
              caseManagerData: action.payload,
              smartRxFilesData: smartRxFile,
              pam_id: state?.pam_id,
            },
            replace: true,
          });
        }
      } else {
        throw action.error;
      }
    } catch (error) {
      errorMessage(error);
    }
  };

  const printInAppContent = async () => {
    navigate(`/snap-rx/preview/?url=${printUrl}&key=print`, {
      replace: true,
      state: state,
    });
    navigate(0, { replace: true });
  };

  const printContent = async () => {
    if (isMobile || osName == "Linux") {
      try {
        const blobURL = URL.createObjectURL(printBlob);
        const printWindow = window.open(blobURL, "_blank");

        if (!printWindow) {
          console.error("Unable to open new window for printing");
          return;
        }

        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(blobURL);
          }, 1000);
        };
      } catch (error) {
        console.error("Error occurred while printing:", error);
      }
    } else {
      var blobURL = URL.createObjectURL(printBlob);
      document.querySelectorAll("iframe").forEach(function (iframe) {
        iframe.parentNode.removeChild(iframe);
      });
      var iframe = document.createElement("iframe");
      document.body.appendChild(iframe);
      iframe.style.display = "none";
      iframe.src = blobURL;
      iframe.onload = function () {
        setTimeout(function () {
          iframe.focus();
          iframe.contentWindow.print();
          URL.revokeObjectURL(blobURL);
        }, 1);
      };
    }
  };

  const configurePrintUrl = async () => {
    var sendData = {
      patient_unique_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
      tcm_id: state.tcm_id,
      configurePrintSetting: true,
    };
    const action = await dispatch(viewCaseManager(sendData));
    if (action.meta.requestStatus === "fulfilled") {
      navigate("/configure_print_setting", {
        state: { caseManagerData: action.payload, smartRxFile },
      });
    } else {
      errorMessage(action.error);
    }
  };

  return (
    <>
      <HeaderPrescriptionPrint
        patient_data={patient_data}
        tcm_id={state?.tcm_id}
        printUrl={printUrl}
        pam_id={state?.pam_id}
        isSnapRx={true}
      />
      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 prescription-wrapper`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={7} lg={7} xl={7}>
            {!isMobile && showDigitalRx ? (
              <div
                className="d-flex align-items-center justify-content-end h-38"
                onClick={configurePrintUrl}
              >
                <i className="icon-setting me-2"></i>
                <span className="text-decoration-underline fw-medium cursor-pointer">
                  {" "}
                  Configure Print Setting{" "}
                </span>
              </div>
            ) : null}
            <div
              className={`${
                !isMobile
                  ? "rounded-20px mt-20"
                  : "border-top-0 border-start-0 border-bottom-0"
              } border p-20 bg-white d-flex flex-column`}
              style={{
                height: !isMobile
                  ? "calc(100vh - 100px)"
                  : "calc(100vh - 60px)",
              }}
            >
              <div>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                  icon={<i className="icon-Print"></i>}
                  onClick={() => {
                    trackEvent(EVENTS.SNAP_RX.digitalRxPrinted, {
                      consultation_id: state?.tcm_id || 0,
                      doctor_id: getDecodedToken()?.user_id,
                      status: "success",
                    });
                    browserName == "Chrome WebView" || browserName == "WebKit"
                      ? printInAppContent()
                      : printContent();
                  }}
                >
                  <span className="fw-semibold">
                    {showDigitalRx
                      ? "Print Digital Prescription"
                      : "Print Written Prescription"}
                  </span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                  icon={<i className="icon-download"></i>}
                  onClick={() =>
                    !isChrome && !isSafari
                      ? handleInAppDownload()
                      : handleDownload()
                  }
                >
                  <span className="fw-semibold">
                    {showDigitalRx
                      ? "Download Digital Prescription"
                      : "Download Written Prescription"}
                  </span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                {!showDigitalRx ? (
                    <Button
                    type="text"
                    className="btn btn-input btnicon20 align-items-center d-flex mb-3  btn-41 w-100"
                    icon={<i className="icon-Edit"></i>}
                    onClick={handleEditRxClick}
                    loading={loading}
                  >
                    <span className="fw-semibold">
                      Edit Written Prescription
                    </span>
                    <i className="icon-right iconrotate180 ms-auto"></i>
                  </Button>
                ) : null}
              </div>
              {patient_data?.pm_contact_no ? (
                <div className="bg-body p-3 rounded-10px border mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={wtsp}
                      alt="Whatsapp Icon"
                      className="align-self-baseline me-3"
                    />
                    <div className="fontroboto title-common">
                      <div className="fw-normal fontroboto mb-2">
                        {showDigitalRx
                          ? "Send this Digital Rx to"
                          : "Send this Written Rx to "}
                      </div>
                      Patient's WhatsApp +91 {patient_data.pm_contact_no}
                    </div>
                  </div>
                  <button
                    className="btn btn-send-to-wtsap btnicon20 align-items-center d-flex btn-41 w-100"
                    onClick={handleSendToWhatsapp}
                  >
                    {isLoading ? (
                      <img
                        src={loadingImg}
                        alt="Loading..."
                        width="25px"
                        height="25px"
                      />
                    ) : (
                      buttonText
                    )}
                  </button>
                </div>
              ) : null}

              {showProgressbar && (
                <div className="digitise-container d-flex p-3 rounded-10px">
                  <div style={containerStyle}>
                    <div ref={progressRef} style={progressStyle}></div>
                  </div>
                  <p className="digitise-header" style={{ padding: "16px 0" }}>
                    {`${patient_data?.pm_fullname}'s Rx is getting Digitised!`}
                  </p>
                  <p className="digitise-info">
                    Our AI engine is converting handwritten Rx into digital Rx.
                    This may take up to 30 sec
                  </p>
                </div>
              )}
              {!showProgressbar &&
                isSnapRxDigitizationAccessable &&
                smartRxFile?.length > 0 &&
                state?.page !== "digitise" && (
                  <div className="digitise-cta-container">
                    <div className="content-box">
                      <div className="d-flex">
                        <img
                          src={successIcon}
                          alt="success"
                          width="40px"
                          height="40px"
                        />
                        <div className="digitise-right-content">
                          <div className="cta-header">
                            {`${patient_data?.pm_fullname}'s Digital Rx is ready!`}
                          </div>
                          <div className="digitise-info">
                            Digitise Rx to enhance patient care, streamline
                            workflow, and unlock new revenue.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleDigitiseRx}
                        className="digitise-btn fw-semibold"
                      >
                        Digitise Rx Now <span>&#8594;</span>
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </Col>
          <Col md={17} lg={17} xl={12}>
            <div className={isMobile ? "p-20" : ""}>
              <div className="d-flex align-itms-center justify-content-between">
                <div className="titleprint">Preview</div>
                {viewCaseManagerData?.isRxDigitize &&
                  state?.page === "digitise" && (
                    <div>
                      <button
                        className={`digital-btn ${
                          !showDigitalRx
                            ? "digitise-toggle-btn"
                            : "active-digitise-toggle-btn"
                        }`}
                        onClick={() => setShowDigitalRx(true)}
                      >
                        Digital Rx
                      </button>
                      <button
                        className={`written-btn ${
                          showDigitalRx
                            ? "digitise-toggle-btn"
                            : "active-digitise-toggle-btn"
                        }`}
                        onClick={() => setShowDigitalRx(false)}
                      >
                        Written Rx
                      </button>
                    </div>
                  )}
              </div>
              <div className="rounded-20px bg-white mt-20 overflow-hidden">
                <div ref={divRef} className="printheight">
                  <div ref={printRef} className="position-relative h-100">
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
                      file={!showDigitalRx ? printUrl : previewUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {Array.apply(null, Array(numPages))
                        .map((x, i) => i + 1)
                        .map((page) => (
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
                        ))}
                    </Document>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SnapRxPreview;
