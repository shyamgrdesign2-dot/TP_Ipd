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
  isConfirmLoading = false,
}) => {
  const confirmTitle =
    apiToCall === "markPatientAsDischarged"
      ? "Confirm Discharge"
      : apiToCall === "markIntimationDischarge"
      ? "Confirm Intimate Discharge"
      : "Confirm Send for Discharge Approval";

  const confirmButtonLabel =
    apiToCall === "markPatientAsDischarged"
      ? "Yes, Discharge Patient"
      : apiToCall === "markIntimationDischarge"
      ? "Yes, Mark Intimate Discharge"
      : "Yes, Send for Discharge Approval";

  const warningBody =
    apiToCall === "markIntimationDischarge"
      ? "Once intimate discharge is marked, please ensure all information is correct before proceeding."
      : "Once discharged, you will not be able to add or edit any details. Please ensure all information is complete and approved before proceeding.";

  return (
    <CommonModal
      isModalOpen={isModalOpen}
      onCancel={onCancel}
      modalWidth={600}
      title={confirmTitle}
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
                {warningBody}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="d-flex align-items-center mt-2 justify-content-end">
              <div
                onClick={isConfirmLoading ? undefined : onCancel}
                className="me-4 text-decoration-underline btn p-0 text-main"
                style={{
                  cursor: isConfirmLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  opacity: isConfirmLoading ? 0.6 : 1,
                  pointerEvents: isConfirmLoading ? "none" : "auto",
                }}
              >
                No, Go Back
              </div>
              <Button
                onClick={onConfirm}
                className="lh-lg btn btn-primary3 btn-41 px-4"
                loading={isConfirmLoading}
                disabled={isConfirmLoading}
              >
                <span>{confirmButtonLabel}</span>
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export default DischargeConfirmationPopup;
