import React, { useState, useRef, useEffect } from "react";
import { Card, Typography, Switch, Carousel, Button } from "antd";
import "./styles.scss";
import websiteLogo from "../../assets/images/website-images/logo.png";
import ScanAnimationWrapper from "../../components/scanAnimationWrapper/ScanAnimationWrapper";
import aiAgent from "../../assets/images/ai-agent.png";
import scanUploadRx from "../../assets/images/scan-upload-rx.png";
import sunIcon from "../../assets/images/sun.png";
import BottomSheetWrapper from "../../common/BottomSheetWrapper";
import closeIcon from "../../assets/images/close-black-bg.svg";
import PatientInfoCard from "./patientInfoCard";
import ImageUpload from "./imageUpload/ImageUpload";
import cameraIcon from "../../assets/images/camera.png";
import scanIcon from "../../assets/images/scanner.png";
import { viewPatient } from "../../redux/appointmentsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getFilesOnMobile } from "../../redux/snapRxDigitizationSlice";
import UploadSuccess from "./uploadSuccess";
import { useLocalStorage } from "../../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";

const UPLOAD_RX_TEXT = {
  aiPoweredHeader: "AI-Powered Rx Digitisation",
  aiPoweredDesc:
    "Our smart AI quickly turns handwritten Rx into a clean digital format. If you turn on this toggle, the Rx will be auto-digitised. However, the receptionist can view, print, or share it only after the doctor reviews and saves it in their system.",
  knowMore: "Know more",
  scanUploadHeader: "Scan & Upload Rx",
  autoDigitise: "Auto-Digitise Uploaded Rx with Smart AI.",
  carousel1:
    "Ensure the prescription is placed on a flat, well-lit, plain surface",
  carousel2: "Avoid any shadows or glare on the document",
  carousel3: "Avoid any shadows or glare on the document",
  uploadRxBtn: "Upload Rx",
};

const CAROUSEL_ITEMS = [
  { text: UPLOAD_RX_TEXT.carousel1, icon: sunIcon },
  { text: UPLOAD_RX_TEXT.carousel2, icon: scanIcon },
  { text: UPLOAD_RX_TEXT.carousel3, icon: cameraIcon },
];

const { Text } = Typography;

const UploadRx = () => {
  const [isAutoDigitizeEnabled, setIsAutoDigitizeEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { patients_details } = useSelector((state) => state.records) || {};
  const { uploadedFiles: uploadedFilesFromStore } = useSelector(
    (state) => state.snapRx
  );
  const bottomSheetRef = useRef(null);
  const imageUploadRef = useRef(null);
  const [data, setData] = useState({});
  const [patientData, setPatientData] = useState({});
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const searchParams = localStorage.getItem("searchParams");
    if (searchParams) {
      const params = new URLSearchParams(searchParams);
      const patientId = params.get("patient_unique_id");
      const tcmId = params.get("tcm_id");
      const pamId = params.get("pam_id");
      const timestamp = params.get("timestamp");
      const sessionId = params.get("session_id");
      const type = params.get("type");
      const authToken = params.get("authToken");
      if (authToken) {
        setToken(authToken);
      }
      setData({ patientId, tcmId, pamId, timestamp, type, sessionId });
    }
  }, []);

  useEffect(() => {
    if (!patients_details && data?.patientId) {
      const sendData = {
        patient_unique_id: data?.patientId,
      };
      dispatch(viewPatient(sendData));
    }
  }, [data, patients_details]);

  useEffect(() => {
    if (patients_details) {
      setPatientData((prev) => ({
        ...prev,
        patientName: patients_details?.pm_fullname,
        patientGender: patients_details?.pm_gender,
        patientAge: patients_details?.ageYears,
        patientPhone: patients_details?.pm_contact_no,
      }));
    }
  }, [patients_details]);

  useEffect(() => {
    if (
      data?.patientId &&
      data?.sessionId &&
      uploadedFilesFromStore?.length === 0
    ) {
      setLoading(true);
      dispatch(
        getFilesOnMobile({
          patient_unique_id: data.patientId,
          tcm_id: data?.tcmId,
          session_id: data?.sessionId,
        })
      ).then(() => {
        setLoading(false);
      });
    }
  }, [data, uploadedFilesFromStore?.length]);

  useEffect(() => {
    if (uploadedFilesFromStore?.length > 0) {
      setLoading(false);
      setShowSuccess(true);
    }
  }, [uploadedFilesFromStore]);

  const handleDigitizeRxToggle = (isToggled) => {
    setIsAutoDigitizeEnabled(isToggled); // TODO: INTEL - SEND THIS DATA AS WELL
  };

  const handleUploadClick = () => {
    imageUploadRef.current?.handleUploadClick();
  };

  const handleAddEditClick = () => {
    setShowSuccess(false);
    imageUploadRef.current?.handleAddEditClick();
  };

  console.log(
    "INTEL ==> uploadedFilesFromStore in uploadRx",
    uploadedFilesFromStore
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="upload-rx-container">
      {showSuccess && <UploadSuccess onAddEditClick={handleAddEditClick} />}
      <BottomSheetWrapper ref={bottomSheetRef}>
        <div className="p-20">
          <div className="pb-24 fw-semibold fs-16 text-black">
            {UPLOAD_RX_TEXT.aiPoweredHeader}
          </div>
          <div className="pb-24 fs-14">{UPLOAD_RX_TEXT.aiPoweredDesc}</div>
          <div
            className="close-btn d-flex align-items-center justify-content-center"
            onClick={() => bottomSheetRef.current.hide()}
          >
            <img src={closeIcon} alt="close" />
          </div>
        </div>
      </BottomSheetWrapper>
      <ImageUpload
        ref={imageUploadRef}
        patientUniqueId={data?.patientId}
        sessionId={data?.sessionId || "test-session"}
        uploadedFilesFromStore={uploadedFilesFromStore}
      />
      <div className="upload-rx-content">
        <img className="website-logo" src={websiteLogo} alt="logo" />
        <div className="main-content">
          <div className="ff-manrope main-content-header">
            {UPLOAD_RX_TEXT.scanUploadHeader}
          </div>
          <ScanAnimationWrapper width={172} height={228}>
            <img
              className="upload-rx-img mb-20"
              src={scanUploadRx}
              alt="scan-rx"
            />
          </ScanAnimationWrapper>
          <div className="px-2">
            <Card bordered={true} className="auto-digitize-toggle-card">
              <div className="align-items-center d-flex justify-content-between">
                <div className="d-flex align-items-center justify-content-start">
                  <img className="ai-agent" src={aiAgent} alt="x" />
                  <Text className="mx-20">
                    {UPLOAD_RX_TEXT.autoDigitise}
                    <a
                      onClick={() => bottomSheetRef.current.show()}
                      className="ps-1 know-more-link"
                    >
                      {UPLOAD_RX_TEXT.knowMore}
                    </a>
                  </Text>
                </div>
                <Switch
                  value={isAutoDigitizeEnabled}
                  onChange={handleDigitizeRxToggle}
                />
              </div>
            </Card>
            <PatientInfoCard
              name={patientData?.patientName}
              gender={patientData?.patientGender}
              age={patientData?.patientAge}
              phone={patientData?.patientPhone}
            />
            <Card
              bordered={true}
              className="auto-digitize-toggle-card p-12 pb-25"
            >
              <Carousel autoplay autoplaySpeed={5000}>
                {CAROUSEL_ITEMS.map(({ text, icon }, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-start align-items-center">
                      <img className={"sun-icon"} src={icon} alt="o" />
                      <Text className="ps-2">{text}</Text>
                    </div>
                  </div>
                ))}
              </Carousel>
            </Card>
            <Button
              type="primary"
              className="upload-rx-btn fs-18 fw-bold"
              onClick={handleUploadClick}
            >
              {UPLOAD_RX_TEXT.uploadRxBtn}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRx;
