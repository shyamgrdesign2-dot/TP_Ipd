import React from "react";
import { Modal, Card } from "antd";

function CommonModal({ isModalOpen, title, modalBody, modalWidth, onCancel }) {
  return (
    <Modal
      open={isModalOpen}
      centered
      closeIcon={false}
      footer={null}
      className="modalcommon"
      width={modalWidth}
      onCancel={onCancel}
      destroyOnClose
    >
      <Card
        title={title}
        extra={
          <button className="btn p-1 lh-1 btnclose closeButton">
            <i className="icon-Cross"></i>
          </button>
        }
      >
        {modalBody}
      </Card>
    </Modal>
  );
}

export default CommonModal;
