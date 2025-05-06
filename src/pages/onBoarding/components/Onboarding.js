import React, { useState } from "react";
import Carousel from "./OnboardCarousel";
import SignUp from "./SignUp";
import "./Onboarding.scss";
import SetPassword from "./SetPassword";
import VerifyOTP from "./VerifyOTP";
import FeatureTabCard from "./FeatureTabCard/FeatureTabCard.js";
import "./FeatureTabCard/FeatureTabCard.scss";
import TrustBy from "./TrustBy/TrustedBy.js";
import Testimonials from "./Testimonials/Testimonials.js";
import FAQ from "./FAQ/FAQ.js";
import OurScale from "./OurScale/OurScale.js";
import VerifyPassword from "./VerifyPassword.js";

const Onboarding = () => {
  const [view, setView] = useState("signup");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(false);

  const handleViewChange = (newView, number = "") => {
    setView(newView);
    if (newView === "loginOTP") {
      setIsLoginFlow(true);
    } else if (newView === "signup") {
      setIsLoginFlow(false);
    }
    if (number) {
      setMobileNumber(number);
    }
  };

  return (
    <>
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
          heading={"Supercharge\nYour Online Reach"}
          points={[
            { icon: "🖥️", text: "Get a personalized practice website" },
            { icon: "📦", text: "Optimize your Google Business Profile" },
            { icon: "📅", text: "Accept online appointments effortlessly" },
          ]}
          imageContent={
            <img
              src="/images/demo-doctor-profile.png"
              alt="Doctor Website Demo"
            />
          }
        />
        <FeatureTabCard
          feature="Ai Features"
          title="Empower your"
          subTitle="practice with Tatva AI"
          tabs={["DDx", "Smart Sync", "Voice Rx", "Tatva Assist"]}
          heading={"Supercharge\nYour Online Reach"}
          points={[
            { icon: "🖥️", text: "Get a personalized practice website" },
            { icon: "📦", text: "Optimize your Google Business Profile" },
            { icon: "📅", text: "Accept online appointments effortlessly" },
          ]}
          imageContent={
            <img
              src="/images/demo-doctor-profile.png"
              alt="Doctor Website Demo"
            />
          }
        />{" "}
        <FeatureTabCard
          feature="Digital Features"
          title="Grow your"
          subTitle="practice with us"
          tabs={["Digital Presence", "Remote Care", "ABDM"]}
          heading={"Supercharge\nYour Online Reach"}
          points={[
            { icon: "🖥️", text: "Get a personalized practice website" },
            { icon: "📦", text: "Optimize your Google Business Profile" },
            { icon: "📅", text: "Accept online appointments effortlessly" },
          ]}
          imageContent={
            <img
              src="/images/demo-doctor-profile.png"
              alt="Doctor Website Demo"
            />
          }
        />
        <Testimonials />
        <FAQ />
      </div>
    </>
  );
};

export default Onboarding;
