import React from "react";
import styles from "./CustomStepper.module.css";

const CustomStepper = ({ steps, currentStep, onStepClick }) => {
  // Handler for step clicks
  const handleStepClick = (stepIndex) => {
    // Only allow clicking on completed steps
    if (stepIndex < currentStep && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div className={styles.stepperOuter}>
      <div className={styles.stepsContainer}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isClickable = isCompleted && onStepClick;

          // Calculate label position to align with circle
          return (
            <div
              key={step.label}
              className={`${styles.stepWithLabel} ${
                isClickable ? styles.clickableStep : ""
              }`}
              onClick={() => handleStepClick(idx)}
              style={{ cursor: isClickable ? "pointer" : "default" }}
            >
              <div className={styles.stepCircleWrapper}>
                <div
                  className={
                    isCompleted
                      ? styles.circleCompleted
                      : isActive
                      ? styles.circleActive
                      : styles.circleUpcoming
                  }
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31"
                      height="31"
                      viewBox="0 0 31 31"
                      fill="none"
                    >
                      <path
                        d="M11.6471 20.2158L24.025 7.83789L25.6686 9.48141L11.6471 23.5028L5.12793 16.9856L6.77145 15.3421L11.6471 20.2158Z"
                        fill="white"
                      />
                    </svg>
                  ) : isActive ? (
                    <div className={styles.innerDot} />
                  ) : null}
                </div>

                {/* Only show connector if not the last step */}
                {idx < steps.length - 1 && (
                  <div
                    className={styles.connector}
                    style={{
                      background: idx < currentStep ? "#4f46e5" : "#d1d5db",
                    }}
                  />
                )}
              </div>

              <div className={styles.labelContainer}>
                <span
                  className={
                    isCompleted || isActive
                      ? styles.labelActive
                      : styles.labelUpcoming
                  }
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomStepper;
