import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import UploadWrittenRx from "./components/UploadWrittenRx";
import ErrorBoundary from "./components/ErrorBoundary";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import CashManagerContext from "../../context/CashManagerContext";

export default function SnapRx() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [smartRxData, setSmartRxData] = useState([]);

  console.log(state);
  const { patient_data, send_path, caseManagerData, pam_id } = state || {};
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const pamId = pam_id
    ? pam_id
    : caseManagerData !== undefined
    ? caseManagerData.pam_id
    : 0;

  const contextApi = {
    patient_data,
    send_path,
    tcmId,
    pamId,
  };

  const handleFileUpload = useCallback(
    async (files) => {
      if (!files || files.length === 0) {
        message.error("Please select files to upload");
        return;
      }

      // Validate patient data exists
      if (!patient_data?.patient_unique_id) {
        message.error("Patient information is missing. Please try again.");
        return;
      }

      setIsUploading(true);

      try {
        // Create FormData for file upload
        const formData = new FormData();

        // Validate each file before adding to FormData
        const validFiles = [];
        for (const file of files) {
          if (file.size === 0) {
            message.warning(`Skipping empty file: ${file.name}`);
            continue;
          }
          if (file.size > 10 * 1024 * 1024) {
            // 10MB limit
            message.warning(`File too large (${file.name}): Max 10MB allowed`);
            continue;
          }
          validFiles.push(file);
          formData.append(`files`, file);
        }

        if (validFiles.length === 0) {
          message.error("No valid files to upload");
          return;
        }

        // Add patient information
        formData.append("patientId", patient_data.patient_unique_id);
        formData.append("tcmId", tcmId.toString());
        formData.append("pamId", pamId.toString());
        formData.append("timestamp", new Date().toISOString());

        // Simulate API call with error scenarios
        const uploadPromises = validFiles.map((file, index) => {
          return new Promise((resolve, reject) => {
            // Simulate different scenarios
            const delay = 1000 + Math.random() * 2000;
            const shouldFail = Math.random() < 0.1; // 10% chance of failure for testing

            setTimeout(() => {
              if (shouldFail) {
                reject(new Error(`Upload failed for ${file.name}`));
              } else {
                resolve({
                  id: `file_${Date.now()}_${index}`,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: URL.createObjectURL(file), // Temporary URL for preview
                  uploadedAt: new Date().toISOString(),
                  status: "uploaded",
                });
              }
            }, delay);
          });
        });

        const uploadResults = await Promise.allSettled(uploadPromises);

        // Separate successful and failed uploads
        const successfulUploads = [];
        const failedUploads = [];

        uploadResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            successfulUploads.push(result.value);
          } else {
            failedUploads.push({
              file: validFiles[index],
              error: result.reason.message,
            });
          }
        });

        // Update state with successful uploads
        if (successfulUploads.length > 0) {
          setUploadedFiles((prevFiles) => [...prevFiles, ...successfulUploads]);
          setSmartRxData(successfulUploads);
          message.success(
            `Successfully uploaded ${successfulUploads.length} file(s)`
          );
        }

        // Report failed uploads
        if (failedUploads.length > 0) {
          failedUploads.forEach((failed) => {
            message.error(`Failed to upload: ${failed.file.name}`);
          });
        }

        // If all uploads failed
        if (successfulUploads.length === 0) {
          throw new Error("All file uploads failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        message.error(
          error.message ||
            "Failed to upload files. Please check your connection and try again."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [patient_data, tcmId, pamId]
  );

  const handleClearFiles = useCallback(() => {
    setUploadedFiles([]);
    setSmartRxData([]);
    message.info("Files cleared");
  }, []);

  const handleSubmitFiles = useCallback(() => {
    if (uploadedFiles.length === 0) {
      message.warning("Please upload at least one file before submitting");
      return;
    }

    // Process the uploaded files for prescription generation
    message.success("Processing prescription files...");
    // You can add additional processing logic here
  }, [uploadedFiles]);

  if (!patient_data) {
    return <Navigate to="/login" />;
  }
  return (
    <CashManagerContext.Provider value={contextApi}>
      <div>
        <Header
          caseManagerData={caseManagerData}
          smartRxData={smartRxData}
          loader={isUploading}
          onClear={handleClearFiles}
          onSubmit={handleSubmitFiles}
        />
        <ErrorBoundary>
          <UploadWrittenRx
            onFileUpload={handleFileUpload}
            isLoading={isUploading}
          />
        </ErrorBoundary>
      </div>
    </CashManagerContext.Provider>
  );
}
