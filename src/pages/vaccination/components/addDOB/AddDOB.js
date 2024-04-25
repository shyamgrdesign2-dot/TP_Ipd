import { Modal, DatePicker, Button } from "antd";
import { useState } from "react";

export const AddDOB = () => {
  const [dob, setDob] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal
      title="Add Date of Birth"
      width={"462px"}
      centered
      open={isOpen}
      footer={null}
    >
      <p style={{ opacity: 0.5 }}>
        Please enter the patient's date of birth for accurate vaccination
        scheduling and due date calculations
      </p>
      <div className="d-flex flex-column gap-4">
        <div>Date of birth</div>
        <DatePicker
          placeholder="Select Date"
          onChange={(_, d) => {
            setDob(d);
          }}
          format="DD-MM-YYYY"
        />

        <Button disabled={!dob} type="primary">
          Add
        </Button>
        <Button
          className="border-0 opacity-50 shadow-none"
          onClick={() => setIsOpen(false)}
        >
          Close vaccination chart
        </Button>
      </div>
    </Modal>
  );
};
