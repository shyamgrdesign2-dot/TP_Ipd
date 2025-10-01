import React from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector } from "react-redux";
import "./styles.scss";
import { isEmptyRichText } from "../../../../utils/utils";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const SurgeriesPerformed = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeriesPerformed } = useSelector((state) => state.dischargeSummary);

  if (!isEditable && isEmptyRichText(surgeriesPerformed)) return null;

  return (
    <RichTextEditWrapper
      readOnly={true}
      showToolbar={true}
      showActionBtns={false}
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width="100%"
      containerClass={`wrapper-class ipd-provisional-diagnosis-wrapper ${
        !isEditable ? "ipd-wrapper-class-readonly" : ""
      }`}
      showAutoFill={false}
      renderBody={() => {
        return (
          <div className="empty-surgeries-performed-container">
            -No <strong> OT notes </strong> available. Once you{" "}
            <strong> start adding OT notes </strong>, the surgery name & date
            will automatically show here.
          </div>
        );
      }}
    />
  );
};

export default SurgeriesPerformed;
