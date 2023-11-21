import React, { useState } from "react";

import Header from '../common/Header';
import SidebarDoctor from '../common/SidebarDoctor'
import Welcome from '../common/Welcome'
import Appointment from '../components/Appointment'

function AppointmentList() {

    return (
        <>
            <Header />
            <div className='d-flex'>
                <SidebarDoctor />
                <div className='w-100 bg-body wrapper custom-scroll'>
                    <Welcome />
                    <Appointment />
                </div>
            </div>
        </>
    );
}

export default AppointmentList;
