import React, { useState } from "react";
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
  {
    title: "HIPAA & GDPR Compliant",
    description:
      "Fully adheres to global healthcare data privacy standards, ensuring the safety and confidentiality of patient.",
    icon: compliantIcon,
  },
  {
    title: "Backed by Clinical Studies",
    description:
      "Supported by peer-reviewed research to improve diagnostic accuracy and reduce time to treatment.",
    icon: clinicalStudyIcon,
  },
];

const DDxKnowMore = ({ handleDDxKnowMore }) => {
  const [shouldShowVideo, setShowVideo] = useState(false);

  const videoLink = {
    link: "https://www.youtube.com/embed/o6ALwX9hPMM",
    thumbnail: "https://i.ytimg.com/vi/o6ALwX9hPMM/hqdefault.jpg",
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          <Tabs defaultActiveKey="1" onChange={(key) => scrollToSection(key)}>
            <TabPane tab="Basic Info" key="basicInfo" />
            <TabPane tab="Trust Indicators" key="trust" />
            <TabPane tab="Diagnostic Process" key="digitisationProcess" />
            <TabPane tab="Tips" key="tips" />
          </Tabs>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="drawer-scrollable-content">
        <div id="basicInfo" className="section">
          <span className="section-side-header">Basic Info</span>
          <div className="know-more-section-tilte">
            What is Differential Diagnosis
          </div>
          <div className="know-more-section-content basic-info-section ">
            <img src={apexAI} alt="apex-AI" width={72} height={72} />
            <div>
              Our AI tool helps you generate possible diagnoses by analyzing
              patient symptoms, history, and clinical findings,
              <b> including past patient data </b> for more accurate results.
              This feature speeds up diagnosis and assists in better
              decision-making for patient care.
            </div>
          </div>
        </div>

        <div id="trust" className="section" style={{ minHeight: 430 }}>
          <span className="section-side-header">Trust Indicators</span>
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

        <div id="digitisationProcess" className="video-section">
          <span className="section-side-header">Diagnostic Process</span>
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
              }}
              onClick={() => setShowVideo(true)}
            >
              <img width={55} height={55} src={playIcons} />
            </div>
          </div>
        </div>

        <div id="tips" className="section">
          <span className="section-side-header">Tips</span>
          <div className="know-more-section-tilte">
            Tips to get the best results
          </div>
          <div className="know-more-section-content cvt-tips-content">
            <span style={{ fontWeight: "600" }}>Enter detailed Analysis: </span>
            The more detailed and structured the patient information you provide
            (such as symptoms, history, and medications), the better the
            accuracy of the differential diagnosis results.
          </div>
          <div
            style={{ padding: "60px 0 30px 0", textAlign: "center" }}
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
