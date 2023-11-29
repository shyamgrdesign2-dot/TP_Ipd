import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Table, Dropdown } from 'antd';

import Symptomsicon from '../assets/images/Symptoms.svg';
import Examinationsicon from '../assets/images/Examination.svg';
import Diagnosisicon from '../assets/images/Diagnosis.svg';
import Medicationicon from '../assets/images/Medication.svg';
import Frameicon from '../assets/images/Frame.svg';
import notesicon from '../assets/images/notes.svg';

function Cardiology() {

    const [filteredInfo, setFilteredInfo] = useState({});
    const [setSortedInfo] = useState({});

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

    const items = [
        {
            label: 'Print Rx',
            key: 'printrx',
        },
        {
            label: 'Saved as a Template',
            key: 'SavedasTemplate',
        }
    ];

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
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <div className='title2'>Dr Giri Surya | Cardiology</div>
                            <div className='subtitle'>10 Oct 2023, 5:13 pm</div>
                        </div>
                        <div>
                            <button className="btn p-0 ms-3">
                                <i className="icon-Edit"></i>
                            </button>
                            <button className="btn p-0 ms-3">
                                <i className="icon-Print"></i>
                            </button>
                            <Dropdown className='btn btn-outline btn-more ms-1' menu={{ items, }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className='p-0 cardbody-data'>
                    <div className='p-3'>
                        <div className='d-flex align-items-start mb-4'>
                            <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                            <div>
                                <div className='title'>Symptoms</div>
                                <span>Chest pain</span> - <label>2 Months, Mild, Lorem ispsum dolor sit amet</label> | <span>Cold </span> - <label>1 Month, Severe </label>
                            </div>
                        </div>
                        <div className='d-flex align-items-start mb-4'>
                            <img className='me-2' src={Examinationsicon} alt="Examinations" />
                            <div>
                                <div className='title'>Examinations</div>
                                <span>No dehydration</span> - <label>Lorem ispsum dolor sit amet, consectetur adipiscing elit</label> | <span>Chest congestion </span> : <label>lorem ipsum dolor sit </label>
                            </div>
                        </div>
                        <div className='d-flex align-items-start mb-4'>
                            <img className='me-2' src={Diagnosisicon} alt="Diagnosis" />
                            <div>
                                <div className='title'>Diagnosis</div>
                                <span>Hypertension</span> - <label>1 month, suspected, Lorem ipsum dolor sit amet, consectetur adipiscing elit</label> | <span>Heaet failure </span> - <label>3 month, Confirmed </label>
                            </div>
                        </div>
                        <div className='d-flex align-items-start'>
                            <img className='me-2' src={Medicationicon} alt="Medication" />
                            <div>
                                <div className='title'>Medication</div>
                            </div>
                        </div>
                    </div>
                    <div className='border-top border-bottom'>
                        <Table className='table-border' columns={columns} dataSource={data} onChange={handleChange} pagination={false} />
                    </div>
                    <div className='p-3'>
                        <div className='d-flex align-items-start mb-4'>
                            <img className='me-2' src={Frameicon} alt="Advice" />
                            <div>
                                <div className='title'>Advice</div>
                                <label>Avoid spicy food, No alcohol</label>
                            </div>
                        </div>
                        <div className='d-flex align-items-start mb-4'>
                            <img className='me-2' src={notesicon} alt="Doctor Note" />
                            <div>
                                <div className='title'>Doctor Note</div>
                                <label>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</label>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default React.memo(Cardiology)