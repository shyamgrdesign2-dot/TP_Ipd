import React, { useState } from "react";
import { Input, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import styles from "../DoctorOnboarding.module.css";

const ClinicDetailsStep = ({ formData, setFormData }) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Get coordinates
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Store coordinates in formData
        setFormData({
          ...formData,
          clinic_lat: latitude.toString(),
          clinic_long: longitude.toString(),
        });

        // Get pincode from coordinates using reverse geocoding
        getPincodeFromCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(
          "Unable to get your location. Please enter pincode manually."
        );
        setIsDetectingLocation(false);
      }
    );
  };

  const getPincodeFromCoordinates = async (latitude, longitude) => {
    try {
      // For demonstration purposes, we'll use a free geocoding API
      // In production, you might want to use a more reliable service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );

      const data = await response.json();
      const pincode = data.address.postcode;

      if (pincode) {
        setFormData({
          ...formData,
          clinicPincode: pincode,
          clinic_lat: latitude.toString(),
          clinic_long: longitude.toString(),
        });
      } else {
        // Fallback to a default pincode or manual entry
        setLocationError("Couldn't detect pincode. Please enter manually.");
      }
    } catch (error) {
      console.error("Error getting pincode:", error);
      setLocationError("Failed to get pincode. Please enter manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div>
      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Clinic Name
        </label>
        <Input
          placeholder="Enter your Clinic Name"
          name="clinicName"
          value={formData.clinicName}
          onChange={handleInputChange}
          size="large"
          status={formData.clinicName ? "" : "error"}
        />
        {!formData.clinicName && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please enter your clinic name
          </div>
        )}
      </div>

      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Clinic Pincode
        </label>
        <div style={{ display: "flex", gap: "12px" }}>
          <Input
            placeholder="Enter your Clinic pincode"
            name="clinicPincode"
            value={formData.clinicPincode}
            onChange={handleInputChange}
            size="large"
            style={{ flexGrow: 1 }}
            status={formData.clinicPincode ? "" : "error"}
          />
          <Button
            className={styles.detectLocationBtn}
            onClick={handleDetectLocation}
            loading={isDetectingLocation}
          >
            <EnvironmentOutlined className={styles.locationIcon} />
            {isDetectingLocation ? "Detecting Location..." : "Detect Location"}
          </Button>
        </div>
        {!formData.clinicPincode && !locationError && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please enter your clinic pincode
          </div>
        )}
        {locationError && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            {locationError}
          </div>
        )}
      </div>

      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Clinic Address
        </label>
        <Input.TextArea
          placeholder="Enter your Clinic Address ( Building, Street etc)"
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={handleInputChange}
          size="large"
          rows={4}
          status={formData.clinicAddress ? "" : "error"}
        />
        {!formData.clinicAddress && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please enter your clinic address
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicDetailsStep;
