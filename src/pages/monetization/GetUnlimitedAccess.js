import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

import HeaderUnlimitedAccess from "../../common/HeaderUnlimitedAccess";
import tatvaEMR from '../../assets/images/logo-tatva-emr.svg'
import growingClinic from '../../assets/images/growing-clinic.svg'
import listIcon from '../../assets/images/list-icon.svg'
import medcoIcon from '../../assets/images/medco-icon.svg'
import yearlyPlan from '../../assets/images/year-plan-corner.svg'
import aiPowered from '../../assets/images/ai-powered.svg'
import vaccinationImg from "../../assets/images/Vaccination.svg";
import "./GetUnlimitedAccess.scss";
import { Dropdown, Button } from "antd";
import { DownOutlined } from '@ant-design/icons'

function GetUnlimitedAccess() {
    const [showAll, setShowAll] = useState(false);
    const [add, setAdd] = useState(null);

    const features = [
        "OPD Management",
        "Personalised Website",
        "Appointment Management",
        "Automated Follow up Remainder",
        "Comprehensive Patient Record",
        "Dedicated Support",
        "Specialised Rx Pad",
        "Appointment scheduling",
        "In-Depth Practice Insights",
        "Treatment Effectiveness",
        "Digital Rx Delivery",
        "Google My Business Optimisation",
    ];

    const visibleFeatures = showAll ? features : features.slice(0, 6);

    const items = [
        {
            label: '1st menu item',
            key: '0',
        },
        {
            label: '2nd menu item',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    const handleAdd = () => {
        setAdd(!add)
    }

    return (
        <>
            <HeaderUnlimitedAccess />
            <div className="unlimited-access-wrapper overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                <div className="flat-20">
                    🎉<span>&nbsp;Flat 20% off</span>&nbsp;on EMR—limited time offer!&nbsp;&nbsp;
                    <div className="rounded-pill px-2 py-1">02 Days : 08 Hours : 24 Min ⏳ </div>
                </div>
                <div className="bg-unlimited-access">
                    <Row className="g-4">
                        <Col xl={8} lg={8} sm={7} xs={12}>
                            <div className="unlimited-access-price text-center">
                                <img src={tatvaEMR} alt='EMR Icon' />
                                <div className="text-price fs-2 fw-semibold mt-4">TatvaPractice EMR</div>
                                <div className="d-flex align-items-end justify-content-center mt-4">
                                    <div className="fs-18 text-black-50 text-decoration-line-through me-2">₹12,999</div>
                                    <div className="fw-semibold text-price lh-1" style={{ fontSize: 36 }}>₹9,999</div>
                                    <div className="text-price fs-4">/year</div>
                                    <div className="access-off px-3 py-1 ms-3 rounded-pill fw-semibold fs-18 text-white">20% off</div>
                                </div>
                                <div className="d-flex align-items-end justify-content-center mt-4">
                                    <div className="text-black-50">Everything for a</div>
                                    <div className="fw-medium text-secondary-custom"><img className="mx-2" src={growingClinic} alt="Growing clinic" />Growing clinic</div>
                                </div>
                                <div className={`${!isMobile ? 'px-75px' : 'px-0'}`}>
                                    <Row className="my-4">
                                        {visibleFeatures.map((feature, index) => (
                                            <Col lg={6} className="py-3" key={index}>
                                                <div className="d-flex align-items-center">
                                                    <img className="mx-2" src={listIcon} alt="icon" />
                                                    <div className="fs-14 fw-medium text-price text-start">{feature}</div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                    {showAll &&
                                        <div className="medco-app my-4">
                                            <img className="me-3" src={medcoIcon} alt="Medco Icon" />
                                            <div className="text-start">
                                                <div className="fw-bold">Get the MedEco Doctor App free with EMR</div>
                                                <div className="fs-14">Enhance your clinical practice and stay updated with the latest medical insights. <Link className="text-decoration-underline fw-medium text-primary">Know More</Link></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="text-primary fw-medium cursor-pointer d-inline text-decoration-underline" onClick={() => setShowAll(!showAll)}> {showAll ? 'View less' : 'View 8 More Features'}</div>
                            </div>
                            <div className="addon-access mt-2 mb-3">
                                <div className={`addon-box ${add && 'box-added'}`}>
                                    <div className="tag-recommend">Recommend</div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="fs-4 text-welcome fw-semibold my-2"><img style={{ background: '#EDDFF780' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" /> Voice Rx <img className="mx-2" src={aiPowered} alt="AI Powered" /></div>
                                            <div>
                                                <div className="fs-14">AI-powered Voice Rx generation for seamless patient care <Link className="text-decoration-underline fw-medium text-main">Know more</Link></div>
                                            </div>
                                        </div>
                                        <div className="addon-box-price mx-4">
                                            <div className="d-flex align-items-end">
                                                <div className="fw-semibold text-price lh-1 fs-4">₹3,999</div>
                                                <div className="text-price fs-18">/year</div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-1">
                                                <div className="text-black-50 text-decoration-line-through me-2">₹8,999</div>
                                                <div className="access-off px-2 py-1 rounded-pill fw-semibold fs-12-1 text-white">20% off</div>
                                            </div>
                                        </div>
                                        <div>
                                            <Button className={`btn d-flex rounded-10px align-items-center justify-content-center ms-4 ${!add ? 'btn-addon' : 'btn-added'}`} onClick={handleAdd}>
                                                <i className={`me-2 ${!add ? 'icon-Add fs-18 ' : 'fs-4 icon-check'}`}></i> {!add ? 'Add' : 'Added'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className={`addon-box ${add && 'box-added'}`}>
                                    <div className="tag-recommend">Recommend</div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="fs-4 text-welcome fw-semibold my-2"><img style={{ background: '#EDDFF780' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" /> Smart Sync Pro </div>
                                            <div>
                                                <div className="fs-14">Write naturally, with real-time view in your device <Link className="text-decoration-underline fw-medium text-main">Know more</Link></div>
                                            </div>
                                        </div>
                                        <div className="addon-box-price mx-4">
                                            <div className="d-flex align-items-end">
                                                <div className="fw-semibold text-price lh-1 fs-4">₹23,999</div>
                                                <div className="text-price fs-18">/year</div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mt-1">
                                                <div className="text-black-50 text-decoration-line-through me-2">₹28,999</div>
                                                <div className="access-off px-2 py-1 rounded-pill fw-semibold fs-12-1 text-white">20% off</div>
                                            </div>
                                        </div>
                                        <div>
                                            <Button className={`btn d-flex rounded-10px align-items-center justify-content-center ms-4 ${!add ? 'btn-addon' : 'btn-added'}`} onClick={handleAdd}>
                                                <i className={`me-2 ${!add ? 'icon-Add fs-18 ' : 'fs-4 icon-check'}`}></i> {!add ? 'Add' : 'Added'}
                                            </Button>
                                        </div>
                                    </div>
                                    {/* <div className="includes-box mt-5">
                                        
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                        <Col xl={4} lg={4} sm={5} xs={12}>
                            <div className="unlimited-access-summary ">
                                <div className="fs-4 fw-semibold">Summary</div>
                                <div className="d-flex justify-content-between my-4">
                                    <div className="fs-18">TatvaPractice EMR:
                                        <div className="d-flex align-items-baseline">
                                            <img className="ms-1" src={yearlyPlan} alt="icon" />
                                            <div className="d-flex align-items-center">
                                                <Dropdown menu={{ items }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                                    <a onClick={e => e.preventDefault()}>
                                                        1 Year
                                                        <DownOutlined className="ps-2 fs-14 fw-medium text-primary" />
                                                    </a>
                                                </Dropdown>
                                                <i className="icon-info fs-6 text-black-50 ms-2"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fs-18 fw-medium">₹12,999</div>
                                </div>
                                <div className="d-flex justify-content-between my-4">
                                    <div className="fs-18">Ask Tatva (Addon):
                                        <div className="d-flex align-items-baseline">
                                            <img className="ms-1" src={yearlyPlan} alt="icon" />
                                            <div className="d-flex align-items-center">
                                                <Dropdown menu={{ items }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                                    <a onClick={e => e.preventDefault()}>
                                                        1 Year
                                                        <DownOutlined className="ps-2 fs-14 fw-medium text-primary" />
                                                    </a>
                                                </Dropdown>
                                                <i className="icon-info fs-6 text-black-50 ms-2"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fs-18 fw-medium">₹8,999</div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between my-3">
                                    <div className="fs-18">Subtotal:</div>
                                    <div className="fs-18 fw-medium">₹21,998</div>
                                </div>
                                <div className="d-flex justify-content-between my-3">
                                    <div className="fs-18">Flat Discount:</div>
                                    <div className="fs-18 fw-medium text-discount">-₹8,000</div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between my-3">
                                    <div className="fs-4 text-welcome fw-semibold">Total Amount :</div>
                                    <div className="fs-4 text-welcome fw-semibold">₹13,998</div>
                                </div>

                                <Button className="btn btn-proceed btn-primary3 my-4">
                                    Proceed to Pay ₹13,998
                                </Button>
                                <div className="text-center">
                                    <Link className="text-decoration-underline fw-medium text-primary">Have a sales referral code?</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default GetUnlimitedAccess;
