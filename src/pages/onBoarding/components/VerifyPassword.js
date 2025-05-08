import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import googlePartner from "../../../assets/images/website-images/image.png";
import { loginWithPassword, verifyAccessToken } from "../../auth/authService";
import { isMobile } from "react-device-detect";

const VerifyPassword = ({ onViewChange, mobileNumber }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginWithPassword(mobileNumber, password);
      // window.Moengage.track_event('TP_Login_Success', {
      //   utm_campaign, utm_source, utm_medium, utm_content
      // });
      const { message, ssoUrl } = response;

      switch (message) {
        case "Doctor is inactive":
          setError("Your account has been locked by Admin. Please contact support@tatvacare.in/9974042363");
          return;

        case "Invalid username and password":
          setError("Incorrect password. Please try again.");
          return;

        default:
          // Handle successful login with SSO URL
          if (ssoUrl) {
            const updatedSsoUrl = isMobile
              ? `${ssoUrl}&device_type=mobile`
              : `${ssoUrl}&device_type=desktop`;

            window.location.href = updatedSsoUrl;
            return;
          }
          // If no ssoUrl and no known error message, throw error
          throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Reset the MSG91 provider before navigating
    const msg91Provider = document.querySelector('msg91-otp-provider');
    if (msg91Provider) {
      try {
        if (msg91Provider.disconnectedCallback) {
          msg91Provider.disconnectedCallback();
        }
        msg91Provider.remove();
      } catch (e) {
        console.error('Error removing MSG91 provider:', e);
      }
    }
    
    onViewChange("loginOTP", mobileNumber);
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 className="title">Welcome Back</h2>

        <Form name="loginPassword" className="signup-form">
          <Form.Item
            name="password"
            className="password-form-item"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <label htmlFor="password" className="onboard-fields-label">
              Enter Password
            </label>
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d="M8.20859 11.7916C7.71859 11.3016 7.41693 10.6666 7.41693 9.99998C7.41693 8.65831 8.50026 7.57498 9.84193 7.57498C10.5086 7.57498 11.1336 7.88331 11.6253 8.37331"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.8582 10.2667C12.6832 11.3217 11.8332 12.1717 10.7782 12.3467"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.19162 14.8083C3.74162 13.6583 2.54162 12.0083 1.66663 10C2.54996 7.99169 3.75829 6.34169 5.21662 5.19169C6.66662 4.04169 8.29162 3.41669 9.99996 3.41669C11.7166 3.41669 13.3416 4.04169 14.7916 5.20002"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.8833 7.34167C17.6333 8.51667 18.2833 9.85 18.3333 10C17.4499 12.0083 16.2416 13.6583 14.7833 14.8083C14.1916 15.2667 13.5583 15.6417 12.9083 15.9333"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.6667 3.33331L3.33337 16.6666"
                      stroke="#667085"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )
              )}
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
            onClick={handleLogin}
            className="login-btn"
            disabled={!password}
          >
            Login
          </Button>

          <div className="go-back" onClick={handleGoBack}>
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

export default VerifyPassword;
