import React, { useState, useEffect } from "react";

import "./FeatureTabCard.scss";
import { FaDesktop, FaGoogle, FaCalendar, FaUserMd, FaChartLine, FaClipboardList } from "react-icons/fa";
import Emr from "../../../../assets/images/Emr.svg";
import Practice from "../../../../assets/images/Practice.svg";
import Ai from "../../../../assets/images/AIsymbol.svg";

const featureCardConfig = {
  "EMR Features": {
    colors: {
      primary: "#4CAF50",
      secondary: "#E8F5E9"
    },
    tabConfig: {
      "Clinic Care": {
        heading: "Streamline\nYour Clinical Workflow",
        points: [
          {
            icon: <FaUserMd />,
            text: "Quick and easy patient consultations"
          },
          {
            icon: <FaClipboardList />,
            text: "Digital prescriptions and notes"
          },
          {
            icon: <FaChartLine />,
            text: "Track patient progress efficiently"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Admin Tasks": {
        heading: "Simplify\nPractice Management",
        points: [
          {
            icon: <FaCalendar />,
            text: "Automated appointment scheduling"
          },
          {
            icon: <FaDesktop />,
            text: "Easy billing and invoicing"
          },
          {
            icon: <FaClipboardList />,
            text: "Digital record keeping"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Analytics": {
        heading: "Data-Driven\nInsights",
        points: [
          {
            icon: <FaChartLine />,
            text: "Practice performance metrics"
          },
          {
            icon: <FaDesktop />,
            text: "Patient analytics"
          },
          {
            icon: <FaClipboardList />,
            text: "Financial reporting"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      }
    },
    icon:Emr
  },
  "Ai Features": {
    colors: {
      primary: "#2196F3",
      secondary: "#E3F2FD"
    },
    tabConfig: {
      "DDx": {
        heading: "AI-Powered\nDiagnostic Support",
        points: [
          {
            icon: <FaUserMd />,
            text: "Differential diagnosis suggestions"
          },
          {
            icon: <FaClipboardList />,
            text: "Evidence-based recommendations"
          },
          {
            icon: <FaChartLine />,
            text: "Clinical decision support"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Smart Sync": {
        heading: "Intelligent\nData Integration",
        points: [
          {
            icon: <FaDesktop />,
            text: "Automated data synchronization"
          },
          {
            icon: <FaClipboardList />,
            text: "Smart record management"
          },
          {
            icon: <FaChartLine />,
            text: "Real-time updates"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Voice Rx": {
        heading: "Voice-Enabled\nPrescriptions",
        points: [
          {
            icon: <FaUserMd />,
            text: "Voice-to-text prescriptions"
          },
          {
            icon: <FaClipboardList />,
            text: "Quick documentation"
          },
          {
            icon: <FaCalendar />,
            text: "Efficient workflow"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Tatva Assist": {
        heading: "AI Assistant\nSupport",
        points: [
          {
            icon: <FaUserMd />,
            text: "24/7 AI assistance"
          },
          {
            icon: <FaDesktop />,
            text: "Smart recommendations"
          },
          {
            icon: <FaClipboardList />,
            text: "Automated support"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      }
    },
    icon:Ai
  },
  "Digital Features": {
    colors: {
      primary: "#FF5722",
      secondary: "#FBE9E7"
    },
    tabConfig: {
      "Digital Presence": {
        heading: "Enhance Your\nOnline Presence",
        points: [
          {
            icon: <FaDesktop />,
            text: "Professional website"
          },
          {
            icon: <FaGoogle />,
            text: "Google Business Profile"
          },
          {
            icon: <FaCalendar />,
            text: "Online appointment booking"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "Remote Care": {
        heading: "Virtual\nHealthcare Solutions",
        points: [
          {
            icon: <FaUserMd />,
            text: "Telemedicine consultations"
          },
          {
            icon: <FaClipboardList />,
            text: "Digital prescriptions"
          },
          {
            icon: <FaCalendar />,
            text: "Remote patient monitoring"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      },
      "ABDM": {
        heading: "Ayushman Bharat\nDigital Mission",
        points: [
          {
            icon: <FaUserMd />,
            text: "ABDM compliance"
          },
          {
            icon: <FaClipboardList />,
            text: "Health ID integration"
          },
          {
            icon: <FaDesktop />,
            text: "Digital health records"
          }
        ],
        image: "/images/demo-doctor-profile.png"
      }
    },
    icon:Practice
  }
};

const FeatureTabCard = ({ feature, title, subTitle, tabs }) => {
  // States
  const [activeTab, setActiveTab] = useState('');
  const [cardConfig, setCardConfig] = useState({
    colors: {
      primary: "#4CAF50",
      secondary: "#E8F5E9"
    },
    tabConfig: {}
  });
  const [activeTabContent, setActiveTabContent] = useState({
    heading: "",
    points: [],
    image: ""
  });

  // Effect to set initial active tab
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);

  // Effect to update card configuration when feature changes
  useEffect(() => {
    if (feature) {
      const config = featureCardConfig[feature] || {
        colors: {
          primary: "#4CAF50",
          secondary: "#E8F5E9"
        },
        tabConfig: {}
      };
      setCardConfig(config);
    }
  }, [feature]);

  // Effect to update active tab content when tab or config changes
  useEffect(() => {
    if (cardConfig?.tabConfig && activeTab) {
      const content = cardConfig.tabConfig[activeTab] || {
        heading: "",
        points: [],
        image: ""
      };
      setActiveTabContent(content);
    }
  }, [activeTab, cardConfig]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to generate gradient style
  const getTabStyle = (isActive, isBackground = false) => {
    if (isActive && !isBackground) {
      // Define gradients based on feature type
      const gradients = {
        "EMR Features": "linear-gradient(92deg, #27276F -7.09%, #5C5BD6 46.98%, #27276F 107.96%)",
        "Ai Features": "linear-gradient(92deg, #4558D0 -7.09%, #C95BC3 46.98%, #E0657B 107.96%)",
        "Digital Features": "linear-gradient(92deg, #27276F -7.09%, #5C5BD6 46.98%, #27276F 107.96%)"
      };

      return {
        background: gradients[feature] || gradients["EMR Features"],
        color: 'white'
      };
    }
    if (isActive && isBackground) {
      const backgroundGradients = {
        "EMR Features": "linear-gradient(119deg, #46286C -8.1%, #481C7F 14.33%, #181346 45.83%, #1A1A2F 94.62%), #FFF",
        "Ai Features": "linear-gradient(112deg, #F8E1FB 1.39%, #D7A5EB 30.56%, #7946CB 89.33%), #FFF",
        "Digital Features": "linear-gradient(114deg, #FEEDC0 -2.49%, #FDEAB8 16.82%, #FAD882 39.96%, #D59700 71.6%)"
      };
      return {
        background: backgroundGradients[feature] || backgroundGradients["EMR Features"],
        color: 'white'
      };
    }
    return {
      background: 'transparent',
      color: "#000"
    };
  };

  return (
    <div 
      className="feature-card-container"
    >
      <h1 className="main-heading">
        {title || 'Feature Card'}
        <br />
        {subTitle} 
        {featureCardConfig[feature]?.icon && (
          <img 
            src={featureCardConfig[feature].icon} 
            alt="feature-icon" 
            className="emoji"
            style={{ width: '3rem', height: '3rem' }}
          />
        )}
      </h1>

      <div 
        className="feature-tab-card"
        style={getTabStyle(true, true)} // Pass both parameters here
      >
        <div className="feature-tab-card__tabs">
          <div className="curved-shadow left"></div>
          <div className="curved-shadow right"></div>
          {(tabs || []).map((tab) => (
            <button
              key={tab}
              className={`feature-tab-card__tab ${tab === activeTab ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
              style={getTabStyle(tab === activeTab, false)} // Pass both parameters here
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="feature-tab-card__content">
          <div className="feature-tab-card__text">
            <h2 className="feature-tab-card__heading">
              {activeTabContent?.heading || ''}
            </h2>

            <ul className="feature-tab-card__points">
              {(activeTabContent?.points || []).map((point, idx) => (
                <li key={idx}>
                  <span className="icon">{point.icon}</span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeTabContent?.image && (
            <div className="feature-tab-card__image">
              <img 
                src={activeTabContent.image} 
                alt={`${activeTab} Demo`} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureTabCard;
