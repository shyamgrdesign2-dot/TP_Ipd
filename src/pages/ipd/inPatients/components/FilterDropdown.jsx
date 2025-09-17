import React, { useState, useRef, useEffect } from "react";
import { Drawer } from "antd";
import "./FilterDropdown.scss";
import { isMobile } from "react-device-detect";

const FilterDropdown = ({
  title,
  placeholder,
  items,
  onFilterChange,
  searchPlaceholder = "Search",
  selectedItems: propSelectedItems = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(propSelectedItems);
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

  const showSearchBar = items.length > 6;

  // Sync internal state with prop when it changes (e.g., on page refresh)
  useEffect(() => {
    setSelectedItems(propSelectedItems);
  }, [propSelectedItems]);

  // Helper function to get the display name for an item (handles both name and title properties)
  const getItemDisplayName = (item) => {
    return item.name || item.title || "";
  };

  const filteredItems = items.filter((item) =>
    getItemDisplayName(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    if (isMobile && showSearchBar) {
      setDrawerVisible(!drawerVisible);
    } else {
      setIsOpen(!isOpen);
    }
    setTempSelectedItems([...selectedItems]);
  };

  const handleItemSelect = (itemId) => {
    if (tempSelectedItems.includes(itemId)) {
      setTempSelectedItems(tempSelectedItems.filter((id) => id !== itemId));
    } else {
      setTempSelectedItems([...tempSelectedItems, itemId]);
    }
  };

  const handleApplyFilter = () => {
    if (isMobile && showSearchBar) {
      setDrawerVisible(false);
    } else {
      setIsOpen(false);
    }
    setSelectedItems(tempSelectedItems);
    onFilterChange(tempSelectedItems);
  };

  const handleClearFilter = () => {
    if (isMobile && showSearchBar) {
      setDrawerVisible(false);
    } else {
      setIsOpen(false);
    }
    setTempSelectedItems([]);
    setSelectedItems([]);
    onFilterChange([]);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setTempSelectedItems([...selectedItems]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the name of the selected item if only one is selected
  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    } else if (selectedItems.length === 1) {
      const selectedItem = items.find((item) => item.id === selectedItems[0]);
      return selectedItem ? getItemDisplayName(selectedItem) : placeholder;
    } else {
      // For multiple selections, show the category name (without "All")
      // For example: "All Doctor" becomes "Doctors", "All Ward" becomes "Wards"
      if (placeholder.startsWith("All")) {
        const category = placeholder.split(" ")[1];
        return category + "s"; // Add plural 's' to make "Doctor" -> "Doctors"
      }
      return placeholder;
    }
  };

  // Render the filter items list (used in both dropdown and drawer)
  const renderFilterItems = (useTemp = false) => {
    const currentSelections = tempSelectedItems;

    return (
      <div className="items-list">
        {filteredItems.map((item, i) => {
          const isSelected = currentSelections.includes(item.id);
          return (
            <div
              key={`${item.id}-${i}`}
              className={`item ${isSelected ? "selected" : ""}`}
            >
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleItemSelect(item.id)}
                />
                <span className="checkmark"></span>
                <span className="item-name">{getItemDisplayName(item)}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  // Render search bar (used in both dropdown and drawer)
  const renderSearchBar = () => {
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    );
  };

  const ApplyFilter = () => {
    return (
      <button
        className="apply-filter"
        onClick={handleApplyFilter}
        disabled={tempSelectedItems.length === 0}
      >
        Apply Filter{" "}
        {tempSelectedItems.length > 0 && `(${tempSelectedItems.length})`}
      </button>
    );
  };

  const ClearFilter = () => {
    return (
      <button
        className="clear-filter"
        onClick={handleClearFilter}
        disabled={tempSelectedItems.length === 0}
      >
        Clear Filter
      </button>
    );
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <div className="filter-select" onClick={toggleDropdown}>
        <span className="select-placeholder">
          {getDisplayText()}
          {selectedItems.length > 1 && (
            <span className="count-badge">{selectedItems.length}</span>
          )}
        </span>
        <i
          className={`icon-right ${isOpen ? "open" : ""}`}
          style={{
            display: "block",
            transform: `rotate(270deg)`,
          }}
        />
      </div>

      {/* Regular dropdown for desktop or mobile without search */}
      {isOpen && !isMobile && (
        <div className="dropdown-content">
          <div className="filter-header">{title}</div>

          {showSearchBar && renderSearchBar()}

          {renderFilterItems()}

          <div className="filter-actions">
            <ApplyFilter />
            <ClearFilter />
          </div>
        </div>
      )}

      {/* Ant Design Drawer for mobile/tablet with search */}
      <Drawer
        title={
          <div className="d-flex align-items-center justify-content-between filter-drawer-header">
            <span className="filter-drawer-title">{title}</span>
            <div className="d-flex align-items-center gap-18">
              <ClearFilter />
              <ApplyFilter />
            </div>
          </div>
        }
        placement="right"
        onClose={handleDrawerClose}
        open={drawerVisible}
        width={585}
        className="filter-drawer"
      >
        {showSearchBar && renderSearchBar()}
        {renderFilterItems(true)}
      </Drawer>
    </div>
  );
};

export default FilterDropdown;
