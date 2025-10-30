import React from "react";
import "./CustomTable.scss";

const CustomTable = ({ columns = [], data = [] }) => {
  if (!columns.length || !data.length) return null;

  return (
    <div className="cnp-custom-table-container">
      <div className="cnp-custom-table-wrapper">
        {/* Header Row */}
        <div className="cnp-custom-table-header-row">
          {columns.map((column, index) => (
            <div
              key={`header-${index}`}
              className="cnp-custom-table-header-cell"
              style={{
                minWidth: column.minWidth || "auto",
                flex: column.flex || "1 1 0%",
              }}
            >
              <div className="cnp-custom-table-header-content">
                {column.title}
              </div>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.map((item, rowIndex) => (
          <div key={item.key || rowIndex} className="cnp-custom-table-data-row">
            {columns.map((column, colIndex) => {
              const value = item[column.dataIndex] || "";
              const subtext = column.subtextKey
                ? item[column.subtextKey] || ""
                : null;

              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`cnp-custom-table-data-cell ${
                    column.hasSubtext
                      ? "cnp-custom-table-data-cell--with-subtext"
                      : ""
                  }`}
                  style={{
                    minWidth: column.minWidth || "auto",
                    flex: column.flex || "1 1 0%",
                  }}
                >
                  {column.hasSubtext && subtext ? (
                    <div className="cnp-custom-table-cell-with-subtext">
                      <div className="cnp-custom-table-main-text">
                        {value || "-"}
                      </div>
                      <div className="cnp-custom-table-subtext">{subtext}</div>
                    </div>
                  ) : (
                    <div className="cnp-custom-table-cell-content">
                      {value || "-"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTable;
