import React, { useState } from "react";
import { Tabs } from "antd";
import "../smartSync.css";
import playIcon from "../../../assets/images/tube-icon.svg";
import videoThumb from "../../../assets/images/website-images/know-more.jpg";

const { TabPane } = Tabs;

const CustomSSknowMore = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="drawer-container">
      {/* Modal Header */}
      <div className="drawer-header">
        {/* Tabs */}
        <div className="drawer-tabs">
          <Tabs defaultActiveKey="basicInfo">
            <TabPane tab={<span style={{ fontWeight: 600 }}>Basic Info</span>} key="basicInfo" />
            <TabPane tab={<span style={{ fontWeight: 400 }}>How it works</span>} key="howItWorks" />
          </Tabs>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="drawer-scrollable-content">
        <div id="basicInfo" className="section">
          <span className="section-side-header">Basic Info</span>
          <div className="know-more-section-tilte">What is Custom Canvas?</div>
          <div className="know-more-section-content basic-info-section">
            <div>
              Our AI engine seamlessly converts your handwritten prescriptions into a structured digital format within 30 seconds, streamlining your workflow and unlocking new possibilities to enhance patient care and efficiency
            </div>
          </div>
        </div>
        <div id="howItWorks" className="section">
          <span className="section-side-header">How it works</span>
          <div className="know-more-section-tilte">How Custom Canvas Works?</div>
          <div className="know-more-section-content">
            <div className="instruction-cvt-tutorial">
              Please watch this video to know how Custom Canvas Works👇
            </div>
            <div
              className="d-flex align-items-center justify-content-center know-more-video-thumb"
              style={{
                background: `url(${videoThumb})`,
                width: 447,
                height: 250,
                borderRadius: 24,
                cursor: "pointer",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "relative"
              }}
              onClick={() => setShowVideo(true)}
            >
              <img width={55} height={55} src={playIcon} alt="Play" className="know-more-play-icon" />
              <div className="know-more-video-duration">04:02</div>
              <div className="know-more-video-label">Custom Canvas</div>
            </div>
          </div>
          {showVideo && (
            <div className="video-modal-overlay">
              <div className="video-modal-content">
                <button className="video-modal-close" onClick={() => setShowVideo(false)}>&times;</button>
                <iframe
                  width="750"
                  height="420"
                  src="https://www.youtube.com/embed/UgeyXlHItXI"
                  title="How Custom Canvas Works"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomSSknowMore;
