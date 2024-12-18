import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const reasonParam = params.get("reason");
    const mobileNumber = params.get("number");

    // Set state based on query params
    if (viewParam) setCurrentView(viewParam || "loginWithOtp");
    if (reason) setReason(reasonParam);
    if (mobileNumber) setMobileNumber(mobileNumber);
  }, []);

  const handleView = (data) => {
    setData(data);
    if (data?.view === "loginWithOtp" && data?.reason === "forgotPassword" ){
        setReason(data?.reason)
        setCurrentView("loginWithOtp");
    } else if (data?.view === "loginWithOtp"){
        setCurrentView("loginWithOtp")
    } else if (data?.view === "loginWithPassword"){
        setCurrentView("loginWithPassword")
    } else if (data?.view === "setPassword"){
        setCurrentView("setPassword")
    }
  }

  const renderComponent = () => {
    switch (currentView) {
      case "loginWithOtp":
        return <LoginWithOTP handleView={handleView} reason={reason}  number={mobileNumber}/>;
      case "loginWithPassword":
        return <LoginWithPassword />;
      case "setPassword":
        return <SetPassword mobileNumber={mobileNumber} data={data}/>;
      default:
        return null;
    }
  };

  return <div className="auth-container">{renderComponent()}</div>;
};

export default AuthContainer;
