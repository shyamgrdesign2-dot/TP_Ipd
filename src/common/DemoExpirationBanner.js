import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import crownIcon from "../assets/images/crown.svg";
import supportwhite from "../assets/images/support.png";
import { openModal } from "../redux/doctorModalSlice";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";
import { getClinicName, getDeviceSdkData, getTokenData } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { deviceType, osName } from "react-device-detect";
import { APPROVED, PAID, PENDING, REJECTED, S_TATVA_PRACTICE, TRIAL } from "../utils/constants";

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
    planStatus,
    service_mappings
  } = planDetails || {};
  const EMR_planDetails = service_mappings?.find(e => e.service_name === S_TATVA_PRACTICE)
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

  const remaingDays = useMemo(() => {
    return EMR_planDetails?.plan_tier === TRIAL ? moment(planDetails?.plan_expiry_date).diff(moment().format('YYYY-MM-DD'), 'days') : 0
  }, [EMR_planDetails, planDetails]);

  return (
    pathname !== '/get-unlimited-access' &&
    EMR_planDetails !== undefined && EMR_planDetails?.status != APPROVED &&
    <header className={`banner ${planStatus == PAID && EMR_planDetails?.status == PAID && 'banner-yellow'}`}>
      <div className="demoModeWrapper">
        <div className="demoModeIndicator" />
        <strong className="text-white">
          {planStatus == TRIAL && EMR_planDetails?.status == PENDING ? (
            'DEMO MODE'
          ) : planStatus == PAID && EMR_planDetails?.status == PAID ? (
            'Payment Verification Pending'
          ) : planStatus == TRIAL && EMR_planDetails?.status == REJECTED && (
            'Payment Verification Failed'
          )}
        </strong>
      </div>
      <p className="expirationMessage text-white">
        {planStatus == TRIAL && EMR_planDetails?.status == PENDING ? (
          `Your free trial ends in ${remaingDays} days. Purchase a plan to continue hassle-free access!`
        ) : planStatus == PAID && EMR_planDetails?.status == PAID ? (
          'Your payment is being verified. This may take up to 3-6 working days.'
        ) : planStatus == TRIAL && EMR_planDetails?.status == REJECTED && (
          'Payment could not be verified. Please contact support.'
        )}
      </p>
      <button className="buyPlanButton" onClick={handleClick}>
        <img loading="lazy" src={planStatus == TRIAL && EMR_planDetails?.status == PENDING ? crownIcon : supportwhite} className="buttonIcon" alt="" />
        <span className="buttonText text-white">
          {planStatus == TRIAL && EMR_planDetails?.status == PENDING ? (
            "Get Unlimited Access"
          ) : (
            'Contact Support'
          )}
        </span>
      </button>
    </header>
    //  planStatus == PAID && EMR_planDetails?.status == PAID ? (
    /* Payment Verification Pending - Your payment is being verified. This may take up to 3–6 working days. (Yellow) */
    // ) : planStatus == TRIAL && EMR_planDetails?.status == REJECTED && (
    /* Payment Verification Failed - Payment could not be verified. Please contact support. (Orange) */
  );

  // return (
  //   pathname !== '/get-unlimited-access' &&
  //   ["TRIAL", "EXPIRED"].includes(currentPlanStatus) && (
  //     <header className="banner">
  //       <div className="demoModeWrapper">
  //         <div className="demoModeIndicator" />
  //         <strong className="text-white">DEMO MODE</strong>
  //       </div>
  //       <p className="expirationMessage text-white">
  //         {expiresIn <= expiry_reminder_days
  //           ? "Your demo is expiring soon."
  //           : ""}{" "}
  //         Purchase a plan now to continue hassle-free consultation!
  //       </p>
  //       <button className="buyPlanButton" onClick={handleClick}>
  //         <img loading="lazy" src={crownIcon} className="buttonIcon" alt="" />
  //         <span className="buttonText text-white">
  //           {is_pm_renew_requested ? "Interest submitted" : "Buy plan now"}
  //         </span>
  //       </button>
  //     </header>
  //   )
  // );
};

export default DemoExpirationBanner;
