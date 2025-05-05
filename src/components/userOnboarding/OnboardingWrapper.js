import React from "react";
import { OnboardingProvider } from "./OnboardingContext";
import OnboardingDrawer from "./OnboardingDrawer";

/**
 * A wrapper component that combines the OnboardingProvider and OnboardingDrawer
 * This simplifies usage in the main App component
 */
const OnboardingWrapper = () => {
  return (
    <OnboardingProvider>
      <OnboardingDrawer />
    </OnboardingProvider>
  );
};

export default OnboardingWrapper;
