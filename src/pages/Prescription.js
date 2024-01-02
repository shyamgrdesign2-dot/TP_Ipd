import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Drawer } from 'antd';

import CashManagerContext from '../context/CashManagerContext';

import vitals from "../assets/images/Vitals.svg";
import HeaderPrescription from "../common/HeaderPrescription";
import hey from "../assets/images/bg-hey.png";

import SymptomsBox from "../components/SymptomsBox";
import ExaminationBox from "../components/ExaminationBox";
import DiagnosisBox from "../components/DiagnosisBox";
import AdviceBox from "../components/AdviceBox";
import InvestigationBox from "../components/InvestigationBox";
import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";

function Prescription() {

  const { state } = useLocation();

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [vitalsData, setVitalsData] = useState([]);

  const contextApi = { state, symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, adviceData, setAdviceData, investigationData, setInvestigationData, medicationData, setMedicationData, vitalsData, setVitalsData };

  const [collapsedFlag, setCollapsedFlag] = useState(1);
  const [vitalDrawer, setVitalDrawer] = useState(false);

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setVitalDrawer(!vitalDrawer);
  }, [vitalDrawer]);

  //Handle Sider
  const handleCollapsed = useCallback((flag) => {
    setCollapsedFlag(flag);
    setVitalDrawer(!vitalDrawer);
  }, [collapsedFlag, vitalDrawer]);

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
                  <button className="btn d-flex align-items-center btn-text" onClick={handleDrawerVital}>
                    {" "}
                    <i className={`${vitalsData.length > 0 ? 'icon-Edit' : 'icon-Add'} me-1 fs-5`}></i> <span>{`${vitalsData.length > 0 ? 'Edit' : 'Add'}`}</span>
                  </button>
                </div>
                {collapsedFlag === 1 && (
                  <VitalsList />
                )}
              </div>
              {/* <div>
                <button className="btn btn-parameters mx-auto w-100">
                  <div className="align-items-center d-flex justify-content-center">
                    <i className="icon-Add me-2"></i> Add More Parameters
                  </div>
                </button>
              </div> */}
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
        <Drawer closeIcon={false} placement="right" onClose={handleDrawerVital} open={vitalDrawer} className="modalWidth-700" width="auto">
          <VitalsBox handleDrawerVital={handleDrawerVital} handleCollapsed={(flag) => handleCollapsed(flag)} />
        </Drawer >
      </>
    </CashManagerContext.Provider>
  );
}

export default Prescription;
