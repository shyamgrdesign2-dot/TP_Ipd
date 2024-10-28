// src/components/GlobalModal.js

import React, { useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/doctorModalSlice";
import { Form, Input, Button, Row, Col, message } from "antd";
import api from "../api/services/axiosService";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { fetchSubscriptionDetails } from "../redux/subscriptionSlice";

const UserDetailsForm = () => {
  const [form] = Form.useForm();
  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();
  const { planDetails } = useSelector((state) => state.subscription);

  // Initial state for prefilling form fields
  const [formData, setFormData] = useState({
    name: profile?.um_name,
    mbl_no: profile?.um_contact,
    alternate_mbl_no: "",
    speciality: profile?.dp_name,
    clinic_name: profile?.hospital_data?.[0]?.hm_name,
    clinic_address: profile?.hospital_data?.[0]?.hm_address,
    pincode: profile?.hospital_data?.[0]?.hm_pincode,
    city: profile?.hospital_data?.[0]?.hm_city,
    state: profile?.hospital_data?.[0]?.hm_state,
    is_pm_renew_requested: true,
    country: "India",
  });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Form values:", values);
    setLoader(true);
    const res = await api.post("/user/pm/info/interest", formData, {
      customBaseUrl: config.user_management_api_url,
      headers: {
        api_key: config.api_key,
        api_secret_key: config.api_secret_key,
      },
    });
    setLoader(false);
    console.log({ res });
    if (res?.status === 200) {
      message.open({
        type: "success",
        content:
          "Our sales team will get in touch with you within a few hours to guide you through the purchase.",
      });
      dispatch(fetchSubscriptionDetails());
      dispatch(closeModal());
    } else {
      message.open({
        type: "error",
        content: "Error while submitting. Please try again",
      });
    }
  };

  return (
    <>
      {planDetails?.is_pm_renew_requested ? (
        <h5 className="d-flex align-items-center justify-content-center m-auto p-5">
          Your interest was already submitted. Our sales team will get in touch
          with you within a few hours to guide you through the purchase.
        </h5>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={formData} // Prefill form fields with initial data
          onFinish={onFinish}
          style={formStyle}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primary Mobile number"
                name="mbl_no"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Secondary Mobile number"
                name="alternate_mbl_no"
              >
                <Input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alternate_mbl_no: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Speciality"
                name="speciality"
                rules={[
                  { required: true, message: "Please enter your speciality" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Clinic name"
                name="clinic_name"
                rules={[
                  { required: true, message: "Please enter your clinic name" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Clinic Address"
            name="clinic_address"
            rules={[
              { required: true, message: "Please enter your clinic address" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Pincode"
                name="pincode"
                rules={[
                  { required: true, message: "Please enter your pincode" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter your city" }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "Please enter your state" }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={submitButtonStyle}
              loading={loader}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

// Custom styles to match the uploaded image more closely
const formStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "15px",
  borderRadius: "12px",
  //   backgroundColor: "#fff",
  //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

const submitButtonStyle = {
  width: "100%",
  backgroundColor: "#5A5FFF",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
};

const DoctorModal = () => {
  const dispatch = useDispatch();
  const { isVisible } = useSelector((state) => state.doctorModal);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      open={isVisible}
      title={"Upgrade Plan"}
      footer={null}
      onCancel={handleClose}
      destroyOnClose
    >
      <UserDetailsForm />
    </Modal>
  );
};

export default DoctorModal;
