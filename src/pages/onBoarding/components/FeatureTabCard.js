import React from "react";
import "./FeatureTabCard.scss";
import { FaDesktop, FaGoogle, FaCalendar } from "react-icons/fa"; // Import icons

const FeatureTabCard = () => {
  const tabs = ["Digital Presence", "Remote Care", "ABDM"];
  const [activeTab, setActiveTab] = React.useState("Digital Presence");

  const points = [
    {
      icon: <FaDesktop />,
      text: "Get a personalized practice website"
    },
    {
      icon: <FaGoogle />,
      text: "Optimize your Google Business Profile"
    },
    {
      icon: <FaCalendar />,
      text: "Accept online appointments effortlessly"
    }
  ];

  return (
    <div className="feature-card-container">
      <h1 className="main-heading">
        Grow your<br />
        practice with us <span className="emoji">⚕️</span>
      </h1>

      <div className="feature-tab-card">
        <div className="feature-tab-card__tabs">
          <div className="curved-shadow left"></div>
          <div className="curved-shadow right"></div>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`feature-tab-card__tab ${tab === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="feature-tab-card__content">
          <div className="feature-tab-card__text">
            <h2 className="feature-tab-card__heading">
              Supercharge<br />
              Your Online Reach
            </h2>

            <ul className="feature-tab-card__points">
              {points.map((point, idx) => (
                <li key={idx}>
                  <span className="icon">{point.icon}</span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="feature-tab-card__image">
            <img src="/path-to-your-demo-image.png" alt="Practice Demo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTabCard;
