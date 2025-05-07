import React from "react";
import styles from "./CustomStepper.module.css";
import { CheckOutlined } from "@ant-design/icons";

const CustomStepper = ({ steps, currentStep }) => {
  return (
    <div className={styles.stepperOuter}>
      <div className={styles.circlesRow}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <React.Fragment key={step.label}>
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
                  <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M6 11.5L10 15.5L16 8.5"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : isActive ? (
                  <div className={styles.innerDot} />
                ) : null}
              </div>
              {/* Connector to next step */}
              {idx !== steps.length - 1 && (
                <div
                  className={styles.connector}
                  style={{
                    background: idx < currentStep ? "#4f46e5" : "#d1d5db",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles.labelsRow}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <div
              key={step.label}
              className={
                isCompleted || isActive
                  ? styles.labelActive
                  : styles.labelUpcoming
              }
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomStepper;
