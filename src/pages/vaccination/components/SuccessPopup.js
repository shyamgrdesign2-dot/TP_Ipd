import { Modal } from "antd";

const SuccessPopup = ({ show }) => {
  return (
    <Modal open={show} width={300} footer={null} closeIcon={null}>
      <div className="d-flex flex-column align-items-center py-3">
        <img
          src={require("../../../assets/images/success.gif")}
          alt="Animated GIF"
          width={100}
        />
        Vaccines updated successfully
      </div>
    </Modal>
  );
};

export default SuccessPopup;
