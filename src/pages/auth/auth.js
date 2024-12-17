import React, { useState } from "react";
import LoginWithOTP from "./components/LoginWithOTP";
import LoginWithPassword from "./components/LoginWithPassword";
import SetPassword from "./components/SetPassword";
import "./auth.scss";

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("loginWithOtp"); // Default to login with OTP
  const [isResetPassowrd, setIsResetPassowrd] = useState(false)

  const handleView = (data) => {
    if (data?.view === "loginWithOtp" && data?.reason === "forgotPassword" ){
        setCurrentView("loginWithOtp");
        setIsResetPassowrd(true);
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
        return <LoginWithOTP handleView={handleView} isResetPassowrd={isResetPassowrd} />;
      case "loginWithPassword":
        return <LoginWithPassword handleView={handleView} />;
      case "setPassword":
        return <SetPassword />;
      default:
        return null;
    }
  };

  return <div className="auth-container">{renderComponent()}</div>;
};

export default AuthContainer;
