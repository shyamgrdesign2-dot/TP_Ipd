import React from "react";
import { Drawer, Button } from "antd";
import "./SelectionPopup.scss";

const SelectionPopup = ({
  visible,
  onClose,
  selectedValue,
  setSelectedCards,
  setShowUpdate,
}) => {
  const handleClear = () => {
    setSelectedCards([]);
    onClose();
  };

  const handleUpdate = () => {
    setShowUpdate(true);
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
          <span>Update Vaccine{selectedValue > 1 && "s"}</span>
        </Button>
      </div>
    </Drawer>
  );
};

export default React.memo(SelectionPopup);
