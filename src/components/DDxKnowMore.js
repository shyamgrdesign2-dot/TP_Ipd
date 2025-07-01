import React, { useEffect, useRef, useState } from "react";
import { Button, Tabs } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import codeIcon from "../assets/images/code.svg";
import clinicalStudyIcon from "../assets/images/clinical-study.svg";
import compliantIcon from "../assets/images/compliant.svg";
import validateHealthcareIcon from "../assets/images/validate-heathcare.svg";
import playIcons from "../assets/images/tube-icon.svg";
import { Col, Row } from "react-bootstrap";
import VideoModal from "../common/VideoModal";

const { TabPane } = Tabs;

const trustDetails = [
  {
    title: "Evidence-Based Algorithms",
    description:
      "Built on leading clinical guidelines such as ICD-10 and SNOMED CT to ensure reliable and accurate results",
    icon: codeIcon,
  },
  {
    title: "Validated by Healthcare Experts",
    description:
      "Developed and reviewed in collaboration with top physicians to ensure clinical relevance and safety.",
    icon: validateHealthcareIcon,
  },
  // {
  //   title: "HIPAA & GDPR Compliant",
  //   description:
  //     "Fully adheres to global healthcare data privacy standards, ensuring the safety and confidentiality of patient.",
  //   icon: compliantIcon,
  // },
  {
    title: "Backed by Clinical Studies",
    description:
      "Supported by peer-reviewed research to improve diagnostic accuracy and reduce time to treatment.",
    icon: clinicalStudyIcon,
  },
];

const DDxKnowMore = ({ handleDDxKnowMore }) => {
  const [shouldShowVideo, setShowVideo] = useState(false);
  const [activeKey, setActiveKey] = useState("basicInfo");

  const sectionsRef = useRef({
    basicInfo: null,
    trust: null,
    digitisationProcess: null,
    tips: null,
  });

  const videoLink = {
    link: "https://www.youtube.com/embed/mAZ7Sa86PnQ",
    thumbnail: "https://i.ytimg.com/vi/mAZ7Sa86PnQ/hqdefault.jpg",
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
          activeKey === "basicInfo" || activeKey === "digitisationProcess"
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
    <div className="drawer-container">
      {/* Modal Header */}
      <div className="drawer-header">
        <div className="drawer-header-content border-bottom">
          <Button
            type="text"
            className="close-drawer-btn"
            onClick={handleDDxKnowMore}
          >
            <i className="icon-Cross" style={{ fontSize: "30px" }}></i>
          </Button>
          <div className="drawer-title">AI-Powered Differential Diagnosis</div>
        </div>

        {/* Tabs */}
        <div className="drawer-tabs">
          <Tabs activeKey={activeKey} onChange={scrollToSection}>
            <TabPane tab="Basic Info" key="basicInfo" />
            <TabPane tab="Trust Indicators" key="trust" />
            <TabPane tab="Diagnostic Process" key="digitisationProcess" />
            <TabPane tab="Tips" key="tips" />
          </Tabs>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="drawer-scrollable-content">
        <div className="section">
          <span
            id="basicInfo"
            ref={(el) => (sectionsRef.current.basicInfo = el)}
            className="section-side-header"
          >
            Basic Info
          </span>
          <div className="know-more-section-tilte">
            What is Differential Diagnosis
          </div>
          <div className="know-more-section-content basic-info-section ">
            <img src={apexAI} alt="apex-AI" width={72} height={72} />
            <div>
              Our AI tool helps you generate possible diagnoses by analyzing
              patient symptoms, examinations, history, and clinical findings,
              <b> including past patient data </b> for more accurate results.
              This feature speeds up diagnosis and assists in better
              decision-making for patient care.
            </div>
          </div>
        </div>

        <div className="section" style={{ minHeight: 210 }}>
          <span
            id="trust"
            ref={(el) => (sectionsRef.current.trust = el)}
            className="section-side-header"
          >
            Trust Indicators
          </span>
          <div className="know-more-section-tilte">
            Why Trust Our AI-Powered Differential Diagnosis?
          </div>
          <div className="know-more-section-content d-flex">
            <Row md={3} lg={3} className="gy-4 w-100">
              {trustDetails.map((item, index) => (
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
                    <div className="info-card-content">{item.description}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        <div className="video-section">
          <span
            id="digitisationProcess"
            ref={(el) => (sectionsRef.current.digitisationProcess = el)}
            className="section-side-header"
          >
            Diagnostic Process
          </span>
          <div className="know-more-section-tilte">
            How Differential Diagnosis Works
          </div>
          <div className="know-more-section-content">
            <div className="instruction-cvt-tutorial">
              Please watch this video to see how Differential Diagnosis enhances
              clinical decision-making.👇
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
            id="tips"
            ref={(el) => (sectionsRef.current.tips = el)}
            className="section-side-header"
          >
            Tips
          </span>
          <div className="know-more-section-tilte">
            Tips to get the best results
          </div>
          <div className="know-more-section-content cvt-tips-content">
            <span style={{ fontWeight: "600" }}>Enter detailed Analysis: </span>
            The more detailed and structured the patient information you provide
            (such as symptoms, examinations, history, and medications), the
            better the accuracy of the differential diagnosis results.
          </div>
          <div
            style={{ padding: "40px 0 80px 0", textAlign: "center" }}
            className="disclaimer-txt"
          >
            <b>Disclaimer</b>: These results are generated by AI and should be
            used as a guide, not the final source for patient treatment
            decisions.
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
  );
};

export default React.memo(DDxKnowMore);
