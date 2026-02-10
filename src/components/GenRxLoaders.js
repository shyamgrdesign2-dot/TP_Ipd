import React, { useState, useEffect, useRef } from "react";
import SkeletonScreen from "./SkeletonScreen";
import digitiseRxIcon from "../assets/images/digitise-rx.svg";
import styles from "./VoiceRxLoaders.module.css";
import GradientProgressBar from "./GradientProgressbar";
import genRxInputProcessing from "../assets/lotties/genRxInputProcessing.lottie";
import genRxConvertingData from "../assets/lotties/genRxConvertingData.lottie";
import genRxStructuringData from "../assets/lotties/genRxStructuringData.lottie";
import genRxFinalizingRx from "../assets/lotties/genRxFinalizingRx.lottie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CREEP_START = 60;
const CREEP_RATE = 1;
const CREEP_MS = 1000; 
const CREEP_CAP = 95;  

const GenRXLoaders = ({
  isProcessing,
  showAbsHeaderInsideLoader = false,
  isSnapRx = false,
  showStepText = true,
  showProgress = true,
  containerStyle,
}) => {
  const STEP_PROGRESS = !isSnapRx ? [0, 30, 45, 60] : [15, 15, 30, 60];
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const creepTimerRef = useRef(null);

  useEffect(() => {
    if (!isProcessing) return;

    setCurrentStep(0);
    setShowSkeleton(false);

    const stepDuration = 2000;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          if (isSnapRx && prev === 0) return prev + 2;
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isProcessing, isSnapRx]);

  useEffect(() => {
    if (!isProcessing) return;
    const target = STEP_PROGRESS[Math.min(currentStep, STEP_PROGRESS.length - 1)];
    setProgress((p) => (p < target ? target : p));
  }, [currentStep, isProcessing]);


  useEffect(() => {
    if (creepTimerRef.current) {
      clearInterval(creepTimerRef.current);
      creepTimerRef.current = null;
    }
    if (!isProcessing) return;

  
    if (progress >= CREEP_START && progress < CREEP_CAP) {
      creepTimerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p < CREEP_START) return p;
          if (p >= CREEP_CAP) return p;
          const next = Math.min(CREEP_CAP, p + CREEP_RATE);
          return next;
        });
      }, CREEP_MS);
    }

    return () => {
      if (creepTimerRef.current) {
        clearInterval(creepTimerRef.current);
        creepTimerRef.current = null;
      }
    };
  }, [isProcessing, progress]);

  useEffect(() => {
    if (isProcessing) return;

    setProgress(100);

    const swapDelayMs = 700;
    const toSkeleton = setTimeout(() => {
      setShowSkeleton(true);
      const hide = setTimeout(() => setShowSkeleton(false), 2000);
      return () => clearTimeout(hide);
    }, swapDelayMs);

    return () => clearTimeout(toSkeleton);
  }, [isProcessing]);

  if (showSkeleton) return <SkeletonScreen />;

  return (
    <div className={styles.backgroundContainer} style={containerStyle}>
      {showAbsHeaderInsideLoader ? (
        <div className="title-digitise-card-inside-loader">
          <img src={digitiseRxIcon} alt="rx-icon2" className="me-2" />
          {`Digitised Rx`}
        </div>
      ) : null}
      <div className="d-flex justify-content-center align-items-center flex-column z-3">
        {currentStep === 0 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <DotLottieReact
              src={genRxInputProcessing}
              loop
              autoplay
              style={{ width: 168, height: 140 }}
            />
            {showStepText && (
              <div className={styles.genRxLoadingText}>
                Your input is being processed in the backend...
              </div>
            )}
          </div>
        )}
        {currentStep === 1 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <DotLottieReact
              src={genRxConvertingData}
              loop
              autoplay
              style={{ width: 168, height: 140 }}
            />
            {showStepText && (
              <div className={styles.genRxLoadingText}>
                Converting your input data...
              </div>
            )}
          </div>
        )}
        {currentStep === 2 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <DotLottieReact
              src={genRxStructuringData}
              loop
              autoplay
              style={{ width: 168, height: 140 }}
            />
            {showStepText && (
              <div className={styles.genRxLoadingText}>
                Structuring your input data...
              </div>
            )}
          </div>
        )}
        {currentStep === 3 && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <DotLottieReact
              src={genRxFinalizingRx}
              loop
              autoplay
              style={{ width: 168, height: 140 }}
            />
            {showStepText && (
              <div className={styles.genRxLoadingText}>
                Finalizing your structured prescription...
              </div>
            )}
          </div>
        )}

        {showProgress ? (
          <GradientProgressBar height="11px" value={progress} />
        ) : null}
      </div>
    </div>
  );
};

export default GenRXLoaders;
