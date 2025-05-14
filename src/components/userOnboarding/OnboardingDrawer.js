import React, { useEffect } from "react";
import DoctorOnboarding from "./DoctorOnboarding";
import { useOnboarding } from "./OnboardingContext";
import { useNavigate, useLocation } from "react-router-dom";

const OnboardingDrawer = () => {
  const onboardingContext = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  // Use a default value to avoid conditional hook issues
  const isVisible = onboardingContext?.isOnboardingVisible || false;

  // Prevent scrolling when drawer is open - moved before conditional return
  useEffect(() => {
    if (isVisible) {
      // Check if we're not already on the final-setup page
      if (location.pathname !== "/final-setup") {
        // Redirect to the final setup page instead of showing the drawer
        navigate("/final-setup");
        return;
      }

      document.body.style.overflow = "hidden";
      // Add class to body for blur effect
      document.body.classList.add("drawer-open-blur");
    } else {
      document.body.style.overflow = "";
      // Remove class from body when drawer is closed
      document.body.classList.remove("drawer-open-blur");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("drawer-open-blur");
    };
  }, [isVisible, navigate, location.pathname]);

  // Check if context is available
  if (!onboardingContext) {
    console.error("useOnboarding must be used within an OnboardingProvider");
    return null;
  }

  const { isOnboardingVisible, hideOnboarding } = onboardingContext;

  // Don't render the drawer if we're on the final-setup page
  // as it will be rendered there directly
  if (location.pathname === "/final-setup") {
    return null;
  }

  return (
    <>
      <DoctorOnboarding
        visible={isOnboardingVisible}
        onClose={hideOnboarding}
      />
    </>
  );
};

export default OnboardingDrawer;
