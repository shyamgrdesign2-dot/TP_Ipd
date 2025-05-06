import React from "react";
import { Card, Modal } from "antd";
import { Button, Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import upgradedLogo from '../../../assets/images/upgraded-logo.svg'
import medcoIcon from "../../../assets/images/medco-icon.svg";
import listIcon from '../../../assets/images/list-icon.svg'
import aiPowered from '../../../assets/images/ai-powered.svg'
import vaccinationImg from "../../../assets/images/Vaccination.svg";
import iconEdit from "../../../assets/images/edit.svg";
import { S_TATVA_PRACTICE } from "../../../utils/constants";
import { QRCodeSVG } from "qrcode.react";

function UpgradeServicesModal({ isUpgradeModal, handleUpgradeModal }) {

    const { servicesList } = useSelector((state) => state.doctors);
    const EMR_PlanDetails = servicesList?.find(e => e.service_name === S_TATVA_PRACTICE)
    const purchasedData = servicesList?.filter(e => e.service_name !== S_TATVA_PRACTICE && e.purchased === 'true')

    const settings = {
        infinite: true,
        speed: 500,
        dots: true,
        arrows: true,
        adaptiveHeight: false,
        autoplay: false,
    };

    return (
        <Modal
            open={isUpgradeModal}
            closeIcon={false}
            footer={null}
            width={750}
            onCancel={handleUpgradeModal}
            className="upgraded-model"
            destroyOnClose>
            <Card
                extra={
                    <button className="btn p-1 lh-1 btnclose closeButton" onClick={handleUpgradeModal}>
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
                                {EMR_PlanDetails?.service_points?.map((item, index) => {
                                    return (
                                        <Col key={index} lg={6} className="py-2">
                                            <div className="d-flex align-items-center">
                                                <img className="mx-2" src={listIcon} alt="icon" />
                                                <div className="fs-14 fw-medium text-price text-start">{item}</div>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                            <Button className="btn btn-proceed btn-primary3 w-100 mt-4">
                                Start Exploring
                            </Button>
                        </div>
                        {[...Array(Math.ceil(purchasedData.length / 2))]?.map((_, i) => {
                            return (
                                <div key={i} className='upgraded-premium-box w-92'>
                                    <div className="d-flex">
                                        {purchasedData?.slice(2 * i, (2 * i) + 2)?.map((item, index) => {
                                            return (
                                                <div key={item?.service_name} className="py-3 upgrade-addon-box">
                                                    <div>
                                                        <div className="fs-18 d-flex align-items-center text-welcome fw-semibold my-2 text-truncate">
                                                            <img style={{ background: '#EDD6FF' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                                            <div className="d-flex align-items-center" style={{ flexWrap: 'wrap' }}>
                                                                <div className="me-3">{item?.service_display_name}</div>
                                                                <img src={aiPowered} className="aipowered" alt="AI Powered" />
                                                            </div>
                                                        </div>
                                                        <div className="text-start">
                                                            {item?.service_description}
                                                        </div>
                                                    </div>
                                                    <Button className="btn btn-outline-primary w-100 mt-4 mb-3">
                                                        Know more
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        <div className='upgraded-premium-box w-92'>
                            <div className="w-100 mx-auto px-3">
                                <div className="fs-18 fw-semibold"> Scan the Below QR to Download MedEco App</div>
                                <QRCodeSVG className="rounded-3 my-4" value={"https://pm-doctor-tatva-pwa-prod.tatvacare.in/"} size={150}
                                    // imageSettings={{
                                    //     src: medcoIcon,
                                    //     x: undefined,
                                    //     y: undefined,
                                    //     height: 40,
                                    //     width: 40,
                                    //     excavate: true
                                    // }}
                                />
                                <div>Enhance your clinical practice and stay updated with the latest medical insights. <Link className="text-decoration-underline fw-medium text-primary">Know More</Link></div>
                            </div>
                        </div>
                    </Slider>
                </>
            </Card>
        </Modal>
    )
}

export default React.memo(UpgradeServicesModal);
