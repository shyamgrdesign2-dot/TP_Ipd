import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from './ProfilePopover';

function HeaderPrescriptionPrint() {
    const navigate = useNavigate();
    const { state } = useContext(CashManagerContext);
    
    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 justify-content-between'>
                <div>
                    <ProfilePopover state={state}/>
                </div>
                <Button onClick={() => navigate("/", { state: state })}
                    className='btn align-items-center d-flex btn-41 btn-primary3 me-3 px-4'>
                    Go to Appointment
                </Button>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrescriptionPrint);