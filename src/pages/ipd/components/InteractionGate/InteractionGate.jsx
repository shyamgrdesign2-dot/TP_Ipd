// InteractionGate.jsx
import React from "react";
import "./styles.scss";

export default function InteractionGate({ disabled = false, className = "", children }) {
  const classes = ["ig", className, disabled ? "is-disabled" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      aria-disabled={disabled}
      {...(disabled ? { inert: "" } : {})} // removes from tab order in modern browsers
    >
      {children}
      {disabled && <div className="ig__overlay" aria-hidden="true" />}
    </div>
  );
}
