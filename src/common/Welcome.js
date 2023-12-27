import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

function Welcome(props) {

    const navigate = useNavigate();

    const { locationPath, backVisible } = props


    return (
        <>
            <div className="welcomesection position-relative">
                <div className='bg-welcome d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        {backVisible && 
                            <Link to='/' className='lh-1 me-1 px-2 text-dark'>
                                <i className='fs-3 icon-right'></i>
                            </Link>
                        }
                        <div>
                            {locationPath == '/add_new_patient' ?
                                <h1>Add New Patient</h1>
                                : locationPath == '/walk_in_consultation' ?
                                    <h1>Start Walk-In Consultation</h1>
                                    : <h1>Welcome Dr. Mihir!</h1>}
                            {locationPath == '/' && <p>{'Your Appointments'}</p>}
                        </div>
                        <img src={require("../assets/images/bg-welcome.png")} className="welcomeig d-inline-block align-top" alt="Welcome" />
                    </div>
                    <div>
                        {locationPath == '/' && (
                            <div className='d-lg-flex d-block'>
                                {/* <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => alert('Comming Soon')}> <i className={'icon-Add me-2'}></i> {'Add New Appointment'}</Button> */}
                                <Button variant="primary" className='px-3' onClick={() => navigate('/walk_in_consultation')}>{'Star Walk-In Consultation'}</Button>
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

export default React.memo(Welcome)