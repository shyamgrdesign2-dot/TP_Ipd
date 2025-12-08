import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { Radio } from "antd";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useCheckExaminationData from "../../../hooks/useCheckExaminationData";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import { setPhysicalExaminationBasicData } from "../../../redux/ipd/consultantNotesSlice";
import { useLocation } from "react-router-dom";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const RichTextEditor = createRemoteComponent("RichTextEditor");
const CNExaminationSection = (props) => {
  const {
    isEditable = true,
    sectionData,
    examinationData = null,
  } = props || {};
  const { physicalExaminationBasicData = {} } = useSelector((state) => state.consultantNotes);
  const { state } = useLocation();
  const { patientDetails: locationPatientDetails } = state || {};
  const patientDetails = locationPatientDetails || {};
  const patientId = patientDetails?.details?.id;
  const admissionId = patientDetails?.admissionId;
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId,
    admissionId,
  });
  const dispatch = useDispatch();
  const checkReadableExaminationDataPresent = useCheckExaminationData(examinationData);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [disableFocusEffect, setDisableFocusEffect] = useState({});
  const defaultNotes = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );

  // Helper function to normalize value to match option value type
  const normalizeRadioValue = useCallback((value, options) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      return value;
    }
    // Get the type of the first option's value
    const firstOptionValue = options[0]?.value;
    if (firstOptionValue === undefined || firstOptionValue === null) {
      return value;
    }
    const optionValueType = typeof firstOptionValue;
    // Convert value to match option value type
    if (optionValueType === 'number') {
      const numValue = Number(value);
      return isNaN(numValue) ? undefined : numValue;
    } else if (optionValueType === 'string') {
      return String(value);
    }
    return value;
  }, []);

  // Use ref to store the latest physicalExaminationBasicData to prevent callback recreation
  const physicalExaminationBasicDataRef = useRef(physicalExaminationBasicData);
  useEffect(() => {
    physicalExaminationBasicDataRef.current = physicalExaminationBasicData;
  }, [physicalExaminationBasicData]);

  // Stable callback for radio change - uses ref to access latest state
  const onExaminationRadioChange = useCallback((e, item) => {
    const { id } = item;
    const normalizedValue = normalizeRadioValue(e.target.value, item.options);
    const currentState = physicalExaminationBasicDataRef.current;
    dispatch(
      setPhysicalExaminationBasicData({
        ...currentState,
        [id]: {
          ...currentState[id],
          value: normalizedValue,
          title: item.options.find((option) => option.value === normalizedValue)
            ?.label,
        },
      })
    );
  }, [dispatch, normalizeRadioValue]);

  // Stable callback for notes change - uses ref to access latest state
  const handleExaminationNotesChange = useCallback((data, id) => {
    const currentState = physicalExaminationBasicDataRef.current;
    dispatch(
      setPhysicalExaminationBasicData({
        ...currentState,
        [id]: { ...currentState[id], notes: data },
      })
    );
  }, [dispatch]);

  // Store stable callback in ref for use in map callbacks
  const handleExaminationNotesChangeRef = useRef(handleExaminationNotesChange);
  useEffect(() => {
    handleExaminationNotesChangeRef.current = handleExaminationNotesChange;
  }, [handleExaminationNotesChange]);

  const handleAIRecordingComplete = useCallback(
    (itemId, payload, callback) => {
      submitVoiceAiRecording({
        payload,
        schemaKey: `CONSULTANT_NOTES.physicalExamination.examination.${itemId}.notes`,
        previousOutput: physicalExaminationBasicData?.[itemId]?.notes,
        selector: (data) => data?.notes || data,
        onSuccess: (updatedNotes) => {
          if (!isEmptyRichText(updatedNotes)) {
            dispatch(
              setPhysicalExaminationBasicData({
                ...physicalExaminationBasicData,
                [itemId]: {
                  ...physicalExaminationBasicData[itemId],
                  notes: updatedNotes,
                },
              })
            );
          }
        },
        callback,
      });
    },
    [dispatch, physicalExaminationBasicData, submitVoiceAiRecording]
  );

  const renderReadOnlyExamination = () => {
    return (
      <div
        className={`ipdaf-examination-readonly ${
          false ? "box-with-padding" : ""
        }`}
      >
        <ul>
          {sectionData?.children
            ?.filter((item) => item.enabled)
            .map((item) => {
              const data = examinationData[item.id];
              if (
                !data?.title &&
                ((data?.value === undefined || data?.value == null || data?.value === 0) &&
                  isEmptyRichText(data?.notes))
              )
                return null;

              return (
                <li key={item.id} className="examination-item">
                  <span className="examination-label">{item.title}:</span>{" "}
                  {data.title}
                  {!isEmptyRichText(data?.notes) && (
                    <div className="ipdaf-exam-read-notes-container">
                      <li className="ipdaf-exam-read-notes-heading">Notes:</li>
                      <RichTextEditor
                        showActionBtns={false}
                        showAutoFill={false}
                        showMagicPenGif={false}
                        showMicrophone={false}
                        showToolbar={false}
                        readOnly={true}
                        initialValue={data.notes}
                      />
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    );
  };

  const handleEraseDataFromRichTextEditor = (item) => {
    setDisableFocusEffect((prev) => ({
      ...prev,
      [item?.id]: true,
    }));
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      [item?.id]: ["clear"],
    }));
    setTimeout(() => {
      setDisableFocusEffect((prev) => ({
        ...prev,
        [item?.id]: false,
      }));
    }, 100);
  };

  // Memoize initial values for each item to prevent new references on every render
  const itemInitialValues = useMemo(() => {
    const values = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        const notes = physicalExaminationBasicData[item.id]?.notes;
        values[item.id] =
          Array.isArray(notes) && notes.length
            ? notes
            : defaultNotes;
      });
    return values;
  }, [physicalExaminationBasicData, sectionData, defaultNotes]);

  // Stable onChange callbacks for each item
  const itemOnChangeCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = (data) => {
          handleExaminationNotesChangeRef.current(data, item.id);
        };
      });
    return callbacks;
  }, [sectionData]);

  // Stable onErase callbacks for each item
  const itemOnEraseCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = () => handleEraseDataFromRichTextEditor(item);
      });
    return callbacks;
  }, [sectionData]);

  // Stable setNewAutoFillTextToAppend callbacks for each item
  const itemSetAutoFillCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = (value) => {
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [item?.id]: value,
          }));
        };
      });
    return callbacks;
  }, [sectionData]);

  // Memoize radio values for each item
  const itemRadioValues = useMemo(() => {
    const values = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        values[item.id] = normalizeRadioValue(
          physicalExaminationBasicData[item.id]?.value,
          item.options
        );
      });
    return values;
  }, [physicalExaminationBasicData, sectionData, normalizeRadioValue]);

  const renderEditableExamination = useMemo(() => {
    return (
      <div className="examinations-parent-container">
        {sectionData?.children
          ?.filter((item) => item.enabled)
          .map((item) => {
            return (
              <RichTextEditWrapper
                key={item.id}
                readOnly={!isEditable}
                showToolbar={isEditable}
                showActionBtns={false}
                onErase={itemOnEraseCallbacks[item.id]}
                newAutoFillTextToAppend={autoFillTextToAppend[item?.id]}
                setNewAutoFillTextToAppend={itemSetAutoFillCallbacks[item.id]}
                toolbarClass={"small-toolbar"}
                showAutoFill={false}
                disableFocusEffect={disableFocusEffect[item?.id]}
                showVoiceAI={isEditable && patientId && admissionId}
                showMicrophone={true}
                size={"small"}
                voiceAiIcon={defaultAssetIcons.voiceAiIcon}
                onVoiceAIRecordingComplete={(payload, callback) =>
                  handleAIRecordingComplete(item.id, payload, callback)
                }
                placeholder={"Additional notes if any"}
                containerClass="wrapper-class examination-rich-container"
                onChange={itemOnChangeCallbacks[item.id]}
                initialValue={itemInitialValues[item.id]}
              >
                <div
                  className="examination-container-header"
                  data-testid={`examination-radio-${item.id}`}
                >
                  <div className="examination-header">{item.title} : </div>
                  <Radio.Group
                    className="exam-radio-text"
                    onChange={(e) => onExaminationRadioChange(e, item)}
                    value={itemRadioValues[item.id]}
                    options={item.options}
                  />
                </div>
              </RichTextEditWrapper>
            );
          })}
      </div>
    );
  }, [
    sectionData,
    isEditable,
    autoFillTextToAppend,
    disableFocusEffect,
    itemOnChangeCallbacks,
    itemOnEraseCallbacks,
    itemSetAutoFillCallbacks,
    itemInitialValues,
    itemRadioValues,
    onExaminationRadioChange,
  ]);

  const renderExaminationSection = () => {
    return isEditable
      ? renderEditableExamination
      : renderReadOnlyExamination();
  };

  if (!isEditable && !checkReadableExaminationDataPresent) return null;
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showOnlyClear={isEditable}
      isDataPresent={Object.keys(physicalExaminationBasicData)?.length}
      onErase={(e) => {
        dispatch(setPhysicalExaminationBasicData({}));
        sectionData?.children
          ?.filter((item) => item.enabled)
          ?.forEach((item) => {
            handleEraseDataFromRichTextEditor(item);
          });
      }}
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      showMagicPenGif={false}
      showVoiceAI={false}
      showMicrophone={false}
      placeholder={"Additional notes if any"}
      containerClass={`examination-rich-container ${
        !isEditable ? "examination-rich-readonly-container" : ""
      } ${!isEditable ? "consultant-notes-examination-container" : ""}`}
      renderBody={renderExaminationSection}
    />
  );
};

export default CNExaminationSection;
