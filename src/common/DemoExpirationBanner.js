import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import crownIcon from "../assets/images/crown.svg";
import { openModal } from "../redux/doctorModalSlice";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";
import { getClinicName, getDeviceSdkData, getTokenData } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { deviceType, osName } from "react-device-detect";

const DemoExpirationBanner = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { planDetails } = useSelector((state) => state.subscription);
  const { profile } = useSelector((state) => state.doctors);

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

    const tokenData = getTokenData();
    const deviceSdkData = getDeviceSdkData();
    window.Moengage.track_event("TP_GetUnlimited_Access", {
      doctor_name: profile?.um_name,
      doctor_number: profile?.um_contact,
      doctor_unique_id: profile?.doctor_unique_id,
      doctor_specialty: profile?.dp_name,
      clinic_id: tokenData?.clinic_id,
      um_id: tokenData?.user_id,
      ...deviceSdkData
    });
    // dispatch(openModal());
    clickBuyNow()
  };

  const clickBuyNow = () => {
    navigate('/get-unlimited-access')
  }

  return (
    pathname !== '/get-unlimited-access' &&
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
