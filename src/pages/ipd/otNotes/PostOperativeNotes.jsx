import React, { useState,  useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setPostOperativeNotes } from "../../../redux/ipd/otNotesSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const PostOperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { postOperativeNotes = {} } = useSelector((state) => state.otNotes);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const handleChange = (value, key) => {
    dispatch(setPostOperativeNotes({ key, value }));
  };
  const renderRichTextEditorSection = (data) => {
    if (!isEditable && !postOperativeNotes?.[data?.id]) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.id]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        showMagicPenGif={false}
        onErase={() => {
          setAutoFillTextToAppend(prev => ({
            ...prev,
            [data?.id]: ["clear"]
          }));
        }}
        newAutoFillTextToAppend={autoFillTextToAppend[data?.id]}
        setNewAutoFillTextToAppend={(value) => {
          setAutoFillTextToAppend(prev => ({
            ...prev,
            [data?.id]: value
          }));
        }}
        showMicrophone={false}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          postOperativeNotes?.[data?.id]?.value?.length
            ? postOperativeNotes?.[data?.id]?.value
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          data?.placeholder
        }
      />
    );
  };
  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      if (item?.children) {
        return (
          <div>wowow</div>
        )
      }
      return renderRichTextEditorSection(item);
    });
  };
  if (
    !isEditable &&
    !Object.values(postOperativeNotes).some(value => value)
  )
    return null;
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${isEditable ? "" : "collapsible-wrapper-class-readonly"}`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default PostOperativeNotes;
