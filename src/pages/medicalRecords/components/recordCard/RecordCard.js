import { Dropdown, Popover, Tooltip } from "antd";
import "./RecordCard.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import emptyBg from "./../../../../assets/images/empty-bg.svg";
import emptyFile from "./../../../../assets/images/empty-file.svg";
import file from "./../../../../assets/images/file.svg";
import download from "./../../../../assets/images/document-download.svg";
import edit from "./../../../../assets/images/document-edit.svg";
import trash from "./../../../../assets/images/trash.svg";
import { deleteDocById, fetchAllPatientDocs } from "../../service";
import { setAllUploadedDocs } from "../../../../redux/uploadDocSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isChrome, isSafari } from "react-device-detect";
import axios from "axios";
import { saveAs } from "file-saver";

export function shortenText(
  text,
  length = 30,
  firstPartLength = 23,
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
  handleDrawerUploadDoc,
  setFilesData,
  setIsEditDocument,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data } = state;
  const { uploadDocCategories } = useSelector((state) => state.uploadDoc);
  const { notes, id, url, investigation_date, category_id, display_name } =
    cardData || {};
  const updatedFileName = shortenText(display_name);
  const categoryName = uploadDocCategories.find(
    (item) => item.category_id === category_id
  )?.category_name;

  const [showTooltip, setShowTooltip] = useState(false);
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
  };

  const handleEdit = () => {
    setFilesData([cardData]);
    setIsEditDocument(true);
    handleDrawerUploadDoc();
  };

  const handleInAppDownload = async () => {
    navigate(url, {
      replace: true,
      state: state,
    });
    navigate(0, { replace: true });
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
      saveAs(blob, `${Date.now()}.pdf`);
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
    <div
      className="image-container"
      style={{
        backgroundImage: `url('${emptyBg}')`,
      }}
    >
      <img className="doc-image" src={emptyFile} alt="document" />
      <div className="file-name">{updatedFileName}</div>
      <div className="notes-style" ref={tooltipRef}>
        <Tooltip
          title={tooltipTitle}
          overlayClassName="medical-records-tooltip"
        >
          <Popover
            open={showTooltip}
            onOpenChange={showTooltipPopOver}
            overlayClassName="pp-0"
            trigger={["hover", "click"]}
            placement="bottom"
          >
            <img
              onClick={() => setShowTooltip(true)}
              style={{ cursor: "pointer" }}
              src={file}
              alt="file"
            />
          </Popover>
        </Tooltip>
      </div>
      
      <div className="document-details">
        <div
          className="d-flex justify-content-between flex-column align-items-start"
          style={{ fontSize: "14px", width: "85%" }}
        >
          <div className="category">{categoryName}</div>
          <div>{investigation_date}</div>
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
