import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import styles from "../DoctorOnboarding.module.css";
import currentLocation from "../../../assets/images/current-location.svg";
import config from "../../../config";
import { useLocation } from "react-router-dom";
const { TextArea } = Input;

const ClinicDetailsStep = ({ formData, setFormData }) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [coordsDetected, setCoordsDetected] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { state } = useLocation();
  const clinicDetails = state?.clinicDetails;

  // Listen for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize coordsDetected based on formData
  useEffect(() => {
    if (formData.clinic_lat && formData.clinic_long) {
      setCoordsDetected(true);
    }
  }, []);

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

        // Get reverse geocoding data including pincode, city, and state
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

        // Show a user-friendly message
        message.error(
          "Location detection failed. Please enter your pincode manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Enhanced reverse geocoding to get pincode, city and state
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Google Maps Geocoding API
      const apiKey = config.GOOGLE_MAPS_API_KEY || ""; // Make sure to add this to your config

      if (!apiKey) {
        console.warn("Google Maps API key not found");
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];
        const components = result.address_components;

        let pincode = "";
        let city = "";
        let state = "";
        // let streetAddress = "";

        // Extract address components
        components.forEach((component) => {
          const types = component.types;

          if (types.includes("postal_code")) {
            pincode = component.long_name;
          } else if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          // else if (types.includes("route")) {
          //   streetAddress += component.long_name + " ";
          // } else if (types.includes("street_number")) {
          //   streetAddress = component.long_name + " " + streetAddress;
          // }
        });

        // If city wasn't found in locality, check for sublocality or administrative_area_level_2
        if (!city) {
          const sublocalityComponent = components.find(
            (component) =>
              component.types.includes("sublocality") ||
              component.types.includes("sublocality_level_1")
          );

          if (sublocalityComponent) {
            city = sublocalityComponent.long_name;
          } else {
            const adminArea2Component = components.find((component) =>
              component.types.includes("administrative_area_level_2")
            );

            if (adminArea2Component) {
              city = adminArea2Component.long_name;
            }
          }
        }

        // Update form with pincode
        if (pincode) {
          setFormData((prev) => ({
            ...prev,
            clinicPincode: pincode,
          }));
        }

        // Set the detected location for display
        if (city && state) {
          setDetectedLocation(`${city}, ${state}`);
        }

        // Optionally update the address field if it's empty
        // if (streetAddress.trim() && !formData.clinicAddress) {
        //   setFormData((prev) => ({
        //     ...prev,
        //     clinicAddress: streetAddress.trim(),
        //   }));
        // }

        return true;
      } else {
        console.warn("Google Geocoding API error or no results:", data.status);
      }
    } catch (error) {
      console.error("Error in Google Maps geocoding:", error);
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
          disabled={clinicDetails}
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
                  onClick={handleDetectLocation}
                  style={{
                    cursor: "pointer",
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
            disabled={clinicDetails}
          />
          {detectedLocation && (
            <div
              style={{
                position: "absolute",
                right: coordsDetected ? "12px" : "150px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#A2A2A8",
                fontSize: "1rem",
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
        <TextArea
          placeholder="Enter your Clinic Address ( Building, Street etc)"
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={handleInputChange}
          rows={isMobile ? 2 : 1}
          style={{
            width: "100%",
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "16px",
            resize: "none",
            padding: isMobile ? "12px" : "0.875rem",
            minHeight: isMobile ? "auto" : "3.5rem",
            lineHeight: "1.5",
          }}
          className={styles.focusedInput}
          disabled={clinicDetails}
        />
      </div>
    </div>
  );
};

export default ClinicDetailsStep;
