import './OnboardingSteps.css';
// import { Check } from '../Icons/Icons';

export default function OnboardingSteps({ currentStep }) {
  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Clinic Details' },
    { id: 3, name: currentStep === 3 ? 'Upload Proof' : 'Upload ID' }
  ];

  return (
    <div className="onboarding-steps">
      {steps.map((step, index) => (
        <div key={step.id} className="step-item">
          <div className={`step-indicator ${currentStep >= step.id ? 'active' : ''}`}>
            {currentStep > step.id ? (
              // <Check />
              <></>
            ) : (
              <div className={`step-dot ${currentStep === step.id ? 'active' : ''}`}></div>
            )}
          </div>
          <span className="step-name">{step.name}</span>
          {index < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.id ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}