import React from "react";
import "./SurgeryDetails.scss";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import defaultIcons from "../../../../assets/images/indices";
import { isEmptyRichText } from "../../../../utils/utils";
const RichTextEditor = createRemoteComponent("RichTextEditor");
const SurgeryDetails = ({ surgeryDetails, id }) => {
  if (!surgeryDetails) return null;

  const SURGERY_DETAILS_MAP = {
    procedureName: "Surgery/Procedure Name",
    anaesthesiaType: "Anaesthesia Type",
    diagnosis: "Diagnosis",
  };
  return (
    <section
      className="surgery-card"
      aria-labelledby="surgery-card-title"
      key={id}
    >
      <div className="surgery-card__title-row">
        {/* <span className="surgery-card__bullet-dot" aria-hidden /> */}
        <img src={defaultIcons[`${id}Pc`]} alt="surgery-card-title" />
        <h3 id="surgery-card-title" className="surgery-card__title">
          Surgery Details
        </h3>
      </div>

      <ul className="surgery-card__list">
        {Object.keys(SURGERY_DETAILS_MAP)?.map((detail) => {
          if (typeof surgeryDetails[detail] === "string") {
            return (
              <li className="surgery-card__item">
                <span className="surgery-card__label">
                  {SURGERY_DETAILS_MAP[detail]}:
                </span>{" "}
                <span className="surgery-card__value">
                  {surgeryDetails[detail]}
                </span>
              </li>
            );
          }
          if (
            surgeryDetails[detail]?.[0]?.children
          ) {
            if(isEmptyRichText(surgeryDetails[detail])) {
              return null;
            }
            return (
              <li className="surgery-card__item">
                <div className="d-flex">
                  <span className="surgery-card__label">
                    {SURGERY_DETAILS_MAP[detail]}:
                  </span>{" "}
                  <RichTextEditor
                    showActionBtns={false}
                    showAutoFill={false}
                    showMagicPenGif={false}
                    showMicrophone={false}
                    showToolbar={false}
                    readOnly={true}
                    className={"rich-text-editor-container-readonly"}
                    initialValue={surgeryDetails[detail]}
                  />
                </div>
              </li>
            );
          }
          return (
            <li className="surgery-card__item">
              <span className="surgery-card__label">
                {SURGERY_DETAILS_MAP[detail]}:
              </span>{" "}
              <span className="surgery-card__value">
                {surgeryDetails[detail]?.map((item, index) => {
                  return (
                    <span>
                      {item}
                      {index < surgeryDetails[detail].length - 1 && ", "}
                    </span>
                  );
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SurgeryDetails;
