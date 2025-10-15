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
import { v4 as uuidv4 } from "uuid";
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
import { useDispatch } from "react-redux";
import { setFinalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import { setProvisionalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import { getDiagnosisTemplates, getFrequentlySearchedDiagnosis, searchDiagnosis } from "../../../../redux/diagnosisSlice";
import ApiDiagnosis from "../../../../api/services/ApiDiagnosis";
import { removeBeforeWhiteSpace } from "../../../../utils/utils";

export const DiagnosisSummaryList = (props) => {
  const { itemId } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { finalDiagnosis = [], provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const isFinalDiagnosis = itemId === "finalDiagnosis";

  const diagnosisList = isFinalDiagnosis ? finalDiagnosis : provisionalDiagnosis;

  if (!diagnosisList?.length) {
    return null;
  }

  const renderDiagnosisItem = (diagnosis) => {
    const key = diagnosis.key || diagnosis.objectID || diagnosis.tds_name;
    const metaItems = [];

    if (diagnosis.icd_code?.trim()) {
      metaItems.push(`ICD Code: ${diagnosis.icd_code}`);
    }
    if (diagnosis.notes?.trim()) {
      metaItems.push(`Notes: ${diagnosis.notes}`);
    }

    return (
      <li className="dx-summary-item" key={key}>
        <span className="dx-summary-title">{diagnosis.tds_name}</span>
        {metaItems.length > 0 && (
          <span className="dx-summary-meta"> ({metaItems.join(", ")})</span>
        )}
      </li>
    );
  };

  return (
    <ul className="dx-summary">
      {diagnosisList.map(renderDiagnosisItem)}
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
  const { isEditable = true, rootClassName, itemId } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { parentOptionsList } = useSelector(
    (state) => state.diagnosis
  );
  const { finalDiagnosis = [], provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const [parentSearchOptions, setParentSearchOptions] = useState([]);
  const [searchParentQuery, setSearchParentQuery] = useState("");
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const isFinalDiagnosis = itemId === "finalDiagnosis";
  const rows =
    isFinalDiagnosis ? finalDiagnosis : provisionalDiagnosis;
  const setRows = useCallback((newRows) => {
    const updatedRows = newRows.map((row, rowIndex) => ({
      ...row,
      type: "paragraph",
      children: [{ text: "" }],
    }));
    if (isFinalDiagnosis) {
      dispatch(setFinalDiagnosis(updatedRows));
    } else {
      dispatch(setProvisionalDiagnosis(updatedRows));
    }
    setSearchParentQuery("");
    setQuery("");
  }, [isFinalDiagnosis]);

  useEffect(() => {
    dispatch(getDiagnosisTemplates());
    dispatch(getFrequentlySearchedDiagnosis());
}, []);

  useEffect(() => {
    if (searchParentQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchDiagnosis({ searchQuery: searchParentQuery, type: "parent" })
        );
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [searchParentQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  useImperativeHandle(ref, () => ({
    saveRows: () => {
      return rows;
    },
  }));

  useEffect(() => {
    const data = [];
    parentOptionsList.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e, unique_id: uuidv4() }),
        value: e.tds_name,
        label: <div>{`${e.tds_name} ${e?.icd_code ? `(${e?.icd_code})` : ''}`}</div>,
      });
    });
    if (searchParentQuery.length === 0) {
      data.unshift({
        key: -1,
        label: (
          <>
            <div>FREQUENTLY USED</div>
          </>
        ),
      });
    } else {
      searchParentQuery && parentOptionsList.findIndex(e => e.tds_name?.toLowerCase()?.trim() == searchParentQuery?.toLowerCase()?.trim()) === -1 &&
        data.push({
          key: JSON.stringify({
            unique_id: uuidv4(),
            change: 1,
            tds_id: 0,
            tds_name: searchParentQuery,
            pms_default: 0,
          }),
          value: searchParentQuery,
          label: (
            <>
              <div>{searchParentQuery}<i className="icon-Add mx-1 text-primary fs-6"></i> <a className="fw-medium text-decoration-underline text-primary"> Add Custom</a></div>
            </>
          ),
        });
    }
    setParentSearchOptions(data);
  }, [parentOptionsList]);

  const onSearchParent = useCallback(
    (query) => {
      setSearchParentQuery(removeBeforeWhiteSpace(query));
    },
    [searchParentQuery]
  );

  const onSelectParent = useCallback(
    (data, e) => {
      const newData = [...rows]
      newData.push({
        ...JSON.parse(e.key),
        notes: "",
      });
      setRows(newData);
    },
    [searchParentQuery, rows]
  );

  const onDragEnd = ({ active, over }) => {
    if (!over || active.objectID === over.objectID) return;

    const oldIndex = rows.findIndex((r) => r.key === active.objectID);
    const newIndex = rows.findIndex((r) => r.key === over.objectID);
    const newRows = arrayMove(rows, oldIndex, newIndex);
    setRows(newRows);
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
        title:
          isFinalDiagnosis
            ? "Final Diagnosis"
            : "Provisional Diagnosis",
        dataIndex: "tds_name",
        key: "tds_name",
        ellipsis: true,
        render: (text) => (
          <Typography.Text className="title-cell">{text}</Typography.Text>
        ),
      },
      {
        title: "ICD 10 Code",
        dataIndex: "icd_code",
        key: "icd_code",
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
              const newRows = rows.map((r) => (r.objectID === record.objectID ? { ...r, notes: v } : r));
              setRows(newRows);
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
            onClick={() => {
              const newRows = rows.filter((r) => r.objectID !== record.objectID);
              setRows(newRows);
            }}
            aria-label="Delete row"
            title="Delete"
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ],
    [setRows, isFinalDiagnosis, rows]
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
          <DiagnosisSummaryList itemId={itemId} />
        </div>
      ) : null}

      {isEditable && (
        <div className="dx-search">
          <AutoComplete
            value={query}
            options={parentSearchOptions}
            onSearch={onSearchParent}
            onSelect={onSelectParent}
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
