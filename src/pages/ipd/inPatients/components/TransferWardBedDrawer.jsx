import React, { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Radio, Select, Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchWards, transferWardBed } from "../../../../redux/ipd/ipdSlice";
import "./TransferWardBedDrawer.scss";

const TransferWardBedDrawer = ({ open, onClose, patientData, onSuccess }) => {
  const dispatch = useDispatch();
  const { wards: wardsData, loading: wardsLoading } = useSelector((state) => state.ipd);
  const wards = Array.isArray(wardsData) ? wardsData : [];

  const [selectedWardId, setSelectedWardId] = useState(null);
  const [selectedBedId, setSelectedBedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentWardId =
    patientData?.ward?.id ||
    patientData?.ward?._id ||
    patientData?.wardId ||
    patientData?.ward?.wardId ||
    patientData?.ward_id;
  const currentWardName =
    patientData?.ward?.title ||
    patientData?.ward?.name ||
    patientData?.wardName ||
    patientData?.ward ||
    "-";

  const currentBedId =
    patientData?.room?.id ||
    patientData?.room?._id ||
    patientData?.roomId ||
    patientData?.room?.roomId ||
    patientData?.bedId ||
    patientData?.room?.uid;
  const currentBedName =
    patientData?.room?.title ||
    patientData?.room?.name ||
    patientData?.bedNumber ||
    patientData?.room?.roomName ||
    patientData?.room ||
    "-";

  useEffect(() => {
    if (open && (!Array.isArray(wards) || wards.length === 0)) {
      dispatch(fetchWards({ includeAll: true }));
    }
  }, [open, wards, dispatch]);

  useEffect(() => {
    if (!open) {
      setSelectedWardId(null);
      setSelectedBedId(null);
      setSubmitting(false);
    }
  }, [open]);

  const selectedWard = useMemo(() => {
    return wards?.find((w) => w?._id === selectedWardId || w?.id === selectedWardId);
  }, [selectedWardId, wards]);

  const rooms = useMemo(() => {
    if (!selectedWard) return [];
    return (
      selectedWard.rooms?.filter((room) => room && room.isDeleted !== true) || []
    );
  }, [selectedWard]);

  const bedStats = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let blocked = 0;

    rooms.forEach((room) => {
      if (room.isBlocked) {
        blocked += 1;
      } else if (room.available) {
        available += 1;
      } else {
        occupied += 1;
      }
    });
    return { available, occupied, blocked };
  }, [rooms]);

  const handleWardChange = (wardId) => {
    setSelectedWardId(wardId);
    setSelectedBedId(null);
  };

  const handleBedSelect = (roomId) => {
    setSelectedBedId(roomId);
  };

  const admissionId =
    patientData?.admissionId ||
    patientData?.admission_id ||
    patientData?.admission?.id ||
    patientData?._id;

  const handleSave = async () => {
    if (!selectedWardId || !selectedBedId || !admissionId) return;
    setSubmitting(true);
    try {
      const res = await dispatch(
        transferWardBed({
          wardId: selectedWardId,
          roomId: selectedBedId,
          admissionId,
        })
      );

      if (res?.payload?.status === 400) {
        message.warning(res?.payload?.data?.message || "Unable to transfer bed");
      } else if (res?.error) {
        message.error(
          res?.error?.message ||
            res?.payload?.message ||
            "Unable to transfer bed"
        );
      } else {
        message.success("Transfer bed successful");
        onSuccess?.();
        onClose?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSaveDisabled =
    !selectedWardId || !selectedBedId || !admissionId || submitting;

  return (
    <Drawer
      open={open}
      width={760}
      closeIcon={false}
      onClose={onClose}
      destroyOnClose
      className="transfer-ward-bed-drawer"
    >
      <div className="drawer-header">
        <div className="header-left">
          <i className="icon-right cursor-pointer" onClick={onClose}></i>
          <span className="header-title">Transfer Ward/Bed</span>
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
            <p className="label">Current Admitted Ward</p>
            <div className="value-box">{currentWardName || "-"}</div>
          </div>
          <div className="info-block">
            <p className="label">Current Bed</p>
            <div className="value-box">{currentBedName || "-"}</div>
          </div>
        </div>

        <div className="transfer-separator">
          <span>Transfer to</span>
        </div>

        <div className="field-block">
          <p className="label">Select Ward</p>
          <Select
            placeholder="Search & Select by Ward name"
            showSearch
            optionFilterProp="label"
            value={selectedWardId}
            onChange={handleWardChange}
            loading={wardsLoading}
            className="ward-select"
            options={(wards || []).map((ward) => ({
              value: ward?._id || ward?.id,
              label: ward?.name || ward?.wardName || ward?.title || "",
            }))}
          />
        </div>

        {selectedWard && (
          <>
            <div className="beds-header">
              <p className="label">
                Select a Bed in {selectedWard?.name || selectedWard?.wardName}
              </p>
              <div className="bed-tags">
                <Tag className="tag available">
                  Available ({bedStats.available.toString().padStart(2, "0")})
                </Tag>
                <Tag className="tag occupied">
                  Occupied ({bedStats.occupied.toString().padStart(2, "0")})
                </Tag>
                <Tag className="tag blocked">
                  Blocked ({bedStats.blocked.toString().padStart(2, "0")})
                </Tag>
              </div>
            </div>

            <div className="bed-grid">
              {rooms.map((room) => {
                const bedId = room?._id || room?.id;
                const status = room.isBlocked
                  ? "blocked"
                  : room.available
                  ? "available"
                  : "occupied";
                const isCurrentBed = bedId === currentBedId;
                const disabled = status !== "available" || isCurrentBed;
                const isSelected = selectedBedId === bedId;

                return (
                  <div
                    key={bedId}
                    className={`bed-card ${status} ${
                      isSelected ? "selected" : ""
                    } ${isCurrentBed ? "current" : ""}`}
                    onClick={() => {
                      if (!disabled) handleBedSelect(bedId);
                    }}
                  >
                    <Radio
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => {
                        if (!disabled) handleBedSelect(bedId);
                      }}
                    />
                    <div className="bed-name">
                      {room?.name || room?.title || ""}
                      {isCurrentBed && (
                        <span className="bed-subtext">(Current Bed)</span>
                      )}
                      {!isCurrentBed && status !== "available" && (
                        <span className="bed-subtext">
                          {status === "occupied" ? "(Occupied)" : "(Blocked)"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default TransferWardBedDrawer;
