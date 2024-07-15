import { Modal } from "antd";
import React from "react";

const SuccessPopup = ({ show, setShow }) => {
  return (
    <Modal
      open={show}
      width={300}
      footer={null}
      closeIcon={null}
      onCancel={() => setShow(false)}
    >
      <div className="d-flex flex-column align-items-center py-3">
        <img
          src={require("../../../assets/images/success-animation.gif")}
          alt="SUCCESS GIF"
          width={100}
        />
        Details updated successfully
      </div>
    </Modal>
  );
};

export default React.memo(SuccessPopup);
