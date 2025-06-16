import React, { useEffect, useState } from 'react';
import { Button, Popover } from 'antd';
import { makeDefaultLogo } from "../utils/utils";
import { Link } from 'react-router-dom';

import { useSelector } from "react-redux";
import moment from 'moment';
import { getDecodedToken } from '../utils/localStorage';
import config from '../config';
import { isIPad13 } from 'react-device-detect';

export const genderAge = (patient_data, profile, shouldShowGender = true) => {
    var value = shouldShowGender
        ? `${patient_data?.pm_gender[0].toUpperCase()}, `
        : "";
    if (profile?.dp_id === 9) {
        if (patient_data?.ageYears != 0) {
            value += `${patient_data?.ageYears}y`;
        }
        if (patient_data?.ageMonths != 0) {
            value += ` ${patient_data?.ageMonths}m`;
        }
        if (patient_data?.ageDays != 0) {
            value += ` ${patient_data?.ageDays}d`;
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
    return value;
};

function ProfilePopover(props) {
    const [open, setOpen] = useState(false);
    const [tokenData, setTokenData] = useState(null);

    const { profile } = useSelector((state) => state.doctors);

    const { locationPath, patient_data, isPrescriptionPage } = props;
    const { patients_details } = useSelector(
        (state) => state.records
    );
    let patientDOB = ''
    if (patients_details?.pm_dob) {
        patientDOB = moment(patients_details.pm_dob).format("DD-MM-YYYY");
    } else if (patient_data?.DOB) {
        patientDOB = moment(patient_data.DOB, "Do MMMM YYYY").format("DD-MM-YYYY");
    } else if (patient_data?.pm_dob) {
        patientDOB = moment(patient_data?.pm_dob).format("DD-MM-YYYY");
    }

    useEffect(() => {
        const decodedToken = getDecodedToken();
        const decoded = decodedToken?.result;
        setTokenData(decoded)
    }, []);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <>
            {tokenData?.hospital_business_id != config.zydus_business_id && (
                <div className="align-items-center d-flex medicine-templates border-top-0 without-hover p-0 pb-3">
                    <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                    <div className="text-truncate">
                        <div className="fontroboto letterspacing">Patient Id</div>
                        <div className="fontroboto letterspacing fw-medium">{patient_data !== undefined ? patient_data?.pm_pid : "000000"}</div>
                    </div>
                </div>
            )}
            <div className="align-items-center d-flex medicine-templates border-top-0 without-hover p-0">
                <div className="round-box bg-body-secondary"><i className="icon-phone fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Mobile Number</div>
                    <div className="fontroboto letterspacing fw-medium">{patient_data !== undefined ? patient_data?.pm_contact_no : "000000"}</div>
                </div>
            </div>
            <div>
                {tokenData?.hospital_business_id != config.zydus_business_id && (
                    <Link to="/edit_patient" replace={true} state={{ patient_data: patient_data }}>
                        <Button className='btn btn-primary2 d-flex justify-content-center align-items-center w-100 mt-3 btn-41'>
                            <i className='icon-Edit me-2 fs-21'></i>
                            Edit Profile
                        </Button>
                    </Link>
                )}
                {locationPath == '/patient_details' ? '' :
                    <Link to="/patient_details" state={{ patient_data: patient_data }}>
                        <Button className='btn btn-primary2 align-items-center d-flex justify-content-center w-100 mt-3 btn-41'>
                            <i className='icon-Visit-Summary fs-21 me-2'></i>
                            Visit Summary
                        </Button>
                    </Link>
                }
            </div>
        </>
    )

    const getPatientName = () => {
        if (!patient_data) return "Hello Guest";
        const isSmallTablet = window.innerWidth <= 1024;
        if (isPrescriptionPage && isSmallTablet && patient_data?.pm_fullname?.length > 10) {
            return `${patient_data?.pm_fullname?.slice(0,5)}...`;
        }
        return patient_data?.pm_fullname;
    }

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            className='cursor-pointer'
            overlayClassName="pop-260 pp-20"
        >
            {locationPath == '/patient_details' ? (
                <div className={'align-items-center d-flex h-100'}>
                    <div className='align-items-center d-flex'>
                        <div className='patientName'>{`${getPatientName()},`}</div>
                        <div className='text-2 fontpoppins fontpoppins1 ms-1'>{patient_data !== undefined ? genderAge(patient_data, profile) : `M, 30y`} {patientDOB ? `(${patientDOB})` : ''}</div>
                        <i className='icon-right iconrotate270 ms-1'></i>
                    </div>
                </div>
            ) : patient_data ?
                (
                    <div className={'align-items-center d-flex h-100 ps-3'}>
                        <div className='rounded-pill patientProfile border me-3'>{makeDefaultLogo(patient_data?.pm_fullname)}</div>
                        <div>
                            <div className='patientName'>{getPatientName()}<div className='text-2'>{patient_data !== undefined ? genderAge(patients_details || patient_data, profile) : `M, 30y`} {patientDOB ? `(${patientDOB})` : ''}</div></div>
                        </div>
                        <div className='iconrotate270 align-self-start ms-2 mt-1'>
                            <i className='icon-right'></i>
                        </div>
                    </div>
                ) : null}
        </Popover>
    );
}

export default React.memo(ProfilePopover);