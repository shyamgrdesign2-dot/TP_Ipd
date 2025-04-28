import React from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";

import { FREE } from "../../../utils/constants";
import coinSmRed from "../../../assets/images/coin-sm-red.png";
import coinSm from "../../../assets/images/coin-sm.png";

function FreeTrialButton({ title, showHideSubModal }) {

    const { servicesList } = useSelector((state) => state.doctors);
    const planDetails = servicesList.find(e => e.service_name === title)

    return (
        planDetails !== undefined && planDetails?.plan_tier === FREE && (
            <Button className={`btn rounded-pill btn-free-trials me-3 ${planDetails?.credit_balance === 0 && 'btn-free-0-trials'}`} onClick={showHideSubModal}>
                <img src={planDetails?.credit_balance === 0 ? coinSmRed : coinSm} className="me-2" alt="Tatva Icon" />
                {planDetails?.credit_balance} free trial
                {planDetails?.credit_balance > 0 && <i className="ms-2 icon-right iconrotate180"></i>}
            </Button>
        )
    )
}

export default React.memo(FreeTrialButton);
