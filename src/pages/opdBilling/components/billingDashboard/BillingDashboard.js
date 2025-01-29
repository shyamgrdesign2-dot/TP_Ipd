import React, { useCallback, useEffect, useState } from "react";
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
import AddForm3cBills from "../manage3cBills/AddForm3cBills";
import visitEnd from '../../../../assets/images/end-visit.svg';
import imgCloseVisit from '../../../../assets/images/close-visit.svg';
import { clearSearch } from "../../../../redux/appointmentsSlice";
import AddAdvance from "../advanceDeposit/AddAdvance";
import CreateBill from "../createBill/CreateBill";

function BillingDashboard() {
  const dispatch = useDispatch();
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const { profile } = useSelector((state) => state.doctors);
  const [selectedTab, setSelectedTab] = useState("billingtable");

  // Drawer states
  const [form3cDrawer, setForm3cDrawer] = useState(false);
  const [addForm3cDrawer, setAddform3cDrawer] = useState(false);
  const [addAdvanceDrawer, setAddAdvanceDrawer] = useState(false);
  const [createBillDrawer, setCreateBillDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

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

  const handleCreateBillDrawer = useCallback(() => {
    setCreateBillDrawer(!createBillDrawer);
  }, [createBillDrawer]);

    const showHideBackModal = () => {
      setIsBackModalOpen(!isBackModalOpen);
    };

  // Add form 3c drawer
  const handleAddForm3cDrawer = () => {
    setAddform3cDrawer(!addForm3cDrawer);
    setForm3cDrawer(!form3cDrawer);
  };

  console.log("addForm3cDrawer",addForm3cDrawer)
  console.log("form3cDrawer",form3cDrawer)

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
                      <Button
                        className="btn-manage-bill"
                        onClick={handleManage3cBill}
                      >
                        <span>{"Manage Form 3c Bills"}</span>
                      </Button>
                      <Button
                        className="btn-create-bill"
                        onClick={handleCreateBillDrawer}
                      >
                        <span style={{fontSize:"22px"}}>{"+"}</span>
                        <span>{"Create New Bill"}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="btn-create-bill"
                      onClick={handleAddAdvance}
                    >
                      <span style={{fontSize:"22px"}}>{"+"}</span>
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
            <Manage3cBill handleForm3cBill={handleManage3cBill} handleAddForm3cBill={handleAddForm3cDrawer}/>
          </Drawer>
        )}

        {addForm3cDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleAddForm3cDrawer}
            open={addForm3cDrawer}
            width="100%"
          >
            <AddForm3cBills handleAddForm3cBill={handleAddForm3cDrawer} />
          </Drawer>
        )}
        {createBillDrawer &&(<Drawer
          closeIcon={false}
          placement="right"
          bodyStyle={{ backgroundColor: "white" }}
          open={createBillDrawer}
          onClose={showHideBackModal}
          width="100%"
          push={false}
          >
              <CreateBill handleCreateBillDrawer={handleCreateBillDrawer} isBackModalOpen={isBackModalOpen} showHideBackModal={showHideBackModal} patientData={{}} />
          </Drawer>)}
      </div>
    </>
  );
}

export default BillingDashboard;
