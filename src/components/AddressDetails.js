import React, { useState } from "react";
import { Button, Form, Input, Select, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { searchPincode } from "../redux/appointmentsSlice";

function AddressDetails() {
  const dispatch = useDispatch();
  let { pincodeInfo } = useSelector((state) => state.records);

  console.log("pincodeInfo: ", pincodeInfo);

  const onSearch = (event) => {
    const searchQuery = event.target.value;
    console.log("searchQuery: ", searchQuery);
    let id = 0;
    id = setTimeout(() => {
      dispatch(searchPincode(searchQuery));
      clearTimeout(id);
    }, 500);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="title">Address Details</div>
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
        <Row className="mt-3" gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="Pincode" label="Pincode">
              <Input placeholder="Enter Pin Code" onChange={onSearch} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="city" label="City">
              <Input placeholder={pincodeInfo?.city ?? "City"} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mt-3" gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="state" label="State">
              <Select
                placeholder={pincodeInfo?.state ?? "Select state"}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="streetaddress" label="Street Address">
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default React.memo(AddressDetails);
