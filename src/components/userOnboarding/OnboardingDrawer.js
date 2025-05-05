import React from "react";
import DoctorOnboarding from "./DoctorOnboarding";
import { useOnboarding } from "./OnboardingContext";

const OnboardingDrawer = () => {
  const onboardingContext = useOnboarding();

  // Check if context is available
  if (!onboardingContext) {
    console.error("useOnboarding must be used within an OnboardingProvider");
    return null;
  }

  const { isOnboardingVisible, hideOnboarding } = onboardingContext;

  return (
    <DoctorOnboarding visible={isOnboardingVisible} onClose={hideOnboarding} />
  );
};

export default OnboardingDrawer;
