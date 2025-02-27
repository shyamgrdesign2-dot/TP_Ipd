import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Button, Spin, Tabs } from "antd";
import genRxIcon from "../assets/images/gen-rx-icon.svg";
import playIcons from "../assets/images/tube-icon.svg";
import VideoModal from "../common/VideoModal";

const GenRxTips = lazy(() => import("./GenRxTips"));

const { TabPane } = Tabs;

const GenRxKnowMore = ({ handleGenRxKnowMore }) => {
  const [shouldShowVideo, setShowVideo] = useState(false);
  const [activeKey, setActiveKey] = useState("basicGenRxInfo");

  const sectionsRef = useRef({
    basicGenRxInfo: null,
    howGenRxWorks: null,
    genRxTips: null,
  });

  const videoLink = {
    link: "https://www.youtube.com/embed/OJQMLAidx9o",
    thumbnail: "https://i.ytimg.com/vi/OJQMLAidx9o/hqdefault.jpg",
  };

  const scrollToSection = (key) => {
    const section = sectionsRef.current[key];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let closestSection = null;
        let minDistance = Number.MAX_VALUE;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const distance = Math.abs(entry.boundingClientRect.top); // Distance from the top of the viewport
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = entry.target.id; // Update the closest section
            }
          }
        });

        if (closestSection) {
          setActiveKey(closestSection); // Update the active key
        }
      },
      {
        root: null, // Default is the viewport
        threshold: 0, // Trigger as soon as the section starts intersecting
        rootMargin: `0px 0px ${
          activeKey === "basicGenRxInfo" || activeKey === "howGenRxWorks"
            ? "20%"
            : "-20%"
        } 0px`, // Focus on sections near the top of the viewport
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      // Cleanup observer
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <Suspense
      fallback={
        <Spin className="d-flex justify-content-center align-items-center mt-5" />
      }
    >
      <div className="drawer-container">
        {/* Modal Header */}
        <div className="drawer-header">
          <div className="drawer-header-content border-bottom">
            <Button
              type="text"
              className="close-drawer-btn"
              onClick={handleGenRxKnowMore}
            >
              <i className="icon-Cross" style={{ fontSize: "30px" }}></i>
            </Button>
            <div className="drawer-title">AI-Powered Voice Rx</div>
          </div>

          {/* Tabs */}
          <div className="drawer-tabs">
            <Tabs activeKey={activeKey} onChange={scrollToSection}>
              <TabPane tab="Basic Info" key="basicGenRxInfo" />
              <TabPane tab="How it works" key="howGenRxWorks" />
              <TabPane tab="Tips for better Rx" key="genRxTips" />
            </Tabs>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-scrollable-content">
          <div className="section">
            <span
              id="basicGenRxInfo"
              ref={(el) => (sectionsRef.current.basicGenRxInfo = el)}
              className="section-side-header"
            >
              Basic Info
            </span>
            <div className="know-more-section-tilte">What is Voice Rx</div>
            <div className="know-more-section-content basic-info-section ">
              <img src={genRxIcon} alt="apex-AI" width={72} height={72} />
              <div>
                Voice Rx is an AI-powered tool designed to streamline the
                prescription-writing process by combining voice and typing
                inputs. It helps doctors generate structured prescriptions
                faster and more efficiently, reducing the time spent on
                administrative tasks.
              </div>
            </div>
          </div>

          <div className="video-section">
            <span
              id="howGenRxWorks"
              ref={(el) => (sectionsRef.current.howGenRxWorks = el)}
              className="section-side-header"
            >
              How it works
            </span>
            <div className="know-more-section-tilte">
              How Does Voice Rx Work?
            </div>
            <div className="know-more-section-content">
              <div className="instruction-cvt-tutorial">
                Please watch this video to know how Voice Rx Works👇
              </div>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: `url(${videoLink.thumbnail})`,
                  width: 447,
                  height: 272,
                  borderRadius: 24,
                  cursor: "pointer",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => setShowVideo(true)}
              >
                <img width={55} height={55} src={playIcons} />
              </div>
            </div>
          </div>

          <div className="section">
            <span
              id="genRxTips"
              ref={(el) => (sectionsRef.current.genRxTips = el)}
              className="section-side-header"
            >
              Tips for Better Rx
            </span>
            <div className="know-more-section-tilte mb-4">
              Tips to dictate/write an Rx for better Rx Digitisation
            </div>
            <GenRxTips isKnowMore />
            <div
              style={{
                padding: "40px 0 80px 0",
                textAlign: "center",
                fontSize: "12px",
              }}
              className="disclaimer-txt"
            >
              <b>Disclaimer</b>: These results are generated by AI. Please
              double-check all details to ensure they are correct and complete.
            </div>
          </div>
        </div>
        {shouldShowVideo && (
          <VideoModal
            videoLink={videoLink}
            onCancel={() => setShowVideo(false)}
          />
        )}
      </div>
    </Suspense>
  );
};

export default React.memo(GenRxKnowMore);
