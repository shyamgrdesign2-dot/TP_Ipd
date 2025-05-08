import DoctorOnboarding from "./DoctorOnboarding";
import BasicInfoStep from "./steps/BasicInfoStep";
import ClinicDetailsStep from "./steps/ClinicDetailsStep";
import UploadProofStep from "./steps/UploadProofStep";
import { OnboardingProvider, useOnboarding } from "./OnboardingContext";
import OnboardingDrawer from "./OnboardingDrawer";
import useOnboardingTrigger from "./useOnboardingTrigger";
import OnboardingWrapper from "./OnboardingWrapper";

export {
  DoctorOnboarding,
  BasicInfoStep,
  ClinicDetailsStep,
  UploadProofStep,
  OnboardingProvider,
  useOnboarding,
  useOnboardingTrigger,
  OnboardingDrawer,
};

export default OnboardingWrapper;
