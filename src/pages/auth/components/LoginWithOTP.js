import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser, verifyAccessToken } from "../authService";
import "../auth.scss"; // Assuming the provided styles are in this CSS file
import { isMobile } from "react-device-detect";
import { Spin } from "antd";

const LoginWithOTP = ({ reason, handleView, number }) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState(number === "null" ? "" : number);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    if (number !== "null" || number !== "" ) {
      setMobileNumber(number);
    }
  }, [number]);

  // Timer and resend state
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const scriptId = "msg91-otp-script"; // Unique ID for the script
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const configuration = {
        widgetId: "346b79686352303336343033",
        tokenAuth: "365375TaYB4FU32WrR67443055P1",
        captchaRenderId: "captch-id",
        exposeMethods: true,
        success: (data) => {
          void 0;
        },
        failure: (error) => {
          console.error("OTP Verification Failed:", error);
        },
      };

      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://control.msg91.com/app/assets/otp-provider/otp-provider.js";
      script.async = true;

      script.onload = () => {
        if (window.initSendOTP) {
          window.initSendOTP(configuration);
        } else {
          console.error("initSendOTP method not found!");
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  let timer; // Global timer reference

  const handleSendOtp = async () => {
    if (isButtonDisabled) return; // Prevent multiple clicks

    // Mobile number validation (only 10 digits allowed)
    if (!/^\d{10}$/.test(mobileNumber?.trim())) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    // Check for Captcha Verification
    if (!isOtpSent && !window.isCaptchaVerified()) {
      setMessage(
        "Captcha verification is required. Please check the box to proceed."
      );
      return;
    }

    try {
      setIsButtonDisabled(true); // Disable the button immediately
      setMessage("");
      setLoading(true); // Show loader

      if (isValidUser) {
        // Use `retryOtp` if OTP was already sent
        if (isOtpSent) {
          retryOtp();
        } else {
          sendOtp();
        }
        return;
      }
  

      // Step 1: Validate the user
      const response = await validateUser(mobileNumber);
      const { message } = response;

      // Step 2: Handle validation responses
      switch (message) {
        case "Doctor does not exists!":
          setMessage("Phone number not registered");
          setIsButtonDisabled(false);
          break;

        case "Doctor is inactive":
          setMessage(
            "Your account has been locked by Admin. Please contact support@tatvacare.in/9974062363"
          );
          setIsButtonDisabled(false);
          break;

        case "Doctor exists!":
          setIsValidUser(true);
          sendOtp();
          break;

        default:
          setMessage("Unexpected response from server.");
          setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error during user validation:", error);
      setMessage("Failed to validate user. Please try again.");
      setIsButtonDisabled(false);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Function to send OTP
  const sendOtp = () => {
    if (!window.sendOtp) {
      console.error("sendOtp method not found!");
      setMessage(
        "OTP service is currently unavailable. Please try again later."
      );
      setIsButtonDisabled(false);
      setLoading(false); // Hide loader
      return;
    }

    if (timer) clearInterval(timer); // Clear any existing timers

    setLoading(true); // Show loader
    window.sendOtp(
      `91${mobileNumber}`,
      (data) => {
        setIsOtpSent(true);
        setMessage("Verification OTP has been sent. Please check your SMS.");

        // Start the countdown timer
        startTimer();
        setLoading(false); // Hide loader
      },
      (error) => {
        console.error("Error sending OTP:", error);
        setMessage("Failed to send OTP. Please try again.");
        setIsButtonDisabled(false);
        setLoading(false); // Hide loader
      }
    );
  };

  // Function to start the countdown timer
  const startTimer = () => {
    setCountdown(30); // Reset the timer to 30 seconds
    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsButtonDisabled(false); // Enable the resend button
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Retry OTP Method
const retryOtp = () => {
  if (!window.retryOtp) {
    console.error("retryOtp method not found!");
    setMessage("Retry service is unavailable. Please try again later.");
    setIsButtonDisabled(false);
    setLoading(false); // Hide loader
    return;
  }

  setLoading(true); // Show loader

  window.retryOtp(
    "11",
    (data) => {
      setMessage("OTP has been resent. Please check your SMS.");
      startTimer(); // Restart the countdown timer
      setLoading(false); // Hide loader
    },
    (error) => {
      console.error("Error retrying OTP:", error);
      setMessage("Failed to resend OTP. Please try again.");
      setIsButtonDisabled(false);
      setLoading(false); // Hide loader
    }
  );
};

  const handleVerifyOtp = () => {
    setMessage("");
    if (!otp || otp.length < 6) {
      setMessage("Please enter a valid OTP");
      return;
    }

    setLoading(true); // Show loader
    if (window.verifyOtp) {
      window.verifyOtp(
        otp,
        async (data) => {
          const { token, message } = data;

          // Check if the message is "Invalid OTP"
          if (message === "Invalid OTP") {
            setMessage("Invalid OTP. Please try again.");
            setLoading(false); // Hide loader
            return;
          }

          try {
            const response = await verifyAccessToken(mobileNumber, message);

            const {
              message: responseMessage,
              doctor_unique_id,
              statusCode,
              ssoUrl,
            } = response;

            switch (responseMessage) {
              case "Password not set":
                handleSwitch({
                  view: "setPassword",
                  doctor_unique_id,
                  mobileNumber,
                });
                break;

              case "Doctor does not exists!":
                setMessage("User is not registered with us");
                break;

              case "Doctor is inactive":
                setMessage(
                  "Your account has been locked by Admin. Please contact support@tatvacare.in / 9974062363"
                );
                break;

              default:
                if (reason === "forgotPassword") {
                  handleSwitch({
                    view: "setPassword",
                    doctor_unique_id,
                    mobileNumber,
                  });
                } else if (ssoUrl) {
                  // Redirect to SSO URL if applicable // append the url with device_type=desktop
                  // Append device type to the SSO URL
                  const updatedSsoUrl = isMobile
                    ? `${ssoUrl}&device_type=mobile`
                    : `${ssoUrl}&device_type=desktop`;

                  // Redirect to the updated SSO URL
                  window.location.href = updatedSsoUrl;
                } else {
                  throw new Error("Unexpected response from server.");
                }
            }
          } catch (error) {
            console.error("Error during OTP verification:", error);
          } finally {
            setLoading(false); // Hide loader
          }
        },
        (error) => {
          console.error("Error verifying OTP:", error);
          setMessage("Failed to verify OTP. Please try again.");
          setLoading(false); // Hide loader
        }
      );
    } else {
      console.error("verifyOtp method not found!");
      setLoading(false); // Hide loader
    }
  };

  const handleSwitch = (data) => {
    handleView(data);
  };

  useEffect(() => {
    // Reset OTP state when the mobile number changes
    setIsOtpSent(false);
    setCountdown(0);
    setMessage("");
    clearInterval(timer); // Clear the timer on mobile number change
  }, [mobileNumber]);

  return (
    <div className="login-container background-image">
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(194 194 194 / 70%)",
            // backdropFilter: "blur(8px)", // Blur effect
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
        </div>
      )} 
      <div className="login-card">
        <img
          src="https://diginextloginprod.z10.web.core.windows.net/phone_number_login_ui/images/main-logo.png"
          alt="Company Logo"
          style={{ width: "100%", marginBottom: "1rem" }}
        ></img>
        <h1>
          {reason === "forgotPassword" ? "Reset Password" : "Login with OTP"}
        </h1>

        <div className="color-red">{message}</div>
        <form>
          <label htmlFor="mobileNumber">Mobile Number *</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your mobile number"
            value={mobileNumber || ""}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="common-width"
          />
          <div id="captch-id"></div>
          <button
            type="button"
            className={`otp-button ${
              isButtonDisabled ? "disable" : ""
            } common-width`}
            onClick={handleSendOtp}
            disabled={isButtonDisabled}
          >
            {isOtpSent
              ? `Resend OTP ${countdown > 0 ? `(${countdown}s)` : ""}`
              : "Send OTP"}
          </button>

          {isOtpSent && (
            <>
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="common-width"
              />
              <br />
              <button
                type="button"
                className="login-button common-width"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
        {reason === "forgotPassword" ? (
          <br />
        ) : (
          <>
            <div className="separator">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="otp-button common-width"
              onClick={() => {
                window.location.href = `/login?view=loginWithPassword&number=${mobileNumber}`;
              }}
            >
              Login with Password
            </button>

            <br />
          </>
        )}
      </div>
    </div>
  );
};

export default LoginWithOTP;
