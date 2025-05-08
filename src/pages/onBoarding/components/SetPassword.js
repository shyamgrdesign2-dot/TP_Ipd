import React from "react";
import { Input, Button, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import googlePartner from "../../../assets/images/website-images/image.png";

const SetPassword = ({ onViewChange, mobileNumber }) => {
  const [form] = Form.useForm();

  const handleGoBack = () => {
    onViewChange("loginPassword");
  };

  const handleContinue = async () => {
    try {
      const values = await form.validateFields();
      
      // Send OTP using the window.sendOtp function
      if (window.sendOtp) {
        window.sendOtp(
          mobileNumber,
          "11",
          (data) => {
            // Pass password directly through component props
            onViewChange("verifyOTP", mobileNumber, false, true, values.password);
          },
          (error) => {
            console.error("Error sending OTP:", error);
            // Handle error
          }
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 className="title">Set Password</h2>

        <Form name="setPassword" className="signup-form" style={{padding: "0"}}>
          <Form.Item
            name="password"
            className="phone-form-item"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <label htmlFor="password" className="onboard-fields-label">
              Create a Password
            </label>
            <Input.Password
              placeholder="Enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="password-input"
              bordered={false}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            className="phone-form-item"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <label htmlFor="confirmPassword" className="onboard-fields-label">
              Re-enter Password
            </label>
            <Input.Password
              placeholder="Confirm password"
              visibilityToggle={false}
              className="password-input"
              bordered={false}
            />
          </Form.Item>

          <Button
            type="primary"
            className="get-started-btn"
            onClick={handleContinue}
          >
            Continue
          </Button>

          <div className="go-back"  style={{marginTop: "20px"}} onClick={handleGoBack}>
            Go back
          </div>
        </Form>
      </div>
      <div className="partners-section">
        <img src={abdmLogo} alt="ABDM" className="abdm-logo" />
        <img src={nhaLogo} alt="NHA" className="nha-logo" />
        <img
          src={googlePartner}
          alt="Google Partner"
          className="google-partner"
        />
      </div>
    </div>
  );
};

export default SetPassword;
