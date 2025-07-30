import { Button, Card } from "antd";
import emptyDocument from "./../../../../assets/images/empty-document.png";
import { useDispatch, useSelector } from "react-redux";
import { setUploadDocCategories } from "../../../../redux/uploadDocSlice";
import { fetchAllDocumentCategories } from "../../service";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./../../MedicalRecords.scss";
import RecordCard from "../recordCard/RecordCard";
import { isAndroid, isBrowser } from "react-device-detect";
import {
  generateUniqueFileName,
  getCorrectedFileName,
} from "../../utils/helper";

const VisitMedicalRecords = ({
  filesData,
  setUploadDocDrawer,
  setFilesData,
  handleUploadDocPopup,
  setIsEditDocument,
  handleDrawerUploadDoc,
}) => {
  const dispatch = useDispatch();
  const { allUploadedDocs, uploadDocCategories } = useSelector(
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

  useEffect(() => {
    const updatedUploadedDocs =
      activeCategory === -1
        ? allUploadedDocs
        : allUploadedDocs.filter((item) => item.category_id === activeCategory);
    setActiveCategoryDocs([...updatedUploadedDocs]);
  }, [activeCategory, allUploadedDocs]);

  useEffect(() => {
    if (uploadDocCategories.length === 0) {
      getAllDocumentCategories();
    }
  }, []);

  const getAllDocumentCategories = async () => {
    const response = await fetchAllDocumentCategories();
    dispatch(setUploadDocCategories(response));
  };

  const categoryOptionHandler = (index) => {
    setActiveCategory(index);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const filesData = Array.from(files);
      if (filesData.length > 0) {
        const updatedFiles = [];
        filesData.forEach((file) => {
          const cleanFileName = getCorrectedFileName(file?.name || "");
          // Check if the file is an image and if its name follows typical camera-captured file patterns
          const isCapturedFromCamera =
            (file.type === "image/jpeg" ||
              file.type === "image/png" ||
              file.type === "image/jpg") &&
            (cleanFileName === "image.jpg" ||
              cleanFileName === "image.png" ||
              cleanFileName === "image.jpeg");

          let newFile = file;

          if (isCapturedFromCamera) {
            // Generate a unique file name for camera-captured images
            const uniqueFileName = generateUniqueFileName(file);
            newFile = new File([file], uniqueFileName, { type: file.type });
          } else {
            // If the file name had spaces, create a new file with spaces removed
            newFile = new File([file], cleanFileName, { type: file.type });
          }

          updatedFiles.push(newFile);
        });
        setFilesData(updatedFiles);
        handleDrawerUploadDoc();
      }
    }
    event.target.value = null;
  };

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="appointment-wrap PatientDetailswrap m-0">
      <Card>
        <div
          className="d-flex flex-column"
          style={{
            height: "calc(100vh - 150px)",
            overflow: "auto",
            paddingBottom: "40px",
          }}
        >
          {allUploadedDocs.length === 0 ? (
            <div
              className="d-flex align-items-center justify-content-center text-center flex-column"
              style={{ rowGap: "24px" }}
            >
              <div>
                <img
                  src={emptyDocument}
                  height={300}
                  width={400}
                  alt="empty-document"
                />
              </div>
              <div>
                <div style={{ fontSize: "20px" }}>
                  You haven’t added any medical records yet!
                </div>
                <div>
                  Only PDF, JPG, JPEG, or PNG files are allowed. Maximum file
                  size: 15MB, up to 5 files.
                </div>
              </div>
              <Button
                className="btn btn-primary3 btn-text-white px-5 btn-41"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={handleAddClick}
              >
                {isAndroid && !isBrowser ? (
                  <div
                    ref={fileInputRef}
                    onClick={handleUploadDocPopup}
                    style={{ display: "none" }}
                  />
                ) : (
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    style={{ display: "none" }}
                    disabled={filesData.length >= 5}
                  />
                )}
                <i className="icon-upload" />
                {"Upload new report"}
              </Button>
            </div>
          ) : (
            <div className="d-flex justify-content-center flex-column medical-records">
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
                xs={2}
                sm={3}
                md={3}
                lg={4}
                className="gy-4 w-100"
                style={{ paddingLeft: "24px" }}
              >
                {activeCategoryDocs.map((cardData, index) => {
                  return (
                    <Col key={index} className="gx-4">
                      <RecordCard
                        cardData={cardData}
                        handleDrawerUploadDoc={handleDrawerUploadDoc}
                        setFilesData={setFilesData}
                        setIsEditDocument={setIsEditDocument}
                        setUploadDocDrawer={setUploadDocDrawer}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VisitMedicalRecords;
