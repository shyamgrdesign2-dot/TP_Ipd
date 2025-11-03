import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AutoComplete, Table, Input, Typography, Empty, Select, DatePicker } from "antd";
import { MenuOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./styles.scss";
import dayjs from "dayjs";
import SinceDuration from "./SinceDuration";

const RowDndContext = React.createContext(null);

// Table Shimmer Component
const TableShimmerLoader = ({ columns = [] }) => {
  const shimmerRows = Array.from({ length: 3 }, (_, index) => index);
  
  return (
    <div className="sc-shimmer-container-table">
      {shimmerRows.map((_, rowIndex) => (
        <div key={rowIndex} className="shimmer-row" style={{
          display: 'grid',
          gridTemplateColumns: `56px ${columns.map(() => '1fr').join(' ')} 56px`,
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Drag handle column */}
          <div className="shimmer-cell" style={{ width: '24px', height: '20px' }} />
          
          {/* Data columns */}
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="shimmer-cell" />
          ))}
          
          {/* Delete button column */}
          <div className="shimmer-cell" style={{ width: '24px', height: '20px' }} />
        </div>
      ))}
    </div>
  );
};

function DraggableRow(props) {
  const { "data-row-key": rowKey, style, ...rest } = props;
  const sortable = useSortable({ id: rowKey });
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = sortable;

  const mergedStyle = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 1,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }
      : {}),
  };

  return (
    <RowDndContext.Provider
      value={{ setActivatorNodeRef, attributes, listeners }}
    >
      <tr ref={setNodeRef} style={mergedStyle} {...rest} />
    </RowDndContext.Provider>
  );
}

function DragHandle() {
  const ctx = useContext(RowDndContext);
  return (
    <span
      className="drag-handle"
      ref={ctx?.setActivatorNodeRef}
      {...(ctx?.attributes || {})}
      {...(ctx?.listeners || {})}
      aria-label="Drag"
      title="Drag to reorder"
    >
      <MenuOutlined />
    </span>
  );
}

export const DynamicPickerTable = forwardRef((props, ref) => {
  const {
    isEditable = true,
    rootClassName = "",
    columns = [],
    initialData = [],
    searchConfig = {},
    onSearch,
    onRowChange,
    onRowDelete,
    onRowAdd,
    emptyText = "No data added",
    searchPlaceholder = "Search...",
    loading = false,
    hideTableWhenEmpty = false,
  } = props || {};

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState(initialData);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // Update rows when initialData changes
  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  useImperativeHandle(ref, () => ({
    saveRows: () => {
      return rows;
    },
    getRows: () => {
      return rows;
    },
    setRows: (newRows) => {
      setRows(newRows);
    },
    addRow: (newRow) => {
      const rowWithKey = {
        ...newRow,
        key: newRow.key || `row_${Date.now()}_${Math.random()}`,
      };
      setRows((prev) => [...prev, rowWithKey]);
      return rowWithKey;
    },
    updateRow: (key, updates) => {
      setRows((prev) =>
        prev.map((r) => (r.key === key ? { ...r, ...updates } : r))
      );
    },
    deleteRow: (key) => {
      setRows((prev) => prev.filter((r) => r.key !== key));
    },
    clearRows: () => {
      setRows([]);
    },
  }));

  const searchDebounced = useCallback(
    async (val) => {
      if (!onSearch || !val.trim()) {
        setOptions([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await onSearch(val);
        
        const formattedOptions = results.map((item) => ({
          value: searchConfig.valueField ? item[searchConfig.valueField] : item.value || item.title || item.name,
          label: searchConfig.renderOption ? (
            searchConfig.renderOption(item)
          ) : (
            <div className="option-row">
              <span className="option-title">
                {searchConfig.titleField ? item[searchConfig.titleField] : item.title || item.name}
              </span>
              {searchConfig.subtitleField && (
                <span className="option-subtitle">
                  {item[searchConfig.subtitleField]}
                </span>
              )}
            </div>
          ),
          item,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [onSearch, searchConfig]
  );

  const handleSearch = (val) => {
    setQuery(val);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer for debounced search
    const timer = setTimeout(() => {
      searchDebounced(val);
    }, 300);
    
    setDebounceTimer(timer);
  };

  const handleSelect = (_label, option) => {
    const item = option.item;
    if (!item) return;

    const newRow = {
      key: `row_${Date.now()}_${Math.random()}`,
      ...item,
    };

    // Check for duplicates if specified
    if (searchConfig.preventDuplicates) {
      const duplicateField = searchConfig.duplicateCheckField || 'id';
      if (rows.some((r) => r[duplicateField] === item[duplicateField])) {
        return;
      }
    }

    setRows((prev) => [...prev, newRow]);

    if (onRowAdd) {
      onRowAdd(newRow);
    }

    setQuery("");
    setOptions([]);
  };

  const handleRowUpdate = useCallback((key, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );

    if (onRowChange) {
      const updatedRow = rows.find(r => r.key === key);
      if (updatedRow) {
        onRowChange({ ...updatedRow, [field]: value }, field, value);
      }
    }
  }, [rows, onRowChange]);

  const handleRowDelete = useCallback((key) => {
    const rowToDelete = rows.find(r => r.key === key);
    setRows((prev) => prev.filter((r) => r.key !== key));

    if (onRowDelete && rowToDelete) {
      onRowDelete(rowToDelete);
    }
  }, [rows, onRowDelete]);

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setRows((prev) => {
      const oldIndex = prev.findIndex((r) => r.key === active.id);
      const newIndex = prev.findIndex((r) => r.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const renderCell = useCallback((column, text, record) => {
    if (column.render) {
      return column.render(text, record, handleRowUpdate);
    }

    switch (column.type) {
      case 'input':
        return (
          <Input
            placeholder={column.placeholder || column.title}
            value={text || ""}
            onChange={(e) => handleRowUpdate(record.key, column.dataIndex, e.target.value)}
            {...(column.inputProps || {})}
          />
        );
      
      case 'select':
        return (
          <SinceDuration 
            value={text}
            onChange={handleRowUpdate}
            record={record}
            column={column}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            placeholder={column.placeholder || `Select ${column.title}`}
            value={text ? dayjs(text, 'DD/MM/YYYY') : null}
            onChange={(date) => handleRowUpdate(record.key, column.dataIndex, date ? date.format('YYYY-MM-DD') : null)}
            style={{ width: '100%' }}
            {...(column.dateProps || {})}
          />
        );
      
      case 'badge':
        return (
          <span className={`badge ${column.badgeClass || ''}`}>
            {text || '-'}
          </span>
        );
      
      default:
        return (
          <Typography.Text className={column.className || ''}>
            {text || '-'}
          </Typography.Text>
        );
    }
  }, [handleRowUpdate]);

  const tableColumns = useMemo(() => {
    const dynamicColumns = [
      {
        title: "",
        dataIndex: "drag",
        width: 56,
        className: "col-drag",
        render: () => <DragHandle />,
      },
      ...columns.map((col) => ({
        ...col,
        render: (text, record) => renderCell(col, text, record),
      })),
      {
        title: "",
        key: "actions",
        width: 56,
        className: "col-delete",
        render: (_, record) => (
          <button
            className="delete-btn"
            onClick={() => handleRowDelete(record.key)}
            aria-label="Delete row"
            title="Delete"
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ];

    return dynamicColumns;
  }, [columns, renderCell, handleRowDelete]);

  const components = useMemo(
    () => ({
      body: {
        row: DraggableRow,
      },
    }),
    []
  );

  const itemsIds = useMemo(() => rows.map((r) => r.key), [rows]);

  return (
    <div className={`dynamic-picker-container ${rootClassName}`}>
      {loading ? (
        <TableShimmerLoader columns={columns} />
      ) : isEditable ? (
        <>
          {/* Show table only if there's data or hideTableWhenEmpty is false */}
          {(rows.length > 0 || !hideTableWhenEmpty) && (
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <SortableContext
                items={itemsIds}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  className="dynamic-picker-table"
                  rowKey="key"
                  components={components}
                  columns={tableColumns}
                  bordered
                  dataSource={rows}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={emptyText}
                      />
                    ),
                  }}
                  scroll={{ x: true }}
                />
              </SortableContext>
            </DndContext>
          )}
          
          {onSearch && (
            <div className="dynamic-picker-search">
              <AutoComplete
                value={query}
                options={options}
                onSearch={handleSearch}
                onSelect={handleSelect}
                onChange={setQuery}
                defaultActiveFirstOption={true}
                placeholder={searchPlaceholder}
                className="dynamic-picker-search-input"
                popupClassName={!query && "boxpopup"}
                allowClear
                filterOption={false}
                loading={searchLoading}
                prefix={<i className="icon-search"></i>}
              />
            </div>
          )}
        </>
      ) : (
        <Table
          className="dynamic-picker-table"
          rowKey="key"
          columns={tableColumns.filter(col => col.dataIndex !== 'drag' && col.key !== 'actions')}
          bordered
          dataSource={rows}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyText}
              />
            ),
          }}
          scroll={{ x: true }}
        />
      )}
    </div>
  );
});

export default DynamicPickerTable;
