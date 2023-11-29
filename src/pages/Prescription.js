import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { AutoComplete, Input, Button, Row, Col, Select, Popover, Space } from 'antd';

import vitals from '../assets/images/Vitals.svg';
import HeaderPrescription from "../common/HeaderPrescription";
import MedicalHistoryicon from '../assets/images/Medical-History.svg';
import VaccinationIcon from '../assets/images/Vaccination.svg';
import notesicon from '../assets/images/notes.svg';
import Lab from '../assets/images/Lab.svg';
import DocumentIcon from '../assets/images/Document.svg';
import Symptomsicon from '../assets/images/Symptoms.svg';
import Examinationsicon from '../assets/images/Examination.svg';
import Diagnosisicon from '../assets/images/Diagnosis.svg';
import Medicationicon from '../assets/images/Medication.svg';
import hey from '../assets/images/bg-hey.png';

const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
});

const onChange = (value) => {
    console.log(`selected ${value}`);
};
const onSearch = (value) => {
    console.log('search:', value);
};
const severityList = [
    { value: 'severe', label: 'Severe' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'mild', label: 'Mild' },
];

const content = (
    <>
        <div className="align-items-center d-flex justify-content-between pop-header border-bottom">
            <div className="title-common">Medicine Templates</div>
            <Button className="btn btn-delete-prescription p-0"><i className="icon-Cross"></i></Button>
        </div>
        <div className="pop-body">
            <div className="align-items-center d-flex justify-content-between medicine-templates">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
            </div>
            <div className="align-items-center d-flex justify-content-between medicine-templates">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
            </div>
            <div className="align-items-center d-flex justify-content-between medicine-templates">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
            </div>
            <div className="align-items-center d-flex justify-content-between medicine-templates">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
            </div>
            <div className="align-items-center d-flex justify-content-between medicine-templates">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
                <Button className="btn btn-delete-prescription p-0 ms-3"><i className="icon-delete"></i></Button>
            </div>
        </div>
    </>
);

function Prescription() {
    // For Symptoms Autocomplete
    const onSelect = (data) => {
        console.log('onSelect', data);
    };
    const [value, setValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState('');
    const [options, setOptions] = useState([{
        label: (
            'FREQUENTLY USED'
        )
    }]);
    const onSearch = (data) => {
        setValue(data);
        console.log('onSearch', data);
        if (data.length > 0) {
            const array = [
                { id: 1, name: 'Chest Pain' },
                { id: 2, name: 'Chest Discomfort' },
                { id: 3, name: 'Snoring' },
                { id: 4, name: 'Anxiety' },
                { id: 5, name: 'High blood pressure' },
                { id: 6, name: 'Heartburn' },
                { id: -1 }
            ]
            array.map(e => {
                if (e.id != -1) {
                    options.push({
                        value: e.name,
                        label: (
                            <>
                                {e.name}
                            </>
                        )
                    })
                }
            })
        }
        setOptions(prev => [...prev])
    };

    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper'>
                <img src={hey} alt="vitals" className='me-3 hey' />
                <div className='row'>
                    <div className='col-lg-4 col-md-12 col-12'>
                        <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={vitals} alt="vitals" className='me-3' />
                                    <div className="title-common">Vitals & Calculator</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        {/* <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={MedicalHistoryicon} alt="Medical History" className='me-3' />
                                    <div className="title-common">Medical History</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={Lab} alt="Lab Results" className='me-3' />
                                    <div className="title-common">Lab Results</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={VaccinationIcon} alt="Vaccination" className='me-3' />
                                    <div className="title-common">Vaccination</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={notesicon} alt="Notes" className='me-3' />
                                    <div className="title-common">Notes</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm p-14">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={DocumentIcon} alt="vitals" className='me-3' />
                                    <div className="title-common">Document (0)</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div> */}
                        <div>
                            <button className='btn btn-parameters mx-auto w-100'>
                                <div className="align-items-center d-flex justify-content-center"><i className="icon-Add me-2"></i> Add More Parameters</div>
                            </button>
                        </div>
                    </div>
                    <div className='col-lg-8 col-md-12 col-12 mt-lg-0 mt-3'>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between p-14-pb0">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                    <div className="title-common">Symptoms</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button>
                                    <Popover content={content} trigger="click" overlayClassName="pop-350 pp-0" placement="bottom">
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button>
                                    </Popover>
                                    <Popover content={content} trigger="click" overlayClassName="pop-350 pp-0" placement="bottom">
                                        <button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button>
                                    </Popover>
                                </div>
                            </div>
                            <Row gutter={[0]} className="align-items-center border-bottom border-top mt-14">
                                <Col lg={7} md={7} sm={7} xs={7} className="border-end">
                                    <div className="p-2 fontroboto fw-medium">Chest Pain</div>
                                </Col>
                                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                    <AutoComplete
                                        options={options}
                                        className='autocomplete-custom w-100 inputborder'
                                        onSelect={onSelect}
                                        onSearch={onSearch}
                                        bordered={false}
                                        placeholder="Since"
                                    >
                                    </AutoComplete>
                                </Col>
                                <Col lg={4} md={4} sm={4} xs={4} className="border-end">
                                    <Select
                                        showSearch
                                        className='autocomplete-custom w-100 inputborder'
                                        placeholder="Severity"
                                        onChange={onChange}
                                        onSearch={onSearch}
                                        options={severityList}
                                    />
                                </Col>
                                <Col lg={8} md={8} sm={7} xs={7} className="border-end">
                                    <Input className="notesinput border-0" placeholder="Notes" />
                                </Col>
                                <Col lg={1} md={1} sm={2} xs={2} className="text-center">
                                    <Button className="btn py-0 btn-delete-prescription px-0">
                                        <i className="icon-delete"></i>
                                    </Button>
                                </Col>
                            </Row>

                            <Form className="p-14">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <AutoComplete
                                        options={options}
                                        className='autocomplete-custom w-100'
                                        onSelect={onSelect}
                                        onSearch={onSearch}
                                    >
                                        <Input
                                            placeholder="Search by Patient’s Name, Phone number or Id"
                                            prefix={<i className='icon-search'></i>}
                                            suffix={value.length > 0 && <i className='icon-Cross' onClick={() => setValue('')}></i>}
                                        />
                                    </AutoComplete>
                                </Form.Group>
                            </Form>
                        </div>
                        {/* <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Examinationsicon} alt="Examinations" />
                                    <div className="title-common">Examinations</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                </div>
                            </div>
                            <Form className="mt-2">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Control type="email" placeholder="Search by patient name" />
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Diagnosisicon} alt="Diagnosis" />
                                    <div className="title-common">Diagnosis</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                </div>
                            </div>
                            <Form className="mt-2">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Control type="email" placeholder="Search by patient name" />
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Medicationicon} alt="Medication" />
                                    <div className="title-common">Medication (Rx)</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-template me-2"></i> <span>Templates</span></button></Link>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-save me-2"></i> <span>Save</span></button></Link>
                                </div>
                            </div>
                            <Form className="mt-2">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Control type="email" placeholder="Search by patient name" />
                                </Form.Group>
                            </Form>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Prescription;
