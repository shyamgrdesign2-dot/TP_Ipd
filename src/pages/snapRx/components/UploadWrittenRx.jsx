import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { message } from "antd";
import CashManagerContext from "../../../context/CashManagerContext";
import QRCodeGenerator from "./QRCodeGenerator";
import PreviewDrawer from "./PreviewDrawer";
import rxPadImage from "../../../assets/images/rx-pad.png";
import "./UploadWrittenRx.scss";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { generateFileUploadToken } from "../../../redux/snapRxDigitizationSlice";
import { useDispatch } from "react-redux";
import { useSnapRxSession } from "../context/SnapRxSessionContext";
import { getShortLink } from "../../../redux/shortLinkSlice";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import FileUploadErrorModal from "../../../components/common/FileUploadErrorModal";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UploadWrittenRx = ({
  onFileUpload,
  isLoading,
  showBackButton,
  onBack,
  isUploadMoreDrawer = false,
  fetchUploadedFiles,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { userId, profile } = useSelector((state) => state.doctors);
  const { fileUploadToken } = useSelector((state) => state.snapRx);
  const { shortLink } = useSelector((state) => state.shortLink);
  const { patient_data, tcmId, pamId } = useContext(CashManagerContext);
  const { sessionId } = useSnapRxSession();
  const dispatch = useDispatch();

  const maxFileSize = 15 * 1024 * 1024; // 8MB

  useEffect(() => {
    if (!fileUploadToken && userId) {
      dispatch(
        generateFileUploadToken({
          doctor_id: userId,
        })
      );
    }
  }, [userId]);

  const handleFiles = async (
    files,
    isReupload = false,
    reuploadIndex = null
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check file upload limit (5 files maximum)
    const currentFileCount = isReupload
      ? uploadedFiles.length
      : uploadedFiles.length;
    const newFileCount = isReupload ? 1 : fileArray.length;
    const totalFileCount = isReupload
      ? currentFileCount
      : currentFileCount + newFileCount;

    if (totalFileCount > 5) {
      setIsFileLimitError(true);
      return;
    }

    const newFiles = [];

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.match(/^(image|application\/pdf)/)) {
        // Extract file extension from file name for better error message
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        setIsFileTypeError(`.${fileExtension}`);
        continue;
      }

      // Validate file size (8MB limit)
      if (file.size > maxFileSize) {
        setIsFileSizeError(true);
        continue;
      }

      if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer })
            .promise;
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            const preview = canvas.toDataURL("image/png");

            const fileObj = {
              file,
              name: `${file.name} - page ${i}`,
              size: file.size,
              type: file.type,
              preview,
              url: preview,
              id: Date.now() + Math.random(),
              rotation: 0,
              crop: {
                unit: "%",
                x: 10,
                y: 10,
                width: 80,
                height: 80,
              },
            };

            newFiles.push(fileObj);
          }
        } catch (err) {
          console.error("Error rendering PDF:", err);
        }
      } else {
        const preview = URL.createObjectURL(file);

        const fileObj = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          url: preview,
          id: Date.now() + Math.random(),
          rotation: 0,
          crop: {
            unit: "%",
            x: 10,
            y: 10,
            width: 80,
            height: 80,
          },
        };

        newFiles.push(fileObj);
      }
    }

    if (newFiles.length > 0) {
      if (isReupload && reuploadIndex !== null) {
        // For reupload, replace the file at the specified index
        const updatedFiles = [...uploadedFiles];
        updatedFiles[reuploadIndex] = newFiles[0];
        setSelectedFiles(updatedFiles);
        setUploadedFiles(updatedFiles);
      } else {
        // For add more or initial upload, append to existing files
        setSelectedFiles((prev) => [...prev, ...newFiles]);
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
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
    handleFiles(files, false);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files, false);
  };

  const handleUploadClick = () => {
    // Check if we've reached the file limit before allowing uploads
    if (uploadedFiles.length >= 5) {
      setIsFileLimitError(true);
      return;
    }
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

  useEffect(() => {
    if (!fileUploadToken || !patient_data || !userId || !sessionId) {
      return;
    }
    const qrData = {
      type: "snap_rx_upload",
      patientId: patient_data?.patient_unique_id,
      doctorId: userId,
      tcmId: tcmId || 0,
      pamId: pamId || 0,
      timestamp: new Date().toISOString(),
      authToken: fileUploadToken || "",
      patientName: patient_data?.pm_fullname,
      patientGender: patient_data?.pm_gender,
      patientAge: patient_data?.ageYears,
      patientPhone: patient_data?.pm_contact_no,
      sessionId,
      autoDigitizeRx: profile?.userSettingFlag?.find(
        (flag) => flag.type === "auto_digitize_rx"
      )?.status,
    };
    const encodedData = encodeURIComponent(JSON.stringify(qrData));
    dispatch(
      getShortLink(
        `${window.location.origin}/snap-rx/mobile-upload/?uploadParams=${encodedData}`
      )
    );
  }, [fileUploadToken, patient_data, userId, tcmId, pamId, sessionId, profile]);

  const generateQRData = useCallback(() => {
    if (!shortLink) {
      return "";
    }
    return JSON.stringify({
      uploadUrl: shortLink,
    });
  }, [shortLink]);

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  const handleReupload = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.png,.jpg,.jpeg";

    input.onchange = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0]; // Take only the first file for reupload

      // Validate file type
      if (!file.type.match(/^(image|application\/pdf)/)) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        setIsFileTypeError(`.${fileExtension}`);
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        setIsFileSizeError(true);
        return;
      }

      try {
        let newFiles = [];

        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer })
            .promise;

          // For reupload, we only take the first page of PDF
          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const preview = canvas.toDataURL("image/png");

          const fileObj = {
            file,
            name: `${file.name} - page 1`,
            size: file.size,
            type: file.type,
            preview,
            url: preview,
            id: Date.now() + Math.random(),
            rotation: 0,
            crop: {
              unit: "%",
              x: 10,
              y: 10,
              width: 80,
              height: 80,
            },
          };

          newFiles.push(fileObj);
        } else {
          const preview = URL.createObjectURL(file);

          const fileObj = {
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview,
            url: preview,
            id: Date.now() + Math.random(),
            rotation: 0,
            crop: {
              unit: "%",
              x: 10,
              y: 10,
              width: 80,
              height: 80,
            },
          };

          newFiles.push(fileObj);
        }

        // Update the files array with the new file at the specified index
        const updatedFiles = [...uploadedFiles];
        // Clean up old preview URL if it exists
        if (updatedFiles[index]?.preview) {
          URL.revokeObjectURL(updatedFiles[index].preview);
        }
        updatedFiles[index] = newFiles[0];

        setSelectedFiles(updatedFiles);
        setUploadedFiles(updatedFiles);
      } catch (error) {
        console.error("Error processing file:", error);
        message.error("Failed to process file. Please try again.");
      }
    };

    input.click();
  };

  const handleAddMore = () => {
    // Check if we've reached the file limit before allowing more uploads
    if (uploadedFiles.length >= 5) {
      setIsFileLimitError(true);
      return;
    }
    // Always use the fileInputRef for adding more files
    fileInputRef.current?.click();
  };

  const handleSave = (processedFiles) => {
    if (onFileUpload) {
      if (isUploadMoreDrawer) {
        // For upload more drawer, pass the processed files to the parent component
        onFileUpload(processedFiles || uploadedFiles);
        setIsPreviewOpen(false);
      } else {
        // For regular upload, handle empty files case
        if (Array.isArray(processedFiles) && processedFiles.length === 0) {
          // Clear all files
          setSelectedFiles([]);
          setUploadedFiles([]);
          setIsPreviewOpen(false);
        } else {
          // Normal save operation
          onFileUpload();
          setIsPreviewOpen(false);
        }
      }
    } else {
      setIsPreviewOpen(false);
    }
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

  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);
  const handleRetryBtn = () => {
    // setFilesData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(false);
  };

  return (
    <>
      <div
        className={`upload-written-rx-container ${
          isUploadMoreDrawer ? "p-0" : ""
        }`}
      >
        <div
          className={`upload-modal-content ${
            isUploadMoreDrawer ? "border-0" : ""
          }`}
        >
          {/* Header */}
          {!isUploadMoreDrawer && (
            <div className="upload-header">
              {showBackButton && (
                <button className="back-button" onClick={onBack} type="button">
                  ← Back to Files
                </button>
              )}
              <h2 className="upload-title">Upload Written Rx</h2>
            </div>
          )}

          {/* Rx Pad Image */}
          <div className={`rx-image ${isUploadMoreDrawer ? "mt-5" : ""}`}>
            <img
              src={rxPadImage}
              alt="Prescription Pad"
              className="rx-pad-image"
            />
          </div>
          <div style={{ padding: "0rem 3.9375rem 2.375rem 3.9375rem" }}>
            {/* QR Code Section */}
            <div className="qr-section">
              <p className="qr-description">
                Scan this QR to upload written prescription (Rx) directly
                <br />
                from your mobile device
              </p>
              <div className="qr-container">
                <QRCodeGenerator data={generateQRData()} size={120} />
              </div>
              <div className="refresh-text">
                <span className="refresh-link" onClick={fetchUploadedFiles}>
                  Click on refresh
                </span>
                <span className="refresh-separator"> to view the document</span>
              </div>
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
        isUploadMoreDrawer={isUploadMoreDrawer}
      />

      <FileUploadErrorModal
        isFileSizeError={isFileSizeError}
        isFileLimitError={isFileLimitError}
        isFileTypeError={isFileTypeError}
        onRetry={handleRetryBtn}
      />
    </>
  );
};

export default UploadWrittenRx;
