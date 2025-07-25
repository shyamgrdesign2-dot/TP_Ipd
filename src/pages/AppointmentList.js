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
import ExtendTrialModal from "./monetization/components/ExtendTrialModal";
import { getClinicName, getTokenData } from "../utils/utils";
import DocumentVerificationPopup from "../components/common/DocumentVerificationPopup";
import config from "../config";
import { getDecodedToken } from "../utils/localStorage";
import { fetchAgents } from "./appointmentAgent/service";

function AppointmentList() {
  const dispatch = useDispatch();
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const { profile } = useSelector((state) => state.doctors);
  const urlParams = new URLSearchParams(window.location.search);
  const isReceptionist = urlParams.has("receptionist");
  const {hospital_business_id} = getTokenData() || {};
  const isZydus = hospital_business_id === config.ZYDUS_BUSINESS_ID;
  const isApollo = config.APOLLO_BUSINESS_IDS.includes(hospital_business_id);
  const [agentsData, setAgentsData] = useState(null);
  
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

  const fetchAgentsData = async () => {
    if (!isReceptionist) {
      // setIsAgentsLoading(true);
      try {
        const decodedToken = getDecodedToken();
        const clinicId = String(decodedToken?.result?.clinic_id);
        const response = await fetchAgents(clinicId);
        if (response) {
          setAgentsData(response.length > 0 && response[response.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    }
  };

  useEffect(() => {
    if (!isReceptionist) {
      fetchAgentsData();
    }
  }, []);

  return (
    <>
      {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && !isReceptionist && <Header locationPath={locationPath} />}
      <div className="d-flex">
        {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && !isReceptionist && <SidebarDoctor />}
        <div className={`w-100 bg-body ${isMobile && locationPath != '/' && locationPath != '/bulk_messages' ? 'vh-100' : 'wrapper'}`}>
          {(!isMobile || locationPath == "/" || locationPath == "/bulk_messages") && !isReceptionist && (
            <Welcome
              locationPath={locationPath}
              appointmentAgentsData={agentsData}
              backVisible={locationPath == "/" || locationPath == "/bulk_messages" ? false : true}
            />
          )}
          <Routes>
            <Route path="/" element={<Appointment locationPath={locationPath} appointmentAgentsData={agentsData} />} />
            <Route path="walk_in_consultation" element={<WalkInConsultation />} />
            <Route path="walk_in_consultation_zydus" element={<WalkInConsultationZydus />} />
            <Route path="add_patient" element={<AddNewPatient />} />
            <Route path="edit_patient" element={<EditNewPatient />} />
            <Route path="bulk_messages" element={<MessagesData />} />
          </Routes>
          {(!isZydus && !isApollo) && <DocumentVerificationPopup />}
        </div>
      </div>

      <ExtendTrialModal />
    </>
  );
}

export default AppointmentList;
