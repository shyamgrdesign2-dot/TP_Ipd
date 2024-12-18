import React, { useState, useEffect } from "react";
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
    setError(null); // Reset any previous errors
    setMessage(null); // Clear any existing messages
  
    // Step 1: Input Validation
    const trimmedMobileNumber = mobileNumber?.trim();
    const trimmedPassword = password?.trim();
  
    if (!trimmedMobileNumber || !/^\d{10}$/.test(trimmedMobileNumber)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    if (!trimmedPassword) {
      setMessage("Please enter your password.");
      return;
    }
  
    try {
      // Step 2: Call login API
      setMobileNumber(trimmedMobileNumber)
      const response = await loginWithPassword(trimmedMobileNumber, trimmedPassword);
  
      // Step 3: Extract response fields
      const { message, ssoUrl } = response;
  
      // Step 4: Handle SSO URL Redirection
      if (ssoUrl) {
        const updatedSsoUrl = isMobile
          ? `${ssoUrl}&device_type=mobile`
          : `${ssoUrl}&device_type=desktop`;
  
        window.location.href = updatedSsoUrl;
        return;
      }
  
      // Step 5: Handle Server Response Messages
      switch (message) {
        case "Doctor does not exists!":
          setMessage("User is not registered with us.");
          break;
  
        case "Login with otp":
          // Redirect to login with OTP page and pass the mobile number
          window.location.href = `/login?view=loginWithOtp&reason=setPassword&number=${trimmedMobileNumber}`;
          break;
  
        case "Doctor is inactive":
          setMessage("Your plan is inactive. Please activate your plan.");
          break;
  
        case "Invalid username and password":
          setMessage("Invalid username or password. Please try again.");
          break;
  
        default:
          throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      // Step 6: Error Handling
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
          onClick={() => {
            window.location.href = `/login?view=loginWithOtp&reason=forgotPassword&number=${mobileNumber}`
          }}
        >
          Forgot/Set Password?
        </div>

        <div className="separator">
          <span>OR</span>
        </div>

        <button
          className="otp-button"
          onClick={() => {
            window.location.href = `/login?view=loginWithOtp&number=${mobileNumber}`;
          }}
        >
          Login via OTP
        </button>
      </div>
    </div>
  );
};

export default LoginWithPassword;
