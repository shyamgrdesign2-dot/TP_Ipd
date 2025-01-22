import React from "react";
import genRxIcon from "../assets/images/gen-rx-btn.svg";
import styles from "./GenRxButton.module.scss";

const GenRxButton = ({ onClick, className = "" }) => {
  return (
    <button onClick={onClick} className={`${styles.button} ${className} me-20`}>
      <div className={styles.iconContainer}>
        <img src={genRxIcon} alt="Voice Rx" loading="lazy" />
      </div>
      <span className={styles.text}>Voice Rx</span>
    </button>
  );
};

export default GenRxButton;
