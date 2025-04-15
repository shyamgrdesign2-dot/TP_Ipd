import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

import HeaderUnlimitedAccess from "../../common/HeaderUnlimitedAccess";
import tatvaEMR from '../../assets/images/logo-tatva-emr.svg'
import growingClinic from '../../assets/images/growing-clinic.svg'
import listIcon from '../../assets/images/list-icon.svg'
import medcoIcon from '../../assets/images/medco-icon.svg'
import "./GetUnlimitedAccess.scss";
import UnlimitedAccessSummary from "./components/UnlimitedAccessSummary";
import AddonAccess from "./components/AddonAccess";

function GetUnlimitedAccess() {
    const [showAll, setShowAll] = useState(false);

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

    return (
        <>
            <HeaderUnlimitedAccess />
            <div className="unlimited-access-wrapper overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
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
                            <AddonAccess />
                        </Col>
                        <Col xl={4} lg={4} sm={5} xs={12}>
                            <UnlimitedAccessSummary />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default GetUnlimitedAccess;
