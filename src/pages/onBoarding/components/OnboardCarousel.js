import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "antd";
import "./Onboarding.scss";
import smartSync from "../../../assets/images/website-images/SmartSyncBanner.jpeg";
import practiceManagement from "../../../assets/images/website-images/PracticeManagementBanner.jpeg";
import ddxBanner from "../../../assets/images/website-images/DdxBanner.jpeg";
import emrBanner from "../../../assets/images/website-images/EMRBanner.jpeg";
import tatvaAiBanner from "../../../assets/images/website-images/TatvaAiBanner.jpeg";

const OnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const carouselRef = useRef(null);

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
      title: "India's Best EMR",
      subtitle: "Trusted by 10,000+ Doctor",
      image: tatvaAiBanner,
    },
  ];

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
    effect: "fade",
    beforeChange: (_, next) => {
      setCurrentSlide(next);
      setProgress(0);
    }
  };

  const handleExploreMore = () => {
    const trustedBySection = document.getElementById('trusted-by-section');
    if (trustedBySection) {
      trustedBySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="onboarding-carousel-wrapper">
      <div className="logo-container">
        <img
          src={require("../../../assets/images/logo.png")}
          className="d-inline-block align-top cursor-pointer"
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
                  width: `${index === currentSlide ? progress : index < currentSlide ? 100 : 0}%`,
                  backgroundColor: index <= currentSlide ? '#5857DC' : '#E4E4E7'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="explore-more">
        <button onClick={handleExploreMore}>Explore more</button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
