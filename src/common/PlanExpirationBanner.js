import React from "react";
import { useDispatch, useSelector } from "react-redux";
import crownIcon from "../assets/images/crown.svg";
import { openModal } from "../redux/doctorModalSlice";
import { useNavigate } from "react-router-dom";

const PlanExpirationBanner = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const {
    currentPlanStatus,
    expiry_reminder_days,
    expiresIn,
    is_pm_renew_requested,
  } = planDetails || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    // dispatch(openModal());
    clickBuyNow()
  };
  const clickBuyNow = () => {
    navigate('/get-unlimited-access')
  }

  return (
    !is_pm_renew_requested &&
    currentPlanStatus === "PAID" &&
    expiresIn <= expiry_reminder_days && (
      <header className="plan-expiry-banner">
        <div className="demoModeWrapper">
          <div className="demoModeIndicator" />
          <strong className="text-white">PLAN EXPIRING SOON</strong>
        </div>
        <p className="expirationMessage text-white">
          Your Pro plan{" "}
          {expiresIn > 0 ? `expires in ${expiresIn} days` : "has expired"}.
          Renew now to ensure hassle-free access!
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
