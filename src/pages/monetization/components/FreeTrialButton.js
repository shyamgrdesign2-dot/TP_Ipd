import React, { useMemo } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

import { FREE, S_TATVA_PRACTICE, TRIAL } from "../../../utils/constants";
import coinSmRed from "../../../assets/images/coin-sm-red.png";
import coinSm from "../../../assets/images/coin-sm.png";

function FreeTrialButton({ title, showHideSubModal }) {

    const { servicesList } = useSelector((state) => state.doctors);
    const AI_planDetails = servicesList?.find(e => e.service_name === title)

    const { planDetails } = useSelector((state) => state.subscription);
    const { service_mappings } = planDetails || {};
    const EMR_planDetails = service_mappings?.find(e => e.service_name === S_TATVA_PRACTICE)
    const NonAI_planDetails = service_mappings?.find(e => e.service_name === title)

    const isPurchased = () => {
        if (EMR_planDetails?.plan_tier !== TRIAL && NonAI_planDetails?.plan_tier === TRIAL) {
            return true;
        } else {
            return false;
        }
    }

    const remaingDays = useMemo(() => {
        return EMR_planDetails?.plan_tier === TRIAL ? moment(planDetails?.plan_expiry_date).diff(moment().format('YYYY-MM-DD'), 'days') : 0
    }, [title, planDetails]);

    return (
        (AI_planDetails?.plan_tier === FREE && AI_planDetails?.service_type === 'ai') ? (
            <Button className={`btn rounded-pill btn-free-trials me-3 ${AI_planDetails?.credit_balance <= 0 && 'btn-free-0-trials'}`} onClick={showHideSubModal}>
                <img src={AI_planDetails?.credit_balance <= 0 ? coinSmRed : coinSm} className="me-2" alt="Tatva Icon" />
                {AI_planDetails?.credit_balance} free trial
                <i className="icon-right iconrotate180" style={{ color: AI_planDetails?.credit_balance > 0 ? '#212529' : '#FC5A5A' }}></i>
            </Button>
        ) : NonAI_planDetails?.plan_tier === TRIAL && NonAI_planDetails?.service_type === 'non_ai' && (
            <Button className={`btn rounded-pill btn-free-trials me-3 ${(isPurchased() || remaingDays < 0) && 'btn-free-0-trials'}`} onClick={showHideSubModal}>
                {(isPurchased() || remaingDays < 0) ? 'Free trial expired' : `${remaingDays > 0 ? `${remaingDays} days free trial` : `Free trial expired today`}`}
                <i className="icon-right iconrotate180" style={{ color: (isPurchased() || remaingDays < 0) ? '#FC5A5A' : '#212529' }}></i>
            </Button>
        )
    )
}

export default React.memo(FreeTrialButton);
