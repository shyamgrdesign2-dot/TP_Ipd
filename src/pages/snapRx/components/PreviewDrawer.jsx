import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Skeleton, message } from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  UndoOutlined,
  MinusOutlined,
  PlusOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

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

  useEffect(() => {
    if (imageUrl && !loading) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageError(true);
        setImageLoaded(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, loading]);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // Set default crop to center 80% of the image
    const cropWidth = width * 0.8;
    const cropHeight = height * 0.8;
    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    const crop = {
      unit: "px",
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    };

    setCrop(crop);
    setCompletedCrop(crop);
  }, []);

  const getCroppedImg = useCallback((image, crop) => {
    const canvas = canvasRef.current;
    if (!canvas || !crop) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
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
  }, []);

  const handleSave = async () => {
    if (currentFile && imageRef.current && completedCrop) {
      try {
        const croppedBlob = await getCroppedImg(
          imageRef.current,
          completedCrop
        );

        if (croppedBlob) {
          const croppedFile = new File([croppedBlob], currentFile.name, {
            type: "image/jpeg",
          });
          const croppedUrl = URL.createObjectURL(croppedBlob);

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
        {/* Header */}
        <div className="drawer-header">
          <div className="header-left">
            <div
              onClick={onClose}
              className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer border-end"
            >
              <i className="icon-right"></i>
            </div>

            <h1 className="drawer-title">Rx Preview</h1>
          </div>
          <Button
            type="button"
            className="btn align-items-center d-flex btn-41 btn-primary3 me-20 px-4"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {/* Main Preview Area */}
          <div className="preview-container">
            <div className="preview-area">
              {loading ? (
                <div className="skeleton-container">
                  <Skeleton.Image
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "20px",
                    }}
                    active
                  />
                </div>
              ) : imageError ? (
                <div className="error-container">
                  <div className="error-content">
                    <div className="error-icon">⚠️</div>
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
                      style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: "center center",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </ReactCrop>
                  {/* Action Bar */}
                  <div className="action-bar">
                    <div className="action-buttons">
                      <button
                        className="action-btn reupload-btn"
                        onClick={onReupload}
                      >
                        <ReloadOutlined />
                        <span>Reupload</span>
                      </button>

                      <button
                        className="action-btn remove-btn"
                        onClick={() => onRemove(selectedFileIndex)}
                      >
                        <DeleteOutlined />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="zoom-controls">
                      <button
                        className="zoom-btn reset-btn"
                        onClick={handleZoomReset}
                      >
                        <UndoOutlined />
                      </button>
                      <button
                        className="zoom-btn minus-btn"
                        onClick={handleZoomOut}
                      >
                        <MinusOutlined />
                      </button>
                      <button
                        className="zoom-btn plus-btn"
                        onClick={handleZoomIn}
                      >
                        <PlusOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails Section */}
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
                <CloudUploadOutlined className="upload-icon" />
              </div>
              <span className="add-text">Add More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default PreviewDrawer;
