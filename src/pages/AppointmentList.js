import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import Appointment from "../components/AppointmentData";
import AddNewPatient from "./AddNewPatient";
import EditNewPatient from "./EditNewPatient";
import WalkInConsultation from "./WalkInConsultation";
import MessagesData from "./MessagesData";

import { useSelector, useDispatch } from "react-redux";
import WalkInConsultationZydus from "./WalkInConsultationZydus";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import { setUserId } from "../redux/doctorsSlice";
import { getClinicName } from "../utils/utils";
import ExtendTrialModal from "./monetization/components/ExtendTrialModal";


function AppointmentList() {
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
      {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && <Header locationPath={locationPath} />}
      <div className="d-flex">
        {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && <SidebarDoctor />}
        <div className={`w-100 bg-body ${isMobile && locationPath != '/' && locationPath != '/bulk_messages' ? 'vh-100' : 'wrapper'}`}>
          {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && (
            <Welcome
              locationPath={locationPath}
              backVisible={locationPath == "/" || locationPath == "/bulk_messages" ? false : true}
            />
          )}
          <Routes>
            <Route path="/" element={<Appointment locationPath={locationPath} />} />
            <Route path="walk_in_consultation" element={<WalkInConsultation />} />
            <Route path="walk_in_consultation_zydus" element={<WalkInConsultationZydus />} />
            <Route path="add_patient" element={<AddNewPatient />} />
            <Route path="edit_patient" element={<EditNewPatient />} />
            <Route path="bulk_messages" element={<MessagesData />} />
          </Routes>
        </div>
      </div>

      <ExtendTrialModal />
    </>
  );
}

export default AppointmentList;