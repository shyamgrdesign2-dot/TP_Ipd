import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Button } from "antd";

import SidebarPatient from '../common/SidebarPatient'
import Welcome1 from '../common/Welcome1'
import VitalsBodyComposition from '../components/VitalsBodyComposition';
import LabParameters from '../components/LabParameters';
import MedicalHistory from '../components/MedicalHistory';
import Vaccination from '../components/Vaccination';
import Cardiology from '../components/Cardiology';
import variables from '../assets/scss/variables.scss'

const { Sider, Content } = Layout;

function PatientDetails() {

    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'ant-layout-sider1' : 'ant-layout-sider'}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <button type='button' className='btn btn-action d-flex align-items-center' onClick={() => navigate(-1)}>
                            <i className="icon-right" style={{ color: !collapsed && variables.grayColor }}></i> <div className="backbar">{!collapsed && '\u00A0Back'}</div>
                        </button>
                        {/* <Link to="/" className='btn btn-action d-flex align-items-center'>
                            <i className="icon-right" style={{ color: !collapsed && variables.grayColor }}></i> <div className="backbar">{!collapsed && '\u00A0Back'}</div>
                        </Link> */}
                        <Button className={collapsed ? 'collapseborder border rounded-10px' : ''} style={collapsed && { marginRight: -12, backgroundColor: 'white', zIndex: 1, }} type="text" icon={collapsed ? <i className='icon-Expand fs-21'></i> : <i className='icon-Contract fs-21'></i>} onClick={() => setCollapsed(!collapsed)} />
                    </div>
                    <SidebarPatient collapsed={collapsed} />
                </Sider>

                <Content>
                    <div className='w-100 vh-100 overflow-y-auto'>
                        <Welcome1 />
                        <div className="appointment-wrap PatientDetailswrap">
                            <div className='row'>
                                <div className='col-lg-5 col-md-12 col-12'>
                                    <VitalsBodyComposition />
                                    <MedicalHistory />
                                    <LabParameters />
                                    <Vaccination />
                                </div>
                                <div className='col-lg-7 col-md-12 col-12'>
                                    <Cardiology />
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
