import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import CarePlanList from './CarePlanList';
import carePlanIcon from '../assets/images/advice.svg';
import { getCarePlanAssignments } from '../pages/smartSync/services/carePlanService';

const CarePlanBox = ({ patientId, selectedTcmId, readOnly = true }) => {
  const [carePlanCount, setCarePlanCount] = useState(0);

  useEffect(() => {
    const fetchCarePlanCount = async () => {
      if (!patientId) return;
      
      try {
        const response = await getCarePlanAssignments(patientId);
        const plans = Array.isArray(response) ? response : [];
        setCarePlanCount(plans.length);
      } catch (error) {
        console.error('Error fetching care plan count:', error);
        setCarePlanCount(0);
      }
    };

    fetchCarePlanCount();
  }, [patientId]);

  return (
    <div className="appointment-wrap PatientDetailswrap m-0">
      <Card>
        <Card.Header className='bg-white py-3'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <img 
                src={carePlanIcon} 
                alt="Care Plans" 
                className='me-3'
                style={{ width: '20px', height: '20px' }}
              />
              Assigned Care Plans ({carePlanCount})
            </div>
          </div>
        </Card.Header>
        <div className='px-3 pt-2'>
          <CarePlanList
            patientId={patientId}
            selectedTcmId={selectedTcmId}
            readOnly={readOnly}
            title="" // Empty title since count is now in header
          />
        </div>
      </Card>
    </div>
  );
};

export default CarePlanBox;