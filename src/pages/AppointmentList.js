import React, { useState } from "react";

import Header from '../common/Header';
import SidebarDoctor from '../common/SidebarDoctor'
import Welcome from '../common/Welcome'
import Appointment from '../components/Appointment'
import WalkInConsultation from '../components/WalkInConsultation'

function AppointmentList() {

    const [flag, setFlag] = useState(0);

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
                        secondButtonPath={null}
                        onClick={(e) => setFlag(e)} />
                    {flag == 0 ?
                        <Appointment />
                        : <WalkInConsultation />
                    }

                </div>
            </div>
        </>
    );
}

export default AppointmentList;
