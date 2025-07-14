import React, { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import UploadWrittenRx from "./components/UploadWrittenRx";
import UploadedFilesPreview from "./components/UploadedFilesPreview";
import PreviewDrawer from "./components/PreviewDrawer";
import ErrorBoundary from "./components/ErrorBoundary";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import CashManagerContext from "../../context/CashManagerContext";
import {
  getSnapRxFiles,
  createSnapRx,
  editSnapRx,
  uploadSnapRxFiles,
} from "./services/snapRxService";
import {
  SnapRxSessionProvider,
  useSnapRxSession,
} from "./context/SnapRxSessionContext";
import "./SnapRx.scss";
import UploadMoreDrawer from "./components/UploadMoreDrawer";
import FileUploadErrorModal from "../../components/common/FileUploadErrorModal";
import { useSelector } from "react-redux";

function SnapRxContent() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useSnapRxSession();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [smartRxData, setSmartRxData] = useState([]);

  // New state for API uploaded files
  const [apiUploadedFiles, setApiUploadedFiles] = useState([]);
  const [loadingApiFiles, setLoadingApiFiles] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [showUploadInterface, setShowUploadInterface] = useState(false);
  const [isUploadMoreDrawerOpen, setIsUploadMoreDrawerOpen] = useState(false);
  // State for new upload preview drawer
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [isAddingMore, setIsAddingMore] = useState(false);

  const { patient_data, send_path, caseManagerData, pam_id } = state;
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

  const { fileUploadToken } = useSelector((state) => state.snapRx);

  // Fetch uploaded files from API
  const fetchUploadedFiles = useCallback(async () => {
    if (!patient_data?.patient_unique_id || (!tcmId && !sessionId)) {
      return;
    }

    setLoadingApiFiles(true);
    try {
      const response = await getSnapRxFiles(
        patient_data.patient_unique_id,
        tcmId,
        sessionId
      );
      setApiUploadedFiles(response.uploaded_files || []);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      // Don't show error message as files might not exist yet
      setApiUploadedFiles([]);
    } finally {
      setLoadingApiFiles(false);
    }
  }, [patient_data?.patient_unique_id, tcmId, sessionId]);

  // Load uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  // Handle edit file
  const handleEditFile = useCallback(
    (file) => {
      // Find the index of the clicked file in the uploaded files array
      const fileIndex = apiUploadedFiles.findIndex(
        (f) => f.filename === file.filename
      );

      // Map all API files to the format PreviewDrawer expects
      const editFiles = apiUploadedFiles.map((apiFile) => ({
        ...apiFile,
        file: {
          ...apiFile,
          fileUrl: apiFile.fileUrl,
        },
        fileUrl: apiFile.fileUrl,
        name: apiFile.filename,
        type: "image/jpeg",
      }));

      setEditingFile(editFiles[fileIndex]); // Set the current file for initial display
      setIsEditDrawerOpen(true);
    },
    [apiUploadedFiles]
  );

  // Handle edit drawer close
  const handleEditDrawerClose = useCallback(() => {
    setIsEditDrawerOpen(false);
    setEditingFile(null);
  }, []);

  // Handle edit save
  const handleEditSave = useCallback(async (response) => {
    try {
      if (!response || !response.uploaded_files) {
        throw new Error("Invalid response from server");
      }

      fetchUploadedFiles();

      setIsEditDrawerOpen(false);
    } catch (error) {
      console.error("Error in handleEditSave:", error);
      message.error("Failed to update files. Please try again.");
    }
  }, []);

  // Handle upload more
  const handleUploadMore = useCallback(() => {
    setIsUploadMoreDrawerOpen(true);
  }, []);

  const handleUploadMoreDrawerClose = useCallback(() => {
    setIsUploadMoreDrawerOpen(false);
  }, []);

  // Handle back to files
  const handleBackToFiles = useCallback(() => {
    setShowUploadInterface(false);
  }, []);

  // Handle file upload completion
  const handleUploadComplete = useCallback(() => {
    setShowUploadInterface(false);
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  const handleClearFiles = useCallback(() => {
    setUploadedFiles([]);
    setSmartRxData([]);
    // message.info("Files cleared");
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

  // Handle preview drawer close
  const handlePreviewDrawerClose = useCallback(() => {
    setIsPreviewDrawerOpen(false);
    setIsAddingMore(false); // Reset adding more flag when drawer is closed
  }, []);

  // Handle preview save
  const handlePreviewSave = useCallback(() => {
    setUploadedFiles([]); // Clear uploaded files
    setIsPreviewDrawerOpen(false);
    setIsAddingMore(false); // Reset adding more flag
    fetchUploadedFiles(); // Just refresh the API files without reopening drawer
  }, [fetchUploadedFiles]);

  const handleCreateSnapRx = useCallback(async () => {
    if (tcmId) {
      handleEditSnapRx();
      return;
    }
    // Check if there are uploaded files to process
    if (!apiUploadedFiles || apiUploadedFiles.length === 0) {
      message.warning("Please upload prescription images before submitting");
      return;
    }

    // Validate patient data exists
    if (!patient_data?.patient_unique_id) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    setIsUploading(true);

    try {
      // Extract file names from uploaded files
      const fileNames = apiUploadedFiles.map((file) => file.filename);

      // Call create snap rx API
      const response = await createSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        sessionId
      );
      if (response && response.status) {
        // message.success("Prescription created successfully!");
        // Navigate to digitization or next step if needed
        navigate("/snap-rx/preview", {
          state: { ...state, ...response?.data, files: apiUploadedFiles },
        });
      } else {
        throw new Error(response.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating snap rx:", error);
      message.error(
        error.message || "Failed to create prescription. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }, [apiUploadedFiles, patient_data, navigate, state]);

  const handleEditSnapRx = useCallback(async () => {
    // Check if there are uploaded files to process
    if (!apiUploadedFiles || apiUploadedFiles.length === 0) {
      message.warning("Please upload prescription images before submitting");
      return;
    }

    // Validate patient data exists
    if (!patient_data?.patient_unique_id) {
      message.error("Patient information is missing. Please try again.");
      return;
    }

    setIsUploading(true);

    try {
      // Extract file names from uploaded files
      const fileNames = apiUploadedFiles.map((file) => file.filename);

      // Call create snap rx API
      const response = await editSnapRx(
        patient_data.patient_unique_id,
        fileNames,
        tcmId
      );

      if (response && response.status) {
        // message.success("Prescription created successfully!");
        // Navigate to digitization or next step if needed
        navigate("/snap-rx/preview", {
          state: { ...state, ...response?.data, files: apiUploadedFiles },
        });
      } else {
        throw new Error(response.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating snap rx:", error);
      message.error(
        error.message || "Failed to create prescription. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }, [apiUploadedFiles, patient_data, navigate, state]);

  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);
  const handleRetryBtn = () => {
    // setFilesData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(false);
  };

  return (
    <CashManagerContext.Provider value={contextApi}>
      <div className="snap-rx-container">
        <Header
          caseManagerData={caseManagerData}
          smartRxData={smartRxData}
          loader={isUploading}
          onClear={handleClearFiles}
          onSubmit={handleCreateSnapRx}
          onUploadMore={handleUploadMore}
          showUploadMoreButton={apiUploadedFiles && apiUploadedFiles.length > 0}
        />
        <div className="snap-rx-content">
          <ErrorBoundary>
            {/* Conditionally show either uploaded files preview or upload interface */}
            {apiUploadedFiles &&
            apiUploadedFiles.length > 0 &&
            !showUploadInterface &&
            !isAddingMore ? (
              <UploadedFilesPreview
                uploadedFiles={apiUploadedFiles}
                onEdit={handleEditFile}
                onRefresh={fetchUploadedFiles}
                loading={loadingApiFiles}
                onDelete={(filename) => {
                  // Filter out the deleted file
                  const updatedFiles = apiUploadedFiles.filter(
                    (file) => file.filename !== filename
                  );
                  setApiUploadedFiles(updatedFiles);
                }}
              />
            ) : (
              <UploadWrittenRx
                onFileUpload={handlePreviewSave}
                isLoading={isUploading}
                showBackButton={
                  (apiUploadedFiles && apiUploadedFiles.length > 0) ||
                  (isAddingMore && uploadedFiles.length > 0)
                }
                onBack={() => {
                  if (isAddingMore) {
                    // If adding more, go back to preview drawer
                    setIsAddingMore(false);
                    setIsPreviewDrawerOpen(true);
                  } else {
                    // Otherwise, go back to files list
                    handleBackToFiles();
                  }
                }}
                fetchUploadedFiles={fetchUploadedFiles}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Preview drawer for editing existing files */}
      <PreviewDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleEditDrawerClose}
        uploadedFiles={apiUploadedFiles.map((file) => ({
          ...file,
          file: {
            ...file,
            fileUrl: file.fileUrl,
            preview: file.fileUrl,
          },
          fileUrl: file.fileUrl,
          preview: file.fileUrl,
          name: file.filename,
          type: "image/jpeg",
        }))}
        editingFile={editingFile}
        isEditMode={true}
        onReupload={(fileIndex) => {
          // Create a file input element
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*,.pdf";

          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
              // Validate the new file
              const maxFileSize = 15 * 1024 * 1024; // 8MB

              // Validate file type
              if (!file.type.match(/^(image|application\/pdf)/)) {
                const fileExtension = file.name.split(".").pop()?.toLowerCase();
                setIsFileTypeError(`.${fileExtension}`);
                return;
              }

              // Validate file size
              if (file.size > maxFileSize) {
                setIsFileSizeError(true);
                return;
              }

              // Create a preview URL for the new file
              const preview = URL.createObjectURL(file);

              // Create updated file object with preview
              const updatedFile = {
                file,
                preview,
                name: file.name,
                type: file.type,
              };

              // Update the file at the specified index
              const newFiles = [...uploadedFiles];
              newFiles[fileIndex] = updatedFile;
              setUploadedFiles(newFiles);
            }
          };

          input.click();
        }}
        onRemove={(fileIndex) => {
          // Remove file from apiUploadedFiles
          const updatedFiles = apiUploadedFiles.filter(
            (_, index) => index !== fileIndex
          );
          setApiUploadedFiles(updatedFiles);

          // If there are remaining files, set the editing file to the next available one
          if (updatedFiles.length > 0) {
            const newIndex =
              fileIndex >= updatedFiles.length
                ? updatedFiles.length - 1
                : fileIndex;
            setEditingFile({
              ...updatedFiles[newIndex],
              file: {
                ...updatedFiles[newIndex],
                fileUrl: updatedFiles[newIndex].fileUrl,
                preview: updatedFiles[newIndex].fileUrl,
              },
            });
          } else {
            // If no files left, close the drawer
            handleEditDrawerClose();
          }
        }}
        onSave={handleEditSave}
        onAddMore={() => {
          // Check if we've reached the file limit before allowing more uploads
          if (apiUploadedFiles.length >= 5) {
            setIsFileLimitError(true);
            return;
          }

          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*,.pdf";
          input.multiple = true;

          input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              // Validate file count limit
              const totalFileCount = apiUploadedFiles.length + files.length;
              if (totalFileCount > 5) {
                setIsFileLimitError(true);
                return;
              }

              // Validate each file
              const validFiles = [];
              const maxFileSize = 15 * 1024 * 1024; // 8MB

              for (const file of files) {
                // Validate file type
                if (!file.type.match(/^(image|application\/pdf)/)) {
                  const fileExtension = file.name
                    .split(".")
                    .pop()
                    ?.toLowerCase();
                  setIsFileTypeError(`.${fileExtension}`);
                  continue;
                }

                // Validate file size
                if (file.size > maxFileSize) {
                  setIsFileSizeError(true);
                  continue;
                }

                validFiles.push(file);
              }

              if (validFiles.length > 0) {
                const newFiles = validFiles.map((file) => {
                  const fileUrl = URL.createObjectURL(file);
                  return {
                    file: file,
                    fileUrl: fileUrl,
                    preview: fileUrl,
                    filename: file.name,
                    name: file.name,
                    type: file.type,
                    // Add any other required properties here
                  };
                });

                const updatedFiles = [...apiUploadedFiles, ...newFiles];

                // Update the state with new files
                setApiUploadedFiles(updatedFiles);

                // Update the editing file to show the first new file
                const formattedNewFile = {
                  ...newFiles[0],
                  file: {
                    ...newFiles[0],
                    fileUrl: newFiles[0].fileUrl,
                    preview: newFiles[0].fileUrl,
                  },
                  fileUrl: newFiles[0].fileUrl,
                  preview: newFiles[0].fileUrl,
                  name: newFiles[0].filename,
                  type: newFiles[0].type,
                };

                setEditingFile(formattedNewFile);
              }
            }
          };

          input.click();
        }}
      />

      {/* Preview drawer for new uploads - positioned outside container for proper overlay */}
      <PreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={handlePreviewDrawerClose}
        uploadedFiles={uploadedFiles}
        isEditMode={false}
        onReupload={(fileIndex) => {
          // Create a file input element
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*,.pdf";

          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
              // Validate the new file
              const maxFileSize = 15 * 1024 * 1024; // 8MB

              // Validate file type
              if (!file.type.match(/^(image|application\/pdf)/)) {
                const fileExtension = file.name.split(".").pop()?.toLowerCase();
                setIsFileTypeError(`.${fileExtension}`);
                return;
              }

              // Validate file size
              if (file.size > maxFileSize) {
                setIsFileSizeError(true);
                return;
              }

              // Create a preview URL for the new file
              const preview = URL.createObjectURL(file);

              // Create updated file object with preview
              const updatedFile = {
                file,
                preview,
                name: file.name,
                type: file.type,
              };

              // Update the file at the specified index
              const newFiles = [...uploadedFiles];
              newFiles[fileIndex] = updatedFile;
              setUploadedFiles(newFiles);
            }
          };

          input.click();
        }}
        onRemove={(fileIndex) => {
          // Handle remove specific file from uploads
          const newFiles = uploadedFiles.filter(
            (_, index) => index !== fileIndex
          );
          setUploadedFiles(newFiles);
          // Close drawer if no files left
          if (newFiles.length === 0) {
            setIsPreviewDrawerOpen(false);
          }
        }}
        onAddMore={() => {
          // Check if we've reached the file limit before allowing more uploads
          if (uploadedFiles.length >= 5) {
            setIsFileLimitError(true);
            return;
          }
          // Handle add more files - set flag and close drawer to upload more
          setIsAddingMore(true);
          setIsPreviewDrawerOpen(false);
        }}
        onSave={handlePreviewSave}
      />

      <UploadMoreDrawer
        isOpen={isUploadMoreDrawerOpen}
        onClose={handleUploadMoreDrawerClose}
        onFileUpload={async (newFiles) => {
          // When uploading more files, we need to combine existing API files with new files
          try {
            // Get existing files as File objects for upload
            const existingFiles = [];

            // Convert existing API files to File objects
            for (const apiFile of apiUploadedFiles) {
              try {
                const response = await fetch(apiFile.fileUrl);
                const blob = await response.blob();
                const file = new File([blob], apiFile.filename, {
                  type: "image/jpeg",
                });
                existingFiles.push(file);
              } catch (error) {
                console.error("Error converting existing file:", error);
              }
            }

            // Combine existing files with new files
            const allFiles = [...existingFiles, ...newFiles];

            // Upload all files together
            const response = await uploadSnapRxFiles(
              allFiles,
              patient_data?.patient_unique_id,
              sessionId,
              fileUploadToken
            );

            if (response && response.uploaded_files) {
              // Update the API uploaded files with the response
              fetchUploadedFiles();
              setIsUploadMoreDrawerOpen(false);
            } else {
              throw new Error("Invalid response from server");
            }
          } catch (error) {
            console.error("Error uploading files:", error);
            message.error("Failed to upload files. Please try again.");
          }
        }}
      />

      <FileUploadErrorModal
        isFileSizeError={isFileSizeError}
        isFileLimitError={isFileLimitError}
        isFileTypeError={isFileTypeError}
        onRetry={handleRetryBtn}
      />
    </CashManagerContext.Provider>
  );
}

// Main component with session provider
export default function SnapRx() {
  return (
    <SnapRxSessionProvider>
      <SnapRxContent />
    </SnapRxSessionProvider>
  );
}
