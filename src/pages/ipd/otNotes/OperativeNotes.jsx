import React, { useState, useCallback, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import { isEmptyRichText, hasNoData } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const OperativeNotes = (props) => {
  const { isEditable = true, sectionData, patientDetails = {} } = props || {};
  let { operativeNotes = {} } = useSelector((state) => state.otNotes);
  operativeNotes = props.operativeNotes || operativeNotes;
  const { profile } = useSelector((state) => state.doctors);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const doctorId =
    patientDetails?.doctor?.id || profile?.id || profile?.um_id || null;
  const handleChange = (value, key) => {
    dispatch(setOperativeNotes({ key, value }));
  };
  const defaultRichText = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );

  const getFieldValue = useCallback(
    (key) => {
      const value = props.operativeNotes?.[key] ?? operativeNotes?.[key];
      if (Array.isArray(value) && value.length) {
        return value;
      }
      if (value?.value && Array.isArray(value.value) && value.value.length) {
        return value.value;
      }
      return defaultRichText;
    },
    [operativeNotes, props.operativeNotes, defaultRichText]
  );

  const useOperativeTemplate = (moduleName, key) =>
    useTemplateManagement({
      moduleName,
      templateSite: "ipd",
      doctorId,
      isEditable,
      moduleType: "richText",
      getCurrentValue: useCallback(() => getFieldValue(key), [getFieldValue, key]),
      onValueChange: useCallback(
        (data) => {
          handleChange(data, key);
        },
        [handleChange, key]
      ),
    });

  const operativeFindingsTemplate = useOperativeTemplate(
    "operativeFindings",
    "operativeFindings"
  );
  const operativeProcedureTemplate = useOperativeTemplate(
    "operativeProcedure",
    "operativeProcedure"
  );
  const operativeAdditionalTemplate = useOperativeTemplate(
    "operativeAdditionalNotes",
    "operativeAdditionalNotes"
  );

  const templateMap = useMemo(
    () => ({
      operativeFindings: operativeFindingsTemplate,
      operativeProcedure: operativeProcedureTemplate,
      operativeAdditionalNotes: operativeAdditionalTemplate,
    }),
    [
      operativeFindingsTemplate,
      operativeProcedureTemplate,
      operativeAdditionalTemplate,
    ]
  );

  const renderRichTextEditorSection = (data) => {
    if (!isEditable && isEmptyRichText(operativeNotes?.[data?.id])) return null;
    const templateHandlers = templateMap[data?.id];
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={isEditable ? otNotesIcons[data?.id] : null}
        showAutoFill={false}
        onErase={() => {
          handleChange(defaultRichText, data?.id);
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [data?.id]: ["clear"],
          }));
        }}
        newAutoFillTextToAppend={autoFillTextToAppend[data?.id]}
        setNewAutoFillTextToAppend={(value) => {
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [data?.id]: value,
          }));
        }}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin" : ""
        }`}
        showMagicPenGif={false}
        showMicrophone={false}
        templates={templateHandlers?.templates}
        templateType={templateHandlers ? "entries" : undefined}
        showTempButtons={isEditable && !!templateHandlers}
        onTemplate={templateHandlers?.refreshTemplates}
        onTemplateSelected={templateHandlers?.handleTemplateSelected}
        addTemplate={templateHandlers?.handleAddTemplate}
        updateTemplate={templateHandlers?.handleUpdateTemplate}
        onDeleteTemplateClicked={templateHandlers?.handleDeleteTemplate}
        loading={templateHandlers?.templatesLoading}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          getFieldValue(data?.id)
        }
        placeholder={data?.placeholder}
        onSave={() => {}}
      />
    );
  };
  const renderChildren = () => {
    if (!isEditable)
      return (
        <ul>
          {sectionData?.children?.map((item) => {
            if (!isEditable && isEmptyRichText(operativeNotes?.[item?.id])) return null;
            return (
              <li key={item.id}>
                {renderRichTextEditorSection(item)}
              </li>
            )
          })}
        </ul>
      )
    return sectionData?.children?.map((item) => {
      return renderRichTextEditorSection(item);
    });
  };
  if (!sectionData) return null;
  if (!isEditable && hasNoData(operativeNotes)) {
    return null;
  }
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData?.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly ipdot-ion-readonly readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default OperativeNotes;
