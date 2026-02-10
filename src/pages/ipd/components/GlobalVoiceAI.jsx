import React from "react";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import "../consultantNotes/ProgressSummary.scss";
import { defaultIcons } from "../../../assets/images/icons";
import {
  GB_IPD_ENABLE_SNAP_RX,
  GB_IPD_ENABLE_VOICE_RX,
} from "../../../utils/constants";

const GlobalVoiceAI = ({ onVoiceClick, onSnapRxClick, onClick }) => {
  const voiceHandler = onVoiceClick || onClick;
  const isSnapRxEnabled = useFeatureIsOn(GB_IPD_ENABLE_SNAP_RX);
  const isVoiceRxEnabled = useFeatureIsOn(GB_IPD_ENABLE_VOICE_RX);
  const hasVoiceFlow = isVoiceRxEnabled && typeof voiceHandler === "function";
  const hasSnapRxFlow =
    isSnapRxEnabled && typeof onSnapRxClick === "function";
  const hasDualAIFlows = hasVoiceFlow && hasSnapRxFlow;

  if (!hasVoiceFlow && !hasSnapRxFlow) {
    return null;
  }

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
        hasDualAIFlows ? "dual" : ""
      }`}
      onClick={
        hasVoiceFlow && !hasDualAIFlows
          ? voiceHandler
          : hasSnapRxFlow && !hasDualAIFlows
            ? onSnapRxClick
            : undefined
      }
    >
      <div
        className={`global-voice-ai-background ${
          hasDualAIFlows ? "dual" : ""
        }`}
      />
      {hasDualAIFlows ? (
        <div className="global-voice-ai-buttons">
          {renderIconButton(voiceHandler, "Speak to autofill")}
          <span className="global-voice-ai-divider" />
          {renderIconButton(onSnapRxClick, "Upload document", "upload")}
        </div>
      ) : hasVoiceFlow ? (
        <div className="progress-summary-voice-button">
          <div className="progress-summary-icon">
            <img src={defaultIcons.voiceAiIcon} alt="speak" />
          </div>
        </div>
      ) : (
        <div className="global-voice-ai-buttons">
          {renderIconButton(onSnapRxClick, "Upload document", "upload")}
        </div>
      )}
    </div>
  );
};

export default GlobalVoiceAI;
