import React, { useState, useMemo } from "react";
import { Drawer, Input, Radio, Button } from "antd";
import "./WardBedDrawer.scss";

const WardBedDrawer = ({
  open,
  onClose,
  wards = [],
  selectedWardId,
  selectedRoomId,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedWardId, setTempSelectedWardId] = useState(selectedWardId);
  const [tempSelectedRoomId, setTempSelectedRoomId] = useState(selectedRoomId);

  // Filter wards based on search
  const filteredWards = useMemo(() => {
    if (!searchQuery) return wards;
    return wards.filter((ward) =>
      ward.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [wards, searchQuery]);

  // Get selected ward
  const selectedWard = useMemo(() => {
    return wards.find((w) => w._id === tempSelectedWardId);
  }, [wards, tempSelectedWardId]);

  // Get rooms for selected ward
  const rooms = useMemo(() => {
    if (!selectedWard) return [];
    return selectedWard.rooms || [];
  }, [selectedWard]);

  // Calculate available and occupied beds
  const bedStats = useMemo(() => {
    const available = rooms.filter((room) => room.available !== false).length;
    const occupied = rooms.filter((room) => room.available === false).length;
    return { available, occupied };
  }, [rooms]);

  const handleWardSelect = (wardId) => {
    setTempSelectedWardId(wardId);
    setTempSelectedRoomId(null); // Reset bed selection when ward changes
  };

  const handleBedSelect = (roomId) => {
    setTempSelectedRoomId(roomId);
  };

  const handleConfirm = () => {
    if (tempSelectedWardId && tempSelectedRoomId) {
      onConfirm(tempSelectedWardId, tempSelectedRoomId);
      onClose();
    }
  };

  const isConfirmDisabled = !tempSelectedWardId || !tempSelectedRoomId;

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      width={700}
      className="ward-bed-drawer"
      closeIcon={false}
    >
      <div className="ward-bed-drawer-content">
        <div className="drawer-header">
          <div className="header-left">
          <i className="icon-right" onClick={onClose} />
            <span className="header-title">Select Ward & Bed</span>
          </div>
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="confirm-button"
          >
            Confirm
          </Button>
        </div>

        <div className="drawer-body">
          {!tempSelectedWardId ? (
            // Ward Selection View
            <div className="ward-selection-view">
              <div className="section-label">Select Ward</div>
              <Input
                placeholder="Search by Ward Name"
                prefix={<i className="icon-search" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ward-search-input"
              />
              <div className="ward-list">
                {filteredWards.length === 0 ? (
                  <div className="empty-state">No wards found</div>
                ) : (
                  filteredWards.map((ward) => {
                    const availableBeds = (ward.rooms || []).filter(
                      (r) => r.available !== false
                    ).length;
                    const isAvailable = availableBeds > 0;
                    const isSelected = tempSelectedWardId === ward._id;
                    const itemClasses = [
                      "ward-item",
                      isSelected ? "selected" : "",
                      !isAvailable ? "disabled" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        key={ward._id}
                        className={itemClasses}
                        aria-disabled={!isAvailable}
                        tabIndex={isAvailable ? 0 : -1}
                        onClick={() => {
                          if (!isAvailable) return;
                          handleWardSelect(ward._id);
                        }}
                        onKeyDown={(e) => {
                          if (!isAvailable) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleWardSelect(ward._id);
                          }
                        }}
                      >
                        <div className="ward-name">{ward.name}</div>
                        <div className="ward-beds-info">
                          <span className={isAvailable ? "available" : "unavailable"}>
                            {`(${availableBeds} beds Available)`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            // Bed Selection View
            <div className="bed-selection-view">
              <div className="section-label">Select Ward</div>
              <div
                className="selected-ward-display"
                onClick={() => {
                  setTempSelectedWardId(null);
                  setTempSelectedRoomId(null);
                }}
              >
                {selectedWard?.name}
                <i className="icon-right" />
              </div>

              <div className="bed-stats-container">
                <div className="section-label bed-section-label">
                  Select a Bed in {selectedWard?.name}
                </div>

                <div className="bed-stats">
                  <span className="stat-item available-stat">
                    Available ({bedStats.available})
                  </span>
                  <span className="stat-item occupied-stat">
                    Occupied ({bedStats.occupied})
                  </span>
                </div>
              </div>

              <div className="bed-grid">
                {rooms.map((room) => {
                  const isAvailable = room.available !== false;
                  const isSelected = tempSelectedRoomId === room._id;

                  return (
                    <div
                      key={room._id}
                      className={`bed-item ${!isAvailable ? "occupied" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => isAvailable && handleBedSelect(room._id)}
                    >
                      <Radio
                        checked={isSelected}
                        disabled={!isAvailable}
                        onChange={() => isAvailable && handleBedSelect(room._id)}
                      />
                      <span className="bed-name">
                        {room.name}
                        {!isAvailable && <span className="occupied-label"> (Occupied)</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default WardBedDrawer;

