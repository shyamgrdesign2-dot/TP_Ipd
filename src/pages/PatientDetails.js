import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button } from "antd";
import { isMobile } from 'react-device-detect';

import SidebarPatient from '../common/SidebarPatient'
import Welcome1 from '../common/Welcome1'
import VitalsBodyComposition from '../components/VitalsBodyComposition';
import LabParameters from '../components/LabParameters';
import MedicalHistory from '../components/MedicalHistory';
import Vaccination from '../components/Vaccination';
import Cardiology from '../components/Cardiology';
import variables from '../assets/scss/variables.scss'

import { useSelector, useDispatch } from "react-redux";

import {
    viewCaseManager,
} from "../redux/caseManagerSlice";

const { Sider, Content } = Layout;

function PatientDetails() {

    // const {
    //     viewCaseManagerData,
    //     loading,
    // } = useSelector((state) => state.caseManager);
    // const dispatch = useDispatch();

    const { state } = useLocation();

    let location = useLocation();
    const navigate = useNavigate();

    const [locationPath, setLocationPath] = useState("/");
    const [collapsed, setCollapsed] = useState(isMobile ? true : false);

    useEffect(() => {
        setLocationPath(location.pathname);
    }, [location]);


    // useEffect(() => {
    //     var sendData = {
    //         "tcm_id": "127403"
    //     }
    //     dispatch(viewCaseManager(sendData));
    // }, []);

    const viewCaseManagerData = {
        "symptoms": [
            {
                "symptom_name": "CD Title 1",
                "unique_id": "70ff98c0-2890-4606-811f-2e394cb44808",
                "since": "1 Hour",
                "severity": "severe",
                "note": ""
            },
            {
                "unique_id": "a2af2689-a7f6-4215-a857-a579e427acb9",
                "change": 1,
                "symptom_name": "Symptoms Custom",
                "since": "",
                "severity": "",
                "note": ""
            }
        ],
        "examination": [
            {
                "examination_name": "CD Title 3",
                "unique_id": "6e332b16-b6a3-41f7-bce7-4be907fae0ba",
                "note": ""
            },
            {
                "unique_id": "23dd80ff-30e3-4251-b94d-a556869ac28b",
                "change": 1,
                "examination_name": "Examination Custom",
                "note": ""
            }
        ],
        "diagnosis": [
            {
                "tds_id": 20581,
                "tds_name": "Headaches without mcc",
                "pms_default": 1,
                "unique_id": "34ecee56-b8d1-4cb0-a9c7-96a27d8e70e1",
                "since": "5 Day",
                "status": "suspected",
                "note": ""
            },
            {
                "unique_id": "c40125ec-a0fd-4aaf-b4f5-e69350c11b9f",
                "tds_id": 0,
                "tds_name": "Diagonis Custom",
                "pms_default": 0,
                "since": "",
                "status": "",
                "note": ""
            }
        ],
        "advice": [
            {
                "tat_id": 56,
                "advice_name": "AN Sub Title 3-3",
                "unique_id": "77f0432b-5279-47f5-8846-4e4aed3ef781"
            },
            {
                "tat_id": 67,
                "advice_name": "CC Sub Title 2-2",
                "unique_id": "3f900f76-dd20-4fde-970b-dade9a502888"
            },
            {
                "unique_id": "5cf661ff-1451-4373-971b-ef623acf2569",
                "change": 1,
                "advice_name": "Advice Custom"
            }
        ],
        "investigation": [
            {
                "investigation_name": "Liver",
                "unique_id": "7cb8937b-7ff5-4818-8b18-7004f691f557",
                "note": ""
            },
            {
                "investigation_name": "Alkaline Phosphatase ",
                "unique_id": "ab99ccd6-757c-4f57-82e8-0c3bc00d3f6c",
                "note": ""
            },
            {
                "unique_id": "ba5fea04-19bc-4269-b6fd-121fa47de117",
                "change": 1,
                "investigation_name": "Investigation Custom",
                "note": ""
            }
        ],
        "vitals": [
            {
                "date": "2024-01-02",
                "dev_unique_id": 17040967491297552,
                "tcv_id": 13319,
                "temp": "10",
                "pres": "20",
                "resp_rate": "30",
                "blood_press": "40/50",
                "spo2": "60",
                "tcbc_id": 5645,
                "height": "180",
                "weight": "70",
                "bmi": "21.60",
                "bmr": "1560.00",
                "bsa": "1.87",
                "systolic": "40",
                "diastolic": "50"
            },
            {
                "date": "2024-01-03",
                "dev_unique_id": 17040968000278218,
                "tcv_id": 0,
                "temp": "",
                "pres": "",
                "resp_rate": "",
                "blood_press": "",
                "spo2": "",
                "tcbc_id": 5646,
                "height": "",
                "weight": "",
                "bmi": "",
                "bmr": "-265.00",
                "bsa": "0.00",
                "systolic": "",
                "diastolic": ""
            }
        ]
    }
    return (
        <>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'ant-layout-sider1' : 'ant-layout-sider'}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <button type='button' className={`${isMobile ? 'px-1' : ''} btn btn-action d-flex align-items-center`} onClick={() => navigate(-1)}>
                            {isMobile ? (
                                <><i className="icon-right"></i> <div>{'\u00A0Back'}</div></>
                            ) : (
                                <><i className="icon-right" style={{ color: !collapsed && variables.grayColor }}></i> <div className="backbar">{!collapsed && '\u00A0Back'}</div></>
                            )}

                        </button>
                        {!isMobile && (<Button className={collapsed ? 'collapseborder border rounded-10px' : ''} style={collapsed && { marginRight: -12, backgroundColor: 'white', zIndex: 1, }} type="text" icon={collapsed ? <i className='icon-Expand fs-21'></i> : <i className='icon-Contract fs-21'></i>} onClick={() => setCollapsed(!collapsed)} />)}
                    </div>
                    <SidebarPatient collapsed={collapsed} state={state} />
                </Sider>

                <Content>
                    <div className='w-100 vh-100 overflow-y-auto'>
                        <Welcome1
                            locationPath={locationPath}
                            isMobile={isMobile}
                            state={state} />
                        <div className="appointment-wrap PatientDetailswrap">
                            <div className='row'>
                                <div className='col-lg-5 col-md-12 col-12'>
                                    <VitalsBodyComposition passVitals={viewCaseManagerData.vitals.slice(0, 2)} />
                                    {/* <MedicalHistory />
                                    <LabParameters />
                                    <Vaccination /> */}
                                </div>
                                <div className='col-lg-7 col-md-12 col-12'>
                                    <Cardiology viewCaseManagerData={viewCaseManagerData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Content>

            </Layout>
        </>
    );
}

export default PatientDetails;
