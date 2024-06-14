import { Modal, DatePicker, Input, Button, Divider } from "antd";
import dayjs from "dayjs";
import "./updateDetails.scss";
import { useEffect, useState } from "react";
import { createParentalDetails, updateParentalDetails } from "../service";
import { useLocation } from "react-router-dom";
import SuccessPopup from "../components/SuccessPopup";

export default function UpdateDetails({
  show,
  parentalDetails,
  setShow,
  setParentalDetails,
}) {
  const { state } = useLocation();
  const { patient_data } = state;
  const [showSuccess, setShowSuccess] = useState(false);
  const [action, setAction] = useState("");

  useEffect(() => {
    if (parentalDetails) {
      setAction("update");
    } else {
      setAction("create");
    }
  }, []);

  const handleParentalDetails = (value, type) => {
    setParentalDetails({ ...parentalDetails, [type]: value });
  };

  const handleChange = (e) => {
    const { value: inputValue, name } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "") {
      handleParentalDetails(inputValue, name);
    }
  };

  const createDetails = async () => {
    const payload = {
      pm_id: patient_data?.pm_id,
      pm_pid: patient_data?.pm_pid,
      father_height: parentalDetails?.father_height,
      mother_height: parentalDetails?.mother_height,
      gestation_period:
        parentalDetails?.gestation_period_weeks * 7 +
        parentalDetails?.gestation_period_days,
    };
    const createParentalDetailsRes = await createParentalDetails(payload);
    if (createParentalDetailsRes?.status === 201) {
      setShowSuccess(true);
      setTimeout(() => {
        setShow(false);
      }, 1000);
    }
  };

  const updateDetails = async () => {
    const payload = {
      father_height: parentalDetails?.father_height,
      mother_height: parentalDetails?.mother_height,
      gestation_period:
        parentalDetails?.gestation_period_weeks * 7 +
        parentalDetails?.gestation_period_days,
    };
    const updateParentalDetailsRes = await updateParentalDetails(
      {
        pm_id: patient_data?.pm_id,
        pm_pid: patient_data?.pm_pid,
      },
      payload
    );
    console.log({ updateParentalDetailsRes });
    if (updateParentalDetailsRes.status === 204) {
      setShowSuccess(true);
      setTimeout(() => {
        setShow(false);
      }, 1000);
    }
  };

  const handleClose = () => {};

  return (
    <Modal
      width={"422px"}
      open={show}
      footer={null}
      closeIcon={null}
      title={
        <div>
          <div>Update Details</div>
          <hr style={{ borderTop: "1px solid #ccc" }} />
        </div>
      }
      onCancel={handleClose}
    >
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Date of birth
          </label>
          <DatePicker
            placeholder="Select Date"
            dropdownClassName="addDOB-picker-dropdown"
            onChange={(_, d) => {
              //   setDob(d);
            }}
            format="DD-MM-YYYY"
            // value={dob ? dayjs(dob, "DD-MM-YYYY") : ""}
            style={{
              height: "38px",
              width: "374px",
            }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Gestation Period
          </label>
          <div className="d-flex">
            <Input
              placeholder="Weeks"
              className="gc-input"
              style={{ marginRight: 30 }}
              onChange={handleChange}
              value={parentalDetails?.gestation_period_weeks ?? ""}
              name="gestation_period_weeks"
            />
            <Input
              placeholder="Days"
              className="gc-input"
              onChange={handleChange}
              value={parentalDetails?.gestation_period_days ?? ""}
              name="gestation_period_days"
            />
          </div>
        </div>
        <Divider dashed style={{ width: "100%" }} />
        <div>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Mid parental height
          </label>
          <div className="d-flex">
            <div style={{ marginRight: 30 }}>
              <label style={{ marginBottom: 8 }} className="gc-label">
                Father
              </label>
              <Input
                placeholder="Ex : 160 cms"
                className="gc-input"
                onChange={handleChange}
                value={parentalDetails?.father_height ?? ""}
                name="father_height"
              />
            </div>
            <div>
              <label style={{ marginBottom: 8 }} className="gc-label">
                Mother
              </label>
              <Input
                placeholder="Ex : 160 cms"
                className="gc-input"
                onChange={handleChange}
                value={parentalDetails?.mother_height ?? ""}
                name="mother_height"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <Button
          style={{
            marginRight: 20,
            borderColor: "#4B4AD5",
          }}
          className="gc-btn"
          onClick={() => setShow(false)}
        >
          <span className="gc-btn-txt">Do it later</span>
        </Button>
        <Button
          className="gc-btn"
          type="primary"
          onClick={() => {
            if (action === "create") createDetails();
            else updateDetails();
          }}
        >
          Continue
        </Button>
      </div>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </Modal>
  );
}
