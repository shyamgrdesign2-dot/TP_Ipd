import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import MicrosoftPartner from "../../../assets/images/onboard-page-icons/microsoft.png";
import leftGroup from "../../../assets/images/onboard-page-icons/Left-Group.svg";
import rightGroup from "../../../assets/images/onboard-page-icons/Right-Group.svg";
import { loginWithPassword, verifyAccessToken } from "../../auth/authService";
import { isMobile } from "react-device-detect";
import { EyeInvisibleOutlined } from "@ant-design/icons";


const VerifyPassword = ({ onViewChange, mobileNumber }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginWithPassword(mobileNumber, password);

      const { message, ssoUrl } = response;

      // moengage event for login success
      window.Moengage.track_event('TP_NewLoginFlow_Login_Password_Success', {
        mobile: "91" + mobileNumber,
        doc_status: message === "Doctor is inactive" ? "inactive" : "active",
      })

      switch (message) {
        case "Doctor is inactive":
          setError("Your account has been locked by Admin. Please contact support@tatvacare.in/9974042363");
          setLoading(false);
          return;

        case "Invalid username and password":
          setError("Incorrect password. Please try again.");
          setLoading(false);
          return;

        default:
          // Handle successful login with SSO URL
          if (ssoUrl) {
            // Clear localStorage on successful login
            localStorage.removeItem("currentView");
            localStorage.removeItem("isLoginFlow");
            localStorage.removeItem("isUserExists");

            const updatedSsoUrl = isMobile
              ? `${ssoUrl}&device_type=mobile`
              : `${ssoUrl}&device_type=desktop`;

            window.location.href = updatedSsoUrl;
            return;
          }
          setLoading(false);
          // If no ssoUrl and no known error message, throw error
          throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Store current state in localStorage
    localStorage.setItem("currentView", "loginOTP");
    localStorage.setItem("isLoginFlow", "true");
    localStorage.setItem("mobileNumber", mobileNumber);
    
    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 style={{ margin: "2.5rem 0 3rem 0" }}>Welcome Doctor!</h2>

        <Form name="loginPassword" className="signup-form">
          <Form.Item
            name="password"
            className="password-form-item"
            // onFinish={handleLogin}
          >
            <label htmlFor="password" className="onboard-fields-label">
              Enter Password
            </label>
            <Input.Password
              autoFocus
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              onPressEnter={handleLogin}
              iconRender={(visible) => (
                visible ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M10 4.37508C3.75 4.37508 1.25 10.0001 1.25 10.0001C1.25 10.0001 3.75 15.6251 10 15.6251C16.25 15.6251 18.75 10.0001 18.75 10.0001C18.75 10.0001 16.25 4.37508 10 4.37508Z"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <EyeInvisibleOutlined />
                )
              )}
              // type="password"
              // name="current-password"
              // autoComplete="current-password"
              // id="current-password"
            />
          </Form.Item>
          <div className="error-message">{error}</div>

          <div className="forgot-password">
            <span onClick={() => onViewChange("setPassword", mobileNumber, true)}>
              Forget password
            </span>
          </div>

          <Button
            type="primary"
            loading={loading}
            onClick={handleLogin}
            className="login-btn"
            disabled={!password}
            style={{ margin: "1rem 0" }}
          >
            Login
          </Button>

          <div className="go-back" onClick={handleGoBack} style={{ marginTop: "2rem" }}>
            Go back
          </div>
        </Form>
      </div>
      <div style={{height: "2rem"}}></div>
      <div className="partners-section">
      <div className="partners-section">
        <img src={leftGroup} alt="Lines Group" className="left-lines-group" />
        <img src={abdmLogo} alt="ABDM" className="abdm-logo" />
        <img src={nhaLogo} alt="NHA" className="nha-logo" />
        <img
          src={MicrosoftPartner}
          alt="Microsoft Partner"
          className="google-partner"
        />
        <img src={rightGroup} alt="Lines Group" className="right-lines-group" />
      </div>
      </div>
    </div>
  );
};

export default VerifyPassword;
