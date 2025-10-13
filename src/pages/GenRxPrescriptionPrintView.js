import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Row, Col, Spin } from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import axios from "axios";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";

import {
  errorMessage,
  getClinicName,
  isApollo,
  trackEvent,
} from "../utils/utils";
import api from "../api/services/axiosService";

import wtsp from "../assets/images/wtsp.svg";
import loadingImg from "../assets/images/loading.png";
import HeaderPrescriptionPrint from "../common/HeaderPrescriptionPrint";

import { WHATS_APP_API, WTSAP_ERR_MESSAGE } from "../utils/constants";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";

import { useSelector, useDispatch } from "react-redux";

import { viewCaseManager } from "../redux/caseManagerSlice";

import { pdfjs, Document, Page } from "react-pdf";
import { env } from "../EnvironmentConfig";
const worker = require("pdfjs-dist/build/pdf.worker.min.js");
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function GenRxPrescriptionPrintView() {
  const divRef = useRef(null);
  const printRef = useRef();

  const { loading } = useSelector((state) => state.caseManager);
  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { state } = useLocation();
  const { patient_data, rxId, pam_id } = state;

  const [printUrl, setPrintUrl] = useState(
    state !== undefined ? `${state.print_url}&voiceRxDigitize=true` : null
  );
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [divWidth, setDivWidth] = useState(0);
  const [numPages, setNumPages] = useState();
  const [printBlob, setPrintBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send to WhatsApp");
  const baseUrl = { customBaseUrl: env.casemanager_api_url };

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTokenData(decoded.result);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      const response = await axios({
        url: printUrl,
        method: "GET",
        responseType: "blob", // Important for binary data
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      saveAs(blob, `${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle errors gracefully, e.g., display an error message to the user
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleInAppDownload = async () => {
    navigate(`/gen-rx-print/?url=${printUrl}&key=download`, {
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

  // Effect to update printUrl when showDigitalRx changes
  useEffect(() => {
    if (printUrl) {
      const urlObj = new URL(printUrl);
      urlObj.searchParams.set("voiceRxDigitize", "true");
      const updatedUrl = urlObj.toString();
      setPreviewUrl(updatedUrl);
      setPrintUrl(updatedUrl);
    }
  }, [printUrl]);

  const handleSendToWhatsapp = async () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    trackEvent("TP_VoiceRx_SendtoWhatsapp", {
      patient_contact: patient_data?.pm_contact_no || "",
      patient_id: patient_data?.patient_unique_id || "",
      doctor_speciality: profile?.dp_name,
      doctor_unique_id: profile?.doctor_unique_id,
      clinic_name,
      rx_id: rxId,
    });
    const body = {
      tcm_id: state?.tcm_id,
      pm_contact_no: state?.patient_data?.pm_contact_no,
      change_mobile_number: false,
      patient_unique_id: state?.patient_data?.patient_unique_id,
      hospital_business_id: tokenData?.hospital_business_id,
      um_id: tokenData?.user_id,
      isVoiceRxDigitize: true,
    };

    setIsLoading(true);
    setButtonText("Sending...");
    try {
      const response = await api.post(WHATS_APP_API, body, baseUrl);
      if (response.message) {
        setButtonText("Successfully Sent");

        setTimeout(() => {
          setButtonText("Send to WhatsApp again");
        }, 3000);
      } else {
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
      tcm_id: state.tcm_id,
    };
    try {
      const action = await dispatch(viewCaseManager(sendData));

      if (action.meta.requestStatus === "fulfilled") {
        navigate("/prescription", {
          state: {
            patient_data,
            caseManagerData: action.payload,
          },
        });
      } else {
        throw action.error;
      }
    } catch (error) {
      errorMessage(error);
    }
  };

  const printContent = async () => {
    try {
      if (!printBlob) {
        throw new Error("Print blob is not available");
      }

      const blobURL = URL.createObjectURL(printBlob);

      // Clean up existing iframes
      document.querySelectorAll("iframe").forEach((iframe) => iframe.remove());

      // Create and configure iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobURL;

      iframe.onerror = () => {
        URL.revokeObjectURL(blobURL);
        throw new Error("Failed to load print content");
      };

      iframe.onload = () => {
        try {
          // Small delay to ensure content loads
          requestAnimationFrame(() => {
            iframe.focus();
            iframe.contentWindow.print();
            URL.revokeObjectURL(blobURL);
          });
        } catch (error) {
          console.error("Error during print:", error);
          URL.revokeObjectURL(blobURL);
          errorMessage("Failed to print prescription");
        }
      };

      document.body.appendChild(iframe);
    } catch (error) {
      console.error("Error in printContent:", error);
      errorMessage("Failed to print prescription");
    }
  };

  const printInAppContent = () => {
    navigate(`/gen-rx-print/?url=${printUrl}&key=print`, {
      replace: true,
      state,
    });
    navigate(0, { replace: true });
  };

  return (
    <>
      <HeaderPrescriptionPrint
        patient_data={patient_data}
        tcm_id={state?.tcm_id}
        printUrl={printUrl}
        pam_id={pam_id}
      />
      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body wrapper2 prescription-wrapper`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={7} lg={7} xl={7}>
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
                  onClick={() =>
                    !isChrome && !isSafari
                      ? printInAppContent()
                      : printContent()
                  }
                >
                  <span className="fw-semibold">{"Print Prescription"}</span>
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
                  loading={downloadLoading}
                >
                  <span className="fw-semibold">{"Download Prescription"}</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
                <Button
                  type="text"
                  className="btn btn-input btnicon20 align-items-center d-flex mb-3  btn-41 w-100"
                  icon={<i className="icon-Edit"></i>}
                  onClick={handleEditRxClick}
                  loading={loading}
                >
                  <span className="fw-semibold">{"Edit Prescription"}</span>
                  <i className="icon-right iconrotate180 ms-auto"></i>
                </Button>
              </div>
              {!isApollo() && (
                <>
                  <div className="bg-body d-flex p-3 rounded-10px border">
                    <img
                      src={wtsp}
                      alt="Whatsapp Icon"
                      className="align-self-baseline me-3"
                    />
                    <div className="fontroboto title-common">
                      <div className="fw-normal fontroboto mb-2">
                        {"Send this Rx to Patients"}
                      </div>
                      {patient_data !== undefined
                        ? `WhatsApp +91 ${patient_data.pm_contact_no}`
                        : "-"}
                    </div>
                  </div>
                  <button
                    className="btn btn-send-to-wtsap btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
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
                </>
              )}
            </div>
          </Col>
          <Col md={17} lg={17} xl={12}>
            <div className={isMobile ? "p-20" : ""}>
              <div className="d-flex align-itms-center justify-content-between">
                <div className="titleprint">Preview</div>
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
                      file={previewUrl}
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

export default GenRxPrescriptionPrintView;
