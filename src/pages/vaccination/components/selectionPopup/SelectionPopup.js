import React from "react";
import { Drawer, Button } from "antd";
import "./SelectionPopup.scss";

const SelectionPopup = ({
  visible,
  onClose,
  selectedValue,
  setSelectedCards,
}) => {
  const handleClear = () => {
    setSelectedCards([]);
    onClose();
  };

  const handleUpdate = () => {
    onClose();
  };

  return (
    <Drawer
      placement="bottom"
      closable={false}
      open={visible}
      height={80}
      mask={false} // Prevents blurring of background
      style={{
        width: "436px",
        bottom: "18px",
        position: "absolute",
      }}
    >
      <div className="drawerContainer">
        <span className="selectedStyle">{selectedValue} Selected</span>
        <Button
          shape={"round"}
          size={"large"}
          className="btnStyle"
          onClick={handleClear}
        >
          <span className="clearStyle">Clear</span>
        </Button>
        <Button
          size={"large"}
          shape={"round"}
          type="primary"
          onClick={handleUpdate}
        >
          <span>Update Vaccine</span>
        </Button>
      </div>
    </Drawer>
  );
};

export default React.memo(SelectionPopup);
