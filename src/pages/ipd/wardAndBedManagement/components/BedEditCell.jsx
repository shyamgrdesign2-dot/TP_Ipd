import React from "react";
import { Input } from "antd";

const MAX_BED_NAME_LENGTH = 40;

const BedEditCell = ({ editingBedName, setEditingBedName }) => {
  return (
    <div className="bed-name-edit-wrapper">
      <div className="bed-name-edit-input-container">
        <Input
          value={editingBedName}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= MAX_BED_NAME_LENGTH) {
              setEditingBedName(value);
            }
          }}
          className="bed-name-edit-input"
          autoFocus
          maxLength={MAX_BED_NAME_LENGTH}
        />
        <span className="bed-name-char-count">
          {editingBedName.length}/{MAX_BED_NAME_LENGTH}
        </span>
      </div>
    </div>
  );
};

export default React.memo(BedEditCell);

