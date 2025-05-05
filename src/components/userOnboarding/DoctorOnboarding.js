import React, { useState, useEffect } from "react";
import { Steps, Button, Drawer, message } from "antd";
import BasicInfoStep from "./steps/BasicInfoStep";
import ClinicDetailsStep from "./steps/ClinicDetailsStep";
import UploadProofStep from "./steps/UploadProofStep";
import styles from "./DoctorOnboarding.module.css";
import {
  updateOnboardingDetails,
  specialityToDepartmentId,
  finalizeOnboarding,
  uploadDocuments,
} from "./services/onboardingService";
import { getUserData, getUtmParams } from "./services/userDataService";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";

const DoctorOnboarding = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [utmParams, setUtmParams] = useState(null);
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

  // Load user data and UTM params on mount
  useEffect(() => {
    const user = getUserData();
    const utm = getUtmParams();

    setUserData(user);
    setUtmParams(utm);

    // Pre-fill form data if available
    if (user.doctorName) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.doctorName,
      }));
    }
  }, []);

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
        id: userData?.id || "6814921b5e22fe117c85ccc4",
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
      // Combine all the data for the finalize API
      const finalizeData = {
        id: userData?.id || "6814921b5e22fe117c85ccc4",
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
        clinic_lat: formData.clinic_lat || "23.1092", // Default if not detected
        clinic_long: formData.clinic_long || "72.5848", // Default if not detected
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
      const authToken = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);

      if (!authToken) {
        message.error("Authentication token not found. Please login again.");
        return false;
      }

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
      // if (!success) return;
    } else if (currentStep === 1) {
      const success = await handleFinalizeOnboarding();
      if (!success) return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const skipAndUploadLater = () => {
    // Close drawer and handle later upload logic
    onClose();
  };

  const finishSetup = async () => {
    // Upload documents
    const success = await handleUploadDocuments();
    if (!success) return;

    // If successful, close the drawer
    message.success("Setup completed successfully!");
    onClose();
  };

  const drawerContent = (
    <div className={styles.onboardingContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Final Setup!</h1>
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={nextStep} loading={isSubmitting}>
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={finishSetup} loading={isSubmitting}>
            Finish Setup
          </Button>
        )}
      </div>

      <div className={styles.stepContainer}>
        <Steps
          current={currentStep}
          items={steps.map((item) => ({
            title: item.title,
          }))}
        />
      </div>

      <div className={styles.formContainer}>{steps[currentStep].content}</div>

      {currentStep === steps.length - 1 && (
        <div className={styles.buttonsContainer}>
          <Button className={styles.skipButton} onClick={skipAndUploadLater}>
            Skip & upload later
          </Button>
          <Button type="primary" onClick={finishSetup} loading={isSubmitting}>
            Finish Setup
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={600}
      maskClosable={false}
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DoctorOnboarding;
