import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { Drawer, Button, Input, message, Menu, Dropdown, Spin } from "antd";
import styles from "./ConsultationDrawer.module.css";
import deleteIcon from "../assets/images/delete-gen-rx.svg";
import micIcon from "../assets/images/mic-gen-rx.svg";
import pauseIcon from "../assets/images/pause.svg";

import {
  editGenRxDetails,
  generateRx,
  getGenRx,
  setAddToRx,
  updateGenRx,
} from "../api/services/ApiGenRx";
import tutorialIcon from "../assets/images/tutorial-icon.svg";
import documentIcon from "../assets/images/digitise-rx.svg";
import genRxBg from "../assets/images/gen-rx-bg.gif";
import genRxRecordIcon from "../assets/images/gen-rx-record.svg";
import tatvaAiStrip from "../assets/images/apexAI.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { getDecodedToken } from "../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import CashManagerContext from "../context/CashManagerContext";
import { addCaseManager, editCaseManager } from "../redux/caseManagerSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorMessage, getClinicName, trackEvent, getTokenData, getDeviceSdkData } from "../utils/utils";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import deleteModuleIcon from "../assets/images/delete-icon-blue.svg";
import alertIcon from "../assets/images/alertIcon.svg";
import CommonModal from "../common/CommonModal";
import BubbleSkeleton from "./BubbleSkeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import VoiceWaveVisualizer from "./WaveVisualizer";
import GenRXLoaders from "./GenRxLoaders";
import genRxSendCta from "../assets/images/genRxSendCta.svg";
import tatvaAiChakra from "../assets/lotties/tatvaAiChakra.lottie";
import { FAILED_VERIFICATION, FREE, MESSAGE_KEY, S_DDX, S_VOICE_RX } from "../utils/constants";
import visitEnd from "../assets/images/end-visit.svg";
import imgCloseVisit from "../assets/images/close-visit.svg";
import { checkCredits, updateCredits } from "../redux/monetizationSlice";
import ExpiredSubModal from "../pages/monetization/components/ExpiredSubModal";
import FreeTrialButton from "../pages/monetization/components/FreeTrialButton";
import { services } from "../redux/doctorsSlice";
import { deviceType, osName } from "react-device-detect";
import SCBanner from "./SCBanner";
import { setSelectAutofill } from "../redux/ddxSlice";

const GenRxTips = lazy(() => import("./GenRxTips"));

const ConsultationDrawer = ({ visible, onClose, handleGenRxKnowMore, labReportID }) => {

  const { servicesList } = useSelector((state) => state.doctors);
  const VOICE_RX_planDetails = servicesList?.find(e => e.service_name === S_VOICE_RX)

  const { useVoiceRx, setUseVoiceRx, useDDX } = useContext(CashManagerContext);

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state;
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const isAutoFocusShownRef = useRef(false);
  const [symptomsCollectorData, setSymptomsCollectorData] = useState(null);
  const [localModules, setLocalModules] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [updatedModuleName, setUpdatedModuleName] = useState("");
  const [genRxDetails, setGenRxDetails] = useState(null);
  const [showPrescription, setShowPrescription] = useState(
    caseManagerData?.smart_prescription_filename || false
  );
  const [inputText, setInputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [editableQuery, setEditableQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableLineItem, setEditableLineItem] = useState("");
  const [editableKey, setEditableKey] = useState("");
  const [queries, setQueries] = useState([]);
  const [isRxEdited, setIsRxEdited] = useState(false);
  const [editingModule, setEditingModule] = useState("");
  const [isDeleteModuleModalOpen, setIsDeleteModuleModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const decodedToken = getDecodedToken();
  const doctorId = decodedToken?.result?.user_id;
  const [audioBlob, setAudioBlob] = useState(null);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [showSCBanner, setShowSCBanner] = useState(false);
  const { profile, userId } = useSelector((state) => state.doctors);
  const { symptomCollector, isAutofillSelected, selectedSymptomsCollector } =
    useSelector((state) => state.ddx);
  const { TextArea } = Input;

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  useEffect(() => {
    if (VOICE_RX_planDetails !== undefined && (VOICE_RX_planDetails?.plan_tier === FREE || VOICE_RX_planDetails?.plan_tier === FAILED_VERIFICATION)) {
      setTimeout(() => {
        setIsSubModalOpen(true)
      }, 500);
    }
  }, [VOICE_RX_planDetails]);

  const showHideSubModal = useCallback(() => {
    setIsSubModalOpen(!isSubModalOpen);

    const clinic_name = getClinicName(profile?.hospital_data);
    const tokenData = getTokenData();
    const deviceSdkData = getDeviceSdkData();
    window.Moengage.track_event("TP_voiceRx_FreeTrailInfo", {
      doctor_name: profile?.um_name,
      doctor_number: profile?.um_contact,
      doctor_unique_id: profile?.doctor_unique_id,
      doctor_specialty: profile?.dp_name,
      clinic_id: tokenData?.clinic_id,
      um_id: tokenData?.user_id,
      clinic_Name: clinic_name,
      ...deviceSdkData,

    });
  }, [isSubModalOpen]);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  // Add these refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const navigate = useNavigate();

  const { tcmId, consultationDate, pamId } = useContext(CashManagerContext);

  const dispatch = useDispatch();

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (caseManagerData?.smart_prescription_filename) getGenRxDetails();
  }, [caseManagerData?.smart_prescription_filename]);

  useEffect(() => {
    if (isAutoFocusShownRef.current) return;
    if (!prescriptionData || activeIndex !== null || activeType !== null) return;

    const fieldsToCheck = [
      { name: 'vitalsAndBodyComposition', type: 'object' },
      { name: 'medicalHistory', type: 'array' },
      { name: 'symptoms', type: 'array' },
      { name: 'examinations', type: 'array' },
      { name: 'diagnosis', type: 'array' },
      { name: 'medications', type: 'array' },
      { name: 'labInvestigation', type: 'array' },
      { name: 'advice', type: 'array' },
      { name: 'vaccinations', type: 'array' },
      { name: 'others', type: 'array' },
      { name: 'dynamicFields', type: 'object' },
      { name: 'followUp', type: 'string' }
    ];

    for (const field of fieldsToCheck) {
      if (field.type === 'object' && field.name === 'vitalsAndBodyComposition') {
        const keysWithValue = Object.entries(prescriptionData[field.name] || {})
          .filter(([_, value]) => value)
          .map(([key]) => key);
        if (keysWithValue?.length) {
          setTimeout(() => {
            isAutoFocusShownRef.current = true;
            return handleKeyEditClick(keysWithValue[0]);
          }, 0);
          return;
        }
      } else if (field.type === 'object' && field.name === 'dynamicFields') {
        const modules = Object.keys(prescriptionData[field.name] || {});
        if (modules.length && prescriptionData[field.name][modules[0]]?.length) {
          setTimeout(() => {
            isAutoFocusShownRef.current = true;
            return handleItemClick(modules[0], 0, true);
          }, 100);
          return;
        }
      } else if (field.type === 'array') {
        if (prescriptionData[field.name]?.length) {
          setTimeout(() => {
            isAutoFocusShownRef.current = true;
            if (["advice", "others"].includes(field.name)) {
              return handleItemClick(field.name, 0);
            }
            return handleLineItemClick(field.name, 0);
          }, 100);
          return;
        }
      } else if (field.type === 'string') {
        if (prescriptionData[field.name]) {
          setTimeout(() => {
            isAutoFocusShownRef.current = true;
            return handleItemClick(field.name);
          }, 100);
          return;
        }
      }
    }
  }, [prescriptionData, activeIndex, activeType]);

  useEffect(() => {
    if (symptomCollector && Object.keys(symptomCollector)?.length > 0) {
      setShowSCBanner(true);
    }
  }, [symptomCollector]);

  const getFormattedSymptomsCollectorData = (selectedSymptomsCollector) => {
    return {
      ...(selectedSymptomsCollector?.symptoms?.length && {
        symptoms: selectedSymptomsCollector.symptoms,
      }),
      ...(selectedSymptomsCollector?.medicalHistory?.some(
        (obj) => obj.items?.length
      ) && {
        medicalHistory: selectedSymptomsCollector.medicalHistory.flatMap(
          (obj) => obj.items
        ),
      }),
      ...(selectedSymptomsCollector?.notes && {
        others: [selectedSymptomsCollector.notes],
      }),
    };
  };

  useEffect(() => {
    if (
      isAutofillSelected &&
      selectedSymptomsCollector &&
      Object.keys(selectedSymptomsCollector)?.length > 0
    ) {
      const formattedSymptomsCollectorData = getFormattedSymptomsCollectorData(
        selectedSymptomsCollector
      );
      setSymptomsCollectorData(formattedSymptomsCollectorData);
      setPrescriptionData(formattedSymptomsCollectorData);
      setShowPrescription(true);

      if (!caseManagerData?.smart_prescription_filename) {
        handleVoiceDigitize(null, null, true);
      }
    }
  }, [selectedSymptomsCollector, isAutofillSelected]);

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

  const getGenRxDetails = async () => {
    try {
      const response = await getGenRx(
        caseManagerData?.smart_prescription_filename
      );

      if (response.success) {
        setPrescriptionData(
          response.data.editedData || response.data.digitizeData
        );
        setGenRxDetails({
          source: response.data.source,
          source_duration: response.data.source_duration,
          timeRequiredInMs: response.data.timeRequiredInMs,
          type: response.data.type,
          _id: response.data._id,
        });
        // Check if history exists and has data before mapping
        if (response.data?.history?.length > 0) {
          const validTranscriptions = response.data.history
            .map(({ transcription }) => transcription)
            .filter((text) => text && text !== "null");

          if (validTranscriptions.length > 0) {
            setQueries(validTranscriptions);
          }
        }
      } else {
        throw new Error(response.error || "Failed to get Rx");
      }
    } catch (error) {
      console.error("Error getting Rx details:", error);
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
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/mp4",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    trackEvent("TP_VoiceRx_Paused", {
      patient_contact: patient_data?.pm_contact_no || "",
      patient_id: patient_data?.patient_unique_id || "",
      doctor_speciality: profile?.dp_name,
      doctor_unique_id: profile?.doctor_unique_id,
      clinic_name,
      rx_id: genRxDetails?._id || "",
    });
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
    if (VOICE_RX_planDetails?.plan_tier === FREE && VOICE_RX_planDetails?.credit_balance <= 0) {
      showHideSubModal()
    } else if (VOICE_RX_planDetails?.plan_tier === FAILED_VERIFICATION) {
      showHideSubModal()
    } else {
      let sendData = {
        b2c_id: profile?.b2c,
        service_name: S_VOICE_RX
      }
      const action = await dispatch(checkCredits(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        if (action?.payload?.hasOwnProperty("service_name")) {
          if (action?.payload?.plan_tier === FREE && action?.payload?.credit_balance <= 0) {
            if (action?.payload?.credit_balance != VOICE_RX_planDetails?.credit_balance) {
              await dispatch(services(sendData?.b2c_id))
            }
            showHideSubModal()
          } else if (action?.payload?.plan_tier === FAILED_VERIFICATION) {
            showHideSubModal()
          } else {
            if (!isRecording && !(inputText || editableQuery)) return;
            if (genRxDetails?._id) {
              const clinic_name = getClinicName(profile?.hospital_data);
              trackEvent("TP_VoiceRx_editRx", {
                patient_contact: patient_data?.pm_contact_no || "",
                patient_id: patient_data?.patient_unique_id || "",
                doctor_speciality: profile?.dp_name,
                doctor_unique_id: profile?.doctor_unique_id,
                clinic_name,
                rx_id: genRxDetails?._id,
              });
            }
            setShowPrescription(true);
            setRecordingTime(0);
            setIsProcessing(true);

            try {
              if (isRecording) {
                mediaRecorderRef.current?.stop();
                await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure audio is processed

                const audioBlob = new Blob(audioChunksRef.current, {
                  type: "audio/webm",
                });

                await handleVoiceDigitize(audioBlob, "");
              } else {
                await handleVoiceDigitize(null, inputText || editableQuery);
              }
            } catch (error) {
              console.error("Error processing prescription:", error);
              message.error(error.message || "Failed to process prescription");
              setIsProcessing(false);
            }
          }
        } else {
          typeof action?.payload?.data?.error === 'object' ?
            errorMessage(action?.payload?.data?.error?.description)
            :
            errorMessage(action?.payload?.data?.message)
        }
      } else {
        errorMessage(action.payload.message)
      }
    }
  };

  const preparePayloadForApi = () => {
    const cleanedData = removeScItems(prescriptionData);
    const { dynamicFields = {} } = cleanedData;

    // Exclude local modules based on localModules state
    const filteredDynamicFields = Object.keys(dynamicFields).reduce(
      (acc, key) => {
        if (!localModules.includes(key)) {
          acc[key] = dynamicFields[key]; // Include only non-local modules
        }
        return acc;
      },
      {}
    );

    return {
      ...cleanedData,
      dynamicFields: filteredDynamicFields,
    };
  };

  const removeScItems = (data) => {
    // Create a new object with filtered arrays
    return {
      ...data,
      symptoms: data.symptoms.filter((symptom) => !symptom.SC),
      medicalHistory: data.medicalHistory.filter((history) => !history.SC),
    };
  };

  const handleVoiceDigitize = async (
    audioBlob,
    transcribedText,
    isFromSC = false
  ) => {
    try {
      const formData = new FormData();
      if (audioBlob) {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
        formData.append("file", audioBlob);
        formData.append("voice_prescription_filename", `${uuidv4()}.webm`);
        formData.append("source_duration", duration);
      } else {
        formData.append("voice_prescription_text", transcribedText);
      }
      if (genRxDetails?._id) {
        const data = preparePayloadForApi();
        formData.append(
          "voice_prescription_previous_context",
          JSON.stringify(data)
        );
      }
      formData.append("doctorId", doctorId); // Replace with actual doctor ID
      formData.append("patientId", patient_data?.patient_unique_id); // Replace with actual patient ID

      const response = genRxDetails?._id
        ? await updateGenRx(formData, genRxDetails?._id)
        : await generateRx(formData);

      if (response.success) {
        if (!isFromSC) {
          setPrescriptionData(response.data.digitize);
          setPrescriptionData(() => {
            // Merge localModules into dynamicFields
            const mergedDynamicFields = {
              ...response.data.digitize?.dynamicFields, // Retain API-provided dynamicFields
              ...localModules.reduce((acc, moduleName) => {
                acc[moduleName] = []; // Add local modules with default values
                return acc;
              }, {}),
            };

            const formattedSymptomsCollectorData =
              getFormattedSymptomsCollectorData(selectedSymptomsCollector);
            const mergedData =
              formattedSymptomsCollectorData &&
                Object.keys(formattedSymptomsCollectorData)?.length > 0
                ? mergeData(
                  response.data.digitize,
                  formattedSymptomsCollectorData
                )
                : response.data.digitize;

            return {
              ...mergedData,
              dynamicFields: mergedDynamicFields, // Updated dynamicFields with localModules
            };
          });

          setQueries(
            isEditing
              ? [
                ...queries.slice(0, queries.length - 1),
                response.data.transcription,
              ]
              : [...queries, response.data.transcription]
          );
        }

        // Clear localModules after merging (optional)
        // setLocalModules([]);
        setGenRxDetails({
          source: response.data.source,
          source_duration: response.data.source_duration,
          timeRequiredInMs: response.data.timeRequiredInMs,
          type: response.data.type,
          _id: response.data._id,
        });
        setInputText("");
        setIsEditing(false);
        setUseVoiceRx(true);
      } else {
        throw new Error(response.error || "Failed to process prescription");
      }
    } catch (error) {
      console.error("Error in voice digitization:", error);
      message.error(error.message || "Failed to process prescription");
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const handleUpdateGenRX = async () => {
    try {
      const response = await editGenRxDetails(
        { editedData: prescriptionData },
        genRxDetails?._id
      );
      if (response.status === 204) {
        setGenRxDetails({
          source: response.data.source,
          source_duration: response.data.source_duration,
          timeRequiredInMs: response.data.timeRequiredInMs,
          type: response.data.type,
          _id: response.data._id,
        });
      } else {
        throw new Error(response.error || "Failed to update Rx");
      }
    } catch (error) {
      console.error("Error in voice digitization:", error);
      message.error(error.message || "Failed to process prescription");
    }
  };

  const mergeData = (data1, data2) => {
    // Helper function to check if two items are duplicates
    const isDuplicate = (item1, item2) => {
      return (
        item1.name === item2.name &&
        item1.duration === item2.duration &&
        item1.severity === item2.severity &&
        item1.notes === item2.notes
      );
    };

    // Add SC flag to data2 items
    const data2WithSC = {
      ...data2,
      symptoms: data2?.symptoms?.map((symptom) => ({
        ...symptom,
        SC: true,
      })),
      medicalHistory: data2?.medicalHistory?.map((history) => ({
        ...history,
        SC: true,
      })),
    };

    // Merge symptoms arrays while removing duplicates
    const mergedSymptoms = [...data1?.symptoms];
    data2WithSC?.symptoms?.forEach((symptom2) => {
      if (!mergedSymptoms.some((symptom1) => isDuplicate(symptom1, symptom2))) {
        mergedSymptoms.push(symptom2);
      }
    });

    // Merge medicalHistory arrays while removing duplicates
    const mergedMedicalHistory = [...data1.medicalHistory];
    data2WithSC.medicalHistory.forEach((history2) => {
      if (
        !mergedMedicalHistory.some((history1) =>
          isDuplicate(history1, history2)
        )
      ) {
        mergedMedicalHistory.push(history2);
      }
    });

    // Return merged object
    return {
      ...data1,
      ...data2,
      symptoms: mergedSymptoms,
      medicalHistory: mergedMedicalHistory,
    };
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableQuery(queries[queries.length - 1]);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditableQuery("");
  };

  const handleEditSave = () => {
    setInputText(editableQuery);
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

  const handleInputChange = (e) => {
    setEditableText(e.target.value);
    setIsRxEdited(true);
  };

  const handlePaste = (e, type) => {
    const pastedData =
      e.clipboardData.getData("text/plain") ||
      e.clipboardData.getData("Text") ||
      e.clipboardData.getData("text");
    const points = pastedData
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean);

    if (points.length > 0) {
      setPrescriptionData((prevData) => {
        const updatedData = { ...prevData };

        points.forEach((point) => {
          if (!updatedData.dynamicFields[type]) {
            updatedData.dynamicFields[type] = [];
          }
          updatedData.dynamicFields[type].push(point);
        });

        return updatedData;
      });
      setIsRxEdited(true);
    }

    // Clear the editable text
    e.preventDefault();
    setEditableText("");
  };

  const inputRefs = useRef({});
  const inputLineItemRefs = useRef({});

  const handleKeyDown = (e, type, index, isExisting) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline in the input field
      
      const trimmedText =  isExisting ? editableLineItem?.trim() : editableText.trim();
      if (trimmedText) {
        setPrescriptionData((prevData) => {
          const updatedData = { ...prevData };

          if (isExisting) {
            if (!updatedData?.[type]) {
              updatedData[type] = [];
            }
            if (['advice', 'others'].includes(type)) {
              updatedData[type][index] = trimmedText;
              updatedData[type].splice(index + 1, 0, "");
            } else {
              updatedData[type][index].lineItem = trimmedText;
              updatedData[type].splice(index + 1, 0, { lineItem: " ", name: " " });
            }
            setEditableLineItem(" ");
            setEditableText("");
          return updatedData;
          }
          if (!updatedData.dynamicFields[type]) {
            updatedData.dynamicFields[type] = [];
          }

          // Update the current index with trimmed text
          updatedData.dynamicFields[type][index] = trimmedText;

          // Insert an empty string after the current index
          updatedData.dynamicFields[type].splice(index + 1, 0, "");
          return updatedData;
        });

        // Update active index and clear input
        setActiveIndex(index + 1);
        setIsRxEdited(true);
        if (isExisting && !['advice', 'others'].includes(type)) {
          setActiveType(`${type}-lineItem`);
          setEditableLineItem("");
        } else {
          setActiveType(type);
          setEditableText("");
        }

        // Focus on the newly added input
        setTimeout(() => {
          const nextIndex = index + 1;
          if (isExisting) inputLineItemRefs.current[nextIndex]?.focus();
          else
          inputRefs.current[nextIndex]?.focus();
        }, 0);
      }
    }
  };

  const handleKeyPress = (e) => {
    // If only Enter is pressed (without Shift), call API
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line
      handleSend();
    }
    // If Shift + Enter is pressed, let the default behavior happen (new line)
  };

  // Handle lineItem input change for editing
  const handleLineItemChange = (e) => {
    setEditableLineItem(e.target.value);
    setIsRxEdited(true);
  };

  const handleInputBlur = (type, index, isCustom, isExisting) => {
    if ((activeIndex !== null && activeType !== null) || (isCustom || isExisting)) {
      setPrescriptionData((prevData) => {
        const updatedData = { ...prevData };
        const trimmedText = isCustom ? editableText.trim() : isExisting ? editableLineItem?.trim() : "";
        if (!trimmedText) {
          if (type === "vitalsAndBodyComposition") {
            updatedData.vitalsAndBodyComposition[index] = "";
          } else if (isCustom) {
            updatedData.dynamicFields[type] = updatedData.dynamicFields[
              type
            ].filter((_, i) => i !== index);
          } else if (isExisting) {
            updatedData[type] = updatedData[
              type
            ].filter((_, i) => i !== index);
          }
           else if (type === "followUp") {
            updatedData.followUp = "";
          } else {
            updatedData[type] = updatedData?.[type]?.filter(
              (_, i) => i !== index
            );
          }
          return updatedData;
        }
        if (
          type === "medications" ||
          type === "labInvestigation" ||
          type === "symptoms" ||
          type === "examinations" ||
          type === "diagnosis" ||
          type === "medicalHistory" ||
          type === "vaccinations"
        ) {
          updatedData[type][index].name = trimmedText;
          updatedData[type][index].lineItem = trimmedText;
        } else if (type === "advice" || type === "others") {
          updatedData[type][index] = trimmedText;
        } else if (type === "vitalsAndBodyComposition") {
          updatedData.vitalsAndBodyComposition[index] = trimmedText;
        } else if (isCustom) {
          updatedData.dynamicFields[type][index] = trimmedText;
        } else if (type === "followUp") {
          updatedData.followUp = trimmedText;
        }
        return updatedData; // Persist changes
      });
      setIsRxEdited(true);
    }
    setActiveIndex(null);
    setActiveType(null);
    setEditableText(""); // Clear editable text after blur
  };

  // Handle click on an item (to edit)
  const handleItemClick = (type, index, isCustom) => {
    if (activeIndex !== null && activeType !== null) {
      handleInputBlur(activeType, activeIndex);
    }

    if (
      type === "symptoms" ||
      type === "medications" ||
      type === "labInvestigation" ||
      type === "examinations" ||
      type === "diagnosis" ||
      type === "medicalHistory" ||
      type === "vaccinations"
    ) {
      setEditableText(prescriptionData[type][index].name);
    } else if (type === "advice" || type === "others") {
      setEditableText(prescriptionData[type][index]);
    } else if (type === "vitalsAndBodyComposition") {
      setEditableText(prescriptionData.vitalsAndBodyComposition[index]);
    } else if (isCustom) {
      setEditableText(prescriptionData.dynamicFields[type][index]);
    } else if (type === "followUp") {
      setEditableText(prescriptionData?.followUp);
    }

    setActiveIndex(index);
    setActiveType(type);
  };

  // Handle click on a lineItem (to edit)
  const handleLineItemClick = (type, index) => {
    if (
      type === "medications" ||
      type === "labInvestigation" ||
      type === "vaccinations" ||
      type === "medicalHistory" ||
      type === "symptoms" ||
      type === "examinations" ||
      type === "diagnosis"
    ) {
      setEditableLineItem(prescriptionData[type][index]?.lineItem);
    }
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  async function onEndVisitClick() {
    if (
      isRxEdited ||
      localModules?.length ||
      (symptomsCollectorData && Object.keys(symptomsCollectorData)?.length > 0)
    )
      handleUpdateGenRX();
    const sendData = {
      action: tcmId === 0 ? "add" : "edit",
      tcm_id: tcmId,
      patient_unique_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
      pam_id:
        patient_data !== undefined
          ? patient_data.hasOwnProperty("pam_id")
            ? patient_data.pam_id
            : pamId
          : 0,
      consultation_date: consultationDate,
      smart_prescription_filename: genRxDetails?._id,
      labReportID: labReportID,
    };

    const action =
      tcmId == 0
        ? await dispatch(addCaseManager(sendData))
        : await dispatch(editCaseManager(sendData));

    if (action.meta.requestStatus === "fulfilled") {
      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" alt="Visit End Icon" />
            <div>
              <div className="title-common-digitised text-start fontroboto">{`${patient_data?.pm_first_name}'s visit ended successfully.`}</div>
              <div className="fontroboto text-start fw-normal mt-1">
                View completed visits in finished tab.
              </div>
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              alt="Close Visit Icon"
              onClick={() => message.destroy()}
            />
          </div>
        ),
        duration: 5,
      });

      const clinic_name = getClinicName(profile?.hospital_data);
      const tokenData = getTokenData();
      const deviceSdkData = getDeviceSdkData();
      window.Moengage.track_event("TP_Voice_Submit", {
        doctor_name: profile?.um_name,
        doctor_number: profile?.um_contact,
        doctor_unique_id: profile?.doctor_unique_id,
        doctor_specialty: profile?.dp_name,
        clinic_id: tokenData?.clinic_id,
        um_id: tokenData?.user_id,
        clinic_Name: clinic_name,
        patient_name: patient_data?.pm_first_name,
        patient_unique_id: patient_data?.patient_unique_id,
        ...deviceSdkData,
      });

      if (useVoiceRx) {
        let sendData = {
          b2c_id: profile?.b2c,
          service_name: S_VOICE_RX
        }
        dispatch(updateCredits(sendData))
      }
      if (useDDX) {
        let sendData = {
          b2c_id: profile?.b2c,
          service_name: S_DDX
        }
        dispatch(updateCredits(sendData))
      }

      if (isAutofillSelected) {
        await setAddToRx({
          _id: symptomCollector?._id,
          addToRx: true,
        });
        dispatch(setSelectAutofill(false));
      }
      navigate("/gen-rx-print", {
        replace: true,
        state: {
          ...action.payload,
          patient_data: patient_data,
          page: "prescription",
          rxId: genRxDetails?._id,
        },
      });
    } else {
      errorMessage(action.error);
    }
  }

  const handleKeyEditClick = (key) => {
    setActiveIndex(key);
    setActiveType("vitalsAndBodyComposition-key");
    setEditableKey(key);
  };

  const handleKeyEditBlur = (key) => {
    if (editableKey && editableKey !== key) {
      setPrescriptionData((prevData) => {
        const updatedData = { ...prevData };
        const value = updatedData.vitalsAndBodyComposition[key];
        delete updatedData.vitalsAndBodyComposition[key];
        updatedData.vitalsAndBodyComposition[editableKey] = value;
        return updatedData;
      });
      setIsRxEdited(true);
    }
    setActiveIndex(null);
    setActiveType(null);
    setEditableKey("");
  };

  const renderItems = (type) => {
    if (type === "followUp") {
      // Dynamically calculate input width
      let textWidth = 0;
      if (activeType === "followUp") {
        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.whiteSpace = "nowrap";
        tempSpan.innerText = editableText || "";
        document.body.appendChild(tempSpan);
        textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
      }
      return (
        <div className="digitised-section">
          {isProcessing ? (
            <div className="shimmer-container">
              <div className="shimmer"></div>
            </div>
          ) : (
            <div className="medicine-item">
              {activeType === "followUp" ? (
                <input
                  type="text"
                  value={editableText}
                  className="editable-digitised-item"
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur("followUp")}
                  autoFocus
                  style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }}
                />
              ) : (
                <span
                  onClick={() => handleItemClick("followUp")}
                  className="digitised-item"
                >
                  {prescriptionData?.followUp}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    if (type === "vitalsAndBodyComposition") {
      return (
        <div className="digitised-section">
          {isProcessing ? (
            <div className="shimmer-container">
              <div className="shimmer"></div>
            </div>
          ) : (
            <ul>
              {Object.entries(prescriptionData.vitalsAndBodyComposition || {})
                .filter(([key, value]) => value)
                .map(([key, value]) => {
                  // Dynamically calculate input width
                  let textWidth = 0;
                  if (
                    activeIndex === key &&
                    activeType === "vitalsAndBodyComposition"
                  ) {
                    const tempSpan = document.createElement("span");
                    tempSpan.style.visibility = "hidden";
                    tempSpan.style.position = "absolute";
                    tempSpan.style.whiteSpace = "nowrap";
                    tempSpan.innerText = editableText || "";
                    document.body.appendChild(tempSpan);
                    textWidth = tempSpan.offsetWidth;
                    document.body.removeChild(tempSpan);
                  }

                  return (
                    <li key={key}>
                      <div className="medicine-item">
                        <span className="digitised-item">
                          {/* Format the key to be human-readable */}
                          {activeIndex === key && activeType === "vitalsAndBodyComposition-key" ? (
                            <input
                              type="text"
                              value={editableKey || key}
                              className="editable-digitised-item"
                              onChange={(e) => setEditableKey(e.target.value)}
                              onBlur={() => handleKeyEditBlur(key)}
                              autoFocus
                              style={{ width: `clamp(12px, ${(editableKey || key).length * 8 + 20}px, 100%)` }}
                            />
                          ) : (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleKeyEditClick(key);
                              }}
                              className="digitised-item digitised-key-item"
                              style={{ cursor: "pointer", fontWeight: 500 }}
                            >
                              {`${key}: `}
                            </span>
                          )}
                        </span>
                        {activeIndex === key &&
                          activeType === "vitalsAndBodyComposition" ? (
                          <input
                            type="text"
                            value={editableText} // Pre-fill the input with the current value
                            className="editable-digitised-item"
                            onChange={(e) => setEditableText(e.target.value)}
                            onBlur={() => handleInputBlur(type, key)}
                            autoFocus
                            style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }} // Add padding for better UX
                          />
                        ) : (
                          <span
                            onClick={() => handleItemClick(type, key)}
                            className="digitised-item"
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      );
    }

    // Handle other types dynamically (like medications, symptoms, etc.)
    return (
      <div className="digitised-section">
        {isProcessing ? (
          <div className="shimmer-container">
            <div className="shimmer"></div>
          </div>
        ) : (
          Array.isArray(prescriptionData[type]) &&
          prescriptionData[type].length > 0 && (
            <ul>
              {prescriptionData[type].map((item, index) => {
                // Measure the width of the editable text
                let textWidth = 0;
                let lineItemWidth = 0;

                // For name or other primary data (editableText)
                if (activeIndex === index && activeType === type) {
                  const tempSpan = document.createElement("span");
                  tempSpan.style.visibility = "hidden";
                  tempSpan.style.position = "absolute";
                  tempSpan.style.whiteSpace = "nowrap";
                  tempSpan.innerText = editableText || "";
                  document.body.appendChild(tempSpan);
                  textWidth = tempSpan.offsetWidth;
                  document.body.removeChild(tempSpan);
                }

                // For lineItem (editableLineItem)
                if (
                  activeIndex === index &&
                  activeType === `${type}-lineItem`
                ) {
                  const tempSpanLineItem = document.createElement("span");
                  tempSpanLineItem.style.visibility = "hidden";
                  tempSpanLineItem.style.position = "absolute";
                  tempSpanLineItem.style.whiteSpace = "nowrap";
                  tempSpanLineItem.innerText = editableLineItem || "";
                  document.body.appendChild(tempSpanLineItem);
                  lineItemWidth = tempSpanLineItem.offsetWidth;
                  document.body.removeChild(tempSpanLineItem);
                }

                return (
                  <li key={index}>
                    <div className="medicine-item">
                      {activeIndex === index &&
                        activeType === type &&
                        ["advice", "others"].includes(type) ? (
                        <input
                          type="text"
                          value={editableText}
                          className="editable-digitised-item"
                          onChange={handleInputChange}
                          onBlur={() => handleInputBlur(type, index)}
                          onKeyDown={(e) => handleKeyDown(e, type, index, true)}
                          autoFocus
                          style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }}
                        />
                      ) : (
                        ["advice", "others"].includes(type) && (
                          <span
                            onClick={() => handleItemClick(type, index)}
                            className="digitised-item"
                          >
                            {item}
                          </span>
                        )
                      )}

                      {/* Editable input for lineItem */}
                      {(type === "medications" ||
                        type === "symptoms" ||
                        type === "vaccinations" ||
                        type === "medicalHistory" ||
                        type === "labInvestigation" ||
                        type === "examinations" ||
                        type === "diagnosis") &&
                        item?.lineItem &&
                        (activeIndex === index &&
                          activeType === `${type}-lineItem` ? (
                          <input
                            type="text"
                            value={editableLineItem}
                            className="editable-digitised-item"
                            onChange={handleLineItemChange}
                            onBlur={() => handleInputBlur(type, index, false, true)}
                            onKeyDown={(e) => handleKeyDown(e, type, index, true)}
                            ref={(el) => (inputLineItemRefs.current[index] = el)}
                            autoFocus
                            style={{ width: `clamp(12px, ${lineItemWidth + 10}px, 100%)` }}
                          />
                        ) : (
                          <span
                            onClick={() => handleLineItemClick(type, index)}
                            className="digitised-item"
                          >
                            {item.lineItem}
                          </span>
                        ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
    );
  };

  const toggleDeleteModuleModal = useCallback(() => {
    setIsDeleteModuleModalOpen(!isDeleteModuleModalOpen);
  }, [isDeleteModuleModalOpen]);

  const DELETE_MODULE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isDeleteModuleModalOpen}
        onCancel={toggleDeleteModuleModal}
        modalWidth={550}
        title={"Are you sure you want to delete this module?"}
        modalBody={
          <>
            <div className="d-flex align-items-start alert-warning rounded-10px p-3 patient-details">
              <img className="me-3" src={alertIcon} alt="Warning" />
              <span>
                This action will permanently delete the {moduleToDelete} and
                cannot be undone. Please confirm to proceed
              </span>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => {
                    handleDeleteModule();
                    toggleDeleteModuleModal();
                  }}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Delete
                </div>
                <Button
                  onClick={toggleDeleteModuleModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isDeleteModuleModalOpen]);

  const renderCustomModules = () => {
    return Object.entries(prescriptionData?.dynamicFields || {}).map(
      ([module, data]) => {
        return (
          Array.isArray(data) &&
          data?.every((item) => typeof item === "string") && (
            <>
              {editingModule === module ? (
                <div className="d-flex justify-content-between mb-4">
                  <Input
                    placeholder="Enter custom module name"
                    value={updatedModuleName}
                    onChange={(e) => setUpdatedModuleName(e.target.value)}
                    className="custom-module-input"
                  />
                  <>
                    <CheckOutlined
                      className="input-action-icon tick-icon"
                      onClick={() => handleEditModule(module)}
                    />
                    <CloseOutlined
                      className="input-action-icon cross-icon"
                      onClick={handleCancelEdit}
                    />
                  </>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center title-digitise-section mb-2">
                    {localModules?.includes(module)
                      ? module
                      : module
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    {localModules?.includes(module) && (
                      <i
                        className={`icon-Edit fs-21 ms-2 cursor-pointer`}
                        onClick={() => {
                          setEditingModule(module);
                          setUpdatedModuleName(module);
                        }}
                      ></i>
                    )}
                  </div>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="delete"
                          onClick={() => {
                            setModuleToDelete(module);
                            toggleDeleteModuleModal();
                          }}
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#ff4d4f",
                            padding: "8px 12px",
                          }}
                        >
                          <img
                            src={deleteModuleIcon}
                            width={16}
                            height={16}
                            alt="edit"
                            style={{ margin: "0 8px 3px 0" }}
                          />
                          Delete{" "}
                          {localModules?.includes(module)
                            ? module
                            : module
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}{" "}
                          Module
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <i className={`icon-More fs-21 cursor-pointer`}></i>
                  </Dropdown>
                </div>
              )}
              <div className="digitised-section">
                {isProcessing ? (
                  <div className="shimmer-container">
                    <div className="shimmer"></div>
                  </div>
                ) : data.length > 0 ? (
                  <ul>
                    {data.map((item, index) => {
                      // Measure the width of the editable text
                      let textWidth = 0;
                      let lineItemWidth = 0;

                      // For name or other primary data (editableText)
                      if (activeIndex === index && activeType === module) {
                        const tempSpan = document.createElement("span");
                        tempSpan.style.visibility = "hidden";
                        tempSpan.style.position = "absolute";
                        tempSpan.style.whiteSpace = "nowrap";
                        tempSpan.innerText = editableText || "";
                        document.body.appendChild(tempSpan);
                        textWidth = tempSpan.offsetWidth || 200;
                        document.body.removeChild(tempSpan);
                      }

                      // For lineItem (editableLineItem)
                      if (
                        activeIndex === index &&
                        activeType === `${module}-lineItem`
                      ) {
                        const tempSpanLineItem = document.createElement("span");
                        tempSpanLineItem.style.visibility = "hidden";
                        tempSpanLineItem.style.position = "absolute";
                        tempSpanLineItem.style.whiteSpace = "nowrap";
                        tempSpanLineItem.innerText = editableLineItem || "";
                        document.body.appendChild(tempSpanLineItem);
                        lineItemWidth = tempSpanLineItem.offsetWidth;
                        document.body.removeChild(tempSpanLineItem);
                      }

                      return (
                        <li key={index}>
                          <div className="medicine-item">
                            {activeIndex === index && activeType === module ? (
                              <input
                                type="text"
                                value={editableText}
                                className="editable-digitised-item"
                                onChange={handleInputChange}
                                onBlur={() =>
                                  handleInputBlur(module, index, true)
                                }
                                autoFocus
                                style={{
                                  width: `clamp(12px, ${textWidth + 10}px, 100%)`,
                                }}
                                onPaste={(e) => handlePaste(e, module)}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, module, index)
                                }
                                ref={(el) => (inputRefs.current[index] = el)}
                              />
                            ) : (
                              <span
                                onClick={() =>
                                  handleItemClick(module, index, true)
                                }
                                className="digitised-item"
                              >
                                {item}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <textarea
                    type="text"
                    className="editable-digitised-item w-100"
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur(module, 0, true)}
                    style={{ border: "none" }}
                    rows={3}
                    placeholder={`Enter ${module} details here`}
                    onPaste={(e) => handlePaste(e, module)}
                    onKeyDown={(e) => handleKeyDown(e, module, 0)}
                  />
                )}
              </div>
            </>
          )
        );
      }
    );
  };

  const handleAddModule = () => {
    if (!newModuleName?.trim()) return;
    setPrescriptionData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData["dynamicFields"]) {
        updatedData["dynamicFields"] = {};
      }
      // Add the new module to dynamicFields
      updatedData["dynamicFields"][newModuleName] = [];

      return updatedData;
    });

    // Track the new module name
    setLocalModules((prevModules) => [...prevModules, newModuleName]);
    handleCancel();
  };

  const handleEditModule = (module) => {
    if (updatedModuleName?.trim() && updatedModuleName !== module) {
      setPrescriptionData((prevData) => {
        const updatedData = {
          ...prevData,
          dynamicFields: { ...prevData.dynamicFields },
        };

        updatedData.dynamicFields[updatedModuleName] =
          updatedData.dynamicFields[module];

        delete updatedData.dynamicFields[module];

        return updatedData;
      });

      setLocalModules((prevModules) =>
        prevModules.map((mod) => (mod === module ? updatedModuleName : mod))
      );
    }
    handleCancelEdit();
  };

  const handleDeleteModule = () => {
    setPrescriptionData((prevData) => {
      const updatedData = {
        ...prevData,
        dynamicFields: { ...prevData.dynamicFields },
      };

      delete updatedData.dynamicFields[moduleToDelete];

      return updatedData;
    });
    setIsRxEdited(true);
  };

  const handleCancelEdit = () => {
    setEditingModule("");
    setUpdatedModuleName("");
  };

  const handleCancel = () => {
    setShowInput(false);
    setNewModuleName("");
  };

  const checkDataFillOrNot = () => {
    if (prescriptionData) {
      showHideBackModal();
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    onClose();
    navigate(".", {
      replace: true, // Prevents adding a new entry to history
      state: {
        ...state,
        caseManagerData: undefined, // Remove caseManagerData
      },
    });
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={visible}
      className={`${styles.consultationDrawer} bg-body`}
      closeIcon={false}
      width={showPrescription ? "100%" : "640px"}
    >
      <Suspense
        fallback={
          <Spin className="d-flex justify-content-center align-items-center mt-5" />
        }
      >
        <>
          <div className="modalCard-header h-60 align-items-center justify-content-between d-flex position-sticky top-0 z-2">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center me-3">
                <div
                  onClick={checkDataFillOrNot}
                  className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                >
                  <i className="icon-right"></i>
                </div>
              </div>
              <div className="title-common">Voice Rx</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn d-flex align-items-center btn-text me-10 tutorial"
                onClick={handleGenRxKnowMore}
              >
                <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
                  <img height={42} src={tutorialIcon} />
                  Tutorial
                </span>
              </button>

              <FreeTrialButton title={S_VOICE_RX} showHideSubModal={showHideSubModal} />

              {showPrescription && (
                <Button
                  type="button"
                  className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
                  onClick={onEndVisitClick}
                  disabled={!prescriptionData}
                >
                  <i className="icon-exit me-2"></i>
                  End Visit
                </Button>
              )}
            </div>
          </div>
          {showSCBanner && !showPrescription && (
            <div style={{ margin: "20px 30px" }}>
              <SCBanner handleBanner={() => setShowSCBanner(false)} />
            </div>
          )}
          <div
            className={!showPrescription ? styles.gradientBorder : ""}
            style={{ background: !showPrescription ? `url(${genRxBg})` : "" }}
          >
            <div className={styles.container}>
              {!showPrescription ? (
                <>
                  <div style={{ padding: 24 }}>
                    <h1 className={styles.title}>
                      Start your consultation with the patient
                    </h1>
                    <div className={styles.subtitle}>
                      Dictate the complete prescription effortlessly
                    </div>
                  </div>
                  {!isTyping && !isRecording && <GenRxTips />}

                  {isRecording ? (
                    <div
                      className={styles.recordingContainer}
                      style={{ marginLeft: 20, marginBottom: 20 }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{formatTime(recordingTime)}</span>
                        <VoiceWaveVisualizer
                          isRecording={isRecording}
                          isPaused={isPaused}
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
                          <div
                            role="button"
                            onClick={handleSend}
                            style={{ width: 32 }}
                          >
                            <img src={genRxSendCta} alt="send" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.controlButtons}>
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
                      {!isTyping && (
                        <div className={styles.tapToSpeak}>
                          <div
                            role="button"
                            className={styles.animatedButton}
                            onClick={handleStartRecording}
                          >
                            <DotLottieReact
                              src={tatvaAiChakra}
                              loop
                              autoplay
                              style={{ width: "150px", height: "105px" }}
                            />
                          </div>
                          <p className={styles.tapText}>Tap to Speak</p>
                        </div>
                      )}
                      <div style={{ padding: "24px 15px" }}>
                        <div className={styles.inputContainerChat}>
                          <TextArea
                            ref={textAreaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            onClick={() => setIsTyping(true)}
                            onBlur={() =>
                              setTimeout(() => setIsTyping(false), 200)
                            }
                            placeholder={isTyping ? "" : "Or type here instead"}
                            className={styles.textArea}
                            autoSize={{ minRows: 1, maxRows: 6 }}
                          />
                          {isTyping && (
                            <div className={styles.controls}>
                              <div
                                role="button"
                                onMouseDown={handleStartRecording}
                                onTouchStart={handleStartRecording}
                              >
                                <img src={genRxRecordIcon} alt="MIC" />
                              </div>
                              <div
                                role="button"
                                onMouseDown={handleSend}
                                onTouchStart={handleSend}
                                style={{ width: 32 }}
                              >
                                <img src={genRxSendCta} alt="send" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className={`${styles.splitView} w-100`}
                  style={{ padding: 24 }}
                >
                  <div className={styles.inputSection}>
                    <div>
                      <img src={documentIcon} alt="Document" />
                      <span className={styles.heading}>Your input</span>
                    </div>
                    <div className={styles.chatSection}>
                      {isProcessing ? (
                        <BubbleSkeleton />
                      ) : (
                        <>
                          <div className={styles.inputContainer}>
                            <div className={styles.inputQueries}>
                              {queries.map((query, index) => (
                                <div key={index}>
                                  <div
                                    className="position-relative ms-auto"
                                    style={{ maxWidth: "457px" }}
                                  >
                                    <div
                                      key={index}
                                      className={styles.textContainer}
                                    >
                                      <span className={styles.inputText}>
                                        {query}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="d-flex gap-3 me-auto mb-5"
                                    style={{ width: "87%" }}
                                  >
                                    <img
                                      src={tatvaAiStrip}
                                      alt="TatvaAI"
                                      style={{
                                        backgroundColor: "#22003C",
                                        borderRadius: "10px 10px 0px",
                                      }}
                                      width={32}
                                      height={32}
                                    />
                                    <div
                                      className={
                                        styles.prescriptionReadyMessage
                                      }
                                    >
                                      Your prescription is ready! You can also
                                      add details like diagnosis, Examinations
                                      and more simply by speaking or typing
                                      below.
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {isRecording ? (
                            <div className={styles.recordingContainer}>
                              <div className="d-flex align-items-center justify-content-between">
                                <span>{formatTime(recordingTime)}</span>
                                <VoiceWaveVisualizer
                                  isRecording={isRecording}
                                  isPaused={isPaused}
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
                                    <div
                                      onClick={handlePauseResume}
                                      role="button"
                                    >
                                      <img src={pauseIcon} alt="pause" />
                                    </div>
                                  )}

                                  <div
                                    role="button"
                                    onClick={handleSend}
                                    style={{ width: 32 }}
                                  >
                                    <img src={genRxSendCta} alt="send" />
                                  </div>
                                </div>
                              </div>
                              <div className={styles.controlButtons}>
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
                            <div
                              style={{ marginTop: "auto", paddingRight: 20 }}
                            >
                              <div className={styles.inputContainerChat}>
                                <TextArea
                                  ref={textAreaRef}
                                  value={inputText}
                                  onChange={(e) => setInputText(e.target.value)}
                                  onKeyDown={handleKeyPress}
                                  onClick={() => setIsTyping(true)}
                                  onBlur={() => setIsTyping(false)}
                                  placeholder={"Start speaking or typing..."}
                                  className={styles.textArea}
                                  autoSize={{ minRows: 1, maxRows: 6 }}
                                />

                                <div className={styles.controls}>
                                  <div
                                    role="button"
                                    onClick={handleStartRecording}
                                  >
                                    <img src={genRxRecordIcon} alt="MIC" />
                                  </div>
                                  <div
                                    role="button"
                                    onClick={handleSend}
                                    style={{ width: 32 }}
                                  >
                                    <img src={genRxSendCta} alt="send" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.prescriptionSection}>
                    <div>
                      <img src={documentIcon} alt="Document" />
                      <span className={styles.heading}>
                        Generated Digitised Rx
                      </span>
                    </div>
                    {isProcessing ? (
                      <GenRXLoaders isProcessing={isProcessing} />
                    ) : (
                      <div
                        className={`${styles.rightSection} ${isProcessing ? styles.gradientBorder : ""
                          }`}
                        style={{
                          background: isProcessing ? `url(${genRxBg})` : "",
                        }}
                      >
                        {prescriptionData?.vitalsAndBodyComposition &&
                          Object.values(
                            prescriptionData.vitalsAndBodyComposition
                          ).some((value) => value) && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Vitals
                              </div>
                              {renderItems("vitalsAndBodyComposition")}
                            </>
                          )}

                        {prescriptionData?.medicalHistory &&
                          prescriptionData.medicalHistory.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Medical History
                              </div>
                              {renderItems("medicalHistory")}
                            </>
                          )}

                        {prescriptionData?.symptoms &&
                          prescriptionData.symptoms.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Symptoms
                              </div>
                              {renderItems("symptoms")}
                            </>
                          )}

                        {prescriptionData?.examinations &&
                          prescriptionData.examinations.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Examinations
                              </div>
                              {renderItems("examinations")}
                            </>
                          )}

                        {prescriptionData?.diagnosis &&
                          prescriptionData.diagnosis.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Diagnosis
                              </div>
                              {renderItems("diagnosis")}
                            </>
                          )}

                        {prescriptionData?.medications &&
                          prescriptionData.medications.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Medicine
                              </div>
                              {renderItems("medications")}
                            </>
                          )}

                        {prescriptionData?.labInvestigation &&
                          prescriptionData.labInvestigation.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Lab Investigation
                              </div>
                              {renderItems("labInvestigation")}
                            </>
                          )}

                        {prescriptionData?.advice &&
                          prescriptionData.advice.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Advices
                              </div>
                              {renderItems("advice")}
                            </>
                          )}

                        {prescriptionData?.vaccinations &&
                          prescriptionData.vaccinations.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Vaccination
                              </div>
                              {renderItems("vaccinations")}
                            </>
                          )}
                        {prescriptionData?.others &&
                          prescriptionData.others.length > 0 && (
                            <>
                              <div className="title-digitise-section mb-2">
                                Others
                              </div>
                              {renderItems("others")}
                            </>
                          )}
                        {renderCustomModules()}
                        {prescriptionData?.followUp && (
                          <>
                            <div className="title-digitise-section mb-2">
                              Follow Up
                            </div>
                            {renderItems("followUp")}
                          </>
                        )}
                        {showInput && (
                          <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <Input
                                placeholder="Enter custom module name"
                                value={newModuleName}
                                onChange={(e) =>
                                  setNewModuleName(e.target.value)
                                }
                                className="custom-module-input"
                              />
                              <>
                                <CheckOutlined
                                  className="input-action-icon tick-icon"
                                  onClick={handleAddModule}
                                />
                                <CloseOutlined
                                  className="input-action-icon cross-icon"
                                  onClick={handleCancel}
                                />
                              </>
                            </div>
                            <div className="genRxCustomModuleBox"></div>
                          </>
                        )}
                        <div
                          className="cta-container mt-4 mb-4"
                          onClick={() => setShowInput(true)}
                        >
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            className="add-custom-module-link"
                          >
                            Add Custom Module
                          </Button>
                        </div>
                        <div className={styles.disclaimer}>
                          <span style={{ fontWeight: 500 }}>Disclaimer:</span>{" "}
                          Our AI model aims to be accurate, but sometimes it
                          might make mistakes. Please double-check all details
                          to ensure they are correct and complete.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {DELETE_MODULE_MODAL}
              <CommonModal
                isModalOpen={isBackModalOpen}
                onCancel={showHideBackModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                  <>
                    <div className="alert-warning rounded-10px p-2 patient-details">
                      <div className="d-flex align-items-center">
                        <img className="me-3" src={alertIcon} alt="Warning" />
                        <span>
                          Are you sure you want to leave? <br />
                          You will permanently lose your data.
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="d-flex align-items-center mt-2 justify-content-end">
                        <div
                          onClick={handleBack}
                          className="me-4 text-decoration-underline btn p-0 text-main"
                        >
                          Yes Leave
                        </div>
                        <Button
                          onClick={showHideBackModal}
                          className="lh-lg btn btn-primary3 btn-41 px-4"
                        >
                          <span>No, Stay</span>
                        </Button>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </>
      </Suspense>

      {visible && (
        <ExpiredSubModal
          title={S_VOICE_RX}
          styles={{
            mask: { marginLeft: showPrescription ? 0 : window.innerWidth - 640, marginTop: 60, background: 'rgba(0, 0, 0, 0.28)', backdropFilter: 'blur(2px)' },
            wrapper: { marginLeft: showPrescription ? 0 : window.innerWidth - 640, marginTop: 60, background: 'rgba(0, 0, 0, 0.28)' },
          }}
          isSubModalOpen={isSubModalOpen}
          showHideSubModal={showHideSubModal} />
      )}

    </Drawer>
  );
};

export default ConsultationDrawer;
