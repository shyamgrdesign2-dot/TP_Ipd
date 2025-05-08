import { useEffect } from "react";
import { useOnboarding } from "./OnboardingContext";

/**
 * A hook to programmatically show the onboarding drawer
 * Based on certain conditions like account status or onboarding completion
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.accountStatus - User's account status
 * @param {boolean} options.onboardingComplete - Whether onboarding is complete
 * @param {boolean} options.forceShow - Force show the onboarding drawer
 */
const useOnboardingTrigger = ({
  accountStatus = true,
  onboardingComplete = false,
  forceShow = false,
} = {}) => {
  const { showOnboarding } = useOnboarding();

  useEffect(() => {
    // Show onboarding drawer if account status is false (needs verification)
    // or onboarding is not complete, or if forceShow is true
    if (!accountStatus || !onboardingComplete || forceShow) {
      showOnboarding();
    }
  }, [accountStatus, onboardingComplete, forceShow, showOnboarding]);

  return { triggerOnboarding: showOnboarding };
};

export default useOnboardingTrigger;
