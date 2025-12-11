import React, { useMemo, useState, useCallback } from "react";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import emptyFileIcon from "../../../../assets/images/empty-file.svg";
import DeleteBedModal from "./DeleteBedModal";
import BedEditCell from "./BedEditCell";
import BedActionsDropdown from "./BedActionsDropdown";
import {
  updateRoom,
  deleteRoom,
  blockRoom,
  unblockRoom,
} from "../../../../redux/ipd/wardAndBedManagementSlice";
import { useInfiniteScroll } from "../../inPatients/hooks/useInfiniteScroll";
import { BED_STATUS, STATUS_CONFIG, STATUS_FILTERS } from "../constants";
import { defaultIcons as dIcons } from "../../../../assets/images/dischargeSummaryIcons";
import closeIcon from "../../../../assets/images/icons/close-red.svg";
import "./BedsListTable.scss";

const BedsListTable = ({
  beds,
  wardName,
  loading,
  wardId,
  onBedUpdated,
  currentSearchQuery = "",
  pagination,
  onLoadMore,
  onStatusFilterChange,
  isReadOnly = false,
}) => {
  const dispatch = useDispatch();
  const [selectedBed, setSelectedBed] = useState(null);
  const [editingBedId, setEditingBedId] = useState(null);
  const [editingBedName, setEditingBedName] = useState("");
  const [modalState, setModalState] = useState({
    isDeleteOpen: false,
    isBlockOpen: false,
    isUnblockOpen: false,
  });

  const handleEditBed = useCallback((bed) => {
    const bedId = bed.id || bed._id;
    setEditingBedId(bedId);
    setEditingBedName(bed.name || bed.bedName || "");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingBedId(null);
    setEditingBedName("");
  }, []);

  const handleSaveEditBed = useCallback(
    async (record) => {
      const bedId = record.roomId;
      if (!wardId || !bedId || !editingBedName.trim()) {
        message.warning("Bed name cannot be empty");
        return;
      }

      try {
        await dispatch(
          updateRoom({
            wardId,
            roomData: {
              ...record,
              _id: bedId,
              name: editingBedName.trim(),
            },
          })
        ).unwrap();

        message.success("Bed name updated successfully");
        setEditingBedId(null);
        setEditingBedName("");
        onBedUpdated?.();
      } catch (error) {
        console.error("Error updating bed:", error);
        message.error("Failed to update bed name");
      }
    },
    [wardId, editingBedName, dispatch, onBedUpdated]
  );

  // Shared handler for bed actions (block, unblock, delete)
  const handleBedAction = useCallback(
    async (action, successMessage) => {
      if (!wardId || !selectedBed || (!selectedBed.id && !selectedBed._id)) {
        message.warning("Ward ID or Bed ID is missing");
        return;
      }

      try {
        const roomId = selectedBed.roomId;
        await dispatch(action({ wardId, roomId })).unwrap();

        message.success(successMessage);
        setSelectedBed(null);
        onBedUpdated?.();
        return true;
      } catch (error) {
        console.error("Error performing bed action:", error);
        message.error("Operation failed");
        return false;
      }
    },
    [wardId, selectedBed, dispatch, onBedUpdated]
  );

  const handleBlockBed = useCallback((bed) => {
    setSelectedBed(bed);
    setModalState((prev) => ({ ...prev, isBlockOpen: true }));
  }, []);

  const handleConfirmBlockBed = useCallback(async () => {
    const success = await handleBedAction(
      blockRoom,
      "Bed blocked successfully"
    );
    if (success) {
      setModalState((prev) => ({ ...prev, isBlockOpen: false }));
    }
  }, [handleBedAction]);

  const handleCloseBlockModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isBlockOpen: false }));
    setSelectedBed(null);
  }, []);

  const handleUnblockBed = useCallback((bed) => {
    setSelectedBed(bed);
    setModalState((prev) => ({ ...prev, isUnblockOpen: true }));
  }, []);

  const handleConfirmUnblockBed = useCallback(async () => {
    const success = await handleBedAction(
      unblockRoom,
      "Bed unblocked successfully"
    );
    if (success) {
      setModalState((prev) => ({ ...prev, isUnblockOpen: false }));
    }
  }, [handleBedAction]);

  const handleCloseUnblockModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isUnblockOpen: false }));
    setSelectedBed(null);
  }, []);

  const handleDeleteBed = useCallback((bed) => {
    setSelectedBed(bed);
    setModalState((prev) => ({ ...prev, isDeleteOpen: true }));
  }, []);

  const handleConfirmDeleteBed = useCallback(async () => {
    const success = await handleBedAction(
      deleteRoom,
      "Bed deleted successfully"
    );
    if (success) {
      setModalState((prev) => ({ ...prev, isDeleteOpen: false }));
    }
  }, [handleBedAction]);

  const handleCloseDeleteModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isDeleteOpen: false }));
    setSelectedBed(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        width: 50,
        className: "col-sno",
        render: (text) => <span className="bed-table-cell">{text}</span>,
      },
      {
        title: "BED NAME",
        dataIndex: "bedName",
        key: "bedName",
        className: "col-bed-name",
        render: (text, record) => {
          const bedId = record.id || record._id;
          const isEditing = editingBedId === bedId;

          if (isEditing) {
            return (
              <BedEditCell
                editingBedName={editingBedName}
                setEditingBedName={setEditingBedName}
              />
            );
          }

          return <span className="bed-table-cell">{text || "-"}</span>;
        },
        onCell: (record) => {
          const bedId = record.id || record._id;
          const isEditing = editingBedId === bedId;
          return {
            colSpan: isEditing ? 2 : 1, // Span BED NAME and STATUS columns when editing
          };
        },
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        className: "col-status",
        render: (status, record) => {
          const bedId = record.id || record._id;
          const isEditing = editingBedId === bedId;

          if (isEditing) {
            return {
              props: {
                colSpan: 0, // Hide status column when editing (colSpan 0 hides the cell)
              },
            };
          }

          const config =
            STATUS_CONFIG[status] || STATUS_CONFIG[BED_STATUS.AVAILABLE];

          return (
            <span className={`bed-status-badge bed-status-badge-${status}`}>
              {config.label}
            </span>
          );
        },
        filters: STATUS_FILTERS,
      },
      ...(!isReadOnly
        ? [
            {
              title: "ACTION",
              key: "action",
              width: 80,
              className: "col-action",
              render: (_, record) => {
                const bedId = record.id || record._id;
                const isEditing = editingBedId === bedId;

                if (isEditing) {
                  return (
                    <div className="bed-edit-actions">
                      <button
                        className="bed-edit-save-btn"
                        onClick={() => handleSaveEditBed(record)}
                        title="Save"
                      >
                        <img
                          src={dIcons.greenTick}
                          alt="Save"
                          className="bed-edit-save-icon"
                        />
                      </button>
                      <button
                        className="bed-edit-cancel-btn"
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        <img
                          src={closeIcon}
                          alt="Cancel"
                          className="bed-edit-cancel-icon"
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <BedActionsDropdown
                    record={record}
                    onEdit={handleEditBed}
                    onBlock={handleBlockBed}
                    onUnblock={handleUnblockBed}
                    onDelete={handleDeleteBed}
                  />
                );
              },
            },
          ]
        : []),
    ],
    [
      handleEditBed,
      handleBlockBed,
      handleUnblockBed,
      handleDeleteBed,
      editingBedId,
      editingBedName,
      handleSaveEditBed,
      handleCancelEdit,
      isReadOnly,
    ]
  );

  const tableData = useMemo(() => {
    return (
      beds?.map((bed, index) => ({
        ...bed,
        key: bed.id || bed._id || index,
        index: index + 1,
        bedName: bed.name || bed.bedName,
        status: bed.status || "",
      })) || []
    );
  }, [beds]);

  // Infinite scroll setup
  const hasMore = pagination?.totalPages > pagination?.page;
  const { lastElementRef } = useInfiniteScroll({
    hasMore: hasMore && !loading,
    isLoading: loading,
    onLoadMore: onLoadMore || (() => {}),
  });

  return (
    <div className="beds-list-table-container">
      <h3 className="beds-list-title">Beds in {wardName || "Selected Ward"}</h3>
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
        className="beds-list-table"
        rowClassName="bed-table-row"
        onChange={(pagination, filters, sorter) => {
          // Handle status filter change - trigger API call
          if (filters && filters.status) {
            const filterValue = filters.status[0] || null;
            onStatusFilterChange?.(filterValue);
          } else if (filters && !filters.status) {
            // Filter was cleared
            onStatusFilterChange?.(null);
          }
        }}
        locale={{
          emptyText: (
            <div className="beds-empty-state">
              <img src={emptyFileIcon} alt="No beds" className="empty-icon" />
              <p className="empty-message">You haven't added any beds yet!</p>
            </div>
          ),
        }}
      />
      <DeleteBedModal
        open={modalState.isDeleteOpen}
        onCancel={handleCloseDeleteModal}
        onDelete={handleConfirmDeleteBed}
        bed={selectedBed}
        type="delete"
      />
      <DeleteBedModal
        open={modalState.isBlockOpen}
        onCancel={handleCloseBlockModal}
        onDelete={handleConfirmBlockBed}
        bed={selectedBed}
        type="block"
      />
      <DeleteBedModal
        open={modalState.isUnblockOpen}
        onCancel={handleCloseUnblockModal}
        onDelete={handleConfirmUnblockBed}
        bed={selectedBed}
        type="unblock"
      />
    </div>
  );
};

export default React.memo(BedsListTable);
