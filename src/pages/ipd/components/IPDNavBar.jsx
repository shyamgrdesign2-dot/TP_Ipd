import React from "react";
import { NavLink } from "react-router-dom";
import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";
import { defaultIcons } from "../../../assets/images/dischargeSummaryIcons";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";

function IPDNavbar() {
  const handleTestingIframe = () => {
    let token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    console.log("intel ==> token", token);
    const url = `https://pm-uat-dhspl-2.tatvacare.in/login_tatvacare_dr.php?type=1&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkb2N0b3JfdW5pcXVlX2lkIjoiMmNBS2U5RlVidkdSSnROIiwibW9iaWxlX25vIjoiOTc0MjYzOTk1OCIsInBhdGllbnRfdW5pcXVlX2lkIjoiIiwiYXBwb2ludG1lbnRfaWQiOiIiLCJjbGluaWNfaWQiOiIzNjgiLCJobV9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsImV4cCI6MTc2MTgyNjI4OX0.-7BZa1PZKpXdBQRvrDXU-ol6bOgBB9zbfHbDvopFxGE&module=ipd`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="SidebarDoctor">
      <div>
        <NavLink to="/ipd/inPatients" replace={true}>
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
        <NavLink to="/ipd/dischargedPatients" replace={true}>
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
      <div>
        <NavLink onClick={handleTestingIframe} to="#" replace={true}>
          {({ isActive }) => (
            <>
              <img
                src={
                  isActive
                    ? defaultIcons.dischargedPatientsPc
                    : defaultIcons.dischargedPatientsOutline
                }
                alt="testIframe"
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>
                  TESTING IFRAME
                </div>
              </div>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default React.memo(IPDNavbar);
