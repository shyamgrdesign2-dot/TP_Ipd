import { Modal, DatePicker, Button } from "antd";
import { useState } from "react";
import ApiVaccination from "../../service";
import { useNavigate } from "react-router-dom";

const AddDOB = ({ show, setShowDob }) => {
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const updateDob = async () => {
    const payload = { dob };
    // const res = await ApiVaccination.updateDob(payload);
  };

  return (
    <Modal
      title="Add Date of Birth"
      width={"462px"}
      open={show}
      footer={null}
      closeIcon={null}
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

        <Button
          disabled={!dob}
          className={`${!dob ? "opacity-50" : ""}`}
          style={{ backgroundColor: "#4B4AD5" }}
          type="primary"
          onClick={updateDob}
        >
          Add
        </Button>
        <Button
          className="border-0 opacity-50 shadow-none text-secondary"
          onClick={() => navigate("/prescription")}
        >
          Close vaccination chart
        </Button>
      </div>
    </Modal>
  );
};

export default AddDOB;
