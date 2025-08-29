import React, { useState, useRef, useEffect } from "react";
import "./FilterDropdown.scss";

const FilterDropdown = ({
  title,
  placeholder,
  items,
  onFilterChange,
  searchPlaceholder = "Search",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

  const showSearchBar = items.length > 6;

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleApplyFilter = () => {
    onFilterChange(selectedItems);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setSelectedItems([]);
    onFilterChange([]);
    setIsOpen(false);
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
      return selectedItem ? selectedItem.name : placeholder;
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

      {isOpen && (
        <div className="dropdown-content">
          <div className="filter-header">{title}</div>

          {showSearchBar && (
            <div className="search-container">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="items-list">
            {filteredItems.map((item) => (
              <div key={item.id} className="item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                  />
                  <span className="checkmark"></span>
                  <span className="item-name">{item.name}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="filter-actions">
            <button className="apply-filter" onClick={handleApplyFilter}>
              Apply Filter{" "}
              {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
            <button className="clear-filter" onClick={handleClearFilter}>
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
