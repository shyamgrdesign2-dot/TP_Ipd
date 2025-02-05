import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import Header from "../../../../common/Header";
import SidebarDoctor from "../../../../common/SidebarDoctor";
import Welcome from "../../../../common/Welcome";

import { useSelector, useDispatch } from "react-redux";
import {
  MESSAGE_KEY,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
} from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import { setUserId } from "../../../../redux/doctorsSlice";
import { getClinicName } from "../../../../utils/utils";
import TableBillingDashboard from "./TableBillingDashboard";
import { Button, Drawer } from "antd";
import "./BillingDashboard.scss";
import Vaccination from "../../../vaccination/Vaccination";
import Manage3cBill from "../manage3cBills/Manage3cBills";
import AddForm3cBills from "../manage3cBills/AddForm3cBills";
import addCircleIcon from "../../../../assets/images/add-circle.svg";
import visitEnd from "../../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../../assets/images/close-visit.svg";
import { clearSearch } from "../../../../redux/appointmentsSlice";
import AddAdvance from "../advanceDeposit/AddAdvance";
import CreateBill from "../createBill/CreateBill";

function BillingDashboard({ patientData }) {
  const dispatch = useDispatch();
  let location = useLocation();
  const [locationPath, setLocationPath] = useState("/");
  const { profile } = useSelector((state) => state.doctors);
  const [selectedTab, setSelectedTab] = useState("billingtable");
  const [form3cData, setForm3cData] = useState(null);
  const [totalAdvanceBalance, setTotalAdvanceBalance] = useState(null);

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
    setForm3cData(null);
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

  // Add Advance Drawer
  const handleAddAdvanceDrawer = () => {
    setAddAdvanceDrawer(!addAdvanceDrawer);
  };

  // Function to update state from child
  const handleTotalAdvanceUpdate = (newData) => {
    setTotalAdvanceBalance(newData);
  };

  return (
    <>
      {!patientData && <Header locationPath={locationPath} />}
      <div className="d-flex billing-dashboard-wraper">
        {!patientData && <SidebarDoctor activeItem={"opd-billing"} />}
        <div className="w-100 bg-body wrapper">
          <>
            <div className="welcomesection position-relative mb-3">
              <div className="bg-welcome d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {patientData ? (
                    <>
                      <div>
                        <h1>Billing History</h1>
                      </div>
                      <button
                        className="advance-deposite-container mx-4"
                        onClick={handleAddAdvanceDrawer}
                      >
                        <span className="text-lg">
                          Advance Balance: ₹{totalAdvanceBalance ?? "0"}
                        </span>
                        <span className="add-advance-icon">
                          <img src={addCircleIcon} alt="add-deposit" />
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <h1>OPD Billing</h1>
                      </div>
                      <img
                        src={require("../../../../assets/images/bg-welcome.png")}
                        className="welcomeig d-inline-block align-top"
                        alt="Welcome"
                      />
                    </>
                  )}
                </div>
                <div className="d-flex gap-1">
                  {selectedTab === "billingtable" && !patientData && (
                    <Button
                      className="btn-manage-bill"
                      onClick={handleManage3cBill}
                    >
                      <span>Manage Form 3c Bills</span>
                    </Button>
                  )}
                  {selectedTab !== "billingtable" && !patientData && (
                    <Button
                      className="btn-create-bill"
                      onClick={handleAddAdvance}
                    >
                      <span style={{ fontSize: "22px" }}>{"+"}</span>
                      <span>{"Add Advance Deposit"}</span>
                    </Button>
                  )}
                  {(selectedTab === "billingtable" || patientData) && (
                    <Button
                      className="btn-create-bill"
                      onClick={handleCreateBillDrawer}
                    >
                      <span style={{ fontSize: "22px" }}>+</span>
                      <span>Create New Bill</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="pb-5">&nbsp;</div>
            </div>
          </>
          <TableBillingDashboard
            onTabChange={setSelectedTab}
            patientData={patientData}
            handleTotalAdvanceUpdate={handleTotalAdvanceUpdate}
          />
        </div>

        {form3cDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleManage3cBill}
            open={form3cDrawer}
            width="100%"
          >
            <Manage3cBill
              handleForm3cBill={handleManage3cBill}
              handleAddForm3cDrawer={handleAddForm3cDrawer}
              form3cData={form3cData}
            />
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
            <AddForm3cBills
              handleAddForm3cDrawer={handleAddForm3cDrawer}
              setForm3cData={setForm3cData}
            />
          </Drawer>
        )}

        {addAdvanceDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleAddAdvanceDrawer}
            open={addAdvanceDrawer}
            width="80%"
            push={false}
          >
            <AddAdvance
              handleAddAdvanceDrawer={handleAddAdvanceDrawer}
              patientData={patientData}
            />
          </Drawer>
        )}
        {createBillDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            bodyStyle={{ backgroundColor: "white" }}
            open={createBillDrawer}
            onClose={showHideBackModal}
            width="100%"
            push={false}
          >
            <CreateBill
              handleCreateBillDrawer={handleCreateBillDrawer}
              isBackModalOpen={isBackModalOpen}
              showHideBackModal={showHideBackModal}
              patientData={patientData}
              isDashboard={true}
              isPreviewFromTable={true}
            />
          </Drawer>
        )}
      </div>
    </>
  );
}

export default BillingDashboard;
