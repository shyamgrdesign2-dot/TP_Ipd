import React from "react";
import { Input, Select, Form } from "antd";
import styles from "../DoctorOnboarding.module.css";

const { Option } = Select;

const BasicInfoStep = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecialityChange = (value) => {
    setFormData({ ...formData, speciality: value });
  };

  const specialities = [
    "Dermatologist",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedist",
    "Gynecologist",
    "Oncologist",
    "Psychiatrist",
    "Ophthalmologist",
    "ENT Specialist",
  ];

  return (
    <div>
      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Your Full name ( First & Last name)
        </label>
        <Input
          placeholder="Dr Shyam Sundar"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          size="large"
          status={formData.fullName ? "" : "error"}
        />
        {!formData.fullName && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please enter your full name
          </div>
        )}
      </div>

      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Speciality
        </label>
        <Select
          placeholder="Select your speciality"
          value={formData.speciality}
          onChange={handleSpecialityChange}
          size="large"
          style={{ width: "100%" }}
          status={formData.speciality ? "" : "error"}
        >
          {specialities.map((speciality) => (
            <Option key={speciality} value={speciality}>
              {speciality}
            </Option>
          ))}
        </Select>
        {!formData.speciality && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please select your speciality
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;
