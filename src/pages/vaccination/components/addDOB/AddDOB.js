import { Modal, DatePicker, Button } from "antd";
import { useState } from "react";
import { updateDob } from "../../service";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AddDOB = ({ show, setShowDob, patientDetails, getPatientDetail }) => {
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const updatePatientDob = async () => {
    const payload = {
      patient_pid: patientDetails?.vac_pid,
      patient_uid: patientDetails?.patient_unique_id,
      hospital_bid: patientDetails?.hm_business_id,
      hospital_id: patientDetails?.hm_id,
      updated_dob: moment(dob).format("YYYY-MM-DD"),
    };
    const res = await updateDob(payload);
    if (res?.status === 200) {
      setShowDob(false);
      getPatientDetail();
    }
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
          onClick={updatePatientDob}
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
