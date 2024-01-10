import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Table, Dropdown, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import Symptomsicon from '../assets/images/Symptoms.svg';
import Examinationsicon from '../assets/images/Examination.svg';
import Diagnosisicon from '../assets/images/Diagnosis.svg';
import Medicationicon from '../assets/images/Medication.svg';
import Frameicon from '../assets/images/Frame.svg';
import Investigationicon from "../assets/images/Lab.svg";
import notesicon from '../assets/images/notes.svg';
import calenderBlank from '../assets/images/calenderBlank.svg';

function Cardiology(props) {

    const navigate = useNavigate();
    const { patient_data, tcmData, loading, viewCaseManagerData, nextPress, prevPress } = props

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

    const printContent = async () => {
        await window.open(viewCaseManagerData?.print_url);
    };

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            {!loading && (
                <Card className=''>
                    {viewCaseManagerData ? (
                        <>
                            <Card.Header className='bg-white py-3'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>
                                        <div className='title2'>{`${viewCaseManagerData?.doctor_data?.doctor_name} | ${viewCaseManagerData?.doctor_data?.dp_name}`}</div>
                                        <div className='subtitle'>{viewCaseManagerData?.showConsultationDateTime}</div>
                                    </div>
                                    <div>
                                        <Button className="btn border rounded-3 p-1 me-2 antdesable-custom" onClick={nextPress} disabled={viewCaseManagerData?.next_tcm_id ? false : true}>
                                            <i className="icon-right"></i>
                                        </Button>
                                        {`${tcmData.page}/${viewCaseManagerData?.total_consultation}`}
                                        <Button className="btn border rounded-3 antdesable-custom p-1 ms-2" onClick={prevPress} disabled={viewCaseManagerData?.prev_tcm_id ? false : true}>
                                            <i className="icon-right" style={{ display: 'block', transform: `rotate(180deg)` }}></i>
                                        </Button>
                                    </div>
                                    <div>
                                        <button className="btn p-0 ms-3"
                                            onClick={() =>
                                                navigate("/prescription", { state: { patient_data: patient_data, caseManagerData: viewCaseManagerData } })
                                            }
                                        >
                                            <i className="icon-Edit"></i>
                                        </button>
                                        <button className="btn p-0 ms-3" onClick={printContent}>
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

                                <div>
                                    <div className='p-3'>
                                        {viewCaseManagerData.symptoms.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                                <div>
                                                    <div className='title'>Symptoms</div>
                                                    {viewCaseManagerData.symptoms.map((item, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <span>{item.symptom_name}</span> - <label>{`${item.since} ${item.severity && `${item.since && ','} ${item.severity}`} ${item.note && `, ${item.note}`}`}</label>{viewCaseManagerData.symptoms.length - 1 != i && ' | '}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {viewCaseManagerData.examination.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Examinationsicon} alt="Examinations" />
                                                <div>
                                                    <div className='title'>Examinations</div>
                                                    {viewCaseManagerData.examination.map((item, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <span>{item.examination_name}</span> : <label>{item.note}</label>{viewCaseManagerData.examination.length - 1 != i && ' | '}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {viewCaseManagerData.diagnosis.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Diagnosisicon} alt="Diagnosis" />
                                                <div>
                                                    <div className='title'>Diagnosis</div>
                                                    {viewCaseManagerData.diagnosis.map((item, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <span>{item.tds_name}</span> - <label>{`${item.since} ${item.status && `${item.since && ','} ${item.status}`} ${item.note && `, ${item.note}`}`}</label>{viewCaseManagerData.diagnosis.length - 1 != i && ' | '}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/* <div>
<div className='d-flex align-items-center'>
<img className='me-2' src={Medicationicon} alt="Medication" />
<div>
<div className='title'>Medication</div>
</div>
</div>
<div className='border-top border-bottom mt-2'>
<Table className='table-border' columns={columns} dataSource={data} onChange={handleChange} pagination={false} />
</div>
</div> */}
                                    </div>
                                    <div className='p-3'>
                                        {viewCaseManagerData.advice.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Frameicon} alt="Advice" />
                                                <div>
                                                    <div className='title'>Advice</div>

                                                    {viewCaseManagerData.advice.map((item, i) => {
                                                        return (
                                                            <label key={i}>{`${i != 0 ? ', ' : ''}${item.advice_name}`}</label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {viewCaseManagerData.investigation.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Investigationicon} alt="Advice" />
                                                <div>
                                                    <div className='title'>Lab Investigation</div>
                                                    {viewCaseManagerData.investigation.map((item, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <span key={i}>{item.investigation_name}</span> : <label>{item.note}</label>{viewCaseManagerData.investigation.length - 1 != i && ' | '}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/* Use This in 2nd Version */}
                                        {/* <div className='d-flex align-items-start mb-4'>
<img className='me-2' src={notesicon} alt="Doctor Note" />
<div>
<div className='title'>Doctor Note</div>
<label>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</label>
</div>
</div> */}
                                    </div>
                                </div>

                            </Card.Body>
                        </>
                    ) : (
                        <div className='d-flex flex-column justify-content-center' style={{ "height": "calc(100vh - 118px)" }}>
                            <div className='align-items-center text-center'>
                                <img src={calenderBlank} width={57} height={62} alt="No vital & body composition saved for the patient!" />
                                <p className='mt-4 fontroboto'>No any visit found for this patient yet</p>
                                <Button onClick={() =>
                                    navigate("/prescription", { state: { patient_data: patient_data } })
                                } className="btn btn-primary3 btn-text-white px-5 btn-41">Start New Visit</Button>
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

export default React.memo(Cardiology)