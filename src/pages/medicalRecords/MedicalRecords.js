import { Button, Card } from "antd";
import { useEffect, useRef, useState } from "react";
import "./MedicalRecords.scss";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import RecordCard from "./components/recordCard/RecordCard";
import { isAndroid, isBrowser } from "react-device-detect";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const MedicalRecords = ({
  medicalReportDrawer,
  onClose,
  handleDrawerUploadDoc,
  setFilesData,
  setIsEditDocument,
}) => {
  const { uploadDocCategories, allUploadedDocs } = useSelector(
    (state) => state.uploadDoc
  );

  const newCategory = {
    category_id: -1,
    category_name: "All",
  };
  const updatedCategory = [newCategory, ...uploadDocCategories];

  const [activeCategory, setActiveCategory] = useState(-1);
  const [activeCategoryDocs, setActiveCategoryDocs] = useState(allUploadedDocs);
  const fileInputRef = useRef(null);
  const deviceUid = localStorage.getItem("app_device_unique_id");

  const getCapturedImgFromFirebase = async (url) => {
    console.log("url", url);
    // console.log("selectedFiles", selectedFiles);
    // const totalFiles = [...filesData, ...selectedFiles];
    // const newRecordData = selectedFiles?.map((item) => {
    //   return {
    //     id: item?.id || 0,
    //     name: item?.name || "",
    //     recordType: undefined,
    //     recordUploadDate: dayjs().format("YYYY-MM-DD"),
    //     notes: "",
    //   };
    // });
    // const updatedRecordData = [...recordData, ...newRecordData];
    // setFilesData(totalFiles);
    // setRecordData(updatedRecordData);
  };

  useEffect(() => {
    if (isAndroid && !isBrowser) {
      const checkInFireBase = async () => {
        if (deviceUid) {
          const docRef = doc(db, "capturedImage", deviceUid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              onSnapshot(doc(db, "capturedImage", deviceUid), (docSnapshot) => {
                const res = docSnapshot?.data();
                if (res?.uri != "") {
                  getCapturedImgFromFirebase(res.uri);
                }
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
    }
  }, [db, deviceUid]);

  useEffect(() => {
    const updatedUploadedDocs =
      activeCategory === -1
        ? allUploadedDocs
        : allUploadedDocs.filter((item) => item.category_id === activeCategory);
    setActiveCategoryDocs([...updatedUploadedDocs]);
  }, [activeCategory, allUploadedDocs]);

  const categoryOptionHandler = (index) => {
    setActiveCategory(index);
  };

  const handleFileUpload = async (event) => {
    if (isAndroid && !isBrowser) {
      const deviceUid = localStorage.getItem("app_device_unique_id");
      if (deviceUid) {
        // const docRef = doc(db, "capturedImage", deviceUid);
        try {
          // const docSnap = await getDoc(docRef);
          // if (docSnap.exists()) {
          //   await updateDoc(docRef, {
          //     clicked: "yes",
          //   });
          // } else {
          await setDoc(doc(db, "capturedImage", deviceUid), {
            clicked: "yes",
            uri: "",
          });
          // }
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    } else {
      const files = event.target.files;
      if (files) {
        const filesData = Array.from(files);
        if (filesData.length > 0) {
          setFilesData(filesData);
          handleDrawerUploadDoc();
        }
      }
    }
  };

  return (
    <div className="medical-records">
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
            height: "90px",
          }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={onClose}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Medical Records</div>
          </div>
          <div style={{ padding: "20px" }}>
            <Button
              className="btn-41 btn ant-btn-text btn-input"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {isAndroid && !isBrowser ? (
                <div
                  ref={fileInputRef}
                  onClick={handleFileUpload}
                  accept=".png, .jpeg, .jpg, .pdf"
                  style={{ display: "none" }}
                />
              ) : (
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".png, .jpeg, .jpg, .pdf"
                  style={{ display: "none" }}
                />
              )}
              <i className="icon-upload" />
              <span>Upload new report</span>
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-center flex-column">
          <div
            className="d-flex flex-wrap"
            style={{ padding: "24px", columnGap: "16px" }}
          >
            {updatedCategory.map((item) => (
              <Button
                type="text"
                key={item?.category_id}
                className={`btnStyle btn px-5-16 fs-14 category-btn ${
                  item?.category_id === activeCategory
                    ? "active-category-btn"
                    : ""
                }`}
                onClick={() => categoryOptionHandler(item?.category_id)}
              >
                <span
                  className={`btnText category-label ${
                    item?.category_id === activeCategory
                      ? "active-category-label"
                      : ""
                  }`}
                >
                  {item?.category_name}
                </span>
              </Button>
            ))}
          </div>
          <Row
            xs={1}
            sm={2}
            md={2}
            lg={3}
            className="gy-4 w-100"
            style={{ padding: "0 0 50px 24px" }}
          >
            {activeCategoryDocs.map((cardData, index) => {
              return (
                <Col key={index} className="gx-4">
                  <RecordCard
                    cardData={cardData}
                    medicalReportDrawer={medicalReportDrawer}
                    handleDrawerUploadDoc={handleDrawerUploadDoc}
                    setFilesData={setFilesData}
                    setIsEditDocument={setIsEditDocument}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default MedicalRecords;
