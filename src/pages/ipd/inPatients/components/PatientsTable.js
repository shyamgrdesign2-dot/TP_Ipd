import React, { useEffect, useRef, useState } from "react";
import { Table, Spin, Popover, message, Drawer } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import noData from "../../../../assets/images/nodata-found.svg";
import Referral from "./Referral";
import "../InPatients.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { defaultIcons as newIcons } from "../../../../assets/images/indices";
import {
  markPatientAsDischarged,
  sendForDischargeApproval,
} from "../../../../redux/ipd/ipdSlice";
import { updatePatientInList } from "../../../../redux/ipd/inPatientsSlice";
import { usePatientsData } from "../hooks/usePatientsData";
import { getTokenData, isEmptyRichText, isZydus, transformAdmissionToPatient } from "../../../../utils/utils";
import DischargeConfirmationModal from "../../dischargeSummary/components/DischargeConfirmationModal";
import DischargeConfirmationPopup from "../../dischargeSummary/components/DischargeConfirmationPopup";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_ZYDUS_USER } from "../../../../utils/constants";
import { env } from "../../../../EnvironmentConfig";
import AdmissionDetailsDrawer from "./AdmissionDetailsDrawer";
import TransferWardBedDrawer from "./TransferWardBedDrawer";
import TransferDoctorDepartmentDrawer from "./TransferDoctorDepartmentDrawer";
import CreateBill from "../../../opdBilling/components/createBill/CreateBill";
import AddAdvance from "../../../opdBilling/components/advanceDeposit/AddAdvance";
import abhaLogo from "../../../../assets/images/icons/abha.svg";

const RichTextEditor = createRemoteComponent("RichTextEditor");

const MoreActionsContent = ({
  onCtaClick,
  record,
  title,
  onViewAdmissionDetails,
  onTransferWardBed,
  onTransferDoctorDepartment,
  onCreateBill,
  onAddAdvance,
  isDischargedPatients,
  isDischarged,
  isInPatients,
}) => {
  const handleViewAdmissionDetails = (e) => {
    e.stopPropagation();
    onViewAdmissionDetails?.(record);
  };

  const handleDischargeClick = (e) => {
    e.stopPropagation();
    onCtaClick?.(record);
  };

  const handleTransferWardBed = (e) => {
    e.stopPropagation();
    onTransferWardBed?.(record);
  };

  const handleTransferDoctorDepartment = (e) => {
    e.stopPropagation();
    onTransferDoctorDepartment?.(record);
  };

  const handleCreateBill = (e) => {
    e.stopPropagation();
    onCreateBill?.(record);
  };

  const handleAddAdvance = (e) => {
    e.stopPropagation();
    onAddAdvance?.(record);
  };

  return (
    <div className="more-actions-menu">
      <div
        onClick={handleViewAdmissionDetails}
        className="more-actions-menu-item cursor-pointer"
      >
        <span className="more-actions-menu-text">View Admission Details</span>
      </div>
      {isInPatients && !isDischargedPatients && !isDischarged && (
        <div
          onClick={handleCreateBill}
          className="more-actions-menu-item cursor-pointer"
        >
          <span className="more-actions-menu-text">Create Bill</span>
        </div>
      )}
      {isInPatients && !isDischargedPatients && !isDischarged && (
        <div
          onClick={handleAddAdvance}
          className="more-actions-menu-item cursor-pointer"
        >
          <span className="more-actions-menu-text">Add Advance</span>
        </div>
      )}
      {isInPatients && !isDischargedPatients && !isDischarged && (
        <div
          onClick={handleTransferWardBed}
          className="more-actions-menu-item cursor-pointer"
        >
          <span className="more-actions-menu-text">Transfer Ward/Bed</span>
        </div>
      )}
      {isInPatients && !isDischargedPatients && !isDischarged && (
        <div
          onClick={handleTransferDoctorDepartment}
          className="more-actions-menu-item cursor-pointer"
        >
          <span className="more-actions-menu-text">
            Transfer Doctor/Department
          </span>
        </div>
      )}
      {!isDischargedPatients && !isDischarged && title && (
        <div
          onClick={handleDischargeClick}
          className="more-actions-menu-item cursor-pointer"
        >
          {/* <img src={newIcons.dischargedPatientsSc} alt="dischargedPatientsSc" className="more-actions-menu-icon" /> */}
          <span className="more-actions-menu-text">{title}</span>
        </div>
      )}
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
  isInPatients = false,
  isDischargeQueue = false,
}) => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [warningModalOpen, setWarningModalOpen] = useState(null);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(null);
  const [isDischargeSubmitting, setIsDischargeSubmitting] = useState(false);
  const dischargeLockRef = useRef(false);
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  const [transferDrawerOpen, setTransferDrawerOpen] = useState(false);
  const [patientForTransfer, setPatientForTransfer] = useState(null);
  const [doctorDeptDrawerOpen, setDoctorDeptDrawerOpen] = useState(false);
  const [patientForDoctorDept, setPatientForDoctorDept] = useState(null);

  const izZydusUser =
    (getTokenData()?.hospital_business_id == env.zydus_business_id &&
    isZydusUserAccessableFromGB);

  useEffect(() => {
    const { user_id } = getTokenData();
    setUserId(user_id);
  }, []);

  const { fetchData } = usePatientsData();
  const [openMoreActionsPopover, setOpenMoreActionsPopover] = useState(null);
  const [apiToCall, setApiToCall] = useState("");
  const dischargeConfirmationModalRef = useRef(null);
  const [admissionDetailsDrawerOpen, setAdmissionDetailsDrawerOpen] = useState(false);
  const [selectedPatientForAdmissionDetails, setSelectedPatientForAdmissionDetails] = useState(null);
  const [createBillDrawer, setCreateBillDrawer] = useState(false);
  const [addAdvanceDrawer, setAddAdvanceDrawer] = useState(false);
  const [selectedPatientForBilling, setSelectedPatientForBilling] = useState(null);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const showHideMoreActionPopover = (recordId) => {
    setOpenMoreActionsPopover((prev) => (prev === recordId ? null : recordId));
  };

  const handleMarkPatientAsDischarged = (record) => {
    setWarningModalOpen(record);
    setApiToCall("markPatientAsDischarged");
  };

  const dischargePatient = async () => {
    if (dischargeLockRef.current) return;
    dischargeLockRef.current = true;
    setIsDischargeSubmitting(true);
    const admissionId = warningModalOpen?.admissionId;
    if (!admissionId) {
      message.warning("Admission ID is missing. Please try again.");
      dischargeLockRef.current = false;
      setIsDischargeSubmitting(false);
      return;
    }
    try {
      dischargeConfirmationModalRef?.current?.clearFormData();
      setConfirmPopupOpen(null);
      setWarningModalOpen(null);
      await dispatch(
        markPatientAsDischarged({
          admissionId,
          ...(confirmPopupOpen || {}),
        })
      ).unwrap();
      message.success("Patient discharged successfully");
      setApiToCall("");
      setOpenMoreActionsPopover(null);
      fetchData(fetchParams);
    } catch (err) {
      message.warning(
        err?.response?.data?.message ||
          err?.message ||
          "Patient discharged failed"
      );
    } finally {
      dischargeConfirmationModalRef?.current?.clearFormData();
      setConfirmPopupOpen(null);
      setWarningModalOpen(null);
      dischargeLockRef.current = false;
      setIsDischargeSubmitting(false);
    }
  };

  const handleSendForDischargeApproval = (record) => {
    setWarningModalOpen(record);
    setApiToCall("sendForDischargeApproval");
  };

  const handleTransferWardBed = (record) => {
    setOpenMoreActionsPopover(null);
    setPatientForTransfer(record);
    setTransferDrawerOpen(true);
  };

  const handleTransferDoctorDepartment = (record) => {
    setOpenMoreActionsPopover(null);
    setPatientForDoctorDept(record);
    setDoctorDeptDrawerOpen(true);
  };

  const handleCreateBill = (record) => {
    setOpenMoreActionsPopover(null);
    setSelectedPatientForBilling(record);
    setCreateBillDrawer(true);
  };

  const handleCreateBillDrawer = () => {
    setCreateBillDrawer(false);
    setSelectedPatientForBilling(null);
  };

  const handleAddAdvance = (record) => {
    setOpenMoreActionsPopover(null);
    setSelectedPatientForBilling(record);
    setAddAdvanceDrawer(true);
  };

  const handleAddAdvanceDrawer = () => {
    setAddAdvanceDrawer(false);
    setSelectedPatientForBilling(null);
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const applyWardTransferLocally = (payload) => {
    if (!payload?.patientId) return;
    const patientData = patientForTransfer || {};
    const updatedPatientData = {
      ...patientData,
      ward: {
        ...(patientData?.ward || {}),
        id: payload.wardId,
        title: payload.wardName,
      },
      room: {
        ...(patientData?.room || {}),
        id: payload.roomId,
        title: payload.roomName,
      },
    };

    dispatch(
      updatePatientInList({
        patientId: payload.patientId,
        updates: {
          ward: payload.wardName || updatedPatientData?.ward?.title,
          room: payload.roomName || updatedPatientData?.room?.title,
          bedNumber: payload.roomName || updatedPatientData?.room?.title,
        },
        patientDataUpdates: updatedPatientData,
      })
    );
  };

  const applyDoctorTransferLocally = (payload) => {
    if (!payload?.patientId) return;
    const patientData = patientForDoctorDept || {};
    const updatedPatientData = {
      ...patientData,
      doctor: {
        ...(patientData?.doctor || {}),
        id: payload.doctorId,
        name: payload.doctorName,
        speciality: payload.departmentName,
      },
      departmentName: payload.departmentName,
    };

    dispatch(
      updatePatientInList({
        patientId: payload.patientId,
        updates: {
          doctorName: payload.doctorName,
        },
        patientDataUpdates: updatedPatientData,
      })
    );
  };

  const sentForDischargeApproval = async () => {
    if (dischargeLockRef.current) return;
    dischargeLockRef.current = true;
    setIsDischargeSubmitting(true);
    const admissionId = warningModalOpen?.admissionId;
    if (!admissionId) {
      message.warning("Admission ID is missing. Please try again.");
      dischargeLockRef.current = false;
      setIsDischargeSubmitting(false);
      return;
    }
    try {
      await dispatch(
        sendForDischargeApproval({
          admissionId,
          ...(confirmPopupOpen || {}),
        })
      ).unwrap();
      message.success("Patient sent for discharge approval successfully");
      setApiToCall("");
      setOpenMoreActionsPopover(null);
      fetchData(fetchParams);
    } catch (err) {
      message.warning(
        err?.response?.data?.message ||
          err?.message ||
          "Send for approval failed"
      );
    } finally {
      dischargeConfirmationModalRef?.current?.clearFormData();
      setConfirmPopupOpen(null);
      setWarningModalOpen(null);
      dischargeLockRef.current = false;
      setIsDischargeSubmitting(false);
    }
  };

  const handleWarningModalClose = () => {
    setWarningModalOpen(null);
  };

  const showConfirmPopup = (data) => {
    setConfirmPopupOpen(data);
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
      render: (text, record) => {
        const details = record?.patientData?.details || {};
        const abhaId = details?.abha_address || "";
        const abhaRegistrationNumber =
          details?.abha_number || "";
        const showAbhaLogo =
          !!String(abhaId).trim() && !!String(abhaRegistrationNumber).trim();
        return (
          <div>
            <span
              className="text-primary cursor-pointer"
              onClick={() => onViewDetails(record?.patientData)}
            >
              {record?.patientName}
              {showAbhaLogo && (
                <img
                  src={abhaLogo}
                  alt="ABHA"
                  style={{
                    height: 16,
                    width: 16,
                    marginLeft: 4,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </span>
            <small>
              {record?.gender}, {`${record?.age}y`}
            </small>
          </div>
        );
      },
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
    {
      title: isZydus() ? "Admission No / MRN No" : "Admission Id",
      dataIndex: "admissionNo",
      key: "admissionNo",
      className: "col-patient-details",
      render: (text, record) => (
        <>
          { isZydus() ?
            <div>
              <div>{record?.admissionNo || ""}</div>
              <small>{record?.mrno}</small>
            </div> :
            <div>
              <div>{record?.admissionId || ""}</div>
            </div>
          }
        </>
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
          {
            title: "Discharge Type",
            dataIndex: "dischargeType",
            key: "dischargeType",
            className: "col-discharged-on",
            sortDirections: ["descend", "ascend", "descend"],
            defaultSortOrder: "descend",
            sorter: (a, b) => {
              const aDate = moment(a.dischargeType).valueOf();
              const bDate = moment(b.dischargeType).valueOf();
              return aDate - bDate;
            },
            render: (text, record) => {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{record.dischargeType || "Normal"}</span>
                  {!isEmptyRichText(record.dischargeRemarks) ? (
                    <Popover
                      title={"Additional Remarks"}
                      placement="bottomRight"
                      content={
                        <RichTextEditor
                          readOnly={true}
                          className={"tooltip-rich-text-editor-readonly"}
                          showToolbar={false}
                          initialValue={record.dischargeRemarks}
                        />
                      }
                    >
                      <i
                        className="icon-info fs-16"
                        style={{ cursor: "pointer", color: "#A2A2A8" }}
                      />
                    </Popover>
                  ) : null}
                </div>
              );
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      fixed: "right",
      className: "col-action",
      render: (_, record, index) => {
        const isAdmittingDoctor = record?.doctorId === userId;
        // const isAdmittingDoctor = true;
        const actionObj = isInPatients
          ? isAdmittingDoctor
            ? {
                title: "Discharge Patient",
                onCtaClick: handleMarkPatientAsDischarged,
              }
            : izZydusUser
            ? {
                title: "Send For Discharge Approval",
                onCtaClick: handleSendForDischargeApproval,
              }
            : {
                title: "Discharge Patient",
                onCtaClick: handleMarkPatientAsDischarged,
              }
          :
          //  isAdmittingDoctor && (TODO: INTEL - Commented for now, but might need it in future)
          isDischargeQueue
          ? {
              title: "Discharge Patient",
              onCtaClick: handleMarkPatientAsDischarged,
            }
          : null;
        const popoverKey =
          record?.patientData?.admissionId ??
          record?.admissionId ??
          record?.patientData?.patientId ??
          record?.patientId ??
          record?.patientData?.id ??
          record?.id ??
          index;
        return (
          <div
            size="middle"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button
              className="view-details-btn"
              // onClick={() => {
              //   setSelectedPatientForAdmissionDetails(record?.patientData);
              //   setAdmissionDetailsDrawerOpen(true);
              // }}
              onClick={() => {
                onViewDetails(record?.patientData);
              }}
            >
              View Details
            </button>
            {(
              <Popover
                open={openMoreActionsPopover === popoverKey}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenMoreActionsPopover(null);
                  }
                }}
                content={
                  <MoreActionsContent
                    onCtaClick={actionObj?.onCtaClick}
                    record={record?.patientData}
                    title={actionObj?.title}
                    onViewAdmissionDetails={(patientData) => {
                      setOpenMoreActionsPopover(null);
                      setSelectedPatientForAdmissionDetails(patientData);
                      setAdmissionDetailsDrawerOpen(true);
                    }}
                    onTransferWardBed={handleTransferWardBed}
                    onTransferDoctorDepartment={handleTransferDoctorDepartment}
                    onCreateBill={handleCreateBill}
                    onAddAdvance={handleAddAdvance}
                    isDischargedPatients={isDischargedPatients}
                    isDischarged={record?.isDischarged}
                    isInPatients={isInPatients}
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
                      !openMoreActionsPopover ? popoverKey
                        : null
                    )
                  }
                  className="cursor-pointer"
                  src={defaultIcons.moreIcon}
                  alt={":"}
                />
              </Popover>
            )}
          </div>
        );
      },
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
          : isDischargeQueue
          ? "There are no patients in the discharge queue right now!"
          : isDischargedPatients
          ? "There are no discharged patients right now!"
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
      <DischargeConfirmationModal
        open={warningModalOpen}
        ref={dischargeConfirmationModalRef}
        closeClick={handleWarningModalClose}
        submitClick={showConfirmPopup}
        dateOfDischarge={warningModalOpen?.dateOfDischarge}
        timeOfDischarge={warningModalOpen?.timeOfDischarge}
        dischargeType={warningModalOpen?.dischargeType}
        dischargeRemarks={warningModalOpen?.dischargeRemarks}
        apiToCall={apiToCall}
        patientId={
          warningModalOpen?.details?.id || 
          warningModalOpen?.patientId ||
          warningModalOpen?.patient_id ||
          warningModalOpen?.patientDetails?.id
        }
        admissionId={
          warningModalOpen?.admissionId ||
          warningModalOpen?.admission_id ||
          warningModalOpen?.admissionDetails?.id ||
          warningModalOpen?.admission?.id
        }
      />
      <DischargeConfirmationPopup
        apiToCall={apiToCall}
        isModalOpen={confirmPopupOpen}
        onCancel={() => {
          setConfirmPopupOpen(null);
        }}
        onConfirm={
          apiToCall === "markPatientAsDischarged"
            ? dischargePatient
            : sentForDischargeApproval
        }
        isConfirmLoading={isDischargeSubmitting}
      />
      <AdmissionDetailsDrawer
        open={admissionDetailsDrawerOpen}
        onClose={() => {
          setAdmissionDetailsDrawerOpen(false);
          setSelectedPatientForAdmissionDetails(null);
        }}
        patientData={selectedPatientForAdmissionDetails}
      />
      <TransferWardBedDrawer
        open={transferDrawerOpen}
        onClose={() => {
          setTransferDrawerOpen(false);
          setPatientForTransfer(null);
        }}
        patientData={patientForTransfer}
        onSuccess={applyWardTransferLocally}
      />
      <TransferDoctorDepartmentDrawer
        open={doctorDeptDrawerOpen}
        onClose={() => {
          setDoctorDeptDrawerOpen(false);
          setPatientForDoctorDept(null);
        }}
        patientData={patientForDoctorDept}
        onSuccess={applyDoctorTransferLocally}
      />
      {createBillDrawer && selectedPatientForBilling && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleCreateBillDrawer}
          open={createBillDrawer}
          width="100%"
          push={false}
        >
          <CreateBill
            handleCreateBillDrawer={handleCreateBillDrawer}
            isBackModalOpen={isBackModalOpen}
            showHideBackModal={showHideBackModal}
            patientData={transformAdmissionToPatient(selectedPatientForBilling)}
            admissionId={selectedPatientForBilling?.admissionId || selectedPatientForBilling?.admission_id}
            admissionDate={selectedPatientForBilling?.admittedOn || selectedPatientForBilling?.admissionDate}
          />
        </Drawer>
      )}
      {addAdvanceDrawer && selectedPatientForBilling && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleAddAdvanceDrawer}
          open={addAdvanceDrawer}
          width="100%"
          push={false}
        >
          <AddAdvance
            handleAddAdvanceDrawer={handleAddAdvanceDrawer}
            patientData={transformAdmissionToPatient(selectedPatientForBilling)}
            isReceptionistDashboard={false}
          />
        </Drawer>
      )}
    </div>
  );
};

export default PatientsTable;
