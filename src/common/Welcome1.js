import React, { useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import ProfilePopover from './ProfilePopover';

function Welcome1(props) {

    const navigate = useNavigate();

    const { locationPath, isMobile, patient_data, viewCaseManagerData } = props

    const modifyFormat = useMemo(() => {
        if (viewCaseManagerData) {
            const data = moment(viewCaseManagerData.consultation_date).format('Do MMM')
            let first = data.split(' ')[0].slice(0, -2);
            let second = data.split(' ')[0].slice(-2);
            let third = data.split(' ')[1];
            return { first, second, third }
        } else {
            return null
        }
    }, [viewCaseManagerData])

    return (
        <>
            <div className="welcomesection position-relative">
                <div className='bg-welcome d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        <div>
                            <h1 className='mt-2'>{'Patient Details'}</h1>
                            {isMobile && (<ProfilePopover locationPath={locationPath} isMobile={isMobile} patient_data={patient_data} />)}
                            {isMobile ? '' : <p className='mb-1'>&nbsp;</p>}
                        </div>
                        <img src={require("../assets/images/bg-welcome.png")} className="welcomeig d-inline-block align-top ms-4" alt="Welcome" />
                    </div>
                    <div>
                        {viewCaseManagerData && (
                            <div className='d-lg-flex d-block'>
                                <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() =>
                                    navigate("/prescription", { state: { patient_data: patient_data, caseManagerData: { ...viewCaseManagerData, tcm_id: 0, consultation_date: moment().format('YYYY-MM-DD HH:mm:ss') } } })
                                }> <i className={'icon-reload me-2'}></i>Repeat {modifyFormat && modifyFormat.first}<sup>{modifyFormat && modifyFormat.second}</sup>&nbsp;{modifyFormat && modifyFormat.third} Rx</Button>
                                <Button variant="primary"
                                    className='btn-41 px-4'
                                    onClick={() =>
                                        navigate("/prescription", { state: { patient_data: patient_data } })
                                    }>
                                    {'Start New Visit'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='pb-5'>
                    &nbsp;
                </div>
            </div>
        </>
    )
}

export default React.memo(Welcome1)