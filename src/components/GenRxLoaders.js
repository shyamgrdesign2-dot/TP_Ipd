import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import SkeletonScreen from "./SkeletonScreen";
import styles from "./GenRXLoaders.css";
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
    <>
      {currentStep === 0 && (
        <div
          className={styles.gradientSkeleton}
          style={{ background: `url(${genRxBg})`, opacity: "10%" }}
        ></div>
      )}
      <div style={{ margin: "auto" }}>
        {currentStep === 1 && (
          <div>
            <Lottie
              animationData={genRxInputProcessingLottie}
              loop={true}
              style={{
                width: "167.97px",
                height: "174.44px",
              }}
            />
            <div
              style={{
                fontSize: "19.38px",
                fontWeight: 400,
                lineHeight: "29.07px",
                textAlign: "left",
                color: "#45455199",
                marginBottom: "20px",
              }}
            >
              Your input is being processed in the backend...
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <Lottie
              animationData={genRxConvertingDataLottie}
              loop={true}
              style={{
                width: "167.97px",
                height: "174.44px",
              }}
            />
            <div
              style={{
                fontSize: "19.38px",
                fontWeight: 400,
                lineHeight: "29.07px",
                textAlign: "left",
                color: "#45455199",
                marginBottom: "20px",
              }}
            >
              Converting your input data...
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <Lottie
              animationData={genRxFinalizingRx}
              loop={true}
              style={{
                width: "167.97px",
                height: "174.44px",
              }}
            />
            <div
              style={{
                fontSize: "19.38px",
                fontWeight: 400,
                lineHeight: "29.07px",
                textAlign: "left",
                color: "#45455199",
                marginBottom: "20px",
              }}
            >
              Finalizing your structured prescription...
            </div>
          </div>
        )}
        {currentStep > 0 && currentStep < 4 && (
          <GradientProgressBar
            height="11px"
            duration={2000 * (4 - currentStep)} // Adjust duration dynamically
            onProgressComplete={() => null} // Handled via interval
          />
        )}
      </div>
    </>
  );
};

export default GenRXLoaders;
