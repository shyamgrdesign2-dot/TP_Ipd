import React from 'react';
import Card from 'react-bootstrap/Card';
import { Table, Spin } from 'antd';
import moment from "moment";

import vitals from '../assets/images/Vitals.svg';
// import arrowright from '../assets/images/arrow-box-right.svg';
// import graph from '../assets/images/Graph.svg';
import heartBeat from '../assets/images/heartBeat.svg';

const showDateFormat = 'DD MMM, YY'

function VitalsBodyComposition({ loading, passVitals }) {

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
            name: `Systolic (mmHg)`,
        },
        {
            key: '5',
            name: `Diastolic (mmHg)`,
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
        },
        {
            key: '9',
            name: `BMI (kg/m²)`,
        },
        {
            key: '10',
            name: `BMR (kcals)`,
        },
        {
            key: '11',
            name: `BSA (m²)`,
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
    const dateColumns = uniqueDates.map((date, index) => ({
        title: moment(date).format(showDateFormat),
        dataIndex: index,
        key: index,
        width: 100,
    }));
    const columns = [...initialColumns, ...dateColumns];

    passVitals && passVitals.length > 0 && passVitals.map((item, index) => {
        initialRows[0][index] = item.temp ? item.temp : '-'
        initialRows[1][index] = item.pres ? item.pres : '-'
        initialRows[2][index] = item.resp_rate ? item.resp_rate : '-'
        initialRows[3][index] = item.blood_press ? item.blood_press.split('/')[0] ? item.blood_press.split('/')[0] : '-' : '-'
        initialRows[4][index] = item.blood_press ? item.blood_press.split('/')[1] ? item.blood_press.split('/')[1] : '-' : '-'
        initialRows[5][index] = item.spo2 ? item.spo2 : '-'
        initialRows[6][index] = item.height ? item.height : '-'
        initialRows[7][index] = item.weight ? item.weight : '-'
        initialRows[8][index] = item.bmi ? parseFloat(item.bmi).toFixed(2) : '-'
        initialRows[9][index] = item.bmr ? parseFloat(item.bmr).toFixed(2) : '-'
        initialRows[10][index] = item.bsa ? parseFloat(item.bsa).toFixed(2) : '-'
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
                        <Table dataSource={initialRows} columns={columns} pagination={false} loading={loading} />
                    ) : (
                        <div className='d-flex flex-column justify-content-center' style={{ minHeight: "300px" }}>
                            {loading ? (
                                <div className='align-items-center text-center'>
                                    <Spin />
                                </div>
                            ) : (
                                <div className='align-items-center text-center'>
                                    <img src={heartBeat} width={57} height={52} alt="No vital & body composition saved for the patient!" />
                                    <p className='mt-4 fontroboto'>No vital & body composition saved <br /> for the patient!</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(VitalsBodyComposition)