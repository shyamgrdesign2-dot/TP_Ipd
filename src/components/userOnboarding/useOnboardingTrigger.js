import { useEffect } from "react";
import { useOnboarding } from "./OnboardingContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    // Show onboarding drawer if account status is false (needs verification)
    // or onboarding is not complete, or if forceShow is true
    if (forceShow) {
      // Instead of showing the drawer, navigate to the final-setup page
      navigate("/final-setup");
    }
  }, [forceShow, navigate]);

  // Return a function that navigates directly to the final setup page
  return {
    triggerOnboarding: () => navigate("/final-setup"),
  };
};

export default useOnboardingTrigger;
