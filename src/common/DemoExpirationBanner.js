import React from "react";
import { useDispatch, useSelector } from "react-redux";

import crownIcon from "../assets/images/crown.svg";
import { openModal } from "../redux/doctorModalSlice";

const DemoExpirationBanner = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { planStatus, expiry_reminder_days, is_owner, is_pm_renew_requested } =
    planDetails || {};
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(openModal());
  };

  return (
    !is_pm_renew_requested &&
    ["TRIAL", "EXPIRED"].includes(planStatus) &&
    is_owner && (
      <header className="banner">
        <div className="demoModeWrapper">
          <div className="demoModeIndicator" />
          <strong className="text-white">DEMO MODE</strong>
        </div>
        <p className="expirationMessage text-white">
          {expiry_reminder_days <= 20 ? "Your demo is expiring soon." : ""}{" "}
          Purchase a plan now to continue hassle-free consultation!
        </p>
        <button className="buyPlanButton" onClick={handleClick}>
          <img loading="lazy" src={crownIcon} className="buttonIcon" alt="" />
          <span className="buttonText text-white">Buy plan now</span>
        </button>
      </header>
    )
  );
};

export default DemoExpirationBanner;
