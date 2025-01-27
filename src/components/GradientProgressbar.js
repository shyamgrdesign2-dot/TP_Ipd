import React, { useEffect, useState } from "react";
import "./GradientProgressBar.css";

const GradientProgressBar = ({ height, duration, onProgressComplete }) => {
  const [progress, setProgress] = useState(0);
  const gradientColors = [
    "#ff0000", // Red
    "#ff7f00", // Orange
    "#ffff00", // Yellow
    "#00ff00", // Green
    "#0000ff", // Blue
    "#4b0082", // Indigo
    "#9400d3", // Violet
  ];

  useEffect(() => {
    const intervalDuration = duration / 100; // Calculate interval based on duration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        if (onProgressComplete) onProgressComplete(); // Call callback when progress reaches 1001
        return 100;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [duration, onProgressComplete]);

  return (
    <div
      className="progress-bar-container"
      style={{ height, width: "341px", background: "#7373734D" }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          height: "100%",
        }}
      />
    </div>
  );
};

export default GradientProgressBar;
