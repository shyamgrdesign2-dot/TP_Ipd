import { Card, Divider, Modal, Spin } from "antd";
import "./UploadDocPopup.scss";
import { db } from "../../../../firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingStatus } from "../../../../redux/uploadDocSlice";
import { fetchDocById } from "../../service";

const UploadDocPopup = ({
  shouldShowUploadDocPopup,
  onCancel,
  setFilesData,
  setUploadDocDrawer,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.uploadDoc);
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
          });
        } else {
          await setDoc(doc(db, "capturedImage", deviceUid), {
            clicked: "yes",
            type: type,
          });
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
    dispatch(setLoadingStatus(true));
    onCancel();
  };

  const getFiles = async (files) => {
    files?.map(async (item) => {
      const fileResponse = await fetchDocById(item);
      setFilesData((prev) => {
        const isAlreadyAdded = prev.some((file) => file.id === fileResponse.id);
        if (!isAlreadyAdded) {
          return [fileResponse, ...prev];
        }
        return prev;
      });
    });
    if (files?.length) {
      setUploadDocDrawer(true);
    }
    dispatch(setLoadingStatus(false));
    deleteDoc(doc(db, "capturedImage", deviceUid));
  };

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
                if (res?.clicked === "no") {
                  getFiles(res?.ids?.split(","));
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
      {isLoading ? (
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
