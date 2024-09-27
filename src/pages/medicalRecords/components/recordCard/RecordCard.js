import { Dropdown, Tooltip } from "antd";
import "./RecordCard.scss";
import { useRef, useState } from "react";
import documentImg from "./../../../../assets/images/fallback-thumbnail.svg";
import file from "./../../../../assets/images/file.svg";
import download from "./../../../../assets/images/document-download.svg";
import edit from "./../../../../assets/images/document-edit.svg";
import trash from "./../../../../assets/images/trash.svg";
import { deleteDocById, fetchAllPatientDocs } from "../../service";
import { setAllUploadedDocs } from "../../../../redux/uploadDocSlice";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const RecordCard = ({
  document,
  handleDrawerUploadDoc,
  setFilesData,
  setIsEditDocument,
}) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;
  const { uploadDocCategories } = useSelector((state) => state.uploadDoc);
  const categoryName = uploadDocCategories.find(
    (item) => item.category_id === document?.category_id
  )?.category_name;

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // useEffect(() => {
  //   if (showTooltip) {
  //     document.addEventListener("click", handleTooltipClickOutside);
  //   } else {
  //     document.removeEventListener("click", handleTooltipClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("click", handleTooltipClickOutside);
  //   };
  // }, [showTooltip]);

  const handleTooltipClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setShowTooltip(false);
    }
  };

  const tooltipTitle = () => {
    return (
      <div>
        <div className="notes-txt">Notes</div>
        <div>{document?.notes}</div>
      </div>
    );
  };

  const handleDelete = async () => {
    await deleteDocById(document?.id);
    const response = await fetchAllPatientDocs(patient_data.patient_unique_id);
    dispatch(setAllUploadedDocs(response));
  };

  const handleEdit = () => {
    setFilesData([document]);
    setIsEditDocument(true);
    handleDrawerUploadDoc();
  };

  const getMenuItems = () => {
    return [
      {
        label: (
          <div onClick={() => console.log("download")}>
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
          <div onClick={handleDelete}>
            <img src={trash} alt="delete" className="me-2" />
            Delete
          </div>
        ),
        key: "delete",
      },
    ];
  };
  return (
    <div className="image-container">
      <img
        className="doc-image"
        style={{ borderRadius: "10px" }}
        src={documentImg}
        alt="document"
      />
      <div className="notes-style" ref={tooltipRef}>
        <Tooltip
          title={tooltipTitle}
          overlayClassName="medical-records-tooltip"
          open={showTooltip}
          placement="bottom"
          trigger={["hover", "click"]}
        >
          <img
            onClick={() => setShowTooltip(true)}
            style={{ cursor: "pointer" }}
            src={file}
            alt="file"
          />
        </Tooltip>
      </div>

      <div className="document-details">
        <div
          className="d-flex justify-content-between flex-column align-items-start"
          style={{ fontSize: "14px", width: "85%" }}
        >
          <div className="category">{categoryName}</div>
          <div>{document?.investigation_date}</div>
        </div>
        <div>
          <Dropdown
            className="btn btn-outline btn-more"
            menu={{
              items: getMenuItems(),
            }}
            trigger={["click"]}
          >
            <a
              style={{ padding: "6px" }}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <i className="icon-More" />
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
