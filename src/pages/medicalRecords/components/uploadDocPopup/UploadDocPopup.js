import { Card, Divider, Modal, Spin } from "antd";
import "./UploadDocPopup.scss";
import { db, storage } from "../../../../firebase";
import {
  deleteDoc,
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
import { getStorage, ref, deleteObject, getBlob } from "firebase/storage";

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

  const downloadAndSetFile = async (pdfUrl, fileName, fileType) => {
    try {
      const storageRef = ref(storage, pdfUrl);
      const blob = await getBlob(storageRef);
      const blobUrl = URL.createObjectURL(blob);
      console.log("blobUrl", blobUrl);
      return new File([blob], fileName, { type: fileType });
    } catch (error) {
      console.error("Error downloading and setting file:", error);
    }
  };

  useEffect(() => {
    const checkInFireBase = async () => {
      if (deviceUid) {
        const docCapturedImage = doc(db, "capturedImage", deviceUid);
        try {
          const docCapturedImageSnap = await getDoc(docCapturedImage);
          console.log("docSnap", docCapturedImageSnap.exists());
          if (docCapturedImageSnap.exists()) {
            console.log("coming here");
            onSnapshot(
              doc(db, "capturedImage", deviceUid),
              async (docSnapshotOfCapturedImage) => {
                const res = docSnapshotOfCapturedImage?.data();
                console.log("res", res);
                if (res?.clicked === "no") {
                  console.log("urls", res?.url);
                  if (res?.filePath && res?.filePath?.length > 0) {
                    const urls = res?.filePath?.split(",");
                    const fileNames = res?.name?.split(",");
                    const fileTypes = res?.type?.split(",");

                    console.log("harish", urls, fileNames, fileTypes);
                    for (let i = 0; i < urls.length; i++) {
                      console.log(urls[i], fileNames[i], fileTypes[i]);
                      const newFile = await downloadAndSetFile(
                        urls[i],
                        getCorrectedFileName(fileNames[i]),
                        fileTypes[i]
                      );
                      console.log("newFile", newFile);
                      setFilesData((prev) => {
                        const isAlreadyAdded = prev.some(
                          (file) => file.name === newFile.name
                        );
                        if (!isAlreadyAdded) {
                          return [newFile, ...prev];
                        }
                        return prev;
                      });
                      // });

                      const desertRef = ref(storage, urls[i]);
                      deleteObject(desertRef);
                    }
                    if (!uploadDocDrawer) {
                      handleDrawerUploadDoc();
                    }
                    dispatch(setLoadingStatus(false));

                    deleteDoc(doc(db, "capturedImage", deviceUid));
                  } else if (res?.filePath?.length === 0) {
                    dispatch(setLoadingStatus(false));
                  }
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
