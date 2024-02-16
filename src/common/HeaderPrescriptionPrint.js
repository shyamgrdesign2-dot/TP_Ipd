import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { makeDefaultLogo } from "../utils/utils";

function HeaderPrescriptionPrint({ patient_data }) {
    const navigate = useNavigate();

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 justify-content-between'>
                <div>
                    <div className={'align-items-center d-flex h-100 ps-3'}>
                        <div className='rounded-pill patientProfile border me-3'>{makeDefaultLogo(patient_data?.pm_fullname)}</div>
                        <div>
                            <div className='patientName'>{`${patient_data !== undefined ? patient_data.pm_fullname : "Hello Guest"}`}<div className='text-2'>{`${patient_data !== undefined ? patient_data.pm_gender[0].toUpperCase() : "M"}, ${patient_data !== undefined ? patient_data.ageYears : 30}y`}</div></div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => navigate('/', { replace: true })}
                    className='btn align-items-center d-flex btn-41 btn-primary3 me-3 px-4'>
                    Go to Appointment
                </Button>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrescriptionPrint);