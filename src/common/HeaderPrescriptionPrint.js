import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function HeaderPrescriptionPrint({ state }) {
    const navigate = useNavigate();

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 justify-content-between'>
                <div>
                    <div className={'align-items-center d-flex h-100 ps-3'}>
                        <div className='rounded-pill patientProfile border me-3'>{`${state != undefined ? state.pm_first_name[0].toUpperCase() : "H"}${state != undefined ? state.pm_last_name[0].toUpperCase() : "G"}`}</div>
                        <div>
                            <div className='patientName'>{`${state != undefined ? state.pm_first_name : "Hello"} ${state != undefined ? state.pm_last_name : "Guest"}`}<div className='text-2'>{`${state != undefined ? state.pm_gender[0].toUpperCase() : "M"}, ${state != undefined ? state.ageYears : 30}y`}</div></div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => navigate("/")}
                    className='btn align-items-center d-flex btn-41 btn-primary3 me-3 px-4'>
                    Go to Appointment
                </Button>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrescriptionPrint);