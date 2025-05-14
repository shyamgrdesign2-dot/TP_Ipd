import React, { useState, useEffect } from "react";
import { Button, Upload, message } from "antd";
import { FileOutlined } from "@ant-design/icons";
import styles from "../DoctorOnboarding.module.css";
import { CloudUploadOutlined } from "@ant-design/icons";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";
import axios from "axios";
import config from "../../../config";

const UploadProofStep = ({ formData, setFormData }) => {
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  const [governmentIdFile, setGovernmentIdFile] = useState(
    formData.governmentIdProof
  );
  const [mrcFile, setMRCFile] = useState(formData.mrcCertificate);
  const [isFileSizeExceeded, setIsFileSizeExceeded] = useState(false);

  // Add useEffect to check account lock status
  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        // Get user mobile number from wherever it's stored
        const mobileNumber =
          formData.mobileNumber || localStorage.getItem("mobileNumber");

        if (!mobileNumber) {
          console.error("Mobile number not found");
          return;
        }

        const response = await axios.get(
          `${config.user_management_api_url}/user/pm/info/status?mblNo=${mobileNumber}`,
          {
            headers: {
              api_key: config.api_key,
              api_secret_key: config.api_secret_key,
            },
          }
        );

        // If status is true, account is active (not locked)
        if (response.data && response.data.status === true) {
          setIsAccountLocked(false);
        } else {
          setIsAccountLocked(true);
        }
      } catch (error) {
        console.error("Error checking account status:", error);
      }
    };

    checkAccountStatus();
  }, [formData.mobileNumber]);

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

    const isLt8M = file.size / 1024 / 1024 < 8;
    if (!isLt8M) {
      setIsFileSizeExceeded(true);
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

  const handleRetry = () => {
    setIsFileSizeExceeded(false);
  };

  const deleteSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.38642 4.79419L6.94648 3.114C7.05991 2.77371 7.37836 2.54419 7.73705 2.54419H12.2371C12.5957 2.54419 12.9142 2.77371 13.0276 3.114L13.5877 4.79419H17.487C17.9473 4.79419 18.3204 5.16729 18.3204 5.62752C18.3204 6.08776 17.9473 6.46086 17.487 6.46086H16.7728L16.1612 16.8577C16.0835 18.1791 14.9892 19.2109 13.6655 19.2109H6.30856C4.98487 19.2109 3.8906 18.1791 3.81287 16.8577L3.2013 6.46086H2.50033C2.04009 6.46086 1.66699 6.08776 1.66699 5.62752C1.66699 5.16729 2.04009 4.79419 2.50033 4.79419H6.38642ZM8.14324 4.79419H11.8309L11.6364 4.21086H8.33768L8.14324 4.79419ZM15.1033 6.46086H4.87084L5.47666 16.7598C5.50257 17.2003 5.86733 17.5442 6.30856 17.5442H13.6655C14.1068 17.5442 14.4715 17.2003 14.4974 16.7598L15.1033 6.46086ZM11.4053 8.57554C11.434 8.1162 11.8297 7.7671 12.289 7.79581C12.7484 7.82452 13.0975 8.22016 13.0688 8.6795L12.6938 14.6795C12.6651 15.1388 12.2694 15.4879 11.8101 15.4592C11.3507 15.4305 11.0016 15.0349 11.0303 14.5755L11.4053 8.57554ZM8.94376 14.5755C8.97247 15.0349 8.62337 15.4305 8.16403 15.4592C7.70469 15.4879 7.30905 15.1388 7.28034 14.6795L6.90534 8.6795C6.87663 8.22016 7.22573 7.82452 7.68507 7.79581C8.14441 7.7671 8.54005 8.1162 8.56876 8.57554L8.94376 14.5755Z"
        fill="#FC5A5A"
      />
    </svg>
  );

  return (
    <div>
      {isAccountLocked && (
        <div className={styles.warningAlert}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.592 3.18112C15.1741 2.85319 15.8309 2.68091 16.499 2.68091C17.1671 2.68091 17.8239 2.85319 18.406 3.18112C18.9881 3.50906 19.4758 3.98155 19.822 4.55297L19.8256 4.55883L30.6336 22.6068L30.6447 22.6258C30.9834 23.2132 31.1625 23.879 31.1642 24.557C31.1659 25.2351 30.9901 25.9018 30.6543 26.4908C30.3186 27.0799 29.8345 27.5708 29.2502 27.9148C28.6659 28.2588 28.0017 28.444 27.3237 28.4518L27.3083 28.452L5.67469 28.4519C4.99639 28.4442 4.33191 28.2591 3.74733 27.915C3.16275 27.5708 2.67846 27.0797 2.34261 26.4903C2.00677 25.9009 1.83108 25.2339 1.83302 24.5556C1.83497 23.8772 2.01447 23.2112 2.35369 22.6238L2.36448 22.6054L13.1511 4.5958C13.1591 4.58139 13.1674 4.56711 13.176 4.55297C13.5222 3.98155 14.0099 3.50906 14.592 3.18112ZM16.499 5.34757C16.2894 5.34757 16.0834 5.40161 15.9008 5.50447C15.7267 5.60256 15.5795 5.7419 15.4721 5.91005L15.4602 5.9303L4.65866 23.9648C4.55507 24.1472 4.50028 24.3533 4.49968 24.5632C4.49907 24.776 4.55418 24.9852 4.65952 25.1701C4.76486 25.3549 4.91676 25.509 5.10012 25.6169C5.28172 25.7238 5.48791 25.7818 5.69854 25.7852H27.2993C27.5097 25.7817 27.7157 25.7237 27.8972 25.6169C28.0805 25.509 28.2323 25.355 28.3376 25.1702C28.443 24.9855 28.4981 24.7763 28.4976 24.5637C28.497 24.354 28.4424 24.148 28.3391 23.9657L17.5413 5.93476L17.5398 5.93234C17.4313 5.75419 17.2789 5.60687 17.0972 5.50447C16.9146 5.40161 16.7086 5.34757 16.499 5.34757ZM16.4992 11.1239C17.2355 11.1239 17.8325 11.7208 17.8325 12.4572V17.7905C17.8325 18.5269 17.2355 19.1239 16.4992 19.1239C15.7628 19.1239 15.1658 18.5269 15.1658 17.7905V12.4572C15.1658 11.7208 15.7628 11.1239 16.4992 11.1239ZM16.4992 20.4575C15.7628 20.4575 15.1658 21.0544 15.1658 21.7908C15.1658 22.5272 15.7628 23.1241 16.4992 23.1241H16.5125C17.2489 23.1241 17.8458 22.5272 17.8458 21.7908C17.8458 21.0544 17.2489 20.4575 16.5125 20.4575H16.4992Z"
              fill="#FC5A5A"
            />
          </svg>
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
              <div className={styles.deleteBtn} onClick={handleGovIdRemove}>
                {deleteSvg}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider with "and" text */}
      <div className={styles.dividerContainer}>
        <div className={styles.dividerLine}></div>
        <div className={styles.dividerText}>and</div>
        <div className={styles.dividerLine}></div>
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
              <div className={styles.deleteBtn} onClick={handleMRCRemove}>
                {deleteSvg}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show contact support only if account is locked */}
      {isAccountLocked && (
        <div className={styles.contactSupport}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.3912 14.0251L15.7162 16.6584C15.7995 17.3501 15.0579 17.8334 14.4662 17.4751L10.9745 15.4001C10.5912 15.4001 10.2162 15.3751 9.84955 15.3251C10.4662 14.6001 10.8329 13.6834 10.8329 12.6917C10.8329 10.3251 8.78288 8.40844 6.24955 8.40844C5.28288 8.40844 4.39122 8.68341 3.64955 9.16675C3.62455 8.95841 3.61621 8.75007 3.61621 8.53341C3.61621 4.74174 6.90788 1.66675 10.9745 1.66675C15.0412 1.66675 18.3329 4.74174 18.3329 8.53341C18.3329 10.7834 17.1745 12.7751 15.3912 14.0251Z"
              stroke="#454551"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.8337 12.6917C10.8337 13.6834 10.467 14.6001 9.85033 15.3251C9.02533 16.3251 7.71699 16.9667 6.25033 16.9667L4.07532 18.2584C3.70866 18.4834 3.24199 18.1751 3.29199 17.7501L3.50032 16.1084C2.38366 15.3334 1.66699 14.0917 1.66699 12.6917C1.66699 11.2251 2.45033 9.93342 3.65033 9.16676C4.392 8.68342 5.28366 8.40845 6.25033 8.40845C8.78366 8.40845 10.8337 10.3251 10.8337 12.6917Z"
              stroke="#454551"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className={styles.supportText}>Contact Support:</span>
          <a href="tel:+91-9974042363" className={styles.supportLink}>
            +91-9974042363
          </a>
          <span className={styles.supportDivider}>|</span>
          <a href="mailto:Support@tatvacare.in" className={styles.supportLink}>
            Support@tatvacare.in
          </a>
        </div>
      )}
      <CommonModal
        isModalOpen={isFileSizeExceeded}
        onCancel={() => setIsFileSizeExceeded(false)}
        title="Exceeded File Size"
        modalBody={
          <div>
            <div className={styles.warningContainer}>
              <div className={styles.warningIconWrapper}>
                <img className="me-3" src={alertIcon} alt="Warning" />
              </div>
              <div className={styles.warningMessage}>
                The file size exceeded <strong>8MB</strong>. Please upload a
                file smaller than 8MB
              </div>
            </div>
            <Button
              type="primary"
              block
              onClick={handleRetry}
              className={styles.retryButton}
            >
              Retry
            </Button>
          </div>
        }
        modalWidth={465}
      />
    </div>
  );
};

export default UploadProofStep;
