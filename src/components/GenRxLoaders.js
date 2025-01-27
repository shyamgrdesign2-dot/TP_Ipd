import React, { useState, useEffect, lazy, useContext } from "react";
import Lottie from "lottie-react";
import SkeletonScreen from "./SkeletonScreen";
import styles from "./VoiceRxLoaders.module.css";
import GradientProgressBar from "./GradientProgressbar";
import { AnimationContext } from "../context/AnimationContext";

const GenRXLoaders = ({ isProcessing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const animations = useContext(AnimationContext);

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
      setShowSkeleton(false); // Reset SkeletonScreen when processing starts
      const stepDuration = 2000; // 2 seconds for each step
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 3) {
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      // Show SkeletonScreen for 2 seconds after processing ends
      setShowSkeleton(true);
      const skeletonTimeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 2000);

      return () => clearTimeout(skeletonTimeout);
    }
  }, [isProcessing]);

  if (showSkeleton) {
    return <SkeletonScreen />;
  }

  return (
    <div className={styles.backgroundContainer}>
      <div className="d-flex justify-content-center align-items-center flex-column z-3">
        {currentStep === 0 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <Lottie
              animationData={animations.genRxInputProcessing}
              loop={true}
              style={{
                width: "167.97px",
              }}
            />
            <div className={styles.genRxLoadingText}>
              Your input is being processed in the backend...
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <Lottie
              animationData={animations.genRxConvertingData}
              loop={true}
              style={{
                width: "167.97px",
              }}
            />
            <div className={styles.genRxLoadingText}>
              Converting your input data...
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <Lottie
              animationData={animations.genRxStructuringData}
              loop={true}
              style={{
                width: "167.97px",
              }}
            />
            <div className={styles.genRxLoadingText}>
              Structuring your input data...
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <Lottie
              animationData={animations.genRxFinalizingRx}
              loop={true}
              style={{
                width: "167.97px",
              }}
            />
            <div className={styles.genRxLoadingText}>
              Finalizing your structured prescription...
            </div>
          </div>
        )}
        {currentStep >= 0 && currentStep < 4 && (
          <GradientProgressBar
            height="11px"
            duration={2000 * (4 - currentStep)} // Adjust duration dynamically
            onProgressComplete={() => null} // Handled via interval
          />
        )}
      </div>
    </div>
  );
};

export default GenRXLoaders;
