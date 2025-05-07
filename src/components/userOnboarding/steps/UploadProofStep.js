import React, { useState } from "react";
import { Upload, Button, Alert, message } from "antd";
import {
  UploadOutlined,
  FileOutlined,
  DeleteOutlined,
  WarningOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import styles from "../DoctorOnboarding.module.css";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";
import { CloudUploadOutlined } from "@ant-design/icons";

const UploadProofStep = ({ formData, setFormData }) => {
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  // For demonstration purposes, we're using local state to track the upload files
  // In a real app, these would be tied to formData
  const [governmentIdFile, setGovernmentIdFile] = useState(
    formData.governmentIdProof
  );
  const [mrcFile, setMRCFile] = useState(formData.mrcCertificate);

  const handleGovIdUpload = (file) => {
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

    setGovernmentIdFile({
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file, // Save original file for upload
      url: URL.createObjectURL(file),
    });

    setFormData({
      ...formData,
      governmentIdProof: file,
    });

    return false; // Prevent default upload behavior
  };

  const handleMRCUpload = (file) => {
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

    setMRCFile({
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file, // Save original file for upload
      url: URL.createObjectURL(file),
    });

    setFormData({
      ...formData,
      mrcCertificate: file,
    });

    return false; // Prevent default upload behavior
  };

  const handleGovIdRemove = () => {
    setGovernmentIdFile(null);
    setFormData({
      ...formData,
      governmentIdProof: null,
    });
  };

  const handleMRCRemove = () => {
    setMRCFile(null);
    setFormData({
      ...formData,
      mrcCertificate: null,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  };

  return (
    <div>
      {isAccountLocked && (
        <div className={styles.warningAlert}>
          <WarningOutlined className={styles.warningIcon} />
          <div className={styles.warningText}>
            Your account is locked. Please upload the below required documents
            to unlock and continue using your account.
          </div>
        </div>
      )}

      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Government ID Proof
        </label>

        {!governmentIdFile ? (
          <Upload
            beforeUpload={handleGovIdUpload}
            showUploadList={false}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <div className={styles.uploadContainer}>
              <CloudUploadOutlined className={styles.uploadIcon} />
              <div className={styles.uploadText}>Click to Upload</div>
              <div className={styles.uploadDescription}>
                Upload Aadhar Card /PAN Card/any available Government ID proofs
                for verification
              </div>
            </div>
          </Upload>
        ) : (
          <div className={styles.uploadContainerSuccess}>
            <div className={styles.uploadedFilePreview}>
              <div className={styles.fileThumb}>
                {governmentIdFile.type.startsWith("image/") ? (
                  <img
                    src={governmentIdFile.url}
                    alt={governmentIdFile.name}
                    style={{
                      width: 48,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : governmentIdFile.type === "application/pdf" ? (
                  <FileOutlined style={{ fontSize: 36, color: "#22c55e" }} />
                ) : (
                  <FileOutlined style={{ fontSize: 36, color: "#22c55e" }} />
                )}
              </div>
              <div className={styles.fileInfoPreview}>
                <div className={styles.fileNamePreview}>
                  {governmentIdFile.name}
                </div>
                <div className={styles.fileSizePreview}>
                  {formatFileSize(governmentIdFile.size)}
                </div>
              </div>
              <button
                className={styles.replaceBtn}
                onClick={() => setGovernmentIdFile(null)}
              >
                Replace File
              </button>
              <button className={styles.deleteBtn} onClick={handleGovIdRemove}>
                <DeleteOutlined />
              </button>
            </div>
          </div>
        )}
        {!governmentIdFile && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please upload your government ID proof
          </div>
        )}
      </div>

      <div className={styles.inputField}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          MRC Certificate
        </label>

        {!mrcFile ? (
          <Upload
            beforeUpload={handleMRCUpload}
            showUploadList={false}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <div className={styles.uploadContainer}>
              <CloudUploadOutlined className={styles.uploadIcon} />
              <div className={styles.uploadText}>Click to Upload</div>
              <div className={styles.uploadDescription}>
                Upload Medical Registration Certificate for verification
              </div>
            </div>
          </Upload>
        ) : (
          <div className={styles.uploadContainerSuccess}>
            <div className={styles.uploadedFilePreview}>
              <div className={styles.fileThumb}>
                {mrcFile.type.startsWith("image/") ? (
                  <img
                    src={mrcFile.url}
                    alt={mrcFile.name}
                    style={{
                      width: 48,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : mrcFile.type === "application/pdf" ? (
                  <FileOutlined style={{ fontSize: 36, color: "#22c55e" }} />
                ) : (
                  <FileOutlined style={{ fontSize: 36, color: "#22c55e" }} />
                )}
              </div>
              <div className={styles.fileInfoPreview}>
                <div className={styles.fileNamePreview}>{mrcFile.name}</div>
                <div className={styles.fileSizePreview}>
                  {formatFileSize(mrcFile.size)}
                </div>
              </div>
              <button
                className={styles.replaceBtn}
                onClick={() => setMRCFile(null)}
              >
                Replace File
              </button>
              <button className={styles.deleteBtn} onClick={handleMRCRemove}>
                <DeleteOutlined color="red" />
              </button>
            </div>
          </div>
        )}
        {!mrcFile && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            Please upload your MRC certificate
          </div>
        )}
      </div>

      <div className={styles.contactSupport}>
        <PhoneOutlined className={styles.contactIcon} />
        <span className={styles.supportText}>Contact Support:</span>
        <a href="tel:+91-9974042363" className={styles.supportLink}>
          +91-9974042363
        </a>
        <span className={styles.supportDivider}>|</span>
        <a href="mailto:Support@tatvacare.in" className={styles.supportLink}>
          Support@tatvacare.in
        </a>
      </div>
    </div>
  );
};

export default UploadProofStep;
