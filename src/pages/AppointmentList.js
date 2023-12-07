import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import Appointment from "../components/Appointment";
import AddNewPatient from "./AddNewPatient";
import WalkInConsultation from "../components/WalkInConsultation";

function AppointmentList() {

  let location = useLocation();


  const [flag, setFlag] = useState(0);
  const [locationPath, setLocationPath] = useState('/');


  useEffect(() => {
    setLocationPath(location.pathname)
  }, [location])

  return (
    <>
      <Header />
      <div className="d-flex">
        <SidebarDoctor />
        <div className="w-100 bg-body wrapper custom-scroll">
          <Welcome
            locationPath={locationPath}
            backVisible={locationPath == '/' ? false : true}
          />
          <Routes>
            <Route path="/" element={<Appointment />} />
            <Route path="walk_in_consultation" element={<WalkInConsultation />} />
            <Route path="add_new_patient" element={<AddNewPatient />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppointmentList;
