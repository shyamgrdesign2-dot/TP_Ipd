import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isTablet } from "react-device-detect";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import Appointment from "../components/Appointment";
import AddNewPatient from "./AddNewPatient";
import NewWalkInConsultation from "./NewWalkInConsultation";
import TabConsultationHeader from "../components/tab_design/TabConsultationHeader";

function AppointmentList() {
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const [addPatient, setAddPatient] = useState(false);
  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  return (
    <>
      {(!isTablet || locationPath == "/") && <Header />}
      <div className="d-flex">
        {(!isTablet || locationPath == "/") && <SidebarDoctor />}
        <div className="w-100 bg-body wrapper custom-scroll">
          {!isTablet || locationPath == "/" ? (
            <Welcome
              locationPath={locationPath}
              backVisible={locationPath == "/" ? false : true}
            />
          ) : (
            <TabConsultationHeader setAddPatient={setAddPatient} isFormValid={isFormValid} />
          )}
          <Routes>
            <Route path="/" element={<Appointment />} />
            <Route
              path="walk_in_consultation"
              element={<NewWalkInConsultation />}
            />
            <Route
              path="add_new_patient"
              element={
                <AddNewPatient
                  addPatientMutate={addPatient}
                  setFormValidForToolbar={setFormValid}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppointmentList;
