import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Table } from 'antd';
import vitals from '../assets/images/Vitals.svg';
import arrowright from '../assets/images/arrow-box-right.svg';
import graph from '../assets/images/Graph.svg';
import heartBeat from '../assets/images/heartBeat.svg';

function VitalsBodyComposition() {

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const [data, setData] = useState([
        {
            key: Math.random(),
            name: 'John Brown',
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'new',
        },
        {
            key: Math.random(),
            name: 'Jim Green',
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'new',
        },
        {
            key: Math.random(),
            name: 'Joe Black',
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'Follow Up',
        },
        {
            key: Math.random(),
            name: 'Jim Red',
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'new',
        },
        {
            key: Math.random(),
            name: 'Jim Red',
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'Follow Up',
        }
    ]);

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Visit Type',
            dataIndex: 'visittype',
            key: 'visittype',
            ellipsis: true,
        },
        {
            title: 'Slot',
            dataIndex: 'time',
            key: 'time',
            filteredValue: filteredInfo.time || null,
            ellipsis: true,
        },
    ];

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
                    {/* <Table columns={columns} dataSource={data} onChange={handleChange} pagination={false} /> */}
                    <div className='d-flex flex-column justify-content-center' style={{"min-height": "300px"}}>
                        <div className='align-items-center text-center'>
                            <img src={heartBeat} width={57} height={52} alt="No vital & body composition saved for the patient!" />
                            <p className='mt-4 fontroboto'>No vital & body composition saved <br /> for the patient!</p>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(VitalsBodyComposition)