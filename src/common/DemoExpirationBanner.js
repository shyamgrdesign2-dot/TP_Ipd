import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import crownIcon from "../assets/images/crown.svg";
import supportwhite from "../assets/images/support.png";
import SMS from "../assets/images/sms.svg";
import { openModal } from "../redux/doctorModalSlice";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";
import { getClinicName, getDeviceSdkData, getTokenData } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { deviceType, osName } from "react-device-detect";
import { APPROVED, PAID, PENDING, REJECTED, S_TATVA_PRACTICE, TRIAL } from "../utils/constants";
import { Card, Modal } from "antd";

const DemoExpirationBanner = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { planDetails } = useSelector((state) => state.subscription);
  const { profile } = useSelector((state) => state.doctors);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const clickContactSupport = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const contactNumberandEmail = () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    const tokenData = getTokenData();
    const deviceSdkData = getDeviceSdkData();
    window.Moengage.track_event("TP_Monetization_VoiceRx_Contact_Support", {
      doctor_name: profile?.um_name,
      doctor_number: profile?.um_contact,
      doctor_unique_id: profile?.doctor_unique_id,
      doctor_specialty: profile?.dp_name,
      clinic_id: tokenData?.clinic_id,
      um_id: tokenData?.user_id,
      clinic_Name: clinic_name,
      ...deviceSdkData,
    });
  }

  const {
    currentPlanStatus,
    expiry_reminder_days,
    expiresIn,
    is_pm_renew_requested,
    c_expiry_reminder_days,
    c_last_plan_expiry_date,
    c_last_plan_status,
    c_plan_status,
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

    if (c_plan_status == TRIAL && (EMR_planDetails?.status == PENDING || EMR_planDetails?.status == REJECTED)) {
      clickBuyNow()
    } else {
      clickContactSupport()
    }
  };

  const clickBuyNow = () => {
    navigate('/get-unlimited-access')
  }

  const remaingDays = useMemo(() => {
    return EMR_planDetails?.plan_tier === TRIAL ? moment(planDetails?.plan_expiry_date).diff(moment().format('YYYY-MM-DD'), 'days') : 0
  }, [planDetails]);

  const remaingDaysStatus = useMemo(() => {
    return c_plan_status == PAID && c_last_plan_status == PAID && EMR_planDetails?.status == PAID ? moment(c_last_plan_expiry_date).diff(moment().format('YYYY-MM-DD'), 'days') <= c_expiry_reminder_days ? true : false : false
  }, [planDetails]);

  return (
    pathname !== '/get-unlimited-access' &&
    EMR_planDetails !== undefined && EMR_planDetails?.status != APPROVED &&
    <>
      {c_plan_status == TRIAL && (EMR_planDetails?.status == PENDING || EMR_planDetails?.status == REJECTED) ? (
        <header className={`banner`}>
          <div className="demoModeWrapper">
            <div className="demoModeIndicator" />
            <strong className="text-white">
              DEMO MODE
            </strong>
          </div>
          <p className="expirationMessage text-white">
            {`${remaingDays > 0 ? `You're on a trial plan` : `${remaingDays < 0 ? `Your trial plan expired` : `Your trial plan will expire today`}`}. Upgrade your plan to continue hassle-free access!`}
          </p>
          <button className="buyPlanButton" onClick={handleClick}>
            <img loading="lazy" src={crownIcon} className="buttonIcon" alt="" />
            <span className="buttonText text-white">
              Get Unlimited Access
            </span>
          </button>
        </header>
      ) : c_plan_status == PAID && c_last_plan_status == PAID && EMR_planDetails?.status == REJECTED ? (
        <header className={`banner`}>
          <div className="demoModeWrapper">
            <div className="demoModeIndicator" />
            <strong className="text-white">
              Payment Verification Failed
            </strong>
          </div>
          <p className="expirationMessage text-white">
            Payment could not be verified. Please contact support.
          </p>
          <button className="buyPlanButton" onClick={handleClick}>
            <img loading="lazy" src={supportwhite} className="buttonIcon" alt="" />
            <span className="buttonText text-white">
              Contact Support
            </span>
          </button>
        </header>
      ) : c_plan_status == PAID && c_last_plan_status == TRIAL && EMR_planDetails?.status == PAID ? (
        <header className={`banner banner-yellow`}>
          <div className="demoModeWrapper">
            <div className="demoModeIndicator" />
            <strong className="text-white">
              Payment Verification Pending
            </strong>
          </div>
          <p className="expirationMessage text-white">
            Your payment is being verified. This may take up to 3-6 working days.
          </p>
          <button className="buyPlanButton" onClick={handleClick}>
            <img loading="lazy" src={supportwhite} className="buttonIcon" alt="" />
            <span className="buttonText text-white">
              Contact Support
            </span>
          </button>
        </header>
      ) : c_plan_status == PAID && c_last_plan_status == PAID && EMR_planDetails?.status == PAID && remaingDaysStatus ? (
        <header className={`banner banner-yellow`}>
          <div className="demoModeWrapper">
            <div className="demoModeIndicator" />
            <strong className="text-white">
              Payment Verification Pending
            </strong>
          </div>
          <p className="expirationMessage text-white">
            Your payment is being verified. This may take up to 3-6 working days.
          </p>
          <button className="buyPlanButton" onClick={handleClick}>
            <img loading="lazy" src={supportwhite} className="buttonIcon" alt="" />
            <span className="buttonText text-white">
              Contact Support
            </span>
          </button>
        </header>
      ) :
        null
      }

      <Modal
        open={isModalOpen}
        centered
        closeIcon={false}
        footer={null}
        className="modalcommon"
        destroyOnClose
      >
        <Card
          title='Contact Support'
          extra={
            <button className="btn p-1 lh-1 btnclose closeButton" onClick={clickContactSupport}>
              <i className="icon-Cross"></i>
            </button>
          }
        >
          <div className="rounded-4 p-4 w-100" style={{ background: "#4B4AD514" }}>
            <div className="align-items-center">
              <i className="icon-phone fs-18"></i>
              <a className="text-main fw-medium fs-16" href="tel:+91-9974042363" onClick={contactNumberandEmail}> +91-9974042363</a>
            </div>
            <div className="my-2">(Monday - Saturday | 9am to 8pm)</div>
            <div className="align-items-center">
              <img className="me-1" width={19} height={19} src={SMS} />
              <a className="text-main fw-medium fs-16" href="mailto:support@tatvacare.in" onClick={contactNumberandEmail}>
                Support@tatvacare.in
              </a>
            </div>
          </div>
        </Card>
      </Modal>
    </>
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
