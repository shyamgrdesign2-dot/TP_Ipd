import React from "react";
import genRxIcon from "../assets/images/receptionistIcon.svg";
import styles from "./GenRxButton.module.scss";
import { isMobile } from "react-device-detect";

const AiReceptionistButton = ({ onClick, className = "", customText, agetnsData}) => {
  const defaultText = agetnsData ? "Your AI Receptionist" : "Setup Your AI Receptionist";
  const buttonText = customText || defaultText;
  
  return (
    <button onClick={onClick} className={`${styles.AiReceptionistButton} ${className} ${isMobile ? styles.AiReceptionistButtonMobile : ""}`}>
      { !isMobile && 
        <div className={styles.iconContainer}>
          <img src={genRxIcon} alt="Ai Receptionist" loading="lazy" className={styles.AiReceptionistButtonicon} />
        </div>
      }
      <span className={styles.receptionistText}>{buttonText}</span>
      <div className='iconrotate180 align-self-start mt-1'>
        <i className='icon-right' style={{ color: "#943CD7" }}></i>
      </div>
    </button>
  );
};

export default AiReceptionistButton;
