import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Spin } from "antd";
import { isMobile } from "react-device-detect";
import { jwtDecode } from "jwt-decode";
// import { errorMessage } from "../utils/utils";
import Card from "react-bootstrap/Card";
import writtenRxIcon from "../../assets/images/written-rx.svg";
import digitiseRxIcon from "../../assets/images/digitise-rx.svg";
import cvtInfoIcon from "../../assets/images/cvt-info.svg";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";
import { useSelector } from "react-redux";
import { env } from "../../EnvironmentConfig";
import HeaderSmartRxDigitise from "../../common/HeaderSmartRxDigitise";
import DigitisedPrescription from "../../components/DigitisedPrescription";
import axios from "axios";
import { trackEvent } from "../../utils/utils";
import { EVENTS } from "../../utils/events";
import { getDecodedToken } from "../../utils/localStorage";

function SnapRxDigitise() {
  const divRef = useRef(null);

  const { loading } = useSelector((state) => state.caseManager);
  const navigate = useNavigate();

  const { state } = useLocation();
  const {
    patient_data,
    smartRxFilesData,
    tcm_id,
    print_url,
    digitisedData,
    pam_id,
    isCustomSSRX
  } = state;

  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [divWidth, setDivWidth] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smartRxFile, setSmartRxFile] = useState(smartRxFilesData);

  const baseUrlRxDigitise = env.digitization_api_url;

  useEffect(() => {
    setDivWidth(divRef.current?.offsetWidth);
  }, [divRef]);

  useEffect(() => {
    if (smartRxFile?.length > 0 && token && state.type === "new") {
      digitizeRx();
    } else if (state.type === "edit" && digitisedData) {
      setData(digitisedData?.editedData);
      setIsLoading(false);
    } else if (state.type === "review" && digitisedData) {
      setData(digitisedData?.refinedData);
      setIsLoading(false);
    }
  }, [token, smartRxFile, digitisedData]);

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    setToken(token);
    if (token) {
      try {
        var decoded = jwtDecode(token);
        setTokenData(decoded.result);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = async () => {
    try {
      const cleanedToken = token.replace(/['"]+/g, "");

      const payload = {
        tcm_id: tcm_id,
        patient_unique_id: patient_data?.patient_unique_id,
        editedData: {...data},
      };

      // API call to save the data
      const response = await axios.post(
        `${baseUrlRxDigitise}/api/v1/digitization/snap-rx/verify-digitized-rx`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      // Handle navigation based on the API response
      if (response.status === 200) {
        state.type === "edit" &&
          trackEvent(EVENTS.SNAP_RX.editedByDoctor, {
            consultation_id: state?.tcm_id,
            doctor_id: getDecodedToken()?.user_id,
          });
        navigate("/snap-rx/preview", {
          replace: true,
          state: {
            patient_data,
            files: smartRxFilesData,
            tcm_id,
            pam_id: pam_id || patient_data?.pam_id,
            print_url,
            showProgressbar: false,
            page: "digitise",
          },
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const digitizeRx = async () => {
    try {
      setIsLoading(true);

      const cleanedToken = token.replace(/['"]+/g, "");
      const response = await axios.post(
        `${baseUrlRxDigitise}/api/v1/digitization/snap-rx/digitize-rx`,
        {
          tcm_id: tcm_id,
          patient_unique_id: patient_data?.patient_unique_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );

      // Update the digitized data
      if (response?.data?.data) {
        setData(response.data.data.refinedData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <>
      <HeaderSmartRxDigitise onSave={handleSave} isDigitiseRxLoading={isLoading} patient_data={patient_data} isSnapRx={true} />
      <div className="cvt-info">
        <img src={cvtInfoIcon} alt="cvt-info-icon" className="me-2" />
        <span className="cvt-info-text">
          <span className="title-common">Disclaimer:</span> Our AI model aims to
          be accurate, but sometimes it might make mistakes. Please double-check
          all details to ensure they are correct and complete.
        </span>
        <i className="icon-Cross ms-1 fs-18" style={{ color: "#FEF4E6" }}></i>
      </div>
      <div
        className={`${
          isMobile ? "p-0" : ""
        } w-100 bg-body prescription-wrapper srx-drx-container`}
      >
        <Row gutter={{ xl: 40, lg: 0 }} justify="center">
          <Col md={17} lg={17} xl={10}>
            <div className="appointment-wrap PatientDetailswrap m-0 drx-written-container">
              <Card className="">
                <>
                  <Card.Header className="bg-white py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="title-digitise-card">
                        <img
                          src={writtenRxIcon}
                          alt="rx-icon1"
                          className="me-2"
                        />
                        {`Written Rx`}
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0 cardbody-data written-rx ">
                    {loading ? (
                      <div className="d-flex flex-column justify-content-center">
                        <div className="align-items-center text-center">
                          <Spin />
                        </div>
                      </div>
                    ) : (
                      smartRxFile?.length > 0 &&
                      smartRxFile?.map(({ fileUrl, smart_prescription_file }) => (
                        <div key={fileUrl || smart_prescription_file} style={{ padding: "5px" }}>
                          {(isCustomSSRX ? smart_prescription_file : fileUrl) && (
                            <img src={isCustomSSRX ? smart_prescription_file : fileUrl} alt="Smart Rx" className="snap-rx-img" width="100%" />
                          )}
                        </div>
                      ))
                    )}
                  </Card.Body>
                </>
              </Card>
            </div>
          </Col>
          <Col md={17} lg={17} xl={10}>
            <div className="appointment-wrap PatientDetailswrap m-0 drx-h-full drx-digitize-container">
              {
                isLoading ? (
                  <DigitisedPrescription
                    data={data}
                    setData={setData}
                    loading={isLoading}
                    showAbsHeaderInsideLoader={true}
                  />
                ) : (
                  <Card className={isLoading ? 'border-none' : null}>
                    <>
                      <Card.Header className={`bg-white py-3 ${isLoading ? 'border-none' : null}`}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="title-digitise-card">
                            <img
                              src={digitiseRxIcon}
                              alt="rx-icon2"
                              className="me-2"
                            />
                            {`Digitised Rx`}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-0 cardbody-data digitize-rx" style={{border: 'none'}}>
                        <div style={!isLoading ? { padding: "5px" } : null}>
                          <DigitisedPrescription
                            data={data}
                            setData={setData}
                            loading={isLoading}
                          />
                        </div>
                      </Card.Body>
                    </>
                  </Card>
                )
              }
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SnapRxDigitise;
