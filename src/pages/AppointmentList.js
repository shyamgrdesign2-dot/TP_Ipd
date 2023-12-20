import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isTablet } from 'react-device-detect';

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import Appointment from "../components/Appointment";
import AddNewPatient from "./AddNewPatient";
import NewWalkInConsultation from "./NewWalkInConsultation";
import TabConsultationHeader from "../components/tab_design/TabConsultationHeader";

function AppointmentList() {

  let location = useLocation();


  const [flag, setFlag] = useState(0);
  const [locationPath, setLocationPath] = useState('/');


  useEffect(() => {
    setLocationPath(location.pathname)
  }, [location])

  return (
    <>
      {!isTablet && (<Header />)}
      <div className="d-flex">
        {!isTablet && (<SidebarDoctor />)}
        <div className="w-100 bg-body wrapper custom-scroll">
          {!isTablet ? (
            <Welcome
              locationPath={locationPath}
              backVisible={locationPath == '/' ? false : true}
            />
          ) : (
            <TabConsultationHeader />
          )}
          <Routes>
            <Route path="/" element={<Appointment />} />
            <Route path="walk_in_consultation" element={<NewWalkInConsultation />} />
            <Route path="add_new_patient" element={<AddNewPatient />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppointmentList;
