import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Table, Dropdown, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { isChrome, isSafari } from "react-device-detect";

import Symptomsicon from '../assets/images/Symptoms.svg';
import Examinationsicon from '../assets/images/Examination.svg';
import Diagnosisicon from '../assets/images/Diagnosis.svg';
import Medicationicon from '../assets/images/Medication.svg';
import Frameicon from '../assets/images/Frame.svg';
import Investigationicon from "../assets/images/Lab.svg";
import notesicon from '../assets/images/notes.svg';
import calenderBlank from '../assets/images/calenderBlank.svg';

import { hasNumber } from '../utils/utils'

function Cardiology(props) {

    const navigate = useNavigate();
    const { patient_data, tcmData, loading, viewCaseManagerData, nextPress, prevPress } = props

    const [filteredInfo, setFilteredInfo] = useState({});
    const [setSortedInfo] = useState({});

    const items = [
        {
            label: <div onClick={() => !isChrome && !isSafari ? printRxInAppContent() : printRxContent()}>Print Medicines Only</div>,
            key: 'printrx',
        },
        // {
        //     label: 'Saved as a Template',
        //     key: 'SavedasTemplate',
        // }
    ];

    async function printRxContent() {
        await window.open(viewCaseManagerData?.print_rx_url);
    };

    async function printRxInAppContent() {
        navigate(`/patient_details/?url=${viewCaseManagerData?.print_rx_url}&key=print`, { replace: true, state: { patient_data: patient_data } })
        navigate(0, { replace: true });
    };

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'Rx',
            dataIndex: 'rx',
            key: 'rx',
            width: '40px',
            render: (text, record, index) => (
                <div>
                    <span>{index + 1}</span>
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='lh-base'>
                    <div className='fw-medium'>{record.tmm_medicine_name}</div>
                    <small>{record.tmm_generic}</small>
                </div>
            ),
        },
        {
            title: 'Time & Frequency',
            dataIndex: 'TimeFrequency',
            key: 'TimeFrequency',
            render: (text, record) => (
                <div className='lh-base'>
                    {hasNumber(record.tmf_block) && record.tmf_block == 0 ? `${hasNumber(record.tcm_tmm_freq_morning) ? record.tcm_tmm_freq_morning : 0}-${hasNumber(record.tcm_tmm_freq_afternoon) ? record.tcm_tmm_freq_afternoon : 0}-${hasNumber(record.tcm_tmm_freq_evening) ? record.tcm_tmm_freq_evening : 0}-${hasNumber(record.tcm_tmm_freq_night) ? record.tcm_tmm_freq_night : 0} (${record.tmm_freq_type_name})` : `0-0-0-0 (${record.tmm_freq_type_name})`}
                    <div>{record.tmm_time_name}</div>
                </div>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            width: '82px',
            render: (text, record) => (
                <div>{hasNumber(record.tmm_days) ? `${record.tmm_days} - ${record.tmm_duration_type}` : `-`}</div>
            ),
        },
        {
            title: 'QTY.',
            dataIndex: 'qty',
            key: 'qty',
            width: '50px',
            render: (text, record) => (
                <div>{`${record.display_qty ? record.display_qty : '-'}`}</div>
            ),
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (text, record) => (
                <div>{`${record.tmm_remarks ? record.tmm_remarks : '-'}`}</div>
            ),
        },
    ];


    const printContent = async () => {
        await window.open(viewCaseManagerData?.print_url);
    };

    const printInAppContent = async () => {
        navigate(`/patient_details/?url=${viewCaseManagerData?.print_url}&key=print`, { replace: true, state: { patient_data: patient_data } })
        navigate(0, { replace: true });
    };

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card className=''>
                {viewCaseManagerData ? (
                    <>
                        <Card.Header className='bg-white py-3'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div>
                                    <div className='title2'>{`${viewCaseManagerData?.doctor_data?.doctor_name} | ${viewCaseManagerData?.doctor_data?.dp_name}`}</div>
                                    <div className='subtitle text-lowercase'>{viewCaseManagerData?.showConsultationDateTime}</div>
                                </div>
                                <div className='align-items-center d-flex'>
                                    <Button className="btn border rounded-3 px-1 me-2 antdesable-custom" onClick={nextPress} disabled={!loading && tcmData.page > 1 && viewCaseManagerData?.next_tcm_id ? false : true}>
                                        <i className="icon-right d-block"></i>
                                    </Button>
                                    <span className='fw-normal fs-14 fontroboto'>{`${tcmData.page}/${viewCaseManagerData?.total_consultation}`}</span>
                                    <Button className="btn border rounded-3 antdesable-custom p-1 ms-2" onClick={prevPress}
                                        disabled={!loading && tcmData.page < viewCaseManagerData?.total_consultation && viewCaseManagerData?.prev_tcm_id ? false : true}>
                                        <i className="icon-right" style={{ display: 'block', transform: `rotate(180deg)` }}></i>
                                    </Button>
                                </div>
                                <div>
                                    <button className="btn p-0 ms-3" style={{ visibility: viewCaseManagerData?.doctor_data?.editCase ? 'visible' : 'hidden' }}
                                        onClick={() =>
                                            navigate("/prescription", { state: { patient_data: patient_data, caseManagerData: viewCaseManagerData } })
                                        }
                                    >
                                        <i className="icon-Edit"></i>
                                    </button>
                                    <button className="btn p-0 ms-3" onClick={() => !isChrome && !isSafari ? printInAppContent() : printContent()}>
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
                        {loading ? (
                            <div className='d-flex flex-column justify-content-center' style={{ "height": "calc(100vh - 218px)" }}>
                                <div className='align-items-center text-center'>
                                    <Spin />
                                </div>
                            </div>
                        ) : (
                            <Card.Body className='p-0 cardbody-data'>
                                <div>
                                    <div className='p-3 pb-0'>
                                        {viewCaseManagerData.symptoms.length > 0 && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                                <div>
                                                    <div className='title'>Symptoms</div>
                                                    {viewCaseManagerData.symptoms.map((item, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <span>{item.symptom_name}</span> : <label>{`${item.since && `since ${item.since}${item.severity && ','}`} ${item.severity && `severity ${item.severity}${item.note && ','} `} ${item.note && `${item.note}`}`}</label>{viewCaseManagerData.symptoms.length - 1 != i && ' | '}
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
                                                                <span>{item.tds_name}</span> : <label>{`${item.since && `since ${item.since}${item.status && ','}`} ${item.status && `status ${item.status}${item.note && ','} `} ${item.note && `${item.note}`}`}</label>{viewCaseManagerData.diagnosis.length - 1 != i && ' | '}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {viewCaseManagerData.medicine.length > 0 && (
                                            <div className='d-flex align-items-center'>
                                                <img className='me-2' src={Medicationicon} alt="Medication" />
                                                <div>
                                                    <div className='title'>Medication (Rx)</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {viewCaseManagerData.medicine.length > 0 && (
                                        <div>
                                            <div className='border-top border-bottom mt-2'>
                                                <Table className='table-border patient-medication' columns={columns} dataSource={viewCaseManagerData.medicine} onChange={handleChange} pagination={false} />
                                            </div>
                                        </div>
                                    )}
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
                                        {viewCaseManagerData.visit_advice && (
                                            <div className='d-flex align-items-start mb-4'>
                                                <img className='me-2' src={notesicon} alt="Doctor Note" />
                                                <div>
                                                    <div className='title'>Doctor Note</div>
                                                    <label>{viewCaseManagerData.visit_advice}</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card.Body>
                        )}
                    </>
                ) : (
                    <div className='d-flex flex-column justify-content-center' style={{ "height": "calc(100vh - 118px)" }}>
                        {loading ? (
                            <div className='align-items-center text-center'>
                                <Spin />
                            </div>
                        ) : (
                            <div className='align-items-center text-center'>
                                <img src={calenderBlank} width={57} height={62} alt="No vital & body composition saved for the patient!" />
                                <p className='mt-4 fontroboto'>No any visit found for this patient yet</p>
                                <Button onClick={() =>
                                    navigate("/prescription", { state: { patient_data: patient_data } })
                                } className="btn btn-primary3 btn-text-white px-5 btn-41">Start New Visit</Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default React.memo(Cardiology)