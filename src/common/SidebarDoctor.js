import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import axios from "axios";

import config from "../config";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
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
import tatvaAiActiveIcon from "../assets/images/website-images/tatvaAiActiveIcon.svg";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { errorMessage, getClinicName, trackEvent } from "../utils/utils";
import FullPageLoader from "../pages/vaccination/components/Loader";
import { useOpdBilling } from "../pages/opdBilling/useOpdBilling";

function SidebarDoctor() {
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );
  const { profile } = useSelector((state) => state.doctors);
  const { planDetails } = useSelector((state) => state.subscription);
  const [tokenData, setTokenData] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tatvaHovered, SetTatvaHovered] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const clickOldModule = (moduleName) => {
    SSO_TO_PM().then(async (data) => {
      if (moduleName === "opd_billing" && isOpdBillingAccessable) {
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
  };

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
      const newUrl = `${tatvaAiURL}/login?authToken=${tatvaAitoken}`;

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
              onClick={handleTatvaAi}
            >
              <img src={getIcon("tatva_ai", tatvaHovered)} alt="tatva_ai" />
              <div
                className={`mt-1 px-2 ${tatvaHovered ? "hoveredColor" : ""}`}
                style={{ fontSize: "12px", fontWeight: "500" }}
              >
                TatvaAI
              </div>
            </div>
            <img
              src={newGif}
              className="mx-auto d-block text-center mb-2 position-absolute sidebar-message"
              style={{ right: -4, top: 6, zIndex: -1 }}
              alt="New"
            />
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
              <img
                src={newGif}
                className="mx-auto d-block text-center mb-2 position-absolute sidebar-message"
                style={{ right: -4, top: 6, zIndex: -1 }}
                alt="New"
              />
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
          <img
            src={newGif}
            width={42}
            className="mx-auto d-block text-center mb-2"
            alt="New"
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarDoctor);
