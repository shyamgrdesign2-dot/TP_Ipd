import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Header from "../../../../common/Header";
import SidebarDoctor from "../../../../common/SidebarDoctor";
import Welcome from "../../../../common/Welcome";

import { useSelector, useDispatch } from "react-redux";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import { setUserId } from "../../../../redux/doctorsSlice";
import { getClinicName } from "../../../../utils/utils";
import WelcomeBillingDashboard from "./WelcomeBillingDashboard";
import TableBillingDashboard from "./TableBillingDashboard";


function BillingDashboard() {
  const dispatch = useDispatch();
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const { profile } = useSelector((state) => state.doctors);

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);
  
  useEffect(() => {
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("TP_Appointment_Page_Landing", {
      clinic_name,
    });
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    try {
      const decoded = jwtDecode(token);
      if (decoded?.result?.user_id) {
        dispatch(setUserId(decoded.result));
      }
    } catch (e) {
      console.error("Error while token decoding: ", e);
    }
  }, []);

  return (
    <>
      <Header locationPath={locationPath} />
      <div className="d-flex">
        <SidebarDoctor activeItem={"opd-billing"}/>
        <div className="w-100 bg-body wrapper">
          <WelcomeBillingDashboard />
          <TableBillingDashboard/>
        </div>
      </div>
    </>
  );
}

export default BillingDashboard;