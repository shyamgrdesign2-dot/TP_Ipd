import React from "react";
import "../consultantNotes/ProgressSummary.scss";
import { defaultIcons } from "../../../assets/images/icons";

const GlobalVoiceAI = ({ onVoiceClick, onSnapRxClick, onClick }) => {
  const voiceHandler = onVoiceClick || onClick;
  const hasSnapRxShortcut = typeof onSnapRxClick === "function";

  const renderIconButton = (handler, label, mode) => {
    const isUpload = mode === "upload";
    return (
      <button
        type="button"
        className="global-voice-ai-icon-button"
        onClick={(event) => {
          event.stopPropagation();
          handler?.();
        } }
        aria-label={label}
      >
        <div className={"progress-summary-icon"}>
          <img src={isUpload ? defaultIcons.uploadIcon : defaultIcons.voiceAiIcon} alt={label} />
        </div>
      </button>
    );
  };

  return (
    <div
      className={`progress-summary-container global-ai ${
        hasSnapRxShortcut ? "dual" : ""
      }`}
      onClick={!hasSnapRxShortcut ? voiceHandler : undefined}
    >
      <div
        className={`global-voice-ai-background ${
          hasSnapRxShortcut ? "dual" : ""
        }`}
      />
      {hasSnapRxShortcut ? (
        <div className="global-voice-ai-buttons">
          {renderIconButton(voiceHandler, "Speak to autofill")}
          <span className="global-voice-ai-divider" />
          {renderIconButton(onSnapRxClick, "Upload document", "upload")}
        </div>
      ) : (
        <div className="progress-summary-voice-button">
          <div className="progress-summary-icon">
            <img src={defaultIcons.voiceAiIcon} alt="speak" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalVoiceAI;
