import React, { useState, useCallback, useMemo } from "react";
import { Modal, Button } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import alertIcon from "../../../../assets/images/alertIcon.svg";
import "./DeleteWardModal.scss";

const DeleteWardModal = ({ open, onCancel, onDelete, ward }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate total beds for the ward
  const totalBeds = useMemo(() => {
    if (!ward) return 0;
    // Use totalBeds if available, otherwise calculate from sum of individual bed types
    if (ward.totalBeds !== undefined && ward.totalBeds !== null) {
      return ward.totalBeds;
    }
    return (
      (ward.availableBeds || 0) +
      (ward.occupiedBeds || 0) +
      (ward.blockedBeds || 0)
    );
  }, [ward]);

  const handleDelete = useCallback(async () => {
    if (!ward?.id) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(ward.id);
    } catch (error) {
      console.error("Error deleting ward:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [ward?.id, onDelete]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Modal
      open={open}
      centered
      closeIcon={null}
      footer={null}
      className="delete-ward-modal"
      width={555}
      destroyOnClose
    >
      <div className="delete-ward-modal-content">
        {/* Header */}
        <div className="delete-ward-modal-header">
          <h2 className="delete-ward-modal-title">Delete Ward!</h2>
          <img
            src={defaultIcons.crossIconBlackBg}
            alt="Close"
            className="delete-ward-modal-close-icon"
            onClick={handleCancel}
          />
        </div>

        {/* Body */}
        <div className="delete-ward-modal-body">
          {/* Warning Message */}
          <div className="delete-ward-modal-warning">
            <img
              src={alertIcon}
              alt="Alert"
              className="delete-ward-modal-warning-icon"
              onClick={handleCancel}
            />
            <div className="delete-ward-modal-warning-text">
              <p>
                If you delete this ward, all{" "}
                <strong>{String(totalBeds).padStart(2, "0")} beds</strong>{" "}
                linked to it will also be permanently deleted. This action
                cannot be undone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="delete-ward-modal-actions">
            <Button
              type="text"
              onClick={handleCancel}
              className="delete-ward-modal-cancel-btn"
            >
              No, Go Back
            </Button>
            <Button
              type="primary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="delete-ward-modal-delete-btn"
              loading={isDeleting}
            >
              Yes, Delete Ward
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(DeleteWardModal);
