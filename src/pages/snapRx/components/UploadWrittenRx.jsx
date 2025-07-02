import React, { useState, useRef, useContext } from "react";
import { Button, message } from "antd";
import CashManagerContext from "../../../context/CashManagerContext";
import QRCodeGenerator from "./QRCodeGenerator";
import PreviewDrawer from "./PreviewDrawer";
import rxPadImage from "../../../assets/images/rx-pad.png";
import "./UploadWrittenRx.scss";

const UploadWrittenRx = ({ onFileUpload, isLoading }) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { patient_data, tcmId, pamId } = useContext(CashManagerContext);

  // Accepted file types
  const acceptedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      message.error("Please upload only PDF, PNG, or JPG files");
      return false;
    }
    if (file.size > maxFileSize) {
      message.error("File size should not exceed 10MB");
      return false;
    }
    return true;
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newFiles = [];

    for (const file of fileArray) {
      // Validate file
      if (!file.type.match(/^(image|application\/pdf)/)) {
        message.error(`${file.name} is not a valid file type`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        message.error(`${file.name} is too large (max 10MB)`);
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      const fileObj = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        url: preview,
        id: Date.now() + Math.random(),
      };

      newFiles.push(fileObj);
    }

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsPreviewOpen(true);
      message.success(`${newFiles.length} file(s) selected successfully`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setUploadedFiles(newFiles);

    if (newFiles.length === 0) {
      setIsPreviewOpen(false);
    }

    message.info("File removed");
  };

  const generateQRData = () => {
    return JSON.stringify({
      type: "snap_rx_upload",
      patientId: patient_data?.patient_unique_id || "demo_patient",
      tcmId: tcmId || 0,
      pamId: pamId || 0,
      timestamp: new Date().toISOString(),
      uploadUrl: `${window.location.origin}/snap-rx/mobile-upload`,
    });
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  const handleReupload = () => {
    fileInputRef.current?.click();
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (uploadedFiles.length === 0) {
      message.warning("No files to save");
      return;
    }

    // Call the parent onFileUpload function if provided
    if (onFileUpload) {
      const filesToUpload = uploadedFiles.map((f) => f.file);
      onFileUpload(filesToUpload);
    }

    setIsPreviewOpen(false);
    message.success("Files saved successfully");
  };

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <>
      <div className="upload-written-rx-container">
        <div className="upload-modal-content">
          {/* Header */}
          <div className="upload-header">
            <h2 className="upload-title">Upload Written Rx</h2>
          </div>

          {/* Rx Pad Image */}
          <div className="rx-image-container">
            <img
              src={rxPadImage}
              alt="Prescription Pad"
              className="rx-pad-image"
            />
          </div>

          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-container">
              <QRCodeGenerator data={generateQRData()} size={120} />
            </div>
            <p className="qr-description">
              Scan this QR to upload written prescription (Rx) directly
              <br />
              from your mobile device
            </p>
          </div>

          {/* Upload Section */}
          <div
            className={`upload-section ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="#6B7FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="#6B7FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="#6B7FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="#6B7FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="10,9 9,9 8,9"
                    stroke="#6B7FFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="upload-text">
                <span className="upload-link" onClick={handleUploadClick}>
                  Click to Upload
                </span>
                <span className="upload-separator"> or drag and drop</span>
              </div>
            </div>
            <p className="upload-description">
              Upload the written prescription (Rx) in PDF, PNG, or JPG format
            </p>
          </div>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && !isPreviewOpen && (
            <div className="selected-files">
              <h4>Selected Files ({selectedFiles.length}):</h4>
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <div className="file-icon">
                      {file.type.includes("pdf") ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#ff6b6b"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <text
                            x="12"
                            y="17"
                            fontSize="8"
                            fill="white"
                            textAnchor="middle"
                          >
                            PDF
                          </text>
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#4ecdc4"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <text
                            x="12"
                            y="17"
                            fontSize="8"
                            fill="white"
                            textAnchor="middle"
                          >
                            IMG
                          </text>
                        </svg>
                      )}
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      className="remove-btn"
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#ff4d4f"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {selectedFiles.length > 0 && !isPreviewOpen && (
            <div className="submit-section">
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={() => setIsPreviewOpen(true)}
                className="submit-button"
              >
                Preview & Upload
              </Button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Preview Drawer */}
      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        uploadedFiles={uploadedFiles}
        onReupload={handleReupload}
        onRemove={handleRemoveFile}
        onAddMore={handleAddMore}
        onSave={handleSave}
      />
    </>
  );
};

export default UploadWrittenRx;
