import React, { useMemo } from "react";
import { Table, Button, Dropdown } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import { useInfiniteScroll } from "../../inPatients/hooks/useInfiniteScroll";
import "./WardsTable.scss";

const WardsTable = ({
  data,
  loading,
  onAddBeds,
  onMoreActions,
  pagination,
  onLoadMore,
  isReadOnly = false,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        width: 50,
        className: "col-sno",
        render: (text) => <span className="ward-table-cell">{text}</span>,
      },
      {
        title: "WARD NAME",
        dataIndex: "wardName",
        key: "wardName",
        className: "col-ward-name",
        render: (text) => (
          <span className="ward-table-cell ward-name-cell">{text || "-"}</span>
        ),
      },
      {
        title: "TOTAL BEDS",
        dataIndex: "totalBeds",
        key: "totalBeds",
        width: 200,
        className: "col-total-beds",
        sorter: (a, b) => (a.totalBeds || 0) - (b.totalBeds || 0),
        render: (text) => (
          <span className="ward-table-cell">
            {text !== undefined ? text : "-"}
          </span>
        ),
      },
      {
        title: "AVAILABLE BEDS",
        dataIndex: "availableBeds",
        key: "availableBeds",
        width: 200,
        className: "col-available-beds",
        sorter: (a, b) => (a.availableBeds || 0) - (b.availableBeds || 0),
        render: (text) => (
          <span className="ward-table-cell">
            {text !== undefined ? text : "-"}
          </span>
        ),
      },
      {
        title: "OCCUPIED BEDS",
        dataIndex: "occupiedBeds",
        key: "occupiedBeds",
        width: 200,
        className: "col-occupied-beds",
        sorter: (a, b) => (a.occupiedBeds || 0) - (b.occupiedBeds || 0),
        render: (text) => (
          <span className="ward-table-cell">
            {text !== undefined ? text : "-"}
          </span>
        ),
      },
      {
        title: "BLOCKED BEDS",
        dataIndex: "blockedBeds",
        key: "blockedBeds",
        width: 200,
        className: "col-blocked-beds",
        sorter: (a, b) => (a.blockedBeds || 0) - (b.blockedBeds || 0),
        render: (text) => (
          <span className="ward-table-cell">
            {text !== undefined ? text : "-"}
          </span>
        ),
      },
      {
        title: "ACTION",
        key: "action",
        width: 242,
        className: "col-action",
        render: (_, record) => {
          // In read-only mode, only show "View Beds" if beds exist, otherwise empty
          if (isReadOnly) {
            const hasBeds =
              (record.totalBeds && record.totalBeds > 0) ||
              (record.rooms &&
                Array.isArray(record.rooms) &&
                record.rooms.length > 0);

            if (!hasBeds) {
              return null; // Empty action column
            }

            return (
              <div className="ward-table-actions">
                <Button
                  type="default"
                  onClick={() => onAddBeds?.(record)}
                  className="add-beds-button"
                >
                  View Beds
                </Button>
              </div>
            );
          }

          // Check if ward has beds
          const hasBeds =
            (record.totalBeds && record.totalBeds > 0) ||
            (record.rooms &&
              Array.isArray(record.rooms) &&
              record.rooms.length > 0);
          const buttonText = hasBeds ? "View/Edit Beds" : "Add Beds";

          return (
            <div className="ward-table-actions">
              <Button
                type="default"
                icon={
                  !hasBeds ? (
                    <img src={defaultIcons.plusIconColoured} alt="+" />
                  ) : null
                }
                onClick={() => onAddBeds?.(record)}
                className="add-beds-button"
              >
                {buttonText}
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Edit Ward Name",
                      onClick: () => onMoreActions?.(record, "edit"),
                    },
                    {
                      key: "delete",
                      label: "Delete Ward",
                      onClick: () => onMoreActions?.(record, "delete"),
                    },
                    {
                      key: "add-edit-beds",
                      label: "Add/Edit Beds",
                      onClick: () => onMoreActions?.(record, "add-edit-beds"),
                    },
                  ],
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="more-actions-button">
                  <img src={defaultIcons.moreIcon} alt="More" />
                </button>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [onAddBeds, onMoreActions, isReadOnly]
  );

  const tableData = useMemo(() => {
    return (
      data?.map((ward, index) => ({
        ...ward,
        key: ward.id || index,
        index: index + 1,
      })) || []
    );
  }, [data]);

  // Infinite scroll setup
  const hasMore = pagination?.totalPages > pagination?.page;
  const { lastElementRef } = useInfiniteScroll({
    hasMore: hasMore && !loading,
    isLoading: loading,
    onLoadMore: onLoadMore || (() => {}),
  });

  return (
    <div className="wards-table-container">
      <Table
        columns={columns.map((col, index) => {
          // Add ref to last row for infinite scroll
          if (index === columns.length - 1) {
            return {
              ...col,
              onCell: (record, rowIndex) => {
                const isLastRow = rowIndex === tableData.length - 1;
                return {
                  ref: isLastRow ? lastElementRef : null,
                  ...col.onCell?.(record, rowIndex),
                };
              },
            };
          }
          return col;
        })}
        dataSource={tableData}
        loading={loading}
        pagination={false}
        className="wards-table"
        rowClassName="ward-table-row"
      />
    </div>
  );
};

export default React.memo(WardsTable);
