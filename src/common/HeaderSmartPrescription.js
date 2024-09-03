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
import playIcons from '../assets/images/tube-icon.svg';
import api from "../api/services/axiosService";
import devicePad from "../assets/images/device-pad.svg";
import smartSyncConnected from "../assets/images/smart-sync-connected.svg";
import smartSyncDisconnected from "../assets/images/smart-sync-disconnected.svg";

import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import { addCaseManager, editCaseManager } from "../redux/caseManagerSlice";
import VideoModal from './VideoModal';
import { getDecodedToken } from "../utils/localStorage";
import { env } from "../EnvironmentConfig";
import { RX_DIGITIZATION, IS_RX_DIGI_API_CALL, WS_CONTROL_URL } from "../utils/constants";
import ReconnectingWebSocket from "reconnectingwebsocket";

function HeaderPrescription({ prescription, onClear, onSubmit, smartRxData }) {

  const { templates, loading } = useSelector((state) => state.caseManager);
  const { videoList} = useSelector((state) => state.doctors);
  const [videoLink, setVideoLink] = useState(null);
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
  const [isConnected, setIsConnected] = useState(false);
  const [popOverVideo, setPopOverVideo] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [isDisconnect, setIsDisconnect] = useState(null);
  const [status, setStatus] = useState(null);
  const intervalRef = useRef(null);

  const baseUrl = { customBaseUrl: env.rx_digitization };

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
    if(!clicked){
      onSubmit();
    }
  };

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback(() => {
    return (
        <>
            <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
                <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
                    <div className="title-common lh-base">Video Tutorial</div>
                    <Button className="btn btn-videoClose p-0"
                        onClick={showHideVideoListPopover}>
                        <i className="icon-Cross" />
                    </Button>
                </div>
                {videoList?.filter(e => e.category_id === 9)[0]?.video?.map((item1, i1) => {
                    return (
                        <div key={i1} className={`d-flex ${i1 !== videoList?.filter(e => e.category_id === 9)[0]?.video?.length - 1  && 'pb-3 mb-15 border-bottom'}`}>
                            <div className="tutorial-play me-14">
                                <button type="button" onClick={() => setVideoLink(item1)}><img src={playIcons} /></button>
                                <span className='tutorial-thumb'><img src={item1.thumbnail} /></span>
                            </div>
                            <div>
                                <h3 className="title-common text-welcome">{item1?.tmv_title}</h3>
                                <div className="fs-12 fontroboto fw-normal text-main">{item1?.tmv_description}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
  }, [popOverVideo]);

  useEffect(() => {
    const ws = new ReconnectingWebSocket(WS_CONTROL_URL, null, {debug: true, reconnectInterval: 3000});

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setSocket(ws);
      checkDeviceStatus(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };

    ws.onmessage = (event) => {
      handleSocketMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
      // this will be handle once all the user get migrated to new build(with 2 WS connection)
      setError('WebSocket connection error');
    };

    // Check device status every 5 seconds
    const intervalId = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        checkDeviceStatus(ws);
      }
    }, 5000);

  return () => {
    ws.close();
    clearInterval(intervalId); // Clear the interval on cleanup
  };
  }, []);

  const checkDeviceStatus = (ws) => {
    ws.send('DeviceStatus');
  };

  const handleSocketMessage = (message) => {
    if (message.startsWith('DeviceStatus:')) {
      const statusMessage = message.split(':')[1] === 'True';
      setIsConnected(statusMessage);
      setConnectLoading(false);
      if (!statusMessage) setError('Device is not connected. Please click the button to reconnect.');
    } else if (message.startsWith('DeviceConnect:')) {
      const statusMessage = message.split(':')[1] === 'True';
      setIsConnected(statusMessage);
      setConnectLoading(false);
      if (!statusMessage) setError('Failed to connect device. Please try again.');
    } else if (message.startsWith('DeviceDisconnect:')) {
      const statusMessage = message.split(':')[1] === 'True';
      setIsConnected(!statusMessage);
      setConnectLoading(false);
      if (!statusMessage) setError('Failed to disconnect device');
    }
  };

  const handleConnectButtonClick = () => {
    if (!socket) {
      // this will be handle once all the user get migrated to new build(with 2 WS connection)
      setError('WebSocket connection is not established');
      return;
    }

    if (isConnected) {
      setIsDisconnect(true);
      return;
    }

    setConnectLoading(true);
    setError(null);
    const action = 'DeviceConnect';
    socket.send(action);
  };

  const handleDisconnectConfirm = () => {
    if (!socket) {
      setError('WebSocket connection is not established');
      return;
    }

    setConnectLoading(true);
    setError(null);
    const action = 'DeviceDisconnect';
    socket.send(action);
    setIsDisconnect(false);
  };

  const handleDisconnectPopup = () => {
    setIsDisconnect(true)
  }

  const showHideDisconnectModal = () => {
    setIsDisconnect(!isDisconnect);
  };

  // Effect to handle updated data from parent
  useEffect(() => {
    if (smartRxData?.length || vitalsData.length > 0 || followUpDate){
      onEndVisitClick();
      setClicked(true)
    }
  }, [smartRxData]);

  // Handle the data upate and end the visit 
  async function onEndVisitClick() {
    const smartRxFiles  = smartRxData?.map(file => file.name);
    const files = smartRxData?.map(file => file);
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
      smart_prescription_filename: smartRxFiles || [],
    };

    const action =
      tcmId == 0
        ? await dispatch(addCaseManager(sendData))
        : await dispatch(editCaseManager(sendData));

    if (action.meta.requestStatus === "fulfilled") {
      if(IS_RX_DIGI_API_CALL){
        const data = getDecodedToken();
        // FormData for rx_digitizing api
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('doctorId', data.result.user_id);
        formData.append('patientId', action.meta.arg.patient_unique_id);
        formData.append('caseId', action.payload.tcm_id);
        formData.append('ocrModel', 'docx');
        try {
          const response = api.post(RX_DIGITIZATION, formData, baseUrl);
        } catch (error) {
          console.error('Error DIGITIZING the prescription:', error);
        }
      }
      navigate('/print-smart-rx', { replace: true, state: { ...action.payload, patient_data: patient_data, smartRxFile: smartRxFiles } })
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
              {/*Will be utilising this code in future, once the video is available */}
              <Button
                type="button"
                className="btn align-items-center d-flex btn-device-connect rounded-5 pe-3 bg-white shadow2"
                onClick={isConnected ? handleDisconnectPopup : handleConnectButtonClick}
                disabled={connectLoading}
                // style={{backgroundColor: isConnected ?  "rgb(209, 241, 228)" : "rgb(252, 218, 218)"}}
              >
              <span>
                {connectLoading
                  ? "SmartSync Connecting..."
                  : isConnected
                  ? "SmartSync Connected"
                  : "SmartSync Disconnected"}
              </span>

              <div
                style={{
                  width: "48px", // Width of the container
                  height: "26px", // Height of the container
                  borderRadius: "32px", // Rounded edges for the toggle container
                  // backgroundColor: connectLoading
                  // border:isConnected ? "1px solid grey" : "1px solid grey",
                  backgroundColor: isConnected ? "rgb(209, 241, 228)" : "white",
                  boxShadow: "rgba(0, 0, 0, 0.3) 1px 0px 5px inset",
                  // backgroundColor: connectLoading
                  //   ? "#888" // Neutral color during loading
                  //   : isConnected
                  //   ? "rgb(209, 241, 228)" // Green background when connected
                  //   : "rgb(252, 218, 218)", // Red background when disconnected
                  display: "flex",
                  alignItems: "center",
                  padding: "4px", // Inner padding to create space around the sliding div
                  transition: "background-color 0.3s ease", // Smooth transition for background color
                }}
              >
                <div
                  style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    backgroundColor: connectLoading
                      ? "#4B4AD5"
                      : isConnected
                      ? "#fff" 
                      : "#fff",
                    transform: isConnected ? "translateX(21px)" : "translateX(0)", // Fixed slide distance within the container
                    transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for movement and background color
                  }}
                >
                  <img
                    src={
                      connectLoading
                        ? devicePad
                        : isConnected
                        ? smartSyncConnected
                        : smartSyncDisconnected
                    }
                    alt="devicePad"
                    style={{
                      transition: "opacity 0.3s ease", // Optional: add a transition for the image opacity
                      opacity: connectLoading ? 0.5 : 1, // Example of fading effect during loading
                      width: "16px", // Adjust the size of the image to fit within the sliding div
                      height: "16px",
                    }}
                  />
                </div>
              </div>

              </Button>

              <CommonModal
                isModalOpen={isDisconnect}
                onCancel={showHideDisconnectModal}
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
                          onClick={handleDisconnectConfirm}
                          className="me-4 text-decoration-underline btn p-0 text-main"
                        >
                          Disconnect
                        </div>
                        <Button
                          onClick={showHideDisconnectModal}
                          className="lh-lg btn btn-primary3 btn-41 px-4"
                        >
                          <span>No, Stay Connected</span>
                        </Button>
                      </div>
                    </div>
                  </>
                }
              />
              <Popover
                open={popOverVideo}
                onOpenChange={showHideVideoListPopover}
                content={VIDEO_CONTENT}
                trigger="click"
                overlayClassName="pop-430 pp-0 videoTutorial"
                placement="bottom"
              >
                <button className='btn d-flex align-items-center btn-text mx-3 tutorial p-0'>
                  <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
                </button>
              </Popover>
              {videoLink && (
                <VideoModal
                  videoLink={videoLink}
                  onCancel={() => setVideoLink(null)}
                />
              )}
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
                <span>Clear All</span>
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
                          Are you sure you want to clear all the <br />
                          prescription pages data?
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
                disabled={(!prescription && clicked)}
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