import React from "react";
import { Button, Modal, Card } from "antd";
import { useSelector } from "react-redux";

import CampaignDiscount from "./CampaignDiscount";
import expiredInfographic2 from '../../../assets/images/expired-infographic-2.svg'
import coinLg from "../../../assets/images/coin-lg.png";
import crown from '../../../assets/images/crown.svg'
import planExpiredSandClock from '../../../assets/images/plan-expired-sand-clock.png'

function ContactSupport({ title, styles, isSubModalOpen, showHideSubModal }) {

    const { campaignsData, servicesList } = useSelector((state) => state.doctors);
    const planDetails = servicesList.find(e => e.service_name === title)

    return (
        <Modal
            open={isSubModalOpen}
            closeIcon={false}
            footer={null}
            centered
            className="voicerx-modal text-center"
            width={435}
            styles={styles}
        >
            <Card
                extra={
                    <>
                        {planDetails?.credit_balance > 0 && (
                            <img className="coinLg" src={coinLg} alt="Tatva Coin" />
                        )}
                        <button className="position-relative z-1 btn p-1 lh-1 btnclose closeButton" onClick={showHideSubModal}>
                            <i className="icon-Cross"></i>
                        </button>
                        <img className="expiredInfographic" src={expiredInfographic2} alt="Your free trail has Expired" />
                        <img className="expiredInfographic" style={{ opacity: 0.5 }} src={expiredInfographic2} alt="Your free trail has Expired" />
                    </>
                }>

                {planDetails?.credit_balance > 0 ? (
                    <div className="text-white fs-16">
                        <span className="fw-bold fs-2 text-white">{planDetails?.credit_balance}</span>
                        <span className="text-white fw-semibold">/05</span> free Trial Left! <br />
                        You can generate up to <span className="fw-bold text-white">{planDetails?.credit_balance} RX</span> using AI {planDetails?.service_display_name} for absolutely free!
                    </div>
                ) : (
                    <>
                        <img src={planExpiredSandClock} className="plan-expired-clock" alt="Expired Clock" />
                        <div className="text-white">
                            Your<span className="text-white fw-semibold"> {planDetails?.service_display_name} free trail  </span>  has expired. <br />
                            Upgrade now to continue a hassle free experience!
                        </div>
                    </>
                )}

                <div className="bg-white p-4 rounded-5 mt-4">
                    <div className="fs-4 fw-bold text-price">Upgrade Now 🚀</div>
                    <div className="mt-3 text-price">Unlock unlimited AI {planDetails?.service_display_name}, a trusted feature used by <span className="fw-bold text-price">5,000+ doctors</span> across clinics.</div>

                    {campaignsData?.campaign_active && (
                        <CampaignDiscount flag={2} />
                    )}

                    <div>
                        <Button type='button' className='mt-3 btn align-items-center mx-auto d-flex btn-41 btn-text btn-save' style={{ height: 52 }}>
                            <i className='icon-phone text-primary me-2'></i>
                            Request a call back
                        </Button>
                    </div>
                    <div>
                        <Button className="mt-3 btn btn-proceed btn-primary3 w-100 align-items-center justify-content-center d-flex">
                            <img className="me-2" src={crown} alt="Crown" />
                            Get Unlimited Access
                        </Button>
                    </div>
                </div>
            </Card>
        </Modal>
    )
}

export default React.memo(ContactSupport);
