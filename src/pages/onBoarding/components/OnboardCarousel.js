import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "antd";
import "./Onboarding.scss";
import smartSync from "../../../assets/images/website-images/SmartSyncBanner.jpg";
import practiceManagement from "../../../assets/images/website-images/PracticeManagementBanner.jpg";
import ddxBanner from "../../../assets/images/website-images/DdxBanner.jpg";
import emrBanner from "../../../assets/images/website-images/EMRBanner.jpg";
import tatvaAiBanner from "../../../assets/images/website-images/TatvaAiBanner.png";
import fastBackward from "../../../assets/images/onboard-page-icons/fast-backward.gif";
import { getUtmParams } from "../../../components/userOnboarding/services/userDataService";
import { detectOperatingSystem } from "../../../utils/utils";

const OnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const carouselRef = useRef(null);
  
  // Get UTM params
  const utm = getUtmParams();

  const baseCarouselItems = [
    {
      id: 1,
      title: "Boost Your Practice with",
      subtitle: "Our AI-Powered Smart Sync",
      image: smartSync,
      utmKey: "smartsync",
    },
    {
      id: 2,
      title: "AI-Powered",
      subtitle: "Clinical Decision Support",
      image: ddxBanner,
      utmKey: "ddx",
    },
    {
      id: 3,
      title: "Build and Scale Your",
      subtitle: "Online Presence with Us",
      image: practiceManagement,
      utmKey: "practice",
    },
    {
      id: 4,
      title: "Supercharge Your",
      subtitle: "Research with TatvaAI",
      image: tatvaAiBanner,
      utmKey: "tatvaai",
    },
    {
      id: 5,
      title: "India's Best EMR",
      subtitle: "Trusted by 10,000+ Doctors",
      image: emrBanner,
      utmKey: "emr",
    },
  ];

  const sortCarouselItems = () => {
    const utm = getUtmParams();
    const utmTerm = utm.utm_term;
    // If no UTM term, return original order
    if (!utmTerm) return baseCarouselItems;

    return [
      // First, find the item that matches the UTM term
      ...baseCarouselItems.filter((item) => item.utmKey === utmTerm),
      // Then add all other items
      ...baseCarouselItems.filter((item) => item.utmKey !== utmTerm),
    ];
  };

  const carouselItems = sortCarouselItems();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 1;
        if (newProgress === 100) {
          // Move to next slide when progress reaches 100%
          if (carouselRef.current) {
            carouselRef.current.next();
          }
          return 0;
        }
        return newProgress;
      });
    }, 50); // 50ms * 100 steps = 5000ms total duration

    return () => {
      clearInterval(timer);
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    effect: "rtl",
    cssEase: "ease-in-out",
    beforeChange: (_, next) => {
      setCurrentSlide(next);
      setProgress(0);
    },
  };

  const handleExploreMore = () => {
    window.Moengage.track_event("TP_NewLoginFlow_Explore_more", {
      clicked: true,
      operating_system: detectOperatingSystem(),
      utm_campaign: utm.utm_campaign ?? 'NA',
      utm_source: utm.utm_source ?? 'NA',
      utm_medium: utm.utm_medium ?? 'NA',
      utm_content: utm.utm_content ?? 'NA',
      utm_term: utm.utm_term ?? 'NA',
      is_marketing: Object.values(utm).some(value => value && value.length > 0),
    });
    const trustedBySection = document.getElementById("trusted-by-section");
    if (trustedBySection) {
      trustedBySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="onboarding-carousel-wrapper">
      <div className="logo-container">
        <img
          src={require("../../../assets/images/logo.png")}
          className="d-inline-block align-top"
          width="150px"
          height="35px"
          alt="Logo"
        />
      </div>

      <div className="carousel-container">
        <Carousel ref={carouselRef} {...settings}>
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

        <div className="custom-dots">
          {carouselItems.map((_, index) => (
            <div
              key={index}
              className="dot-container"
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.goTo(index);
                }
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${
                    index === currentSlide
                      ? progress
                      : index < currentSlide
                      ? 100
                      : 0
                  }%`,
                  backgroundColor:
                    index <= currentSlide ? "#5857DC" : "#E4E4E7",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="explore-more">
        <button onClick={handleExploreMore}>
          Explore more
          <img src={fastBackward} alt="scroll down" className="scroll-arrow" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
