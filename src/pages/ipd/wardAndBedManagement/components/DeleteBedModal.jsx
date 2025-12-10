import React, { useState, useCallback, useMemo } from "react";
import { Modal, Button } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import "./DeleteBedModal.scss";
import alertIcon from "../../../../assets/images/alertIcon.svg";

const MODAL_TYPE = {
  DELETE: "delete",
  BLOCK: "block",
  UNBLOCK: "unblock",
};

const DeleteBedModal = ({
  open,
  onCancel,
  onDelete,
  bed,
  type = MODAL_TYPE.DELETE,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!bed?.id && !bed?._id) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      const actionText =
        type === MODAL_TYPE.BLOCK
          ? "blocking"
          : type === MODAL_TYPE.UNBLOCK
          ? "unblocking"
          : "deleting";
      console.error(`Error ${actionText} bed:`, error);
    } finally {
      setIsDeleting(false);
    }
  }, [bed, onDelete, type]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const bedName = bed?.name || bed?.bedName || "this bed";

  // Get modal content based on type
  const modalContent = useMemo(() => {
    if (type === MODAL_TYPE.BLOCK) {
      return {
        title: "Are you sure you want to Block this Bed?",
        warningMessage: (
          <p>
            This will block <strong>{bedName}</strong> and no new patient can be
            admitted here until it is unblocked. Please confirm to proceed.
          </p>
        ),
        confirmButtonText: "Yes, Block",
      };
    }
    if (type === MODAL_TYPE.UNBLOCK) {
      return {
        title: "Are you sure you want to Unblock this Bed?",
        warningMessage: (
          <p>
            This will unblock <strong>{bedName}</strong> and make it available
            for new patient admissions. Please confirm to proceed.
          </p>
        ),
        confirmButtonText: "Yes, Unblock",
      };
    }
    // Default to delete
    return {
      title: "Are you sure you want to delete this Bed?",
      warningMessage: (
        <p>
          This action will permanently delete the <strong>{bedName}</strong> and
          cannot be undone. Please confirm to proceed
        </p>
      ),
      confirmButtonText: "Yes, Delete",
    };
  }, [type, bedName]);

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      centered
      closeIcon={null}
      footer={null}
      className="delete-bed-modal"
      width={555}
      destroyOnClose
    >
      <div className="delete-bed-modal-content">
        {/* Header */}
        <div className="delete-bed-modal-header">
          <h2 className="delete-bed-modal-title">{modalContent.title}</h2>
          <img
            src={defaultIcons.crossIconBlackBg}
            alt="Close"
            className="delete-bed-modal-close-icon"
            onClick={handleCancel}
          />
        </div>

        {/* Body */}
        <div className="delete-bed-modal-body">
          {/* Warning Message */}
          <div className="delete-bed-modal-warning">
            <img
              src={alertIcon}
              alt="Alert"
              className="delete-bed-modal-warning-icon"
            />
            <div className="delete-bed-modal-warning-text">
              {modalContent.warningMessage}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="delete-bed-modal-actions">
            <Button
              type="text"
              onClick={handleCancel}
              className="delete-bed-modal-cancel-btn"
            >
              No, Go Back
            </Button>
            <Button
              type="primary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="delete-bed-modal-delete-btn"
              loading={isDeleting}
            >
              {modalContent.confirmButtonText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(DeleteBedModal);
