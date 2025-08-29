import React, { useState, useEffect } from "react";
import { Button, Drawer } from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import config from "../../../config";
import { useLocalStorage } from "../../../utils/localStorage";
import {
  FREE,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
  S_ASK_TATVA,
  S_IPD,
  S_PHARMACY,
  S_BILLING,
  TRIAL,
  S_TATVA_PRACTICE,
  PERSISTANT_STORAGE_KEY_EXTRA,
  FAILED_VERIFICATION,
} from "../../../utils/constants";

import { useFeatureIsOn } from "@growthbook/growthbook-react";
import {
  errorMessage,
  getClinicName,
  shouldMonetizationDisabled,
  trackEvent,
} from "../../../utils/utils";
import FullPageLoader from "../../../pages/vaccination/components/Loader";
import { useOpdBilling } from "../../../pages/opdBilling/useOpdBilling";
import moment from "moment";
import { checkCredits } from "../../../redux/monetizationSlice";
import { services } from "../../../redux/doctorsSlice";
import ExpiredSubModal from "../../../pages/monetization/components/ExpiredSubModal";
import IPDKnowMore from "../../../pages/monetization/components/IPDKnowMore";
import PharmacyKnowMore from "../../../pages/monetization/components/PharmacyKnowMore";
import AskTatvaKnowMore from "../../../pages/monetization/components/AskTatvaKnowMore";
import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";

function IPDNavbar() {
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

  async function check_SSO(moduleName) {
    SSO_TO_PM().then(async (data) => {
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

  return (
    <>
      <div className="SidebarDoctor">
        <div className="scrollable-content">
          <NavLink
            to="/ipd/inPatients"
            replace={true}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            <img src={patientsActiveIcon} alt="InPatients" />
            <div className="mt-1 px-2">
              <div className="text-truncate">InPatients</div>
            </div>
          </NavLink>
        </div>

        {loading && <FullPageLoader />}
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

export default React.memo(IPDNavbar);
