import React, { useState, useRef } from "react";
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

const UPLOAD_RX_TEXT = {
  aiPoweredHeader: "AI-Powered Rx Digitisation",
  aiPoweredDesc:
    "Our smart AI quickly turns handwritten Rx into a clean digital format. If you turn on this toggle, the Rx will be auto-digitised. However, the receptionist can view, print, or share it only after the doctor reviews and saves it in their system.",
  knowMore: "Know more",
  scanUploadHeader: "Scan & Upload Rx",
  autoDigitise: "Auto-Digitise Uploaded Rx with Smart AI.",
  patientName: "Shyam Sundhar",
  patientDetails: {
    gender: "Male",
    age: "24 yrs",
  },
  patientPhone: "+91-9711365448",
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
  const bottomSheetRef = useRef(null);
  const imageUploadRef = useRef(null);

  const handleDigitizeRxToggle = (isToggled) => {
    setIsAutoDigitizeEnabled(isToggled);
  };

  const handleUploadClick = () => {
    imageUploadRef.current?.handleUploadClick();
  };

  return (
    <div className="upload-rx-container">
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
      <ImageUpload ref={imageUploadRef} />
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
              name={UPLOAD_RX_TEXT.patientName}
              gender={UPLOAD_RX_TEXT.patientDetails.gender}
              age={UPLOAD_RX_TEXT.patientDetails.age}
              phone={UPLOAD_RX_TEXT.patientPhone}
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
