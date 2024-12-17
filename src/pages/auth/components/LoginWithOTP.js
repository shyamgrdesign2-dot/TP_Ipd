import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser, verifyAccessToken } from "../authService";
import "../auth.scss"; // Assuming the provided styles are in this CSS file
import { isMobile } from "react-device-detect";
import tavaPracticeLogo from "../../../assets/images/website-images/tatvacare_logo_with_tag.png";

const LoginWithOTP = ({ handleView, isResetPassowrd }) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValidUser, setIsValidUser] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");

  // Timer states
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => clearInterval(timer);
  }, [countdown]);

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
          void 0; // No operation
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
      // Do not remove the script since it might be used globally
      // This cleanup is optional
    };
  }, []);

  const handleSendOtp = async () => {
    if (isButtonDisabled) return; // Prevent multiple clicks

    try {
      // Disable the button immediately
      setIsButtonDisabled(true);
      setMessage(""); // Clear any existing messages

      setMessage("");
      // Check if the user is already validated
      if (isValidUser) {
        // const isCaptchaVerified = window.isCaptchaVerified();
        // if (!isCaptchaVerified) {
        //   setMessage(
        //     "Captcha verification is required. Please check the box to proceed."
        //   );
        //   return;
        // }
        sendOtp();
        return;
      }

      // Validate mobile number
      if (!mobileNumber || mobileNumber.length < 10) {
        setMessage("Please enter a valid mobile number");
        return;
      }

      //   // Check Captcha verification
      //   const isCaptchaVerified = window.isCaptchaVerified();
      //   if (!isCaptchaVerified) {
      //     setMessage(
      //       "Captcha verification is required. Please check the box to proceed."
      //     );
      //     return;
      //   }

      // Step 1: Validate the user
      const response = await validateUser(mobileNumber);
      const { message } = response;

      // Step 2: Handle validation responses
      switch (message) {
        case "Doctor does not exists!":
          setMessage(
            "User is not registered with us, Please enter the registered number"
          );
          return;

        case "Doctor is inactive":
          setMessage("Your plan is inactive. Please activate your plan.");
          return;

        case "Doctor exists!":
          // Mark the user as valid and proceed to send OTP
          setIsValidUser(true);
          sendOtp(); // Call OTP sending method
          break;

        default:
          setMessage("Unexpected response from server.");
          break;
      }
    } catch (error) {
      console.error("Error during user validation:", error);
      setMessage("Failed to validate user. Please try again.");
    }
  };

  // Function to send OTP
  const sendOtp = () => {
    if (window.sendOtp) {
      window.sendOtp(
        `91${mobileNumber}`,
        (data) => {
          setIsOtpSent(true);
          setMessage("Verification code has been sent. Please check your SMS.");

          // Start the countdown timer
          setCountdown(30);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(timer);
                setIsButtonDisabled(false); // Re-enable button after countdown
              }
              return prev - 1;
            });
          }, 1000);
        },
        (error) => {
          console.error("Error sending OTP:", error);
          setMessage("Failed to send OTP. Please try again.");
          setIsButtonDisabled(false); // Re-enable button
        }
      );
    } else {
      console.error("sendOtp method not found!");
      setMessage("OTP service is unavailable.");
      setIsButtonDisabled(false); // Re-enable button
    }
  };

  const handleVerifyOtp = () => {
    setMessage("");
    if (!otp || otp.length < 6) {
      setMessage("Please enter a valid OTP");
      return;
    }

    if (window.verifyOtp) {
      window.verifyOtp(
        otp,
        async (data) => {
          const { token, message } = data;

          // Check if the message is "Invalid OTP"
          if (message === "Invalid OTP") {
            setMessage("Invalid OTP. Please try again.");
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
                if (statusCode === 204) {
                  // Update the parent state or call a function to render the SetPassword component
                  handleSwitch({
                    view: "SetPassword",
                    doctor_unique_id,
                    mobileNumber,
                  });
                }
                break;

              case "Doctor does not exists!":
                setMessage("User is not registered with us");
                break;

              case "Login with otp":
                // Update the parent state or call a function to render the LoginWithOtp component
                handleSwitch("loginWithOtp");
                break;

              case "Doctor is inactive":
                setMessage("Your plan is inactive. Please activate your plan.");
                break;

              default:
                if (isResetPassowrd) {
                  handleSwitch({ view: "setPassword" });
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
                break;
            }
          } catch (error) {
            console.error("Error during OTP verification:", error);
          }
        },
        (error) => {
          console.error("Error verifying OTP:", error);
          setMessage("Failed to verify OTP. Please try again.");
        }
      );
    } else {
      console.error("verifyOtp method not found!");
    }
  };

  const handleSwitch = (data) => {
    handleView(data);
  };

  return (
    <div className="login-container background-image">
      <div className="login-card">
        {/* <img
          src={tavaPracticeLogo}
          alt="Logo"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(13%) sepia(95%) saturate(7474%) hue-rotate(2deg) brightness(100%) contrast(107%)",
          }}
        /> */}
        <img
          src="https://diginextloginprod.z10.web.core.windows.net/phone_number_login_ui/images/main-logo.png"
          alt="Company Logo"
          style={{ width: "100%", marginBottom: "1rem" }}
        ></img>
        <h1>Login with OTP</h1>
        {/* <p>Enter your mobile number to receive an OTP</p> */}

        <div className="color-red">{message}</div>
        <form>
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <div id="captch-id"></div>
          <button
            type="button"
            className="otp-button"
            onClick={handleSendOtp}
            disabled={isButtonDisabled}
          >
            {isOtpSent
              ? `Resend OTP ${countdown > 0 ? `(${countdown}s)` : ""}`
              : "Send OTP"}
          </button>

          {/* <label htmlFor="otp">Enter OTP</label> */}
          {isOtpSent && (
            <>
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                className="login-button"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}
        </form>

        <div className="separator">
          <span>OR</span>
        </div>

        <button
          className="otp-button"
          onClick={() => handleSwitch({ view: "loginWithPassword" })}
        >
          Login with Password
        </button>
      </div>
    </div>
  );
};

export default LoginWithOTP;
