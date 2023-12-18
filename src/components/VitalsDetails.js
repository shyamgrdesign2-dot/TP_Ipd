import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Input, Table } from 'antd';
import vitals from '../assets/images/Vitals.svg';
import arrowright from '../assets/images/arrow-box-right.svg';
import graph from '../assets/images/Graph.svg';
import heartBeat from '../assets/images/heartBeat.svg';

function VitalsDetails() {

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const [data, setData] = useState([
        {
            name: 'Temperature',
            inputVitals: <Input className='inputheight41-group' addonAfter={'Frh'} />,
        },
        {
            name: 'Pulse',
            inputVitals: <Input className='inputheight41-group' addonAfter={'/min'} />,
        },
        {
            name: 'Resp. Rate',
            inputVitals: <Input className='inputheight41-group' addonAfter={'/min'} />,
        },
        {
            name: 'Systolic',
            inputVitals: <Input className='inputheight41-group' addonAfter={'mmhg'} />,
        },
        {
            name: 'Diastolic',
            inputVitals: <Input className='inputheight41-group' addonAfter={'mmhg'} />,
        },
        {
            name: 'SPO2',
            inputVitals: <Input className='inputheight41-group' addonAfter={'%'} />,
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
            fixed: 'left',
            width: 140,
        },
        {
            title: '9 OCT, 22',
            dataIndex: 'inputVitals',
            key: 'inputVitals',
            ellipsis: true,
            width: 200,
        },
        {
            title: '9 OCT, 22',
            dataIndex: 'inputVitals',
            key: 'inputVitals',
            ellipsis: true,
            width: 200,
        },
        {
            title: '9 OCT, 22',
            dataIndex: 'inputVitals',
            key: 'inputVitals',
            ellipsis: true,
            width: 200,
        }
    ];

    return (
        <div className='px-20'>
            <Table columns={columns} className='vitalsTable table-border' dataSource={data} onChange={handleChange} pagination={false} scroll={{ x: 450}} />
        </div>
    )
}

export default React.memo(VitalsDetails)