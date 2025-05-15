import React from "react";
import { Button } from "antd";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import crown from '../../../assets/images/crown.svg'
import { FREE, S_TATVA_PRACTICE } from "../../../utils/constants";
import { interest } from "../../../redux/monetizationSlice";
import { errorMessage } from "../../../utils/utils";

function ExpiredText({ title }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { profile, servicesList } = useSelector((state) => state.doctors);
    const EMR_planDetails = servicesList?.find(e => e.service_name === S_TATVA_PRACTICE)
    const planDetails = servicesList?.find(e => e.service_name === title)

    const clickBuyNow = (service_name) => {
        navigate('/get-unlimited-access', { state: { buyServiceName: service_name } })
    }

    const clickRequestCallback = async (service_name) => {
        let sendData = {
            mbl_no: profile?.um_contact,
            is_pm_renew_requested: true,
            service_name: service_name
        }
        const action = await dispatch(interest(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            errorMessage(action.payload.message)
        }
    }

    const isPurchased = () => {
        if (EMR_planDetails?.plan_tier !== FREE && planDetails?.plan_tier === FREE) {
            return true;
        } else {
            return false;
        }
    }

    return (
        pathname !== '/get-unlimited-access' &&
        (
            (
                planDetails?.service_type === 'ai' &&
                planDetails?.plan_tier === FREE &&
                planDetails?.credit_balance <= 0
            )
            ||
            (
                planDetails?.service_type === 'non_ai' &&
                isPurchased()
            )
        ) &&
        <div className="position-sticky bottom-0 bg-white w-100 px-4 py-3">
            <div className="fontroboto fs-16 text-center text-danger-custom">
                Your <span className="fw-bold text-danger-custom">{planDetails?.service_display_name} free trail</span> has expired. <br />
                Upgrade now to continue a hassle free experience!
            </div>
            <Row className="mt-2">
                <Col lg={6}>
                    <Button type='button' className='w-100 btn ant-btn align-items-center justify-content-center d-flex btn-41 btn-primary1 btn-input' style={{ height: 52 }} onClick={() => clickRequestCallback(title)}>
                        <i className='icon-phone me-2'></i>
                        Request a call back
                    </Button>
                </Col>
                <Col lg={6}>
                    <Button className="btn btn-proceed btn-primary3 w-100 align-items-center justify-content-center d-flex" onClick={() => clickBuyNow(title)}>
                        <img className="me-2" src={crown} alt="Crown" />
                        Get Unlimited Access
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(ExpiredText);
