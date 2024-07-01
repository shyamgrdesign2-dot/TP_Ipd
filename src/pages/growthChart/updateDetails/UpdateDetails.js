import { Modal, DatePicker, Input, Button, Divider } from "antd";
import dayjs from "dayjs";
import "./updateDetails.scss";
import { useEffect, useState } from "react";
import { createParentalDetails, updateParentalDetails } from "../service";
import { useLocation } from "react-router-dom";
import SuccessPopup from "../components/SuccessPopup";
import moment from "moment";
import {
  createPatient,
  updateDob,
  getPatientDetails,
} from "../../vaccination/service";
import { errorMessage } from "../../../utils/utils";
import { useSelector } from "react-redux";
import { getMidParentalHeight } from "../growthChartHelper";

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
  const [dob, setDob] = useState("");
  const { profile } = useSelector((state) => state.doctors);
  const [vaccinePatientDetails, setVaccinePatientDetails] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatientDetail();
    if (parentalDetails) {
      setAction("update");
    } else {
      setAction("create");
    }
    if (patient_data.DOB) {
      setDob(moment(patient_data.DOB, "Do MMMM YYYY").format("DD-MM-YYYY"));
    } else if (patient_data.pm_dob) {
      setDob(moment(patient_data.pm_dob).format("DD-MM-YYYY"));
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
      father_height: parentalDetails?.father_height || "",
      mother_height: parentalDetails?.mother_height || "",
      gestation_period:
        parentalDetails?.gestation_period_weeks * 7 +
        parentalDetails?.gestation_period_days,
    };
    const createParentalDetailsRes = await createParentalDetails(payload);
    if (createParentalDetailsRes?.status === 201) {
      setShowSuccess(true);
      setTimeout(() => {
        setShow(false);
        updateParentalState(
          parentalDetails
            ? parentalDetails
            : {
                ...payload,
                gestation_period_weeks: parentalDetails?.gestation_period_weeks,
                gestation_period_days: parentalDetails?.gestation_period_days,
              }
        );
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
        updateParentalState(
          parentalDetails
            ? parentalDetails
            : {
                ...payload,
                gestation_period_weeks: parentalDetails?.gestation_period_weeks,
                gestation_period_days: parentalDetails?.gestation_period_days,
              }
        );
      }, 1000);
    }
  };

  const updateParentalState = (data) => {
    const { maleChildHeight, femaleChildHeight } = getMidParentalHeight(
      +data?.father_height,
      +data?.mother_height
    );
    setParentalDetails({
      ...data,
      ...(data?.father_height &&
        data?.mother_height && {
          mid_parental_height:
            patient_data?.pm_gender === "Male"
              ? maleChildHeight
              : femaleChildHeight,
        }),
    });
  };

  const handleClose = () => {};

  const getPatientDetail = async () => {
    const patientDetails = await getPatientDetails({
      hospital_bid:
        patient_data?.hm_business_id || patient_data?.hospital_business_id,
      patient_uid: patient_data?.patient_unique_id,
      hospital_id: patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
    });
    if (!patientDetails?.vac_id) {
      patientDetails.vac_dob = moment(patientDetails.vac_dob).format(
        "DD-MMM-YYYY"
      );
    }
    setVaccinePatientDetails({ ...patient_data, ...patientDetails });
    return patientDetails;
  };

  const createPatientDetails = async () => {
    const payload = {
      patient_uid: patient_data?.patient_unique_id,
      patient_pid: patient_data?.pm_pid,
      hospital_bid:
        patient_data?.hm_business_id || patient_data?.hospital_business_id,
      hospital_id: patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
      patient_first_name: patient_data?.pm_first_name || "",
      patient_middle_name: patient_data?.pm_middle_name || "",
      patient_last_name: patient_data?.pm_last_name || "",
      patient_gender: patient_data?.pm_gender,
      patient_dob: moment(dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
      patient_contact_no: patient_data?.pm_contact_no,
    };
    const createPatientRes = await createPatient(payload);
    if (createPatientRes?.status === 200) {
      updatePatientDob();
    } else {
      errorMessage({ name: "TypeError" });
    }
  };

  const updatePatientDob = async () => {
    const payload = {
      patient_uid: patient_data?.patient_unique_id,
      patient_pid: patient_data?.vac_pid || patient_data?.pm_pid,
      hospital_bid:
        patient_data?.hm_business_id || patient_data?.hospital_business_id,
      hospital_id: patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
      updated_dob: moment(dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };
    const updateDobRes = await updateDob(payload);
    if (!updateDobRes?.status === 200) {
      errorMessage({ name: "TypeError" });
    }
  };

  const updateGcDetails = async () => {
    if (!vaccinePatientDetails.vac_id && dob) {
      createPatientDetails();
    } else if (dob && vaccinePatientDetails.vac_dob !== dob) {
      updatePatientDob();
    }
    if (action === "create") {
      createDetails();
    } else if (action === "update") {
      updateDetails();
    }
  };

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
              setDob(d);
            }}
            format="DD-MM-YYYY"
            value={dob ? dayjs(dob, "DD-MM-YYYY") : ""}
            style={{
              height: "38px",
              width: "374px",
            }}
            allowClear={false}
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
          onClick={updateGcDetails}
          disabled={loading}
        >
          Continue
        </Button>
      </div>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </Modal>
  );
}
