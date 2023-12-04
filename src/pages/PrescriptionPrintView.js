import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import HeaderPrescription from "../common/HeaderPrescription";
import hey from '../assets/images/bg-hey.png';
import { Col, Dropdown, Row, Select, Button } from "antd";
import { Container } from "react-bootstrap";
import CareClinicPrint from "../prints/CareClinicPrint";

const items = [
    {
        label: 'Print Rx',
        key: 'printrx',
    },
    {
        label: 'Clear',
        key: 'clear',
    }
];

function PrescriptionPrintView() {
    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper'>
                <br />
                <img src={hey} alt="Hey" className='me-3 hey' />
                <Container>
                    <Row gutter={{ lg: 55 }} className="align-items-center">
                        <Col xs={24} sm={24} md={7} lg={7}>
                            <div className="float-end d-flex align-itms-center">
                                <i className="icon-setting me-2"></i>
                                <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={17} lg={17}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>
                                <div className="d-flex align-items-center">
                                    <label className="fontroboto">Select Language</label>
                                    <Select placeholder="English" className='mx-2 appointmentselect '
                                        options={[
                                            {
                                                value: 'english',
                                                label: 'English',
                                            },
                                            {
                                                value: 'hindi',
                                                label: 'Hindi',
                                            },
                                            {
                                                value: 'gujarati',
                                                label: 'Gujarati',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={{ lg: 55 }}>
                        <Col xs={24} sm={24} md={7} lg={7}>
                            <div className="border rounded-20px p-20 bg-white mt-20">
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-Print"></i>}
                                >
                                    <span className="fw-semibold">View Patient Details</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-billings"></i>}
                                >
                                    <span className="fw-semibold">Create Bill</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-download"></i>}
                                >
                                    <span className="fw-semibold">Download</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex btn-41 w-100"
                                    icon={<i className="icon-Edit"></i>}
                                >
                                    <span className="fw-semibold">Edit Prescription</span>
                                    <i className="icon-right iconrotate90 ms-auto"></i>
                                </Button>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={17} lg={17}>
                            <div className="border rounded-20px p-20 bg-white mt-20">
                                <CareClinicPrint />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default PrescriptionPrintView;
