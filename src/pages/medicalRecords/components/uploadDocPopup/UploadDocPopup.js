import { Card, Divider, Modal } from "antd";
import "./UploadDocPopup.scss";
import { db } from "../../../../firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getCorrectedFileName } from "../../UploadDocument";

const UploadDocPopup = ({
  onCancel,
  setFilesData,
  uploadDocDrawer,
  handleDrawerUploadDoc,
}) => {
  const deviceUid = localStorage.getItem("app_device_unique_id");
  const handleClick = async (type) => {
    if (deviceUid) {
      const docRef = doc(db, "capturedImage", deviceUid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            clicked: "yes",
            type: type,
            uri: "",
            fileName: "",
            fileType: "",
          });
        } else {
          await setDoc(doc(db, "capturedImage", deviceUid), {
            clicked: "yes",
            type: type,
            uri: "",
            fileName: "",
            fileType: "",
          });
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
    onCancel();
  };

  function base64ToFile(base64String, fileName, fileType) {
    const byteString = atob(base64String); // Decode base64 string

    // Create an ArrayBuffer to hold the byte data
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    // Create a blob from the ArrayBuffer
    const fileBlob = new Blob([arrayBuffer], { type: fileType });

    // Convert Blob to a File object
    const file = new File([fileBlob], fileName, { type: fileType });

    return file;
  }

  useEffect(() => {
    const checkInFireBase = async () => {
      if (deviceUid) {
        const docRef = doc(db, "capturedImage", deviceUid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            onSnapshot(doc(db, "capturedImage", deviceUid), (docSnapshot) => {
              const res = docSnapshot?.data();
              if (res?.uri != "") {
                const newFile = base64ToFile(
                  res?.uri,
                  getCorrectedFileName(res?.fileName),
                  res?.fileType
                );
                setFilesData((prev) => {
                  const isAlreadyAdded = prev.some(
                    (file) => file.name === newFile.name
                  );
                  if (!isAlreadyAdded) {
                    return [newFile, ...prev];
                  }
                  return prev;
                });
                if (!uploadDocDrawer) {
                  handleDrawerUploadDoc();
                }
              }
            });
            await updateDoc(docRef, {
              clicked: "",
              uri: "",
              fileName: "",
              fileType: "",
            });
          }
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.error("Device UID not found");
      }
    };

    return () => checkInFireBase();
  }, [db, deviceUid]);

  return (
    <div>
      <Modal
        open={true}
        centered
        closeIcon={false}
        footer={null}
        className="modalcommon"
        onCancel={onCancel}
        destroyOnClose
      >
        <Card
          title={"Upload Medical Records"}
          className="upload-doc-popup"
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 500,
              rowGap: 4,
              padding: "0px",
            }}
          >
            <div className="popup-txt" onClick={() => handleClick("camera")}>
              Camera
            </div>
            <Divider style={{ width: "100%" }} />
            <div className="popup-txt" onClick={() => handleClick("library")}>
              File
            </div>
            <Divider style={{ width: "100%" }} />
            <div
              className="popup-txt"
              style={{ fontWeight: 600 }}
              onClick={onCancel}
            >
              Cancel
            </div>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default UploadDocPopup;
