import React from 'react';
import VitalsBodyComposition from './VitalsBodyComposition';
import LabParameters from './LabParameters';
import MedicalHistory from './MedicalHistory';
import Vaccination from './Vaccination';
import Cardiology from './Cardiology';

function PatientDetails() {
    return (
        <>
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
        </>
    )
}
export default PatientDetails