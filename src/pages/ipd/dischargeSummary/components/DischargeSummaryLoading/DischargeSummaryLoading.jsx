import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import processingLottie from "../../../../../assets/lotties/ipd-page-loader.json";
import "./styles.scss";

const loadingMessages = [
  "Fetching key details from patient assessments...",
  "Analyzing progress notes to capture recovery highlights...",
  "Extracting vital insights from consultant and nursing notes...",
  "Reviewing lab reports and clinical observations...",
  "Summarizing hospital stay and treatment milestones...",
  "Ensuring accuracy across medications and interventions...",
  "Generating a concise, AI-assisted discharge summary...",
  "Finalizing patient summary for review and sign-off...",
];

const DISPLAY_INTERVAL_MS = 4000;

export default function DischargeSummaryLoading({ className = "" }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, DISPLAY_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`ds-loading ${className}`}>
      <div className="ds-loading__lottie">
        <Lottie
          animationData={processingLottie}
          loop
          autoplay
          // style={{ width: 250, height: 130 }}
        />
      </div>
      <p key={messageIndex} className="ds-loading__message" aria-live="polite">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
}
