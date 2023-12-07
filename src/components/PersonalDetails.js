import React, { useEffect, useState } from "react";

import { Button, Form, Input, Select, DatePicker, Radio, Row, Col } from "antd";
import { calculateAge, calculateBirthdateFromAge, getFormattedDate } from "../utils/utils";
import dayjs from "dayjs";

function PersonalDetails({ patientInfo, setPatientInfo }) {

    const [ageYearsMonths, setAgeYearsMonths] = useState(null);
    const [birthDate, setBirthDate] = useState(null);

  // Select for Salutation
  const salutationOption = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Mss", label: "Mss." },
    { value: "Other", label: "Other" },
  ];

  const onSalutationChanged = (value) => {
    setPatientInfo({
      ...patientInfo,
      pm_salutation: value,
    });
  };

  const onGenderChanged = (event) => {
    setPatientInfo({
      ...patientInfo,
      pm_gender: event.target.value,
    });
  };

  const onBirthDateChanged = (date, dateString) => {
    console.log('onBirthDateChanged triggred: ');
    console.log(date, dateString);
    const age = calculateAge(getFormattedDate(dateString));
    setAgeYearsMonths(age);
    setPatientInfo({
      ...patientInfo,
      pm_dob: getFormattedDate(dateString),
    });
  };

  useEffect(() => {
    if(ageYearsMonths?.years && ageYearsMonths?.months) {
      const birthDate = calculateBirthdateFromAge(ageYearsMonths);
      console.log('ageYearsMonths: mutated birthDate: ', birthDate);
      setBirthDate(birthDate);
      setPatientInfo({
        ...patientInfo,
        pm_dob: getFormattedDate(birthDate),
      });
    }
  }, [ageYearsMonths]);

  const onFieldChanged = (event) => {
    console.log("id: ", event.target.id);
    const value = event.target.value;
    setPatientInfo({
      ...patientInfo,
      [event.target.id]: value,
    });
  };

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
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="title">Personal Details</div>
        <Button className="border-0 shadow-none">
          <div className="title align-items-center d-flex">
            {" "}
            <i className="icon-Add me-2"></i> Add Details
          </div>
        </Button>
      </div>

      <Form
        layout="vertical"
        name="advanced_search"
        className="form_addnewpatient"
      >
        <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 30 }}>
          <Col xs={8} sm={8} md={6} lg={4}>
            <Form.Item name="salutation" label="Salutation">
              <Select
                placeholder="Select"
                options={salutationOption}
                onChange={onSalutationChanged}
              />
            </Form.Item>
          </Col>
          <Col xs={16} sm={16} md={18} lg={20}>
            <Form.Item name="fullname" label="Full Name" rules={rules.fullname}>
              <Input
                placeholder="Full Name"
                id="pm_fullname"
                onChange={onFieldChanged}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="mobilenumber"
              label="Mobile Number"
              rules={rules.mobilenumber}
            >
              <Input
                placeholder="Enter 10 digit number"
                id="pm_contact_no"
                type="tel"
                maxLength={10}
                onChange={onFieldChanged}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="gender" label="Gender" rules={rules.gender}>
              <Radio.Group onChange={onGenderChanged}>
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
              name="ageyearsmonths"
              label="Age In Years & Months"
              rules={rules.ageyearsmonths}
            >
              <div className="justify-content-between d-flex">
                <Input className="w-48" type="number" placeholder="Years" value={ageYearsMonths?.years} onChange={(e) => {
                  setAgeYearsMonths({
                    ...ageYearsMonths,
                    years: e.target.value
                  });
                }} />
                <Input className="w-48" type="number" placeholder="Months" maxLength={2} value={ageYearsMonths?.months} onChange={(e) => {
                  setAgeYearsMonths({
                    ...ageYearsMonths,
                    months: e.target.value
                  });
                }} />
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={2} lg={2}>
            <div className="or text-center mt-2">OR</div>
          </Col>
          <Col xs={24} sm={24} md={11} lg={11}>
            <Form.Item name="dateofbirth" label="Date of Birth">
              <DatePicker onChange={onBirthDateChanged} value={birthDate ? dayjs(getFormattedDate(birthDate), 'YYYY-MM-DD') : null} />
              {/* <DatePicker onChange={onBirthDateChanged} value={dayjs('1990-05-05', 'YYYY-MM-DD')} format = {'YYYY-MM-DD'} /> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default React.memo(PersonalDetails);
