import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import crownIcon from "../assets/images/crown.svg";
import { openModal } from "../redux/doctorModalSlice";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";

const DemoExpirationBanner = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const {
    currentPlanStatus,
    expiry_reminder_days,
    expiresIn,
    is_owner,
    is_pm_renew_requested,
  } = planDetails || {};
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSubscriptionDetails()); // Fetch subscription details on every reload
  }, [dispatch]);

  const handleClick = () => {
    dispatch(openModal());
  };

  return (
    ["TRIAL", "EXPIRED"].includes(currentPlanStatus) &&
    is_owner && (
      <header className="banner">
        <div className="demoModeWrapper">
          <div className="demoModeIndicator" />
          <strong className="text-white">DEMO MODE</strong>
        </div>
        <p className="expirationMessage text-white">
          {expiresIn <= expiry_reminder_days
            ? "Your demo is expiring soon."
            : ""}{" "}
          Purchase a plan now to continue hassle-free consultation!
        </p>
        <button className="buyPlanButton" onClick={handleClick}>
          <img loading="lazy" src={crownIcon} className="buttonIcon" alt="" />
          <span className="buttonText text-white">
            {is_pm_renew_requested ? "Interest submitted" : "Buy plan now"}
          </span>
        </button>
      </header>
    )
  );
};

export default DemoExpirationBanner;
