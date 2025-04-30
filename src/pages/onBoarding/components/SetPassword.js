import React from "react";
import { Input, Button, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const SetPassword = ({ onViewChange }) => {

  const handleGoBack = () => {
    onViewChange("loginPassword");
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
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="password-input"
              bordered={false}
            />
          </Form.Item>

          <Button
            type="primary"
            className="get-started-btn"
            onClick={() => onViewChange("loginSuccess")}
          >
            Continue
          </Button>

          <div className="go-back"  style={{marginTop: "20px"}} onClick={handleGoBack}>
            Go back
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SetPassword;
