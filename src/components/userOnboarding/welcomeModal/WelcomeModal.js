import React, { useState } from "react";
import { Modal, useMediaQuery } from "antd";
import welcomdoc from "../../../assets/images/welcom-doc.svg";
import suporticon from "../../../assets/images/suport-icon.svg";
import "./WelcomeModal.scss";

const VideoCarousel = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: 1,
      url: "https://www.youtube.com/embed/ENARZJhE0iI?si=1TPlavqb5nvR0vx3",
      title: "Starting Walk-in Consultation with a New Patient",
      tag: "Voice Rx"
    },
    {
      id: 2,
      url: "https://www.youtube.com/embed/ENARZJhE0iI?si=1TPlavqb5nvR0vx3",
      title: "Starting Walk-in Consultation with a New Patient",
      tag: "Voice Rx"
    },
    {
      id: 3,
      url: "https://www.youtube.com/embed/ENARZJhE0iI?si=1TPlavqb5nvR0vx3",
      title: "Starting Walk-in Consultation with a New Patient",
      tag: "Voice Rx"
    },
    // ... other videos
  ];

  return (
    <div className="video-section">
      <iframe
        width="500"
        height="350"
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
      </Modal>
    </div>
  );
};

export default WelcomeModal;
