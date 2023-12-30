import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import CashManagerContext from '../context/CashManagerContext';

import vitals from "../assets/images/Vitals.svg";
import HeaderPrescription from "../common/HeaderPrescription";
import hey from "../assets/images/bg-hey.png";

import SymptomsBox from "../components/SymptomsBox";
import ExaminationBox from "../components/ExaminationBox";
import DiagnosisBox from "../components/DiagnosisBox";
import AdviceBox from "../components/AdviceBox";
import InvestigationBox from "../components/InvestigationBox";

function Prescription() {

  const { state } = useLocation();

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);

  const contextApi = { state, symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, adviceData, setAdviceData, investigationData, setInvestigationData };

  return (
    <CashManagerContext.Provider value={contextApi}>
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
                  <Link>
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
            <div className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3">
              <SymptomsBox />
              <ExaminationBox />
              <DiagnosisBox />
              <AdviceBox />
              <InvestigationBox />
            </div>
          </div>
        </div>
      </>
    </CashManagerContext.Provider>
  );
}

export default Prescription;
