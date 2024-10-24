import React from "react";
import "../smartSync.css";
import { Card, Button, Tabs } from "antd";
import knowMoreImage from "../../../assets/images/website-images/know-more.jpg";
import dataInsightIcon from "../../../assets/images/data-insight.svg";
import monetiseIcon from "../../../assets/images/monetise-ven.svg";
import loyalityIcon from "../../../assets/images/loyality.svg";

const { TabPane } = Tabs;

const CvtKnowMore = ({ handleDrawerVital, handleCollapsed }) => {
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
        <div className="drawer-header-content">
          <Button
            type="text"
            className="close-drawer-btn"
            onClick={() => console.log("Close drawer")}
          >
            <i className="icon-Cross" style={{fontSize: "30px"}}></i>
          </Button>
          <div className="drawer-title">AI-Powered Smart Rx Digitisation</div>
        </div>

        {/* Tabs */}
        <div className="drawer-tabs">
          <Tabs defaultActiveKey="1" onChange={(key) => scrollToSection(key)}>
            <TabPane tab="Basic Info" key="basicInfo" />
            <TabPane tab="Benefits" key="benefits" />
            <TabPane tab="Digitisation Process" key="digitisationProcess" />
            <TabPane tab="Tips for Rx writing" key="tipsForRxWriting" />
          </Tabs>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="drawer-scrollable-content">
        <div id="basicInfo" className="section">
          <span className="section-side-header">Basic Info</span>
          <div className="know-more-section-tilte">
            What is Smart Rx Digitisation?
          </div>
          <div className="know-more-section-content basic-info-section ">
            <div className="know-more-img-box">
              <img src={knowMoreImage}></img>
            </div>
            <div>
              Our AI engine seamlessly converts your handwritten prescriptions
              into a structured digital format within 30 seconds, streamlining
              your workflow and unlocking new possibilities to enhance patient
              care and efficiency
            </div>
          </div>
        </div>

        <div id="benefits" className="section">
          <span className="section-side-header">Benefits</span>
          <div className="know-more-section-tilte">
            Benefits of Digitising your Rx
          </div>
          <div className="know-more-section-content d-flex gap-4" >
            <div className="benefits-info-card">
              <div className="info-card-header">
                <img
                  src={dataInsightIcon}
                  alt="dataInsightIcon"
                  className="info-card-icons"
                ></img>
                <div className="info-card-title">Get Data Insights</div>
              </div>
              <div className="info-card-content">
                In Future get access to anonymized data for research, tracking,
                and revenue sharing.
              </div>
            </div>
            <div className="benefits-info-card">
              <div className="info-card-header">
                <img
                  src={monetiseIcon}
                  alt="monetiseIcon"
                  className="info-card-icons"
                ></img>
                <div className="info-card-title">Monetise with DHIS</div>
              </div>
              <div className="info-card-content">
                In future earn additional revenue through government DHIS
                schemes by digitising Rx.
              </div>
            </div>
            <div className="benefits-info-card">
              <div className="info-card-header">
                <img
                  src={loyalityIcon}
                  alt="loyalityIcon"
                  className="info-card-icons"
                ></img>
                <div className="info-card-title">Boost Patient Loyalty</div>
              </div>
              <div className="info-card-content">
                Digital Rx enhance care beyond the clinic & boosting patient
                loyalty and satisfaction.
              </div>
            </div>
          </div>
        </div>

        <div id="digitisationProcess" className="section">
          <span className="section-side-header">Digitisation Process</span>
          <div className="know-more-section-tilte">
            How Smart Rx Digitisation Works?
          </div>
          <div className="know-more-section-content">
            <div>
              <img src={knowMoreImage}></img>
            </div>
            <p>
              Our AI engine seamlessly converts your handwritten prescriptions
              into a structured digital format within 30 seconds, streamlining
              your workflow and unlocking new possibilities to enhance patient
              care and efficiency
            </p>
          </div>
        </div>
        <div id="tipsForRxWriting" className="section">
          <span className="section-side-header">Tips for Rx writting</span>
          <div className="know-more-section-tilte">
            Tips to write an Rx for better Rx Digitisation
          </div>
          <div className="know-more-section-content">
            <i>image</i>
            <p>
              Our AI engine seamlessly converts your handwritten prescriptions
              into a structured digital format within 30 seconds, streamlining
              your workflow and unlocking new possibilities to enhance patient
              care and efficiency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CvtKnowMore);
