import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Layout, Collapse, Drawer, Card, } from 'antd';

import CashManagerContext from '../../context/CashManagerContext';

import HeaderPrescription from "../../common/HeaderPrescription";


import TabSymptomsBox from "../../components/tab_design/TabSymptomsBox";
import TabExaminationBox from "../../components/tab_design/TabExaminationBox";
import TabDiagnosisBox from "../../components/tab_design/TabDiagnosisBox";
import TabInvestigationBox from "../../components/tab_design/TabInvestigationBox";

import vitalsWhite from '../../assets/images/vitals-white.svg';
import medicalHistoryWhite from '../../assets/images/medical-history-white.svg';
import labParametersWhite from '../../assets/images/lab-parameters-white.svg';
import vaccinationWhite from '../../assets/images/vaccination-white.svg';
import notesWhite from '../../assets/images/notes-white.svg';
import docsWhite from '../../assets/images/docs-white.svg';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import VitalsDetails from "../../components/VitalsDetails";

function TabPrescription() {

    const [symptomsData, setSymptomsData] = useState([]);
    const [examinationData, setExaminationData] = useState([]);
    const [diagnosisData, setDiagnosisData] = useState([]);
    const [adviceData, setAdviceData] = useState([]);
    const [investigationData, setInvestigationData] = useState([]);

    const contextApi = { symptomsData, setSymptomsData, examinationData, setExaminationData, diagnosisData, setDiagnosisData, adviceData, setAdviceData, investigationData, setInvestigationData };

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

    // Accordian for side menu
    const accordionItems = [
        {
            key: '1',
            label: <div className="title-common">Past Visit Data</div>,
            children:
                <>
                    <div className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            10 OCT, 22
                        </div>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">HbA1C (%)</div>
                                <div className="fontroboto">7.4</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature (Frh)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">66</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">120/80</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            10 OCT, 22
                        </div>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">HbA1C (%)</div>
                                <div className="fontroboto">7.4</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature (Frh)</div>
                                <div className="fontroboto">95</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">66</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">120/80</div>
                            </div>
                        </div>
                    </div>
                </>
            ,
        },
    ];

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
                            <button type='button' className="mb-3 text-center btn btn-action">
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
                            </button>
                        </div>
                        <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'tabsider' : 'tabsider1'}>
                            {collapsedFlag === 1 && (
                                <>
                                    <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                                        Vitals
                                        <Button type="text" className="btn p-0 btn-outline" onClick={() => setCollapsed(!collapsed)}>
                                            <i className='icon-Contract fs-21 text-white p-0'></i>
                                        </Button>
                                    </div>
                                    <div className="overflow-y-auto" style={{ height: "calc(100vh - 109px)" }}>
                                        <div className="p-10 pb-0">
                                            <span className="title-common">Today’s Data</span>
                                            <Button className='btn btn-input mt-3 d-flex justify-content-center align-items-center btn-41' onClick={handleDrawerVital}>
                                                <i className='icon-Add me-2 fs-21'></i>
                                                Add or Edit Vitals
                                            </Button>
                                            <div className="py-3">
                                                <div className="d-flex align-items-center justify-content-between mb-12">
                                                    <div className="fontroboto">SPO2(%)</div>
                                                    <div className="fontroboto">95</div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mb-12">
                                                    <div className="fontroboto">HbA1C (%)</div>
                                                    <div className="fontroboto">7.4</div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mb-12">
                                                    <div className="fontroboto">Temperature (Frh)</div>
                                                    <div className="fontroboto">95</div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mb-12">
                                                    <div className="fontroboto">Pulse(/min)</div>
                                                    <div className="fontroboto">66</div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mb-12">
                                                    <div className="fontroboto">BP(mm Hg)</div>
                                                    <div className="fontroboto">120/80</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Collapse items={accordionItems} className="prescriptiontab-accordian" expandIconPosition={'end'} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </Sider>
                        <div className="p-20 w-100 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <Content>
                                <TabSymptomsBox />
                                <TabExaminationBox />
                                <TabDiagnosisBox />
                                <TabInvestigationBox />
                            </Content>
                        </div>
                    </Layout>
                </div>
                <Drawer closeIcon={false} placement="right" onClose={handleDrawerVital} open={vitalDrawer} className="modalWidth-645" width="auto">
                    <Card bordered={false} className="search-modalCard h-100">
                        <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                            <div className='align-items-center d-flex'>
                                <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerVital}>
                                    <i className='icon-Cross fs-3'></i>
                                </Button>
                                <div className="modal-title">Vitals</div>
                            </div>
                            <Button onClick={() => handleCollapsed(1)} className='btn btn-primary3 btn-41 px-4 me-20'>
                                Done
                            </Button>
                        </div>
                        <div className="align-items-center d-flex justify-content-between px-20 py-3">
                            <Button className='btn btn-primary2 btn-41'>
                                Add New Date
                            </Button>
                            <div className="float-end d-flex align-itms-center">
                                <i className="icon-setting me-2"></i>
                                <span className="text-decoration-underline fw-medium"> Add or Configure </span>
                            </div>
                        </div>
                        <VitalsDetails />
                    </Card>
                </Drawer >
            </>
        </CashManagerContext.Provider>
    );
}


export default TabPrescription;
