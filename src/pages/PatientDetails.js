import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button } from "antd";
import { isMobile } from 'react-device-detect';

import SidebarPatient from '../common/SidebarPatient'
import Welcome1 from '../common/Welcome1'
import VitalsBodyComposition from '../components/VitalsBodyComposition';
// import LabParameters from '../components/LabParameters';
// import MedicalHistory from '../components/MedicalHistory';
// import Vaccination from '../components/Vaccination';
import Cardiology from '../components/Cardiology';
import variables from '../assets/scss/variables.scss'

import { useSelector, useDispatch } from "react-redux";

import {
    viewCaseManager,
} from "../redux/caseManagerSlice";

const { Sider, Content } = Layout;

function PatientDetails() {

    const {
        viewCaseManagerData,
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const { state } = useLocation();
    const { patient_data } = state

    let location = useLocation();
    const navigate = useNavigate();

    const [locationPath, setLocationPath] = useState("/");
    const [collapsed, setCollapsed] = useState(isMobile ? true : false);
    const [tcmData, setTcmData] = useState({ tcm_id: 0, page: 1 });

    useEffect(() => {
        setLocationPath(location.pathname);
    }, [location]);

    useEffect(() => {
        var sendData = {
            patient_unique_id: patient_data != undefined ? patient_data.patient_unique_id : 0,
            tcm_id: tcmData.tcm_id
        }
        dispatch(viewCaseManager(sendData));
        // const timeOutId = setTimeout(() => {
        //     var sendData = {
        //         patient_unique_id: patient_data != undefined ? patient_data.patient_unique_id : 0,
        //         tcm_id: tcmData.tcm_id
        //     }
        //     dispatch(viewCaseManager(sendData));
        // }, 500);
        // return () => {
        //     clearTimeout(timeOutId);
        // };
    }, [tcmData]);

    const nextPress = () => {
        setTcmData({ tcm_id: viewCaseManagerData?.next_tcm_id, page: tcmData.page -= 1 })
    }

    const prevPress = () => {
        setTcmData({ tcm_id: viewCaseManagerData?.prev_tcm_id, page:  (tcmData.page += 1) })
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
                    <SidebarPatient collapsed={collapsed} patient_data={patient_data} />
                </Sider>

                <Content>
                    <div className='w-100 vh-100 overflow-y-auto'>
                        <Welcome1
                            locationPath={locationPath}
                            isMobile={isMobile}
                            patient_data={patient_data} 
                            viewCaseManagerData={viewCaseManagerData}/>
                        <div className="appointment-wrap PatientDetailswrap">
                            <div className='row'>
                                <div className='col-lg-5 col-md-12 col-12'>
                                    <VitalsBodyComposition loading={loading} passVitals={viewCaseManagerData ? [...viewCaseManagerData.vitals].reverse().slice(0, 2) : viewCaseManagerData} />
                                    {/* <MedicalHistory />
                                            <LabParameters />
                                            <Vaccination /> */}
                                </div>
                                <div className='col-lg-7 col-md-12 col-12'>
                                    <Cardiology patient_data={patient_data} tcmData={tcmData} loading={loading} viewCaseManagerData={viewCaseManagerData} nextPress={nextPress} prevPress={prevPress} />
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
