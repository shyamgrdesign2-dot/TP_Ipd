import React from "react";
import { Button } from "antd";
import CommonModal from "../../../common/CommonModal";
import { defaultIcons } from "../../../assets/images/icons/index.js";

const CancelCrossReferralConfirmationPopup = ({
  isModalOpen,
  onCancel,
  onConfirm,
}) => {
  return (
    <CommonModal
      isModalOpen={isModalOpen}
      onCancel={onCancel}
      modalWidth={600}
      title="Confirm Cancel Cross Referral"
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
                Are you sure you want to cancel this cross referral? This action
                will mark the referral as cancelled and cannot be undone.
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
                <span>Yes, Cancel Cross Referral</span>
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export default CancelCrossReferralConfirmationPopup;
