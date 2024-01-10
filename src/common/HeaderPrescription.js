import React, { useCallback, useState, useContext } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from './ProfilePopover';
import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

import { MESSAGE_KEY } from "../utils/constants";

import { useSelector, useDispatch } from "react-redux";

import {
    addCaseManager,
} from "../redux/caseManagerSlice";

function HeaderPrescription() {

    const {
        loading,
    } = useSelector((state) => state.caseManager);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { patient_data, symptomsData, examinationData, diagnosisData, medicationData, adviceData, investigationData, vitalsData } = useContext(CashManagerContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const items = [
        {
            label: 'Clear',
            key: 'clear',
        },
    ];

    // const languageItems = [
    //     {
    //         label: '1st menu item',
    //         key: '0',
    //     },
    //     {
    //         label: '2nd menu item',
    //         key: '1',
    //     },
    //     {
    //         label: '3rd menu item',
    //         key: '3',
    //     },
    // ];

    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    async function onEndVisitClick() {
        var sendData = {
            action: 'add',
            patient_unique_id: patient_data != undefined ? patient_data.patient_unique_id : 0,
            pam_id: patient_data != undefined ? patient_data.hasOwnProperty('pam_id') ? patient_data.pam_id : 0 : 0,
            consultation_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            symptoms: symptomsData,
            examination: examinationData,
            diagnosis: diagnosisData,
            medicine: medicationData.map(({ medicineUnit, ...rest }) => rest),
            advice: adviceData,
            investigation: investigationData,
            vitals: vitalsData
        }
        const action = await dispatch(addCaseManager(sendData));
        if (action.meta.requestStatus == "fulfilled") {
            navigate('/prescription_print_view', { state: { ...action.payload, ...patient_data } })
        } else {
            message.open({
                MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }
    }

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <div onClick={showHideModal} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                                <CommonModal
                                    isModalOpen={isModalOpen}
                                    onCancel={showHideModal}
                                    modalWidth={500}
                                    title={"You may lose your data"}
                                    modalBody={
                                        <>
                                            <div className="alert-warning rounded-10px p-2 patient-details">
                                                <div className="d-flex align-items-center">
                                                    <img className='me-3' src={alertIcon} alt="Warning" />
                                                    <span>
                                                        Are you sure you want to leave? <br />
                                                        You will permanently lose your data.
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="d-flex align-items-center mt-2 justify-content-end">
                                                    <div onClick={() => navigate(-1)} className="me-4 text-decoration-underline btn p-0 text-main">
                                                        Yes Leave
                                                    </div>
                                                    <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                        <span>No, Stay</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    }
                                />
                            </div>
                            <ProfilePopover patient_data={patient_data} />
                        </div>
                    </Col>
                    <Col lg="auto">
                        <div className='align-items-center d-flex h-100'>
                            {/* <Link className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-template me-2'></i> <span className='text-decoration-underline'>Templates</span>
                            </Link>
                            <Link className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-save me-2'></i> <span className='text-decoration-underline'>Save</span>
                            </Link> */}
                            {/* <Link className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-setting me-2'></i> <span className='text-decoration-underline'>Customize</span>
                            </Link> */}

                            {/* <Dropdown
                                menu={{
                                    items
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()} className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                    <i className='icon-language me-2'></i>
                                    <span className='text-decoration-underline'>English</span>
                                    <i className='icon-right iconrotate270 ms-1'></i>
                                </a>
                            </Dropdown> */}

                            <div onClick={() => window.print()}>
                                <Button className='btn align-items-center d-flex btn-41 btn-input me-20'>
                                    <i className='icon-Print me-2'></i>
                                    Print
                                </Button>
                            </div>

                            <Button className='btn align-items-center d-flex btn-41 btn-primary3 me-20' onClick={onEndVisitClick} loading={loading}>
                                <i className='icon-exit me-2'></i>
                                End Visit
                            </Button>

                            <Dropdown className='btn btn-outline btn-more p-0' menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default React.memo(HeaderPrescription);