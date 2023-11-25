import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form} from 'react-bootstrap';

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

function Prescription() {
    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper'>
                <img src={hey} alt="vitals" className='me-3 hey' />
                <div className='row'>
                    <div className='col-lg-4 col-md-12 col-12'>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={vitals} alt="vitals" className='me-3' />
                                    <div className="title-common">Vitals & Calculator</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={MedicalHistoryicon} alt="Medical History" className='me-3' />
                                    <div className="title-common">Medical History</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={Lab} alt="Lab Results" className='me-3' />
                                    <div className="title-common">Lab Results</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={VaccinationIcon} alt="Vaccination" className='me-3' />
                                    <div className="title-common">Vaccination</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={notesicon} alt="Notes" className='me-3' />
                                    <div className="title-common">Notes</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={DocumentIcon} alt="vitals" className='me-3' />
                                    <div className="title-common">Document (0)</div>
                                </div>
                                <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-1 fs-5"></i> <span>Add</span></button></Link>
                            </div>
                        </div>
                        <div>
                            <button className='btn btn-parameters mx-auto w-100'> 
                                <div className="align-items-center d-flex justify-content-center"><i className="icon-Add me-2"></i> Add More Parameters</div>
                            </button>
                        </div>
                    </div>
                    <div className='col-lg-8 col-md-12 col-12 mt-lg-0 mt-3'>
                        <div className="prescription-box-sm">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                    <div className="title-common">Symptoms</div>
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
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-reload me-2"></i> <span>Load Prev. Rx</span></button></Link>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Prescription;
