import React from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";

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

    return (
        (AI_planDetails?.plan_tier === FREE && AI_planDetails?.service_type === 'ai') ? (
            <Button className={`btn rounded-pill btn-free-trials me-3 ${AI_planDetails?.credit_balance <= 0 && 'btn-free-0-trials'}`} onClick={showHideSubModal}>
                <img src={AI_planDetails?.credit_balance <= 0 ? coinSmRed : coinSm} className="me-2" alt="Tatva Icon" />
                {AI_planDetails?.credit_balance} free trial
                {AI_planDetails?.credit_balance > 0 && <i className="ms-2 icon-right iconrotate180"></i>}
            </Button>
        ) : (isPurchased() && AI_planDetails?.service_type === 'non_ai') && (
            <Button className={`btn rounded-pill btn-free-trials me-3 btn-free-0-trials`} onClick={showHideSubModal}>
                Free trial Expired
            </Button>
        )
    )
}

export default React.memo(FreeTrialButton);
