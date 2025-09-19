import React from "react";
import "./ReusableTable.scss";

const ReusableTable = ({
  columns = [],
  data = [],
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  containerClassName = "",
  showBorder = true,
  borderRadius = "10px",
  headerBackground = "#f8f4fc",
  customStyles = {},
}) => {
  if (!columns.length) return null;

  const containerStyle = {
    borderRadius: borderRadius,
    border: showBorder ? "1px solid #f1f1f5" : "none",
    backgroundColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
    ...customStyles.container,
  };

  const headerStyle = {
    backgroundColor: headerBackground,
    ...customStyles.header,
  };

  const getCellStyle = (column, isHeader = false) => ({
    minWidth: column.minWidth || (isHeader ? "120px" : "80px"),
    width: column.width || "auto",
    flex: column.flex !== undefined ? column.flex : "1 1 0%",
    maxWidth: "100%", // Ensure cells don't exceed container width
    ...customStyles.cell,
  });

  const renderCellContent = (column, item, isHeader = false) => {
    if (isHeader) {
      return (
        <div className="reusable-table__header-content">{column.title}</div>
      );
    }

    // Handle custom render function
    if (column.render && typeof column.render === "function") {
      return column.render(item[column.dataIndex], item);
    }

    // Handle nested data access
    const value = column.dataIndex
      ? column.dataIndex.split(".").reduce((obj, key) => obj?.[key], item)
      : "";

    // Handle multi-line content (like medicine with subtitle)
    if (column.showSubtext && item[column.subtextKey]) {
      return (
        <div className="reusable-table__cell-content--with-subtext">
          <div className="reusable-table__main-text">{value || "-"}</div>
          <div className="reusable-table__subtext">
            {item[column.subtextKey]}
          </div>
        </div>
      );
    }

    return <div className="reusable-table__cell-content">{value || "-"}</div>;
  };

  return (
    <div
      className={`reusable-table ${containerClassName}`}
      style={containerStyle}
    >
      <div className="reusable-table__container">
        {/* Header Row */}
        <div
          className={`reusable-table__header-row ${headerClassName}`}
          style={headerStyle}
        >
          {columns.map((column, index) => (
            <div
              key={`header-${index}`}
              className={`reusable-table__header-cell ${cellClassName}`}
              style={getCellStyle(column, true)}
            >
              {renderCellContent(column, {}, true)}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.map((item, rowIndex) => (
          <div
            key={item.key || rowIndex}
            className={`reusable-table__row ${rowClassName}`}
          >
            {columns.map((column, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`reusable-table__cell ${cellClassName}`}
                style={getCellStyle(column)}
              >
                {renderCellContent(column, item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReusableTable;
