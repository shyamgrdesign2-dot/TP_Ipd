import React, { useState } from "react";
import { Table, Spin, Popover, message } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import noData from "../../../../assets/images/nodata-found.svg";
import Referral from "./Referral";
import "../InPatients.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { defaultIcons as newIcons } from "../../../../assets/images/indices";
import { markPatientAsDischarged } from "../../../../redux/ipd/ipdSlice";
import { usePatientsData } from "../hooks/usePatientsData";

const MoreActionsContent = ({ handleMarkPatientAsDischarged, record }) => {
  return (
    <div
      onClick={() => handleMarkPatientAsDischarged(record)}
      className="more-actions-content cursor-pointer"
    >
      <img src={newIcons.dischargedPatientsSc} alt="dischargedPatientsSc" />
      <div className="fs16-semibold-primary">Discharge Patient</div>
    </div>
  );
};

const PatientsTable = ({
  data,
  loading,
  error,
  onChange,
  onViewDetails,
  loadingMore,
  hasMore,
  lastElementRef,
  filterParams,
  isDischargedPatients = false,
  fetchParams = {},
}) => {
  const dispatch = useDispatch();

  const { fetchData } = usePatientsData();
  const [openMoreActionsPopover, setOpenMoreActionsPopover] = useState(null);

  const showHideMoreActionPopover = (recordId) => {
    setOpenMoreActionsPopover((prev) => (prev === recordId ? null : recordId));
  };

  const handleMarkPatientAsDischarged = (record) => {
    dispatch(
      markPatientAsDischarged({ admissionId: record?.admissionId })
    ).then((res) => {
      if (res?.payload?.status === 400) {
        message.warning(
          res?.payload?.data?.message || "Patient discharged failed"
        );
      } else {
        message.success("Patient discharged successfully");
        setOpenMoreActionsPopover(null);
        fetchData(fetchParams);
      }
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      className: "col-sno fs-14",
      render: (text, record, index) => (
        <div>
          <span>{index + 1}</span>
        </div>
      ),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientName",
      key: "patientName",
      className: "col-patient-details",
      render: (text, record) => (
        <div>
          <span
            className="text-primary cursor-pointer"
            onClick={() => onViewDetails(record?.patientData)}
          >
            {record?.patientName}
          </span>
          <small>
            {record?.gender}, {`${record?.age}y`}
          </small>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      className: "col-contact",
      render: (text, record) => (
        <div className="contact-cell">
          <span>{record.contactNumber || "N/A"}</span>
          {record?.referral ? <Referral /> : null}
        </div>
      ),
    },
    // {
    //   title: "Patient ID / Mrno",
    //   dataIndex: "patientId",
    //   key: "patientId",
    //   className: "col-patient-details",
    //   render: (text, record) => (
    //     <div>
    //       <div>{record?.patientId || ""}</div>
    //       <small>{record?.mrno}</small>
    //     </div>
    //   ),
    // },
    {
      title: "Admission Id / MRN id",
      dataIndex: "admissionNo",
      key: "admissionNo",
      className: "col-patient-details",
      render: (text, record) => (
        <div>
          <div>{record?.admissionNo || ""}</div>
          <small>{record?.mrno}</small>
        </div>
      ),
    },
    {
      title: "Ward/Bed No",
      dataIndex: "ward",
      key: "ward",
      className: "col-ward-bed",
      render: (text, record) => (
        <div>
          <span>
            {record?.ward || "N/A"} / {record?.room || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Admitting Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      className: "col-admitting-doctor",
      render: (text, record) => (
        <div>
          <span>{record.doctorName || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Admitted On",
      dataIndex: "admittedOn",
      key: "admittedOn",
      className: "col-admitted-on",
      sortDirections: ["descend", "ascend", "descend"],
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const aDate = moment(a.admittedOn).valueOf();
        const bDate = moment(b.admittedOn).valueOf();
        return aDate - bDate;
      },
      render: (text, record) => {
        const dateTime = moment(record.admittedOn);
        return <div>{dateTime.format("DD-MM-YYYY")}</div>;
      },
    },
    ...(isDischargedPatients
      ? [
          {
            title: "Discharged On",
            dataIndex: "dischargedAt",
            key: "dischargedAt",
            className: "col-discharged-on",
            sortDirections: ["descend", "ascend", "descend"],
            defaultSortOrder: "descend",
            sorter: (a, b) => {
              const aDate = moment(a.dischargedAt).valueOf();
              const bDate = moment(b.dischargedAt).valueOf();
              return aDate - bDate;
            },
            render: (text, record) => {
              const dateTime = moment(record.dischargedAt);
              return <div>{dateTime.format("DD-MM-YYYY")}</div>;
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      fixed: "right",
      className: "col-action",
      render: (_, record) => (
        <div
          size="middle"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button
            className="view-details-btn"
            onClick={() => {
              onViewDetails(record?.patientData);
            }}
          >
            View Details
          </button>
          {!isDischargedPatients && !record?.isDischarged ? (
            <Popover
              open={openMoreActionsPopover === record?.patientData?.admissionId}
              onOpenChange={(open) => {
                if (!open) {
                  setOpenMoreActionsPopover(null);
                }
              }}
              content={
                <MoreActionsContent
                  handleMarkPatientAsDischarged={handleMarkPatientAsDischarged}
                  record={record?.patientData}
                />
              }
              trigger="click"
              overlayClassName="zindex-1000 pp-0 videoTutorial"
              placement="bottomRight"
              arrow={false}
            >
              <img
                onClick={() =>
                  showHideMoreActionPopover(
                    !openMoreActionsPopover
                      ? record?.patientData?.admissionId
                      : null
                  )
                }
                className="cursor-pointer"
                src={defaultIcons.moreIcon}
                alt={":"}
              />
            </Popover>
          ) : null}
        </div>
      ),
    },
  ];

  const emptyText = (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 350px)" }}
    >
      <img src={noData} alt="Warning" />
      <div className="mt-3 fontroboto fw-normal">
        {error
          ? "Using static data. No patients match your filters."
          : "There are no patients right now!"}
      </div>
    </div>
  );

  return (
    <div>
      <div className="inpatients-table-container">
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={false}
          loading={loading && filterParams.page === 1}
          locale={{ emptyText }}
          rowKey="id"
          scroll={{ x: 1300 }}
        />
      </div>

      {loadingMore && (
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
            backgroundColor: "#f0f2f5",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Spin tip="Loading more..." />
        </div>
      )}

      {!loading && !loadingMore && hasMore && (
        <div ref={lastElementRef} style={{ height: "20px" }}></div>
      )}
    </div>
  );
};

export default PatientsTable;
