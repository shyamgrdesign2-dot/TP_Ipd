import React, { useState, useEffect } from "react";
import { Input, Button, Form, Spin } from "antd";
import { isMobile } from "react-device-detect";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import googlePartner from "../../../assets/images/website-images/image.png";
import { verifyAccessToken } from "../../auth/authService";

const VerifyOTP = ({ onViewChange, mobileNumber, isLoginFlow }) => {
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (!canResend) return;

    setLoading(true);
    if (window.retryOtp) {
      window.retryOtp(
        "11",
        (data) => {
          setTimer(15);
          setCanResend(false);
          setError(null);
          setLoading(false);
        },
        (error) => {
          console.error("Error retrying OTP:", error);
          setError("Failed to resend OTP. Please try again.");
          setLoading(false);
        }
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (window.verifyOtp) {
        window.verifyOtp(
          otp,
          async (data) => {
            const { message } = data;
            const response = await verifyAccessToken(mobileNumber, message);
            console.log("response", response);

            if (response) {
              const { message: responseMessage, ssoUrl, passwordSet } = response;
              console.log("responseMessage", responseMessage);
              switch (responseMessage) {
                case "Password not set":
                  if (isLoginFlow) {
                    onViewChange("setPassword");
                  } else {
                    // Redirect to SSO URL for campaign signups
                    if (ssoUrl) {
                      const deviceType = isMobile ? "mobile" : "desktop";
                      window.location.href = `${ssoUrl}&device_type=${deviceType}`;
                    }
                  }
                  break;

                case "Doctor exists!":
                  if (ssoUrl) {
                    const deviceType = isMobile ? "mobile" : "desktop";
                    window.location.href = `${ssoUrl}&device_type=${deviceType}`;
                  }
                  break;

                default:
                  if (ssoUrl) {
                    console.log("ssoUrl", ssoUrl);
                    const deviceType = isMobile ? "mobile" : "desktop";
                    window.location.href = `${ssoUrl}&device_type=${deviceType}`;
                  }
              }
            } else {
              setError("Invalid OTP. Please try again.");
            }
          },
          (error) => {
            console.error("OTP Verification Failed:", error);
            setError("Invalid OTP. Please try again.");
          }
        );
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNumber = () => {
    onViewChange(isLoginFlow ? "loginOTP" : "signup", mobileNumber);
  };

  return (
    <div className="signup-form-wrapper">
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(194 194 194 / 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
        </div>
      )}
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
              <path
                d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z"
                fill="#6941C6"
              />
            </svg>
          </div>

          {error && <div className="error-message">{error}</div>}

          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please input the OTP!" }]}
          >
            <Input
              placeholder="Enter 6-Digit OTP"
              className="otp-input"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </Form.Item>

          <div
            className="resend-otp"
            onClick={handleResendOTP}
            style={{
              textDecoration: canResend ? "underline" : "none",
              color: canResend ? "#6941C6" : "inherit",
              cursor: canResend ? "pointer" : "default",
            }}
          >
            Resend OTP {canResend ? "" : `in ${timer}s`}
          </div>

          <Button
            type="primary"
            className="submit-btn"
            onClick={handleVerifyOTP}
            disabled={!otp || otp.length !== 6 || loading}
          >
            Submit OTP
          </Button>

          <div className="terms-text">
            By continuing I accept for the <a href="#">T&C</a> and{" "}
            <a href="#">Privacy Policy</a>
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

export default VerifyOTP;
