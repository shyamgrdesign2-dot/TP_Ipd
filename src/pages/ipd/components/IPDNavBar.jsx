import React from "react";
import { NavLink } from "react-router-dom";

import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";

function IPDNavbar() {
  return (
    <>
      <div className="SidebarDoctor">
        <div>
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
      </div>
    </>
  );
}

export default React.memo(IPDNavbar);
