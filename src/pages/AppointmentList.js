import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import Appointment from "../components/AppointmentData";
import AddNewPatient from "./AddNewPatient";
import WalkInConsultation from "./WalkInConsultation";

function AppointmentList() {
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const [clinicChanged, setClinicChanged] = useState();

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  return (
    <>
      {(!isMobile || locationPath == "/") && <Header onClickChanged={setClinicChanged} />}
      <div className="d-flex">
        {(!isMobile || locationPath == "/") && <SidebarDoctor />}
        <div className="w-100 bg-body wrapper custom-scroll">
          {(!isMobile || locationPath == "/") && (
            <Welcome
              locationPath={locationPath}
              backVisible={locationPath == "/" ? false : true}
            />
          )}
          <Routes>
            <Route path="/" element={<Appointment clinicChanged={clinicChanged} />} />
            <Route path="walk_in_consultation" element={<WalkInConsultation />} />
            <Route path="add_new_patient" element={<AddNewPatient />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppointmentList;
