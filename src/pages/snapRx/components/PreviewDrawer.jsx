import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import { Button, Skeleton, message, Drawer } from "antd";
import {
  ReloadOutlined,
  UndoOutlined,
  MinusOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadSnapRxFiles } from "../services/snapRxService";
import CashManagerContext from "../../../context/CashManagerContext";
import { useSnapRxSession } from "../context/SnapRxSessionContext";
import "./PreviewDrawer.scss";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";
import FileUploadErrorModal from "../../../components/common/FileUploadErrorModal";
import { useSelector } from "react-redux";

const PreviewDrawer = ({
  isOpen,
  onClose,
  uploadedFiles,
  editingFile,
  isEditMode = false,
  onReupload,
  onRemove,
  onAddMore,
  onSave,
  isUploadMoreDrawer = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  // Remove individual zoom and rotation states
  // const [zoom, setZoom] = useState(1);
  // const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 15,
    y: 15,
    width: 70,
    height: 70,
  });
  const [filesCrops, setFilesCrops] = useState({});
  // Add states to store zoom and rotation for each file
  const [filesZoom, setFilesZoom] = useState({});
  const [filesRotation, setFilesRotation] = useState({});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);
  const { fileUploadToken } = useSelector((state) => state.snapRx);

  const showHideModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const showHideDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleRetryBtn = () => {
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(false);
  };

  // Get patient data from context
  const { patient_data } = useContext(CashManagerContext);
  const { sessionId } = useSnapRxSession();

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Define onImageLoad first before it's used in useEffect
  const onImageLoad = useCallback(
    (e) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;

      // Set default crop to center 70% of the image using percentage units
      const newCrop = filesCrops[selectedFileIndex] || {
        unit: "%",
        x: 15,
        y: 15,
        width: 70,
        height: 70,
      };

      setCrop(newCrop);
      setCompletedCrop(newCrop);
      setImageLoaded(true);
      setImageError(false);
    },
    [selectedFileIndex, filesCrops]
  );

  // Determine the files to work with
  const filesToDisplay = useMemo(() => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return [];
    }

    if (isEditMode) {
      // In edit mode, ensure we have the correct file structure
      return uploadedFiles
        .map((file) => {
          if (!file) return null;

          // Extract the URL from the file object
          const fileUrl =
            file.fileUrl || file.url || (file.file && file.file.fileUrl);

          // Create a properly structured file object
          const processedFile = {
            ...file,
            fileUrl: fileUrl,
            preview: fileUrl, // Use fileUrl as preview as well
            name: file.filename || file.name,
            type: file.type || "image/jpeg",
            // Keep original file data
            originalFile: file,
          };

          return processedFile;
        })
        .filter(Boolean);
    }

    // For upload mode
    return uploadedFiles
      .map((file) => {
        if (!file) return null;
        const preview = file.preview || file.url || file.fileUrl;
        return {
          ...file,
          preview: preview,
          fileUrl: preview,
          name: file.name,
          type: file.type || "image/jpeg",
        };
      })
      .filter(Boolean);
  }, [isEditMode, uploadedFiles]);

  const currentFile = useMemo(() => {
    if (!filesToDisplay || filesToDisplay.length === 0) {
      return null;
    }

    // Ensure index is within bounds
    const validIndex = Math.min(selectedFileIndex, filesToDisplay.length - 1);
    const file = filesToDisplay[validIndex];

    return file;
  }, [filesToDisplay, selectedFileIndex]);

  // Get image URL with error handling
  const getImageUrl = useCallback(
    (file) => {
      if (!file) {
        return null;
      }

      // For edit mode
      if (isEditMode) {
        // Use preview URL which we set in filesToDisplay
        const url = file.preview || file.fileUrl || file.url;
        return url;
      }

      // For upload mode
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        return url;
      }

      const url = file.preview || file.url || file.fileUrl;
      return url;
    },
    [isEditMode]
  );

  const imageUrl = useMemo(() => {
    if (!currentFile) {
      return null;
    }

    const url = getImageUrl(currentFile);
    return url;
  }, [currentFile, getImageUrl]);

  // Load image and manage loading states
  useEffect(() => {
    if (!imageUrl) {
      setImageLoaded(false);
      setImageError(true);
      return;
    }

    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
      onImageLoad({ currentTarget: img });
    };

    img.onerror = (error) => {
      setImageError(true);
      setImageLoaded(false);
    };

    // Set src after all handlers are attached
    setTimeout(() => {
      img.src = imageUrl;
    }, 0);

    return () => {
      img.onload = null;
      img.onerror = null;
      if (img.src) {
        img.src = "";
      }
    };
  }, [imageUrl, onImageLoad]);

  // Helper function to get current file's zoom
  const getCurrentZoom = () => filesZoom[selectedFileIndex] || 1;

  // Helper function to get current file's rotation
  const getCurrentRotation = () => filesRotation[selectedFileIndex] || 0;

  // Reset states when switching files
  useEffect(() => {
    if (currentFile) {
      setImageLoaded(false);
      setImageError(false);

      // Load saved crop for this file if it exists
      const savedCrop = filesCrops[selectedFileIndex];
      if (savedCrop) {
        setCrop(savedCrop);
        setCompletedCrop(savedCrop);
      } else {
        const defaultCrop = {
          unit: "%",
          x: 15,
          y: 15,
          width: 70,
          height: 70,
        };
        setCrop(defaultCrop);
        setCompletedCrop(defaultCrop);
      }
    }
  }, [currentFile, selectedFileIndex, filesCrops]);

  const processImage = async (imageElement, file) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions based on crop or full image
    if (completedCrop) {
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      // Apply crop
      ctx.drawImage(
        imageElement,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
    } else {
      // Use full image
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0);
    }

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob");
            return resolve(null);
          }

          // Create a new File object
          const processedFile = new File(
            [blob],
            file.filename || file.name || "processed_image.jpg",
            { type: "image/jpeg" }
          );
          resolve(processedFile);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let filesToUpload = [];

      if (isEditMode) {
        // Process each file in the filesToDisplay array
        for (
          let fileIndex = 0;
          fileIndex < filesToDisplay.length;
          fileIndex++
        ) {
          const fileObj = filesToDisplay[fileIndex];
          const fileCrop = filesCrops[fileIndex];
          const fileZoom = filesZoom[fileIndex] || 1;
          const fileRotation = filesRotation[fileIndex] || 0;

          // Load the image for processing
          const imgToProcess = new Image();
          imgToProcess.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            imgToProcess.onload = resolve;
            imgToProcess.onerror = reject;
            imgToProcess.src = fileObj.fileUrl || fileObj.preview;
          });

          // Create a canvas for processing
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Apply rotation if needed
          if (fileRotation !== 0) {
            // Adjust canvas size for rotation
            if (fileRotation % 180 !== 0) {
              canvas.width = imgToProcess.naturalHeight;
              canvas.height = imgToProcess.naturalWidth;
            } else {
              canvas.width = imgToProcess.naturalWidth;
              canvas.height = imgToProcess.naturalHeight;
            }

            // Move to center, rotate, and move back
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((fileRotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          } else {
            canvas.width = imgToProcess.naturalWidth;
            canvas.height = imgToProcess.naturalHeight;
          }

          // Apply zoom
          if (fileZoom !== 1) {
            ctx.scale(fileZoom, fileZoom);
          }

          // Apply crop if it exists for this file
          if (fileCrop && fileCrop.width > 0 && fileCrop.height > 0) {
            // Convert crop coordinates to pixel coordinates based on the crop unit
            let cropX, cropY, cropWidth, cropHeight;

            if (fileCrop.unit === "%") {
              cropX = (fileCrop.x / 100) * imgToProcess.naturalWidth;
              cropY = (fileCrop.y / 100) * imgToProcess.naturalHeight;
              cropWidth = (fileCrop.width / 100) * imgToProcess.naturalWidth;
              cropHeight = (fileCrop.height / 100) * imgToProcess.naturalHeight;
            } else {
              // ReactCrop provides pixel coordinates relative to the displayed image
              // We need to scale them to the natural image size
              const displayedImage = imageRef.current;
              if (displayedImage) {
                const scaleX = imgToProcess.naturalWidth / displayedImage.width;
                const scaleY =
                  imgToProcess.naturalHeight / displayedImage.height;

                cropX = fileCrop.x * scaleX;
                cropY = fileCrop.y * scaleY;
                cropWidth = fileCrop.width * scaleX;
                cropHeight = fileCrop.height * scaleY;
              } else {
                // Fallback to direct pixel values
                cropX = fileCrop.x;
                cropY = fileCrop.y;
                cropWidth = fileCrop.width;
                cropHeight = fileCrop.height;
              }
            }

            // Ensure crop coordinates are within bounds
            cropX = Math.max(0, Math.min(cropX, imgToProcess.naturalWidth));
            cropY = Math.max(0, Math.min(cropY, imgToProcess.naturalHeight));
            cropWidth = Math.max(
              1,
              Math.min(cropWidth, imgToProcess.naturalWidth - cropX)
            );
            cropHeight = Math.max(
              1,
              Math.min(cropHeight, imgToProcess.naturalHeight - cropY)
            );

            console.log("Edit Mode - Crop Info:", {
              originalCrop: fileCrop,
              naturalDimensions: {
                width: imgToProcess.naturalWidth,
                height: imgToProcess.naturalHeight,
              },
              displayedDimensions: imageRef.current
                ? {
                    width: imageRef.current.width,
                    height: imageRef.current.height,
                  }
                : null,
              finalCrop: {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight,
              },
            });

            // Set canvas dimensions to cropped size
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            // Draw the cropped portion
            ctx.drawImage(
              imgToProcess,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              cropWidth,
              cropHeight
            );
          } else {
            // Use full image for other files
            canvas.width = imgToProcess.naturalWidth;
            canvas.height = imgToProcess.naturalHeight;
            ctx.drawImage(imgToProcess, 0, 0);
          }

          // Convert to blob
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.95)
          );

          if (!blob) {
            throw new Error("Failed to process image");
          }

          // Create a new File object
          const processedFile = new File(
            [blob],
            fileObj.filename || fileObj.name || "processed_image.jpg",
            { type: "image/jpeg" }
          );
          filesToUpload.push(processedFile);
        }
      } else {
        // Handle upload mode - process each file
        for (let fileIndex = 0; fileIndex < uploadedFiles.length; fileIndex++) {
          const fileObj = uploadedFiles[fileIndex];
          const fileCrop = filesCrops[fileIndex];
          const fileZoom = filesZoom[fileIndex] || 1;
          const fileRotation = filesRotation[fileIndex] || 0;
          if (!fileObj || (!fileObj.file && !fileObj.preview)) continue;

          // Always process through canvas to ensure cropping is applied
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = fileObj.preview || URL.createObjectURL(fileObj.file);
          });

          // Create a canvas for processing
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Apply rotation if needed
          if (fileRotation !== 0) {
            // Adjust canvas size for rotation
            if (fileRotation % 180 !== 0) {
              canvas.width = img.naturalHeight;
              canvas.height = img.naturalWidth;
            } else {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
            }

            // Move to center, rotate, and move back
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((fileRotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          } else {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }

          // Apply zoom
          if (fileZoom !== 1) {
            ctx.scale(fileZoom, fileZoom);
          }

          // Apply crop if it exists for this file
          if (fileCrop && fileCrop.width > 0 && fileCrop.height > 0) {
            // Convert crop coordinates to pixel coordinates based on the crop unit
            let cropX, cropY, cropWidth, cropHeight;

            if (fileCrop.unit === "%") {
              cropX = (fileCrop.x / 100) * img.naturalWidth;
              cropY = (fileCrop.y / 100) * img.naturalHeight;
              cropWidth = (fileCrop.width / 100) * img.naturalWidth;
              cropHeight = (fileCrop.height / 100) * img.naturalHeight;
            } else {
              // ReactCrop provides pixel coordinates relative to the displayed image
              // We need to scale them to the natural image size
              const displayedImage = imageRef.current;
              if (displayedImage) {
                const scaleX = img.naturalWidth / displayedImage.width;
                const scaleY = img.naturalHeight / displayedImage.height;

                cropX = fileCrop.x * scaleX;
                cropY = fileCrop.y * scaleY;
                cropWidth = fileCrop.width * scaleX;
                cropHeight = fileCrop.height * scaleY;
              } else {
                // Fallback to direct pixel values
                cropX = fileCrop.x;
                cropY = fileCrop.y;
                cropWidth = fileCrop.width;
                cropHeight = fileCrop.height;
              }
            }

            // Ensure crop coordinates are within bounds
            cropX = Math.max(0, Math.min(cropX, img.naturalWidth));
            cropY = Math.max(0, Math.min(cropY, img.naturalHeight));
            cropWidth = Math.max(
              1,
              Math.min(cropWidth, img.naturalWidth - cropX)
            );
            cropHeight = Math.max(
              1,
              Math.min(cropHeight, img.naturalHeight - cropY)
            );

            console.log("Upload Mode - Crop Info:", {
              originalCrop: fileCrop,
              naturalDimensions: {
                width: img.naturalWidth,
                height: img.naturalHeight,
              },
              displayedDimensions: imageRef.current
                ? {
                    width: imageRef.current.width,
                    height: imageRef.current.height,
                  }
                : null,
              finalCrop: {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight,
              },
            });

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(
              img,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              cropWidth,
              cropHeight
            );
          } else {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
          }

          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.95)
          );

          if (blob) {
            const processedFile = new File(
              [blob],
              fileObj.name || "processed_image.jpg",
              { type: "image/jpeg" }
            );
            filesToUpload.push(processedFile);
          } else {
            throw new Error(`Failed to process file: ${fileObj.name}`);
          }
        }
      }

      // Validate we have files to upload
      if (!filesToUpload || filesToUpload.length === 0) {
        throw new Error("No valid files to upload");
      }

      if (isUploadMoreDrawer) {
        // For upload more drawer, pass the processed files to the parent component
        setUploading(false);
        onSave(filesToUpload);
        onClose();
      } else {
        // For regular upload, upload files to the server
        const response = await uploadSnapRxFiles(
          filesToUpload,
          patient_data?.patient_unique_id,
          sessionId,
          fileUploadToken
        );

        if (!response || !response.uploaded_files) {
          throw new Error("Invalid response from server");
        }

        setUploading(false);
        onSave(response);
        onClose();
      }
    } catch (error) {
      setUploading(false);
      console.error("Error uploading files:", error);
      message.error(error.message || "Failed to upload files");
    }
  };

  const handleZoomIn = () => {
    const currentZoom = getCurrentZoom();
    const newZoom = Math.min(currentZoom + 0.1, 3);
    setFilesZoom((prev) => ({
      ...prev,
      [selectedFileIndex]: newZoom,
    }));
  };

  const handleZoomOut = () => {
    const currentZoom = getCurrentZoom();
    const newZoom = Math.max(currentZoom - 0.1, 1);
    setFilesZoom((prev) => ({
      ...prev,
      [selectedFileIndex]: newZoom,
    }));
  };

  const handleRotateLeft = () => {
    const currentRotation = getCurrentRotation();
    const newRotation = (currentRotation - 90) % 360;
    setFilesRotation((prev) => ({
      ...prev,
      [selectedFileIndex]: newRotation,
    }));
  };

  const handleReupload = async () => {
    try {
      // Just call the parent's onReupload function
      if (onReupload) {
        await onReupload(selectedFileIndex);
      }
    } catch (error) {
      console.error("Error handling reupload:", error);
      message.error("Failed to reupload file. Please try again.");
    }
  };

  const handleRemoveFile = () => {
    // Call the parent's onRemove function
    if (onRemove) {
      onRemove(selectedFileIndex);
    }

    // Update local states after removal
    // Remove the crop, zoom, and rotation data for this file
    setFilesCrops((prev) => {
      const newCrops = { ...prev };
      delete newCrops[selectedFileIndex];
      // Shift remaining indices down
      Object.keys(newCrops).forEach((key) => {
        const index = parseInt(key);
        if (index > selectedFileIndex) {
          newCrops[index - 1] = newCrops[index];
          delete newCrops[index];
        }
      });
      return newCrops;
    });

    setFilesZoom((prev) => {
      const newZoom = { ...prev };
      delete newZoom[selectedFileIndex];
      // Shift remaining indices down
      Object.keys(newZoom).forEach((key) => {
        const index = parseInt(key);
        if (index > selectedFileIndex) {
          newZoom[index - 1] = newZoom[index];
          delete newZoom[index];
        }
      });
      return newZoom;
    });

    setFilesRotation((prev) => {
      const newRotation = { ...prev };
      delete newRotation[selectedFileIndex];
      // Shift remaining indices down
      Object.keys(newRotation).forEach((key) => {
        const index = parseInt(key);
        if (index > selectedFileIndex) {
          newRotation[index - 1] = newRotation[index];
          delete newRotation[index];
        }
      });
      return newRotation;
    });

    // Update selected index if necessary
    if (filesToDisplay.length > 1) {
      // If we're removing the last file, select the previous one
      if (selectedFileIndex === filesToDisplay.length - 1) {
        setSelectedFileIndex(selectedFileIndex - 1);
      }
      // If we're removing a file in the middle or start, keep the same index
      // as it will now point to the next file
    }
  };

  const handleAddMoreFiles = () => {
    // Check if we've reached the file limit before allowing more uploads
    if (filesToDisplay && filesToDisplay.length >= 5) {
      setIsFileLimitError(true);
      return;
    }

    // In upload mode, trigger add more
    if (onAddMore) {
      onAddMore();
    }
  };

  const handleBackAndCleanup = () => {
    // Clean up all preview URLs
    filesToDisplay.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    // Reset all states
    setFilesCrops({});
    setFilesZoom({});
    setFilesRotation({});
    setSelectedFileIndex(0);
    setImageLoaded(false);
    setImageError(false);
    setCrop({
      unit: "%",
      x: 15,
      y: 15,
      width: 70,
      height: 70,
    });
    setCompletedCrop(null);

    // Notify parent to clear files
    if (onSave) {
      onSave([]);
    }

    // Close modals
    showHideBackModal();
    onClose();
  };

  const BACK_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isBackModalOpen}
        onCancel={showHideBackModal}
        modalWidth={500}
        title={"Are you sure you want to go back?"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>
                  You have unsaved uploads. If you go back now, your uploaded
                  data will not be saved.
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={handleBackAndCleanup}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Go Back
                </div>
                <Button
                  onClick={showHideBackModal}
                  type="primary"
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No, Stay</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isBackModalOpen]);

  const DELETE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isDeleteModalOpen}
        onCancel={showHideDeleteModal}
        modalWidth={500}
        title={"You may lose your data"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>Are you sure you want to delete this template?</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => {
                    onRemove(selectedFileIndex);
                    showHideModal();
                  }}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes Delete
                </div>
                <Button
                  onClick={showHideModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isDeleteModalOpen]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={showHideBackModal}
            style={{ padding: "4px 8px" }}
          />
          <span>{isEditMode ? "Edit Rx" : "Rx Preview"}</span>
        </div>
      }
      width="45.625rem"
      maxWidth="45.625rem"
      placement="right"
      onClose={onClose}
      open={isOpen}
      // destroyOnClose={true}
      maskClosable={false}
      closable={false}
      extra={
        <Button
          type="primary"
          onClick={handleSave}
          loading={uploading}
          disabled={uploading || filesToDisplay.length === 0}
        >
          {uploading ? "Uploading..." : "Save"}
        </Button>
      }
      styles={{
        body: {
          padding: "24px",
          // height: "calc(100vh - 108px)",
          // overflow: "hidden",
        },
      }}
    >
      <div className="preview-drawer-content">
        {/* Main Preview Area */}
        <div className="preview-container">
          <div className="preview-area">
            {
              // loading ? (
              //   <div className="skeleton-container">
              //     <Skeleton.Image
              //       style={{
              //         width: "100%",
              //         height: "100%",
              //         borderRadius: "20px",
              //       }}
              //       active
              //     />
              //   </div>
              // ) :
              imageError ? (
                <div className="error-container">
                  <div className="error-content">
                    <div className="error-icon">⚠️</div>
                    <p>Failed to load image</p>
                    <button onClick={handleReupload} className="retry-btn">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="crop-container">
                    <ReactCrop
                      crop={crop}
                      onChange={(newCrop) => {
                        setCrop(newCrop);
                      }}
                      onComplete={(completedCrop) => {
                        setCompletedCrop(completedCrop);
                        // Store the crop for this file
                        setFilesCrops((prev) => ({
                          ...prev,
                          [selectedFileIndex]: completedCrop,
                        }));
                      }}
                      aspect={undefined}
                      className="react-crop-wrapper"
                    >
                      <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Prescription"
                        className="prescription-image"
                        onLoad={onImageLoad}
                        crossOrigin="anonymous"
                        style={{
                          transform: `scale(${getCurrentZoom()}) rotate(${getCurrentRotation()}deg)`,
                          transformOrigin: "center center",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          height: "auto",
                          width: "auto",
                        }}
                        onError={(e) => {
                          console.error(
                            "Failed to load preview image:",
                            imageUrl
                          );
                          setImageError(true);
                          setImageLoaded(false);
                        }}
                      />
                    </ReactCrop>
                  </div>
                  {/* Action Bar - moved outside preview area */}
                  <div className="action-bar">
                    <div className="action-buttons">
                      <button
                        className="action-btn reupload-btn"
                        onClick={handleReupload}
                      >
                        <ReloadOutlined />
                        <span>Reupload</span>
                      </button>

                      <button
                        className="action-btn remove-btn"
                        onClick={handleRemoveFile}
                      >
                        <i
                          className="icon-delete fs-21"
                          style={{ color: "#FC5A5A" }}
                        ></i>
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="zoom-controls">
                      <button
                        className="zoom-btn reset-btn"
                        onClick={handleRotateLeft}
                      >
                        <UndoOutlined />
                      </button>

                      <div className="zoom-btn-combined">
                        <button
                          className="zoom-btn-part minus-btn"
                          onClick={handleZoomOut}
                        >
                          <MinusOutlined />
                        </button>
                        <div className="zoom-divider"></div>
                        <button
                          className="zoom-btn-part plus-btn"
                          onClick={handleZoomIn}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>

        {/* Thumbnails Section */}
        <div className="thumbnails-section">
          {filesToDisplay && filesToDisplay.length > 0 ? (
            filesToDisplay.map((file, index) => {
              const thumbUrl = getImageUrl(file);
              return (
                <div
                  key={index}
                  className={`thumbnail-item ${
                    index === selectedFileIndex ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedFileIndex(index);
                    // Reset states for new image
                    setCrop({
                      unit: "%",
                      x: 15,
                      y: 15,
                      width: 70,
                      height: 70,
                    });
                    setCompletedCrop(null);
                    // setZoom(1); // Removed
                    // setRotation(0); // Removed
                    setImageLoaded(false);
                    setImageError(false);
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={`Page ${index + 1}`}
                    className="thumbnail-img"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error("Failed to load thumbnail:", thumbUrl);
                      e.target.style.display = "none";
                      const errorDiv = document.createElement("div");
                      errorDiv.className = "thumbnail-error";
                      errorDiv.innerHTML = "⚠️";
                      e.target.parentNode.appendChild(errorDiv);
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="no-files-message">No files to display</div>
          )}

          {filesToDisplay && filesToDisplay.length > 0 && (
            <div className="add-more-item" onClick={handleAddMoreFiles}>
              <div className="add-icon">
                <CloudUploadOutlined className="upload-icon" />
              </div>
              <span className="add-text">Add More</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {DELETE_MODAL}
      {BACK_MODAL}
      <FileUploadErrorModal
        isFileSizeError={isFileSizeError}
        isFileLimitError={isFileLimitError}
        isFileTypeError={isFileTypeError}
        onRetry={handleRetryBtn}
      />
    </Drawer>
  );
};

export default PreviewDrawer;
