import React, { useState, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setIntraOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import "./styles.scss";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const UnitInput = createRemoteComponent("UnitInput");

const MetricsList = ({ enabledChildItems, intraOperativeNotes }) => {
  return (
    <div className="ipdot-ion-metrics-container">
      <div className="ipdot-ion-metrics-title">{"Metrics"}</div>
      <ul className="ipdot-ion-metrics-list">
        {enabledChildItems?.map((enabledItem) => {
          return (
            <>
              {intraOperativeNotes?.[enabledItem.id] && (
                <li>
                  <span className="ipdot-ion-metrics-list-label">
                    {enabledItem.title}
                  </span>{" "}
                  :{" "}
                  <span className="ipdot-ion-metrics-list-value">
                    {intraOperativeNotes?.[enabledItem.id]}
                  </span>
                </li>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
};

const IntraOperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  let { intraOperativeNotes = {} } = useSelector((state) => state.otNotes);
  intraOperativeNotes = props?.intraOperativeNotes || intraOperativeNotes;
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const handleChange = (value, key, parentId = null) => {
    if (!isEditable) return;
    dispatch(setIntraOperativeNotes({ key, value, parentId }));
  };
  const renderRichTextEditorSection = (data) => {
    if (!isEditable && !intraOperativeNotes?.[data?.id]) return null;
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
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          props.intraOperativeNotes?.[data?.id]?.length
            ? props.intraOperativeNotes?.[data?.id]
            : intraOperativeNotes?.[data?.id]?.value?.length
            ? intraOperativeNotes?.[data?.id]?.value
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
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
                  type="number"
                  inputMode="decimal"
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
              if (enabledChildItems?.length > 0) {
                return (
                  <li key={item.id}>
                    <MetricsList
                      enabledChildItems={enabledChildItems}
                      intraOperativeNotes={intraOperativeNotes}
                    />
                  </li>
                );
              }
            }
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
  if (!isEditable && !Object.values(intraOperativeNotes).some((value) => value))
    return null;
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
