import React from 'react';
import Card from 'react-bootstrap/Card';

import MedicalHistoryicon from '../assets/images/Medical-History.svg';
import arrowright from '../assets/images/arrow-box-right.svg';

function MedicalHistory() {

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card className=''>
                <Card.Header className='bg-white py-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <img src={MedicalHistoryicon} alt="Medical History" className='me-3' />
                            Medical History
                        </div>
                        {/* <a>
                            <img src={arrowright} alt="vitals" />
                        </a> */}
                    </div>
                </Card.Header>
                <Card.Body className='cardbody-data'>
                    <div className='fw-semibold'>Medical Problems</div>
                    <div className='border rounded px-2 my-2'>
                        <div className='my-2'>
                            <span>Issue</span> : <label>Diabetes</label> | <span>Since</span> : <label>1 Year</label> | <span>Status</span> : <label>Active</label> | <span>Medication</span> : <label>No</label>
                        </div>
                        <div className='my-2'>
                            <span>Issue</span> : <label>Hypertension</label> | <span>Since</span> : <label>1 Year</label> | <span>Status</span> : <label>Active</label>
                        </div>
                        <div className='my-2'>
                            <span>Note</span> : <label>Consulted many doctors</label>
                        </div>
                    </div>
                    <div className='border rounded px-2 my-2'>
                        <div className='my-2'>
                            <label>No Hypertension</label>
                        </div>
                    </div>
                    <div className='text-center'>
                        <label className='text-primary fw-semibold d-inline'>View more</label>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(MedicalHistory)