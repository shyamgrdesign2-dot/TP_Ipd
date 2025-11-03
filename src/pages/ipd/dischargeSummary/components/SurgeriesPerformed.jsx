import React from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector } from "react-redux";
import "./styles.scss";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const SurgeriesPerformed = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { dischargeSummaryData } = useSelector((state) => state.dischargeSummary);
  const surgeriesPerformed = dischargeSummaryData?.surgeriesPerformed || [];

  if (!isEditable && (!surgeriesPerformed || surgeriesPerformed.length === 0)) return null;

  

  return (
    <RichTextEditWrapper
      readOnly={true}
      showToolbar={true}
      showActionBtns={false}
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width="100%"
      containerClass={`ipd-provisional-diagnosis-wrapper ${
        !isEditable ? "ipd-wrapper-class-readonly" : ""
      }`}
      showAutoFill={false}
      renderBody={() => {
        if (surgeriesPerformed?.length) {
          return (
            <ul className="dx-summary">
              {surgeriesPerformed?.map((surgery) => {
                return (
                  <li className="dx-summary-item" key={surgery.otNoteId}>
                    <span className="dx-summary-title lightweight">
                      {surgery.procedureName} ({surgery.surgeryDate})
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }
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
