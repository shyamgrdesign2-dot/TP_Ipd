import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Drawer } from 'antd';
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from '../context/CashManagerContext';

import vitals from "../assets/images/Vitals.svg";
import HeaderPrescription from "../common/HeaderPrescription";
import hey from "../assets/images/bg-hey.png";

import SymptomsBox from "../components/SymptomsBox";
import ExaminationBox from "../components/ExaminationBox";
import DiagnosisBox from "../components/DiagnosisBox";
import AdviceBox from "../components/AdviceBox";
import InvestigationBox from "../components/InvestigationBox";
import TabFollowUpBox from "../components/tab_design/TabFollowUpBox";

import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";

function Prescription() {

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state
  const tcmId = caseManagerData != undefined ? caseManagerData.tcm_id : 0
  const consultationDate = caseManagerData != undefined ? caseManagerData.consultation_date : moment().format('YYYY-MM-DD HH:mm:ss')

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [vitalsData, setVitalsData] = useState([]);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [additionalNote, setAdditionalNote] = useState('');

  const contextApi = { patient_data, tcmId, consultationDate, symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, adviceData, setAdviceData, investigationData, setInvestigationData, medicationData, setMedicationData, vitalsData, setVitalsData, followUpDate, setFollowUpDate, additionalNote, setAdditionalNote };

  const [collapsedFlag, setCollapsedFlag] = useState(1);
  const [vitalDrawer, setVitalDrawer] = useState(false);

  useEffect(() => {
    if (caseManagerData != undefined) {
      if (caseManagerData.symptoms.length > 0) {
        setSymptomsData(caseManagerData.symptoms)
      }
      if (caseManagerData.examination.length > 0) {
        setExaminationData(caseManagerData.examination)
      }
      if (caseManagerData.diagnosis.length > 0) {
        setDiagnosisData(caseManagerData.diagnosis)
      }
      if (caseManagerData.advice.length > 0) {
        setAdviceData(caseManagerData.advice)
      }
      if (caseManagerData.investigation.length > 0) {
        setInvestigationData(caseManagerData.investigation)
      }
      if (caseManagerData.vitals.length > 0) {
        const updatedData = caseManagerData.vitals.map((e, i) => {
          return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
        });
        setVitalsData(updatedData)
      }
      if (caseManagerData.medicine.length > 0) {
        const updatedData = caseManagerData.medicine.map((e) => {
          const medicineUnit = e?.medicineUnit.map((e1) => {
            return {
              key: JSON.stringify({ ...e1 }),
              value: e1.tmu_id,
              label: <>{e1.tmu_title}</>,
            };
          });

          return {
            ...e,
            medicineUnit: medicineUnit,
            unique_id: uuidv4(),
          };
        });
        setMedicationData([...updatedData])
      }
      if (caseManagerData.follow_up_date) {
        setFollowUpDate(caseManagerData.follow_up_date)
      }
      if (caseManagerData.visit_advice) {
        setAdditionalNote(caseManagerData.visit_advice)
      }
    }
  }, []);

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
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          <img src={hey} alt="vitals" className="me-3 hey" />
          <div className="row">
            <div className="col-lg-4 col-md-12 col-12">
              <div className="prescription-box-sm p-14">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src={vitals} alt="vitals" className="me-3" />
                    <div className="title-common">Vitals & Body Composition</div>
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
              <TabFollowUpBox />
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
