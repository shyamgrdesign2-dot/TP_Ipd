import React from 'react';
import Button from 'react-bootstrap/Button';

function Welcome() {

    return (
        <>
            <div className="welcomesection position-relative">
                <div className='bg-welcome d-flex justify-content-between align-items-center'>
                    <div>
                        <h1>Welcome Dr. Mihir!</h1>
                        <p>Your Appointments</p>
                    </div>
                    <div>
                        <div className='d-lg-flex d-block'>
                            <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2"> <i className="icon-Add me-2"></i> Add New Appointment</Button>{' '}
                            <Button variant="primary">Star Walk-In Consultation</Button>{' '}
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

export default React.memo(Welcome)