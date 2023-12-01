import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import HeaderPrescription from "../common/HeaderPrescription";
import hey from '../assets/images/bg-hey.png';
import { Col, Dropdown, Row, Select } from "antd";
import { Container } from "react-bootstrap";

// const items = [
//     {
//         label: 'Print Rx',
//         key: 'printrx',
//     },
//     {
//         label: 'Clear',
//         key: 'clear',
//     }
// ];

function PrescriptionPrintView() {
    const navigate = useNavigate();
    return (
        <>
            <HeaderPrescription />
            <div className='w-100 bg-body wrapper2 custom-scroll prescription-wrapper'>
                <img src={hey} alt="Hey" className='me-3 hey' />
                <Container>
                    <Row gutter={{lg: 55 }}>
                        <Col xs={24} sm={24} md={6} lg={6}>
                            <div className="float-end d-flex align-itms-center">
                                <i className="icon-setting me-2"></i>
                                <span className="text-decoration-underline fw-medium"> Configure Print Setting </span>   
                            </div> 
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={18}>
                            <div className="d-flex align-itms-center justify-content-between">
                                <div className="titleprint">Preview</div>  
                                <div className="d-flex align-items-center">
                                    <label>Select Language</label>
                                    {/* <Dropdown className='btn btn-outline btn-more me-2 p-0' menu={{ items }} trigger={['click']}>
                                        English
                                    </Dropdown> */}
                                </div> 
                            </div> 
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default PrescriptionPrintView;
