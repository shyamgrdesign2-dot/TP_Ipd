import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";

import { errorMessage, makeDefaultLogo } from "../utils/utils";
import {
    sendCashsheetWhatsapp,
} from "../redux/caseManagerSlice";
import { resetVaccineState } from '../redux/vaccineSlice';
import { resetGrowthChartState } from '../redux/growthChartSlice';
import { resetObstetricState } from '../redux/obstetricSlice';

function HeaderPrescriptionPrint({ patient_data, tcm_id }) {
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.doctors);
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
            dispatch(resetVaccineState());
            dispatch(resetGrowthChartState());
            dispatch(resetObstetricState());
            navigate('/', { replace: true })
        } else {
            errorMessage(action.error)
        }

    };

    const genderAge = (patient_data) => {
        var value = `${patient_data?.pm_gender[0].toUpperCase()}, `
        if (profile?.dp_id === 9) {
            if (patient_data?.ageYears != 0) {
                value += `${patient_data?.ageYears}y`
            }
            if (patient_data?.ageMonths != 0) {
                value += ` ${patient_data?.ageMonths}m`
            }
            if (patient_data?.ageDays != 0) {
                value += ` ${patient_data?.ageDays}d`
            }
        } else {
            if (patient_data?.ageYears != 0) {
                value += `${patient_data?.ageYears}y`
            } else if (patient_data?.ageMonths != 0) {
                value += ` ${patient_data?.ageMonths}m`
            } else if (patient_data?.ageDays != 0) {
                value += ` ${patient_data?.ageDays}d`
            }
        }
        return value
    }

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 justify-content-between'>
                <div>
                    <div className={'align-items-center d-flex h-100 ps-3'}>
                        <div className='rounded-pill patientProfile border me-3'>{makeDefaultLogo(patient_data?.pm_fullname)}</div>
                        <div>
                            <div className='patientName'>{`${patient_data !== undefined ? patient_data.pm_fullname : "Hello Guest"}`}<div className='text-2'>{patient_data !== undefined ? genderAge(patient_data) : `M, 30y`}</div></div>
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