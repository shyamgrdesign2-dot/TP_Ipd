import React from "react";
import { Button } from "antd";
import PatientInfoCard from "../patientInfoCard";
import "./styles.scss";
import websiteLogo from "../../../assets/images/website-images/logo.png";
import editIconWhite from "../../../assets/images/edit-white.png";
import { useSelector } from "react-redux";

const UploadSuccess = ({ onAddEditClick = () => {} }) => {
  const { patients_details } = useSelector((state) => state.records) || {};
  return (
    <div className="success-rx-upload-container">
      <img className="website-logo" src={websiteLogo} alt="logo" />
      <div className="success-content">
        <div className="success-icon">
          <img
            src={require("../../../assets/images/success-animation.webp")}
            alt="SUCCESS GIF"
          />
        </div>
        <div className="success-text">
          <div className="success-title">
            {" "}
            Rx has been uploaded successfully.
          </div>
          <div className="success-description">
            These documents will be visible on the TatvaPractice EMR post page
            refresh.
          </div>
        </div>
        <div className="patient-info-card-container">
          <PatientInfoCard
            name={patients_details?.pm_fullname}
            gender={patients_details?.pm_gender}
            age={patients_details?.ageYears}
            phone={patients_details?.pm_contact_no}
            className="patient-info-card-success"
          />
        </div>
        <Button
          type="primary"
          className="book-appointment-btn fs-14 fw-medium"
          onClick={onAddEditClick}
          icon={
            <img src={editIconWhite} alt="add-edit" className="add-edit-icon" />
          }
        >
          <span className="add-edit-text">Add/Edit</span>
        </Button>
      </div>
    </div>
  );
};

export default UploadSuccess;
