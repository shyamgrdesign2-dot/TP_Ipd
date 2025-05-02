import React, { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import { Button, Col, Row } from "react-bootstrap";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { FREE, S_TATVA_PRACTICE } from "../../../utils/constants";
import { services } from "../../../redux/doctorsSlice";
import { errorMessage } from "../../../utils/utils";

import listIcon from '../../../assets/images/list-icon.svg'
import expiredInfographic from '../../../assets/images/expired-infographic.svg'
import contactSupport from '../../../assets/images/messages-2.svg'
import crown from '../../../assets/images/crown.svg'
import planExpiredSandClock from '../../../assets/images/plan-expired-sand-clock.png'
import { checkCredits, extendFreeTrial } from "../../../redux/monetizationSlice";

function ExtendTrialModal() {
    const dispatch = useDispatch();
    const { profile, servicesList, campaignsData } = useSelector((state) => state.doctors);
    const EMR_planDetails = servicesList.find(e => e.service_name === S_TATVA_PRACTICE)

    const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);

    useEffect(() => {
        if (profile && servicesList?.length > 0) {
            checkBillingPurchased()
        }
    }, [profile, servicesList]);

    const checkBillingPurchased = async () => {
        const emrEndDate = moment(EMR_planDetails?.plan_end_date);
        const currentDate = moment();
        if (EMR_planDetails?.plan_tier === FREE && emrEndDate.isBefore(currentDate, 'day')) {
            setIsExpiredModalOpen(true);
        } else {
            let sendData = {
                b2c_id: profile?.b2c,
                service_name: S_TATVA_PRACTICE
            }
            const action = await dispatch(checkCredits(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                if (action?.payload?.hasOwnProperty("service_name")) {
                    const plan_end_date = moment(action?.payload?.plan_end_date);
                    if (action?.payload?.plan_tier === FREE && plan_end_date.isBefore(currentDate, 'day')) {
                        if (!plan_end_date.isSame(emrEndDate, 'day')) {
                            await dispatch(services(sendData?.b2c_id))
                        }
                        setIsExpiredModalOpen(true);
                    } else {
                        setIsExpiredModalOpen(false);
                    }
                } else {
                    typeof action?.payload?.data?.error === 'object' ?
                        errorMessage(action?.payload?.data?.error?.description)
                        :
                        errorMessage(action?.payload?.data?.message)
                }
            } else {
                errorMessage(action.payload.message)
            }
        }
    }

    const onExtendFreeTrialClick = () => {
        dispatch(extendFreeTrial(profile?.b2c))
    }

    return (
        <Modal
            open={isExpiredModalOpen}
            closeIcon={false}
            footer={null}
            width={1020}
            // onCancel={() => setIsExpiredModalOpen(false)}
            className="expired-model position-relative"
            // maskClosable={false} Uncomment this when model mask closable true
            destroyOnClose>
            <Card>
                {/* className="expired-red-card" Add this class using red color background in above Card tag*/}
                <>
                    <img className="expiredInfographic" src={expiredInfographic} alt="Your free trail has Expired" />
                    <Row className="position-relative">
                        <Col lg={5}>
                            <div className="expired-modal-title">
                                Your free trail has Expired!
                            </div>
                            <div className="fontroboto fs-18 text-white mt-4">
                                Your <b>free trail</b> has expired. Upgrade now to continue a hassle free access!
                            </div>
                            {/* Hide Below code when red color background required */}
                            <div className="extend-free-trial px-5 py-2 mt-4">
                                <div className="fs-18 py-2 fw-bold text-yellow-light"> 🎁 Wait! Just for You...</div>
                                <div className="fs-12-1 fw-medium text-yellow-light">Need more time? Extend your free trial by <span className="fw-bold text-yellow-light">7 days</span> — limited-time only!</div>
                                <hr style={{ borderStyle: "dashed" }} />
                                <Button className="btn btn-proceed fs-16 fw-semi-bold" style={{ background: '#3D8C40' }} onClick={onExtendFreeTrialClick}>
                                    Extend Your Free Trial
                                </Button>
                            </div>
                            {/* End  */}
                            {/* <img src={planExpiredSandClock} className="plan-expired-clock" alt="Expired Clock" /> Add this img using red color background in above Card tag*/}
                        </Col>
                        <Col lg={7}>
                            <div className="bg-white p-30 rounded-20px">
                                <div className="mb-4 text-1F2933 fw-semibold fs-4"> Don't Lose Your Digital Advantage!</div>
                                <div className="mb-3"> Upgrade you plan to continue</div>
                                <div className="d-flex align-items-center py-2">
                                    <img className="me-2" src={listIcon} alt="icon" />
                                    <div className="fs-14 text-start">Seamless clinic management all in one place</div>
                                </div>
                                <div className="d-flex align-items-center py-2">
                                    <img className="me-2" src={listIcon} alt="icon" />
                                    <div className="fs-14 text-start">Secure & instant access to patient records</div>
                                </div>
                                <div className="d-flex align-items-center py-2">
                                    <img className="me-2" src={listIcon} alt="icon" />
                                    <div className="fs-14 text-start">Effortless e-prescriptions with less paperwork</div>
                                </div>
                                <div className="d-flex align-items-center py-2">
                                    <img className="me-2" src={listIcon} alt="icon" />
                                    <div className="fs-14 text-start">Generate AI-powered prescriptions in seconds & more</div>
                                </div>
                                {campaignsData?.campaign_active && (
                                    <div class="my-4 flat-20 py-2 fs-16">🔥Unlock Unlimited Access&nbsp;<span>- Flat {campaignsData?.campaign_value}% OFF!</span></div>
                                )}
                                <Row>
                                    <Col lg={6}>
                                        <Button type='button' className='w-100 btn align-items-center justify-content-center d-flex btn-41 btn-outline-primary' style={{ height: 52 }}>
                                            <i className='icon-phone me-2'></i>
                                            Request a call back
                                        </Button>
                                    </Col>
                                    <Col lg={6}>
                                        <Button className="btn btn-proceed btn-primary3 w-100 align-items-center justify-content-center d-flex">
                                            <img className="me-2" src={crown} alt="Crown" />
                                            Get Unlimited Access
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                            <div className="d-flex align-items-center pt-3">
                                <img className="me-2" src={contactSupport} alt="Contact Support" />
                                <div className="fs-16 text-white opacity-08">Contact Support:</div>
                                <a href="tel:+91-9974042363" className="fs-16 fw-medium text-white">&nbsp;+91-9974042363&nbsp;|</a>
                                <a href="mailto:Support@tatvacare.in" className="fs-16 fw-medium text-white">&nbsp;Support@tatvacare.in</a>
                            </div>
                        </Col>
                    </Row>
                </>
            </Card>
        </Modal >
    );
}

export default ExtendTrialModal;