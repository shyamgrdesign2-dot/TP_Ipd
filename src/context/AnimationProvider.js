import { useState, useEffect } from "react";
import { AnimationContext } from "./AnimationContext";

export const AnimationProvider = ({ children }) => {
  const [animations, setAnimations] = useState({});

  useEffect(() => {
    Promise.all([
      fetch("/assets/lottie/genRxSendCta.json"),
      fetch("/assets/lottie/tatvaAiChakra.json"),
      fetch("/assets/lottie/genRxMentionHeadingsTip.json"),
      fetch("/assets/lottie/genRxStayFocusedTip.json"),
      fetch("/assets/lottie/genRxBeConciseTip.json"),
      fetch("/assets/lottie/genRxYouCanTypeTooTip.json"),
      fetch("/assets/lottie/genRxInputProcessing.json"),
      fetch("/assets/lottie/genRxConvertingData.json"),
      fetch("/assets/lottie/genRxStructuringData.json"),
      fetch("/assets/lottie/genRxFinalizingRx.json"),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((data) =>
        setAnimations({
          genRxSendCta: data[0],
          tatvaAiChakra: data[1],
          headings: data[2],
          focused: data[3],
          concise: data[4],
          type: data[5],
          genRxInputProcessing: data[6],
          genRxConvertingData: data[7],
          genRxStructuringData: data[8],
          genRxFinalizingRx: data[9],
        })
      );
  }, []);

  return (
    <AnimationContext.Provider value={animations}>
      {children}
    </AnimationContext.Provider>
  );
};
