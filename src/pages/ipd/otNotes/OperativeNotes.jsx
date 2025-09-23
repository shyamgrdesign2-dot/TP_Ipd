import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setOperativeNotes } from "../../../redux/ipd/otNotesSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const OperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { operativeNotes = {} } = useSelector((state) => state.otNotes);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const handleChange = (value, key) => {
    dispatch(setOperativeNotes({ key, value }));
  };
  const renderRichTextEditorSection = (data) => {
    if (!isEditable && !operativeNotes?.[data?.id]) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={otNotesIcons[data?.id]}
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
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          operativeNotes?.[data?.id]?.value?.length
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
    return sectionData?.children?.map((item) => {
      return renderRichTextEditorSection(item);
    });
  };
  if (!isEditable && !Object.values(operativeNotes).some((value) => value))
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

export default OperativeNotes;
