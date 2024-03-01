import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from "react-redux";

import { MESSAGE_KEY } from "../utils/constants";
import { makeDefaultLogo } from "../utils/utils";
import {
    sendCashsheetWhatsapp,
} from "../redux/caseManagerSlice";

function HeaderPrescriptionPrint({ patient_data, tcm_id }) {
    const navigate = useNavigate();
    const {
        loadingEndVisit,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const onEndVisitClick = async () => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0,
            tcm_id: tcm_id
        }
        const action = await dispatch(sendCashsheetWhatsapp(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/', { replace: true })
        } else {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }

    };

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
                <Button onClick={onEndVisitClick}
                    loading={loadingEndVisit}
                    className='btn align-items-center d-flex btn-41 btn-primary3 me-3 px-4'>
                    Go to Appointment
                </Button>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrescriptionPrint);