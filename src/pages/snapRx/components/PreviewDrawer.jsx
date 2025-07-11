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
}) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showHideModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Get patient data from context
  const { patient_data } = useContext(CashManagerContext);
  const { sessionId } = useSnapRxSession();

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Define onImageLoad first before it's used in useEffect
  const onImageLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    // Set default crop to center 80% of the image
    const cropWidth = naturalWidth * 0.7;
    const cropHeight = naturalHeight * 0.7;
    const cropX = (naturalWidth - cropWidth) / 2;
    const cropY = (naturalHeight - cropHeight) / 2;

    const newCrop = {
      unit: "px",
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    };

    setCrop(newCrop);
    setCompletedCrop(newCrop);
  }, []);

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

  // Reset states when switching files
  useEffect(() => {
    if (currentFile) {
      setImageLoaded(false);
      setImageError(false);
      setZoom(1);
      setRotation(0);
      setCrop({
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
      setCompletedCrop(null);
    }
  }, [currentFile]);

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
        // Get the current image element
        const img = imageRef.current;
        if (!img) {
          throw new Error("No image loaded for processing");
        }

        // Process each file in the filesToDisplay array
        for (const fileObj of filesToDisplay) {
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

          // Set canvas dimensions based on crop or full image
          if (completedCrop && fileObj === currentFile) {
            // Apply crop only to the current file being edited
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;

            ctx.drawImage(
              imgToProcess,
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
        for (const fileObj of uploadedFiles) {
          if (!fileObj || (!fileObj.file && !fileObj.preview)) continue;

          if (fileObj.preview) {
            // Load the preview image
            const img = new Image();
            img.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = fileObj.preview;
            });

            // Create a canvas for processing
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (completedCrop) {
              canvas.width = completedCrop.width;
              canvas.height = completedCrop.height;

              ctx.drawImage(
                img,
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
            }
          } else if (fileObj.file) {
            filesToUpload.push(fileObj.file);
          }
        }
      }

      // Validate we have files to upload
      if (!filesToUpload || filesToUpload.length === 0) {
        throw new Error("No valid files to upload");
      }

      // Upload files to the server
      const response = await uploadSnapRxFiles(
        filesToUpload,
        patient_data?.patient_unique_id,
        sessionId
      );

      if (!response || !response.uploaded_files) {
        throw new Error("Invalid response from server");
      }

      setUploading(false);
      onSave(response);
      onClose();
    } catch (error) {
      setUploading(false);
      console.error("Error uploading files:", error);
      message.error(error.message || "Failed to upload files");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReupload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const preview = URL.createObjectURL(file);

          if (isEditMode) {
            // In edit mode, update the current file with the new one
            const updatedFile = {
              ...currentFile,
              file: file,
              preview: preview,
              fileUrl: preview, // For edit mode preview
              name: file.name,
              type: file.type,
            };

            // Reset states for the new image
            setRotation(0);
            setZoom(1);
            setImageLoaded(false);
            setImageError(false);

            // Update parent component
            if (onReupload) {
              await onReupload(selectedFileIndex, [updatedFile]);
            }
          } else {
            // In upload mode, just pass the index to parent
            if (onReupload) {
              await onReupload(selectedFileIndex);
            }
          }
        }
      };

      input.click();
    } catch (error) {
      console.error("Error handling reupload:", error);
      message.error("Failed to reupload file. Please try again.");
    }
  };

  const handleRemoveFile = () => {
    if (isEditMode) {
      // In edit mode, just close the drawer
      if (onRemove) {
        onRemove(selectedFileIndex);
      }
    } else {
      // In upload mode, show confirmation modal
      showHideModal();
    }
  };

  const handleAddMoreFiles = () => {
    // In upload mode, trigger add more
    if (onAddMore) {
      onAddMore();
    }
  };

  const handleDrawerScroll = (e) => {
    e.stopPropagation();
  };

  const DELETE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isModalOpen}
        onCancel={() => showHideModal()}
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
                  onClick={() => onRemove(selectedFileIndex)}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Go Back
                </div>
                <Button
                  onClick={() => showHideModal()}
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
  }, [isModalOpen]);

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
            onClick={onClose}
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
                      onChange={(newCrop) => setCrop(newCrop)}
                      onComplete={(completedCrop) =>
                        setCompletedCrop(completedCrop)
                      }
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
                          transform: `scale(${zoom}) rotate(${rotation}deg)`,
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
                      x: 10,
                      y: 10,
                      width: 80,
                      height: 80,
                    });
                    setCompletedCrop(null);
                    setZoom(1);
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
    </Drawer>
  );
};

export default PreviewDrawer;
