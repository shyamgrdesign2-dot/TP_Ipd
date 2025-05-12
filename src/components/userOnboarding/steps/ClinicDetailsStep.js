import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import styles from "../DoctorOnboarding.module.css";
import axios from "axios";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";
import currentLocation from "../../../assets/images/current-location.svg";

const ClinicDetailsStep = ({ formData, setFormData }) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSearchingPincode, setIsSearchingPincode] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [coordsDetected, setCoordsDetected] = useState(false);

  // Initialize coordsDetected based on formData
  useEffect(() => {
    if (formData.clinic_lat && formData.clinic_long) {
      setCoordsDetected(true);
    }
  }, []);

  // Fetch city and state using pincode whenever pincode changes
  useEffect(() => {
    // Only search if pincode is valid (6 digits for India)
    if (formData.clinicPincode && formData.clinicPincode.length === 6) {
      searchPincodeDetails(formData.clinicPincode);
    }
  }, [formData.clinicPincode]);

  const searchPincodeDetails = async (pincode) => {
    setIsSearchingPincode(true);
    try {
      // Get auth token from localStorage and parse it
      const rawToken = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
      if (!rawToken) {
        console.warn("Auth token not found for pincode search");
        return;
      }

      const authToken = JSON.parse(rawToken);

      const response = await axios.post(
        "https://pm-master-uat-webservice.tatvacare.in/api/v1/appointment/searchPincode",
        { searchPincode: pincode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Extract city and state data
      if (response.data && response.data.data) {
        const { city, state } = response.data.data;
        if (city && state) {
          setDetectedLocation(`${city}, ${state}`);
        }
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      // Don't show error to user, just log it
    } finally {
      setIsSearchingPincode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Pincode is handled by the useEffect
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    // Show a message to check browser permissions
    // message.info("Please allow location access when prompted by your browser");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Get coordinates
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Location detected:", latitude, longitude);

        // Store coordinates in formData - these will be sent to the API when user clicks Next
        setFormData({
          ...formData,
          clinic_lat: latitude.toString(),
          clinic_long: longitude.toString(),
        });

        // Set coordinates as detected - this will hide the button
        setCoordsDetected(true);
        // message.success("Location coordinates detected successfully!");

        // Try to get pincode from coordinates using reverse geocoding
        // This is just a simple example - in production you might use a more robust service
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.code, error.message);

        // Provide more specific error messages based on error code
        let errorMsg =
          "Unable to get your location. Please enter address manually.";

        if (error.code === 1) {
          errorMsg =
            "Location permission denied. Please check your browser settings.";
        } else if (error.code === 2) {
          errorMsg =
            "Location unavailable. Please try again or enter address manually.";
        } else if (error.code === 3) {
          errorMsg = "Location request timed out. Please try again.";
        }

        setLocationError(errorMsg);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Simple reverse geocoding to get pincode
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // For demo, we'll use Nominatim to get the pincode
      // In production, use a more robust service with proper API keys
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "TatvaCare/1.0",
          },
        }
      );

      const data = await response.json();

      if (data && data.address && data.address.postcode) {
        const pincode = data.address.postcode;

        // Update form with pincode
        setFormData((prev) => ({
          ...prev,
          clinicPincode: pincode,
        }));

        // The useEffect will handle fetching city and state
      } else {
        message.info(
          "Pincode not found from coordinates. Please enter manually."
        );
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      // message.info("Unable to determine pincode. Please enter manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div>
      <div className={styles.inputField}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#454551",
            fontFamily: "Poppins",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.25rem",
          }}
        >
          Clinic Name
          <span className={styles.requiredAsterisk}>*</span>
        </label>
        <Input
          placeholder="Enter your Clinic Name"
          name="clinicName"
          value={formData.clinicName}
          onChange={handleInputChange}
          size="large"
          status={formData.clinicName ? "" : "error"}
          style={{
            width: "100%",
            height: "3.5rem",
            borderRadius: "6px",
            borderColor: formData.clinicName ? "#d1d5db" : "#E2E2EA",
            fontSize: "16px",
          }}
          className={styles.focusedInput}
        />
      </div>

      <div className={styles.inputField}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#454551",
            fontFamily: "Poppins",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.25rem",
          }}
        >
          Clinic Pincode
          <span className={styles.requiredAsterisk}>*</span>
        </label>
        <div style={{ position: "relative" }}>
          <Input
            placeholder="Enter your Clinic pincode"
            name="clinicPincode"
            value={formData.clinicPincode}
            onChange={handleInputChange}
            size="large"
            status={formData.clinicPincode ? "" : "error"}
            style={{
              width: "100%",
              height: "3.5rem",
              borderRadius: "6px",
              borderColor: formData.clinicPincode ? "#d1d5db" : "#E2E2EA",
              fontSize: "16px",
            }}
            className={styles.focusedInput}
            suffix={
              !coordsDetected && (
                <div
                  className={styles.detectLocationButton}
                  onClick={
                    !isSearchingPincode ? handleDetectLocation : undefined
                  }
                  style={{
                    cursor: isSearchingPincode ? "not-allowed" : "pointer",
                    marginRight: "-7px",
                  }}
                >
                  <img src={currentLocation} alt="Current Location" />
                  <span className={styles.detectLocationText}>
                    {isDetectingLocation ? "Detecting..." : "Detect Location"}
                  </span>
                </div>
              )
            }
          />
          {detectedLocation && (
            <div
              style={{
                position: "absolute",
                right: coordsDetected ? "12px" : "150px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#52c41a",
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              {detectedLocation}
            </div>
          )}
        </div>
        {locationError && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            {locationError}
          </div>
        )}
      </div>

      <div className={styles.inputField}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#454551",
            fontFamily: "Poppins",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.25rem",
          }}
        >
          Clinic Address
        </label>
        <Input
          placeholder="Enter your Clinic Address ( Building, Street etc)"
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={handleInputChange}
          size="large"
          status={formData.clinicAddress ? "" : "error"}
          style={{
            width: "100%",
            height: "3.5rem",
            borderRadius: "6px",
            borderColor: formData.clinicAddress ? "#d1d5db" : "#E2E2EA",
            fontSize: "16px",
          }}
          className={styles.focusedInput}
        />
      </div>
    </div>
  );
};

export default ClinicDetailsStep;
