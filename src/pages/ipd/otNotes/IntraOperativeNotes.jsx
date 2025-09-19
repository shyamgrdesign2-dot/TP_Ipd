import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setIntraOperativeNotes } from "../../../redux/ipd/otNotesSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const IntraOperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { intraOperativeNotes = {} } = useSelector((state) => state.otNotes);
  const dispatch = useDispatch();
  const handleChange = (value, key) => {
    dispatch(setIntraOperativeNotes({ key, value }));
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
        icon={defaultIcons[data?.id]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleChange(data, data?.id)}
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
        placeholder={
          data?.placeholder
        }
      />
    );
  };
  const renderChildren = () => {
    console.log('INTEL ==> sectionData', sectionData)
    return sectionData?.children?.map((item) => {
      return renderRichTextEditorSection(item);
    });
  };
  if (
    !isEditable &&
    !Object.values(intraOperativeNotes).some(value => value)
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

export default IntraOperativeNotes;
