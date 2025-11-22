import React, { useState, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setTreatmentPlanData } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { useLocation } from "react-router-dom";
import { defaultIcons } from "../../../assets/images/icons";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentPlan = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { treatmentPlanData = {} } = useSelector((state) => state.assessment);

  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patientDetails } = state || {};

  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [
    autoFillTextToAppendPreventiveActions,
    setAutoFillTextToAppendPreventiveActions,
  ] = useState([]);
  const [
    autoFillTextToAppendDesiredOutcome,
    setAutoFillTextToAppendDesiredOutcome,
  ] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setTreatmentPlanData({ ...treatmentPlanData, [key]: data }));
  };

  const doctorId = patientDetails?.doctor?.id || null;

  const getFieldValue = useCallback(
    (key) => {
      const value = treatmentPlanData?.[key];
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
    [treatmentPlanData]
  );

  const usePlanTemplate = (moduleName, key) =>
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
          dispatch(setTreatmentPlanData({ ...treatmentPlanData, [key]: data }));
        },
        [dispatch, treatmentPlanData, key]
      ),
    });

  const immediateManagementTemplate = usePlanTemplate(
    "immediateManagement",
    "immediateManagement"
  );
  const desiredOutcomeTemplate = usePlanTemplate(
    "monitoringPlan",
    "desiredOutcome"
  );
  const preventiveActionsTemplate = usePlanTemplate(
    "preventiveActions",
    "preventiveActions"
  );
  const handleAIRecordingCompleteImmediateManagement = async (
    payload,
    callback
  ) => {
    const response = await dispatch(
      voiceRx({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        schemaKey: "ASSESSMENTS.treatmentPlan.immediateManagement",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: treatmentPlanData?.immediateManagement,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response
          ?.immediateManagement || [];
      if (!isEmptyRichText(updatedData)) {
        setAutoFillTextToAppend(updatedData);
        callback?.();
      } else {
        callback?.();
      }
    }
  };

  const handleAIRecordingCompletePreventiveActions = async (
    payload,
    callback
  ) => {
    const response = await dispatch(
      voiceRx({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        schemaKey: "ASSESSMENTS.treatmentPlan.preventiveActions",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: treatmentPlanData?.preventiveActions,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response
          ?.preventiveActions || [];
      if (!isEmptyRichText(updatedData)) {
        setAutoFillTextToAppendPreventiveActions(updatedData);
        callback?.();
      } else {
        callback?.();
      }
    }
  };

  const handleAIRecordingCompleteDesiredOutcome = async (payload, callback) => {
    const response = await dispatch(
      voiceRx({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        schemaKey: "ASSESSMENTS.treatmentPlan.desiredOutcome",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: treatmentPlanData?.desiredOutcome,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response
          ?.desiredOutcome || [];
      if (!isEmptyRichText(updatedData)) {
        setAutoFillTextToAppendDesiredOutcome(updatedData);
        callback?.();
      } else {
        callback?.();
      }
    }
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "immediateManagement":
                return renderImmediateManagement(item);
              case "desiredOutcome":
                return renderDesiredOutcome(item);
              case "preventiveActions":
                return renderPreventiveActions(item);
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
  };
  const renderImmediateManagement = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.immediateManagement))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={
          handleAIRecordingCompleteImmediateManagement
        }
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        templates={immediateManagementTemplate.templates}
        templateType="entries"
        showTempButtons={true}
        onTemplate={immediateManagementTemplate.refreshTemplates}
        onTemplateSelected={immediateManagementTemplate.handleTemplateSelected}
        addTemplate={immediateManagementTemplate.handleAddTemplate}
        updateTemplate={immediateManagementTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={
          immediateManagementTemplate.handleDeleteTemplate
        }
        loading={immediateManagementTemplate.templatesLoading}
        onChange={(data) => handleOthersChange(data, "immediateManagement")}
        initialValue={
          treatmentPlanData?.immediateManagement
            ? treatmentPlanData?.immediateManagement
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter immediate management like emergency interventions or initial treatment" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
            "immediateManagement"
          );
          setAutoFillTextToAppend(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppend}
        setNewAutoFillTextToAppend={setAutoFillTextToAppend}
        isDataPresent={!isEmptyRichText(treatmentPlanData?.immediateManagement)}
      />
    );
  };
  const renderPreventiveActions = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.preventiveActions))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingCompletePreventiveActions}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        templates={preventiveActionsTemplate.templates}
        templateType="entries"
        showTempButtons={true}
        onTemplate={preventiveActionsTemplate.refreshTemplates}
        onTemplateSelected={preventiveActionsTemplate.handleTemplateSelected}
        addTemplate={preventiveActionsTemplate.handleAddTemplate}
        updateTemplate={preventiveActionsTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={preventiveActionsTemplate.handleDeleteTemplate}
        loading={preventiveActionsTemplate.templatesLoading}
        onChange={(data) => handleOthersChange(data, "preventiveActions")}
        initialValue={
          treatmentPlanData?.preventiveActions
            ? treatmentPlanData?.preventiveActions
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter preventive actions like medications, interventions, or follow-up plans"
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
            "preventiveActions"
          );
          setAutoFillTextToAppendPreventiveActions(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppendPreventiveActions}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendPreventiveActions}
        isDataPresent={!isEmptyRichText(treatmentPlanData?.preventiveActions)}
      />
    );
  };

  const renderDesiredOutcome = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.desiredOutcome))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingCompleteDesiredOutcome}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        templates={desiredOutcomeTemplate.templates}
        templateType="entries"
        showTempButtons={true}
        onTemplate={desiredOutcomeTemplate.refreshTemplates}
        onTemplateSelected={desiredOutcomeTemplate.handleTemplateSelected}
        addTemplate={desiredOutcomeTemplate.handleAddTemplate}
        updateTemplate={desiredOutcomeTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={desiredOutcomeTemplate.handleDeleteTemplate}
        loading={desiredOutcomeTemplate.templatesLoading}
        onChange={(data) => handleOthersChange(data, "desiredOutcome")}
        initialValue={
          treatmentPlanData?.desiredOutcome
            ? treatmentPlanData?.desiredOutcome
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter desired outcome like expected recovery, complications, or follow-up plans"
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
            "desiredOutcome"
          );
          setAutoFillTextToAppendDesiredOutcome(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppendDesiredOutcome}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendDesiredOutcome}
        isDataPresent={!isEmptyRichText(treatmentPlanData?.desiredOutcome)}
      />
    );
  };

  if (
    !isEditable &&
    isEmptyRichText(treatmentPlanData?.desiredOutcome) &&
    isEmptyRichText(treatmentPlanData?.preventiveActions) &&
    isEmptyRichText(treatmentPlanData?.immediateManagement)
  )
    return null;

  return (
    <>
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
    </>
  );
};

export default TreatmentPlan;
