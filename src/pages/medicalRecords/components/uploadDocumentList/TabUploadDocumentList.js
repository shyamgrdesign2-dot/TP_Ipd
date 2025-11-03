import { Button, Divider } from "antd";
import { useSelector } from "react-redux";
import RecordCard from "../recordCard/RecordCard";
import "./UploadDocumentList.scss";
import { isAndroid, isBrowser } from "react-device-detect";

const TabUploadDocumentList = ({
  handleCollapsed,
  handleDrawerMedicalReport,
  fileInputRef,
  handleFileUpload,
  handleAddClick,
  handleDrawerUploadDoc,
  setFilesData,
  setIsEditDocument,
  handleUploadDocPopup,
  setUploadDocDrawer,
}) => {
  const { allUploadedDocs } = useSelector((state) => state.uploadDoc);
  return (
    <div>
      <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
        Medical Records
        <Button
          type="text"
          className="btn p-0 btn-outline"
          onClick={handleCollapsed}
        >
          <i className="icon-Contract fs-21 text-white p-0"></i>
        </Button>
      </div>
      <div
        className="overflow-y-auto"
        style={{ height: "calc(100vh - 108px)" }}
      >
        <div className="p-10">
          <Button
            className="btn btn-input d-flex w-100 align-items-center btn-41"
            onClick={handleAddClick}
          >
            {/* {isAndroid && !isBrowser ? (
              <div
                ref={fileInputRef}
                onClick={handleUploadDocPopup}
                style={{ display: "none" }}
              />
            ) : ( */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/jpg, image/gif, application/pdf, video/mp4, video/quicktime, video/x-msvideo"
                style={{ display: "none" }}
              />
            {/* )} */}
            <i className="icon-Add me-2 fs-21"></i>
            Upload new Report
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "16px",
              padding: "16px 0",
            }}
          >
            {allUploadedDocs.slice(0, 2)?.map((cardData, index) => {
              return (
                <RecordCard
                  key={index}
                  cardData={cardData}
                  handleDrawerUploadDoc={handleDrawerUploadDoc}
                  setFilesData={setFilesData}
                  setIsEditDocument={setIsEditDocument}
                  setUploadDocDrawer={setUploadDocDrawer}
                />
              );
            })}
          </div>
          <Divider dashed style={{ color: "#D0D5DD", margin: "0 0 16px" }} />
          {allUploadedDocs?.length > 0 ? (
            <div
              className="d-flex align-items-center"
              onClick={handleDrawerMedicalReport}
            >
              <span className="view-all-txt">View All</span>
              <i className="icon-right view-all-icon" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TabUploadDocumentList;
