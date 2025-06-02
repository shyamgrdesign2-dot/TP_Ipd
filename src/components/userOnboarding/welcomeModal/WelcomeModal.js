import React, { useState } from "react";
import { Modal, useMediaQuery } from "antd";
import welcomdoc from "../../../assets/images/welcom-doc.svg";
import suporticon from "../../../assets/images/suport-icon.svg";
import { isMobile, isTablet } from "react-device-detect";
import "./WelcomeModal.scss";

const VideoCarousel = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: 1,
      url: "https://www.youtube.com/embed/ENARZJhE0iI?si=1TPlavqb5nvR0vx3",
      title: "Starting Walk-in Consultation with a New Patient",
      tag: "start consultation"
    },
    // {
    //   id: 2,
    //   url: "https://youtu.be/G9Ai6DtlhSk",
    //   title: "Starting Walk-in Consultation with a New Patient",
    //   tag: "Smart Sync"
    // },
    // {
    //   id: 3,
    //   url: "https://youtu.be/OJQMLAidx9o",
    //   title: "Starting Walk-in Consultation with a New Patient",
    //   tag: "Voice Rx"
    // },
  ];

  return (
    <div className="video-section">
      <iframe
        width="500"
        height={isMobile ? "200" : isTablet ? "300" : "350"}
        src={videos[currentVideo].url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="video-dots">
        {videos.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentVideo === index ? "active" : ""}`}
            onClick={() => setCurrentVideo(index)}
          />
        ))}
      </div>
    </div>
  );
};

const WelcomeModal = ({ modalOpen, setModalOpen, profile }) => {
  return (
    <div className="welcome-modals-wrapper">
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        className="modal-onboarding"
      >
        <img src={welcomdoc} alt="Welcome" className="welcome-icon" />
        <div className="modal-content-container">
          <div className="left-section">
            <h2 className="doctor-name">
              Dr. {profile?.um_name?.split(/\s+/)
                .filter(word => !["Dr", "Dr."].includes(word.toLowerCase()))
                .join(" ")},
            </h2>
            <h1 className="welcome-title">Welcome to TatvaPractice</h1>

            <div className="support-box">
              <img src={suporticon} alt="Support" className="support-icon" />
              <h3>We will connect with you soon</h3>
              <p>
                We will contact you within 24 hours to assist you in setting up your digital clinic and provide a walkthrough for writing prescription digitally.
              </p>
            </div>
          </div>

          <div className="right-section">
            <VideoCarousel />
          </div>
        </div>
        {/* this Will be added later along with the monetization feature */}
        {/* {!isMobile && (
          <div className="trial-period-footer">
            <div className="trial-text">
              <span>🎉</span>
            <span>Enjoy your <b>7 days</b> trial period</span>
          </div>
          <div className="upgrade-link-container">
            <span>This version is free for only 7 days. If you want to use advance features, Please</span>
            <a href="#" className="upgrade-link">upgrade your plan →</a>
            </div>
          </div>
        )} */}
      </Modal>
      {isMobile && (
        <div
          className="device-warning-content"
          style={{
            margin: 0,
            padding: "24px",
            width: "95%",
            zIndex: 1001,
            backgroundColor: "#19BB7A",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "flex-start",
            color: "white",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <img 
              src="/desktop-icon.svg" 
              alt="Desktop" 
              className="desktop-icon"
              style={{
                width: "40px",
                height: "40px",
              }} 
            />

            <h2 
              className="warning-title"
              style={{
                fontSize: "16px",
                fontWeight: "500",
                margin: 0,
                lineHeight: "1.2",
                color: "white",
                textAlign: "left",
              }}
            >
              For the best experience, open the platform on a desktop or tablet browser
            </h2>
          </div>

          <div 
            className="link-wrapper"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              // backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <a
              href="https://tatvapractice.tatvacare.in/"
              className="platform-link"
              style={{
                color: "white",
                textDecoration: "none",
                flex: 1,
                padding: "10px 16px",
                borderRadius: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              https://tatvapractice.tatvacare.in/
            </a>

            <div 
              className="action-buttons"
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button 
                className="action-btn"
                style={{
                  // backgroundColor: "transparent",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <img src="/copy-icon.svg" alt="Copy" style={{ width: "20px", height: "20px" }} />
              </button>
              <button 
                className="action-btn"
                style={{
                  // backgroundColor: "transparent",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <img src="/share-icon.svg" alt="Share" style={{ width: "20px", height: "20px" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeModal;
