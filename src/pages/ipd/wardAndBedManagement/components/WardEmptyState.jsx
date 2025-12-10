import React from "react";
import { Button } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import emptyFileIcon from "../../../../assets/images/empty-file.svg";
import "./WardEmptyState.scss";

const WardEmptyState = ({ onAddWardClick }) => {
  return (
    <div className="ward-empty-state">
      <div className="ward-empty-state-container">
        <div className="ward-empty-state-content">
          <div className="ward-empty-state-illustration">
            <img src={emptyFileIcon} alt="No wards" />
          </div>
          <p className="ward-empty-state-message">
            You haven't created any wards yet.
            <br />
            Start adding wards!
          </p>
          <Button
            type="primary"
            icon={<img src={defaultIcons.plusIcon} alt="+" />}
            onClick={onAddWardClick}
            className="ward-empty-state-button"
          >
            Add New Ward
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WardEmptyState);
