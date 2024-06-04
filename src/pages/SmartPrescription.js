import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import imageCompression from 'browser-image-compression';
import { Drawer } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT } from "../utils/constants";

import { getVitals } from "../redux/vitalsSlice";
import { getPatientLastHistory } from "../redux/medicalhistorySlice";
import CashManagerContext from "../context/CashManagerContext";
import HeaderSmartPrescription from "../common/HeaderSmartPrescription";
import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";
import vitals from "../assets/images/Vitals.svg";
import SmartRxFollowUpBox from "../components/SmartRxFollowUpBox";
import RX_image from "../assets/images/RX_image.png";

import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { env } from "../EnvironmentConfig";

const dateFormat = "YYYY-MM-DD";

function SmartPrescription() {
  const {
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
    profile,
  } = useSelector((state) => state.doctors);
  const { selectedVitalsList } = useSelector((state) => state.vitals);
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [vitalsData, setVitalsData] = useState([]);
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const [additionalNote, setAdditionalNote] = useState("");
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [prescription, setPrescription] = useState(false);
  const canvasRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [dataFromServer, setDataFromServer] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalColor, setModalColor] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [blobName, setBlobName] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [smartRxDetails, setSmartRxDetails] = useState(null);
  const socketRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const navigate = useNavigate();

  const contextApi = {
    patient_data,
    tcmId,
    consultationDate,
    symptomsData,
    setSymptomsData,
    examinationData,
    setExaminationData,
    diagnosisData,
    setDiagnosisData,
    adviceData,
    setAdviceData,
    investigationData,
    setInvestigationData,
    medicationData,
    setMedicationData,
    vitalsData,
    setVitalsData,
    medicalHistoryData,
    setMedicalHistoryData,
    followUpDate,
    setFollowUpDate,
    additionalNote,
    setAdditionalNote,
  };

  const [vitalDrawer, setVitalDrawer] = useState(false);

  // useEffect (() => {
  //   const action = dispatch(getSmartRx(smartRxDetails))
  // },[smartRxDetails])

  useEffect(() => {
    if (caseManagerData !== undefined) {
      if (
        caseManagerData.vitals.length > 0 &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 1 && e.tmdpm_status === 0
        ) !== -1
      ) {
        const updatedData = caseManagerData.vitals.map((e, i) => {
          return {
            ...e,
            systolic: e.blood_press ? e.blood_press.split("/")[0] : "",
            diastolic: e.blood_press ? e.blood_press.split("/")[1] : "",
          };
        });
        setVitalsData(updatedData);
      }
      if (
        caseManagerData.medical_history.length > 0 &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 3 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setMedicalHistoryData(
          JSON.parse(JSON.stringify(caseManagerData.medical_history))
        );
      }
      if (
        caseManagerData.symptoms.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 5 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setSymptomsData(caseManagerData.symptoms);
      }
      if (
        caseManagerData.examination.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 10 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setExaminationData(caseManagerData.examination);
      }
      if (
        caseManagerData.diagnosis.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 11 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setDiagnosisData(caseManagerData.diagnosis);
      }
      if (
        caseManagerData.medicine.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 12 && e.tmdpm_status === 0
        ) !== -1
      ) {
        const updatedData = caseManagerData.medicine.map((e) => {
          const unitObj = e?.medicineUnit
            ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit)
            : null;
          const frequencyObj = frequencyList.find(
            (x) => x.tmf_id == e.tmm_freq_type
          );
          const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

          return {
            ...e,
            tmm_unit_name:
              unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
            tmm_freq_type_name:
              e.tmf_block == 0
                ? `${
                    e.tcm_tmm_freq_morning
                      ? e.tcm_tmm_freq_morning + " - "
                      : "0 -"
                  }${
                    e.tcm_tmm_freq_afternoon
                      ? e.tcm_tmm_freq_afternoon + " - "
                      : "0 -"
                  }${
                    e.tcm_tmm_freq_evening
                      ? e.tcm_tmm_freq_evening + " - "
                      : "0 -"
                  }${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
                : frequencyObj !== undefined
                ? frequencyObj.tmf_title
                : "",
            tmf_block_val:
              frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            tmm_dosage_unit_name: `${
              e.tmm_dosage
                ? `${e.tmm_dosage} ${
                    unitObj && unitObj !== undefined ? unitObj.tmu_title : ""
                  }`
                : ""
            }`,
            tmm_days_duration_type: `${
              e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""
            }`,
            unique_id: uuidv4(),
          };
        });
        setMedicationData([...updatedData]);
      }
      if (
        caseManagerData.advice.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 13 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setAdviceData(caseManagerData.advice);
      }
      if (
        caseManagerData.investigation.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 14 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setInvestigationData(caseManagerData.investigation);
      }
      if (
        caseManagerData.follow_up_date &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 15 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setFollowUpDate(caseManagerData.follow_up_date);
      }
      if (
        caseManagerData.visit_advice &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 15 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setAdditionalNote(caseManagerData.visit_advice);
      }
    }
  }, []);

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setVitalDrawer(!vitalDrawer);
  }, [vitalDrawer]);

  //Handle Sider
  const handleCollapsed = useCallback(
    (flag) => {
      if (flag === 1) {
        handleDrawerVital();
      }
    },
    [vitalDrawer]
  );

  useEffect(() => {
    const patientLastHistory = async () => {
      const V_action = await dispatch(
        getVitals({
          patient_unique_id:
            patient_data !== undefined ? patient_data.patient_unique_id : 0,
          pam_id:
            patient_data !== undefined && patient_data.pam_id !== undefined
              ? patient_data.pam_id
              : 0,
          mode: caseManagerData !== undefined ? EDIT : ADD,
        })
      );

      if (caseManagerData === undefined) {
        const MH_action = await dispatch(
          getPatientLastHistory({
            patient_unique_id:
              patient_data !== undefined ? patient_data.patient_unique_id : 0,
          })
        );
        if (MH_action.meta.requestStatus === "fulfilled") {
          setMedicalHistoryData(JSON.parse(JSON.stringify(MH_action.payload)));
        }
      }
    };
    patientLastHistory();
  }, []);

  useEffect(() => {
    if (caseManagerData === undefined) {
      const updatedData = selectedVitalsList.map((e, i) => {
        return {
          ...e,
          systolic: e.blood_press ? e.blood_press.split("/")[0] : "",
          diastolic: e.blood_press ? e.blood_press.split("/")[1] : "",
        };
      });
      setVitalsData(updatedData);
    }
  }, [selectedVitalsList]);

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    setToken(token)
    if (token !== undefined) {
      try {
        var decoded = jwtDecode(token);
        setTokenData(decoded.result)
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    // Remove the previous canvas
    if (prescription) {
      const previousCanvas = canvasRef.current;
      // console.log(previousCanvas,"previous")
      if (previousCanvas) {
        // console.log("canvasRef.previous", canvasRef.current);
        previousCanvas.parentNode.removeChild(previousCanvas);
      }
      // Generate a new canvas with a new UUID and white background
      const newCanvas = document.createElement("canvas");
      const parentElement = document.getElementById("pdf");
      const parentWidth = parentElement.offsetWidth;
      const parentHeight = parentElement.offsetHeight;
      newCanvas.id = uuidv4();
      newCanvas.width = parentWidth * 1;
      newCanvas.height = parentHeight * 1;
      newCanvas.style.backgroundColor = "white";
      newCanvas.style.border = "1px solid lightgrey";
      newCanvas.style.borderRadius = "20px";
      // newCanvas.style.marginTop = "-18px";
      newCanvas.style.color = "black";
      // console.log(document.getElementById("pdf"));
      document.getElementById("pdf").appendChild(newCanvas);
      canvasRef.current = newCanvas;
      // console.log("canvasRef.current", canvasRef.current);
    }
  }, [refresh, prescription]);

  // Handles Websoccket Connection
  const connectWebSocket = () => {
    setLoading(true);

    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(`ws://localhost:5001/iScribeSocket`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      setConnected(true);
      setLoading(false);
      clearTimeout(retryTimeoutRef.current);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setConnected(false);
      setLoading(true);
      // retryConnection();
    };

    socketRef.current.onmessage = (event) => {
      // console.log("event.data",event.data)
      const o = event.data.split("|");
      // if (dataFromServer && dataFromServer.doctor_unique_id === o[4]) {
      draw(o[0], o[1], o[2], o[3], o[4]);
      // }
    };

    socketRef.current.onerror = (error) => {
      console.log("WebSocket error", error);
      setConnected(false);
      setLoading(true); // Show loader when there's an error and attempting to reconnect
      // retryConnection();
    };
  };

  // const retryConnection = () => {
  //   if (!connected) {
  //     retryTimeoutRef.current = setTimeout(() => {
  //       console.log("Retrying WebSocket connection");
  //       connectWebSocket();
  //     }, 5000); // Retry every 5 seconds
  //   }
  // };

  useEffect(() => {
    if (prescription) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearTimeout(retryTimeoutRef.current);
    };
  }, [prescription]);

  function draw(t, n, a, c, e) {
    // const canvas = document.getElementById("myCanvas");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scaleFactor = 1.5;

    ctx.moveTo(t * scaleFactor, n * scaleFactor);
    ctx.lineTo(a * scaleFactor, c * scaleFactor);
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.stroke();
  }

  const convertCanvasToJPEG = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed.'));
        }
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    const imgId = uuidv4();
    const name = `${imgId}.jpeg`;
    setBlobName(name);

    const blob = await convertCanvasToJPEG(canvas);
    const file = new File([blob], name, { type: 'image/jpeg' });

    // Use FormData to handle file upload
    const formData = new FormData();
    formData.append('smart_prescription_filename', name);
    formData.append('smart_prescription_file', file);
    formData.append('doctor_unique_id', tokenData?.doctor_unique_id);
    formData.append('patient_unique_id', patient_data?.patient_unique_id);

    const formattedToken = token.replace(/^"(.*)"$/, '$1');
    const payloadToken = `Bearer ${formattedToken}`
    const respose = await fetch(`${env.casemanager_api_url}/api/v1/casemanager/smart-rx/upload`, {
      method: 'POST',
      headers: {Authorization: payloadToken},
      body: formData,
    })
    const data = respose.json();
    if (data){
      setSmartRxDetails(name);
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleWrite = () => {
    setPrescription(true);
  };

  const openModal = (success, message) => {
    setShowModal(true);
    setUploadSuccess(success);
    setUploadMessage(message);
    console.log(success, "sucess");
    setModalColor(success ? "green" : "red");
    // Start the progress animation
    if (success) {
      animateProgress();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset progress and success state when the modal is closed
    setProgress(0);
    setUploadSuccess(false);
  };

  const animateProgress = () => {
    // Simulate an upload process
    const duration = 2000;
    const interval = 10;
    const steps = duration / interval;

    let step = 0;

    const progressInterval = setInterval(() => {
      step++;
      const currentProgress = (step / steps) * 100;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        // Show success message after reaching 100%
        setUploadSuccess(true);

        // Close the modal after a delay (you can adjust the delay as needed)
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    }, interval);
  };

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderSmartPrescription
          prescription={prescription}
          onClear={handleRefresh}
          onSubmit={handleSubmit}
          smartRxData={smartRxDetails}
        />
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          {/* <img src={hey} alt="vitals" className="me-3 hey" /> */}
          <div className="row">
            <div
              className="col-lg-4 col-md-12 col-12"
              style={{
                marginLeft: "4rem",
                position: "fixed",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <div className="prescription-box-sm p-14">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src={vitals} alt="vitals" className="me-3" />
                    <div className="title-common">
                      Vitals & Body Composition
                    </div>
                  </div>
                  <button
                    className="btn d-flex align-items-center btn-text"
                    onClick={handleDrawerVital}
                  >
                    {" "}
                    <i
                      className={`${
                        vitalsData.length > 0 ? "icon-Edit" : "icon-Add"
                      } me-1 fs-5`}
                    ></i>{" "}
                    <span>{`${vitalsData.length > 0 ? "Edit" : "Add"}`}</span>
                  </button>
                </div>
                {vitalsData.length > 0 && (
                  <VitalsList
                    mode={caseManagerData !== undefined ? EDIT : ADD}
                  />
                )}
              </div>
              <div className="prescription-box-sm p-14">
                {/* <div className="prescription-box-sm"> */}
                <SmartRxFollowUpBox />
                {/* </div> */}
              </div>
            </div>
            <div
              class="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3"
              style={{
                width: "61%",
                height: "100%",
                overflowY: "auto",
                position: "relative",
                left: "39%",
              }}
            >
              {!prescription ? (
                <div
                  className="right-container"
                  style={{
                    border: prescription ? "none" : "1px solid #d9d9d9",
                  }}
                >
                  <div className="rx-image-container" onClick={handleWrite}>
                    <img src={RX_image} alt="prescription-icon" />
                  </div>
                  <div className="smartRx-info-container">
                    <p className="smartPen-intro">
                      Smart pen writings appear here
                    </p>
                    <p className="smartRx-into">
                      Are you having trouble seeing your writing on this page?{" "}
                      <br />
                      If so, don't worry! Click here to learn how to configure
                      your settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="right-container">
                  <div
                    id="pdf"
                    style={{ border: prescription ? "none" : "lightgrey" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerVital}
          open={vitalDrawer}
          className="modalWidth-700"
          width="auto"
        >
          <VitalsBox
            handleDrawerVital={handleDrawerVital}
            handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
      </>
    </CashManagerContext.Provider>
  );
}

export default SmartPrescription;
