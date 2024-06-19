import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef
} from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  Button,
  Dropdown,
  Tooltip,
  Popover,
  Input,
  Spin,
  Tabs,
  Select,
  Drawer,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from "./ProfilePopover";
import CommonModal from "./CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import reload from "../assets/images/ic_Reload.svg";
import tutorial from "../assets/images/tutorial.svg";
import devicePad from "../assets/images/device-pad.svg";

import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import { addCaseManager, editCaseManager } from "../redux/caseManagerSlice";

function HeaderPrescription({ prescription, onClear, onSubmit, smartRxData }) {

  const { templates, loading } = useSelector((state) => state.caseManager);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    patient_data,
    tcmId,
    consultationDate,
    symptomsData,
    examinationData,
    diagnosisData,
    adviceData,
    investigationData,
    medicationData,
    vitalsData,
    setVitalsData,
    medicalHistoryData,
    followUpDate,
    setFollowUpDate,
    additionalNote,
  } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  // const [connectLoading, setConnectLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [status, setStatus] = useState(null);
  // const intervalRef = useRef(null);

  const items = [
      {
          label: <div onClick={onResetClick}>Clear</div>,
          key: 'clear',
      },
  ];

  async function onResetClick() {
      setVitalsData([])
      setFollowUpDate(null)
  }

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const showHideClearModal = useCallback(() => {
    setIsClearModalOpen(!isClearModalOpen);
  }, [isClearModalOpen]);

  const checkDataFillOrNot = () => {
    if (
      symptomsData.length > 0 ||
      examinationData.length > 0 ||
      diagnosisData.length > 0 ||
      medicationData.length > 0 ||
      adviceData.length > 0 ||
      investigationData.length > 0 ||
      vitalsData.length > 0 ||
      medicalHistoryData.length > 0
    ) {
      showHideBackModal();
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleClearClick = () => {
    setIsClearModalOpen(!isClearModalOpen);
    onClear(); // Call the parent's clear handler
  };

  const handleSubmitClick = async () => {
    onSubmit();
  };

// COMMECTING THIS CODE PLANNED TO GO WITHOUT THIS FUNCTIONALITY WITH WHICH WE HAVE DEPEDENCY ON ITELTRONICS TEAM
  // const WEBSERVICE_URL = 'http://localhost:80/Temporary_Listen_Addresses/iScribe';
  // const CONNECT_ACTION = 'http://tempuri.org/IOptimaService/ConnectDevice';
  // const DISCONNECT_ACTION = 'http://tempuri.org/IOptimaService/DisconnectDevice';

  // const parseXMLResponse = (responseXML, action) => {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(responseXML, 'text/xml');
  //   const resultNode = xmlDoc.getElementsByTagName(`${action}Result`)[0];
  //   return resultNode && resultNode.textContent === 'true';
  // };

  // const handleSmartSyncConnectApi = async (action) => {
  //   const xmlData = `
  //     <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"">
  //       <s:Body>
  //         <${action} xmlns="http://tempuri.org/" />
  //       </s:Body>
  //     </s:Envelope>
  //   `;
  //   const soapAction = action === 'ConnectDevice' ? CONNECT_ACTION : DISCONNECT_ACTION;

  //   try {
  //     const response = await axios.post(WEBSERVICE_URL, xmlData, {
  //       headers: {
  //         'Content-Type': 'text/xml',
  //         'SOAPAction': soapAction,
  //         'Access-Control-Allow-Origin':'*',
  //       },
  //     });

  //     const success = parseXMLResponse(response.data, action);
  //     return success;
  //   } catch (error) {
  //     console.error(`Error calling API for ${action}:`, error);
  //     setError(`Error calling API for ${action}`);
  //     return false;
  //   }
  // };

  // const handleConnectButtonClick = async () => {
  //   setConnectLoading(true);
  //   setError(null);

  //   const action = isConnected ? 'DisconnectDevice' : 'ConnectDevice';
  //   const success = await handleSmartSyncConnectApi(action);

  //   if (success) {
  //     setIsConnected(!isConnected);
  //   } else {
  //     setError(`Failed to ${action.toLowerCase()}`);
  //   }

  //   setConnectLoading(false);
  // };

  // const checkStatus = async () => {
  //   const soapEnvelope = `
  //     <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  //       <s:Body>
  //         <GetDeviceConnectionStatus xmlns="http://temp.org/" />
  //       </s:Body>
  //     </s:Envelope>
  //   `;

  //   try {
  //     const response = await axios.post('http://localhost:90/Temporaesses/ice/', soapEnvelope, {
  //       headers: {
  //         'Content-Type': 'text/xml',
  //         'SOAPAction': 'http://temp.org/IOptimaService/GetDeviceConnectionStatus'
  //       }
  //     });

  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(response.data, "text/xml");
  //     const connectionStatus = xmlDoc.getElementsByTagName("GetDeviceConnectionStatusResult")[0].textContent;

  //     setStatus(connectionStatus === 'true');
  //   } catch (error) {
  //     console.error("Error calling API for GetDeviceConnectionStatus:", error);
  //   }
  // };

  // useEffect(() => {
  //   intervalRef.current = setInterval(checkStatus, 5000);

  //   return () => {
  //     clearInterval(intervalRef.current);
  //   };
  // }, []);
  
  // Effect to handle updated data from parent
  useEffect(() => {
    if (smartRxData) {
      onEndVisitClick();
    }
  }, [smartRxData]);

  // Handle the data upate and end the visit 
  async function onEndVisitClick() {
      const sendData = {
        action: tcmId == 0 ? "add" : "edit",
        tcm_id: tcmId,
        patient_unique_id:
          patient_data !== undefined ? patient_data.patient_unique_id : 0,
        pam_id:
          patient_data !== undefined
            ? patient_data.hasOwnProperty("pam_id")
              ? patient_data.pam_id
              : 0
            : 0,
        consultation_date: consultationDate,
        symptoms: symptomsData,
        examination: examinationData,
        diagnosis: diagnosisData,
        medicine: medicationData.map(({ medicineUnit, ...rest }) => rest),
        advice: adviceData,
        investigation: investigationData,
        vitals: vitalsData,
        follow_up_date: followUpDate,
        visit_advice: additionalNote,
        medical_history: medicalHistoryData,
        smart_prescription_filename:smartRxData,
      };

      const action =
        tcmId == 0
          ? await dispatch(addCaseManager(sendData))
          : await dispatch(editCaseManager(sendData));

      if (action.meta.requestStatus === "fulfilled") {
        navigate('/print-smart-rx', { replace: true, state: { ...action.payload, patient_data: patient_data } })
      } else {
        errorMessage(action.error);
      }
  }


  return (
    <Navbar className="justify-content-between headerprescription p-0">
      <Container fluid className="h-100 gx-0 w-100">
        <Row className="h-100 align-items-center w-100 justify-content-between">
          <Col lg="auto" className="h-100">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center">
                <div
                  onClick={checkDataFillOrNot}
                  className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                >
                  <i className="icon-right"></i>
                </div>
                <CommonModal
                  isModalOpen={isBackModalOpen}
                  onCancel={showHideBackModal}
                  modalWidth={500}
                  title={"You may lose your data"}
                  modalBody={
                    <>
                      <div className="alert-warning rounded-10px p-2 patient-details">
                        <div className="d-flex align-items-center">
                          <img className="me-3" src={alertIcon} alt="Warning" />
                          <span>
                            Are you sure you want to leave? <br />
                            You will permanently lose your data.
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="d-flex align-items-center mt-2 justify-content-end">
                          <div
                            onClick={() => navigate("/", { replace: true })}
                            className="me-4 text-decoration-underline btn p-0 text-main"
                          >
                            Yes Leave
                          </div>
                          <Button
                            onClick={showHideBackModal}
                            className="lh-lg btn btn-primary3 btn-41 px-4"
                          >
                            <span>No, Stay</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
              <div className="p-4">Write Smart Prescription</div>
            </div>
          </Col>
          <Col lg="auto">
            <div className="align-items-center d-flex h-100">
              {/* <Button
                type="button"
                className="btn align-items-center d-flex btn-device-connect me-20"
                onClick={handleConnectButtonClick}
                disabled={connectLoading}
              >
                <img src={devicePad} alt="devicePad" className="align-items-center d-flex"  style={{backgroundColor: isConnected ? "#4B4AD5" : "#bdbdbd"}}/>
                <span>{connectLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}</span>
              </Button> */}

              {/* <CommonModal
                  isModalOpen={isDisconnect}
                  onCancel={showHideBackModal}
                  modalWidth={500}
                  title={"Disconnect Device"}
                  modalBody={
                    <>
                      <div className="alert-warning rounded-10px p-2 patient-details">
                        <div className="d-flex align-items-center">
                          <img className="me-3" src={alertIcon} alt="Warning" />
                          <span>
                            Are you sure you want to Disconnect <br />
                            SmartSync device.
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="d-flex align-items-center mt-2 justify-content-end">
                          <div
                            onClick={() => navigate("/", { replace: true })}
                            className="me-4 text-decoration-underline btn p-0 text-main"
                          >
                            Yes Leave
                          </div>
                          <Button
                            onClick={showHideBackModal}
                            className="lh-lg btn btn-primary3 btn-41 px-4"
                          >
                            <span>No, Stay</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  }
              /> */}
              {/* <div className="d-flex align-items-center">
                <button
                  className="btn d-flex align-items-center btn-play"
                  onClick={() => {}}
                >
                  <img
                    className="align-items-center d-flex"
                    src={tutorial}
                    alt="Warning"
                  />
                  <span>Tutorial</span>
                </button>
              </div> */}
              <Button
                type="button"
                className="btn align-items-center d-flex btn-41 btn-clear me-20"
                onClick={() => setIsClearModalOpen(!isClearModalOpen)}
                loading={loading}
                disabled={!prescription}
              >
                <img
                  className="align-items-center d-flex"
                  src={reload}
                  alt="clear"
                />
                <span>Clear</span>
              </Button>

              <CommonModal
                isModalOpen={isClearModalOpen}
                onCancel={showHideClearModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                  <>
                    <div className="alert-warning rounded-10px p-2 patient-details">
                      <div className="d-flex align-items-center">
                        <img className="me-3" src={alertIcon} alt="Warning" />
                        <span>
                          Are you sure you want to clear this <br />
                          page data?
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="d-flex align-items-center mt-2 justify-content-end">
                        <div
                          onClick={() => handleClearClick()}
                          className="me-4 text-decoration-underline btn p-0 text-main"
                        >
                          Clear
                        </div>
                        <Button
                          onClick={showHideClearModal}
                          className="lh-lg btn btn-primary3 btn-41 px-4"
                        >
                          <span>No</span>
                        </Button>
                      </div>
                    </div>
                  </>
                }
              />
              <Button
                type="button"
                className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
                onClick={handleSubmitClick}
                loading={loading}
                disabled={!prescription}
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default React.memo(HeaderPrescription);
