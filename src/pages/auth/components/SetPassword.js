import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPassword, loginWithPassword } from "../authService"; // Import the new loginWithPassword API
import { useLocation } from "react-router-dom";
import "../auth.scss";
import { isMobile } from "react-device-detect";

const SetPassword = ({ mobileNumber, data }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setMessage(
        "Password must meet the following criteria:\n" +
        `${!passwordValidation.lengthCheck ? "- At least 8 characters long.\n" : ""}` +
        `${!passwordValidation.specialCharCheck ? "- Contains at least one special character.\n" : ""}` +
        `${!passwordValidation.uppercaseCheck ? "- Contains at least one uppercase letter.\n" : ""}` +
        `${!passwordValidation.lowercaseCheck ? "- Contains at least one lowercase letter.\n" : ""}`
      );
      return;
    }

    try {
      // Call the setPassword API to set the password
      await setPassword(data?.doctor_unique_id, newPassword);
      setMessage("Password set successfully, logging in...");

      // Call loginWithPassword API after password is successfully set
      const loginResponse = await loginWithPassword(
        mobileNumber || data?.mobileNumber,
        newPassword
      );
      const { ssoUrl, message } = loginResponse;

      // Check if the response contains a valid SSO URL and redirect
      if (ssoUrl) {
        // Append device type to the SSO URL
        const updatedSsoUrl = isMobile
          ? `${ssoUrl}&device_type=mobile`
          : `${ssoUrl}&device_type=desktop`;

        // Redirect to the updated SSO URL
        window.location.href = updatedSsoUrl;
      } else {
        setMessage("Unable to set password");
        window.location.href = `/login`;
      }
    } catch (error) {
      setMessage("Failed to set password. Please try again.");
    }
  };

  // Function to validate password strength
  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);

    return {
      isValid: lengthCheck && specialCharCheck && uppercaseCheck && lowercaseCheck,
      lengthCheck,
      specialCharCheck,
      uppercaseCheck,
      lowercaseCheck,
    };
  };

  return (
    <div className="login-container background-image">
      <div className="login-card">
        <img
          src="https://diginextloginprod.z10.web.core.windows.net/phone_number_login_ui/images/main-logo.png"
          alt="Company Logo"
          style={{ width: "100%", marginBottom: "1rem" }}
        ></img>
        <h1>Set Password</h1>
        <p>Please provide your new password details.</p>
        <div className="color-red" style={{fontSize:"14px"}}>{message}</div>
        <form onSubmit={handleSetPassword}>
          <label htmlFor="newPassword">New Password *</label>
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              // style={{ marginTop: "7px" }}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          {error && <div className="error-message color-red">{error}</div>}
          {success && <div className="success-message color-red">{success}</div>}

          <button type="submit" className="login-button">
            Set Password
          </button>
        </form>

        <div className="links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
