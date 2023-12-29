import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const PatientPlank = ({patient, isModalOpen, setIsModalOpen}) => {
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between py-3 border-bottom"
        onClick={setIsModalOpen}
      >
        <div className="d-flex align-items-center">
          <div className="list-patientName d-flex align-items-center me-4">
            <i className="icon-patients backbar me-2"></i>{" "}
            <span>
              {patient.name} ({patient.gender}, {patient.age})
            </span>
          </div>
          <div className="list-patientName d-flex align-items-center me-4">
            <i className="icon-phone backbar me-2"></i>
            <span>{patient.ph_no}</span>
          </div>
          <div className="list-patientName d-flex align-items-center me-4">
            <i className="icon-Id backbar me-2"></i>
            <span>{patient.p_id}</span>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/patient_details">
            <Button
              type="text"
              className="btn btn-primary2 me-4 align-items-center d-flex"
              icon={<i className="icon-Preview"></i>}
            >
              Patient Details
            </Button>
          </Link>
          <Link to="/prescription">
            <Button
              type="text"
              className="btn btn-primary3 align-items-center d-flex"
              icon={<i className="icon-Consult"></i>}
            >
              Start Consult
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PatientPlank;
