import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import { isEmptyRichText } from "../../../utils/utils";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const OperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  let { operativeNotes = {} } = useSelector((state) => state.otNotes);
  operativeNotes = props.operativeNotes || operativeNotes;
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const handleChange = (value, key) => {
    dispatch(setOperativeNotes({ key, value }));
  };
  const renderRichTextEditorSection = (data) => {
    if (!isEditable && isEmptyRichText(operativeNotes?.[data?.id])) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={isEditable ? otNotesIcons[data?.id]: null}
        showAutoFill={false}
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
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin" : ""
        }`}
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          props.operativeNotes?.[data?.id]?.length ? operativeNotes?.[data?.id] : operativeNotes?.[data?.id]?.value?.length
            ? operativeNotes?.[data?.id]?.value
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
  if (!isEditable && !Object.values(operativeNotes).some((value) => value))
    return null;
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
