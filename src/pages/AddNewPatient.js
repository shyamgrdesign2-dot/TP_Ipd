import React from "react";
import { Col, Row } from "react-bootstrap";
import { Routes, Route } from 'react-router-dom';

import Header from '../common/Header';
import SidebarDoctor from '../common/SidebarDoctor'
import Welcome from '../common/Welcome'
import WalkInConsultation from '../components/WalkInConsultation'
import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";

function AddNewPatient() {
    return (
        <>
            <Header />
            <div className='d-flex'>
                <SidebarDoctor />
                <div className='w-100 bg-body wrapper custom-scroll'>
                    <Welcome
                        title={'Welcome Dr. Mihir!'} 
                        subTitle={'Your Appointments'}
                        backVisible={false}
                        buttonIcon={'icon-Add me-2'}
                        firstButtonName={'Add New Appointment'}
                        firstButtonPath={'/'}
                        secondButtonName={'Star Walk-In Consultation'}
                        secondButtonPath={'/walk_in_consultation'}/>
                    <Routes>
                        <Route path="/" element={
                            <div className="border rounded-4 appointment-wrap p-30">
                                <Row className='justify-content-between'>
                                    <Col lg={8} md={12}>
                                        <PersonalDetails />
                                        <hr className="my-3" />
                                        <AddressDetails />
                                    </Col>
                                    <Col lg={'auto'} md={12}>
                                        <UploadProfile />
                                    </Col>
                                </Row>
                            </div>
                        } />
                        <Route path="walk_in_consultation" element={<WalkInConsultation />} />
                    </Routes>
                </div>
            </div>
        </>
        
    )
}
export default React.memo(AddNewPatient)