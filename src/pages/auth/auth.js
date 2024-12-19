import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginWithOTP from "./components/LoginWithOTP";
import LoginWithPassword from "./components/LoginWithPassword";
import SetPassword from "./components/SetPassword";
import "./auth.scss";

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("loginWithOtp"); // Default to login with OTP
  const [isResetPassowrd, setIsResetPassowrd] = useState(false);
  const [reason, setReason] = useState("");
  const [mobileNumber, setMobileNumber] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const reasonParam = params.get("reason");
    const mobileNumber = params.get("number");
    const logoutParam = params.get("logout");

    if (logoutParam === "old") {
      // Clear local storage
      localStorage.clear();

      // Clear session storage (if used)
      sessionStorage.clear();
    }

    // Check for persistent storage key "auth-token"
    const authToken = localStorage.getItem("persistant.storage.key.auth-token");
    if (authToken) {
      // Redirect to home page
      navigate("/");
      return;
    }

    // Set state based on query params
    if (viewParam) setCurrentView(viewParam || "loginWithOtp");
    if (reasonParam) setReason(reasonParam);
    if (mobileNumber) setMobileNumber(mobileNumber);
  }, [navigate]);

  const handleView = (data) => {
    setData(data);
    if (data?.view === "loginWithOtp" && data?.reason === "forgotPassword") {
      setReason(data?.reason);
      setCurrentView("loginWithOtp");
    } else if (data?.view === "loginWithOtp") {
      setCurrentView("loginWithOtp");
    } else if (data?.view === "loginWithPassword") {
      setCurrentView("loginWithPassword");
    } else if (data?.view === "setPassword") {
      setCurrentView("setPassword");
    }
  };

  const renderComponent = () => {
    switch (currentView) {
      case "loginWithOtp":
        return (
          <LoginWithOTP
            handleView={handleView}
            reason={reason}
            number={mobileNumber}
          />
        );
      case "loginWithPassword":
        return <LoginWithPassword number={mobileNumber}/>;
      case "setPassword":
        return <SetPassword number={mobileNumber} data={data} />;
      default:
        return null;
    }
  };

  return <div className="auth-container">{renderComponent()}</div>;
};

export default AuthContainer;
