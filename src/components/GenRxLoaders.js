import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import SkeletonScreen from "./SkeletonScreen";
import styles from "./VoiceRxLoaders.module.css";
import genRxInputProcessingLottie from "../assets/lotties/genRxInputProcessing.json";
import genRxConvertingDataLottie from "../assets/lotties/genRxConvertingData.json";
import genRxFinalizingRx from "../assets/lotties/genRxFinalizingRx.json";
import genRxBg from "../assets/images/gen-rx-bg.gif";
import GradientProgressBar from "./GradientProgressbar";

const GenRXLoaders = ({ isProcessing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
      setShowSkeleton(false); // Reset SkeletonScreen when processing starts
      const stepDuration = 2000; // 2 seconds for each step
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 2) {
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
              animationData={genRxInputProcessingLottie}
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
              animationData={genRxConvertingDataLottie}
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
              animationData={genRxFinalizingRx}
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
        {currentStep >= 0 && currentStep < 3 && (
          <GradientProgressBar
            height="11px"
            duration={2000 * (3 - currentStep)} // Adjust duration dynamically
            onProgressComplete={() => null} // Handled via interval
          />
        )}
      </div>
    </div>
  );
};

export default GenRXLoaders;
