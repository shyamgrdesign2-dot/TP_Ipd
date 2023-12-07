import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";
import { addPatient } from "../redux/appointmentsSlice";

function AddNewPatient() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.records);
  const [patientInfo, setPatientInfo] = useState({});
  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    console.log("patientInfo: ", patientInfo);
    if (
      patientInfo.pm_fullname &&
      patientInfo.pm_contact_no &&
      patientInfo.pm_gender &&
      patientInfo.pm_dob
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [patientInfo]);

  const onAddPatientClicked = async () => {
  /*   let patientInfo = {
      pm_address: "Vitae esse enim off",
      pm_city: "Akola",
      pm_contact_no: "7279777411",
      pm_dob: "1988-12-12",
      pm_fullname: "Mona Bauer",
      pm_gender: "Female",
      pm_pincode: 444001,
      pm_state: "Maharashtra",
      pm_image: 'blob:http://localhost:3000/8ffd7207-1c51-4a3d-a699-45933e1a7ab8'
    }; */

    dispatch(addPatient(patientInfo));
  };

  return (
    <>
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
            disabled={!isFormValid || loading}
            onClick={onAddPatientClicked}
          >
            {loading ? "Adding Patient..." : "Add Patient to Consult"}
          </button>
        </div>
      </div>
    </>
  );
}
export default React.memo(AddNewPatient);
