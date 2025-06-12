import React from "react";
import { Button, Modal, Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CampaignDiscount from "./CampaignDiscount";
import expiredInfographic2 from '../../../assets/images/expired-infographic-2.svg'
import coinLg from "../../../assets/images/coin-lg.png";
import crown from '../../../assets/images/crown.svg'
import planExpiredSandClock from '../../../assets/images/plan-expired-sand-clock.png'
import { interest } from "../../../redux/monetizationSlice";
import { errorMessage, getClinicName, getDeviceSdkData, getTokenData } from "../../../utils/utils";
import { openModal } from "../../../redux/doctorModalSlice";

function ExpiredSubModal({ title, styles, isSubModalOpen, showHideSubModal }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { profile, servicesList } = useSelector((state) => state.doctors);
    const planDetails = servicesList?.find(e => e.service_name === title)

    const clickBuyNow = (service_name) => {
        navigate('/get-unlimited-access', { state: { buyServiceName: service_name } })
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_VoiceRx_GetUnlimitedRx", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            former_page: service_name,
            ...deviceSdkData,
        });
    }

    const clickRequestCallback = async (service_name) => {
        dispatch(openModal(service_name))
        // let sendData = {
        //     mbl_no: profile?.um_contact,
        //     is_pm_renew_requested: true,
        //     service_name: service_name
        // }
        // const action = await dispatch(interest(sendData));
        // if (action.meta.requestStatus === "fulfilled") {
        //     showHideSubModal()
        //     errorMessage(action.payload.message)
        // }
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_RequestACallback", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            former_page: service_name,
            ...deviceSdkData,
        });
    }

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
                        {planDetails?.service_type === 'ai' && planDetails?.credit_balance > 0 && (
                            <img className="coinLg" src={coinLg} alt="Tatva Coin" />
                        )}
                        <button className="position-relative z-1 btn p-1 lh-1 btnclose closeButton" onClick={showHideSubModal}>
                            <i className="icon-Cross"></i>
                        </button>
                        <img className="expiredInfographic" src={expiredInfographic2} alt="Your free trial has Expired" />
                        <img className="expiredInfographic" style={{ opacity: 0.5 }} src={expiredInfographic2} alt="Your free trial has Expired" />
                    </>
                }>

                {planDetails?.service_type === 'ai' && planDetails?.credit_balance > 0 ? (
                    <div className="text-white fs-16">
                        <span className="fw-bold fs-2 text-white">{planDetails?.credit_balance}</span>
                        <span className="text-white fw-semibold">/05</span> free Trial Left! <br />
                        You can generate up to <span className="fw-bold text-white">{planDetails?.credit_balance} RX</span> using {planDetails?.service_type == 'ai' && 'AI'} {planDetails?.service_display_name} for absolutely free!
                    </div>
                ) : (
                    <>
                        <img src={planExpiredSandClock} className="plan-expired-clock" alt="Expired Clock" />
                        <div className="text-white">
                            Your<span className="text-white fw-semibold"> {planDetails?.service_display_name} free trial  </span>  has expired. <br />
                            Upgrade now to continue a hassle free experience!
                        </div>
                    </>
                )}

                <div className="bg-white p-4 rounded-5 mt-4">
                    <div className="fs-4 fw-bold text-price">Upgrade Now 🚀</div>
                    <div className="mt-3 text-price">Unlock unlimited {planDetails?.service_type == 'ai' && 'AI'} {planDetails?.service_display_name}, a trusted feature used by <span className="fw-bold text-price">5,000+ doctors</span> across clinics.</div>

                    {planDetails?.discount && (
                        <CampaignDiscount flag={2} title={planDetails?.service_name}/>
                    )}

                    <div>
                        <Button type='button' className='mt-3 btn align-items-center mx-auto d-flex btn-41 btn-text btn-save' style={{ height: 52 }} onClick={() => clickRequestCallback(title)}>
                            <i className='icon-phone text-primary me-2'></i>
                            Request a call back
                        </Button>
                    </div>
                    <div>
                        <Button className="mt-3 btn btn-proceed btn-primary3 w-100 align-items-center justify-content-center d-flex" onClick={() => clickBuyNow(title)}>
                            <img className="me-2" src={crown} alt="Crown" />
                            Get Unlimited Access
                        </Button>
                    </div>
                </div>
            </Card>
        </Modal>
    )
}

export default React.memo(ExpiredSubModal);
