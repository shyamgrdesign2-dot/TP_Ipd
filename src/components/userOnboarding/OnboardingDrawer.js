import React, { useEffect } from "react";
import DoctorOnboarding from "./DoctorOnboarding";
import { useOnboarding } from "./OnboardingContext";

const OnboardingDrawer = () => {
  const onboardingContext = useOnboarding();

  // Use a default value to avoid conditional hook issues
  const isVisible = onboardingContext?.isOnboardingVisible || false;

  // Prevent scrolling when drawer is open - moved before conditional return
  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible]);

  // Check if context is available
  if (!onboardingContext) {
    console.error("useOnboarding must be used within an OnboardingProvider");
    return null;
  }

  const { isOnboardingVisible, hideOnboarding } = onboardingContext;

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
