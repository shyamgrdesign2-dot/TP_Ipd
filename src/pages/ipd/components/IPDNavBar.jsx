import React from "react";
import { NavLink } from "react-router-dom";
import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";
import { defaultIcons } from "../../../assets/images/dischargeSummaryIcons";
import { getTokenData } from "../../../utils/utils";
import axios from "axios";
import config from "../../../config";
import { env } from "../../../EnvironmentConfig";
import { GB_ZYDUS_USER } from "../../../utils/constants";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

function IPDNavbar() {
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  async function SSO_TO_PM() {
    const tokenData = await getTokenData();
    try {
      const sendData = {
        doctor_unique_id: tokenData?.doctor_unique_id,
        mobile_no: tokenData?.mobile_no,
        clinic_id: tokenData?.clinic_id,
        hm_business_id: tokenData?.hospital_business_id,
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
      console.log(err.response?.status);
    }
  }

  const izZydusUser =
    getTokenData()?.hospital_business_id == env.zydus_business_id &&
    isZydusUserAccessableFromGB;

  const handleWardBedManagementClick = async () => {
    SSO_TO_PM().then(async (data) => {
      if (data.success == 200) {
        await window.open(`${data.url}&module=ipd&key=print`, "_blank");
      }
    });
  };

  return (
    <div className="SidebarDoctor ipd-sidebar">
      <div>
        <NavLink to="/ipd/inPatients" replace={true} end>
          {({ isActive }) => (
            <>
              <img
                src={patientsActiveIcon}
                alt="InPatients"
                style={{
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                }}
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>InPatients</div>
              </div>
            </>
          )}
        </NavLink>
      </div>

      <div>
        <NavLink to="/ipd/dischargedPatients" replace={true} end>
          {({ isActive }) => (
            <>
              <img
                src={
                  isActive
                    ? defaultIcons.dischargedPatientsPc
                    : defaultIcons.dischargedPatientsOutline
                }
                alt="Discharged Patients"
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>
                  Discharged Patients
                </div>
              </div>
            </>
          )}
        </NavLink>
      </div>
      {!izZydusUser ? (
        <div>
          <NavLink
            to="/ipd/ward-bed-management"
            onClick={(e) => {
              e.preventDefault();
              handleWardBedManagementClick();
            }}
          >
            {() => (
              <>
                <img
                  src={defaultIcons.wardBedManagementOutline}
                  alt="Ward/Bed Management"
                  style={{ filter: "grayscale(100%)" }}
                />
                <div className="mt-1 px-2">
                  <div>ATD & Ward/Bed Management</div>
                </div>
              </>
            )}
          </NavLink>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(IPDNavbar);
