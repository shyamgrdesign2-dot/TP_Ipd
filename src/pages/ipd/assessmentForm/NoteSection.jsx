import React, { useState, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalNotesData } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { useLocation } from "react-router-dom";
import { defaultIcons } from "../../../assets/images/icons";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const NoteSection = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [
    autoFillTextToAppendDischargeCriteria,
    setAutoFillTextToAppendDischargeCriteria,
  ] = useState([]);
  const { additionalNotesData = {} } = useSelector((state) => state.assessment);

  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
  });

  const handleOthersChange = (data, key) => {
    dispatch(setAdditionalNotesData({ ...additionalNotesData, [key]: data }));
  };

  const doctorId = patientDetails?.doctor?.id || null;

  const getFieldValue = useCallback(
    (key) => {
      const value = additionalNotesData?.[key];
      if (isEmptyRichText(value)) {
        return [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];
      }
      return value;
    },
    [additionalNotesData]
  );

  const useNoteTemplate = (moduleName, key) =>
    useTemplateManagement({
      moduleName,
      templateSite: "ipd",
      doctorId,
      isEditable,
      moduleType: "richText",
      getCurrentValue: useCallback(
        () => getFieldValue(key),
        [getFieldValue, key]
      ),
      onValueChange: useCallback(
        (data) => {
          dispatch(
            setAdditionalNotesData({ ...additionalNotesData, [key]: data })
          );
        },
        [dispatch, additionalNotesData, key]
      ),
    });

  const specialInstructionsTemplate = useNoteTemplate(
    "specialInstructions",
    "specialInstructions"
  );
  const dischargeCriteriaTemplate = useNoteTemplate(
    "dischargeCriteria",
    "dischargeCriteria"
  );

  const handleAIRecordingCompleteSpecialInstructions = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "ASSESSMENTS.additionalNotes.specialInstructions",
        previousOutput: additionalNotesData?.specialInstructions,
        onSuccess: (updatedData) => {
          if (!isEmptyRichText(updatedData)) {
            handleOthersChange(updatedData, "specialInstructions");
          }
        },
        callback,
      }),
    [additionalNotesData, submitVoiceAiRecording]
  );

  const handleAIRecordingCompleteDischargeCriteria = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "ASSESSMENTS.additionalNotes.dischargeCriteria",
        previousOutput: additionalNotesData?.dischargeCriteria,
        onSuccess: (updatedData) => {
          if (!isEmptyRichText(updatedData)) {
            // setAutoFillTextToAppendDischargeCriteria(updatedData);
            handleOthersChange(updatedData, "dischargeCriteria");
          }
        },
        callback,
      }),
    [additionalNotesData, submitVoiceAiRecording]
  );
  const renderSpecialInstructions = (data) => {
    if (
      !isEditable &&
      isEmptyRichText(additionalNotesData?.specialInstructions)
    )
      return null;
    return (
      <RichTextEditWrapper
        key={data?.title}
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={
          handleAIRecordingCompleteSpecialInstructions
        }
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        templates={specialInstructionsTemplate.templates}
        templateType="entries"
        showTempButtons={true}
        onTemplate={specialInstructionsTemplate.refreshTemplates}
        onTemplateSelected={specialInstructionsTemplate.handleTemplateSelected}
        addTemplate={specialInstructionsTemplate.handleAddTemplate}
        updateTemplate={specialInstructionsTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={
          specialInstructionsTemplate.handleDeleteTemplate
        }
        loading={specialInstructionsTemplate.templatesLoading}
        onChange={(data) => handleOthersChange(data, "specialInstructions")}
        initialValue={
          additionalNotesData?.specialInstructions
            ? additionalNotesData?.specialInstructions
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter Special Instructions, Precautions or Additional Notes" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
        }
        onSave={() => {}}
        onErase={() => {
          handleOthersChange(
            [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
            "specialInstructions"
          );
          setAutoFillTextToAppend(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppend}
        setNewAutoFillTextToAppend={setAutoFillTextToAppend}
        isDataPresent={
          !isEmptyRichText(additionalNotesData?.specialInstructions)
        }
      />
    );
  };
  const renderDischargeCriteria = (data) => {
    if (!isEditable && isEmptyRichText(additionalNotesData?.dischargeCriteria))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        key={data?.title}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingCompleteDischargeCriteria}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        templates={dischargeCriteriaTemplate.templates}
        templateType="entries"
        showTempButtons={true}
        onTemplate={dischargeCriteriaTemplate.refreshTemplates}
        onTemplateSelected={dischargeCriteriaTemplate.handleTemplateSelected}
        addTemplate={dischargeCriteriaTemplate.handleAddTemplate}
        updateTemplate={dischargeCriteriaTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={dischargeCriteriaTemplate.handleDeleteTemplate}
        loading={dischargeCriteriaTemplate.templatesLoading}
        onChange={(data) => handleOthersChange(data, "dischargeCriteria")}
        initialValue={
          additionalNotesData?.dischargeCriteria
            ? additionalNotesData?.dischargeCriteria
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter discharge criteria like stable vitals, afebrile status etc"
        }
        onSave={() => {}}
        onErase={() => {
          handleOthersChange(
            [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
            "dischargeCriteria"
          );
          setAutoFillTextToAppendDischargeCriteria(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppendDischargeCriteria}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendDischargeCriteria}
        isDataPresent={!isEmptyRichText(additionalNotesData?.dischargeCriteria)}
      />
    );
  };
  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      switch (item?.id) {
        case "specialInstructions":
          return renderSpecialInstructions(item);
        case "dischargeCriteria":
          return renderDischargeCriteria(item);
        default:
          return null;
      }
    });
  };
  if (
    !isEditable &&
    isEmptyRichText(additionalNotesData?.dischargeCriteria) &&
    isEmptyRichText(additionalNotesData?.specialInstructions)
  )
    return null;
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default NoteSection;
