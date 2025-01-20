import React from 'react';
import genRxIcon from "../assets/images/gen-rx-btn.svg";
import styles from './GenRxButton.module.scss';
import genRxBg from "../assets/images/gen-rx-bg.gif";

const GenRxButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className} me-20`}
      // style={{ background: `url(${genRxBg})` }}
    >
      <div className={styles.iconContainer}>
        <img src={genRxIcon} alt="Gen Rx" loading='lazy' />
      </div>
      <span className={styles.text}>Gen Rx</span>
    </button>
  );
};

export default GenRxButton;