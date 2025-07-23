import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import crownIcon from "../assets/images/crown.svg";
import { openModal } from "../redux/doctorModalSlice";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";
import { getClinicName } from "../utils/utils";
import { useLocation } from "react-router-dom";
import { HIDE_ROUTES } from "../utils/constants";

const DemoExpirationBanner = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { profile } = useSelector((state) => state.doctors);

  const location = useLocation();

  const shouldHideBanner = useMemo(() => {
    return HIDE_ROUTES.BANNER.some(
      (route) =>
        location.pathname.includes(route)
    );
  }, [location.pathname]);

  const {
    currentPlanStatus,
    expiry_reminder_days,
    expiresIn,
    is_pm_renew_requested,
  } = planDetails || {};
  const urlParams = new URLSearchParams(window.location.search);
  const isReceptionist = urlParams.has("receptionist");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReceptionist) {
      dispatch(fetchSubscriptionDetails()); // Fetch subscription details on every reload
    }
  }, [dispatch]);

  const handleClick = () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("BuyPlanNow_Click", {
      doctor_id: profile?.doctor_unique_id,
      clinic_name,
    });
    dispatch(openModal());
  };

  if (shouldHideBanner) {
    return null;
  }

  return (
    ["TRIAL", "EXPIRED"].includes(currentPlanStatus) && (
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
