import React, { useState, useEffect, useCallback, useMemo } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer } from "antd";

import ConfirmAppointment from "./components/ConfirmAppointment";
import tutorial from '../../assets/images/tutorial-icon.svg';
import { addAppointment } from "./service";
import { errorMessage } from "../../utils/utils";

function AddAppointment() {

  const navigate = useNavigate();

  const { state } = useLocation();
  const { patient_data } = state != null && state

  const [confirmAppointment, setConfirmAppointment] = useState(false);

  const [clickedPatient, setClickedPatient] = useState(null);
  const [selectedCashType, setSelectedCashType] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (patient_data) {
      setClickedPatient(patient_data)
      handleConfirmAppointment()
    }
  }, [patient_data]);

  const handleConfirmAppointment = useCallback(
    () => {
      setConfirmAppointment(!confirmAppointment)
    },
    [confirmAppointment]
  );

  const validation = () => !(clickedPatient && selectedCashType);

  const onBookAppointmentPress = async () => {
    let sendData = {
      "doctor_id": 493,
      "patient_unique_id": clickedPatient?.patient_unique_id,
      "pm_pid": clickedPatient?.pm_pid,
      "appointment_date": "2025-02-28",
      "appointment_start_time": "19:20",
      "appointment_end_time": "19:30",
      "appointment_duration": 10,
      "toct_id": selectedCategories ? selectedCategories : '',
      "category_id": selectedCashType,
      "remarks": remarks
    }
    console.log(sendData)
    // const response = await addAppointment(sendData);
    // if (response?.status) {

    // } else {
    //   errorMessage(response?.message)
    // }
  }

  return (
    <>
      <div className="welcomesection position-relative">
        <div className="bg-welcome d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div onClick={() => navigate(-1)} className="lh-1 me-1 px-2 text-dark cursor-pointer">
              <i className="fs-3 icon-right"></i>
            </div>
            <div>
              <h1>Add New Patient</h1>
            </div>
            <img
              src={require("../../assets/images/bg-welcome.png")}
              className="welcomeig d-inline-block align-top"
              alt="Welcome"
            />
          </div>
          <div className="d-flex gap-1">
            <div className="d-lg-flex d-block">

              <button className='btn d-flex align-items-center btn-text mx-3 tutorial p-0'>
                <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
              </button>

              <Button
                variant="primary"
                onClick={handleConfirmAppointment}
                className="px-3 btn-41 d-flex align-items-center rounded-10px">
                <i className="icon-calendar me-2"></i>
                {"Availability Settings"}
              </Button>

            </div>
          </div>
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>
      <div className={`border rounded-4 appointment-wrap p-4`} style={{ height: 300 }}>
        {/* Akhil code here */}
      </div>
      <Drawer
        className="modalWidth-645" width="auto"
        title="Confirm Appointment"
        placement="right"
        closable
        open={confirmAppointment}
        onClose={handleConfirmAppointment}
        extra={
          <Button type="primary" className="btn-41" disabled={validation()} onClick={onBookAppointmentPress}>
            Book Appointment
          </Button>
        }
      >
        <ConfirmAppointment
          handleConfirmAppointment={handleConfirmAppointment}
          clickedPatient={clickedPatient}
          setClickedPatient={setClickedPatient}
          selectedCashType={selectedCashType}
          setSelectedCashType={setSelectedCashType}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          remarks={remarks}
          setRemarks={setRemarks}
        />
      </Drawer>
    </>
  )
}

export default AddAppointment