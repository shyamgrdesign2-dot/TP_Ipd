import React from 'react';
import './OurScale.scss';
import Sparkle from '../../../../assets/images/Scale.svg';
import Profile from '../../../../assets/images/LP-profile-2user.svg';
import Clipboard from '../../../../assets/images/LP-clipboard-text.svg';
import Doc from '../../../../assets/images/LP-Doc.svg';
import Support from '../../../../assets/images/LP-Support.svg';
import Vitals from '../../../../assets/images/LP-Vitals.svg';
import Location from '../../../../assets/images/LP-Location.svg';

const OurScale = () => {
  const scaleData = [
    {
      number: "10 Lakh+",
      description: "Patients Served",
      icon: Profile
    },
    {
      number: "12 Lakh+",
      description: "Digital Rx created",
      icon: Clipboard
    },
    {
      number: "10,000+",
      description: "Doctors onboarded",
      icon: Doc
    },
    {
      number: "10 +",
      description: "Language support",
      icon: Support
    },
    {
      number: "25+",
      description: "Specialities",
      icon: Vitals
    },
    {
      number: "200+",
      description: "Cities Serviceable",
      icon: Location
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
            <div className="stat-icon">
              <img src={stat.icon} alt={stat.description} />
            </div>
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