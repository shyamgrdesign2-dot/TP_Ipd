import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPassword } from "../authService";
import "../auth.scss";
import { isMobile } from "react-device-detect";
import tavaPracticeLogo from "../../../assets/images/website-images/tatvacare_logo_with_tag.png";

const LoginWithPassword = ({ handleView }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginWithPassword(mobileNumber, password);

      // Extract the response fields
      const { message, statusCode, doctor_unique_id, ssoUrl } = response;

      // Check if the response contains an ssoUrl
      if (ssoUrl) {
        // Append device type to the SSO URL
        const updatedSsoUrl = isMobile
          ? `${ssoUrl}&device_type=mobile`
          : `${ssoUrl}&device_type=desktop`;

        // Redirect to the updated SSO URL
        window.location.href = updatedSsoUrl;
        return;
      }

      // Handle different messages from the response
      switch (message) {
        case "Password not set":
          if (statusCode === 204) {
            // Navigate to set-password page
            navigate("/set-password", {
              state: { doctor_unique_id, mobileNumber },
            });
          }
          break;

        case "Doctor does not exists!":
          // Show a user-friendly message
          setMessage("User is not registered with us");
          break;

        case "Login with otp":
          // Navigate to login with OTP page
          navigate("/login-otp");
          break;

        case "Doctor is inactive":
          // Show a message about inactive plan
          setMessage("Your plan is inactive. Please activate your plan.");
          break;

        case "Invalid username and password":
          // Show an invalid OTP message
          setMessage("Invalid username or password,Please try again");
          break;

        default:
          setMessage("Unexpected response. Please try again.");
          break;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  const handleSwitch = (data) => {
    handleView(data);
  };

  return (
    <div className="login-container background-image">
      <div className="login-card">
        {/* <img src={tavaPracticeLogo} alt="Logo" /> */}
        <img
          src="https://diginextloginprod.z10.web.core.windows.net/phone_number_login_ui/images/main-logo.png"
          alt="Company Logo"
          style={{ width: "100%", marginBottom: "1rem" }}
        ></img>
        <h1>Login</h1>
        <p>Please provide the following details.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="mobileNumber">Mobile Number *</label>
          <input
            type="text"
            id="mobileNumber"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          {<div className="color-red">{message}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div
          className="links"
          onClick={() =>
            handleSwitch({ view: "loginWithOtp", reason: "forgotPassword" })
          }
        >
          Forgot/Set Password?
        </div>

        <div className="separator">
          <span>OR</span>
        </div>

        <button
          className="otp-button"
          onClick={() => handleSwitch({ view: "loginWithOtp" })}
        >
          Login via OTP
        </button>
      </div>
    </div>
  );
};

export default LoginWithPassword;
