import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import ProfilePopover from './ProfilePopover';

function Welcome1(props) {

    const navigate = useNavigate();

    const { locationPath, isMobile, state } = props

    return (
        <>
            <div className="welcomesection position-relative">
                <div className='bg-welcome d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        <div>
                            <h1 className='mt-2'>{'Patient Details'}</h1>
                            {isMobile && (<ProfilePopover locationPath={locationPath} isMobile={isMobile} state={state} />)}
                            {isMobile ? '' : <p className='mb-1'>&nbsp;</p>}
                        </div>
                        <img src={require("../assets/images/bg-welcome.png")} className="welcomeig d-inline-block align-top" alt="Welcome" />
                    </div>
                    <div>
                        <div className='d-lg-flex d-block'>
                            <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2"> <i className={'icon-reload me-2'}></i> {'Repeat 10th Oct Rx'}</Button>
                            <Button variant="primary">{'Start New Visit'}</Button>
                        </div>
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