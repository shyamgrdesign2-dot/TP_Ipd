/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, DatePicker, Button } from "antd";
import { useEffect, useState } from "react";
import { createPatient } from "../../service";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../../../../utils/utils";
import moment from "moment";
import dayjs from "dayjs";

const AddDOB = ({ show, setShowDob, patientDetails, getPatientDetail }) => {
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (patientDetails.pm_dob) {
      setDob(moment(patientDetails.pm_dob).format("DD-MM-YYYY"));
    }
  }, []);

  const createPatientDetails = async () => {
    const payload = {
      patient_uid: patientDetails?.patient_unique_id,
      patient_pid: patientDetails?.pm_pid,
      hospital_bid:
        patientDetails?.hm_business_id || patientDetails?.hospital_business_id,
      hospital_id: patientDetails?.hm_id || patientDetails?.clinic_id,
      patient_first_name: patientDetails?.pm_first_name || "",
      patient_middle_name: patientDetails?.pm_middle_name || "",
      patient_last_name: patientDetails?.pm_last_name || "",
      patient_gender: patientDetails?.pm_gender,
      patient_dob: moment(dob).format("YYYY-MM-DD"),
      patient_contact_no: patientDetails?.pm_contact_no,
    };
    const createPatientRes = await createPatient(payload);
    if (createPatientRes?.status === 200) {
      getPatientDetail();
      setShowDob(false);
    } else {
      errorMessage({ name: "TypeError" });
    }
  };

  const updatePatientDob = async () => {
    const payload = {
      patient_uid: patientDetails?.patient_unique_id,
      hospital_bid: patientDetails?.hm_business_id,
      hospital_id: patientDetails?.hm_id,
      updated_dob: moment(dob).format("YYYY-MM-DD"),
    };
    const createPatientRes = await createPatient(payload);
    if (createPatientRes?.status === 200) {
      getPatientDetail();
      setShowDob(false);
    } else {
      errorMessage({ name: "TypeError" });
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
          value={dob ? dayjs(dob, "DD-MM-YYYY") : ""}
        />

        <Button
          disabled={!dob}
          className={`${!dob ? "opacity-50" : ""}`}
          style={{ backgroundColor: "#4B4AD5" }}
          type="primary"
          onClick={() => {
            if (patientDetails?.vac_id) updatePatientDob();
            else createPatientDetails();
          }}
        >
          Add
        </Button>
        <Button
          className="border-0 opacity-50 shadow-none text-secondary"
          onClick={() =>
            navigate("/prescription", {
              state: { patientDetails: patientDetails },
            })
          }
        >
          Close vaccination chart
        </Button>
      </div>
    </Modal>
  );
};

export default AddDOB;
