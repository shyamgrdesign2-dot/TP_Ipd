import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer } from 'antd';
import { Content } from "antd/es/layout/layout";

import CashManagerContext from '../../context/CashManagerContext';
import HeaderPrescription from "../../common/HeaderPrescription";
import TabSymptomsBox from "../../components/tab_design/TabSymptomsBox";
import TabExaminationBox from "../../components/tab_design/TabExaminationBox";
import TabDiagnosisBox from "../../components/tab_design/TabDiagnosisBox";
import TabMedicationBox from "../../components/tab_design/TabMedicationBox";
import TabAdviceBox from "../../components/tab_design/TabAdviceBox";
import TabInvestigationBox from "../../components/tab_design/TabInvestigationBox";

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
    const [symptomsData, setSymptomsData] = useState([]);
    const [examinationData, setExaminationData] = useState([]);
    const [diagnosisData, setDiagnosisData] = useState([]);
    const [adviceData, setAdviceData] = useState([]);
    const [investigationData, setInvestigationData] = useState([]);
    const [medicationData, setMedicationData] = useState([]);
    const [vitalsData, setVitalsData] = useState([]);
    const contextApi = { state, symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, medicationData, setMedicationData, adviceData, setAdviceData, investigationData, setInvestigationData, vitalsData, setVitalsData };
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedFlag, setCollapsedFlag] = useState(1);
    const [vitalDrawer, setVitalDrawer] = useState(false);
    // Drawer Vitals
    const handleDrawerVital = useCallback(() => {
        setVitalDrawer(!vitalDrawer);
    }, [vitalDrawer]);
    //Handle Sider
    const handleCollapsed = useCallback((flag) => {
        setCollapsedFlag(flag);
        setCollapsed(!collapsed)
        setVitalDrawer(!vitalDrawer);
    }, [collapsedFlag, collapsed, vitalDrawer]);
    return (
        <CashManagerContext.Provider value={contextApi}>
            <>
                <HeaderPrescription />
                <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper p-0'>
                    <Layout>
                        <div className="prescription-sidebar">
                            <button type='button' className="mb-3 text-center btn btn-action" onClick={() => !collapsed && handleDrawerVital()}>
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