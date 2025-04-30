import React, { useState, useEffect } from "react";
import { Input, Button, Form } from "antd";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import googlePartner from "../../../assets/images/website-images/image.png";

const VerifyOTP = ({ onViewChange, mobileNumber, isLoginFlow }) => {
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendOTP = () => {
    if (canResend) {
      setTimer(15);
      setCanResend(false);
      // Add your resend OTP logic here
    }
  };

  const handleEditNumber = () => {
    onViewChange(isLoginFlow ? 'loginOTP' : 'signup', mobileNumber);
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 className="title">Almost there</h2>

        <Form name="verifyOTP" className="signup-form">
          <div className="otp-label">
            Enter OTP sent to {mobileNumber}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              className="edit-icon"
              onClick={handleEditNumber}
            >
              <path d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="#6941C6"/>
            </svg>
          </div>

          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Please input the OTP!' }]}
          >
            <Input
              placeholder="Enter 6- Digit OTP"
              className="otp-input"
              maxLength={6}
            />
          </Form.Item>

          <div 
            className="resend-otp" 
            onClick={handleResendOTP}
            style={{ 
              textDecoration: canResend ? 'underline' : 'none',
              color: canResend ? '#6941C6' : 'inherit'
            }}
          >
            Resend OTP {canResend ? '' : `in ${timer}s`}
          </div>

          <Button
            type="primary"
            className="submit-btn"
            onClick={() => onViewChange("setPassword")}
          >
            Submit OTP
          </Button>

          <div className="terms-text">
            By continuing I accept for the <a href="#">T&C</a> and <a href="#">Privacy Policy</a>
          </div>
        </Form>
      </div>
      <div className="partners-section">
        <img src={abdmLogo} alt="ABDM" className="abdm-logo" />
        <img src={nhaLogo} alt="NHA" className="nha-logo" />
        <img src={googlePartner} alt="Google Partner" className="google-partner" />
      </div>
    </div>
  );
};

export default VerifyOTP; 