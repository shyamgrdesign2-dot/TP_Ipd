import React, { useState } from "react";
import { Link } from "react-router-dom";

import yearlyPlan from '../../../assets/images/year-plan-corner.svg'
import upgradedLogo from '../../../assets/images/upgraded-logo.svg'
import medcoAppScanner from '../../../assets/images/scanner-medco-app.svg'
import listIcon from '../../../assets/images/list-icon.svg'
import aiPowered from '../../../assets/images/ai-powered.svg'
import vaccinationImg from "../../../assets/images/Vaccination.svg";

import "../GetUnlimitedAccess.scss";
import { Dropdown, Card, Modal } from "antd";
import { Button, Col, Row } from "react-bootstrap";
import { DownOutlined } from '@ant-design/icons'
import Slider from "react-slick";

function UnlimitedAccessSummary() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const items = [
        {
            label: '1 Year',
            key: '0',
        },
        {
            label: '2 Years',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3 Years',
            key: '3',
        },
    ];

    const settings = {
        infinite: true,
        speed: 500,
        dots: true,
        arrows: true,
        adaptiveHeight: false,
        autoplay: false,
    };

    return (
        <>
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

                <Button className="btn btn-proceed btn-primary3 my-4" onClick={showModal}>
                    Proceed to Pay ₹13,998
                </Button>
                <div className="text-center">
                    <Link className="text-decoration-underline fw-medium text-primary">Have a sales referral code?</Link>
                </div>
            </div>
            <Modal
                open={isModalOpen}
                closeIcon={false}
                footer={null}
                width={750}
                onCancel={handleCancel}
                className="upgraded-model"
                destroyOnClose>
                <Card
                    extra={
                        <button className="btn p-1 lh-1 btnclose closeButton" onClick={handleCancel}>
                            <i className="icon-Cross"></i>
                        </button>
                    }>
                    <>
                        <img src={upgradedLogo} alt="upgraded to premium" />
                        <div className="fs-2 fw-bold mt-3">
                            You have upgraded to premium
                        </div>
                        <div className="mt-3"> Here’s what’s now available to you.</div>
                        <Slider
                            {...settings}
                            slidesToShow={1}>
                            <div className='upgraded-premium-box w-92'>
                                <Row>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">OPD Management</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Digital Rx Delivery</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Appointment Management</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Automated Follow-up Remainder</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Comprehnsive Patient Record</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Dedicated Support</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Specialised Rx Pad</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Appointment scheduling </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Button className="btn btn-proceed btn-primary3 w-100 mt-4">
                                    Start Exploring
                                </Button>
                            </div>
                            <div className='upgraded-premium-box w-92'>
                                <Row>
                                    <Col lg={6}>
                                        <div className="py-3 upgrade-addon-box">
                                            <div>
                                                <div className="fs-18 d-flex align-items-center text-welcome fw-semibold my-2 text-truncate">
                                                    <img style={{ background: '#EDD6FF' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                                    Voice Rx
                                                    <img className="ms-3" src={aiPowered} alt="Icon" />
                                                </div>
                                                <div className="text-start">
                                                    AI-powered Voice Rx generation for seamless patient care
                                                </div>
                                            </div>
                                            <Button className="btn btn-outline-primary w-100 mt-4 mb-3">
                                                Know more
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="py-3 upgrade-addon-box">
                                            <div className="fs-18 d-flex align-items-center text-welcome fw-semibold my-2 text-truncate">
                                                <img style={{ background: '#EDD6FF' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                                Ask Tatva
                                                <img className="ms-3" src={aiPowered} alt="Icon" />
                                            </div>
                                            <div className="text-start">
                                                Access reliable AI-driven medical insights from PubMed
                                            </div>
                                            <Button className="btn btn-outline-primary w-100 mt-4 mb-3">
                                                Know more
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='upgraded-premium-box w-92'>
                                <div className="w-75 mx-auto px-3">
                                    <div className="fs-18 fw-semibold"> Scan the Below QR to Download MedEco App</div>
                                    <img className="mx-auto my-4" src={medcoAppScanner} alt="Medco App QR Code" />
                                    <div>Enhance your clinical practice and stay updated with the latest medical insights. <Link className="text-decoration-underline fw-medium text-primary">Know More</Link></div>
                                </div>
                            </div>
                        </Slider>
                    </>
                </Card>
            </Modal>
        </>
    );
}

export default UnlimitedAccessSummary;
