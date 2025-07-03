import React, { useState, useRef, useContext } from "react";
import { message } from "antd";
import CashManagerContext from "../../../context/CashManagerContext";
import QRCodeGenerator from "./QRCodeGenerator";
import PreviewDrawer from "./PreviewDrawer";
import rxPadImage from "../../../assets/images/rx-pad.png";
import "./UploadWrittenRx.scss";
import { CloudUploadOutlined } from "@ant-design/icons";

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
          <div className="rx-image">
            <img
              src={rxPadImage}
              alt="Prescription Pad"
              className="rx-pad-image"
            />
          </div>
          <div style={{ padding: "0rem 3.9375rem 2.375rem 3.9375rem" }}>
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

            {/* OR Separator */}
            <div className="or-separator">
              <span>or</span>
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
                <CloudUploadOutlined className="upload-icon" />
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
          </div>

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
