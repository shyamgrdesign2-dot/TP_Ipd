import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import {
  AutoComplete,
  Input,
  Button,
  Row,
  Col,
  Select,
  Popover,
  Tabs,
} from "antd";

import vitals from "../assets/images/Vitals.svg";
import HeaderPrescription from "../common/HeaderPrescription";
import Symptomsicon from "../assets/images/Symptoms.svg";
import hey from "../assets/images/bg-hey.png";
import DiagnosisBox from "../components/DiagnosisBox";
import SymptomsBox from "../components/SymptomsBox";

function Prescription() {
  return (
    <>
      <HeaderPrescription />
      <div className="w-100 bg-body wrapper2 custom-scroll prescription-wrapper">
        <img src={hey} alt="vitals" className="me-3 hey" />
        <div className="row">
          <div className="col-lg-4 col-md-12 col-12">
            <div className="prescription-box-sm p-14">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={vitals} alt="vitals" className="me-3" />
                  <div className="title-common">Vitals & Calculator</div>
                </div>
                <Link to="/">
                  <button className="btn d-flex align-items-center btn-text">
                    {" "}
                    <i className="icon-Add me-1 fs-5"></i> <span>Add</span>
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <button className="btn btn-parameters mx-auto w-100">
                <div className="align-items-center d-flex justify-content-center">
                  <i className="icon-Add me-2"></i> Add More Parameters
                </div>
              </button>
            </div>
          </div>
          {/* <DiagnosisPanel /> */}
          {/* <DiagnosisBox /> */}
          <SymptomsBox />
        </div>
      </div>
    </>
  );
}

export default Prescription;
