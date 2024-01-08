import React from 'react';
import Card from 'react-bootstrap/Card';
import { Table } from 'antd';

import vitals from '../assets/images/Vitals.svg';
// import arrowright from '../assets/images/arrow-box-right.svg';
// import graph from '../assets/images/Graph.svg';
import heartBeat from '../assets/images/heartBeat.svg';

function VitalsBodyComposition({ passVitals }) {

    const initialRows = [
        {
            key: '1',
            name: `Temperature (Frh)`,
        },
        {
            key: '2',
            name: `Pulse (/min)`,
        },
        {
            key: '3',
            name: `Resp. Rate (/min)`,
        },
        {
            key: '4',
            name: `Systolic (mmhg)`,
        },
        {
            key: '5',
            name: `Diastolic (mmhg)`,
        },
        {
            key: '6',
            name: `SPO2 (%)`,
        },
        {
            key: '7',
            name: `Height (cms)`,
        },
        {
            key: '8',
            name: `Weight (kgs)`,
        }
    ];

    const initialColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
        },
    ];

    // Extract unique dates from the JSON array
    const uniqueDates = passVitals && passVitals.length > 0 ? [...passVitals.map((item) => item.date)] : [];

    // Initialize columns for each unique date
    const dateColumns = uniqueDates.map((date) => ({
        title: date,
        dataIndex: date,
        key: date,
        width: 100,
    }));
    const columns = [...initialColumns, ...dateColumns];

    passVitals && passVitals.length > 0 && passVitals.map((item, index) => {
        initialRows[0][item.date] = item.temp
        initialRows[1][item.date] = item.pres
        initialRows[2][item.date] = item.resp_rate
        initialRows[3][item.date] = item.blood_press ? item.blood_press.split('/')[0] : ''
        initialRows[4][item.date] = item.blood_press ? item.blood_press.split('/')[1] : ''
        initialRows[5][item.date] = item.spo2
        initialRows[6][item.date] = item.height
        initialRows[7][item.date] = item.weight
    });

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card className=''>
                <Card.Header className='bg-white py-3'>
                    <div>
                        <img src={vitals} alt="vitals" className='me-3' />
                        Vitals & Body Composition
                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    {passVitals && passVitals.length > 0 ? (
                        <Table dataSource={initialRows} columns={columns} pagination={false} />
                    ) : (
                        <div className='d-flex flex-column justify-content-center' style={{ minHeight: "300px" }}>
                            <div className='align-items-center text-center'>
                                <img src={heartBeat} width={57} height={52} alt="No vital & body composition saved for the patient!" />
                                <p className='mt-4 fontroboto'>No vital & body composition saved <br /> for the patient!</p>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(VitalsBodyComposition)