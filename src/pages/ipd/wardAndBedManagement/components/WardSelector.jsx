import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Select } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import AddWardModal from "./AddWardModal";

const WardSelector = ({
  value,
  onChange,
  wards = [],
  onAddNewWard,
  placeholder = "Search by Ward Name",
  isReadOnly = false,
}) => {
  const [wardSearchQuery, setWardSearchQuery] = useState("");
  const [isAddWardModalOpen, setIsAddWardModalOpen] = useState(false);
  const [newWardName, setNewWardName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingWardName, setPendingWardName] = useState(null);

  // Filter wards based on search query
  const filteredWards = useMemo(() => {
    if (!wardSearchQuery) {
      return wards;
    }
    return wards.filter((ward) =>
      ward.wardName?.toLowerCase().includes(wardSearchQuery.toLowerCase())
    );
  }, [wards, wardSearchQuery]);

  // Get text for "Add New Ward" button
  const newWardText = useMemo(() => {
    if (
      wardSearchQuery &&
      wardSearchQuery.trim() &&
      !filteredWards.some(
        (ward) => ward.wardName?.toLowerCase() === wardSearchQuery.toLowerCase()
      )
    ) {
      return wardSearchQuery;
    }
    return "";
  }, [wardSearchQuery, filteredWards]);

  // Keep dropdown open when showing "Add New Ward" option
  useEffect(() => {
    if (newWardText && filteredWards.length === 0) {
      setIsDropdownOpen(true);
    }
  }, [newWardText, filteredWards.length]);

  // Auto-select newly created ward when it appears in the wards list
  useEffect(() => {
    if (pendingWardName && wards.length > 0) {
      const newWard = wards.find(
        (w) => w.wardName?.toLowerCase() === pendingWardName.toLowerCase()
      );
      if (newWard) {
        onChange(newWard.id);
        setWardSearchQuery("");
        setPendingWardName(null);
      }
    }
  }, [pendingWardName, wards, onChange]);

  const handleWardSearch = useCallback((value) => {
    setWardSearchQuery(value);
    setIsDropdownOpen(true);
  }, []);

  const handleWardSelect = useCallback(
    (value) => {
      onChange(value);
      setWardSearchQuery("");
      setIsDropdownOpen(false);
    },
    [onChange]
  );

  const handleAddNewWardClick = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setNewWardName(newWardText || wardSearchQuery);
      setIsAddWardModalOpen(true);
    },
    [newWardText, wardSearchQuery]
  );

  const handleCloseAddWardModal = useCallback(() => {
    setIsAddWardModalOpen(false);
  }, []);

  const handleSaveNewWard = useCallback(
    async (wardName) => {
      if (onAddNewWard) {
        await onAddNewWard(wardName);
        setPendingWardName(wardName);
      }
      setIsAddWardModalOpen(false);
      setNewWardName("");
      setWardSearchQuery("");
    },
    [onAddNewWard]
  );

  return (
    <>
      <div className="add-beds-form-field">
        <label className="add-beds-form-label">
          Ward Name<span className="required-asterisk">*</span>
        </label>
        <Select
          value={value}
          onChange={handleWardSelect}
          onSearch={handleWardSearch}
          onDropdownVisibleChange={(open) => {
            if (!open && newWardText && filteredWards.length === 0) {
              setIsDropdownOpen(true);
              return;
            }
            setIsDropdownOpen(open);
          }}
          open={isDropdownOpen}
          placeholder={placeholder}
          className="add-beds-ward-select"
          showSearch
          filterOption={false}
          notFoundContent={null}
          dropdownRender={(menu) => (
            <div style={{ padding: "12px 0" }}>
              {filteredWards.length > 0 && (
                <div
                  style={{
                    padding: "0 12px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {menu}
                </div>
              )}

              {!isReadOnly && (
                <div
                  className="add-new-ward-option"
                  onClick={handleAddNewWardClick}
                >
                  <img src={defaultIcons.plusIconColoured} alt="Add" />
                  {newWardText ? (
                    <span>
                      Add <strong>"{newWardText}"</strong> as New Ward
                    </span>
                  ) : (
                    filteredWards.length > 0 && <span>Add New Ward</span>
                  )}
                </div>
              )}
            </div>
          )}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          popupClassName="add-beds-ward-select-dropdown"
        >
          {filteredWards?.map((ward) => (
            <Select.Option key={ward.id} value={ward.id}>
              {ward.wardName}
            </Select.Option>
          ))}
          {newWardText && filteredWards.length === 0 && (
            <Select.Option
              value="__dummy__"
              disabled
              style={{ display: "none" }}
            >
              Dummy
            </Select.Option>
          )}
        </Select>
      </div>
      <AddWardModal
        open={isAddWardModalOpen}
        onCancel={handleCloseAddWardModal}
        onSave={handleSaveNewWard}
        initialValue={newWardName}
      />
    </>
  );
};

export default React.memo(WardSelector);
