import React, { useCallback, useState } from 'react';
import { Tabs } from 'antd';

import AppointmentData from '../components/AppointmentData'

function Appointment() {

    const [tabChange, setTabChange] = useState('1')

    const items = [
        {
            key: '1',
            label: (
                <div className='d-flex'>
                    <i className='icon-Queue'></i>
                    Queue (20)
                </div>
            )
        },
        {
            key: '2',
            label: (
                <div className='d-flex'>
                    <i className='icon-Finished'></i>
                    Finished (0)
                </div>
            )
        },
        {
            key: '3',
            label: (
                <div className='d-flex'>
                    <i className='icon-Cancelled'></i>
                    Cancelled (0)
                </div>
            ),
        },
    ];

    const onChange = useCallback((key) => {
        setTabChange(key);
    }, [tabChange]);

    return (
        <div className="border rounded-4 appointment-wrap dateborder">
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
            />
            {tabChange == 1 ?
                <AppointmentData />
                : tabChange == 2 ?
                    <h1>Finished</h1>
                    :
                    <h1>Cancelled</h1>
            }
        </div>
    )
}
export default React.memo(Appointment)