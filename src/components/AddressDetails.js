import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Select, Row, Col } from "antd";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { searchPincode } from "../redux/appointmentsSlice";
import { isTablet } from "react-device-detect";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

function AddressDetails({
  form,
  onFinish,
  onFinishFailed,
  patientInfo,
  setPatientInfo,
}) {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(true);
  const [searchParentQuery, setSearchParentQuery] = useState("");
  let { pincodeInfo, error } = useSelector((state) => state.records);

  useEffect(() => {
    if (pincodeInfo && Object.keys(pincodeInfo).length > 0) {
      setPatientInfo({
        ...patientInfo,
        pm_pincode: pincodeInfo?.pincode,
        pm_city: pincodeInfo?.city,
        pm_state: pincodeInfo?.state,
      });
    }

    if (error) {
      notification.error({
        message: error.message,
      });
    }
  }, [pincodeInfo, error]);

  const onSearch = useCallback(
    (event) => {
      const query = event.target.value;
      setSearchParentQuery(query);
    },
    [searchParentQuery]
  );

  useEffect(() => {
    if (searchParentQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(searchPincode(searchParentQuery));
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      setPatientInfo({
        ...patientInfo,
        pm_pincode: null,
        pm_city: null,
        pm_state: null,
      });
    }
  }, [searchParentQuery]);

  const onFieldChanged = (event) => {
    /* console.log("id: ", event.target.id);
    const value = event.target.value;
    setPatientInfo({
      ...patientInfo,
      [event.target.id]: value,
    }); */
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="title">Address Details</div>
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
        <Form
          form={form}
          layout="vertical"
          name="advanced_search"
          className="form_addnewpatient"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row className="mt-3" gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item name="pm_pincode" label="Pincode">
                <Input
                  placeholder="Enter Pin Code"
                  type="number"
                  maxLength={6}
                  onChange={onSearch}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                name="pm_city"
                label="City"
              >
                <Input defaultValue={pincodeInfo?.city ?? "City"} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mt-3" gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item name="pm_state" label="State">
                <Select
                  placeholder={pincodeInfo?.state ?? "Select state"}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item name="pm_address" label="Street Address">
                <Input
                  placeholder="Address"
                  id="pm_address"
                  onChange={onFieldChanged}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}

export default React.memo(AddressDetails);
