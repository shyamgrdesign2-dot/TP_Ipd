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
                    <div className='col-5'>
                        <VitalsBodyComposition />
                        <MedicalHistory />
                        <LabParameters />
                        <Vaccination />
                    </div>
                    <div className='col-7'>
                        <Cardiology />
                    </div>
                </div>
            </div>
        </>
    )
}
export default PatientDetails