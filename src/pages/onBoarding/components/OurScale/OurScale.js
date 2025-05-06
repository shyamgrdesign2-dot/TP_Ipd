import React from 'react';
import './OurScale.scss';
import Sparkle from '../../../../assets/images/Scale.svg';
const OurScale = () => {
  const scaleData = [
    {
      number: "10 Lakh+",
      description: "Patients Served",
      icon: "🏥"
    },
    {
      number: "12 Lakh+",
      description: "Digital Rx created",
      icon: "📝"
    },
    {
      number: "10,000+",
      description: "Doctors onboarded",
      icon: "👨‍⚕️"
    },
    {
      number: "10 +",
      description: "Language support",
      icon: "🌐"
    },
    {
      number: "25+",
      description: "Specialities",
      icon: "🏆"
    },
    {
      number: "200+",
      description: "Cities Serviceable",
      icon: "🏙️"
    }
  ];

  return (
    <div className="our-scale-container">
      <h2 className="our-scale-title">
        Our Scale <img src={Sparkle} alt="sparkle" className="sparkle" />
      </h2>
      
      <div className="scale-stats-container">
        {scaleData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurScale; 