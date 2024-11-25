import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Appointment from "../components/AppointmentData";
import Welcome from "../common/Welcome";

function MessagesList() {
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  return (
    <>
      {(!isMobile || locationPath == "/bulk_messages") && <Header locationPath={locationPath} />}
      <div className="d-flex">
        {(!isMobile || locationPath == "/bulk_messages") && <SidebarDoctor />}
        <div className={`w-100 bg-body ${isMobile && locationPath != '/bulk_messages' ? 'vh-100' : 'wrapper-message'}`}>
          {(!isMobile || locationPath == "/bulk_messages") && (
            <Welcome
              locationPath={locationPath}
              backVisible={locationPath == "/bulk_messages" ? false : true}
            />
          )}
          <Routes>
            <Route path="/" element={<Appointment locationPath={locationPath} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default MessagesList;