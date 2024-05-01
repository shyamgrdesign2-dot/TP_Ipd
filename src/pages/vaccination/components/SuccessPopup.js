import { Modal } from "antd";
import React from "react";

const SuccessPopup = ({ show }) => {
  return (
    <Modal
      open={show}
      width={300}
      footer={null}
      closeIcon={null}
      maskClosable={true}
    >
      <div className="d-flex flex-column align-items-center py-3">
        <img
          src={require("../../../assets/images/success-animation.gif")}
          alt="SUCCESS GIF"
          width={100}
        />
        Vaccines updated successfully
      </div>
    </Modal>
  );
};

export default React.memo(SuccessPopup);
