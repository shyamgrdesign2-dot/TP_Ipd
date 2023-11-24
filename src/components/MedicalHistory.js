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
                        <a href="#">
                            <img src={arrowright} alt="vitals" />
                        </a>
                    </div>
                </Card.Header>
                <Card.Body className='cardbody-data'>
                    <div className='mb-2'>
                        <label>Medical Problems</label> : <span>Hypothyroidism</span> - <label>Since</label> : <span>3-6 Months</span>, <label>Medication</label> : <span>No</span>
                    </div>
                    <div>
                        <label>Lifestyle</label> : <span>Smoking</span> - <label>Yes</label>, <label>Since</label> : <span>2 Years</span>, <label>Quantity</label> : <span> 2 unit/day</span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(MedicalHistory)