import React, { useEffect, useRef, useState } from "react";
import { Button, Tabs } from "antd";
import "./styles.scss";
import playIcons from "../../assets/images/tube-icon.svg";
import { Col, Row } from "react-bootstrap";
import VideoModal from "../../common/VideoModal";

const { TabPane } = Tabs;

const KnowMore = ({ handleKnowMore, data }) => {
  const [shouldShowVideo, setShowVideo] = useState(false);
  const [activeKey, setActiveKey] = useState("basicInfo");

  const sectionsRef = useRef({
    basicInfo: null,
    trust: null,
    howItWorks: null,
    tips: null,
  });

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
          console.log("INTEL ==> each entry", entry);
          if (entry.isIntersecting) {
            const distance = Math.abs(entry.boundingClientRect.top); // Distance from the top of the viewport
            console.log(
              "INTEL ==> ",
              entry,
              minDistance,
              distance,
              entry.boundingClientRect.top,
              entry.target.id
            );
            // console.log(distance, entry.target.id);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = entry.target.id; // Update the closest section
            }
          }
        });
        console.log(closestSection);

        if (closestSection) {
          setActiveKey(closestSection); // Update the active key
        }
      },
      {
        root: null, // Default is the viewport
        threshold: 0, // Trigger as soon as the section starts intersecting
        rootMargin: `0px 0px ${
          activeKey === "basicInfo"
            ? //  || activeKey === "howItWorks"
              "20%"
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
    <div className="know-more-drawer-container">
      {/* Modal Header */}
      <div className="drawer-header">
        <div className="drawer-header-content border-bottom">
          <Button
            type="text"
            className="close-drawer-btn"
            onClick={handleKnowMore}
          >
            <i className="icon-Cross" style={{ fontSize: "30px" }}></i>
          </Button>
          <div className="drawer-title">{data?.mainHeader}</div>
        </div>

        {/* Tabs */}
        <div className="drawer-tabs">
          <Tabs activeKey={activeKey} onChange={scrollToSection}>
            {data?.tabs?.map((tab) => (
              <TabPane tab={tab?.title} key={tab?.key} />
            ))}
          </Tabs>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="drawer-scrollable-content">
        {data?.basicInfo && (
          <div className="section">
            <span
              id="basicInfo"
              ref={(el) => (sectionsRef.current.basicInfo = el)}
              className="section-side-header"
            >
              {data?.basicInfo?.smallTitle}
            </span>
            <div className="know-more-section-tilte">
              {data?.basicInfo?.title}
            </div>
            <div className="know-more-section-content basic-info-section ">
              <img
                src={data?.basicInfo?.icon}
                alt="apex-AI"
                width={72}
                height={72}
              />
              <div>{data?.basicInfo?.description}</div>
            </div>
          </div>
        )}

        {data?.trust && (
          <div className="section" style={{ minHeight: 210 }}>
            <span
              id="trust"
              ref={(el) => (sectionsRef.current.trust = el)}
              className="section-side-header"
            >
              {data?.trust?.smallTitle}
            </span>
            <div className="know-more-section-tilte">{data?.trust?.title}</div>
            <div className="know-more-section-content d-flex">
              <Row md={3} lg={3} className="gy-4 w-100">
                {data?.trustDetails?.map((item, index) => (
                  <Col key={index} className="gx-4 d-flex">
                    <div
                      className="benefits-info-card"
                      style={{
                        height: 180,
                        width: "100%",
                        boxSizing: "border-box",
                        textAlign: "left",
                      }}
                    >
                      <div className="info-card-header align-items-start">
                        <img
                          src={item.icon}
                          alt="codeIcon"
                          className="info-card-icons"
                          style={{ paddingTop: 5 }}
                        />
                        <div
                          className="info-card-title"
                          style={{ textAlign: "left" }}
                        >
                          {item.title}
                        </div>
                      </div>
                      <div className="info-card-content">
                        {item.description}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}

        {data?.howItWorks && (
          <div
            className="video-section"
            // style={{ padding: "40px 0 980px 0", textAlign: "center" }}
          >
            <span
              id="howItWorks"
              ref={(el) => (sectionsRef.current.howItWorks = el)}
              className="section-side-header"
            >
              {data?.howItWorks?.smallTitle}
            </span>
            <div className="know-more-section-tilte">
              {data?.howItWorks?.title}
            </div>
            <div className="know-more-section-content">
              <div className="instruction-cvt-tutorial">
                {data?.howItWorks?.description}
              </div>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: `url(${data?.videoLink?.thumbnail})`,
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
        )}

        {data?.tips && (
          <div className="section">
            <span
              id="tips"
              ref={(el) => (sectionsRef.current.tips = el)}
              className="section-side-header"
            >
              {data?.tips?.smallTitle}
            </span>
            <div className="know-more-section-tilte">{data?.tips?.title}</div>
            {data?.tips?.description && (
              <div className="know-more-section-content cvt-tips-content">
                {data?.tips?.description}
              </div>
            )}
            {data?.tips?.list && (
              <div className="tips-list-container">
                {data?.tips?.list?.map((item, index) => (
                  <div key={index} className="tips-list-item">
                    <div className="tips-list-item-icon">
                      <img src={item.icon} alt="tip" />
                    </div>
                    <div className="tips-list-item-content">
                      <div className="tips-list-item-title">{item.title}</div>
                      <div className="tips-list-item-description">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {data?.disclaimer && (
              <div
                style={{ padding: "40px 0 80px 0", textAlign: "center" }}
                className="disclaimer-txt"
              >
                {data?.disclaimer}
              </div>
            )}
          </div>
        )}
      </div>
      {shouldShowVideo && (
        <VideoModal
          videoLink={data?.videoLink}
          onCancel={() => setShowVideo(false)}
        />
      )}
    </div>
  );
};

export default React.memo(KnowMore);
