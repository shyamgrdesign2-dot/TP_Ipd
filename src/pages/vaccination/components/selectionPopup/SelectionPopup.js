import React, { useState } from "react";
import { Drawer, Select, Button, Space } from "antd";
import "./SelectionPopup.scss"; // Import CSS file for styling

const { Option } = Select;

const SelectionPopup = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const handleClear = () => {
    setSelectedValue(null);
  };

  const handleUpdate = () => {
    // Perform any action with the selected value
    console.log("Selected value:", selectedValue);
    handleClose();
  };

  return (
    <div className="selection-popup">
      <Button onClick={handleOpen}>Open Popup</Button>
      <Drawer
        placement="bottom"
        closable={false}
        // onClose={handleClose}
        visible={visible}
        height={80} // Set the height of the popup to 150px
        width={350} // Set the width of the popup to 350px
        mask={false} // Prevents blurring of background
      >
        <Button onClick={handleClear}>Clear</Button>
        <Button type="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Drawer>
    </div>
  );
};

export default SelectionPopup;
