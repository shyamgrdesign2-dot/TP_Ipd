import { Button, Card, Drawer } from "antd";
import emptyDocument from "./../../../../assets/images/fallback-thumbnail.svg";
import { useDispatch, useSelector } from "react-redux";
import { setUploadDocCategories } from "../../../../redux/uploadDocSlice";
import { fetchAllDocumentCategories } from "../../service";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./../../MedicalRecords.scss";
import UploadDocument from "../../UploadDocument";
import RecordCard from "../recordCard/RecordCard";

const VisitMedicalRecords = () => {
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
  const [filesData, setFilesData] = useState([]);
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
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

  const handleDrawerUploadDoc = () => {
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const filesData = Array.from(files);
      if (filesData.length > 0) {
        setFilesData(filesData);
        handleDrawerUploadDoc();
      }
    }
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
          className="d-flex flex-column justify-content-center"
          // style={{ height: "calc(100vh - 118px)", overflow: "auto" }}
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
                  Only pdf, jpg, jpeg or png files with the max size 5mb.
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
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
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
                {activeCategoryDocs.map((document, index) => {
                  return (
                    <Col key={index} className="gx-4">
                      <RecordCard document={document} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>
      </Card>
      {uploadDocDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDeletePopup}
          open={uploadDocDrawer}
          width="50%"
          push={false}
        >
          <UploadDocument
            onClose={handleDeletePopup}
            handleDrawerUploadDoc={handleDrawerUploadDoc}
            shouldShowDeletePopup={shouldShowDeletePopup}
            setShowDeletePopup={setShowDeletePopup}
            filesData={filesData}
            setFilesData={setFilesData}
          />
        </Drawer>
      )}
    </div>
  );
};

export default VisitMedicalRecords;
