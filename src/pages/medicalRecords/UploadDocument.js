import { Button, Card, DatePicker, Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import emptyBg from "./../../assets/images/empty-bg.svg";
import emptyFile from "./../../assets/images/empty-file.svg";
import dayjs from "dayjs";
import { disableFutureDates } from "../growthChart/growthChartHelper";
import "./UploadDocument.scss";
import CommonModal from "../../common/CommonModal";
import alertIcon from "./../../assets/images/alertIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPatientDocs,
  fetchDocById,
  updateDocument,
  uploadDocument,
} from "./service";
import { setAllUploadedDocs } from "../../redux/uploadDocSlice";
import { useLocation } from "react-router-dom";
import { shortenText } from "./components/recordCard/RecordCard";

const UploadDocument = ({
  onClose,
  handleDrawerUploadDoc,
  shouldShowDeletePopup,
  setShowDeletePopup,
  filesData,
  setFilesData,
  isEditDocument,
  setIsEditDocument,
  patientData,
  isAppointmentData,
}) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.doctors);
  const { state } = useLocation();
  const patient_data = state?.patient_data || patientData;
  const { uploadDocCategories, allUploadedDocs } = useSelector(
    (state) => state.uploadDoc
  );
  const documentOptions = uploadDocCategories.map((item) => {
    return {
      label: item.category_name,
      value: item.category_id,
    };
  });

  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);

  const [recordData, setRecordData] = useState(
    filesData.map((item) => {
      return {
        id: item?.id,
        name: item?.name,
        recordType: item?.category_id,
        recordUploadDate: item?.investigation_date
          ? item?.investigation_date
          : dayjs().format("YYYY-MM-DD"),
        notes: item?.notes || "",
      };
    })
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (filesData?.length > 0) {
      filesData.forEach((item) => {
        // 8388608 = 8 MB (maximum file size to upload)
        if (item?.size > 8388608) {
          setIsFileSizeError(true);
        }
      });
      if (filesData.length > 5) {
        setIsFileLimitError(true);
      }
    }
  }, [filesData]);

  const handleRecordChange = (index, field, value) => {
    setRecordData((prevData) =>
      prevData.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const toggleDeletePopup = () => {
    setShowDeletePopup(false);
  };

  const handleDeleteRecord = (index) => {
    const updatedFilesData = filesData?.filter((_, i) => i !== index);
    setFilesData([...updatedFilesData]);
    setRecordData((prevData) => prevData.filter((_, i) => i !== index));
    if (updatedFilesData.length === 0) {
      handleDrawerUploadDoc();
    }
  };

  const handleSubmit = async () => {
    if (isEditDocument) {
      const fileData = recordData?.[0];
      if (fileData) {
        const payload = {
          id: fileData?.id,
          category_id: fileData?.recordType,
          investigation_date: fileData?.recordUploadDate,
          notes: fileData?.notes,
        };
        const resultStatus = await updateDocument([payload]);
        if (resultStatus?.status === 204) {
          const response = await fetchDocById(fileData?.id);
          let updatedData = allUploadedDocs.map((item) =>
            item.id === fileData?.id ? response : item
          );

          dispatch(setAllUploadedDocs(updatedData));
        }
      }
      setIsEditDocument(false);
    } else {
      const formData = new FormData();
      filesData.forEach((item) => {
        formData.append("file", item);
      });
      formData.append(
        "pm_id",
        patient_data !== undefined ? patient_data.pm_id : 0
      );
      formData.append(
        "patient_unique_id",
        patient_data !== undefined ? patient_data.patient_unique_id : 0
      );
      formData.append("um_id", userId);
      formData.append(
        "pm_pid",
        patient_data !== undefined ? patient_data.pm_pid : 0
      );
      const uploadResponse = await uploadDocument(formData);
      if (uploadResponse?.length > 0) {
        const payload = uploadResponse.map((item) => {
          const recordItem = recordData.find(
            (record) => record.name === item.name
          );
          return {
            id: item?.id || 0,
            category_id: recordItem?.recordType,
            investigation_date: recordItem?.recordUploadDate,
            notes: recordItem?.notes,
          };
        });
        updateDocument(payload);
      }
      if (!isAppointmentData) {
        const response = await fetchAllPatientDocs(
          patient_data?.patient_unique_id
        );
        dispatch(setAllUploadedDocs(response));
      }
    }
    handleDrawerUploadDoc();
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const totalFiles = [...filesData, ...selectedFiles];
    const newRecordData = selectedFiles?.map((item) => {
      return {
        id: item?.id || 0,
        name: item?.name || "",
        recordType: undefined,
        recordUploadDate: dayjs().format("YYYY-MM-DD"),
        notes: "",
      };
    });
    const updatedRecordData = [...recordData, ...newRecordData];
    setFilesData(totalFiles);
    setRecordData(updatedRecordData);
  };

  const handleRetryBtn = () => {
    setFilesData([]);
    setRecordData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    fileInputRef.current?.click();
  };

  const handleLeaveBtn = () => {
    handleDrawerUploadDoc();
    toggleDeletePopup();
  };

  return (
    <div className="upload-document">
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header h-60 align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
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
            <div className="modal-title">
              {isEditDocument ? "Edit" : "Upload"} Medical Records
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="btn btn-primary3 btn-41 px-4 me-20"
            disabled={
              recordData?.filter((item) => item.recordType === undefined)
                ?.length > 0
            }
          >
            {isEditDocument ? "Save" : "Submit"}
          </Button>
        </div>

        <div style={{ padding: "20px" }}>
          {!isEditDocument ? (
            <Button
              className="btn-41 btn ant-btn-text btn-input"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/jpg, image/gif, application/pdf"
                style={{ display: "none" }}
                disabled={filesData.length >= 5}
              />
              <i className="icon-upload" />
              <span>Upload new report</span>
            </Button>
          ) : null}
        </div>

        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ gap: "24px", padding: "0 24px 24px" }}
        >
          {filesData.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#FAFAFB",
                borderRadius: "16px",
                padding: "16px 24px",
              }}
            >
              <div className="d-flex justify-content-between pb-3">
                <span style={{ fontWeight: 500 }}>{item?.name}</span>
                {!isEditDocument ? (
                  <i
                    className="icon-delete"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteRecord(index)}
                  />
                ) : null}
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "32px" }}
              >
                <div>
                  <div
                    className="image-container"
                    style={{
                      backgroundImage: `url('${emptyBg}')`,
                      height: 144,
                      width: 144,
                      border: "1px solid #F1F1F5",
                      paddingBottom: "0px",
                    }}
                  >
                    <img
                      className="doc-image"
                      width={62}
                      height={62}
                      src={emptyFile}
                      alt="document"
                    />
                    <div className="file-name">
                      {shortenText(item?.name, 20, 13, -7)}
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    className="d-flex align-items-center w-100 justify-content-between"
                    style={{ gap: "32px" }}
                  >
                    <div style={{ width: "50%" }}>
                      <label className="label" style={{ marginBottom: 5 }}>
                        Record Type<span className="mandatory">*</span>
                      </label>
                      <Select
                        style={{ height: 38 }}
                        onChange={(value) =>
                          handleRecordChange(index, "recordType", value)
                        }
                        options={documentOptions}
                        placeholder="Select"
                        className="w-100"
                        value={recordData?.[index]?.recordType}
                        allowClear
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <label style={{ marginBottom: 5 }} className="label">
                        Date of Investigation
                        <span className="mandatory">*</span>
                      </label>
                      <DatePicker
                        placeholder="Select Date"
                        onChange={(_, d) => {
                          handleRecordChange(
                            index,
                            "recordUploadDate",
                            d
                              ? dayjs(d, "DD MMM YYYY").format("YYYY-MM-DD")
                              : ""
                          );
                        }}
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                        format="DD MMM YYYY"
                        value={
                          recordData?.[index]?.recordUploadDate
                            ? dayjs(recordData?.[index]?.recordUploadDate)
                            : ""
                        }
                        allowClear={false}
                        disabledDate={disableFutureDates}
                        defaultValue={dayjs()}
                      />
                    </div>
                  </div>
                  <div style={{ paddingTop: "12px" }}>
                    <label style={{ marginBottom: 5 }} className="label">
                      Notes
                    </label>
                    <Input.TextArea
                      placeholder="Enter remarks"
                      className="textareaPlaceholder"
                      style={{ height: "38px" }}
                      rows={1}
                      value={recordData?.[index]?.notes}
                      onChange={(e) =>
                        handleRecordChange(index, "notes", e.target.value)
                      }
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <CommonModal
        isModalOpen={
          shouldShowDeletePopup || isFileSizeError || isFileLimitError
        }
        onCancel={
          isFileSizeError || isFileLimitError
            ? handleDrawerUploadDoc
            : toggleDeletePopup
        }
        modalWidth={500}
        title={
          isFileSizeError
            ? "Exceeded File Size"
            : isFileLimitError
            ? "Exceeded File Upload Limit"
            : "You may lose your data"
        }
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>
                  {isFileSizeError ? (
                    <>
                      The file size exceeded{" "}
                      <span style={{ fontWeight: 700 }}>8MB.</span> Please
                      upload a file smaller than 8MB
                    </>
                  ) : isFileLimitError ? (
                    <>
                      You can only upload up to
                      <span style={{ fontWeight: 700 }}> 5 files.</span> Please
                      reduce the number of files and try again.
                    </>
                  ) : (
                    "Are you sure you want to leave ?"
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4">
              {isFileSizeError || isFileLimitError ? (
                <Button
                  onClick={handleRetryBtn}
                  className="w-100 btn btn-primary3 btn-41 px-4"
                >
                  Retry
                </Button>
              ) : (
                <div className="d-flex align-items-center mt-2 justify-content-end">
                  <div
                    onClick={handleLeaveBtn}
                    className="me-4 text-decoration-underline btn p-0 text-main"
                  >
                    Yes Leave
                  </div>
                  <Button
                    onClick={toggleDeletePopup}
                    className="lh-lg btn btn-primary3 btn-41 px-4"
                  >
                    <span>No, Stay</span>
                  </Button>
                </div>
              )}
            </div>
          </>
        }
      />
    </div>
  );
};

export default UploadDocument;
