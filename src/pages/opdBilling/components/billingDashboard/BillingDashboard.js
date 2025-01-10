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
import TableBillingDashboard from "./TableBillingDashboard";
import { Button, Drawer } from "antd";
import "./BillingDashboard.scss";
import Vaccination from "../../../vaccination/Vaccination";
import Manage3cBill from "../manage3cBills/Manage3cBills";

function BillingDashboard() {
  const dispatch = useDispatch();
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const { profile } = useSelector((state) => state.doctors);
  const [selectedTab, setSelectedTab] = useState("billingtable");

  // Drawer states 
  const [form3cDrawer, setForm3cDrawer] = useState(false);

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

  // Drawer form 3c
  const handleManage3cBill = () => {
    setForm3cDrawer(!form3cDrawer);
  };
  const handleCreateNewBill = () => {
    setForm3cDrawer(!form3cDrawer);
  };
  const handleAddAdvance = () => {
    setForm3cDrawer(!form3cDrawer);
  };

  return (
    <>
      <Header locationPath={locationPath} />
      <div className="d-flex billing-dashboard-wraper">
        <SidebarDoctor activeItem={"opd-billing"} />
        <div className="w-100 bg-body wrapper">
          <>
            <div className="welcomesection position-relative">
              <div className="bg-welcome d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div>
                    <h1>OPD Billing</h1>
                  </div>
                  <img
                    src={require("../../../../assets/images/bg-welcome.png")}
                    className="welcomeig d-inline-block align-top"
                    alt="Welcome"
                  />
                </div>
                <div className="d-flex gap-1">
                  {selectedTab === "billingtable" ? (
                    <div className="d-lg-flex d-block gap-2">
                      <Button className="btn-manage-bill" onClick={handleManage3cBill}>
                        <span>{"Manage Form 3c Bills"}</span>
                      </Button>
                      <Button className="btn-create-bill" onClick={handleCreateNewBill}>
                        <span>{"+"}</span>
                        <span>{"Create New Bill"}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button className="btn-create-bill" onClick={handleAddAdvance}>
                      <span>{"+"}</span>
                      <span>{"Add Advance Deposit"}</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="pb-5">&nbsp;</div>
            </div>
          </>
          <TableBillingDashboard onTabChange={setSelectedTab} />
        </div>

        {form3cDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleManage3cBill}
            open={form3cDrawer}
            width="100%"
          >
            <Manage3cBill handleForm3cBill={handleManage3cBill}/>
          </Drawer>
        )}
      </div>
    </>
  );
}

export default BillingDashboard;
