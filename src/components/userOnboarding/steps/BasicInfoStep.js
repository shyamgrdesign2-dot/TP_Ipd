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
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#111827",
          }}
        >
          Your Full name ( First & Last name)
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        </label>
        <Input
          placeholder="Dr Shyam Sundar"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          size="large"
          status={formData.fullName ? "" : "error"}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "6px",
            borderColor: formData.fullName ? "#d1d5db" : "#ef4444",
            fontSize: "16px",
          }}
        />
        {!formData.fullName && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
            Please enter your full name
          </div>
        )}
      </div>

      <div className={styles.inputField} style={{ marginTop: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#111827",
          }}
        >
          Speciality
          <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
        </label>
        <Select
          placeholder="Select your speciality"
          value={formData.speciality}
          onChange={handleSpecialityChange}
          size="large"
          style={{
            width: "100%",
            height: "48px",
          }}
          dropdownStyle={{ borderRadius: "6px" }}
          status={formData.speciality ? "" : "error"}
        >
          {specialities.map((speciality) => (
            <Option key={speciality} value={speciality}>
              {speciality}
            </Option>
          ))}
        </Select>
        {!formData.speciality && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
            Please select your speciality
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;
