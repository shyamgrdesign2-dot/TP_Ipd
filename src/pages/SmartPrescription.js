import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import "../pages/smartSync/smartSync.css";
import { Button, Drawer,message } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT, GB_SMARTSYNC_CVT, SMART_RX_UPLOAD, WEBSOCKET_ERROR_MESSAGE } from "../utils/constants";

import { getVitals } from "../redux/vitalsSlice";
import ReconnectingWebSocket from 'reconnectingwebsocket';
import CashManagerContext from "../context/CashManagerContext";
import HeaderSmartPrescription from "../common/HeaderSmartPrescription";
import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";
import vitals from "../assets/images/Vitals.svg";
import SmartRxFollowUpBox from "../components/SmartRxFollowUpBox";

import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN, WEBSOCKET_ADDRESS } from "../utils/constants";
import api from "../api/services/axiosService";
import { env } from "../EnvironmentConfig";
import { errorMessage } from "../utils/utils";
import { MESSAGE_KEY } from "../utils/constants";
import CommonModal from "../common/CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import textLogo from "../assets/images/text-logo.svg";
import sparkleGif from "../assets/images/aiSparkleLoader.gif";
import FullPageLoader from "./vaccination/components/Loader";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import CvtKnowMore from "./smartSync/components/CvtKnowMore";

function SmartPrescription() {
  const {
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
  } = useSelector((state) => state.doctors);
  const { selectedVitalsList } = useSelector((state) => state.vitals);
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { patient_data, caseManagerData, smartRxFilesData } = state;

  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [surgeriesData, setSurgeriesData] = useState([]);
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
  const [uploadMessage, setUploadMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalColor, setModalColor] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [connected, setConnected] = useState(false);
  const [smartRxDetails, setSmartRxDetails] = useState(null);
  const [hasError, setHasError] = useState(false);
  const socketRef = useRef(null);
  const ctxGlobalRefs = useRef([]);
  const newPageRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const selectedPageRef = useRef(null); // Add a ref for selectedPage
  const canvasRefs = useRef([]);
  const [newPageText, setNewPageText] = useState("");
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupMsg, setDeletePopupMsg] = useState("");
  const [isClearPopup, setIsClearPopup] = useState(false);
  const [updatedIndex, setUpdatedIndex] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [drawFunction, setDrawFunction] = useState(null);
  const [smartRxFiles, setSmartRxFiles] = useState([]);
  const [imageRefs, setImageRefs] = useState({});
  const [loading, setLoading] = useState(false); // State to track loading
  const drawRef = useRef(null);
  const [dataPresentInCanvas, setDataPresentInCanvas] = useState([]);
  const [loader, setLoader] = useState(false);

  const contextApi = {
    patient_data,
    tcmId,
    consultationDate,
    symptomsData,
    setSymptomsData,
    examinationData,
    setExaminationData,
    surgeriesData,
    setSurgeriesData,
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

  const baseUrl = { customBaseUrl: env.casemanager_api_url };

  const isSmartSyncCVTAccessableFromGB = useFeatureIsOn(
    GB_SMARTSYNC_CVT
  );

  const [vitalDrawer, setVitalDrawer] = useState(false);
  const [cvtDrawer, setCvtDrawer] = useState(false);

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
        caseManagerData.surgeries.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 21 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setSurgeriesData(caseManagerData.surgeries);
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

  // Drawer CVT Know more page
  const handleDrawerCvtKnowMore = useCallback(() => {
    setCvtDrawer(!cvtDrawer);
  }, [cvtDrawer]);

  //Handle Sider
  const handleCollapsed = useCallback(
    (flag) => {
      if (flag === 1) {
        handleDrawerVital();
      }
      if(flag === 2) {
        handleDrawerCvtKnowMore();
      }
    },
    [vitalDrawer,cvtDrawer]
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
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (pages.length === 0 || smartRxFilesData?.length === 0 ) {
      handleAddPage();
    }
    if(smartRxFilesData?.length > 0){
      setLoading(true);
      setSmartRxFiles(smartRxFilesData)
    }
  }, []);

  const toggleDeletePopup = () => {
    setShowDeletePopup((prev) => !prev);
  };

  const getCanvas = (id, index) => (
    <canvas
      key={id}
      id={id}
      width="720px"
      height="980px"
      className={`canvas-style ${selectedPage === index ? "canvas-active" : ""}`}
      ref={(el) => {
        if (el && smartRxFiles) {
          canvasRefs.current[id] = el;
          const ctx = el.getContext("2d");
          ctx.fillStyle = "white";
          ctxGlobalRefs.current[id] = ctx;
        }
        else{
          canvasRefs.current[id] = el;
        }
      }}
      onClick={() => handlePageChange(index)}
    />
  );

  useEffect(() => {
    selectedPageRef.current = pages[selectedPage]; // Update the ref when selectedPage changes
  }, [selectedPage, refreshTrigger]);

  const wsError = (error) => {
    message.open({
      key: MESSAGE_KEY,
        type: 'error',
        className: 'error-red',
      content: (
            <div className='d-flex align-items-center'>
          <div>
                    <div className='title-common text-start fontroboto'>{error}</div>
          </div>
        </div>
      ),
      duration: 3,
    });
  }

  useEffect(() => {
    drawRef.current = smartRxFiles?.length >= selectedPage+1 ? editDraw : draw;
  },[selectedPage])

  // Handles Websocket Connection
  const connectWebSocket = () => {
    // WebSocket initialization (reconnectingwebsocket -> this package handles the reconnection)
    try {
      socketRef.current = new ReconnectingWebSocket(WEBSOCKET_ADDRESS, null, {debug: true, reconnectInterval: 3000});

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        setConnected(true);
        setHasError(false); // Clear any previous error messages
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setConnected(false);
      };

      socketRef.current.onmessage = (event) => {
        const o = event.data.split("|");
        drawRef.current(o[0], o[1], o[2], o[3], selectedPageRef.current);
      };

      socketRef.current.onerror = (error) => {
        // Handle WebSocket errors
        if (!hasError) {
          wsError(WEBSOCKET_ERROR_MESSAGE);
          setHasError(true); // Mark that an error has been displayed
        }
        console.log("WebSocket error", error);
      };
    } catch (error) {
      // Handle errors during WebSocket initialization
      console.error("WebSocket connection failed", error);
      wsError(WEBSOCKET_ERROR_MESSAGE);
    }
  };

  const handleAddPage = () => {
    const newPageId = uuidv4();
    setPages([...pages, newPageId]);
    setDataPresentInCanvas([...dataPresentInCanvas, false]);
    if (pages.length === 0) {
      setSelectedPage(0);
    } else {
      setSelectedPage(pages.length);
      setTimeout(() => {
        newPageRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // Adjust timeout as needed
    }
    setNewPageText("");
  };

  const handleDeletePage = (index) => {
    if(smartRxFiles){
      setSmartRxFiles(smartRxFiles.filter((_,fileIndex)=> fileIndex !== index))
    }
    const newPages = pages.filter((_, pageIndex) => pageIndex !== index);
    setDataPresentInCanvas(dataPresentInCanvas.filter((_, pageIndex) => pageIndex !== index));
    setPages(newPages);
    setRefreshTrigger(!refreshTrigger)
    if (selectedPage >= newPages.length) {
      setSelectedPage(newPages.length ? Math.min(selectedPage, newPages.length - 1) : 0);
    }
  };

  const handlePageChange = (index) => {
    setSelectedPage(index);
  };

  const handleRefresh = () => {
    setSelectedPage(updatedIndex);
    setRefreshTrigger(!refreshTrigger)

    if(smartRxFiles?.length >= selectedPage+1){
      setDrawFunction(true)
    }

    const canvas = canvasRefs.current[pages[updatedIndex]];
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctxGlobalRefs.current[pages[updatedIndex]] = ctx;
      canvasRefs.current[pages[updatedIndex]] = ctx
    }
  };

  const handleClearAllPages = () => {
    setPages([pages[0]]);
    setDataPresentInCanvas([false]);
    setSelectedPage(0);
    const canvas = canvasRefs.current[pages[0]];
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
  };

  function draw(t, n, a, c, pageIndex) {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scaleFactor = 1.5;

    // Set consistent styles
    ctx.strokeStyle = '#000'; // Example color for regular drawing

    ctx.moveTo(t * scaleFactor, n * scaleFactor);
    ctx.lineTo(a * scaleFactor, c * scaleFactor);
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.stroke();
    if (!dataPresentInCanvas[selectedPage]) {
      let newDataPresentInCanvas = [...dataPresentInCanvas];
      newDataPresentInCanvas[selectedPage] = true;
      setDataPresentInCanvas(newDataPresentInCanvas);
    }
  }

  function editDraw(t, n, a, c,pageIndex) {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const scaleFactor = 1.5;
    ctxGlobalRefs.current[pageIndex].strokeStyle = '#000';
    ctxGlobalRefs.current[pageIndex].beginPath();
    ctxGlobalRefs.current[pageIndex].moveTo(t * scaleFactor, n * scaleFactor);
    ctxGlobalRefs.current[pageIndex].lineTo(a * scaleFactor, c * scaleFactor);
    ctxGlobalRefs.current[pageIndex].lineJoin = ctxGlobalRefs.current[pageIndex].lineCap = "round";
    ctxGlobalRefs.current[pageIndex].stroke();
    if (!dataPresentInCanvas[selectedPage]) {
      let newDataPresentInCanvas = [...dataPresentInCanvas];
      newDataPresentInCanvas[selectedPage] = true;
      setDataPresentInCanvas(newDataPresentInCanvas);
    }
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

    const canvasArray = Object.values(canvasRefs.current).filter(canvas => canvas !== null);
    let blobs = [];
    let files = [];

    try {
      // Convert all canvases to JPEG blobs and files
      for (let i = 0; i < canvasArray.length; i++) {
        const canvas = canvasArray[i];
        if (!canvas) continue;
        const blob = await convertCanvasToJPEG(canvas);
        const name = smartRxFiles && smartRxFiles[i] ? smartRxFiles[i].smart_prescription_filename : `${uuidv4()}.jpeg`;
        // Create the File object
        const file = new File([blob], name, { type: 'image/jpeg' });

        if (file.size < 5 * 1000 && vitalsData.length === 0 && !followUpDate){
          errorMessage("Please fill your prescription to submit")
        } else if(file.size > 5 * 1000 ) { 
          blobs.push(blob);
          files.push(new File([blob], name, { type: 'image/jpeg' }));
        }
      }
    } catch (error) {
      console.error('Error converting canvas to JPEG:', error);
      errorMessage("Failed to generate image, Please Submit again");
    }
    setLoader(true);
    // FormData to handle file upload
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('smart_prescription_files', file);
      formData.append('smart_prescription_filename[]', file.name);
    });
    formData.append('doctor_unique_id', tokenData?.doctor_unique_id);
    formData.append('patient_unique_id', patient_data?.patient_unique_id);

    try {
      if(files.length > 0){
        const response = await api.post(SMART_RX_UPLOAD, formData, baseUrl);
        const data = response?.message;
      }
      setSmartRxDetails(files || []);

    } catch (error) {
      errorMessage("Error Uploading the prescription, Please try again");
      console.error('Error Submitting the prescription:', error);
    }
    setLoader(false);
  }

  const handleWrite = () => {
    setPrescription(true);
    connectWebSocket();
  };

  useEffect(() => {
    // Set the first page as the default selected page on initial render
    setSelectedPage(0);
    // this is to remove the click from the right container.
    handleWrite();

    if (smartRxFilesData?.length > 0) {
      imageLoad();
    }

    return () => {
      // Cleanup WebSocket connection on component unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const openModal = (success, message) => {
    setShowModal(true);
    setUploadSuccess(success);
    setUploadMessage(message);
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

  // Load images for the edit flow
  const imageLoad = () => {
    const loadedImages = {};
    const totalImages = smartRxFilesData.length;
    let loadedCount = 0;

    const newPageIds = smartRxFilesData.map(() => uuidv4());
    setPages(newPageIds);
    setDataPresentInCanvas(Array(smartRxFilesData.length).fill(true));
    smartRxFilesData.forEach((imageObj, index) => {
      const { smart_prescription_file: imageUrl } = imageObj;
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedImages[newPageIds[index]] = img;
      setImageRefs((prevState) => ({ ...prevState, [newPageIds[index]]: img }));
        setImageLoaded((prevState) => ({
          ...prevState,
          [newPageIds[index]]: true,
        }));
        loadedCount++;

        // Hide loader when all images are loaded
        if (loadedCount === totalImages) {
          setLoading(false);
        }
      };
    });
  };

  useEffect(() => {
    // Draw images on canvases when images are getting loaded
    pages.forEach((pageId) => {
      if (imageLoaded[pageId] && canvasRefs.current[pageId]) {
      const ctx = canvasRefs.current[pageId].getContext('2d');
        ctx.drawImage(imageRefs[pageId], 0, 0);
        ctxGlobalRefs.current[pageId] = ctx;
      }
    });
  }, [imageLoaded]);

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderSmartPrescription
          prescription={prescription}
          onClear={handleClearAllPages}
          onSubmit={handleSubmit}
          smartRxData={smartRxDetails}
          loader={loader}
        />
        {loading && <FullPageLoader />}
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          <div className="row">
            <div
              className="col-lg-4 col-md-12 col-12"
              style={{
                marginLeft: "3rem",
                height: "100vh", /* Full height for independent scrolling */
              }}
            >
              { isSmartSyncCVTAccessableFromGB &&
                <div className="know-more-cvt p-14">
                  <div className="sparkle">
                    <img src={sparkleGif} className="sparkel-loader"/>
                    <img src={textLogo} alt="textLogo" className="text-logo-white" />
                  </div>
                  <div className="title-common">
                    <div>
                      <span className="me-2">
                        AI-Powered Smart Rx Digitisation
                      </span>
                      <span className="new-btn">New</span>
                    </div>
                    <button className="know-more-btn" onClick={handleDrawerCvtKnowMore}>View Tips</button>
                  </div>
                </div>
              }
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
                <SmartRxFollowUpBox />
              </div>
            </div>
            <div
              className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3"
              style={{
                width: "61%",
                height: "100%",
                marginLeft: "10px",
              }}
            >
              <div>
                <div
                  id="pdf"
                  style={{ border: prescription ? "none" : "lightgrey" }}
                >
                  {pages.map((page, index) => (
                    <div
                      key={page}
                      className="canvas-container"
                      ref={index === pages.length - 1 ? newPageRef : null}
                    >
                      <div
                        className={`canvas-header ${
                          selectedPage === index ? "active-page" : ""
                        }`}
                      >
                        <div className="canvas-header-left">
                          <span>Page {index + 1}</span>
                          {selectedPage === index && (
                            <span className="selected-text">Selected</span>
                          )}
                        </div>
                        <div className="d-flex">
                          <button
                            className="btn d-flex align-items-center btn-text"
                            onClick={() => {
                              toggleDeletePopup();
                              setIsClearPopup(true);
                              setDeletePopupMsg(
                                `Are you sure you want to clear page ${
                                  index + 1
                                } data`
                              );
                              setUpdatedIndex(index);
                            }}
                          >
                            <i className="icon-reload me-2 fs-5" />
                          </button>
                          {pages.length > 1 && (
                            <button
                              className="btn d-flex align-items-center btn-text"
                              onClick={() => {
                                toggleDeletePopup();
                                setIsClearPopup(false);
                                setDeletePopupMsg(
                                  `Are you sure you want to delete page ${
                                    index + 1
                                  } data`
                                );
                                setUpdatedIndex(index);
                              }}
                            >
                              <i className="icon-delete me-2 fs-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      {getCanvas(page, index)}
                      <div
                        className={`canvas-footer ${
                          selectedPage === index ? "active-page" : ""
                        }`}
                      >
                        {index === pages.length - 1 && (
                          <button
                            className="btn d-flex align-items-center justify-content-center btn-text new-page-btn"
                            onMouseEnter={() => setNewPageText("New Page")}
                            onMouseLeave={() => setNewPageText("")}
                            onClick={handleAddPage}
                          >
                            <i className="icon-Add fs-5" />
                            {newPageText}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        <Drawer
          closeIcon={false}
          // placement="right"
          onClose={handleDrawerCvtKnowMore}
          open={cvtDrawer}
          className=".modalWidth-800"
          width={800}
        >
          <CvtKnowMore
            handleDrawerCvtKnowMore={handleDrawerCvtKnowMore}
            handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
        <CommonModal
          isModalOpen={shouldShowDeletePopup}
          onCancel={toggleDeletePopup}
          modalWidth={398}
          title={"You may lose your data"}
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>{deletePopupMsg}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex align-items-center mt-2 justify-content-end">
                  <div
                    onClick={() => {
                      if (isClearPopup) {
                        handleRefresh(updatedIndex);
                      } else {
                        handleDeletePage(updatedIndex);
                      }
                      toggleDeletePopup();
                      setUpdatedIndex(null);
                    }}
                    className="me-4 text-decoration-underline btn p-0 text-main"
                  >
                    {isClearPopup ? "Clear" : "Delete"}
                  </div>
                  <Button
                    onClick={toggleDeletePopup}
                    className="lh-lg btn btn-primary3 btn-41 px-4"
                  >
                    <span>No, Stay</span>
                  </Button>
                </div>
              </div>
            </>
          }
        />
      </>
    </CashManagerContext.Provider>
  );
}

export default SmartPrescription;
