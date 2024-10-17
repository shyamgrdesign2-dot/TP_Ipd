import React from "react";
import { useDispatch, useSelector } from "react-redux";

import crownIcon from "../assets/images/crown.svg";
import { useNavigate } from "react-router-dom";
import { openModal } from "../redux/doctorModalSlice";

const PlanExpirationBanner = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { planStatus, is_owner, expiry_reminder_days, is_pm_renew_requested } =
    planDetails || {};
  // const expiresIn = moment(planDetails?.plan_expiry_date).diff(moment(), "days");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(openModal());
  };

  return (
    !is_pm_renew_requested &&
    planStatus === "PAID" &&
    is_owner &&
    expiry_reminder_days <= 20 && (
      <header className="plan-expiry-banner">
        <div className="demoModeWrapper">
          <div className="demoModeIndicator" />
          <strong className="text-white">PLAN EXPIRING SOON</strong>
        </div>
        <p className="expirationMessage text-white">
          Your Pro plan expires in {expiry_reminder_days} days. Renew now to
          ensure hassle-free access!
        </p>
        <button className="buyPlanButton" onClick={handleClick}>
          <img loading="lazy" src={crownIcon} className="buttonIcon" alt="" />
          <span className="buttonText text-white">Renew plan now</span>
        </button>
      </header>
    )
  );
};

export default PlanExpirationBanner;
