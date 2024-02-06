import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, DatePicker, Input, Button, Col, Row } from 'antd';
import { Content } from "antd/es/layout/layout";
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from '../../context/CashManagerContext';
import HeaderPrescription from "../../common/HeaderPrescription";
import TabSymptomsBox from "../../components/tab_design/TabSymptomsBox";
import TabExaminationBox from "../../components/tab_design/TabExaminationBox";
import TabDiagnosisBox from "../../components/tab_design/TabDiagnosisBox";
import TabMedicationBox from "../../components/tab_design/TabMedicationBox";
import TabAdviceBox from "../../components/tab_design/TabAdviceBox";
import TabInvestigationBox from "../../components/tab_design/TabInvestigationBox";
import TabFollowUpBox from "../../components/tab_design/TabFollowUpBox";

import VitalsBox from "../../components/VitalsBox";
import TabVitalsList from "../../components/tab_design/TabVitalsList";
import vitalsWhite from '../../assets/images/vitals-white.svg';
// import medicalHistoryWhite from '../../assets/images/medical-history-white.svg';
// import labParametersWhite from '../../assets/images/lab-parameters-white.svg';
// import vaccinationWhite from '../../assets/images/vaccination-white.svg';
// import notesWhite from '../../assets/images/notes-white.svg';
// import docsWhite from '../../assets/images/docs-white.svg';
import Sider from "antd/es/layout/Sider";

function TabPrescription() {

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

    const [collapsed, setCollapsed] = useState(false);
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
        !collapsed && setCollapsed(!collapsed)
        setVitalDrawer(!vitalDrawer);
    }, [collapsedFlag, collapsed, vitalDrawer]);

    return (
        <CashManagerContext.Provider value={contextApi}>
            <>
                <HeaderPrescription />
                <div className='w-100 bg-body wrapper2 prescription-wrapper p-0'>
                    <Layout>
                        <div className="prescription-sidebar">
                            <button type='button' className="mb-3 text-center btn btn-action" onClick={() => !collapsed && vitalsData.length == 0 ? handleDrawerVital() : setCollapsed(!collapsed)}>
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={vitalsWhite} alt="Vitals" />
                                </div>
                                <label className="text-white mt-1">Vitals</label>
                            </button>
                            {/* <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={medicalHistoryWhite} alt="History" />
                                </div>
                                <label className="text-white mt-1">History</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={labParametersWhite} alt="Lab" />
                                </div>
                                <label className="text-white mt-1">Lab</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={vaccinationWhite} alt="Vaccine" />
                                </div>
                                <label className="text-white mt-1">Vaccine</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={notesWhite} alt="Notes" />
                                </div>
                                <label className="text-white mt-1">Notes</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="bg-secondary-light prescription-tab-button rounded-10px">
                                    <img src={docsWhite} alt="Docs" />
                                </div>
                                <label className="text-white mt-1">Docs</label>
                            </button> */}
                        </div>
                        <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'tabsider' : 'tabsider1'}>
                            {collapsedFlag === 1 && (
                                <TabVitalsList handleDrawerVital={handleDrawerVital} handleCollapsed={() => setCollapsed(!collapsed)} />
                            )}
                        </Sider>
                        <div className="p-20 w-100 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <Content>
                                <TabSymptomsBox />
                                <TabExaminationBox />
                                <TabDiagnosisBox />
                                <TabMedicationBox />
                                <TabAdviceBox />
                                <TabInvestigationBox />
                                <TabFollowUpBox />
                            </Content>
                        </div>
                    </Layout>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerVital} open={vitalDrawer} className="modalWidth-700" width="auto">
                    <VitalsBox handleDrawerVital={handleDrawerVital} handleCollapsed={(flag) => handleCollapsed(flag)} />
                </Drawer >
            </>
        </CashManagerContext.Provider>
    );
}
export default TabPrescription;