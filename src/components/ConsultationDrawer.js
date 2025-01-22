import React, { useState, useRef, useEffect } from "react";
import { Drawer, Button, Input, message } from "antd";
import styles from "./ConsultationDrawer.module.css";
import { Popover } from "react-bootstrap";
import GenRxTips from "./GenRxTips";
import genRxIcon from "../assets/images/gen-rx-icon.svg";
import deleteIcon from "../assets/images/delete-gen-rx.svg";
import sendIcon from "../assets/images/send-gen-rx.svg";
import micIcon from "../assets/images/mic-gen-rx.svg";
import pauseIcon from "../assets/images/pause.svg";
import { generateRx } from "../api/services/ApiGenRx";
import tutorialIcon from "../assets/images/tutorial-icon.svg";

const ConsultationDrawer = ({ visible, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  // Add these refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        // Here you can send the audioBlob to your backend
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const handleSend = async () => {
    setIsProcessing(true);

    try {
      if (isRecording) {
        mediaRecorderRef.current?.stop();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure audio is processed

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Since your API handles both transcription and prescription generation
        await handleVoiceDigitize(audioBlob, "");
      } else {
        // For text input, create a simple blob with the text
        const textBlob = new Blob([inputText], { type: "text/plain" });
        await handleVoiceDigitize(textBlob, inputText);
      }
    } catch (error) {
      console.error("Error processing prescription:", error);
      message.error(error.message || "Failed to process prescription");
      setIsProcessing(false);
    }
  };

  const handleVoiceDigitize = async (audioBlob, transcribedText) => {
    try {
      const formData = new FormData();

      // Add the required fields to formData
      formData.append("file", audioBlob);
      formData.append("voice_prescription_filename", "prescription.webm");
      formData.append("voice_prescription_text", transcribedText);
      formData.append("doctorId", "your-doctor-id"); // Replace with actual doctor ID
      formData.append("patientId", "your-patient-id"); // Replace with actual patient ID
      formData.append("caseId", "your-case-id"); // Replace with actual case ID
      formData.append("appointmentId", "your-appointment-id"); // Replace with actual appointment ID

      const response = await generateRx(formData);
      if (response.success) {
        // Transform the API response to match your UI structure
        const prescriptionData = {
          medications: response.data.digitize.medications.map((med) => ({
            name: med.name,
            dosage: `${med.dosage}, ${med.frequency}${
              med.schedule ? `, ${med.schedule}` : ""
            }${med.duration ? `, ${med.duration}` : ""}`,
          })),
          labTests: response.data.digitize.labInvestigation.map(
            (test) => test.name
          ),
          symptoms: response.data.digitize.symptoms.map(
            (symptom) =>
              `${symptom.name} (${symptom.duration}, ${symptom.severity}${
                symptom.notes ? `, ${symptom.notes}` : ""
              })`
          ),
          advice: response.data.digitize.advice,
        };

        setPrescriptionData(prescriptionData);
        setInputText(response.data.transcription);
        setShowPrescription(true);
      } else {
        throw new Error(response.error || "Failed to process prescription");
      }
    } catch (error) {
      console.error("Error in voice digitization:", error);
      message.error(error.message || "Failed to process prescription");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableText(inputText);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditableText("");
  };

  const handleEditSave = () => {
    setInputText(editableText);
    setIsEditing(false);
    handleSend();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      mediaRecorderRef.current?.resume();
    } else {
      mediaRecorderRef.current?.pause();
    }
    setIsPaused(!isPaused);
  };

  const renderPrescriptionData = () => {
    if (!prescriptionData) return null;

    return Object.entries(prescriptionData).map(([section, items]) => (
      <div key={section} className={styles.prescriptionSection}>
        <h3 className={styles.sectionTitle}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </h3>
        <ul className={styles.itemsList}>
          {items.map((item, index) => (
            <li key={index} className={styles.prescriptionItem}>
              {typeof item === "string" ? (
                item
              ) : (
                <>
                  <span>{item.name}</span>
                  {item.dosage && (
                    <span className={styles.dosage}>({item.dosage})</span>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={visible}
      className={styles.consultationDrawer}
      closeIcon={false}
      width={showPrescription ? "100%" : "600px"}
    >
      <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
        <div className="align-items-center d-flex h-100">
          <div className="border-end h-100 text-center me-3">
            <div
              onClick={onClose}
              className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
            >
              <i className="icon-right"></i>
            </div>
          </div>
          <div className="title-common">Gen Rx</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn d-flex align-items-center btn-text me-10 tutorial">
            <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
              <img height={42} src={tutorialIcon} />
              Tutorial
            </span>
          </button>

          {showPrescription && (
            <Button
              type="button"
              className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
              onClick={() => null}
              disabled={!prescriptionData}
            >
              <i className="icon-exit me-2"></i>
              End Visit
            </Button>
          )}
        </div>
      </div>
      <div className={styles.container}>
        {!showPrescription ? (
          <>
            <h1 className={styles.title}>
              Start your consultation with the patient
            </h1>
            <p className={styles.subtitle}>
              Dictate the complete prescription effortlessly
            </p>

            <GenRxTips currentTip={currentTip} setCurrentTip={setCurrentTip} />

            {isProcessing ? (
              <div className={styles.processingContainer}>
                <div className={styles.processingContent}>
                  <img src="/api/placeholder/64/64" alt="Processing" />
                  <p>Your input is being processed in the backend...</p>
                  <div className={styles.processingBar} />
                </div>
              </div>
            ) : isRecording ? (
              <div className={styles.recordingContainer}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>{formatTime(recordingTime)}</span>
                  <div
                    className={
                      isPaused ? styles.waveform : styles.waveformActive
                    }
                  />
                  <div className={styles.controlButtons}>
                    {isPaused ? (
                      <button
                        className={styles.micBtn}
                        onClick={handlePauseResume}
                      >
                        <img src={micIcon} alt="resume" />
                      </button>
                    ) : (
                      <div onClick={handlePauseResume} role="button">
                        <img src={pauseIcon} alt="pause" />
                      </div>
                    )}
                    <div role="button" onClick={handleSend}>
                      <img src={sendIcon} alt="send" />
                    </div>
                  </div>
                </div>
                <div className={styles.controls}>
                  <div
                    role="button"
                    onClick={handleStopRecording}
                    className={styles.deleteButton}
                  >
                    <img src={deleteIcon} alt="delete" />
                  </div>
                  <span className={styles.recordingStatus}>
                    {isPaused
                      ? "Tap on the mic to continue recording!"
                      : "Listening..."}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.tapToSpeak}>
                  <div role="button" onClick={handleStartRecording}>
                    <img src={genRxIcon} alt="MIC" />
                  </div>
                  <p className={styles.tapText}>Tap to Speak</p>
                </div>
                <Input.TextArea
                  placeholder="Or type here instead"
                  className={styles.textInput}
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </>
            )}
          </>
        ) : (
          <div className={styles.splitView}>
            <div className={styles.inputSection}>
              {isEditing ? (
                <div className={styles.editContainer}>
                  <Input.TextArea
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    className={styles.editInput}
                    autoSize={{ minRows: 4 }}
                  />
                  <div className={styles.editActions}>
                    <Button onClick={handleEditCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleEditSave}>
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.inputContent}>
                    {inputText}
                    <button className={styles.editButton} onClick={handleEdit}>
                      Edit
                    </button>
                  </div>
                  <div className={styles.inputControls}>
                    <Input.TextArea
                      placeholder="Start speaking or typing..."
                      className={styles.textInput}
                      autoSize={{ minRows: 1, maxRows: 6 }}
                    />
                    <div className={styles.controlButtons}>
                      <button
                        className={styles.micBtn}
                        onClick={handleStartRecording}
                      >
                        <img src={micIcon} alt="mic" />
                      </button>
                      <div role="button" onClick={handleSend}>
                        <img src={sendIcon} alt="send" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={styles.prescriptionSection}>
              {renderPrescriptionData()}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ConsultationDrawer;
