import React, { useState, useCallback, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import "./AddWardModal.scss";

const MAX_WARD_NAME_LENGTH = 40;

const AddWardModal = ({
  open,
  onCancel,
  onSave,
  initialValue = "",
  ward = null, // If provided, modal is in "edit" mode
}) => {
  const isEditMode = !!ward;
  const [wardName, setWardName] = useState(
    initialValue || ward?.wardName || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  // Update wardName when modal opens or ward/initialValue changes
  useEffect(() => {
    if (open) {
      if (isEditMode && ward?.wardName) {
        setWardName(ward.wardName);
      } else if (initialValue) {
        setWardName(initialValue);
      } else {
        setWardName("");
      }
    } else if (!open) {
      setWardName("");
    }
  }, [open, initialValue, ward, isEditMode]);

  const handleWardNameChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_WARD_NAME_LENGTH) {
      setWardName(value);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!wardName.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode) {
        await onSave(wardName.trim(), ward?.id);
      } else {
        await onSave(wardName.trim());
      }
      setWardName("");
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "saving"} ward:`, error);
    } finally {
      setIsSaving(false);
    }
  }, [wardName, onSave, isEditMode, ward?.id]);

  const handleCancel = useCallback(() => {
    if (isEditMode) {
      setWardName(ward?.wardName || "");
    } else {
      setWardName("");
    }
    onCancel();
  }, [onCancel, isEditMode, ward?.wardName]);

  const isSaveDisabled =
    !wardName.trim() || isSaving || (isEditMode && wardName === ward?.wardName);

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      centered
      closeIcon={
        <img
          src={defaultIcons.crossIconBlackBg}
          alt="Close"
          className="add-ward-modal-close-icon"
        />
      }
      footer={null}
      className="add-ward-modal"
      width={555}
      destroyOnClose
    >
      <div className="add-ward-modal-content">
        {/* Header */}
        <div className="add-ward-modal-header">
          <h2 className="add-ward-modal-title">
            {isEditMode ? "Edit Ward Name" : "Add New Ward"}
          </h2>
        </div>

        {/* Body */}
        <div className="add-ward-modal-body">
          {/* Ward Name Input */}
          <div className="add-ward-modal-field">
            <label className="add-ward-modal-label">
              Ward Name<span className="add-ward-modal-required">*</span>
            </label>
            <div className="add-ward-modal-input-wrapper">
              <Input
                value={wardName}
                onChange={handleWardNameChange}
                placeholder="Eg: Ortho Ward"
                maxLength={MAX_WARD_NAME_LENGTH}
                className="add-ward-modal-input"
                autoFocus
              />
              <span className="add-ward-modal-char-count">
                {wardName.length}/{MAX_WARD_NAME_LENGTH}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="add-ward-modal-actions">
            <Button
              type="text"
              onClick={handleCancel}
              className="add-ward-modal-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="add-ward-modal-save-btn"
              loading={isSaving}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(AddWardModal);
