import React from "react";
import { Button } from "antd";
import CommonModal from "../../../../common/CommonModal";
import { defaultIcons } from "../../../../assets/images/icons/index.js";

/**
 * DischargeConfirmationPopup Component
 *
 * A confirmation modal that appears after user clicks "Discharge" button in the drawer.
 * Shows a warning message about inability to edit after discharge.
 *
 * @param {Object} props
 * @param {boolean} props.isModalOpen - Controls modal visibility
 * @param {Function} props.onCancel - Callback when "No, Go Back" is clicked
 * @param {Function} props.onConfirm - Callback when "Yes, Discharge Patient" is clicked
 * @returns {JSX.Element}
 */
const DischargeConfirmationPopup = ({
  isModalOpen,
  onCancel,
  onConfirm,
  apiToCall,
}) => {
  return (
    <CommonModal
      isModalOpen={isModalOpen}
      onCancel={onCancel}
      modalWidth={600}
      title={
        apiToCall === "markPatientAsDischarged"
          ? "Confirm Discharge"
          : "Confirm Send for Discharge Approval"
      }
      modalBody={
        <>
          <div className="alert-warning rounded-10px p-3 patient-details">
            <div className="d-flex align-items-start">
              <img
                className="me-3 mt-1"
                src={defaultIcons.infoIconWarningColoured}
                alt="Warning"
                style={{ width: "24px", height: "24px" }}
              />
              <span style={{ fontSize: "14px", lineHeight: "20px" }}>
                Once discharged, you will not be able to add or edit any
                details. Please ensure all information is complete and approved
                before proceeding.
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="d-flex align-items-center mt-2 justify-content-end">
              <div
                onClick={onCancel}
                className="me-4 text-decoration-underline btn p-0 text-main"
                style={{ cursor: "pointer", fontSize: "14px" }}
              >
                No, Go Back
              </div>
              <Button
                onClick={onConfirm}
                className="lh-lg btn btn-primary3 btn-41 px-4"
              >
                <span>{apiToCall === "markPatientAsDischarged" ? "Yes, Discharge Patient" : "Yes, Send for Discharge Approval"}</span>
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export default DischargeConfirmationPopup;
