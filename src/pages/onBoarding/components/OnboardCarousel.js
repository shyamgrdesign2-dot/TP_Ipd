import React from "react";
import { Carousel } from "antd";
import "./Onboarding.scss";
import smartSync from "../../../assets/images/website-images/SmartSyncBanner.jpeg";
import practiceManagement from "../../../assets/images/website-images/PracticeManagementBanner.jpeg";
import ddxBanner from "../../../assets/images/website-images/DdxBanner.jpeg";
import emrBanner from "../../../assets/images/website-images/EMRBanner.jpeg";
import tatvaAiBanner from "../../../assets/images/website-images/TatvaAiBanner.jpeg";

const OnboardingCarousel = () => {
  const carouselItems = [
    {
      title: "Boost Your Practice with",
      subtitle: "Our AI-Powered Smart Sync",
      image: smartSync,
    },
    {
      title: "AI-Powered",
      subtitle: "Clinical Decision Support",
      image: practiceManagement,
    },
    {
      title: "Build and Scale Your",
      subtitle: "Online Presence with Us",
      image: ddxBanner,
    },
    {
      title: "Supercharge Your",
      subtitle: "Research with Tatva AI",
      image: emrBanner,
    },
    {
      title: "India’s Best EMR",
      subtitle: "Trusted by 10,000+ Doctor",
      image: tatvaAiBanner,
    },
  ];

  return (
    <div className="onboarding-carousel-wrapper">
      <div className="logo-container">
        <img
          src={require("../../../assets/images/logo.png")}
          className={`d-inline-block align-top cursor-pointer`}
          width="150px"
          height="35px"
          alt="Logo"
        />
      </div>

      <div className="carousel-container">
        <Carousel autoplay effect="fade">
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-item">
              <div className="text-content">
                <h1>{item.title}</h1>
                <h1>{item.subtitle}</h1>
              </div>
              <div className="banner-container">
                <img src={item.image} alt={item.title} />
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="explore-more">
        <button>{/* Explore more <ExploreIcon /> */}</button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
