import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Drawer, Input } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import CommonModal from '../common/CommonModal';
import { useNavigate, useLocation } from 'react-router-dom';
import JoditEditor from 'jodit-react';

import { useSelector, useDispatch } from "react-redux";

import alertIcon from '../assets/images/alertIcon.svg';
import CreateCertificate from "../components/medical_certificate/CreateCertificate";
import { HTMLTransformer, removeLabelTags } from "../utils/utils";


function MedicalCertificate() {

    const navigate = useNavigate();

    const { profile, single_appointment_data } = useSelector((state) => state.doctors);

    const { state } = useLocation();
    const { certificate_data } = state != null && state;

    const editor = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);

    const TOOLBAR = [
        'undo', 'redo', '|', 'ul', 'ol', 'align', 'fontsize', '|', 'bold', 'italic', 'underline', '|', 'source', '|',
        {
            name: 'Insert',
            // iconURL: 'https://img.icons8.com/ios-glyphs/30/000000/menu.png',
            list: {
                option1: `Doctor Name`,
                option2: `Patient Name`,
                option3: `Patient Age`,
                option4: `Patient's Mobile No.`,
                option5: `Gender`,
                option6: `Today's Date`,
                option7: `Custom Date`,
                option8: `Add Text Input`,
                option9: `Email`,
            },

            exec: (editor, current, options, originalEvent, btn) => {
                const selectedOption = options.control.name;
                const content = options.originalEvent.target.textContent;
                if (selectedOption === 'option1') {
                    editor.s.insertHTML(`<label class="consulting_doctor">${profile?.um_name}</label>`);
                } else if (selectedOption === 'option2') {
                    editor.s.insertHTML(`<label class="patient_name">${single_appointment_data?.pm_fullname}</label>`);
                } else if (selectedOption === 'option3') {
                    editor.s.insertHTML(`<label class="age">${single_appointment_data?.ageYears} Y, ${single_appointment_data?.ageMonths} M</label>`);
                } else if (selectedOption === 'option4') {
                    editor.s.insertHTML(`<label class="contact_number">${single_appointment_data?.pm_contact_no}</label>`);
                } else if (selectedOption === 'option5') {
                    editor.s.insertHTML(`<label class="gender">${single_appointment_data?.pm_gender}</label>`);
                } else if (selectedOption === 'option6') {
                    editor.s.insertHTML(`<label>${content}</label>`);
                } else if (selectedOption === 'option7') {
                    editor.s.insertHTML(`<input type="date" />`);
                } else if (selectedOption === 'option8') {
                    editor.s.insertHTML(`<input type="search" />`);
                } else if (selectedOption === 'option9') {
                    editor.s.insertHTML(`<label class="email">${content}</label>`);
                }
            }
        }
    ]

    const config = {
        statusbar: false,
        placeholder: 'Write Description...',
        buttons: TOOLBAR,
        buttonsSM: TOOLBAR,
        buttonsMD: TOOLBAR,
        buttonsXS: TOOLBAR,
    };

    useEffect(() => {
        if (certificate_data !== undefined) {
            setTitle(certificate_data?.title);
            setContent(certificate_data?.content);
            if (certificate_data?.content?.length > 0) {
                config.placeholder = ''
            }
        }
    }, [certificate_data]);

    const handleCreateCertificateDrawer = useCallback(() => {
        setCreateCertificateDrawer(!createCertificateDrawer)
    }, [createCertificateDrawer]);

    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);

    const onTitleChange = useCallback((e) => {
        setTitle(e.target.value);
    }, [title]);

    return (
        <div>
            <Navbar className="justify-content-between headerprescription p-0 bg-white">
                <Container fluid className='h-100 gx-0 w-100'>
                    <Row className='h-100 align-items-center w-100 justify-content-between'>
                        <Col lg="auto" className='h-100'>
                            <div className='align-items-center d-flex h-100'>
                                <div className='border-end h-100 text-center me-3'>
                                    <div onClick={showHideBackModal} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                        <i className='icon-right'></i>
                                    </div>
                                    <CommonModal
                                        isModalOpen={isBackModalOpen}
                                        onCancel={showHideBackModal}
                                        modalWidth={500}
                                        title={"Discard Changes"}
                                        modalBody={
                                            <>
                                                <div className="alert-warning rounded-10px p-2 patient-details">
                                                    <div className="d-flex align-items-center">
                                                        <img className='me-3' src={alertIcon} alt="Warning" />
                                                        <span>
                                                            Are you sure you want to discard the changes you made?
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="d-flex align-items-center mt-2 justify-content-end">
                                                        <div onClick={() => navigate('/', { replace: true })} className="me-4 text-decoration-underline btn p-0 text-main">
                                                            <span>Yes, Discard</span>
                                                        </div>
                                                        <Button onClick={showHideBackModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                            <span>No, Stay</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                </div>
                                {certificate_data !== undefined ? (
                                    <div className="d-flex align-items-center py-3 cursor-pointer">
                                        <div className="bg-fitness me-3">
                                            {title[0]}
                                        </div>
                                        <div>
                                            <div className="title-common">
                                                {title}
                                            </div>
                                            <div onClick={handleCreateCertificateDrawer} className="d-flex align-items-center text-2 text-primary">Change Template <i className="fs-16 icon-right iconrotate270"></i></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-3 fw-medium">
                                        {'Create Certificate'}
                                    </div>
                                )}

                            </div>
                        </Col>
                        <Col lg="auto">
                            <div className='align-items-center d-flex h-100'>
                                <Button className="btn btn-41 btn-primary3" >{certificate_data !== undefined ? 'Continue' : 'Save & Continue'}</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
            <div className="bg-body p-3" style={{ height: 'calc(100vh - 60px)' }}>
                <Input allowClear className="popinput mb-3" onChange={onTitleChange} value={title} placeholder="Certificate Title" />
                <JoditEditor
                    ref={editor}
                    value={content
                        .replace(/{Consulting Doctor}/g, `<label class="consulting_doctor">${profile?.um_name}</label>`)
                        .replace(/{Patient Name}/g, `<label class="patient_name">${single_appointment_data?.pm_fullname}</label>`)
                        .replace(/{Age}/g, `<label class="age">${single_appointment_data?.ageYears}Y, ${single_appointment_data?.ageMonths}M</label>`)
                        .replace(/{Contact Number}/g, `<label class="contact_number">${single_appointment_data?.pm_contact_no}</label>`)
                        .replace(/{Gender}/g, `<label class="gender">${single_appointment_data?.pm_gender}</label>`)
                        .replace(/{Email}/g, `<label class="email">${single_appointment_data?.pm_email?single_appointment_data?.pm_email:'Email'}</label>`)
                        .replace(/{Patient ID}/g, `<label class="patient_id">${single_appointment_data?.pm_pid}</label>`)
                        .replace(/{Address}/g, `<label class="address">${single_appointment_data?.patient_address?single_appointment_data?.patient_address:'Address'}</label>`)
                        .replace(/{Blood Group}/g, `<label class="blood_group">${single_appointment_data?.pm_blood_group?single_appointment_data?.pm_blood_group:'Blood Group'}</label>`)
                        .replace(/{Date of Birth}/g, `<label class="date_of_birth">${single_appointment_data?.DOB}</label>`)
                        .replace(/{Department}/g, `<label class="department">${profile?.dp_name}</label>`)
                        .replace(/{Referred by}/g, `<label class="referred_by">Referred by</label>`)
                        .replace(/{Case Type}/g, `<label class="case_type">Case Type</label>`)
                        .replace(/{Last appointment}/g, `<label class="last_appointment">Last appointment</label>`)
                        .replace(/{Inpatient Number}/g, `<label class="inpatient_number">Inpatient Number</label>`)
                        .replace(/{Ward}/g, `<label class="ward">Ward</label>`)
                        .replace(/{Room\/Bed}/g, `<label class="room_bed">Room/Bed</label>`)
                        .replace(/{Admitting Doctor}/g, `<label class="admitting_doctor">Admitting Doctor</label>`)
                        .replace(/{Admitting Date}/g, `<label class="admitting_date">Admitting Date</label>`)
                        .replace(/{Admitting Time}/g, `<label class="admitting_time">Admitting Time</label>`)
                        .replace(/{Discharge Date}/g, `<label class="discharge_date">Discharge Date</label>`)
                        .replace(/{Discharge Time}/g, `<label class="discharge_time">Discharge Time</label>`)
                        .replace(/{Admitted Days}/g, `<label class="admitted_days">Admitted Days</label>`)
                        .replace(/{Admission Diagnosis}/g, `<label class="admission_diagnosis">Admission Diagnosis</label>`)
                        .replace(/{Discharge Diagnosis}/g, `<label class="discharge_diagnosis">Discharge Diagnosis</label>`)
                        .replace(/{Resident of}/g, `<label class="resident_of">Resident of</label>`)
                        .replace(/{Start Date}/g, `<label class="start_date">Start Date</label>`)
                        .replace(/{End Date}/g, `<label class="end_date">End Date</label>`)
                        .replace(/{Join Date}/g, `<label class="join_date">Join Date</label>`)
                        .replace(/{Diagnosis}/g, `<label class="diagnosis">Diagnosis</label>`)
                        .replace(/{Time}/g, `<label class="time">Time</label>`)
                        .replace(/{Travel From}/g, `<label class="travel_from">Travel From</label>`)
                        .replace(/{Travel To}/g, `<label class="travel_to">Travel To</label>`)
                        .replace(/{Photo ID card No}/g, `<label class="photo_id_card_no">Photo ID card No</label>`)
                        .replace(/{Nationality}/g, `<label class="nationality">Nationality</label>`)
                        .replace(/{Passport Number}/g, `<label class="passport_number">Passport Number</label>`)
                        .replace(/{Procedure}/g, `<label class="procedure">Procedure</label>`)
                        .replace(/{Number of Months}/g, `<label class="number_of_months">Number of Months</label>`)
                    }
                    config={config}
                // tabIndex={1} // tabIndex of textarea
                // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                // onChange={newContent => onChange(newContent)}
                />
                <div>
                    <h3>Editor Content:{content}</h3>

                    <h4>Make Content:{HTMLTransformer(content)}</h4>

                    <h4>Mayank Content: {removeLabelTags(HTMLTransformer(content))}</h4>

                    {/* <div dangerouslySetInnerHTML={{ __html: HTMLTransformer(content) }} /> */}
                </div>
            </div>
            <Drawer
                className="modalWidth-563" width="auto"
                title="Create Certificate"
                placement="right"
                closable
                open={createCertificateDrawer}
                onClose={handleCreateCertificateDrawer}
                key="left"
            >
                <CreateCertificate handleCreateCertificateDrawer={handleCreateCertificateDrawer} replace={true} selectedTemplate={certificate_data !== undefined ? certificate_data?.id : 0} />
            </Drawer>
        </div>
    )
}
export default MedicalCertificate;
