import React, { useState } from "react";
import { Card, Drawer, Modal } from "antd";
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
import { S_TATVA_PRACTICE, S_SMARTSYNC, S_VOICE_RX, S_DDX, S_RX_DIGITIZATION, S_IPD, S_ASK_TATVA, S_PHARMACY, S_BILLING, S_RECEPTIONIST_AGENT } from "../../../utils/constants";
import { QRCodeSVG } from "qrcode.react";
import GenRxKnowMore from "../../../components/GenRxKnowMore";
import SmartSyncKnowMore from "./../components/SmartSyncKnowMore";
import CvtKnowMore from "../../smartSync/components/CvtKnowMore";
import DDxKnowMore from "../../../components/DDxKnowMore";
import IPDKnowMore from "./../components/IPDKnowMore";
import AskTatvaKnowMore from "./../components/AskTatvaKnowMore";
import PharmacyKnowMore from "./../components/PharmacyKnowMore";
import BillingKnowMore from "./../components/BillingKnowMore";
import MedEcoAppKnowMore from "./../components/MedEcoAppKnowMore";
import { getClinicName, getDeviceSdkData, getTokenData } from "../../../utils/utils";

function UpgradeServicesModal({ isUpgradeModal, upgradeList, handleUpgradeModal }) {

    const { servicesList, profile } = useSelector((state) => state.doctors);
    const EMR_PlanDetails = upgradeList.includes(S_TATVA_PRACTICE) ? servicesList?.find(e => e.service_name === S_TATVA_PRACTICE) : null
    const withoutEMR = upgradeList.filter(item => item !== S_TATVA_PRACTICE)
    const purchasedData = servicesList?.filter(e => withoutEMR.includes(e.service_name))

    const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
    const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);
    const [smartSyncKnowMoreDrawer, setSmartSyncKnowMoreDrawer] = useState(false);
    const [cvtDrawer, setCvtDrawer] = useState(false);
    const [askTatvaKnowMoreDrawer, setAskTatvaKnowMoreDrawer] = useState(false);
    const [iPDKnowMoreDrawer, setIPDKnowMoreDrawer] = useState(false);
    const [pharmacyKnowMoreDrawer, setPharmacyKnowMoreDrawer] = useState(false);
    const [billingDrawer, setBillingDrawer] = useState(false);
    const [medEcoKnowMoreDrawer, setMedEcoKnowMoreDrawer] = useState(false);

    const settings = {
        infinite: true,
        speed: 500,
        dots: true,
        arrows: true,
        adaptiveHeight: false,
        autoplay: false,
    };

    const handleUpgradeModalClick = () => {
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_StartExploring", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            ...deviceSdkData,
        });
        handleUpgradeModal();   
    }
    const clickKnowMore = (service_name) => {
        if (service_name === S_VOICE_RX) {
            handleGenRxKnowMore()
        } else if (service_name === S_SMARTSYNC) {
            handleSmartSyncKnowMore()
        } else if (service_name === S_RX_DIGITIZATION) {
            handleDrawerCvtKnowMore()
        } else if (service_name === S_DDX) {
            handleDDxKnowMore()
        } else if (service_name === S_IPD) {
            handleIPDKnowMore()
        } else if (service_name === S_ASK_TATVA) {
            handleAskTatvaKnowMore()
        } else if (service_name === S_PHARMACY) {
            handlePharmacyKnowMore()
        } else if (service_name === S_BILLING) {
            handleBillingKnowMore()
        } else if (service_name === S_TATVA_PRACTICE) {
            handleMedEcoKnowMore()
        } else if (service_name === S_RECEPTIONIST_AGENT) {
            handleMedEcoKnowMore()
        }
    }

    const handleGenRxKnowMore = () => {
        setGenRxKnowMoreDrawer((prev) => !prev);
    };

    const handleDDxKnowMore = () => {
        setDDxKnowMoreDrawer((prev) => !prev);
    };

    const handleSmartSyncKnowMore = () => {
        setSmartSyncKnowMoreDrawer((prev) => !prev);
    };

    const handleDrawerCvtKnowMore = () => {
        setCvtDrawer((prev) => !prev);
    };

    const handleAskTatvaKnowMore = () => {
        setAskTatvaKnowMoreDrawer((prev) => !prev);
    };

    const handleIPDKnowMore = () => {
        setIPDKnowMoreDrawer((prev) => !prev);
    };

    const handlePharmacyKnowMore = () => {
        setPharmacyKnowMoreDrawer((prev) => !prev);
    };

    const handleBillingKnowMore = () => {
        setBillingDrawer((prev) => !prev);
    };

    const handleMedEcoKnowMore = () => {
        setMedEcoKnowMoreDrawer((prev) => !prev);
    };

    return (
        <>
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
                            <i className="icon-Cross text-white"></i>
                        </button>
                    }>
                    <>
                        <img src={upgradedLogo} alt="upgraded to premium" />
                        <div className="fs-2 fw-bold mt-3">
                            {purchasedData?.length === 0 ?
                                `You have upgraded to premium`
                                : purchasedData?.length === 1 ?
                                    `${purchasedData[0]?.service_display_name} Activated`
                                    : purchasedData?.length === 2 ?
                                        `${purchasedData[0]?.service_display_name}, ${purchasedData[1]?.service_display_name} Activated`
                                        : `${purchasedData?.length} Add-on Service Activated!`}
                        </div>
                        <div className="mt-3"> Here’s what’s now available to you.</div>
                        <Slider
                            {...settings}
                            slidesToShow={1}>
                            {EMR_PlanDetails && (
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
                                    <Button className="btn btn-proceed btn-primary3 w-100 mt-4" onClick={handleUpgradeModalClick}>
                                        Start Exploring
                                    </Button>
                                </div>
                            )}
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
                                                                    {item.service_type === 'ai' && (<img src={aiPowered} alt="AI Powered" className="aipowered" />)}
                                                                </div>
                                                            </div>
                                                            <div className="text-start">
                                                                {item?.service_description}
                                                            </div>
                                                        </div>
                                                        <Button className="btn btn-outline-primary w-100 mt-4 mb-3" onClick={() => clickKnowMore(item.service_name)}>
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
            {genRxKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={genRxKnowMoreDrawer}
                    onClose={handleGenRxKnowMore}
                    className=".modalWidth-800"
                    width={825}
                >
                    <GenRxKnowMore handleGenRxKnowMore={handleGenRxKnowMore} />
                </Drawer>
            )}

            {ddxKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={ddxKnowMoreDrawer}
                    onClose={handleDDxKnowMore}
                    className=".modalWidth-800"
                    width={825}
                >
                    <DDxKnowMore handleDDxKnowMore={handleDDxKnowMore} />
                </Drawer>
            )}

            {smartSyncKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={smartSyncKnowMoreDrawer}
                    onClose={handleSmartSyncKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <SmartSyncKnowMore handleSmartSyncKnowMore={handleSmartSyncKnowMore} />
                </Drawer>
            )}

            {cvtDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    onClose={handleDrawerCvtKnowMore}
                    open={cvtDrawer}
                    className=".modalWidth-800"
                    width={800}
                >
                    <CvtKnowMore handleDrawerCvtKnowMore={handleDrawerCvtKnowMore} handleCollapsed={handleDrawerCvtKnowMore} />
                </Drawer>
            )}

            {askTatvaKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={askTatvaKnowMoreDrawer}
                    onClose={handleAskTatvaKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <AskTatvaKnowMore handleAskTatvaKnowMore={handleAskTatvaKnowMore} />
                </Drawer>
            )}

            {iPDKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={iPDKnowMoreDrawer}
                    onClose={handleIPDKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <IPDKnowMore handleIPDKnowMore={handleIPDKnowMore} />
                </Drawer>
            )}

            {pharmacyKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={pharmacyKnowMoreDrawer}
                    onClose={handlePharmacyKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <PharmacyKnowMore handlePharmacyKnowMore={handlePharmacyKnowMore} />
                </Drawer>
            )}

            {billingDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={billingDrawer}
                    onClose={handleBillingKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <BillingKnowMore handleBillingKnowMore={handleBillingKnowMore} />
                </Drawer>
            )}

            {medEcoKnowMoreDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={medEcoKnowMoreDrawer}
                    onClose={handleMedEcoKnowMore}
                    className=".modalWidth-800"
                    width={600}
                >
                    <MedEcoAppKnowMore handleMedEcoKnowMore={handleMedEcoKnowMore} />
                </Drawer>
            )}
        </>
    )
}

export default React.memo(UpgradeServicesModal);
