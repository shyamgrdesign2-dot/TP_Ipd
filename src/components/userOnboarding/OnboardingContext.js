import React, { createContext, useState, useContext } from "react";

// Define a default context value
const defaultContextValue = {
  isOnboardingVisible: false,
  showOnboarding: () => {},
  hideOnboarding: () => {},
};

const OnboardingContext = createContext(defaultContextValue);

export const OnboardingProvider = ({ children }) => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  const showOnboarding = () => {
    setIsOnboardingVisible(true);
  };

  const hideOnboarding = () => {
    setIsOnboardingVisible(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingVisible,
        showOnboarding,
        hideOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);

export default OnboardingContext;
