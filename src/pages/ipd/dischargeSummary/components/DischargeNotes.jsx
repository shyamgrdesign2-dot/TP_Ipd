import React, { useCallback, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import Vitals from "../../assessmentForm/Vitals";
import { isEmptyRichText } from "../../../../utils/utils";
import { setPatientCondition } from "../../../../redux/ipd/dischargeSummarySlice";
import CurrentMedications from "../../assessmentForm/CurrentMedications";
import { useTemplateManagement } from "../../../../hooks/useTemplateManagement";
import { defaultIcons as defaultAssetIcons } from "../../../../assets/images/icons";
import { useVoiceAiRecordingComplete } from "../../../../hooks/useVoiceAiRecordingComplete";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DischargeNotes = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientId: patientIdProp = null,
    admissionId: admissionIdProp = null,
  } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const EMPTY_RICH_TEXT_VALUE = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  // Template management for patientCondition using the hook
  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id;
  const resolvedPatientId =
    patientIdProp ||
    dischargeSummaryData?.patientInformation?.patientId ||
    dischargeSummaryData?.patientInformation?.id ||
    null;
  const resolvedAdmissionId =
    admissionIdProp ||
    dischargeSummaryData?.patientInformation?.admissionId ||
    null;
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: resolvedPatientId,
    admissionId: resolvedAdmissionId,
  });

  // Helper to get current value
  const getCurrentPatientConditionValue = useCallback(() => {
    const patientCondition = dischargeSummaryData?.patientCondition;
    if (isEmptyRichText(patientCondition)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    return Array.isArray(patientCondition) && patientCondition.length
      ? patientCondition
      : EMPTY_RICH_TEXT_VALUE;
  }, [dischargeSummaryData?.patientCondition]);

  // Use template management hook
  const {
    templates: normalizedPatientConditionTemplates,
    templatesLoading,
    handleTemplateSelected: handlePatientConditionTemplateSelected,
    handleAddTemplate: handlePatientConditionAddTemplate,
    handleUpdateTemplate: handlePatientConditionUpdateTemplate,
    handleDeleteTemplate: handlePatientConditionDeleteTemplate,
    refreshTemplates: refreshPatientConditionTemplates,
  } = useTemplateManagement({
    moduleName: "patientConditionDuringDischarge",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: getCurrentPatientConditionValue,
    onValueChange: useCallback(
      (data) => {
        dispatch(setPatientCondition(data));
      },
      [dispatch]
    ),
  });

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "DISRCHARGED_SUMMARY.dischargeNotes.patientCondition",
        previousOutput: dischargeSummaryData?.patientCondition,
        onSuccess: (updatedData) => {
          if (!isEmptyRichText(updatedData)) {
            dispatch(setPatientCondition(updatedData));
          }
        },
        callback,
      }),
    [dischargeSummaryData?.patientCondition, dispatch, submitVoiceAiRecording]
  );

  const handlePatientConditionChange = (data) => {
    dispatch(setPatientCondition(data));
  };

  const renderPatientCondition = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.patientCondition))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={` ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="15 Jun 2025"
        showVoiceAI={isEditable && resolvedPatientId && resolvedAdmissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingComplete}
        onChange={handlePatientConditionChange}
        initialValue={
          !isEmptyRichText(dischargeSummaryData?.patientCondition)
            ? dischargeSummaryData?.patientCondition
            : EMPTY_RICH_TEXT_VALUE
        }
        placeholder={data?.placeholder || "Enter Patient Condition"}
        templates={normalizedPatientConditionTemplates}
        templateType="entries"
        showTempButtons={true}
        onSave={() => {}}
        onTemplate={refreshPatientConditionTemplates}
        onTemplateSelected={handlePatientConditionTemplateSelected}
        addTemplate={handlePatientConditionAddTemplate}
        updateTemplate={handlePatientConditionUpdateTemplate}
        onDeleteTemplateClicked={handlePatientConditionDeleteTemplate}
        loading={templatesLoading}
        data={getCurrentPatientConditionValue()}
        onErase={() => {
          dispatch(setPatientCondition(EMPTY_RICH_TEXT_VALUE));
          setAutoFillTextToAppend(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppend}
        setNewAutoFillTextToAppend={setAutoFillTextToAppend}
        isDataPresent={!isEmptyRichText(dischargeSummaryData?.patientCondition)}
      />
    );
  };

  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "dischargeVitals":
                return (
                  <Vitals
                    isEditable={true}
                    {...props}
                    formName="dischargeSummary"
                    sectionData={item}
                  />
                );
              case "patientCondition":
                return renderPatientCondition(item);
              case "dischargeMedications":
                return (
                  <CurrentMedications
                    isDischargeSummary={true}
                    {...props}
                    sectionData={item}
                  />
                );
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={
          sectionData?.id
            ? dischargeSummaryIcons[`${sectionData.id}Dark`]
            : null
        }
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default DischargeNotes;
