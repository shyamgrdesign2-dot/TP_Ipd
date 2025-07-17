import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import { Button, Skeleton, message, Drawer } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
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
import { getDecodedToken } from "../../../utils/localStorage";
import { trackEvent } from "../../../utils/utils";
import { EVENTS } from "../../../utils/events";

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
      setLoading(false);
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
        trackEvent(EVENTS.SNAP_RX.uploadSuccess, {
          patient_unique_id: patient_data?.patient_unique_id,
          doctor_id: getDecodedToken()?.user_id,
          upload_source: "EMR",
        });

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
    isEditMode &&
      trackEvent(EVENTS.SNAP_RX.reuploadRxClicked, {
        // consultation_id: tcmId,
        reupload_count: 1,
      });
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
      width="45.625rem"
      maxWidth="45.625rem"
      placement="right"
      onClose={onClose}
      open={isOpen}
      headerStyle={{
        display: "none",
      }}
      maskClosable={false}
    >
      <div className="modalCard-header h-60 align-items-center justify-content-between d-flex position-sticky top-0 z-2">
        <div className="align-items-center d-flex h-100">
          <div className="border-end h-100 text-center me-3">
            <div
              onClick={showHideBackModal}
              className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
            >
              <i className="icon-right"></i>
            </div>
          </div>
          <div className="snaprx-drawer-title">
            {isEditMode ? "Edit Rx" : "Rx Preview"}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button
            type="button"
            onClick={handleSave}
            loading={uploading}
            disabled={uploading || filesToDisplay.length === 0}
            className="btn align-items-center d-flex btn-41 btn-primary3 me-20 save-btn"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="preview-drawer-content" style={{ padding: "24px" }}>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_252_25491)">
                            <path
                              d="M3.42366 8.62034C3.78835 8.56966 4.12493 8.82401 4.17561 9.1887C4.31855 10.217 4.79633 11.1701 5.53401 11.9006C6.27168 12.631 7.22908 13.0988 8.25862 13.2317C9.28827 13.3645 10.3333 13.1553 11.2323 12.636C11.8237 12.2943 12.3303 11.8305 12.7215 11.2805H11.5155C11.1474 11.2804 10.8494 10.9816 10.8494 10.6135C10.8495 10.2454 11.1474 9.94664 11.5155 9.94651H14.1825C14.5506 9.94656 14.8494 10.2454 14.8494 10.6135V13.2805C14.8493 13.6486 14.5505 13.9465 14.1825 13.9465C13.8143 13.9465 13.5156 13.6486 13.5155 13.2805V12.4319C13.0631 12.972 12.5174 13.4331 11.8992 13.7903C10.747 14.4559 9.40748 14.7242 8.08772 14.5539C6.7681 14.3836 5.541 13.7841 4.59554 12.8479C3.65007 11.9116 3.03851 10.6902 2.8553 9.37229C2.80464 9.00771 3.05914 8.67117 3.42366 8.62034ZM5.79866 3.43772C6.95086 2.77208 8.29047 2.50281 9.61019 2.67307C10.9299 2.84337 12.1568 3.44377 13.1024 4.38011C14.0478 5.31643 14.6594 6.5377 14.8426 7.85569C14.893 8.22022 14.6388 8.55698 14.2742 8.60765C13.9096 8.6583 13.573 8.40298 13.5223 8.03831C13.3793 7.0103 12.9023 6.05777 12.1649 5.32737C11.4272 4.59682 10.469 4.12918 9.43929 3.99632C8.40968 3.86352 7.36457 4.0727 6.46565 4.59202C5.87433 4.93372 5.36751 5.39757 4.9764 5.94749H6.18245C6.55058 5.94749 6.84935 6.2454 6.84944 6.6135C6.84944 6.98169 6.55064 7.2805 6.18245 7.2805H3.51546C3.14743 7.28031 2.84944 6.98158 2.84944 6.6135V3.94749C2.84944 3.57942 3.14743 3.28069 3.51546 3.2805C3.88365 3.2805 4.18245 3.5793 4.18245 3.94749V4.79515C4.63465 4.25516 5.18074 3.79479 5.79866 3.43772Z"
                              fill="#4B4AD5"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_252_25491">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0.849121 0.61377)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>Reupload</span>
                      </button>

                      <button
                        className="action-btn remove-btn"
                        onClick={handleRemoveFile}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.59317 3.74727L6.04122 2.40311C6.13196 2.13089 6.38672 1.94727 6.67367 1.94727H10.2737C10.5606 1.94727 10.8154 2.13089 10.9061 2.40311L11.3542 3.74727H14.4736C14.8418 3.74727 15.1403 4.04574 15.1403 4.41393C15.1403 4.78212 14.8418 5.0806 14.4736 5.0806H13.9023L13.413 13.398C13.3508 14.4552 12.4754 15.2806 11.4165 15.2806H5.53088C4.47193 15.2806 3.59652 14.4552 3.53433 13.398L3.04507 5.0806H2.48429C2.1161 5.0806 1.81763 4.78212 1.81763 4.41393C1.81763 4.04574 2.1161 3.74727 2.48429 3.74727H5.59317ZM6.99862 3.74727H9.94872L9.79317 3.2806H7.15418L6.99862 3.74727ZM12.5666 5.0806H4.38071L4.86536 13.3197C4.88609 13.6721 5.1779 13.9473 5.53088 13.9473H11.4165C11.7695 13.9473 12.0613 13.6721 12.082 13.3197L12.5666 5.0806ZM9.6083 6.77235C9.63127 6.40487 9.94779 6.1256 10.3153 6.14856C10.6827 6.17153 10.962 6.48804 10.939 6.85552L10.639 11.6555C10.6161 12.023 10.2996 12.3023 9.93209 12.2793C9.56461 12.2563 9.28534 11.9398 9.3083 11.5723L9.6083 6.77235ZM7.63904 11.5723C7.66201 11.9398 7.38273 12.2563 7.01526 12.2793C6.64779 12.3023 6.33127 12.023 6.3083 11.6555L6.0083 6.85552C5.98534 6.48804 6.26461 6.17153 6.63209 6.14856C6.99956 6.1256 7.31607 6.40487 7.33904 6.77235L7.63904 11.5723Z"
                            fill="#FC5A5A"
                          />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="zoom-controls">
                      <button className="rotate-btn" onClick={handleRotateLeft}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2.96899 3.19441C2.96899 2.87373 3.2263 2.61377 3.54369 2.61377C3.86109 2.61377 4.1184 2.87373 4.1184 3.19441V4.4174C5.88049 2.59529 8.6385 2.07498 10.9664 3.2221C13.9136 4.67442 15.1376 8.26566 13.7001 11.2434C12.2626 14.2211 8.7081 15.4576 5.76085 14.0053C4.58378 13.4253 3.64147 12.4818 3.05832 11.3076C2.91598 11.021 3.03056 10.672 3.31426 10.5282C3.59795 10.3844 3.94331 10.5002 4.08566 10.7868C4.556 11.7339 5.31466 12.4934 6.26472 12.9616C8.64141 14.1327 11.5078 13.1355 12.667 10.7343C13.8262 8.33304 12.8392 5.43702 10.4625 4.26585C8.37852 3.23891 5.89086 3.87539 4.53259 5.71051H6.60877C6.92616 5.71051 7.18347 5.97047 7.18347 6.29115C7.18347 6.61183 6.92616 6.87179 6.60877 6.87179H3.54369C3.2263 6.87179 2.96899 6.61183 2.96899 6.29115V6.24754C2.96887 6.23824 2.96899 3.19441 2.96899 3.19441Z"
                            fill="#454551"
                          />
                        </svg>
                      </button>

                      <div className="zoom-btn-combined">
                        <div className="cursor-pointer" onClick={handleZoomOut}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.0783 8.61499H14.887C15.2664 8.61499 15.574 9.06271 15.574 9.61499C15.574 10.1673 15.2664 10.615 14.887 10.615H10.0783H8.7044H3.8957C3.5163 10.615 3.20874 10.1673 3.20874 9.61499C3.20874 9.06271 3.5163 8.61499 3.8957 8.61499H8.7044L10.0783 8.61499Z"
                              fill="#454551"
                            />
                          </svg>
                        </div>
                        <div className="zoom-divider"></div>
                        <div className="cursor-pointer" onClick={handleZoomIn}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.3 9.01338H14.5C14.8314 9.01338 15.1 9.28201 15.1 9.61338C15.1 9.94475 14.8314 10.2134 14.5 10.2134H10.3V14.4134C10.3 14.7447 10.0314 15.0134 9.70005 15.0134C9.36868 15.0134 9.10005 14.7447 9.10005 14.4134V10.2134H4.90005C4.56868 10.2134 4.30005 9.94475 4.30005 9.61338C4.30005 9.28201 4.56868 9.01338 4.90005 9.01338H9.10005V4.81338C9.10005 4.48201 9.36868 4.21338 9.70005 4.21338C10.0314 4.21338 10.3 4.48201 10.3 4.81338V9.01338Z"
                              fill="#454551"
                            />
                          </svg>
                        </div>
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
