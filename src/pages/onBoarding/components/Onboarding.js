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
import "./Onboarding.scss";
import "./FeatureTabCard/FeatureTabCard.scss";
import { OnboardingProvider } from "../../../components/userOnboarding/OnboardingContext";
import OnboardingDrawer from "../../../components/userOnboarding/OnboardingDrawer";

const Onboarding = () => {
  const [view, setView] = useState("signup");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(true);
  const [isUserExists, setIsUserExists] = useState(false);
  const [isFromCampaign, setIsFromCampaign] = useState(false);
  const [isPasswordSetFlow, setIsPasswordSetFlow] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [reqId, setReqId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const campaign = searchParams.get("utm_campaign");
    setIsFromCampaign(!!campaign);
    if (!!campaign) {
      setIsFromCampaign(true);
      setIsLoginFlow(false);
    } else {
      setIsFromCampaign(false);
      setIsLoginFlow(true);
    }
  }, []);

  const handleViewChange = (newView, number = "", isUserExists = false, isPasswordSetFlow = false, password = "", reqId = "") => {

    setView(newView);
    if (newView === "loginOTP") {
      setIsLoginFlow(true);
    } else if (newView === "signup") {
      setIsLoginFlow(false);
    }
    if (number) {
      localStorage.setItem('mobileNumber', number);
      setMobileNumber(number);
    }
    if (isUserExists) {
      setIsUserExists(isUserExists);
    }
    if (password) {
      setTempPassword(password);
    }
    if (reqId) {
      setReqId(reqId);
    }
  };

  return (
    <OnboardingProvider>
      <>
        <OnboardingDrawer />
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
          <TrustBy />
          <OurScale />
          <FeatureTabCard
            feature="EMR Features"
            title="An EMR the meets all"
            subTitle="your needs to streamline"
            tabs={["Clinic Care", "Admin Tasks", "Analytics"]}
          />
          <FeatureTabCard
            feature="Ai Features"
            title="Empower your"
            subTitle="practice with Tatva AI"
            tabs={["DDx", "Smart Sync", "Voice Rx", "Tatva Assist"]}
          />{" "}
          <FeatureTabCard
            feature="Digital Features"
            title="Grow your"
            subTitle="practice with us"
            tabs={["Digital Presence", "Remote Care", "ABDM"]}
          />
          <Testimonials />
          <FAQ />
          <div className="onboarding-footer">
            <img src={Hook} alt="footer banner" />
            <Footer />
          </div>
        </div>

        <div className="feature-tab-card-container">
          <TrustBy />
          <OurScale />
          <FeatureTabCard
            feature="EMR Features"
            title="An EMR the meets all"
            subTitle="your needs to streamline"
            tabs={["Clinic Care", "Admin Tasks", "Analytics"]}
          />
          <FeatureTabCard
            feature="Ai Features"
            title="Empower your"
            subTitle="practice with Tatva AI"
            tabs={["DDx", "Smart Sync", "Voice Rx", "Tatva Assist"]}
          />{" "}
          <FeatureTabCard
            feature="Digital Features"
            title="Grow your"
            subTitle="practice with us"
            tabs={["Digital Presence", "Remote Care", "ABDM"]}
          />
          <Testimonials />
          <FAQ />
          <div className="onboarding-footer">
            <div className="onboarding-footer-container">
              <img src={Hook} alt="footer banner" style={{ width: "100%" }} />
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
                  <button className="sign-up-btn">Sign Up</button>
                  <button className="chat-btn">Chat with us</button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    </OnboardingProvider>
  );
};

export default Onboarding;
