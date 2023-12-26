import React, { useEffect, useState } from "react";

import { Button, Form, Input, Select, DatePicker, Radio, Row, Col } from "antd";
import {
  calculateAge,
  calculateBirthdateFromAge,
  getFormattedDate,
} from "../utils/utils";
import dayjs from "dayjs";
import { isTablet } from "react-device-detect";

function PersonalDetails({
  form,
  onFinish,
  onFinishFailed,
  patientInfo,
  setPatientInfo,
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [ageYearsMonths, setAgeYearsMonths] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  // Select for Salutation
  const salutationOption = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Mss", label: "Mss." },
    { value: "Other", label: "Other" },
  ];

  /* const onSalutationChanged = (value) => {
    setPatientInfo({
      ...patientInfo,
      pm_salutation: value,
    });
  }; */

  const onGenderChanged = (event) => {
    setPatientInfo({
      ...patientInfo,
      pm_gender: event.target.value,
    });
  };

  const onBirthDateChanged = (date, dateString) => {
    console.log("onBirthDateChanged triggred: ", dateString);
    console.log(date);
    if (dateString) {
      const age = calculateAge(getFormattedDate(dateString));
      setAgeYearsMonths(age);
      setPatientInfo({
        ...patientInfo,
        pm_dob: getFormattedDate(dateString),
      });
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };

  useEffect(() => {
    if (ageYearsMonths) {
      let dateObj = new Date();
      let year =
        dateObj.getUTCFullYear() -
        parseInt(
          ageYearsMonths.hasOwnProperty("years")
            ? ageYearsMonths.years != ""
              ? ageYearsMonths.years
              : 0
            : 0
        );
      let month =
        dateObj.getUTCMonth() +
        1 -
        parseInt(
          ageYearsMonths.hasOwnProperty("months")
            ? ageYearsMonths.months != ""
              ? ageYearsMonths.months
              : 0
            : 0
        ); //months from 1-12
      let day = 1;
      let newdate = year + "-" + month + "-" + day;
      /* console.log(
        "calculateBirthdateFromAge",
        calculateBirthdateFromAge(ageYearsMonths)
      ); */
      setBirthDate(newdate);

      setPatientInfo({
        ...patientInfo,
        pm_dob: getFormattedDate(newdate),
      });
      form.setFieldsValue({
        dateofbirth: dayjs(getFormattedDate(newdate), "YYYY-MM-DD"),
      });
    }
  }, [ageYearsMonths]);

  // Form Rules
  const rules = {
    fullname: [
      {
        required: true,
        message: "Please enter Full Name",
      },
    ],
    mobilenumber: [
      {
        required: true,
        message: "Enter a valid mobile number",
      },
    ],
    gender: [
      {
        required: true,
        message: "Please Select Gender",
      },
    ],
    ageyearsmonths: [
      {
        required: true,
        message: "Please Fill Age in Years & Months",
      },
    ],
  };

  const onValuesChange = (values) => {
    console.log("OnValuesChange:", values);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="title">Personal Details</div>
        {!isTablet && (
          <>
            <Button
              className="border-0 shadow-none"
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            >
              <div className="title align-items-center d-flex">
                {" "}
                {showDetails ? (
                  <>
                    <i className="icon-minus me-2" /> Show Less
                  </>
                ) : (
                  <>
                    <i className="icon-Add me-2" /> Add Details
                  </>
                )}
              </div>
            </Button>
          </>
        )}
      </div>

      {showDetails && (
        <>
          {/* <Form
          form={form}
          layout="vertical"
          name="advanced_search"
          className="form_addnewpatient"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        > */}
          <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 30 }}>
            <Col xs={8} sm={8} md={6} lg={4}>
              <Form.Item name="salutation" label="Salutation">
                <Select placeholder="Select" options={salutationOption} />
              </Form.Item>
            </Col>
            <Col xs={16} sm={16} md={18} lg={20}>
              <Form.Item
                name="pm_fullname"
                label="Full Name"
                rules={rules.fullname}
              >
                <Input
                  placeholder="Full Name"
                  value={patientInfo?.pm_fullname}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                name="pm_contact_no"
                label="Mobile Number"
                rules={rules.mobilenumber}
              >
                <Input
                  placeholder="Enter 10 digit number"
                  type="tel"
                  maxLength={10}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item name="pm_gender" label="Gender" rules={rules.gender}>
                <Radio.Group>
                  <Radio.Button value="Male">Male</Radio.Button>
                  <Radio.Button value="Female">Female</Radio.Button>
                  <Radio.Button value="Other">Other</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center" gutter={{ xs: 0, sm: 0, lg: 0 }}>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item
                name="dobYearsMonths"
                label="Age In Years & Months"
                rules={rules.ageyearsmonths}
              >
                <div className="justify-content-between d-flex">
                  <Input
                    className="w-48"
                    type="number"
                    placeholder="Years"
                    value={ageYearsMonths?.years}
                    onChange={(e) => {
                      setAgeYearsMonths({
                        ...ageYearsMonths,
                        years: e.target.value,
                      });
                    }}
                  />
                  <Input
                    className="w-48"
                    type="number"
                    placeholder="Months"
                    maxLength={2}
                    value={ageYearsMonths?.months}
                    onChange={(e) => {
                      setAgeYearsMonths({
                        ...ageYearsMonths,
                        months: e.target.value,
                      });
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={2} lg={2}>
              <div className="or text-center mt-2">OR</div>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item name="dateofbirth" label="Date of Birth">
                <DatePicker
                  onChange={onBirthDateChanged}
                  disabledDate={disabledDate}
                  value={
                    birthDate
                      ? dayjs(getFormattedDate(birthDate), "YYYY-MM-DD")
                      : null
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          {/* </Form> */}
        </>
      )}
    </>
  );
}

export default React.memo(PersonalDetails);
