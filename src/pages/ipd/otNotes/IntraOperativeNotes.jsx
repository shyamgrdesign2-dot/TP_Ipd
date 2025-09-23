import React, { useState, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setIntraOperativeNotes } from "../../../redux/ipd/otNotesSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const UnitInput = createRemoteComponent("UnitInput");

const IntraOperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { intraOperativeNotes = {} } = useSelector((state) => state.otNotes);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const handleChange = (value, key, parentId = null) => {
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
        icon={otNotesIcons[data?.id]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
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
          intraOperativeNotes?.[data?.id]?.value?.length
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
  const renderChildren = () => {
    return sectionData?.children
      ?.filter((item) => item.enabled)
      ?.map((item) => {
        if (item?.children) {
          return (
            <div className="ipd-ot-notes-section-container">
              {item?.title && (
                <div className="ipd-ot-notes-section-title">{item?.title}</div>
              )}
              <div className="ipd-ot-notes-section-children-container">
                {item?.children
                  ?.filter((item) => item.enabled)
                  ?.map((subItem) => {
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
        }
        return renderRichTextEditorSection(item);
      });
  };
  if (!isEditable && !Object.values(intraOperativeNotes).some((value) => value))
    return null;
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={otNotesIcons[`${sectionData?.id}Dark`]}
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

export default IntraOperativeNotes;
