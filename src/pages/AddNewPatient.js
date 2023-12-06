import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import Header from "../common/Header";
import SidebarDoctor from "../common/SidebarDoctor";
import Welcome from "../common/Welcome";
import WalkInConsultation from "../components/WalkInConsultation";
import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";

function AddNewPatient() {
  const [patientInfo, setPatientInfo] = useState({});
  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    console.log("patientInfo: ", patientInfo);
    if (patientInfo.pm_fullname &&
      patientInfo.pm_contact_no &&
      patientInfo.pm_gender) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [patientInfo]);

  useEffect(() => {
    console.log("isFormValid: ", isFormValid);
    if (isFormValid) {
      const formData = new FormData();
      /* Object.keys(formData).forEach((key) => {
        formData.append(key, this.form[key]);
      }); */
    }
  }, [isFormValid]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <SidebarDoctor />
        <div className="w-100 bg-body wrapper custom-scroll">
          <Welcome
            title={"Welcome Dr. Mihir!"}
            subTitle={"Your Appointments"}
            backVisible={false}
            buttonIcon={"icon-Add me-2"}
            firstButtonName={"Add New Appointment"}
            firstButtonPath={"/"}
            secondButtonName={"Star Walk-In Consultation"}
            secondButtonPath={"/walk_in_consultation"}
          />
          <Routes>
            <Route
              path="/"
              element={
                <div className="border rounded-4 appointment-wrap">
                  <div className="p-30">
                    <Row className="justify-content-between">
                      <Col lg={8} md={12}>
                        <PersonalDetails
                          patientInfo={patientInfo}
                          setPatientInfo={setPatientInfo}
                        />
                        <hr className="mb-3 mt-1" />
                        <AddressDetails
                          patientInfo={patientInfo}
                          setPatientInfo={setPatientInfo}
                        />
                      </Col>
                      <Col lg={"auto"} md={12}>
                        <UploadProfile
                          patientInfo={patientInfo}
                          setPatientInfo={setPatientInfo}
                        />
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-0" />
                  <div className="text-end p-20">
                    <button className="btn btn-text text-decoration-underline me-3">
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-41"
                      disabled={!isFormValid}
                    >
                      Add Patient to Consult
                    </button>
                  </div>
                </div>
              }
            />
            <Route
              path="walk_in_consultation"
              element={<WalkInConsultation />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
export default React.memo(AddNewPatient);
