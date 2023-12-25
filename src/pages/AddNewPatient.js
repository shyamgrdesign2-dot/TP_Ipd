import React, { useCallback, useEffect, useState } from "react";
import { isTablet } from "react-device-detect";
import { Col, Row } from "react-bootstrap";
import { Form, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";

import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";
import { addPatient } from "../redux/appointmentsSlice";

export const TAB_PERSONAL_DETAILS = 0;
export const TAB_ADDRESS_DETAILS = 1;

function AddNewPatient({ addPatientMutate, setFormValidForToolbar }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [tabChange, setTabChange] = useState(TAB_PERSONAL_DETAILS);
  const { loading, error } = useSelector((state) => state.records);
  const [patientInfo, setPatientInfo] = useState({});
  const [isFormValid, setFormValid] = useState(false);

  const items = [
    {
      key: TAB_PERSONAL_DETAILS,
      label: (
        <div className="d-flex align-items-baseline">Personal Details</div>
      ),
    },
    {
      key: TAB_ADDRESS_DETAILS,
      label: <div className="d-flex align-items-baseline">Address Details</div>,
    },
  ];

  useEffect(() => {
    console.log("addPatientMutate: ", addPatientMutate);
    if(addPatientMutate) {
      // dispatch(addPatient(patientInfo));
      console.log('ready to submit');
    }
  }, [addPatientMutate]);

  useEffect(() => {
    // console.log("patientInfo: ", patientInfo);
    if (
      patientInfo.pm_fullname &&
      patientInfo.pm_contact_no &&
      patientInfo.pm_gender &&
      patientInfo.pm_dob
    ) {
      setFormValid(true);
      if (setFormValidForToolbar) {
        setFormValidForToolbar(true);
      }
    } else {
      setFormValid(false);
      if (setFormValidForToolbar) {
        setFormValidForToolbar(false);
      }
    }
  }, [patientInfo]);

  const onAddPatientClicked = async () => {
    dispatch(addPatient(patientInfo));
  };

  const onChange = useCallback(
    (key) => {
      setTabChange(key);
    },
    [tabChange]
  );

  const onFinish = (values) => {
    console.log("Success:", values);

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

    dispatch(addPatient(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className={isTablet ? "" : "border rounded-4 appointment-wrap"}>
        <div className="p-30">
          <Row className="justify-content-between">
            <Col lg={8} md={12}>
              {isTablet ? (
                <>
                  <Tabs
                    defaultActiveKey={TAB_PERSONAL_DETAILS}
                    items={items}
                    onChange={onChange}
                  />
                  {tabChange == TAB_PERSONAL_DETAILS ? (
                    <PersonalDetails
                      patientInfo={patientInfo}
                      setPatientInfo={setPatientInfo}
                    />
                  ) : (
                    <AddressDetails
                      patientInfo={patientInfo}
                      setPatientInfo={setPatientInfo}
                    />
                  )}
                </>
              ) : (
                <>
                  <PersonalDetails
                    patientInfo={patientInfo}
                    setPatientInfo={setPatientInfo}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    form={form}
                  />
                  <hr className="mb-3 mt-1" />
                  <AddressDetails
                    patientInfo={patientInfo}
                    setPatientInfo={setPatientInfo}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    form={form}
                  />
                </>
              )}
            </Col>
            <Col lg={"auto"} md={12}>
              <UploadProfile
                patientInfo={patientInfo}
                setPatientInfo={setPatientInfo}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
              />
            </Col>
          </Row>
        </div>
        {!isTablet && (
          <>
            <hr className="my-0" />
            <div className="text-end p-20">
              <button className="btn btn-text text-decoration-underline me-3">
                Cancel
              </button>
              <button
                className="btn btn-primary btn-41"
                disabled={loading}
                onClick={() => {
                  form.submit();
                }}
              >
                {loading ? "Adding Patient..." : "Add Patient to Consult"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default React.memo(AddNewPatient);
