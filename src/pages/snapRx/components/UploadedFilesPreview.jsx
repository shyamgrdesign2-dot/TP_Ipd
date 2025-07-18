import React, { useState, useMemo } from "react";
import { Button, message } from "antd";

import "./UploadedFilesPreview.scss";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";

const UploadedFilesPreview = ({ uploadedFiles, onEdit, loading, onDelete }) => {
  const [deletingFile, setDeletingFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showHideModal = (filename) => {
    setIsModalOpen(!isModalOpen);
    setDeletingFile(filename);
  };

  const handleDelete = async (filename) => {
    try {
      setDeletingFile(filename);
      // Remove file from parent's state
      onDelete(filename);
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error removing file:", error);
      message.error("Failed to remove file");
    } finally {
      setDeletingFile(null);
    }
  };

  const handleEdit = (file) => {
    onEdit(file);
  };

  const DELETE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isModalOpen}
        onCancel={showHideModal}
        modalWidth={500}
        title={"You may lose your data"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>Are you sure you want to delete this page?</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => handleDelete(deletingFile)}
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
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="uploaded-files-preview">
        <div className="loading-container">
          <div className="loading-text">Loading uploaded files...</div>
        </div>
      </div>
    );
  }

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="uploaded-files-preview">
      <div className="files-grid">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="file-preview-card">
            <div className="file-header">
              <div className="page-info">
                <div className="page-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="23"
                    viewBox="0 0 15 23"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      y="0.61377"
                      width="14"
                      height="22"
                      rx="2"
                      fill="#FAFAFB"
                    />
                    <path
                      d="M4.125 6.36377C4.74632 6.36377 5.25 5.86009 5.25 5.23877C5.25 4.61745 4.74632 4.11377 4.125 4.11377C3.50368 4.11377 3 4.61745 3 5.23877C3 5.86009 3.50368 6.36377 4.125 6.36377Z"
                      fill="#A2A2A8"
                    />
                    <path
                      d="M10.875 6.36377C11.4963 6.36377 12 5.86009 12 5.23877C12 4.61745 11.4963 4.11377 10.875 4.11377C10.2537 4.11377 9.75 4.61745 9.75 5.23877C9.75 5.86009 10.2537 6.36377 10.875 6.36377Z"
                      fill="#A2A2A8"
                    />
                    <path
                      d="M4.125 12.7388C4.74632 12.7388 5.25 12.2351 5.25 11.6138C5.25 10.9924 4.74632 10.4888 4.125 10.4888C3.50368 10.4888 3 10.9924 3 11.6138C3 12.2351 3.50368 12.7388 4.125 12.7388Z"
                      fill="#A2A2A8"
                    />
                    <path
                      d="M10.875 12.7388C11.4963 12.7388 12 12.2351 12 11.6138C12 10.9924 11.4963 10.4888 10.875 10.4888C10.2537 10.4888 9.75 10.9924 9.75 11.6138C9.75 12.2351 10.2537 12.7388 10.875 12.7388Z"
                      fill="#A2A2A8"
                    />
                    <path
                      d="M4.125 19.1138C4.74632 19.1138 5.25 18.6101 5.25 17.9888C5.25 17.3674 4.74632 16.8638 4.125 16.8638C3.50368 16.8638 3 17.3674 3 17.9888C3 18.6101 3.50368 19.1138 4.125 19.1138Z"
                      fill="#A2A2A8"
                    />
                    <path
                      d="M10.875 19.1138C11.4963 19.1138 12 18.6101 12 17.9888C12 17.3674 11.4963 16.8638 10.875 16.8638C10.2537 16.8638 9.75 17.3674 9.75 17.9888C9.75 18.6101 10.2537 19.1138 10.875 19.1138Z"
                      fill="#A2A2A8"
                    />
                  </svg>
                </div>
                <span className="page-text">Page {index + 1}</span>
              </div>
              <div className="file-actions">
                <Button
                  icon={<i className="icon-Edit fs-21"></i>}
                  size="small"
                  type="text"
                  className="edit-btn"
                  onClick={() => handleEdit(file)}
                  title="Edit"
                />
                <Button
                  icon={
                    <i
                      className="icon-delete fs-21"
                      style={{ color: "#FC5A5A" }}
                    ></i>
                  }
                  size="small"
                  type="text"
                  className="delete-btn"
                  onClick={() => showHideModal(file.filename)}
                  title="Delete"
                />
              </div>
            </div>

            <div className="file-content">
              <div className="prescription-preview">
                <img
                  src={file.fileUrl}
                  alt={`Prescription ${index + 1}`}
                  className="prescription-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-error" style={{ display: "none" }}>
                  <div className="error-content">
                    <div className="error-icon">📄</div>
                    <p>Unable to load image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {DELETE_MODAL}
    </div>
  );
};

export default UploadedFilesPreview;
