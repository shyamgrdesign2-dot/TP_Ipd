import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";
import { defaultIcons } from "../../../assets/images/dischargeSummaryIcons";
import { getTokenData } from "../../../utils/utils";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";

function IPDNavbar() {
  const [showIframe, setShowIframe] = useState(false);
  const handleTestingIframe = () => {
    setShowIframe(true);
  };

  const closeIframe = () => {
    setShowIframe(false);
  };

  if (showIframe) {
    let token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    return (
      <div>
        <iframe
          src={`http://localhost:3000/login_tatvacare_dr.php?type=1&token=${token}&module=ipd&key=print`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Wikipedia"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
          }}
        />
      </div>
    );
  }
  return (
    <div className="SidebarDoctor">
      <div>
        <NavLink onClick={closeIframe} to="/ipd/inPatients" replace={true}>
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
        <NavLink
          onClick={closeIframe}
          to="/ipd/dischargedPatients"
          replace={true}
        >
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
