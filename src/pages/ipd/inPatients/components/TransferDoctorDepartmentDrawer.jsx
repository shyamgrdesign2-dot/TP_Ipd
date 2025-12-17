import React, { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  doctorDepartmentRoles,
  transferDepartmentDoctor,
} from "../../../../redux/ipd/ipdSlice";
import "./TransferDoctorDepartmentDrawer.scss";

const TransferDoctorDepartmentDrawer = ({
  open,
  onClose,
  patientData,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { doctorDepartmentRoles: deptRoles, loading } = useSelector(
    (state) => state.ipd
  );

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentDepartment = patientData?.doctor?.speciality;
  const currentDoctor = patientData?.doctor?.name;
  const currentDoctorId = patientData?.doctor?.id;

  const departments = useMemo(() => {
    if (Array.isArray(deptRoles?.data)) return deptRoles.data;
    if (Array.isArray(deptRoles)) return deptRoles;
    return [];
  }, [deptRoles]);

  useEffect(() => {
    if (open && (!departments || departments.length === 0)) {
      dispatch(doctorDepartmentRoles());
    }
  }, [open, departments, dispatch]);

  useEffect(() => {
    if (!open) {
      setSelectedDepartmentId(null);
      setSelectedDoctorId(null);
      setSubmitting(false);
    } else if (open && departments.length > 0) {
      // preselect current department/doctor if available in the list
      const dpIdFromPatient =
        patientData?.departmentId ||
        patientData?.department_id ||
        patientData?.dpId ||
        patientData?.dp_id;
      const doctorIdFromPatient =
        patientData?.doctorId ||
        patientData?.doctor_id ||
        patientData?.umId ||
        patientData?.um_id;

      if (dpIdFromPatient) {
        setSelectedDepartmentId(dpIdFromPatient);
        if (doctorIdFromPatient) {
          setSelectedDoctorId(doctorIdFromPatient);
        } else {
          setSelectedDoctorId(null);
        }
      }
    }
  }, [open, departments, patientData]);

  const doctorsByDepartment = useMemo(() => {
    if (!selectedDepartmentId || !departments) return [];
    const foundDept = departments.find(
      (d) => d?.departmentId?.toString() === selectedDepartmentId?.toString()
    );
    return foundDept?.doctors || [];
  }, [selectedDepartmentId, departments]);

  const admissionId =
    patientData?.admissionId ||
    patientData?.admission_id ||
    patientData?.admission?.id ||
    patientData?._id;

  const handleSave = async () => {
    if (!selectedDepartmentId || !selectedDoctorId || !admissionId) return;
    setSubmitting(true);
    try {
      const res = await dispatch(
        transferDepartmentDoctor({
          dpId: selectedDepartmentId,
          umId: selectedDoctorId,
          admissionId,
        })
      );

      if (res?.payload?.status === 400) {
        message.warning(
          res?.payload?.data?.message || "Unable to transfer doctor/department"
        );
      } else if (res?.error) {
        message.error(
          res?.error?.message ||
            res?.payload?.message ||
            "Unable to transfer doctor/department"
        );
      } else {
        message.success("Transfer doctor/dept successful");
        onSuccess?.();
        onClose?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSaveDisabled =
    !selectedDepartmentId || !selectedDoctorId || !admissionId || submitting;

  return (
    <Drawer
      open={open}
      width={720}
      onClose={onClose}
      closeIcon={false}
      destroyOnClose
      className="transfer-doctor-department-drawer"
    >
      <div className="drawer-header">
        <div className="header-left">
          <i className="icon-right cursor-pointer" onClick={onClose}></i>
          <span className="header-title">Transfer Doctor/Department</span>
        </div>
        <Button
          type="primary"
          onClick={handleSave}
          disabled={isSaveDisabled}
          loading={submitting}
        >
          Save
        </Button>
      </div>

      <div className="drawer-body">
        <div className="current-info">
          <div className="info-block">
            <p className="label">Current Admitted Department</p>
            <div className="value-box">{currentDepartment || "-"}</div>
          </div>
          <div className="info-block">
            <p className="label">Current Admitted Doctor</p>
            <div className="value-box">{currentDoctor || "-"}</div>
          </div>
        </div>

        <div className="transfer-separator">
          <span>Transfer to</span>
        </div>

        <div className="field-block">
          <p className="label">Select Department</p>
          <Select
            placeholder="Search & Select by Department name"
            showSearch
            optionFilterProp="label"
            value={selectedDepartmentId}
            onChange={(value) => {
              setSelectedDepartmentId(value);
              setSelectedDoctorId(null);
            }}
            loading={loading}
            className="wide-select"
            options={(departments || []).map((d) => ({
              value: d?.departmentId,
              label: d?.department,
            }))}
          />
        </div>

        <div className="field-block">
          <p className="label">Select Doctor</p>
          <Select
            placeholder="Search & Select by Doctor name"
            showSearch
            optionFilterProp="label"
            value={selectedDoctorId}
            onChange={(value) => setSelectedDoctorId(value)}
            loading={loading}
            className="wide-select"
            disabled={!selectedDepartmentId}
            options={doctorsByDepartment.map((doc) => {
              const docId = doc?.doctorId;
              const isCurrent =
                currentDoctorId &&
                currentDoctorId?.toString() === docId?.toString();
              const baseLabel = doc?.doctorName;
              return {
                value: docId,
                label: isCurrent ? `${baseLabel} (Current Doctor)` : baseLabel,
                disabled: isCurrent,
              };
            })}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default TransferDoctorDepartmentDrawer;
