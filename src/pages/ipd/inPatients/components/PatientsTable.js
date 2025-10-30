import React, { useState } from "react";
import { Table, Spin, Popover, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
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

  const {
    fetchData,
  } = usePatientsData();
  const [openMoreActionsPopover, setOpenMoreActionsPopover] = useState(null);

  const showHideMoreActionPopover = (recordId) => {
    setOpenMoreActionsPopover((prev) => (prev === recordId ? null : recordId));
  };

  const handleMarkPatientAsDischarged = (record) => {
    dispatch(markPatientAsDischarged({ admissionId: record?.admissionId })).then((res) => {
      if (res?.payload?.status === 400) {
        message.warning(res?.payload?.data?.message || "Patient discharged failed")
      } else {
        message.success("Patient discharged successfully");
        setOpenMoreActionsPopover(null);
        fetchData(fetchParams)
      }
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      className: "fs-14",
      fixed: "left",
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
      fixed: "left",
      render: (text, record) => (
        <div>
          <span
            className="text-primary cursor-pointer"
            onClick={() => onViewDetails(record?.patientData)}
          >
            {record?.patientName}
          </span>
          <br />
          <small>
            {record?.gender}, {`${record?.age}y`}
          </small>
        </div>
      ),
    },
    {
      title: "Patient ID",
      dataIndex: "patientId",
      key: "patientId",
      render: (text, record) => (
        <div className="d-flex align-items-center gap-2">
          <span>{record?.patientId || ""}</span>
          {record?.referral && <Referral />}
        </div>
      ),
    },
    {
      title: "Ward/Bed No",
      dataIndex: "ward",
      key: "ward",
      render: (text, record) => (
        <div>
          <span>
            {record?.ward || "N/A"} / {record?.room || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (text, record) => (
        <div>
          <span>{record.contactNumber || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Admitting Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
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
      render: (_, record) => (
        <div
          size="middle"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button
            className="btn btn-outline-primary"
            style={{ fontSize: "13px !important" }}
            onClick={() => {
              onViewDetails(record?.patientData);
            }}
          >
            View Details
          </button>
          {!isDischargedPatients && !record?.isDischarged ? (
            <Popover
              open={openMoreActionsPopover === record?.patientData?._id}
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
              overlayClassName="pop-200 pp-0 videoTutorial"
              placement="bottomRight"
              arrow={false}
            >
              <img
                onClick={() =>
                  showHideMoreActionPopover(
                    !openMoreActionsPopover ? record?.patientData?._id : null
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
          className="px-xl-4 px-0"
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={false}
          loading={loading && filterParams.page === 1}
          locale={{ emptyText }}
          rowKey="id"
          scroll={{ x: "calc(700px + 30%)" }}
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
