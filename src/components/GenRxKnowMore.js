import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Button, Spin, Tabs } from "antd";
import genRxIcon from "../assets/images/gen-rx-icon.svg";
import playIcons from "../assets/images/tube-icon.svg";
import VideoModal from "../common/VideoModal";
import ExpiredText from "../pages/monetization/components/ExpiredText";
import ContactSupport from "../pages/monetization/components/ContactSupport";
import { S_VOICE_RX } from "../utils/constants";
import FreeTrialButton from "../pages/monetization/components/FreeTrialButton";
import ExpiredSubModal from "../pages/monetization/components/ExpiredSubModal";

const GenRxTips = lazy(() => import("./GenRxTips"));

const { TabPane } = Tabs;

const GenRxKnowMore = ({ handleGenRxKnowMore }) => {
  const [shouldShowVideo, setShowVideo] = useState(false);
  const [activeKey, setActiveKey] = useState("basicGenRxInfo");
  const scrollContainerRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  
  const showHideSubModal = useCallback(() => {
    setIsSubModalOpen(!isSubModalOpen);
  }, [isSubModalOpen]);

  const sectionsRef = useRef({
    basicGenRxInfo: null,
    howGenRxWorks: null,
    genRxTips: null,
    contactSupport: null,
  });

  const videoLink = {
    link: "https://www.youtube.com/embed/OJQMLAidx9o",
    thumbnail: "https://i.ytimg.com/vi/OJQMLAidx9o/hqdefault.jpg",
  };

  const scrollToSection = (key) => {
    const section = sectionsRef.current[key];
    const scrollContainer = scrollContainerRef.current;

    if (!section || !scrollContainer) return;

    isScrollingProgrammatically.current = true;
    setActiveKey(key);

    // Calculate offset relative to scroll container
    let offsetTop = 0;
    let currentElement = section;

    while (currentElement && currentElement !== scrollContainer) {
      offsetTop += currentElement.offsetTop;
      currentElement = currentElement.offsetParent;
    }

    const targetScroll = Math.max(0, offsetTop - 150);

    scrollContainer.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 600);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let timeoutId = null;

    const updateActiveSection = () => {
      if (isScrollingProgrammatically.current) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const containerHeight = containerRect.height;

      // Check if we're near the bottom
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const isNearBottom = scrollTop + containerHeight >= scrollHeight - 50;

      let activeSection = null;
      let maxVisibleRatio = 0;

      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element) {
          const elementRect = element.getBoundingClientRect();

          const visibleTop = Math.max(elementRect.top, containerTop);
          const visibleBottom = Math.min(elementRect.bottom, containerBottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const elementHeight = elementRect.height;
          const visibleRatio =
            elementHeight > 0 ? visibleHeight / elementHeight : 0;

          // Special handling for contact support when near bottom
          if (key === "contactSupport" && isNearBottom && visibleHeight > 0) {
            activeSection = key;
            return;
          }

          if (visibleRatio > maxVisibleRatio && visibleHeight > 0) {
            maxVisibleRatio = visibleRatio;
            activeSection = key;
          }
        }
      });

      if (activeSection && activeSection !== activeKey) {
        setActiveKey(activeSection);
      }
    };

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveSection, 100);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial check
    setTimeout(updateActiveSection, 200);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeKey]);

  return (
    <Suspense
      fallback={
        <Spin className="d-flex justify-content-center align-items-center mt-5" />
      }
    >
      <div className="drawer-container">
        {/* Modal Header */}
        <div className="drawer-header">
          <div className="drawer-header-content justify-content-between border-bottom">
            <div className="d-flex align-items-center">
              <Button
                type="text"
                className="close-drawer-btn"
                onClick={handleGenRxKnowMore}
              >
                <i className="icon-Cross" style={{ fontSize: "30px" }}></i>
              </Button>
              <div className="drawer-title">AI-Powered Voice Rx</div>
            </div>
            <FreeTrialButton title={S_VOICE_RX} showHideSubModal={showHideSubModal} />
          </div>

          {/* Tabs */}
          <div className="drawer-tabs">
            <Tabs
              activeKey={activeKey}
              onChange={(key) => scrollToSection(key)}
            >
              <TabPane tab="Basic Info" key="basicGenRxInfo" />
              <TabPane tab="How it works" key="howGenRxWorks" />
              <TabPane tab="Tips for better Rx" key="genRxTips" />
              <TabPane tab="Contact Support" key="contactSupport" />
            </Tabs>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-scrollable-content" ref={scrollContainerRef}>
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
          </div>

          <div className="section">
            <ContactSupport refs={sectionsRef} />
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

        <ExpiredText title={S_VOICE_RX} />

        <ExpiredSubModal
          title={S_VOICE_RX}
          isSubModalOpen={isSubModalOpen}
          showHideSubModal={showHideSubModal} />

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