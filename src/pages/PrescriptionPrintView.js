import React from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Row, Select, Button } from "antd";
import { isMobile } from "react-device-detect";

import messageSent from '../assets/images/message-sent.svg';
import HeaderPrescriptionPrint from "../common/HeaderPrescriptionPrint";


function PrescriptionPrintView() {
    
    const navigate = useNavigate();
    
    return (
        <>
            <HeaderPrescriptionPrint />
            <div className={`${isMobile ? 'p-0' : ''} w-100 bg-body wrapper2 custom-scroll prescription-wrapper`}>
                {/* <img src={hey} alt="Hey" className='me-3 hey' /> */}
                <Row gutter={{ xl: 40, lg: 0 }} justify="center">
                    <Col md={7} lg={7} xl={5}>

                        {isMobile ? '' : <div className="d-flex align-items-center justify-content-end h-38 " style={{visibility: 'hidden'}}>
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>
                        </div>
                        }
                        <div className={`${!isMobile ? 'rounded-20px mt-20' : 'border-top-0 border-start-0 border-bottom-0'} border p-20 bg-white d-flex justify-content-between flex-column`}
                            style={{ height: !isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 60px)' }}>
                            <div>
                                {!isMobile ? '' : <div className="d-flex align-items-center mb-14 h-38" style={{visibility: 'hidden'}}>
                                    <i className="icon-setting me-2"></i>
                                    <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>
                                </div>
                                }
                                <Button
                                    type="text"
                                    className="btn btn-input btnicon20 align-items-center d-flex mb-3 btn-41 w-100"
                                    icon={<i className="icon-Print"></i>}
                                >
                                    <span className="fw-semibold">Print</span>
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
                            <div className="bg-body d-flex p-3 rounded-10px border" style={{visibility: 'hidden'}}>
                                <img src={messageSent} alt="whatsapp Message" className='align-self-baseline me-3' />
                                <div className="fontroboto title-common">
                                    <div className="fw-normal fontroboto mb-2">WhatsApp & SMS Sent to </div>
                                    +91 7894561230
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={17} lg={17} xl={12}>
                        <div className={isMobile ? 'p-20' : ''}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>
                                <div className="d-flex align-items-center">
                                    <label className="fontroboto">Select Language</label>
                                    <Select placeholder="English" className='ms-3 appointmentselect '
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
                            <div className="border rounded-20px p-20 pe-1 bg-white mt-20">

                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default PrescriptionPrintView;
