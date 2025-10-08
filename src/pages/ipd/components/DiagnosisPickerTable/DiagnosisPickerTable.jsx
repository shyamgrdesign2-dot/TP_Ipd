import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AutoComplete, Table, Input, Typography, Empty } from "antd";
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
import { fetchDiagnosesAPI } from "./utils";
import { useSelector } from "react-redux";

export const DiagnosisSummaryList = (props) => {
  const { dischargeSummaryData} = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } = dischargeSummaryData?.diagnosisAndSurgery || {};
  if (!provisionalDiagnosis?.length) return null;

  return (
    <ul className="dx-summary">
      {provisionalDiagnosis.map((it) => {
        const key = it.key || it.id || it.title;
        const parts = [];

        if (it.icdCode?.trim()) {
          parts.push(
            <span key="icd">
              <strong>ICD Code:</strong> {it.icdCode}
            </span>
          );
        }
        if (it.notes?.trim()) {
          parts.push(
            <span key="notes">
              <strong>Notes:</strong> {it.notes}
            </span>
          );
        }

        return (
          <li className="dx-summary-item" key={key}>
            <span className="dx-summary-title">{it.title}</span>
            {parts.length > 0 && (
              <>
                {" "}
                <span className="dx-summary-meta">
                  (
                  {parts.reduce((acc, curr, idx) => {
                    // Insert comma + space between parts
                    if (idx === 0) return [curr];
                    return [...acc, <span key={`sep-${idx}`}>, </span>, curr];
                  }, [])}
                  )
                </span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const RowDndContext = React.createContext(null);

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

export const DiagnosisPickerTable = forwardRef((props, ref) => {
  const { isEditable = true, rootClassName } = props || {};
  const { dischargeSummaryData} = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } = dischargeSummaryData?.diagnosisAndSurgery || {};
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState(provisionalDiagnosis);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  useImperativeHandle(ref, () => ({
    saveRows: () => {
      return rows;
    },
  }));

  const searchDebounced = async (val) => {
    setLoading(true);
    try {
      const results = await fetchDiagnosesAPI(val);
      setOptions(
        results.map((item) => ({
          value: item.title,
          label: (
            <div className="option-row">
              <span className="option-title">{item.title}</span>
              <span className="option-icd">{item.icdCode}</span>
            </div>
          ),
          item,
        }))
      );
    } finally {
      setLoading(false);
    }
  };


  const onSearch = (val) => {
    setQuery(val);
    searchDebounced(val);
  };

  const onSelect = (_label, option) => {
    const item = option.item;
    if (!item) return;

    setRows((prev) => {
      if (prev.some((r) => r.id === item.id)) return prev;
      return [
        ...prev,
        {
          key: `row_${item.id}`,
          id: item.id,
          title: item.title,
          icdCode: item.icdCode || "",
          notes: "",
        },
      ];
    });

    setQuery("");
    setOptions([]);
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setRows((prev) => {
      const oldIndex = prev.findIndex((r) => r.key === active.id);
      const newIndex = prev.findIndex((r) => r.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const columns = useMemo(
    () => [
      {
        title: "",
        dataIndex: "drag",
        width: 56,
        className: "col-drag",
        render: () => <DragHandle />,
      },
      {
        title: "Final Diagnosis",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (text) => (
          <Typography.Text className="title-cell">{text}</Typography.Text>
        ),
      },
      {
        title: "ICD 10 Code",
        dataIndex: "icdCode",
        key: "icdCode",
        width: 160,
        render: (text) => <span className="icd-cell">{text || "-"}</span>,
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        render: (_, record) => (
          <Input
            placeholder="Notes"
            value={record.notes}
            onChange={(e) => {
              const v = e.target.value;
              setRows((prev) =>
                prev.map((r) => (r.key === record.key ? { ...r, notes: v } : r))
              );
            }}
          />
        ),
      },
      {
        title: "",
        key: "actions",
        width: 56,
        className: "col-delete",
        render: (_, record) => (
          <button
            className="delete-btn"
            onClick={() =>
              setRows((prev) => prev.filter((r) => r.key !== record.key))
            }
            aria-label="Delete row"
            title="Delete"
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ],
    [setRows]
  );

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
    <div className={`dx-container ${rootClassName}`}>
      {rows?.length && isEditable ? (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <SortableContext
            items={itemsIds}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className="dx-table"
              rowKey="key"
              components={components}
              columns={columns}
              bordered
              dataSource={rows}
              pagination={false}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No diagnoses added"
                  />
                ),
              }}
              scroll={{ x: true }}
            />
          </SortableContext>
        </DndContext>
      ) : null}
      {!isEditable ? (
        <div>
          <DiagnosisSummaryList />
        </div>
      ) : null}

      {isEditable && (
        <div className="dx-search">
          <AutoComplete
            value={query}
            options={options}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={setQuery}
            defaultActiveFirstOption={true}
            placeholder="Search by Diagnosis Name"
            className="dx-search-input"
            popupClassName={!query && "boxpopup"}
            allowClear
            filterOption={false}
            prefix={<i className="icon-search"></i>}
          />
        </div>
      )}
    </div>
  );
});

export default DiagnosisPickerTable;
