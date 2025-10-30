import React, { useState, useEffect } from "react";
import { Button, Drawer } from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import config from "../config";
import { useLocalStorage } from "../utils/localStorage";
import {
  FREE,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
  S_ASK_TATVA,
  S_IPD,
  S_PHARMACY,
  S_OPD_BILLING,
  S_BILLING,
  TRIAL,
  S_TATVA_PRACTICE,
  PERSISTANT_STORAGE_KEY_EXTRA,
  FAILED_VERIFICATION,
} from "../utils/constants";
import newGif from "../assets/images/new-gif.gif";
import ipdIcon from "../assets/images/ipd.svg";
import patientsIcon from "../assets/images/all-patients.svg";
import analyticsIcon from "../assets/images/analytics.svg";
import pharmacyIcon from "../assets/images/pharmacy.svg";
import billingsIcon from "../assets/images/billings.svg";
import followUpIcon from "../assets/images/followup-home.svg";
import ipdActiveIcon from "../assets/images/ipd-active.svg";
import tatvaAiIcon from "../assets/images/website-images/tatvaAiIcon.svg";
import patientsActiveIcon from "../assets/images/all-patients-active.svg";
import analyticsActiveIcon from "../assets/images/analytics-active.svg";
import pharmacyActiveIcon from "../assets/images/pharmacy-active.svg";
import billingsActiveIcon from "../assets/images/billings-active.svg";
import followUpActiveIcon from "../assets/images/follow-up-active.svg";
import LockIcon from "../assets/images/lock-icon.svg";
import tatvaAiActiveIcon from "../assets/images/website-images/tatvaAiActiveIcon.svg";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import {
  errorMessage,
  getClinicName,
  shouldMonetizationDisabled,
  trackEvent,
} from "../utils/utils";
import FullPageLoader from "../pages/vaccination/components/Loader";
import { useOpdBilling } from "../pages/opdBilling/useOpdBilling";
import moment from "moment";
import { checkCredits } from "../redux/monetizationSlice";
import { services } from "../redux/doctorsSlice";
import ExpiredSubModal from "../pages/monetization/components/ExpiredSubModal";
import IPDKnowMore from "../pages/monetization/components/IPDKnowMore";
import PharmacyKnowMore from "../pages/monetization/components/PharmacyKnowMore";
import AskTatvaKnowMore from "../pages/monetization/components/AskTatvaKnowMore";

function SidebarDoctor() {
  const dispatch = useDispatch();
  const { servicesList } = useSelector((state) => state.doctors);
  const ASK_TATVA_planDetails = servicesList?.find(
    (e) => e.service_name === S_ASK_TATVA
  );

  const { planDetails } = useSelector((state) => state.subscription);
  const { service_mappings } = planDetails || {};
  const EMR_planDetails = service_mappings?.find(
    (e) => e.service_name === S_TATVA_PRACTICE
  );
  const PHARMACY_planDetails = service_mappings?.find(
    (e) => e.service_name === S_PHARMACY
  );
  const IPD_planDetails = service_mappings?.find(
    (e) => e.service_name === S_IPD
  );
  const BILLING_planDetails = service_mappings?.find(
    (e) => e.service_name === S_BILLING
  );

  const tp_monetization_enable = !shouldMonetizationDisabled();

  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );
  const { profile } = useSelector((state) => state.doctors);
  const [tokenData, setTokenData] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tatvaHovered, SetTatvaHovered] = useState(null);
  const [loading, setLoading] = useState(false);

  const [askTatvaKnowMoreDrawer, setAskTatvaKnowMoreDrawer] = useState(false);
  const [iPDKnowMoreDrawer, setIPDKnowMoreDrawer] = useState(false);
  const [pharmacyKnowMoreDrawer, setPharmacyKnowMoreDrawer] = useState(false);
  const [subModalData, setSubModalData] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const navigate = useNavigate();
  const { isOpdBillingAccessable } = useOpdBilling();

  const isApolloConsultationsEnabled = useFeatureIsOn("apollo-consultations");

  const location = useLocation();

  const baseUrl = config.tatvaAi_api_url;
  const tatvaAiURL = config.tatvaAi_url;

  useEffect(() => {
    if (profile) {
      const getStorageData = async () => {
        const token = await getToken();
        if (token !== undefined) {
          try {
            var decoded = jwtDecode(token);
            setTokenData(decoded.result);
            window.beamer_config = {
              ...window.beamer_config,
              product_id: "JBgEuAKX59541",
              filter: profile?.dp_name,
              user_firstname: profile?.um_name,
              user_lastname: "",
              user_id: decoded.result.user_id,
            };
          } catch (e) {
            console.log(e);
          }
        }
      };
      getStorageData();
    }
  }, [profile]);

  const handleAskTatvaKnowMore = () => {
    setAskTatvaKnowMoreDrawer((prev) => !prev);
  };

  const handleIPDKnowMore = () => {
    setIPDKnowMoreDrawer((prev) => !prev);
  };

  const handlePharmacyKnowMore = () => {
    setPharmacyKnowMoreDrawer((prev) => !prev);
  };

  const showHideSubModal = () => {
    setIsSubModalOpen(!isSubModalOpen);
  };

  const isFirstClickOfDay = (key) => {
    const localStorageExtraData = localStorage.getItem(
      PERSISTANT_STORAGE_KEY_EXTRA
    );
    const jsonData = localStorageExtraData
      ? JSON.parse(localStorageExtraData)
      : {};
    const today = moment().format("YYYY-MM-DD");
    if (jsonData[`${key}_date`] !== today) {
      jsonData[`${key}_date`] = today;
      localStorage.setItem(
        PERSISTANT_STORAGE_KEY_EXTRA,
        JSON.stringify(jsonData)
      );
      return true;
    } else {
      return false;
    }
  };

  const clickOldModule = async (moduleName) => {
    if (moduleName === "ipd") {
      navigate("/ipd/inPatients");

      return check_SSO(moduleName);
    }

    // if (moment(planDetails?.plan_active_date).diff("2025-07-01", 'days') > 0) {
    if (
      tp_monetization_enable &&
      (moduleName === S_PHARMACY || moduleName === S_IPD)
    ) {
      setSubModalData({ service_name: moduleName });
      if (
        moduleName === S_PHARMACY &&
        EMR_planDetails?.plan_tier === TRIAL &&
        PHARMACY_planDetails?.plan_tier === TRIAL
      ) {
        if (isFirstClickOfDay(moduleName)) {
          handlePharmacyKnowMore();
        } else {
          check_SSO(moduleName);
        }
      } else if (
        moduleName === S_PHARMACY &&
        EMR_planDetails?.plan_tier !== TRIAL &&
        PHARMACY_planDetails?.plan_tier !== TRIAL
      ) {
        check_SSO(moduleName);
      } else if (
        moduleName === S_PHARMACY &&
        EMR_planDetails?.plan_tier !== TRIAL &&
        PHARMACY_planDetails?.plan_tier === TRIAL
      ) {
        handlePharmacyKnowMore();
      } else if (
        moduleName === S_IPD &&
        EMR_planDetails?.plan_tier === TRIAL &&
        IPD_planDetails?.plan_tier === TRIAL
      ) {
        if (isFirstClickOfDay(moduleName)) {
          handleIPDKnowMore();
        } else {
          check_SSO(moduleName);
        }
      } else if (
        moduleName === S_IPD &&
        EMR_planDetails?.plan_tier !== TRIAL &&
        IPD_planDetails?.plan_tier !== TRIAL
      ) {
        check_SSO(moduleName);
      } else if (
        moduleName === S_IPD &&
        EMR_planDetails?.plan_tier !== TRIAL &&
        IPD_planDetails?.plan_tier === TRIAL
      ) {
        handleIPDKnowMore();
      } else {
        check_SSO(moduleName);
      }
    } else {
      check_SSO(moduleName);
    }
    // } else {
    //   check_SSO(moduleName);
    // }

    // if (tp_monetization_enable && (moduleName === S_PHARMACY || moduleName === S_IPD)) {
    //   setSubModalData({ service_name: moduleName })
    //   if (moduleName === S_PHARMACY && EMR_planDetails?.plan_tier !== TRIAL && PHARMACY_planDetails?.plan_tier === TRIAL) {
    //     handlePharmacyKnowMore()
    //     showHideSubModal()
    //   } else if (moduleName === S_IPD && EMR_planDetails?.plan_tier !== TRIAL && IPD_planDetails?.plan_tier === TRIAL) {
    //     handleIPDKnowMore()
    //     showHideSubModal()
    //   } else {
    //     check_SSO(moduleName);
    //   }
    // } else {
    //   check_SSO(moduleName);
    // }

    // if (tp_monetization_enable && (moduleName === S_PHARMACY || moduleName === S_IPD)) {
    //   setSubModalData({ service_name: moduleName })
    //   if (moduleName === S_PHARMACY) {
    //     handlePharmacyKnowMore()
    //   } else if (moduleName === S_IPD) {
    //     handleIPDKnowMore()
    //   } else {
    //     check_SSO(moduleName);
    //   }
    // } else {
    //   check_SSO(moduleName);
    // }
  };

  async function check_SSO(moduleName) {
    SSO_TO_PM().then(async (data) => {
      // TODO : INTEL - REMOVE - IPD
      console.log("INTEL ==> browser", `${data.url}&module=${moduleName}`);
      console.log(
        "INTEL ==> inapp",
        `/patient_details/?url=${data.url}&module=${moduleName}&key=print`
      );
      if (moduleName === "ipd") {
        navigate("/ipd/inPatients");
      } else if (moduleName === "opd_billing" && isOpdBillingAccessable) {
        navigate("/billing-dashboard");
      } else if (moduleName === "all_patients") {
        navigate("/all_patients");
        trackEvent("TP_AllPatients_Click", {
          clinic_name: getClinicName(profile?.hospital_data),
          clinic_id: tokenData?.result?.clinic_id,
          doctor_id: profile?.doctor_unique_id,
          doctor_name: profile?.um_name,
          doctor_mobile_no: profile?.um_contact,
          device_details: isMobile ? "Tab" : "Web",
        });
      } else {
        if (data.success == 200) {
          if (!isChrome && !isSafari) {
            navigate(`/?url=${data.url}&module=${moduleName}&key=phpRedirect`, {
              replace: true,
            });
            navigate(0, { replace: true });
          } else {
            await window.open(`${data.url}&module=${moduleName}`);
          }
        }
      }
    });
  }

  async function SSO_TO_PM() {
    try {
      const sendData = {
        doctor_unique_id: tokenData.doctor_unique_id,
        mobile_no: tokenData.mobile_no,
        clinic_id: tokenData.clinic_id,
        hm_business_id: tokenData.hospital_business_id,
        from: "app",
      };

      const formData = new FormData();
      Object.keys(sendData).forEach((key) => {
        formData.append(key, sendData[key]);
      });

      const response = await axios.post(config.sso_to_pm_url, formData, {
        auth: {
          username: config.sso_to_pm_username,
          password: config.sso_to_pm_password,
        },
      });

      return response.data;
    } catch (err) {
      console.log(err.message);
      console.log(err.response.status);
    }
  }

  const getIcon = (type, isHovered) => {
    if (isHovered) {
      switch (type) {
        case "ipd":
          return ipdActiveIcon;
        case "all_patients":
          return patientsActiveIcon;
        case "data_analytics":
          return analyticsActiveIcon;
        case "pharmacy":
          return pharmacyActiveIcon;
        case "opd_billing":
          return billingsActiveIcon;
        case "dr_followup_appointment":
          return followUpActiveIcon;
        case "tatva_ai":
          return tatvaAiActiveIcon;
        default:
          return "";
      }
    } else {
      switch (type) {
        case "ipd":
          return ipdIcon;
        case "all_patients":
          return patientsIcon;
        case "data_analytics":
          return analyticsIcon;
        case "pharmacy":
          return pharmacyIcon;
        case "opd_billing":
          return billingsIcon;
        case "dr_followup_appointment":
          return followUpIcon;
        case "tatva_ai":
          return tatvaAiIcon;
        default:
          return "";
      }
    }
  };

  const handleTatvaAi = async () => {
    try {
      setLoading(true);
      window.Moengage.track_event("TP_TatvaAI_Open", {
        Doctor_Name: profile?.um_name,
        Doctor_Number: profile?.um_contact,
        Doctor_Unique_Id: profile?.doctor_unique_id,
        Doctor_Um_Id: tokenData?.user_id,
        Payment_Status: planDetails?.currentPlanStatus,
      });
      const token = await getToken();

      const response = await axios.post(
        `${baseUrl}/api/v1/practice/tatva-ai-token`,
        {
          mobileNumber: `91${profile?.um_contact}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract the token from the response
      const tatvaAitoken = response.data.data.token;

      // Construct the new URL with the token
      const newUrl = `${tatvaAiURL}/login?authToken=${tatvaAitoken}&app=ask_tatva`;

      setLoading(false);

      if (!isChrome && !isSafari) {
        navigate(`/?url=${newUrl}&key=phpRedirect`, { replace: true });
        navigate(0, { replace: true });
      } else {
        await window.open(newUrl, "_blank");
      }
    } catch (error) {
      setLoading(false);
      console.error("API Error:", error);
      errorMessage(error.message);
    }
  };

  const checkTatvaAiPurchased = async () => {
    setSubModalData({ service_name: S_ASK_TATVA });
    if (
      ASK_TATVA_planDetails?.plan_tier === FREE &&
      ASK_TATVA_planDetails?.credit_balance <= 0
    ) {
      showHideSubModal();
    } else if (ASK_TATVA_planDetails?.plan_tier === FAILED_VERIFICATION) {
      showHideSubModal();
    } else {
      let sendData = {
        b2c_id: profile?.b2c,
        service_name: S_ASK_TATVA,
      };
      const action = await dispatch(checkCredits(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        if (action?.payload?.hasOwnProperty("service_name")) {
          if (
            action?.payload?.plan_tier === FREE &&
            action?.payload?.credit_balance <= 0
          ) {
            if (
              action?.payload?.credit_balance !=
              ASK_TATVA_planDetails?.credit_balance
            ) {
              await dispatch(services(sendData?.b2c_id));
            }
            showHideSubModal();
          } else if (action?.payload?.plan_tier === FAILED_VERIFICATION) {
            showHideSubModal();
          } else {
            handleTatvaAi();
          }
        } else {
          typeof action?.payload?.data?.error === "object"
            ? errorMessage(action?.payload?.data?.error?.description)
            : errorMessage(action?.payload?.data?.message);
        }
      } else {
        errorMessage(action.payload.message);
      }
    }
  };

  const tatvaAiRedirectOrDrawer = () => {
    if (tp_monetization_enable) {
      if (
        ASK_TATVA_planDetails?.plan_tier === FREE &&
        ASK_TATVA_planDetails?.credit_balance > 0
      ) {
        if (isFirstClickOfDay(S_ASK_TATVA)) {
          handleAskTatvaKnowMore();
        } else {
          checkTatvaAiPurchased();
        }
      } else if (ASK_TATVA_planDetails?.plan_tier !== FREE) {
        checkTatvaAiPurchased();
      } else if (
        ASK_TATVA_planDetails?.plan_tier === FREE &&
        ASK_TATVA_planDetails?.credit_balance <= 0
      ) {
        handleAskTatvaKnowMore();
      }
    } else {
      handleTatvaAi();
    }
  };

  const handleHover = (data) => {
    if (data) {
      setHoveredItem(null);
      SetTatvaHovered(true);
    } else {
      SetTatvaHovered(false);
    }
  };

  return (
    <>
      <div className="SidebarDoctor">
        <div className="scrollable-content">
          <NavLink
            to="/"
            replace={true}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            <i className="icon-calendarfill"></i>
            <div className="mt-1 px-2">
              {isMobile ? (
                "Appt"
              ) : (
                <div className="text-truncate">Appointment</div>
              )}
            </div>
          </NavLink>

          <NavLink
            replace={true}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : tatvaHovered ? "active" : ""
            }
          >
            <div
              className={`d-flex align-items-center flex-column ${
                tatvaHovered ? "hoveredColor" : ""
              }`}
              onMouseEnter={() => handleHover(true)} // Set the hovered item
              onMouseLeave={() => handleHover(false)} // Clear the hovered item
              onClick={tatvaAiRedirectOrDrawer}
            >
              <img src={getIcon("tatva_ai", tatvaHovered)} alt="tatva_ai" />
              <div
                className={`mt-1 px-2 ${tatvaHovered ? "hoveredColor" : ""}`}
                style={{ fontSize: "12px", fontWeight: "500" }}
              >
                Ask Tatva
              </div>
            </div>
            {/* <img
              src={newGif}
              className="mx-auto d-block text-center mb-2 position-absolute sidebar-message"
              style={{ right: -4, top: 6, zIndex: -1 }}
              alt="New"
            /> */}
            {/* <div className="trial-sidebar">
              {(ASK_TATVA_planDetails?.plan_tier === FREE && ASK_TATVA_planDetails?.credit_balance > 0) ? (
                <span>Trial</span>
              ) : (ASK_TATVA_planDetails?.plan_tier === FREE && ASK_TATVA_planDetails?.credit_balance <= 0) && (
                <img src={LockIcon} alt="Trial" />
              )}
            </div> */}
          </NavLink>

          {profile &&
            profile?.module_data
              ?.filter(
                (item) =>
                  item?.type !== "MyT_patient" && item?.type !== "dis_patient"
              )
              ?.map((item, i) => {
                const isHovered = hoveredItem === i;
                return (
                  <div className="position-relative">
                    <NavLink
                      key={i}
                      onClick={() => clickOldModule(item.type)}
                      replace={true}
                      className={({ isActive, isPending }) =>
                        item.type === "opd_billing" &&
                        window.location.pathname === "/billing-dashboard"
                          ? "active"
                          : isHovered
                          ? ""
                          : isPending
                          ? "pending"
                          : isActive
                          ? ""
                          : "active"
                      }
                      onMouseEnter={() => setHoveredItem(i)} // Set the hovered item
                      onMouseLeave={() => setHoveredItem(null)} // Clear the hovered item
                    >
                      <img
                        src={getIcon(item.type, isHovered)}
                        alt={`${item.type}`}
                      />
                      <div className="mt-1 px-2">{item.title}</div>
                    </NavLink>
                    {/* {moment(planDetails?.plan_active_date).diff("2025-07-01", 'days') > 0 && */}
                    {tp_monetization_enable &&
                      (item.type === S_PHARMACY ? (
                        <div className="trial-sidebar">
                          {EMR_planDetails?.plan_tier === TRIAL &&
                          PHARMACY_planDetails?.plan_tier === TRIAL ? (
                            <span>Trial</span>
                          ) : (
                            EMR_planDetails?.plan_tier !== TRIAL &&
                            PHARMACY_planDetails?.plan_tier === TRIAL && (
                              <img src={LockIcon} alt="Trial" />
                            )
                          )}
                        </div>
                      ) : item.type === S_IPD ? (
                        <div className="trial-sidebar">
                          {EMR_planDetails?.plan_tier === TRIAL &&
                          IPD_planDetails?.plan_tier === TRIAL ? (
                            <span>Trial</span>
                          ) : (
                            EMR_planDetails?.plan_tier !== TRIAL &&
                            IPD_planDetails?.plan_tier === TRIAL && (
                              <img src={LockIcon} alt="Trial" />
                            )
                          )}
                        </div>
                      ) : (
                        item.type === S_OPD_BILLING && (
                          <div className="trial-sidebar">
                            {EMR_planDetails?.plan_tier === TRIAL &&
                            BILLING_planDetails?.plan_tier === TRIAL ? (
                              <span>Trial</span>
                            ) : (
                              EMR_planDetails?.plan_tier !== TRIAL &&
                              BILLING_planDetails?.plan_tier === TRIAL && (
                                <img src={LockIcon} alt="Trial" />
                              )
                            )}
                          </div>
                        )
                      ))}
                  </div>
                );
              })}

          {isApolloConsultationsEnabled && (
            <NavLink
              to="/apollo-consultations"
              replace={true}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              onMouseEnter={() => setHoveredItem(true)} // Set the hovered item
              onMouseLeave={() => setHoveredItem(null)} // Clear the hovered item
            >
              <img
                src={getIcon(
                  "data_analytics",
                  hoveredItem || location.pathname === "/apollo-consultations"
                )}
                alt="apollo"
              />
              <div className="mt-1 px-2">
                <div>Apollo analytics</div>
              </div>
            </NavLink>
          )}
        </div>

        {loading && <FullPageLoader />}

        {profile?.ownerDoctor === 1 && (
          <NavLink
            to="/bulk_messages"
            replace={true}
            style={{ marginTop: "8px" }}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            <i className="icon-calendarfill"></i>
            <div className="mt-1 px-2">
              <div className="mt-1 px-2">
                {isMobile ? (
                  "Message"
                ) : (
                  <div className="text-truncate">Messages</div>
                )}
              </div>
              {/* <img
                src={newGif}
                className="mx-auto d-block text-center mb-2 position-absolute sidebar-message"
                style={{ right: -4, top: 6, zIndex: -1 }}
                alt="New"
              /> */}
            </div>
          </NavLink>
        )}
        <div>
          <Button
            className="btn btn-delete-prescription mx-auto d-block p-0 mt-2"
            onClick={() =>
              window.Moengage.track_event("announcement_button_clicked")
            }
            id="beamerButton"
          >
            <i className="icon-announcement fs-3"></i> <br />
          </Button>
          {/* <img
            src={newGif}
            width={42}
            className="mx-auto d-block text-center mb-2"
            alt="New"
          /> */}
        </div>
      </div>

      <Drawer
        closeIcon={false}
        placement="right"
        open={askTatvaKnowMoreDrawer}
        onClose={handleAskTatvaKnowMore}
        className=".modalWidth-800"
        width={600}
      >
        <AskTatvaKnowMore
          handleAskTatvaKnowMore={handleAskTatvaKnowMore}
          onRedirect={checkTatvaAiPurchased}
        />
      </Drawer>

      <Drawer
        closeIcon={false}
        placement="right"
        open={iPDKnowMoreDrawer}
        onClose={handleIPDKnowMore}
        className=".modalWidth-800"
        width={600}
      >
        <IPDKnowMore
          handleIPDKnowMore={handleIPDKnowMore}
          onRedirect={() => check_SSO(subModalData?.service_name)}
        />
      </Drawer>

      <Drawer
        closeIcon={false}
        placement="right"
        open={pharmacyKnowMoreDrawer}
        onClose={handlePharmacyKnowMore}
        className=".modalWidth-800"
        width={600}
      >
        <PharmacyKnowMore
          handlePharmacyKnowMore={handlePharmacyKnowMore}
          onRedirect={() => check_SSO(subModalData?.service_name)}
        />
      </Drawer>

      <ExpiredSubModal
        title={
          subModalData &&
          subModalData?.hasOwnProperty("service_name") &&
          subModalData?.service_name
        }
        isSubModalOpen={isSubModalOpen}
        showHideSubModal={showHideSubModal}
      />
    </>
  );
}

export default React.memo(SidebarDoctor);
