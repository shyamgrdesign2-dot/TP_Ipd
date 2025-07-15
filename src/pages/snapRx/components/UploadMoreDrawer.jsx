import { Button, Drawer } from "antd";
import UploadWrittenRx from "./UploadWrittenRx";
import { LeftOutlined } from "@ant-design/icons";
import "./UploadMoreDrawer.scss";

export default function UploadMoreDrawer({ isOpen, onClose, onFileUpload }) {
  const handleFileUpload = async (uploadedFiles) => {
    // Check if uploadedFiles exists and is an array
    if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
      console.error("uploadedFiles is not a valid array:", uploadedFiles);
      return;
    }

    // Check if uploadedFiles are already processed File objects or file wrapper objects
    const files = uploadedFiles.map((fileObj) => {
      // If it's already a File object (from PreviewDrawer processing), use it directly
      if (fileObj instanceof File) {
        return fileObj;
      }
      // Otherwise, extract the File object from the wrapper
      return fileObj.file;
    });

    if (onFileUpload) {
      await onFileUpload(files);
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={onClose}
            style={{ padding: "4px 8px" }}
          />
          <span>Upload Written Rx</span>
        </div>
      }
      width="45.625rem"
      maxWidth="45.625rem"
      placement="right"
      onClose={onClose}
      open={isOpen}
      destroyOnClose={true}
      maskClosable={false}
      closable={false}
      push={false}
      styles={{
        body: {
          padding: "24px",
        },
      }}
    >
      <UploadWrittenRx
        onFileUpload={handleFileUpload}
        showBackButton={false}
        onBack={onClose}
        isUploadMoreDrawer={true}
      />
    </Drawer>
  );
}
