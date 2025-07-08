import React, { useEffect } from "react";
import { Button } from "antd";
import PatientInfoCard from "../patientInfoCard";
import "./styles.scss";
import websiteLogo from "../../../assets/images/website-images/logo.png";

const UPLOAD_RX_TEXT = {
  patientName: "Shyam Sundhar",
  patientDetails: {
    gender: "Male",
    age: "24 yrs",
  },
  patientPhone: "+91-9711365448",
};

const UploadSuccess = ({ goBack, uploadedFiles }) => {
  useEffect(() => {
    return () => {
      goBack();
    };
  }, []);

  return (
    <div className="success-rx-upload-container">
      <img className="website-logo" src={websiteLogo} alt="logo" />
      <div className="success-content">
        <div className="success-icon">
          <img
            src={require("../../../assets/images/success-animation.gif")}
            alt="SUCCESS GIF"
          />
        </div>
        <div className="success-text">
          <div className="success-title">
            {" "}
            Rx has been uploaded successfully.
          </div>
          <div className="success-description">
            You can view it in the TatvaCare EMR on the Patients Consultation
            page.
          </div>
        </div>
        <div className="patient-info-card-container">
          <PatientInfoCard
            name={UPLOAD_RX_TEXT.patientName}
            gender={UPLOAD_RX_TEXT.patientDetails.gender}
            age={UPLOAD_RX_TEXT.patientDetails.age}
            phone={UPLOAD_RX_TEXT.patientPhone}
            className="patient-info-card-success"
          />
        </div>
        {/* <div className="thumbnails-section">
          {uploadedFiles.map((file, index) => (
            <div key={index} className={`thumbnail-item`}>
              <img
                src={file.url || file.preview}
                alt={`Page ${index + 1}`}
                className="thumbnail-img"
              />
            </div>
          ))}
        </div> */}
        {/* TODO: INTEL - only for testing. remove the thumbnails here */}
        <Button
          type="primary"
          className="book-appointment-btn fs-14 fw-semibold"
          onClick={goBack}
        >
          Go to Appointment
        </Button>
      </div>
    </div>
  );
};

export default UploadSuccess;
