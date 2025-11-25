import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { message } from "antd";
import Lottie from "lottie-react";
import { v4 as uuidv4 } from "uuid";
import agentAlex from "../../../assets/images/agent-alex.png";
import closeSquare from "../../../assets/images/close-square.svg";
import VoiceVisualizer from "../../../components/VoiceVisualizer";
import { defaultIcons } from "../../../assets/images/icons";
import "../consultantNotes/AgentAlexVoicePanel.scss";
import processingLottie from "../../../assets/lotties/voiceProcessing-2.json";

// Helper to pick a supported MIME type for MediaRecorder
const getSupportedMimeType = () => {
  if (typeof MediaRecorder === "undefined") return null;

  const mimeTypes = [
    "audio/webm;codecs=opus",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/webm",
    "audio/mp4",
    "audio/mpeg",
  ];

  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
};

const AgentAlexVoicePanel = forwardRef(
  ({ onClose, onPause, onSubmit }, ref) => {
    const [showRecorder, setShowRecorder] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioStreamRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const loadingTimerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      startRecording: handleStartRecording,
      stopRecording: handleSubmitRecording,
      pauseResume: handlePauseResume,
      cancelRecording: handleCancelRecording,
    }));

    // Delay showing the recorder to mirror the loading state
    useEffect(() => {
      loadingTimerRef.current = setTimeout(() => {
        setShowRecorder(true);
        handleStartRecording();
      }, 1000);

      return () => {
        clearTimeout(loadingTimerRef.current);
        handleCancelRecording();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startTimer = () => {
      clearTimer();
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    };

    const clearTimer = () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };

    const cleanupStreams = () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    const handleStartRecording = async () => {
      if (isRecording) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        message.error("Microphone not supported on this device.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStreamRef.current = stream;

        const mimeType = getSupportedMimeType();
        mediaRecorderRef.current = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        audioChunksRef.current = [];
        mediaRecorderRef.current.stopReason = "submitted";

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          try {
            if (mediaRecorderRef.current?.stopReason === "cancelled") {
              cleanupStreams();
              return;
            }

            const mime = mediaRecorderRef.current?.mimeType || "audio/webm";
            const audioBlob = new Blob(audioChunksRef.current, { type: mime });

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioCtx();
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const accurateDuration = audioBuffer.duration;

            const payload = {
              audioBlob,
              duration: accurateDuration,
              filename: `${uuidv4()}.webm`,
              mimeType: mime,
              size: audioBlob.size,
            };

            if (mediaRecorderRef.current?.stopReason === "submitted") {
              setIsProcessing(true);
              if (onSubmit) {
                onSubmit(payload, () => {
                  setIsProcessing(false);
                  onClose();
                });
              } else {
                setIsProcessing(false);
              }
            }
          } catch (err) {
            console.error("Error processing audio:", err);
            message.error("Failed to process audio recording");
          } finally {
            cleanupStreams();
            setIsRecording(false);
            setIsPaused(false);
            clearTimer();
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);
        startTimer();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        message.error("Unable to access microphone. Please check permissions.");
      }
    };

    const handleSubmitRecording = () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current.stopReason = "submitted";
        mediaRecorderRef.current.stop();
      }
    };

    const handleCancelRecording = () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        audioChunksRef.current = [];
        mediaRecorderRef.current.stopReason = "cancelled";
        mediaRecorderRef.current.stop();
      }
      cleanupStreams();
      clearTimer();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    };

    const handlePauseResume = () => {
      if (!mediaRecorderRef.current) return;

      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        startTimer();
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        clearTimer();
      }

      if (onPause) {
        onPause(!isPaused);
      }
    };

    const handleCloseClick = () => {
      handleCancelRecording();
      if (onClose) {
        onClose();
      }
    };

    const renderLoading = () => (
      <div className="agent-alex-voice-body">
        <div className="agent-alex-voice-loading">Loading...</div>
        <div className="agent-alex-voice-loading-subtitle">
          Please hold a moment
        </div>
      </div>
    );

    const renderProcessing = () => (
      <div className="agent-alex-voice-body processing">
        <div className="voice-ai-recorder-processing-content">
          <Lottie
            animationData={processingLottie}
            loop
            autoplay
            style={{ width: 320, height: 40 }}
          />
          <div className="voice-ai-recorder-processing-indicator-text">
            Processing your input
            <span className="dots-container">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
          <div className="voice-ai-recorder-processing-indicator-sub-header">Please hold a moment</div>
        </div>
      </div>
    );

    const renderRecorder = () => (
      <div className="agent-alex-voice-body active">
        <div className="agent-alex-voice-title">
          Speak the details you want to fill in the form
        </div>
        <div className="agent-alex-voice-visualizer-row">
          <VoiceVisualizer
            audioStream={audioStreamRef.current}
            isRecording={isRecording}
            isPaused={isPaused}
            width={280}
            maxHeight={40}
            barsCount={100}
            smoothness={0.4}
            sensitivity={3}
          />
          <div className="agent-alex-voice-timer">
            {formatTime(recordingTime)}
          </div>
        </div>
        <div className="agent-alex-voice-actions">
          <button
            type="button"
            className={`agent-alex-voice-mic ${isPaused ? "paused" : ""}`}
            onClick={handlePauseResume}
            aria-label={isPaused ? "Resume recording" : "Pause recording"}
          >
            <img
              src={
                isPaused
                  ? defaultIcons.microphoneSlash
                  : defaultIcons.microphoneWhiteRounded
              }
              alt="Microphone"
            />
          </button>
          <div className="agent-alex-voice-status">
            {isPaused ? "Paused" : "Listening"}
            {!isPaused && (
              <span className="agent-alex-voice-dots">
                <span />
                <span />
                <span />
              </span>
            )}
          </div>
          <button
            type="button"
            className="agent-alex-voice-submit"
            onClick={handleSubmitRecording}
            aria-label="Submit recording"
          >
            <img src={defaultIcons.submitIcon} alt="Submit" />
          </button>
        </div>
      </div>
    );

    return (
      <div className="agent-alex-voice-panel">
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
                Your personal medical assistant
              </div>
            </div>
          </div>
          <button
            className="agent-alex-voice-close-button"
            onClick={handleCloseClick}
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
        {!showRecorder
          ? renderLoading()
          : isProcessing
          ? renderProcessing()
          : renderRecorder()}
      </div>
    );
  }
);

export default AgentAlexVoicePanel;
