import { Card, Divider, Modal, Spin } from "antd";
import "./UploadDocPopup.scss";
import { db, storage } from "../../../../firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getCorrectedFileName } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingStatus } from "../../../../redux/uploadDocSlice";
import {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

const UploadDocPopup = ({
  shouldShowUploadDocPopup,
  onCancel,
  setFilesData,
  uploadDocDrawer,
  handleDrawerUploadDoc,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.uploadDoc);
  const deviceUid = localStorage.getItem("app_device_unique_id");
  const [loading, setLoading] = useState(false);
  const handleClick = async (type) => {
    if (deviceUid) {
      const docRef = doc(db, "capturedImage", deviceUid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            clicked: "yes",
            type: type,
          });
        } else {
          await setDoc(doc(db, "capturedImage", deviceUid), {
            clicked: "yes",
            type: type,
          });
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
    dispatch(setLoadingStatus(true));
    onCancel();
  };

  async function getFileFromFirebase(filePath, fileName, fileType) {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, filePath);

      const downloadURL = await getDownloadURL(fileRef);

      const response = await fetch(downloadURL);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      console.log("blobUrl", blobUrl);
      const file = new File([blob], fileName, { type: fileType });
      return file;
    } catch (error) {
      console.error("Error fetching file from Firebase:", error);
      return null;
    }
  }

  useEffect(() => {
    const checkInFireBase = async () => {
      if (deviceUid) {
        const docCapturedImage = doc(db, "capturedImage", deviceUid);
        try {
          const docCapturedImageSnap = await getDoc(docCapturedImage);
          if (docCapturedImageSnap.exists()) {
            onSnapshot(
              doc(db, "capturedImage", deviceUid),
              async (docSnapshotOfCapturedImage) => {
                const res = docSnapshotOfCapturedImage?.data();
                console.log("res", res);
                if (res?.clicked === "no" && res?.filePath !== "") {
                  console.log("urls", res?.url);
                  const urls = res?.filePath?.split(",");
                  const fileNames = res?.name?.split(",");
                  const fileTypes = res?.type?.split(",");

                  for (let i = 0; i < urls.length; i++) {
                    console.log(urls[i], fileNames[i], fileTypes[i]);
                    const newFile = await getFileFromFirebase(
                      urls[i],
                      getCorrectedFileName(fileNames[i]),
                      fileTypes[i]
                    );
                    setFilesData((prev) => {
                      const isAlreadyAdded = prev.some(
                        (file) => file.name === newFile.name
                      );
                      if (!isAlreadyAdded) {
                        const desertRef = ref(storage, urls[i]);
                        deleteObject(desertRef);
                        return [newFile, ...prev];
                      }
                      return prev;
                    });
                  }
                  if (!uploadDocDrawer) {
                    handleDrawerUploadDoc();
                  }
                  dispatch(setLoadingStatus(false));

                  deleteDoc(doc(db, "capturedImage", deviceUid));
                } else {
                  dispatch(setLoadingStatus(false));
                }
              }
            );
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
        open={shouldShowUploadDocPopup}
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
      {loading ? (
        <div>
          <Spin
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
            }}
            size="large"
          />
        </div>
      ) : null}
    </div>
  );
};

export default UploadDocPopup;
