import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPassword, loginWithPassword } from "../authService"; // Import the new loginWithPassword API
import { useLocation } from "react-router-dom";
import "../auth.scss";
import { isMobile } from "react-device-detect";

const SetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the setPassword API to set the password
      await setPassword(state?.doctor_unique_id, newPassword);
      setSuccess("Password set successfully, logging in into");
      alert("Password set successfully, logging in into");

      // Call loginWithPassword API after password is successfully set
      const loginResponse = await loginWithPassword(
        state?.mobileNumber,
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
        setError("Unable to log in");
        navigate("login-otp");
      }
    } catch (error) {
      setError("Failed to set password. Please try again.");
    }
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
              style={{ marginTop: "7px" }}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
