import { Button, Drawer, Dropdown, Popover, Tooltip } from "antd";
import "./RecordCard.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import emptyBg from "./../../../../assets/images/empty-bg.svg";
import emptyFile from "./../../../../assets/images/empty-file.svg";
import file from "./../../../../assets/images/file.svg";
import download from "./../../../../assets/images/document-download.svg";
import edit from "./../../../../assets/images/document-edit.svg";
import trash from "./../../../../assets/images/trash.svg";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import { deleteDocById, fetchAllPatientDocs } from "../../service";
import { setAllUploadedDocs } from "../../../../redux/uploadDocSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isChrome, isSafari } from "react-device-detect";
import axios from "axios";
import { saveAs } from "file-saver";
import CommonModal from "../../../../common/CommonModal";
import DocumentPreview from "../documentPreview/DocumentPreview";
import dayjs from "dayjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function shortenText(
  text,
  length = 25,
  firstPartLength = 18,
  lastPartLength = -7
) {
  if (text.length > length) {
    const firstPart = text.slice(0, firstPartLength);
    const lastPart = text.slice(lastPartLength);
    return `${firstPart}...${lastPart}`;
  }
  return text;
}

const RecordCard = ({
  cardData,
  medicalReportDrawer,
  handleDrawerUploadDoc,
  setFilesData,
  setIsEditDocument,
  setUploadDocDrawer,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { patient_data } = state;
  const { uploadDocCategories } = useSelector((state) => state.uploadDoc);
  const {
    notes,
    id,
    url,
    thumbnail_url,
    investigation_date,
    category_id,
    display_name,
  } = cardData || {};
  const updatedFileName = shortenText(display_name);
  const categoryName = uploadDocCategories.find(
    (item) => item?.category_id === category_id
  )?.category_name;

  const [showTooltip, setShowTooltip] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [shouldShowPreview, setShowPreview] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener("mousedown", handleTooltipClickOutside);
    } else {
      document.removeEventListener("mousedown", handleTooltipClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleTooltipClickOutside);
    };
  }, [showTooltip]);

  const handleTooltipClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setShowTooltip(false);
    }
  };

  const showTooltipPopOver = useCallback(() => {
    setShowTooltip(!showTooltip);
  }, [showTooltip]);

  const tooltipTitle = () => {
    return (
      <div>
        <div className="notes-txt">Notes</div>
        <div>{notes}</div>
      </div>
    );
  };

  const handleDelete = async () => {
    await deleteDocById(id);
    const response = await fetchAllPatientDocs(patient_data.patient_unique_id);
    dispatch(setAllUploadedDocs(response));
    toggleDeletePopup();
  };

  const handleEdit = () => {
    if (shouldShowPreview) {
      setShowPreview(false);
    }
    setFilesData([cardData]);
    setIsEditDocument(true);
    setUploadDocDrawer(true);
  };

  const toggleDeletePopup = () => {
    setShowDeletePopup((prev) => !prev);
  };

  const handleInAppDownload = async () => {
    const deviceUid = localStorage.getItem("app_device_unique_id");
    if (deviceUid) {
      const docRef = doc(db, "fileDownload", deviceUid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            canDownload: "yes",
            pdfURL: url,
          });
        } else {
          await setDoc(doc(db, "fileDownload", deviceUid), {
            canDownload: "yes",
            pdfURL: url,
          });
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios({
        url: url,
        method: "GET",
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      saveAs(blob, display_name);
    } catch (error) {
      console.error("Error downloading file: ", error);
    }
  };

  const getMenuItems = () => {
    return [
      {
        label: (
          <div
            onClick={() =>
              !isChrome && !isSafari ? handleInAppDownload() : handleDownload()
            }
          >
            <img src={download} alt="download" className="me-2" />
            Download
          </div>
        ),
        key: "download",
      },
      {
        label: (
          <div onClick={handleEdit}>
            <img src={edit} alt="edit" className="me-2" />
            Edit
          </div>
        ),
        key: "edit",
      },
      {
        label: (
          <div onClick={toggleDeletePopup}>
            <img src={trash} alt="delete" className="me-2" />
            Delete
          </div>
        ),
        key: "delete",
      },
    ];
  };

  const handlePreview = () => {
    setShowPreview(false);
  };

  const handleThumbnailClick = () => {
    setShowPreview(true);
  };

  return (
    <div className="image-wrapper">
      <div
        className="image-container"
        style={{
          backgroundImage: `url('${thumbnail_url || emptyBg}')`,
        }}
        onClick={handleThumbnailClick}
      >
        {thumbnail_url ? null : (
          <>
            <img className="doc-image" src={emptyFile} alt="document" />
            <div className="file-name">{updatedFileName}</div>
          </>
        )}
        {notes?.length > 0 ? (
          <div className="notes-style" ref={tooltipRef}>
            <Tooltip
              title={tooltipTitle}
              overlayClassName="medical-records-tooltip"
              overlayStyle={{ width: 300 }}
              placement="bottom"
              autoAdjustOverflow={true}
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              <Popover
                open={showTooltip}
                onOpenChange={showTooltipPopOver}
                overlayClassName="pp-0"
                trigger={["hover", "click"]}
                placement="bottom"
              >
                <img
                  onClick={() => {
                    setShowTooltip(true);
                  }}
                  style={{ cursor: "pointer" }}
                  src={file}
                  alt="file"
                />
              </Popover>
            </Tooltip>
          </div>
        ) : null}
      </div>

      <div className="document-details">
        <div
          className="d-flex justify-content-between flex-column align-items-start"
          style={{ fontSize: "14px", width: "85%" }}
        >
          <div className="category">{categoryName}</div>
          <div>{dayjs(investigation_date).format("DD MMM, YYYY")}</div>
        </div>
        <div>
          <Dropdown
            className="btn btn-outline btn-more"
            menu={{
              items: getMenuItems(),
            }}
          >
            <div>
              <i className="icon-More" />
            </div>
          </Dropdown>
        </div>
      </div>
      {shouldShowDeletePopup ? (
        <CommonModal
          isModalOpen={shouldShowDeletePopup}
          onCancel={toggleDeletePopup}
          modalWidth={500}
          title={"You may lose your data"}
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>{"Are you sure you want to delete ?"}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex align-items-center mt-2 justify-content-end">
                  <div
                    onClick={handleDelete}
                    className="me-4 text-decoration-underline btn p-0 text-main"
                  >
                    Yes, Delete
                  </div>
                  <Button
                    onClick={toggleDeletePopup}
                    className="lh-lg btn btn-primary3 btn-41 px-4"
                  >
                    <span>No</span>
                  </Button>
                </div>
              </div>
            </>
          }
        />
      ) : null}
      {shouldShowPreview && (
        <Drawer
          closeIcon={false}
          placement="right"
          bodyStyle={{ backgroundColor: "#222222" }}
          onClose={handlePreview}
          open={shouldShowPreview}
          width="100%"
          height={"100%"}
          push={false}
        >
          <DocumentPreview
            onClose={handlePreview}
            cardData={cardData}
            handleEdit={handleEdit}
            toggleDeletePopup={toggleDeletePopup}
            handleInAppDownload={handleInAppDownload}
            handleDownload={handleDownload}
          />
        </Drawer>
      )}
    </div>
  );
};

export default RecordCard;
