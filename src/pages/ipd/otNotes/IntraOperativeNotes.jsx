import React, { useState, useCallback, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setIntraOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import "./styles.scss";
import { isEmptyRichText, hasNoData } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const UnitInput = createRemoteComponent("UnitInput");

export const MetricsList = ({ sectionData, data }) => {
  return (
    <div className="ipdot-ion-metrics-container">
      <div className="ipdot-ion-metrics-title">{"Metrics"}</div>
      <ul className="ipdot-ion-metrics-list">
        {sectionData?.map((section) => {
          return (
            <>
              {data?.[section.id] ? (
                <li>
                  <span className="ipdot-ion-metrics-list-label">
                    {section.title}
                  </span>{" "}
                  :{" "}
                  <span className="ipdot-ion-metrics-list-value">
                    {data?.[section.id]}
                  </span>
                </li>
              ) : null}
            </>
          );
        })}
      </ul>
    </div>
  );
};

const IntraOperativeNotes = (props) => {
  const { isEditable = true, sectionData, patientDetails = {} } = props || {};
  let { intraOperativeNotes = {} } = useSelector((state) => state.otNotes);
  intraOperativeNotes = props?.intraOperativeNotes || intraOperativeNotes;
  const { profile } = useSelector((state) => state.doctors);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const doctorId =
    patientDetails?.doctor?.id || profile?.id || profile?.um_id || null;
  const handleChange = (value, key, parentId = null) => {
    if (!isEditable) return;
    dispatch(setIntraOperativeNotes({ key, value, parentId }));
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
      const value = props.intraOperativeNotes?.[key] ?? intraOperativeNotes?.[key];
      if (Array.isArray(value) && value.length) {
        return value;
      }
      if (value?.value && Array.isArray(value.value) && value.value.length) {
        return value.value;
      }
      return defaultRichText;
    },
    [intraOperativeNotes, props.intraOperativeNotes, defaultRichText]
  );

  const useIntraTemplate = (moduleName, key) =>
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

  const complicationTemplate = useIntraTemplate(
    "complicationSeverity",
    "complicationSeverity"
  );
  const specimensTemplate = useIntraTemplate("specimensSent", "specimensSent");
  const implantsTemplate = useIntraTemplate(
    "implantsProstheticsUsed",
    "implantsProstheticsUsed"
  );

  const templateMap = useMemo(
    () => ({
      complicationSeverity: complicationTemplate,
      specimensSent: specimensTemplate,
      implantsProstheticsUsed: implantsTemplate,
    }),
    [complicationTemplate, specimensTemplate, implantsTemplate]
  );
  const renderRichTextEditorSection = (data) => {
    if (!isEditable && isEmptyRichText(intraOperativeNotes?.[data?.id]))
      return null;
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
        containerClass={`wrapper-class ${
          !isEditable
            ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
            : ""
        }`}
        showMagicPenGif={false}
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
        initialValue={getFieldValue(data?.id)}
        onSave={() => {}}
        placeholder={data?.placeholder}
      />
    );
  };

  const renderEditableMetrics = (item, enabledChildItems) => {
    return (
      <div className="ipd-ot-notes-section-container">
        {item?.title && (
          <div className="ipd-ot-notes-section-title">{item?.title}</div>
        )}
        <div className="ipd-ot-notes-section-children-container">
          {enabledChildItems?.map((subItem) => {
            return (
              <div
                className="ipd-ot-notes-section-children-item"
                key={subItem.id}
              >
                <UnitInput
                  key={subItem.id}
                  containerStyle={{ marginBottom: "20px" }}
                  onChange={(e) => handleChange(e, subItem.id, item.id)}
                  value={intraOperativeNotes?.[item.id]?.[subItem.id]}
                  type="text"
                  inputMode="text"
                  label={subItem.label}
                  unit={subItem?.unit || null}
                  {...subItem}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const renderChildren = () => {
    const enabledItems = sectionData?.children?.filter((item) => item.enabled);
    if (!isEditable) {
      return (
        <ul>
          {enabledItems?.map((item) => {
            if (item?.children) {
              const enabledChildItems = item?.children?.filter(
                (item) => item.enabled
              );
              if (
                enabledChildItems?.length > 0 &&
                enabledChildItems?.some(
                  (item) => item.id && !!intraOperativeNotes?.[item.id]
                )
              ) {
                return (
                  <li key={item.id}>
                    <MetricsList
                      sectionData={enabledChildItems}
                      data={intraOperativeNotes}
                    />
                  </li>
                );
              }
            }
            if (!isEditable && isEmptyRichText(intraOperativeNotes?.[item?.id]))
              return null;
            return <li key={item.id}>{renderRichTextEditorSection(item)}</li>;
          })}
        </ul>
      );
    }
    return enabledItems?.map((item) => {
      if (item?.children) {
        const enabledChildItems = item?.children?.filter(
          (item) => item.enabled
        );
        if (enabledChildItems?.length > 0) {
          return renderEditableMetrics(item, enabledChildItems);
        }
      }
      return renderRichTextEditorSection(item);
    });
  };
  if (!sectionData) return null;
  if (!isEditable && hasNoData(intraOperativeNotes)) {
    return null;
  }
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable
            ? ""
            : "collapsible-wrapper-class-readonly ipdot-ion-readonly readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default IntraOperativeNotes;
