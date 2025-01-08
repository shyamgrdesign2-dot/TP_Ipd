import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import tipIcon from "../assets/images/tip.svg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const carouselItemStyle = {
  display: "flex",
  flexDirection: "row", // Changed to row for two-column layout
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f5f5fc",
  borderRadius: "10px",
  padding: "20px",
  color: "#333",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.6",
  height: "180px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  flex: 1,
};

const tipStyle = {
  fontWeight: "600",
  color: "#4b59f7",
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

const iconStyle = {
  marginRight: "8px",
  width: "16px",
  height: "16px",
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const progressBarContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "10px",
};

const progressBar = (isActive) => ({
  height: "6px",
  width: "30px",
  borderRadius: "5px",
  backgroundColor: isActive ? "#4b59f7" : "#d3d3d3",
  transition: "background-color 0.3s ease-in-out",
});

const tipExampleStyle = {
  width: "214px",
  height: "140px",
  borderRadius: "24px 24px 24px 0px",
  border: "0.89px 0px 0px 0px",
  background: "rgba(255, 255, 255, 1)",
};

const arrowStyle = {
  position: "absolute",
  top: "50%",
  // transform: "translateY(-50%)",
  // background: "#ffffff",
  // border: "1px solid #4b59f7",
  // borderRadius: "50%",
  height: "40px",
  width: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 10,
};

const CustomLeftArrow = ({ onClick }) => {
  return (
    <div
      // className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
      style={{ ...arrowStyle, left: "-10px" }}
      onClick={onClick}
    >
      <i className="icon-left"></i>
    </div>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <div
      // className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
      style={{ ...arrowStyle, right: "-10px" }}
      onClick={onClick}
    >
      <i className="icon-right"></i>
    </div>
  );
};

const GenRxTips = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tips = [
    {
      title: "Mention Headings",
      description:
        "While dictating Rx include headings like 'Symptoms', 'Medication' etc. to keep information organised.",
    },
    {
      title: "Stay Focused",
      description:
        "Stick to only prescription details. Avoid irrelevant information for clear and precise dictation.",
    },
    {
      title: "Dictate Rx in One Go",
      description:
        "Dictate prescription details clearly and completely in one go for better and faster results.",
    },
    {
      title: "Sample Rx Audio",
      description:
        "Listen to a sample voice dictation for guidance on how to dictate clear and concise prescriptions.",
    },
    {
      title: "Mention Headings",
      description: `Begin with clear headings like  or "Symptoms" , "Medication" etc. to keep information organised.`,
    },
  ];

  const handleSlideChange = (nextIndex) => {
    setCurrentIndex(nextIndex);
  };

  return (
    <div>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={3000}
        infinite={true}
        showDots={false}
        afterChange={handleSlideChange}
        // customLeftArrow={<CustomLeftArrow />}
        // customRightArrow={<CustomRightArrow />}
      >
        {tips.map((tip, index) => (
          <div key={index} style={carouselItemStyle}>
            {/* Column 1: Title and Description */}
            <div style={columnStyle}>
              <div style={tipStyle}>
                <img src={tipIcon} alt="tip-icon" style={iconStyle} />
                {tip.title}
              </div>
              <p style={textStyle}>{tip.description}</p>
            </div>
            {/* Column 2: Tip Example */}
            <div style={tipExampleStyle}>{tip.example}</div>
          </div>
        ))}
      </Carousel>
      {/* Custom Progress Bar */}
      <div style={progressBarContainer}>
        {tips.map((_, index) => (
          <div key={index} style={progressBar(index === currentIndex)} />
        ))}
      </div>
    </div>
  );
};

export default GenRxTips;
