import React, { useState, useEffect } from "react";

import "./FeatureTabCard.scss";
import { FaDesktop, FaGoogle, FaCalendar, FaUserMd, FaChartLine, FaClipboardList } from "react-icons/fa";
import Emr from "../../../../assets/images/Emr.svg";
import Practice from "../../../../assets/images/Practice.svg";
import Ai from "../../../../assets/images/AIsymbol.svg";
import Abdm from "../../../../assets/images/website-images/LP_ABDM.png";
import AdminTasks from "../../../../assets/images/website-images/LP_AdminTasks.png";
import Analytics from "../../../../assets/images/website-images/LP_Analytics.png";
import ClinicCare from "../../../../assets/images/website-images/LP_ClinicCare.png";
import TatvaAssist from "../../../../assets/images/website-images/LP_Ddx.png";
import DigitalCare from "../../../../assets/images/website-images/LP_DigitalCare.png";
import RemoteCare from "../../../../assets/images/website-images/LP_RemoteCare.png";
import SmartSync from "../../../../assets/images/website-images/LP_SmartSync.png";
import TatvaAi from "../../../../assets/images/website-images/LP_TatvaAi.png";
import VoiceRx from "../../../../assets/images/website-images/LP_VoiceRx.png";

const featureCardConfig = {
  "EMR Features": {
    colors: {
      primary: "#4CAF50",
      secondary: "#E8F5E9"
    },
    tabConfig: {
      "Clinic Care": {
        heading: "Improve Clinic Care",
        points: [
          {
            icon: <FaUserMd />,
            text: "Speciality Specific Modules"
          },
          {
            icon: <FaClipboardList />,
            text: "Digital prescriptions and notes"
          },
          {
            icon: <FaChartLine />,
            text: "Patient Engagement"
          }
        ],
        image: ClinicCare
      },
      "Admin Tasks": {
        heading: "Simplify\nClinic Management",
        points: [
          {
            icon: <FaCalendar />,
            text: "Manage walk-ins and appointments"
          },
          {
            icon: <FaDesktop />,
            text: "Streamline billing and payments"
          },
          {
            icon: <FaClipboardList />,
            text: "Send Bulk Campaign Messages"
          }
        ],
        image: AdminTasks
      },
      "Analytics": {
        heading: "Practice\nAnalytics Simplified",
        points: [
          {
            icon: <FaChartLine />,
            text: "Monitor patient trends"
          },
          {
            icon: <FaDesktop />,
            text: "Evaluate treatment outcomes"
          },
          {
            icon: <FaClipboardList />,
            text: "Access real-time revenue data"
          }
        ],
        image: Analytics
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
        heading: "AI Powered \n Differential Diagnosis",
        points: [
          {
            icon: <FaUserMd />,
            text: "Get DDx within Second"
          },
          {
            icon: <FaClipboardList />,
            text: "Identify Potential Condition"
          },
          {
            icon: <FaChartLine />,
            text: "Discover effective treatment options"
          }
        ],
        image: TatvaAssist
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
        image: SmartSync
      },
      "Voice Rx": {
        heading: "Simplify\nPrescription Writing",
        points: [
          {
            icon: <FaUserMd />,
            text: "Write naturally with digital ink technology"
          },
          {
            icon: <FaClipboardList />,
            text: "Instantly capture and digitise prescriptions"
          },
          {
            icon: <FaCalendar />,
            text: "Sync effortlessly across all your devices"
          }
        ],
        image: VoiceRx
      },
      "Tatva Assist": {
        heading: "AI-Powered\nPlatform for Doctors",
        points: [
          {
            icon: <FaUserMd />,
            text: "Personalized AI platform for smart care"
          },
          {
            icon: <FaDesktop />,
            text: "Access reliable insights from PubMed"
          },
          {
            icon: <FaClipboardList />,
            text: "Make informed decisions with ease"
          }
        ],
        image: TatvaAi
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
        heading: "Supercharge\nYour Online Reach",
        points: [
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
        ],
        image: DigitalCare
      },
      "Remote Care": {
        heading: "Empower\nPatient Care Anywhere",
        points: [
          {
            icon: <FaUserMd />,
            text: "Earn by referring care programs"
          },
          {
            icon: <FaClipboardList />,
            text: "Easily access and review patient logs"
          },
          {
            icon: <FaCalendar />,
            text: "Stay connected with patients through chats"
          }
        ],
        image: RemoteCare
      },
      "ABDM": {
        heading: "Maximize\nEarnings with ABDM",
        points: [
          {
            icon: <FaUserMd />,
            text: "Earn DHIS incentives via ABDM"
          },
          {
            icon: <FaClipboardList />,
            text: "Boost income with government support"
          },
          {
            icon: <FaDesktop />,
            text: "Enhance practice visibility and credibility"
          }
        ],
        image: Abdm
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
