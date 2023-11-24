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

function Prescription() {
    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll'>
                <div className="prescription-wrapper">
                    <div className='row'>
                        <div className='col-lg-4 col-md-12 col-12'>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={vitals} alt="vitals" className='me-3' />
                                        <div className="title-common">Vitals & Calculator</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={MedicalHistoryicon} alt="Medical History" className='me-3' />
                                        <div className="title-common">Medical History</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={Lab} alt="Lab Results" className='me-3' />
                                        <div className="title-common">Lab Results</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={VaccinationIcon} alt="Vaccination" className='me-3' />
                                        <div className="title-common">Vaccination</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={notesicon} alt="Notes" className='me-3' />
                                        <div className="title-common">Notes</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src={DocumentIcon} alt="vitals" className='me-3' />
                                        <div className="title-common">Document (0)</div>
                                    </div>
                                    <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Add</span></button></Link>
                                </div>
                            </div>
                            <div>
                                <button className='btn d-flex align-items-center btn-parameters mx-auto'> <i className="icon-Add me-2"></i> Add More Parameters</button>
                            </div>
                        </div>
                        <div className='col-lg-8 col-md-12 col-12'>
                            <div className="prescription-box-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                        <div className="title-common">Symptoms</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Templates</span></button></Link>
                                        <Link to='/'><button className='btn d-flex align-items-center btn-text'> <i className="icon-Add me-2"></i> <span>Save</span></button></Link>
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
            </div>
        </>
    );
}

export default Prescription;
