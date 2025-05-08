import React, { useEffect } from "react";
import DoctorOnboarding from "./DoctorOnboarding";
import { useOnboarding } from "./OnboardingContext";
import BlurredOverlay from "./BlurredOverlay";

const OnboardingDrawer = () => {
  const onboardingContext = useOnboarding();

  // Use a default value to avoid conditional hook issues
  const isVisible = onboardingContext?.isOnboardingVisible || false;

  // Prevent scrolling when drawer is open - moved before conditional return
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
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
      <BlurredOverlay visible={isOnboardingVisible} />
      <DoctorOnboarding
        visible={isOnboardingVisible}
        onClose={hideOnboarding}
      />
    </>
  );
};

export default OnboardingDrawer;
