import React from "react";
import styles from "./BlurredOverlay.module.css";

/**
 * A component that creates a non-interactive blurred overlay
 * Used when the onboarding drawer is open to prevent interaction with the background
 */
const BlurredOverlay = ({ visible }) => {
  if (!visible) return null;

  // Prevent any click events from propagating
  const preventInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div
      className={styles.blurredOverlay}
      onClick={preventInteraction}
      onTouchStart={preventInteraction}
      onTouchMove={preventInteraction}
      onTouchEnd={preventInteraction}
      onMouseDown={preventInteraction}
      onMouseMove={preventInteraction}
      onMouseUp={preventInteraction}
    >
      <div className={styles.blurContent} />
    </div>
  );
};

export default BlurredOverlay;
