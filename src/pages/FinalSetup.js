import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DoctorOnboarding from "../components/userOnboarding/DoctorOnboarding";
import { getUserMobileNumber } from "../components/userOnboarding/services/userDataService";

const FinalSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [initialStep, setInitialStep] = useState(0);

  // Get the step parameter from the URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get("step");

    if (stepParam) {
      // Convert to number and set as initial step
      setInitialStep(parseInt(stepParam, 10) - 1); // Adjust for 0-indexed steps
    }
  }, [location]);

  // Check if user has necessary data to proceed and handle page reloads
  useEffect(() => {
    const user = getUserMobileNumber();

    // Check if this is a page reload
    const isReload = sessionStorage.getItem("finalSetupVisited");

    // If page was reloaded or no user data, redirect to login
    if (isReload || !user) {
      navigate("/login");
      return;
    }

    // Mark that the page has been visited
    sessionStorage.setItem("finalSetupVisited", "true");

    // Clean up when component unmounts
    return () => {
      // Remove the flag when navigating away normally
      sessionStorage.removeItem("finalSetupVisited");
    };
  }, [navigate]);

  const handleClose = () => {
    setVisible(false);
    // Clean up session storage flag when closing normally
    sessionStorage.removeItem("finalSetupVisited");
    navigate("/?from=finalSetup");
  };

  return (
    <div className="final-setup-page">
      <DoctorOnboarding
        visible={visible}
        onClose={handleClose}
        initialStep={initialStep}
      />
    </div>
  );
};

export default FinalSetup;
