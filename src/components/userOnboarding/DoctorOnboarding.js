import React, { useState, useEffect } from "react";
import { Steps, Button, Drawer, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import BasicInfoStep from "./steps/BasicInfoStep";
import ClinicDetailsStep from "./steps/ClinicDetailsStep";
import UploadProofStep from "./steps/UploadProofStep";
import styles from "./DoctorOnboarding.module.css";
import {
  updateOnboardingDetails,
  specialityToDepartmentId,
  finalizeOnboarding,
  uploadDocuments,
  initOnboarding,
  updateLocation,
} from "./services/onboardingService";
import { getUserData, getUtmParams } from "./services/userDataService";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";

const DoctorOnboarding = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userData, setUserData] = useState(null);
  const [utmParams, setUtmParams] = useState(null);
  const [userOnboardingId, setUserOnboardingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    speciality: "",
    clinicName: "",
    clinicPincode: "",
    clinicAddress: "",
    clinic_lat: "",
    clinic_long: "",
    governmentIdProof: null,
    mrcCertificate: null,
  });
  const navigate = useNavigate();

  // Init API call to get user details and determine starting step
  const initializeOnboarding = async (phoneNumber, utm) => {
    setIsInitializing(true);
    try {
      const response = await initOnboarding(phoneNumber, utm);
      console.log("Init response:", response);

      // Store the onboarding ID for future API calls
      setUserOnboardingId(response.id);

      // Pre-fill form data from response
      let updatedFormData = { ...formData };

      // Basic details
      if (response.basicDetails) {
        updatedFormData = {
          ...updatedFormData,
          fullName: response.basicDetails.doctorName || "",
          speciality:
            Object.keys(specialityToDepartmentId).find(
              (key) =>
                specialityToDepartmentId[key] ===
                response.basicDetails.departmentId
            ) || "",
        };
      }

      // Hospital details
      if (response.hospitalDetails) {
        updatedFormData = {
          ...updatedFormData,
          clinicName: response.hospitalDetails.clinicName || "",
          clinicAddress: response.hospitalDetails.clinicAddress || "",
          clinicPincode: response.hospitalDetails.clinicPincode || "",
        };
      }

      setFormData(updatedFormData);

      // if (response.hospitalDetails && response.basicDetails) {
      //   setCurrentStep(2);
      // } else if (response.basicDetails) {
      //   setCurrentStep(1);
      // } else {
      //   setCurrentStep(0);
      // }
    } catch (error) {
      console.error("Error initializing onboarding:", error);
      // If initialization fails, just start from the beginning
      setCurrentStep(0);
    } finally {
      setIsInitializing(false);
    }
  };

  // Load user data and UTM params on mount
  useEffect(() => {
    const user = getUserData();
    const utm = getUtmParams();

    setUserData(user);
    setUtmParams(utm);

    // If the drawer is visible, initialize onboarding
    if (visible) {
      initializeOnboarding(user.phoneNumber, utm);
    }
  }, [visible]);

  // Reset step to first step whenever drawer is opened
  useEffect(() => {
    if (!visible) {
      // Reset the form when the drawer is closed
      setFormData({
        fullName: "",
        speciality: "",
        clinicName: "",
        clinicPincode: "",
        clinicAddress: "",
        clinic_lat: "",
        clinic_long: "",
        governmentIdProof: null,
        mrcCertificate: null,
      });
    }
  }, [visible]);

  const steps = [
    {
      title: "Basic Info",
      content: <BasicInfoStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Clinic Details",
      content: (
        <ClinicDetailsStep formData={formData} setFormData={setFormData} />
      ),
    },
    {
      title: "Upload ID",
      content: (
        <UploadProofStep formData={formData} setFormData={setFormData} />
      ),
    },
  ];

  const handleUpdateOnboardingDetails = async () => {
    // Only submit when moving from step 0 (Basic Info) to step 1 (Clinic Details)
    if (currentStep !== 0) {
      return true;
    }

    if (!formData.fullName || !formData.speciality) {
      message.error("Please fill in all required fields");
      return false;
    }

    setIsSubmitting(true);

    try {
      // Use real user data from context/token
      const doctorData = {
        id: userOnboardingId || userData?.id || "6814921b5e22fe117c85ccc4",
        phone_number: userData?.phoneNumber || "2288333366",
        doctorName: formData.fullName,
        departmentId: specialityToDepartmentId[formData.speciality] || 1,
        // Use real UTM data
        utm_source: utmParams?.utm_source || "Source 4589",
        utm_campaign: utmParams?.utm_campaign || "Campaign 4589",
        utm_term: utmParams?.utm_term || "Term 4589",
        utm_content: utmParams?.utm_content || "Content 4589",
        utm_medium: utmParams?.utm_medium || "Medium 4589",
      };

      await updateOnboardingDetails(doctorData);
      message.success("Basic information saved successfully");
      return true;
    } catch (error) {
      message.error("Failed to update your information. Please try again.");
      console.error("Error updating doctor details:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeOnboarding = async () => {
    // Only submit when moving from step 1 (Clinic Details) to step 2 (Upload ID)
    if (currentStep !== 1) {
      return true;
    }

    if (
      !formData.clinicName ||
      !formData.clinicPincode ||
      !formData.clinicAddress
    ) {
      message.error("Please fill in all required clinic details");
      return false;
    }

    setIsSubmitting(true);

    try {
      // If we have location coordinates, update them first
      if (formData.clinic_lat && formData.clinic_long) {
        try {
          const rawToken = localStorage.getItem(
            PERSISTANT_STORAGE_KEY_AUTH_TOKEN
          );
          if (rawToken) {
            const authToken = JSON.parse(rawToken);
            const locationData = {
              clinic_lat: formData.clinic_lat,
              clinic_long: formData.clinic_long,
            };

            // Call the updateLocation API
            await updateLocation(locationData, authToken);
            console.log("Location coordinates updated successfully");
          }
        } catch (locationError) {
          console.error("Error updating location coordinates:", locationError);
          // Continue with the process even if location update fails
        }
      }

      // Combine all the data for the finalize API
      const finalizeData = {
        id: userOnboardingId || userData?.id || "6814921b5e22fe117c85ccc4",
        phone_number: userData?.phoneNumber || "2288333366",
        doctorName: formData.fullName,
        departmentId: specialityToDepartmentId[formData.speciality] || 1,
        // UTM data
        utm_source: utmParams?.utm_source || "Source 4589",
        utm_campaign: utmParams?.utm_campaign || "Campaign 4589",
        utm_term: utmParams?.utm_term || "Term 4589",
        utm_content: utmParams?.utm_content || "Content 4589",
        utm_medium: utmParams?.utm_medium || "Medium 4589",
        // Clinic data
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        clinicPincode: formData.clinicPincode,
        clinic_lat: formData.clinic_lat || "", // No default fallback in production
        clinic_long: formData.clinic_long || "", // No default fallback in production
      };

      await finalizeOnboarding(finalizeData);
      message.success("Clinic details saved successfully");
      return true;
    } catch (error) {
      message.error("Failed to save clinic details. Please try again.");
      console.error("Error finalizing onboarding:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadDocuments = async () => {
    if (!formData.governmentIdProof || !formData.mrcCertificate) {
      message.error("Please upload both Government ID and MRC Certificate");
      return false;
    }

    setIsSubmitting(true);

    try {
      // Get the auth token
      const rawToken = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);

      if (!rawToken) {
        message.error("Authentication token not found. Please login again.");
        return false;
      }

      const authToken = JSON.parse(rawToken);

      // Upload the documents
      await uploadDocuments(
        formData.governmentIdProof,
        formData.mrcCertificate,
        authToken
      );

      message.success("Documents uploaded successfully");
      return true;
    } catch (error) {
      message.error("Failed to upload documents. Please try again.");
      console.error("Error uploading documents:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const success = await handleUpdateOnboardingDetails();
      if (!success) return;
    } else if (currentStep === 1) {
      const success = await handleFinalizeOnboarding();
      if (!success) return;
    } else if (currentStep === 2) {
      // Upload documents and redirect to home on success
      const success = await handleUploadDocuments();
      if (success) {
        onClose();
        navigate("/");
        return;
      } else {
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const drawerContent = (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            margin: 0,
            color: "#111827",
          }}
        >
          Final Setup!
        </h1>
        {currentStep === 2 ? (
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              onClick={() => {
                onClose();
                navigate("/");
              }}
              className={styles.skipButton}
            >
              Skip & upload later
            </Button>
            <Button
              type="primary"
              onClick={nextStep}
              loading={isSubmitting}
              style={{
                backgroundColor: "#4f46e5",
                borderColor: "#4f46e5",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Finish Setup
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            onClick={nextStep}
            loading={isSubmitting}
            style={{
              backgroundColor: "#4f46e5",
              borderColor: "#4f46e5",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Next
          </Button>
        )}
      </div>

      <div style={{ marginBottom: "60px" }}>
        <div className={styles.stepperOuter}>
          <CustomStepper
            steps={[
              { label: "Basic Info" },
              { label: "Clinic Details" },
              { label: "Upload Proof" },
            ]}
            currentStep={currentStep}
          />
        </div>
      </div>

      <div style={{ paddingTop: "20px" }}>
        {isInitializing ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your information...</p>
          </div>
        ) : (
          steps[currentStep].content
        )}
      </div>
    </div>
  );

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={650}
      maskClosable={false}
      mask={true}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      zIndex={1100}
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DoctorOnboarding;
