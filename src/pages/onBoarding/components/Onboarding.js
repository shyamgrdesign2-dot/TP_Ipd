import React, { useState, useEffect } from "react";
import Carousel from "./OnboardCarousel";
import SignUp from "./SignUp";
import SetPassword from "./SetPassword";
import VerifyOTP from "./VerifyOTP";
import VerifyPassword from "./VerifyPassword.js";
import FeatureTabCard from "./FeatureTabCard/FeatureTabCard.js";
import TrustBy from "./TrustBy/TrustedBy.js";
import Testimonials from "./Testimonials/Testimonials.js";
import FAQ from "./FAQ/FAQ.js";
import OurScale from "./OurScale/OurScale.js";
import Footer from "./Footer/Footer.js";
import Hook from "../../../assets/images/website-images/Hook.png";
import Hook2 from "../../../assets/images/website-images/Hook2.png";
import Logo from "../../../assets/images/website-images/logo.png";
import "./Onboarding.scss";
import "./FeatureTabCard/FeatureTabCard.scss";
import { getUtmParams } from "../../../components/userOnboarding/services/userDataService.js";
import { Spin } from "antd";

const Onboarding = () => {
  const [view, setView] = useState("signup");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(true);
  const [isUserExists, setIsUserExists] = useState(false);
  const [utmParams, setUtmParams] = useState(null);
  const [isFromCampaign, setIsFromCampaign] = useState(false);
  const [isPasswordSetFlow, setIsPasswordSetFlow] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [reqId, setReqId] = useState("");
  const [footerImage, setFooterImage] = useState(Hook);
  const [showFloatingSignup, setShowFloatingSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load data from localStorage
        const storedMobileNumber = localStorage.getItem("mobileNumber");
        const storedView = localStorage.getItem("currentView");
        const storedLoginFlow = localStorage.getItem("isLoginFlow");
        const storedUserExists = localStorage.getItem("isUserExists");

        if (storedMobileNumber) setMobileNumber(storedMobileNumber);
        if (storedView) setView(storedView);
        if (storedLoginFlow) setIsLoginFlow(storedLoginFlow === "true");
        if (storedUserExists) setIsUserExists(storedUserExists === "true");

        // Get UTM params
        const utm = getUtmParams();
        setUtmParams(utm);
        const campaign = utm.utm_campaign;
        setIsFromCampaign(!!campaign);
        if (!!campaign) {
          setIsFromCampaign(true);
          setIsLoginFlow(false);
        } else {
          setIsFromCampaign(false);
          setIsLoginFlow(true);
        }
      } finally {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setFooterImage(window.innerWidth <= 768 ? Hook2 : Hook);
    };

    // Set initial image
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const onboardingContainer = document.querySelector(
        ".onboarding-container"
      );
      if (onboardingContainer) {
        const containerBottom =
          onboardingContainer.getBoundingClientRect().bottom;
        setShowFloatingSignup(containerBottom < 0 && window.innerWidth > 768);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleViewChange = (
    newView,
    number = "",
    isUserExists = false,
    isPasswordSetFlow = false,
    password = "",
    reqId = ""
  ) => {
    // Store values in localStorage
    localStorage.setItem("currentView", newView);
    localStorage.setItem("isLoginFlow", String(newView === "loginOTP"));
    localStorage.setItem("isUserExists", String(isUserExists));

    setView(newView);
    if (newView === "loginOTP") {
      setIsLoginFlow(true);
    } else if (newView === "signup") {
      setIsLoginFlow(false);
    }
    if (number) {
      localStorage.setItem("mobileNumber", number);
      setMobileNumber(number);
    }
    if (isUserExists) {
      setIsUserExists(isUserExists);
    }
    if (password) {
      setTempPassword(password);
    }
    if (isPasswordSetFlow) {
      setIsPasswordSetFlow(isPasswordSetFlow);
    }
    if (reqId) {
      setReqId(reqId);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {showFloatingSignup && (
        <div className="floating-signup-container">
          <div className="floating-signup-content">
            <div className="logo-section">
              <img src={Logo} alt="Tatva Practice" />
            </div>
            <div className="signup-section">
              <button
                className="sign-up-btn"
                onClick={() => {
                  const onboardingContainer = document.querySelector(
                    ".onboarding-container"
                  );
                  if (onboardingContainer) {
                    onboardingContainer.scrollIntoView({ behavior: "smooth" });
                    setView("signup");
                    setIsLoginFlow(false);
                    setTimeout(() => {
                      const mobileInput = document.querySelector(
                        'input[placeholder="Enter your mobile number"]'
                      );
                      if (mobileInput) {
                        mobileInput.focus();
                      }
                    }, 500);
                  }
                }}
              >
                Sign Up for free
              </button>
              {/* <button className="chat-btn">
                  Chat with us
                </button> */}
            </div>
          </div>
        </div>
      )}
      <div className="onboarding-container">
        <div className="onboarding-left">
          <Carousel />
        </div>
        <div className="onboarding-right">
          {(view === "signup" || view === "loginOTP") && (
            <SignUp
              onViewChange={handleViewChange}
              isLoginFlow={isLoginFlow}
              mobileNumber={mobileNumber}
            />
          )}
          {view === "verifyOTP" && (
            <VerifyOTP
              onViewChange={handleViewChange}
              mobileNumber={mobileNumber}
              isLoginFlow={isLoginFlow}
              isUserExists={isUserExists}
              isPasswordSetFlow={isPasswordSetFlow}
              tempPassword={tempPassword}
              reqId={reqId}
            />
          )}
          {view === "verifyPassword" && (
            <VerifyPassword
              onViewChange={handleViewChange}
              mobileNumber={mobileNumber}
              // isLoginFlow={isLoginFlow}
              // isUserExists={isUserExists}
            />
          )}
          {view === "setPassword" && (
            <SetPassword
              onViewChange={handleViewChange}
              mobileNumber={mobileNumber}
            />
          )}
          {view === "loginPassword" && (
            <VerifyPassword
              onViewChange={handleViewChange}
              mobileNumber={mobileNumber}
            />
          )}
        </div>
      </div>
      <div className="feature-tab-card-container">
        <TrustBy className="m-2" />
        <div className="feature-tab-card-container-inner">
          <OurScale className="m-2" />
          <FeatureTabCard
            className="m-2"
            feature="EMR Features"
            title="An EMR that streamlines"
            subTitle="all your needs"
            tabs={["Clinical Care", "Admin Tasks", "Analytics"]}
          />
          <FeatureTabCard
            className="m-2"
            feature="Ai Features"
            title="Empower your"
            subTitle="practice with AI features"
            tabs={["DDx", "Smart Sync", "Voice Rx", "TatvaAI"]}
          />{" "}
          <FeatureTabCard
            className="m-2"
            feature="Digital Features"
            title="Grow your"
            subTitle="practice with us"
            tabs={["Digital Presence", "Remote Care", "ABDM"]}
          />
          <Testimonials className="m-2" />
        </div>
        <FAQ className="m-2" />
        <div className="onboarding-footer">
          <div className="onboarding-footer-container">
            <img src={footerImage} alt="footer banner" />
            {/* Elevation Card */}
            <div className="elevation-card">
              <h2 className="gradient-card-text">
                Ready To Elevate Your Practice?
              </h2>
              <p>
                Sign up for free now or chat with us to get more personalized
                insights and updates.
              </p>
              <div className="button-group">
                <button
                  className="sign-up-btn"
                  onClick={() => {
                    const onboardingContainer = document.querySelector(
                      ".onboarding-container"
                    );
                    if (onboardingContainer) {
                      onboardingContainer.scrollIntoView({
                        behavior: "smooth",
                      });
                      setView("signup");
                      setIsLoginFlow(false);
                      setTimeout(() => {
                        const mobileInput = document.querySelector(
                          'input[placeholder="Enter your mobile number"]'
                        );
                        if (mobileInput) {
                          mobileInput.focus();
                        }
                      }, 500);
                    }
                  }}
                >
                  Sign Up
                </button>
                {/* <button className="chat-btn">Chat with us</button> */}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Onboarding;