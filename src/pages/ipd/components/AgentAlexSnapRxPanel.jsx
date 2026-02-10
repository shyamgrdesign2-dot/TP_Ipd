import React from "react";
import agentAlex from "../../../assets/images/agent-alex.png";
import closeSquare from "../../../assets/images/close-square.svg";
import { defaultIcons } from "../../../assets/images/icons";
import IPDSnapRx from "../snapRx/SnapRx";
import "../consultantNotes/AgentAlexVoicePanel.scss";
import { useDispatch } from "react-redux";
import {
  resetFileUploadToken,
  setFileUploadSessionId,
} from "../../../redux/ipd/ipdSnapRxDigitizationSlice";
import { SNAP_RX_TOKENS_STORAGE_KEY } from "../../../utils/constants";

const AgentAlexSnapRxPanel = ({ onClose, previousOutput, schemaKey, onSuccess }) => {
  const dispatch = useDispatch();
  const [isDigitizing, setIsDigitizing] = React.useState(false);

  const handleClose = () => {
    // localStorage.removeItem(SNAP_RX_TOKENS_STORAGE_KEY);
    // dispatch(resetFileUploadToken());
    // dispatch(setFileUploadSessionId(null));
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="agent-alex-voice-panel agent-alex-snaprx-panel">
      <div className="agent-alex-voice-header">
        <div className="agent-alex-voice-profile">
          <div className="agent-alex-voice-avatar">
            <img
              className="agent-alex-voice-avatar-image"
              src={agentAlex}
              alt="Agent Alex"
            />
          </div>
          <div className="agent-alex-voice-info">
            <div className="agent-alex-voice-name">Agent Alex</div>
            <div className="agent-alex-voice-role">
              Upload a document to autofill
            </div>
          </div>
        </div>
        <button
          className="agent-alex-voice-close-button"
          onClick={handleClose}
          disabled={isDigitizing}
          aria-label="Close Agent Alex panel"
        >
          <img src={closeSquare} alt="Close" />
        </button>
        <img
          className="agent-alex-voice-grid-vector"
          src={defaultIcons.gridVector}
          alt="Grid"
        />
      </div>
      {/* <div className="agent-alex-snaprx-body">
        <div className="agent-alex-snaprx-content">
        </div>
      </div> */}
          <div className="agent-alex-snaprx-scroll">
            <IPDSnapRx
              previousOutput={previousOutput}
              handleClose={handleClose}
              schemaKey={schemaKey}
              onSuccess={onSuccess}
              onDigitizingChange={setIsDigitizing}
            />
          </div>
    </div>
  );
};

export default AgentAlexSnapRxPanel;
