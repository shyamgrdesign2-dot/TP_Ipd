import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Select, Segmented, DatePicker, Dropdown } from 'antd';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

function AppointmentData() {

    const navigate = useNavigate();

    const calanderList = [
        { value: 'Today', label: 'Today' },
        { value: 'Yesterday', label: 'Yesterday' },
    ];

    const segmentedList = [
        { value: 1, icon: <i className="icon-List"></i> },
        { value: 2, icon: <i className="icon-calendar"></i> },
    ]
    const [segmented, setSegmented] = useState(1)


    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const segmentedChange = useCallback((key) => {
        setSegmented(key);
    }, [segmented]);

    const [data, setData] = useState([
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '1',
            name: 'John Brown',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'new',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '2',
            name: 'Jim Green',
            age: 42,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'new',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '3',
            name: 'Joe Black',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'Follow Up',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '4',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'new',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '5',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'Follow Up',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '6',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'Follow Up',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '7',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
            visittype: 'new',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '8',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'Follow Up',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '9',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Female',
            visittype: 'new',
        },
        {
            contact: '+91-9711365448',
            key: Math.random(),
            srno: '10',
            name: 'Jim Red',
            age: 32,
            time: '10:30 am',
            date: '9th Oct 2023',
            gender: 'Male',
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
            title: '#',
            dataIndex: 'srno',
            key: 'srno',
            ellipsis: true,
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
                {
                    text: 'Joe',
                    value: 'Joe',
                },
                {
                    text: 'Jim',
                    value: 'Jim',
                },
            ],
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            render: (text, record) => <div><span>{text}</span><br /><small>{record.gender}, {record.age}</small></div>,
            ellipsis: true,
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            ellipsis: true,
        },
        {
            title: 'Visit Type',
            dataIndex: 'visittype',
            key: 'visittype',
            sorter: (a, b) => a.visittype.length - b.visittype.length,
            sortOrder: sortedInfo.columnKey === 'visittype' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Slot',
            dataIndex: 'time',
            key: 'time',
            filteredValue: filteredInfo.time || null,
            onFilter: (value, record) => record.time.includes(value),
            sorter: (a, b) => a.time.length - b.time.length,
            sortOrder: sortedInfo.columnKey === 'time' ? sortedInfo.order : null,
            render: (text, record) => <div><span>{record.time} </span> <br /> <small> {record.date}</small></div>,
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div size="middle">
                    {/* <button className='btn btn-outline-primary btn-consult' onClick={() => navigate("/patient_details")}>Consult</button> */}
                    <Link to='/patient_details'><button className='btn btn-outline-primary btn-consult'>Consult</button></Link>
                    <Dropdown className='btn btn-outline btn-more ms-3' menu={{ items }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <i className='icon-More'></i>
                        </a>
                    </Dropdown>
                </div>
            ),
            width: 170,
        },
    ];

    const dateChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const loadMoreData = () => {
        var dummyData = []
        data.map((e, i) => {
            dummyData.push({ ...e, key: Math.random() })
        })
        setData([...data, ...dummyData])
    }

    const items = [
        {
            label: '1st menu item',
            key: '0',
        },
        {
            label: '2nd menu item',
            key: '1',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    return (
        <div className='p-4 appointment-data'>
            <Row className='justify-content-between'>
                <Col md={3}>
                    <Form>
                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Control type="email" placeholder="Search by patient name" />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md="auto">
                    <div className='d-flex align-items-center'>
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="outline-light" className='dateoutline'><i className='icon-right d-block text-main'></i></Button>
                            <Button variant="outline-light" className='p-0'>
                                <DatePicker onChange={dateChange} />
                            </Button>
                            <Button variant="outline-light" className='dateoutline'><i className='icon-right text-main d-block iconrotate90'></i></Button>
                        </ButtonGroup>
                        <Select placeholder="Today" className='ms-3 appointmentselect' options={calanderList} />
                        <Segmented className='ms-3'
                            defaultValue={1}
                            options={segmentedList}
                            onChange={segmentedChange}
                        />
                    </div>
                </Col>
            </Row>
            {segmented == 1 ? (
                <div>
                    <Table columns={columns} dataSource={data} onChange={handleChange} pagination={false} />
                    <button className='btn btn-light w-100 mt-3 load-more' onClick={loadMoreData}>Show All (10)</button>
                </div>
            )
                :
                <h1>Grid View</h1>
            }
        </div>
    );
}

export default React.memo(AppointmentData)