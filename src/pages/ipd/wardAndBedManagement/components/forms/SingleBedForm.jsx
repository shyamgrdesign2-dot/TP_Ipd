import React from "react";
import { Button, Input } from "antd";
import { defaultIcons } from "../../../../../assets/images/icons";

const SingleBedForm = ({
  singleBedName,
  setSingleBedName,
  onAddBed,
  isAddBedDisabled,
}) => {
  return (
    <>
      <div className="add-beds-form-field">
        <label className="add-beds-form-label">Enter Bed Name</label>
        <Input
          value={singleBedName}
          onChange={(e) => setSingleBedName(e.target.value)}
          placeholder="Eg: BED_01"
          className="add-beds-text-input"
        />
      </div>

      <Button
        type="primary"
        icon={<img src={defaultIcons.plusIcon} alt="+" />}
        onClick={onAddBed}
        disabled={isAddBedDisabled}
        className="add-bed-button"
      >
        Add Bed
      </Button>
    </>
  );
};

export default React.memo(SingleBedForm);
