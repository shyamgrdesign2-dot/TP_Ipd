import { Checkbox, Modal } from "antd";
import "./TogglePercentileLine.scss";

const TogglePercentileLine = ({
  data,
  setModalIsOpen,
  toggleVisibility,
  visibility,
}) => {
  return (
    // <Modal
    //   title="Toggle Line Visibility"
    //   open={true}
    //   onOk={() => setModalIsOpen(false)}
    //   onCancel={() => setModalIsOpen(false)}
    // >
    <div className="toggleContainer">
      {data.datasets.map((dataset, index) => (
        <div key={index}>
          <Checkbox
            checked={visibility[index]}
            onChange={() => toggleVisibility(index)}
          >
            {dataset.label}
          </Checkbox>
        </div>
      ))}
    </div>
    // </Modal>
  );
};

export default TogglePercentileLine;
