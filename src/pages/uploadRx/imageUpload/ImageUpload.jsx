// TODO: Make this a common component for both mobile and desktop

import React, {
  useState,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { message } from "antd";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import CashManagerContext from "../../../context/CashManagerContext";
import PreviewDrawerMobile from "../previewDrawerMobile";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ImageUpload = forwardRef(({ onFileUpload, isLoading }, ref) => {
  const fileInputRef = useRef(null);
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
  const [storedFileIdToReplace, setStoredFileIdToReplace] = useState(null);
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
    let isStoredFileUsed = false;
    for (const file of fileArray) {
      if (!file.type.match(/^(image|application\/pdf)/)) {
        message.error(`${file.name} is not a valid file type`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        message.error(`${file.name} is too large (max 10MB)`);
        continue;
      }
      if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer })
            .promise;
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = Math.max(viewport.height, viewport.width);
            canvas.height = Math.max(viewport.height, viewport.width);

            await page.render({ canvasContext: context, viewport }).promise;

            const preview = canvas.toDataURL("image/png");

            const fileObj = {
              file,
              name: `${file.name} - page ${i}`,
              size: file.size,
              type: "image/png",
              preview,
              url: preview,
              id:
                storedFileIdToReplace && !isStoredFileUsed
                  ? storedFileIdToReplace
                  : Date.now() + Math.random(),
              rotation: 0,
              crop: {
                unit: "%",
                x: 10,
                y: 10,
                width: 80,
                height: 80,
              },
            };

            if (storedFileIdToReplace) {
              isStoredFileUsed = true;
            }

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
          id:
            storedFileIdToReplace && !isStoredFileUsed
              ? storedFileIdToReplace
              : Date.now() + Math.random(),
          rotation: 0,
          crop: {
            unit: "%",
            x: 10,
            y: 10,
            width: 80,
            height: 80,
          },
        };
        if (storedFileIdToReplace) {
          isStoredFileUsed = true;
        }
        newFiles.push(fileObj);
      }
    }

    if (newFiles.length > 0) {
      if (!storedFileIdToReplace) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      } else {
        const finalFiles = uploadedFiles.map((file) => {
          if (file.id === storedFileIdToReplace) {
            return newFiles.find(
              (newFile) => newFile.id === storedFileIdToReplace
            );
          }
          return file;
        });
        finalFiles.push(
          ...newFiles.filter((newFile) => newFile.id !== storedFileIdToReplace)
        );
        setUploadedFiles(finalFiles);
      }
      if (storedFileIdToReplace) {
        setStoredFileIdToReplace(null);
      }
      setIsPreviewOpen(true);
    }
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (fileId, showMessage = true) => {
    const fileToRemove = uploadedFiles.find((file) => file.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const newFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(newFiles);

    if (newFiles.length === 0) {
      setIsPreviewOpen(false);
    }

    if (showMessage) {
      message.info("File removed");
    }
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setUploadedFiles([]);
  };

  const handleReupload = (fileId) => {
    fileInputRef.current?.click();
    if (fileId) {
      setStoredFileIdToReplace(fileId);
    }
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
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const handleRotateClick = (fileId) => {
    const fileToRotate = uploadedFiles.find((file) => file.id === fileId);
    const newRotation = (fileToRotate.rotation + 90) % 360;
    const newFiles = uploadedFiles.map((file) => {
      if (file.id === fileId) {
        return { ...file, rotation: newRotation };
      }
      return file;
    });
    setUploadedFiles(newFiles);
  };

  const handleUpdatedFiles = (updatedFiles) => {
    setUploadedFiles(updatedFiles);
  };

  useImperativeHandle(ref, () => ({
    handleUploadClick: () => {
      fileInputRef.current?.click();
    },
  }));

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <PreviewDrawerMobile
        isOpen={isPreviewOpen}
        isMobile={true}
        onClose={handlePreviewClose}
        uploadedFiles={uploadedFiles}
        onReupload={handleReupload}
        onRemove={handleRemoveFile}
        onAddMore={handleAddMore}
        onSave={handleSave}
        onRotate={handleRotateClick}
        handleUpdatedFiles={handleUpdatedFiles}
      />
    </>
  );
});

export default ImageUpload;
