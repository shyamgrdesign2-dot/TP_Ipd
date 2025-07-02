import React, { useState, useEffect, useCallback, useRef } from "react";
import { Skeleton, message } from "antd";
import "./PreviewDrawer.scss";

const PreviewDrawer = ({
  isOpen,
  onClose,
  uploadedFiles,
  onReupload,
  onRemove,
  onAddMore,
  onSave,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && uploadedFiles.length > 0) {
      setLoading(true);
      setImageLoaded(false);
      setImageError(false);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, uploadedFiles, selectedFileIndex]);

  const currentFile = uploadedFiles[selectedFileIndex];
  const imageUrl = currentFile?.url || currentFile?.preview;

  // Check if image loads properly
  useEffect(() => {
    if (imageUrl && !loading) {
      console.log("Loading image:", imageUrl);
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully:", imageUrl);
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        console.error("Failed to load image:", imageUrl);
        setImageError(true);
        setImageLoaded(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, loading]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  }, []);

  const handleMouseDown = useCallback((e, handle) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      let newCropArea = { ...cropArea };

      switch (dragHandle) {
        case "tl":
          newCropArea.width = cropArea.width + (cropArea.x - x);
          newCropArea.height = cropArea.height + (cropArea.y - y);
          newCropArea.x = x;
          newCropArea.y = y;
          break;
        case "tr":
          newCropArea.width = x - cropArea.x;
          newCropArea.height = cropArea.height + (cropArea.y - y);
          newCropArea.y = y;
          break;
        case "bl":
          newCropArea.width = cropArea.width + (cropArea.x - x);
          newCropArea.height = y - cropArea.y;
          newCropArea.x = x;
          break;
        case "br":
          newCropArea.width = x - cropArea.x;
          newCropArea.height = y - cropArea.y;
          break;
      }

      // Constrain to bounds
      newCropArea.x = Math.max(0, Math.min(0.9, newCropArea.x));
      newCropArea.y = Math.max(0, Math.min(0.9, newCropArea.y));
      newCropArea.width = Math.max(
        0.1,
        Math.min(1 - newCropArea.x, newCropArea.width)
      );
      newCropArea.height = Math.max(
        0.1,
        Math.min(1 - newCropArea.y, newCropArea.height)
      );

      setCropArea(newCropArea);
    },
    [isDragging, dragHandle, cropArea]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSave = async () => {
    if (currentFile && imageRef.current) {
      try {
        const rect = imageRef.current.getBoundingClientRect();
        const cropPixels = {
          x: cropArea.x * imageRef.current.naturalWidth,
          y: cropArea.y * imageRef.current.naturalHeight,
          width: cropArea.width * imageRef.current.naturalWidth,
          height: cropArea.height * imageRef.current.naturalHeight,
        };

        const croppedBlob = await getCroppedImg(imageUrl, cropPixels);

        const croppedFile = new File([croppedBlob], currentFile.name, {
          type: "image/jpeg",
        });
        const croppedUrl = URL.createObjectURL(croppedBlob);

        // Update the file in uploadedFiles array
        const updatedFiles = [...uploadedFiles];
        updatedFiles[selectedFileIndex] = {
          ...currentFile,
          file: croppedFile,
          url: croppedUrl,
          preview: croppedUrl,
        };

        if (onSave) {
          onSave(updatedFiles);
        }
      } catch (error) {
        console.error("Error cropping image:", error);
        message.error("Failed to process image");
      }
    } else {
      if (onSave) {
        onSave(uploadedFiles);
      }
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

  if (!isOpen) return null;

  return (
    <div className="preview-drawer-overlay">
      <div className="preview-drawer">
        <div className="drawer-header">
          <div className="header-left">
            <button className="back-button" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19l-7-7 7-7"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="drawer-title">Rx Preview</h1>
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="drawer-content">
          <div className="preview-area">
            {loading ? (
              <div className="loading-container">
                <Skeleton.Image
                  style={{ width: "400px", height: "500px" }}
                  active
                />
              </div>
            ) : imageError ? (
              <div className="error-container">
                <div className="error-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <line
                      x1="15"
                      y1="9"
                      x2="9"
                      y2="15"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="15"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                  <p>Failed to load image</p>
                  <button onClick={onReupload} className="retry-btn">
                    Try Again
                  </button>
                </div>
              </div>
            ) : !imageLoaded ? (
              <div className="loading-container">
                <div className="loading-content">
                  <div className="spinner"></div>
                  <p>Loading image...</p>
                </div>
              </div>
            ) : (
              <div className="image-container" ref={containerRef}>
                <div className="image-wrapper">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Prescription"
                    className="prescription-image"
                    onLoad={handleImageLoad}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center center",
                    }}
                  />

                  {/* Crop overlay */}
                  <div
                    className="crop-overlay"
                    style={{
                      left: `${cropArea.x * 100}%`,
                      top: `${cropArea.y * 100}%`,
                      width: `${cropArea.width * 100}%`,
                      height: `${cropArea.height * 100}%`,
                    }}
                  />

                  {/* Crop handles */}
                  <div
                    className="crop-handle corner-tl"
                    style={{
                      left: `${cropArea.x * 100}%`,
                      top: `${cropArea.y * 100}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "tl")}
                  />
                  <div
                    className="crop-handle corner-tr"
                    style={{
                      left: `${(cropArea.x + cropArea.width) * 100}%`,
                      top: `${cropArea.y * 100}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "tr")}
                  />
                  <div
                    className="crop-handle corner-bl"
                    style={{
                      left: `${cropArea.x * 100}%`,
                      top: `${(cropArea.y + cropArea.height) * 100}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "bl")}
                  />
                  <div
                    className="crop-handle corner-br"
                    style={{
                      left: `${(cropArea.x + cropArea.width) * 100}%`,
                      top: `${(cropArea.y + cropArea.height) * 100}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "br")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="action-bar">
            <div className="action-buttons">
              <button className="action-btn reupload" onClick={onReupload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="7,10 12,15 17,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reupload
              </button>

              <button
                className="action-btn remove"
                onClick={() => onRemove(selectedFileIndex)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="3,6 5,6 21,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Remove
              </button>
            </div>

            <div className="zoom-controls">
              <button className="zoom-btn" onClick={handleZoomReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <button className="zoom-btn" onClick={handleZoomOut}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button className="zoom-btn" onClick={handleZoomIn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="thumbnails-section">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className={`thumbnail-item ${
                  index === selectedFileIndex ? "selected" : ""
                }`}
                onClick={() => setSelectedFileIndex(index)}
              >
                <img
                  src={file.url || file.preview}
                  alt={`Page ${index + 1}`}
                  className="thumbnail-img"
                />
              </div>
            ))}

            <div className="add-more-item" onClick={onAddMore}>
              <div className="add-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="19"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="add-text">Add More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewDrawer;
