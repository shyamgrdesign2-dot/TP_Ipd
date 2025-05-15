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
      title: "Video 1",
    },
    {
      id: 2,
      url: "https://www.youtube.com/embed/YOUR_SECOND_VIDEO_ID",
      title: "Video 2",
    },
  ];

  return (
    <figure className="video-carousel">
      <iframe
        // width="498"
        // height="392"
        className="rounded-4"
        src={videos[currentVideo].url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{
          width: "100%",
          marginTop: 10,
        }}
      />
      <div className="video-dots">
        {videos.map((video, index) => (
          <span
            key={video.id}
            className={`dot ${currentVideo === index ? "active" : ""}`}
            onClick={() => setCurrentVideo(index)}
          />
        ))}
      </div>
    </figure>
  );
};

const WelcomeModal = ({ modalOpen, setModalOpen, profile }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="welcome-modals-wrapper">
      <Modal
        open={modalOpen}
        centered
        footer={null}
        width="95%"
        className="modal-onboarding"
        onCancel={() => setModalOpen(false)}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          top: "-9%",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ flex: 1}}>
            <figure>
              <img
                src={welcomdoc}
                style={{
                  width: window.innerWidth / 17,
                  height: window.innerWidth / 17,
                }}
                alt="Welcome"
              />
            </figure>

            <div className="main-modal-content">
              <div style={{ flex: 1 }}>
                <div>
                  <h2 className="fw-medium mb-2" style={{ fontSize: 16 }}>
                    Dr.{" "}
                    {profile?.um_name
                      .split(/\s+/)
                      .filter(
                        (word) =>
                          word.toLowerCase() !== "Dr".toLowerCase() &&
                          word.toLowerCase() !== "Dr.".toLowerCase()
                      )
                      .join(" ")}
                    ,
                  </h2>
                  <h3 className="fw-semibold" style={{ fontSize: "2rem" }}>
                    Welcome to TatvaPractice
                  </h3>
                </div>
                <div
                  style={{
                    background: "#fef4f5",
                    padding: 15,
                    borderRadius: 10,
                    width: "100%",
                  }}
                >
                  <span>
                    <img src={suporticon} alt="Support" />
                  </span>
                  <h3 className="fs-6 fw-medium" style={{ marginTop: 9 }}>
                    We will connect with you soon
                  </h3>
                  <p className="fs-7 fw-normal">
                    We will contact you within 24 hours to assist you in setting
                    up your digital clinic and provide a walkthrough for writing
                    prescription digitally.
                  </p>
                </div>
              </div>
              <VideoCarousel />
            </div>
          </div>
        </div>
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
