import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import tipIcon from "../assets/images/tip.svg";
import Lottie from "lottie-react";
import mentionHeadingsLottie from "../assets/lotties/genRxMentionHeadingsTip.json";
import stayFocusedLottie from "../assets/lotties/genRxStayFocusedTip.json";
import beConciseLottie from "../assets/lotties/genRxBeConciseTip.json";
import youCanTypeTooLottie from "../assets/lotties/genRxYouCanTypeTooTip.json";

const carouselItemStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f5f5fc",
  borderRadius: "24px",
  padding: "20px",
  color: "#333",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.6",
  height: "168px",
  width: "460px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  flex: 1,
};

const tipStyle = {
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  fontSize: "16px",
  marginBottom: "12px",
};

const textStyle = {
  color: "#666",
  fontSize: "14px",
  marginTop: "4px",
};

const progressBarContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "10px",
};

const progressBar = {
  height: "6.44px",
  width: "41.58px",
  backgroundColor: "#F1F1FF",
  borderRadius: "5px",
  overflow: "hidden",
  position: "relative",
};

const progressIndicator = (progress) => ({
  height: "100%",
  width: `${progress}%`,
  backgroundColor: "#918FEF",
  transition: "width 0.3s ease-in-out",
});

const GenRxTips = ({ isKnowMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const carouselRef = useRef(null);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      ...(isKnowMore && { partialVisibilityGutter: 200 }),
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      ...(isKnowMore && { partialVisibilityGutter: 200 }),
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      ...(isKnowMore && { partialVisibilityGutter: 200 }),
    },
  };
  const tips = [
    {
      title: "Mention Headings",
      description:
        "While dictating Rx include headings like 'Symptoms', 'Medication' etc. to keep information organised.",
      animationData: mentionHeadingsLottie,
    },
    {
      title: "Stay Focused",
      description:
        "Stick to only prescription details. Avoid irrelevant information for clear and precise dictation.",
      animationData: stayFocusedLottie,
    },
    {
      title: "Dictate Rx in One Go",
      description:
        "Dictate prescription details clearly and completely in one go for better and faster results.",
      animationData: beConciseLottie,
    },
    {
      title: "You Can Type Too",
      description:
        "Listen to a sample voice dictation for guidance on how to dictate clear and concise prescriptions.",
      animationData: youCanTypeTooLottie,
    },
  ];

  const startProgress = () => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    setProgress(0);
    const duration = 5000; // 5 seconds
    const steps = 100; // Number of steps for smooth animation
    const interval = duration / steps;
    let currentProgress = 0;

    progressInterval.current = setInterval(() => {
      currentProgress += 100 / steps;
      if (currentProgress >= 100) {
        clearInterval(progressInterval.current);
        handleNextSlide();
      } else {
        setProgress(currentProgress);
      }
    }, interval);
  };

  // useEffect(() => {
  //   startProgress();
  //   return () => {
  //     if (progressInterval.current) {
  //       clearInterval(progressInterval.current);
  //     }
  //   };
  // }, [currentIndex]);

  const handleNextSlide = () => {
    const nextIndex = (currentIndex + 1) % tips.length;
    setCurrentIndex(nextIndex);
    if (carouselRef.current) {
      carouselRef.current.goToSlide(nextIndex);
    }
  };

  const handleSlideChange = (nextIndex) => {
    setCurrentIndex(nextIndex);
  };

  const CustomDot = ({ onClick, active }) => {
    return (
      <div style={progressBar} onClick={onClick}>
        {active && <div style={progressIndicator(progress)} />}
      </div>
    );
  };

  return (
    <div>
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={5000}
        infinite={true}
        showDots={false}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        beforeChange={(nextIndex) => handleSlideChange(nextIndex)}
        partialVisible
      >
        {tips.map((tip, index) => (
          <div key={index} style={carouselItemStyle}>
            <div style={columnStyle}>
              <div style={tipStyle}>
                <img
                  src={tipIcon}
                  alt="tip-icon"
                  style={{ marginRight: "8px" }}
                />
                <div style={{ color: "#4B4AD5" }}>{tip.title}</div>
              </div>
              <p style={textStyle}>{tip.description}</p>
            </div>
            <Lottie animationData={tip.animationData} loop={true} />
          </div>
        ))}
      </Carousel>

      <div style={progressBarContainer}>
        {tips.map((_, index) => (
          <CustomDot
            key={index}
            active={currentIndex === index}
            onClick={() => {
              setCurrentIndex(index);
              carouselRef.current?.goToSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GenRxTips;
