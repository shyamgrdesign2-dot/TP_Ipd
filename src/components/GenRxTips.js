import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import tipIcon from "../assets/images/tip.svg";
import Lottie from "lottie-react";
import mentionHeadingsLottie from "../assets/lotties/genRxMentionHeadingsTip.json";
import stayFocusedLottie from "../assets/lotties/genRxStayFocusedTip.json";
import beConciseLottie from "../assets/lotties/genRxBeConciseTip.json";
import youCanTypeTooLottie from "../assets/lotties/genRxYouCanTypeTooTip.json";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const carouselItemStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(75, 74, 213, 0.08)",
  borderRadius: "24px",
  padding: "20px",
  height: "168px",
  width: "460px",
  margin: "0 auto",
  transition: "transform 0.3s ease",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  flex: 1,
  marginRight: "20px",
};

const tipStyle = {
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  fontSize: "16px",
  marginBottom: "12px",
};

const tipIconStyle = {
  marginRight: "8px",
  width: "20px",
  height: "20px",
};

const tipTitleStyle = {
  color: "#4B4AD5",
};

const textStyle = {
  color: "#666",
  fontSize: "14px",
  marginTop: "4px",
  lineHeight: "1.5",
};

const progressBarContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "16px",
};

const progressBarStyle = {
  height: "6.44px",
  width: "41.58px",
  backgroundColor: "#F1F1FF",
  borderRadius: "5px",
  overflow: "hidden",
  position: "relative",
  cursor: "pointer",
};

const progressIndicator = (progress) => ({
  height: "100%",
  width: `${progress}%`,
  backgroundColor: "#918FEF",
  transition: "width 0.3s linear",
  position: "absolute",
  left: 0,
  top: 0,
});

const arrowButtonBase = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  zIndex: 10,
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.3s ease",
};

const leftArrowStyle = {
  ...arrowButtonBase,
  left: "0px",
};

const rightArrowStyle = {
  ...arrowButtonBase,
  right: "0px",
};

const GenRxTips = ({ isKnowMore }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const carouselRef = useRef(null);

  const tips = useMemo(
    () => [
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
    ],
    []
  );

  const startProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    setProgress(0);
    const duration = 5000;
    const steps = 50;
    const interval = duration / steps;

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          setTimeout(() => {
            carouselRef.current?.next();
          }, 0);
          return 0;
        }
        return prev + 100 / steps;
      });
    }, interval);
  }, []);

  useEffect(() => {
    Promise.all(
      tips.map(
        (tip) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = tipIcon;
          })
      )
    ).then(() => {
      setIsLoading(false);
      setTimeout(() => startProgress(), 0);
    });
  }, [tips, startProgress]);

  useEffect(() => {
    if (!isLoading) {
      startProgress();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, startProgress, isLoading]);

  const responsive = useMemo(
    () => ({
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        partialVisibilityGutter: isKnowMore ? 200 : 0,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        partialVisibilityGutter: isKnowMore ? 200 : 0,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        partialVisibilityGutter: isKnowMore ? 200 : 0,
      },
    }),
    [isKnowMore]
  );

  const handleSlideChange = useCallback(
    (_, nextIndex) => {
      clearInterval(progressInterval.current);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex((nextIndex?.currentSlide - 1) % tips.length);
        startProgress();
      }, 0);
    },
    [startProgress, tips.length]
  );

  if (isLoading) return null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        autoPlay={false}
        infinite={true}
        showDots={false}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        beforeChange={handleSlideChange}
        partialVisible={isKnowMore}
        arrows={!isKnowMore}
        customLeftArrow={
          <button
            style={leftArrowStyle}
            onClick={() => carouselRef.current?.previous()}
          >
            <LeftOutlined />
          </button>
        }
        customRightArrow={
          <button
            style={rightArrowStyle}
            onClick={() => carouselRef.current?.next()}
          >
            <RightOutlined />
          </button>
        }
      >
        {tips.map((tip, index) => (
          <div key={index} style={carouselItemStyle}>
            <div style={columnStyle}>
              <div style={tipStyle}>
                <img src={tipIcon} alt="tip-icon" style={tipIconStyle} />
                <div style={tipTitleStyle}>{tip.title}</div>
              </div>
              <p style={textStyle}>{tip.description}</p>
            </div>
            <Lottie
              animationData={tip.animationData}
              loop={true}
              style={{ minWidth: "120px" }}
            />
          </div>
        ))}
      </Carousel>

      <div style={progressBarContainer}>
        {tips.map((_, index) => (
          <div
            key={index}
            style={progressBarStyle}
            onClick={() => {
              carouselRef.current?.goToSlide(index);
              setTimeout(() => {
                setCurrentIndex(index);
                startProgress();
              }, 0);
            }}
          >
            {currentIndex === index && (
              <div style={progressIndicator(progress)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(GenRxTips);
