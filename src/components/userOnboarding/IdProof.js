import React, { useState } from "react";
import { Upload, message } from "antd";
import {
  CloudUploadOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "./IdProof.module.css";
import { FileOutlined } from "@ant-design/icons";

const IdProof = ({
  title,
  description,
  iconType = "government", // "government" or "certificate"
  document,
  onDocumentChange,
  verificationStatus = null, // null, "pending", "verified", "failed"
}) => {
  const handleUpload = (file) => {
    // Validate file type and size
    const isJpgOrPngOrPdf =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "application/pdf";

    if (!isJpgOrPngOrPdf) {
      message.error("You can only upload JPG/PNG/PDF files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
      return false;
    }

    // Create a preview URL and update the document
    const newDocument = {
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file,
      url: URL.createObjectURL(file),
    };

    onDocumentChange(newDocument);
    return false; // Prevent default upload behavior
  };

  const handleRemove = () => {
    onDocumentChange(null);
  };

  // Render verification status badge
  const renderVerificationBadge = () => {
    if (!verificationStatus) return null;

    switch (verificationStatus) {
      case "pending":
        return <div className={styles.pendingBadge}>Pending Verification</div>;
      case "verified":
        return (
          <div className={styles.verifiedBadge}>
            <CheckCircleOutlined /> Verified
          </div>
        );
      case "failed":
        return <div className={styles.failedBadge}>Verification Failed</div>;
      default:
        return null;
    }
  };

  // Render the document preview or upload area
  const renderContent = () => {
    // If no document, show upload area
    if (!document) {
      return (
        <div className={styles.uploadContainer}>
          <CloudUploadOutlined className={styles.uploadIcon} />
          <div className={styles.uploadTextContainer}>
            <div className={styles.uploadText}>Click to Upload</div>
            <div className={styles.uploadOr}>or drag and drop</div>
          </div>
          <div className={styles.uploadDescription}>
            Upload {description} for verification
          </div>
        </div>
      );
    }

    // If document exists, but verification failed, still show upload area
    if (verificationStatus === "failed") {
      return (
        <div className={styles.uploadContainer}>
          <CloudUploadOutlined className={styles.uploadIcon} />
          <div className={styles.uploadTextContainer}>
            <div className={styles.uploadText}>Click to Upload</div>
            <div className={styles.uploadOr}>or drag and drop</div>
          </div>
          <div className={styles.uploadDescription}>
            Upload {description} for verification
          </div>
        </div>
      );
    }

    // If document exists and not failed, show preview
    return (
      <div className={styles.documentPreviewContainer}>
        <div className={styles.documentPreview}>
          {document.type.startsWith("image/") ? (
            <img
              src={document.url}
              alt={document.name}
              className={styles.documentPreviewImage}
            />
          ) : (
            <div className={styles.pdfPreview}>
              <FileOutlined className={styles.pdfIcon} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.iconContainer}>
            <div
              className={
                iconType === "government" ? styles.govIcon : styles.mrcIcon
              }
            />
          </div>
          <div className={styles.title}>{title}</div>
          {renderVerificationBadge()}
        </div>

        {/* Show change document button if document exists */}
        {document && verificationStatus !== "failed" && (
          <button className={styles.changeDocumentBtn} onClick={handleRemove}>
            <EditOutlined /> Change Document
          </button>
        )}
      </div>

      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={verificationStatus === "verified"}
      >
        {renderContent()}
      </Upload>
    </div>
  );
};

export default IdProof;
