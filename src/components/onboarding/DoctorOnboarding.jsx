import { useState } from 'react';
import OnboardingSteps from './OnboardingSteps';
import BasicInfoStep from './BasicInfoStep';
import ClinicDetailsStep from './ClinicDetailsStep';
import UploadProofStep from './UploadProofStep';
import Button from './Button';
import './DoctorOnboarding.css';

export default function DoctorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "Dr Shyam Sundar",
    speciality: "Dermatologist",
    clinicName: "Minim Clinic",
    clinicPincode: "560047",
    clinicAddress: "#4 & # 5 divyasharya apartment, VGS layout",
    location: "",
    isDetectingLocation: false
  });
  const [isOpen, setIsOpen] = useState(true);

  const updateFormData = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const detectLocation = () => {
    setFormData(prevData => ({
      ...prevData,
      isDetectingLocation: true
    }));
    
    // Simulate location detection with a timeout
    setTimeout(() => {
      setFormData(prevData => ({
        ...prevData,
        isDetectingLocation: false,
        location: "Bengaluru, KA"
      }));
    }, 1500);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <ClinicDetailsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            detectLocation={detectLocation} 
          />
        );
      case 3:
        return <UploadProofStep />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="doctor-onboarding">
      <div className="onboarding-header">
        <h2>Final Setup!</h2>
        {currentStep === 3 ? (
          <div className="action-buttons">
            <Button variant="outline" className="skip-button">Skip & upload later</Button>
            <Button variant="secondary" className="finish-button">Finish Setup</Button>
          </div>
        ) : (
          <Button variant="primary" onClick={nextStep}>Next</Button>
        )}
      </div>

      <div className="onboarding-content">
        <OnboardingSteps currentStep={currentStep} />
        {renderStepContent()}
      </div>
    </div>
  );
}