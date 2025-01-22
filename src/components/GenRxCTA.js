// GenRxCTA.jsx
import React from "react";
import { Button } from "antd";
import styles from "./GenRxCTA.module.css";
import genRxIcon from "../assets/images/gen-rx-btn.svg";

const GenRxCTA = ({ onClick }) => {
  return (
    <Button className={styles.genRxButton} onClick={onClick}>
      <img src={genRxIcon} alt="Voice Rx" loading="lazy" />
      <span className={styles.buttonText}>Voice Rx</span>
    </Button>
  );
};

export default GenRxCTA;
