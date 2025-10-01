import React, { useRef, useState } from "react";
import { Button, Space, message } from "antd";
import DynamicPickerTable from "./DynamicPickerTable";

// Mock API function to simulate medication search
const searchMedications = async (query) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockMedications = [
    {
      id: 1,
      name: "Medex 4mg Injection",
      code: "PN",
      type: "Injection",
      strength: "4mg",
      manufacturer: "Pharma Corp",
    },
    {
      id: 2,
      name: "Aspirin 2mg Injection",
      code: "CN",
      type: "Injection",
      strength: "2mg",
      manufacturer: "Med Industries",
    },
    {
      id: 3,
      name: "Atorvastatin Injection",
      code: "OT",
      type: "Injection",
      strength: "10mg",
      manufacturer: "Health Pharma",
    },
    {
      id: 4,
      name: "Paracetamol 500mg Tablet",
      code: "PN",
      type: "Tablet",
      strength: "500mg",
      manufacturer: "Generic Labs",
    },
    {
      id: 5,
      name: "Amoxicillin 250mg Capsule",
      code: "CN",
      type: "Capsule",
      strength: "250mg",
      manufacturer: "Antibiotic Co",
    },
    {
      id: 6,
      name: "Metformin 850mg Tablet",
      code: "OT",
      type: "Tablet",
      strength: "850mg",
      manufacturer: "Diabetes Care",
    },
  ];

  // Filter medications based on query
  return mockMedications.filter(
    (med) =>
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.type.toLowerCase().includes(query.toLowerCase())
  );
};

const MedicationPickerExample = () => {
  const tableRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);

  // Initial dummy data
  const initialMedications = [
    {
      key: "row_1",
      id: 1,
      name: "Medex 4mg Injection",
      code: "PN",
      givenDate: "2025-06-24",
      duration: "5 days",
      notes: "",
    },
    {
      key: "row_2",
      id: 2,
      name: "Aspirin 2mg Injection",
      code: "CN",
      givenDate: "2025-06-24",
      duration: "7 days",
      notes: "",
    },
    {
      key: "row_3",
      id: 3,
      name: "Atorvastatin Injection",
      code: "OT",
      givenDate: "2025-06-24",
      duration: "3 days",
      notes: "",
    },
  ];

  // Column configuration
  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <div className="medication-name-cell">
          <span className="medication-name">{text}</span>
          <span
            className={`badge badge-${record.code?.toLowerCase() || "default"}`}
          >
            [{record.code || "N/A"}]
          </span>
        </div>
      ),
    },
    {
      title: "GIVEN DATE",
      dataIndex: "givenDate",
      key: "givenDate",
      type: "date",
      width: 160,
      placeholder: "Select date",
      dateProps: {
        format: "DD MMM YYYY",
        style: { width: "100%" },
      },
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      type: "select",
      width: 120,
      placeholder: "Select duration",
      options: [
        { label: "1 day", value: "1 day" },
        { label: "3 days", value: "3 days" },
        { label: "5 days", value: "5 days" },
        { label: "7 days", value: "7 days" },
        { label: "10 days", value: "10 days" },
        { label: "14 days", value: "14 days" },
        { label: "21 days", value: "21 days" },
        { label: "30 days", value: "30 days" },
      ],
      selectProps: {
        style: { width: "100%" },
      },
    },
    {
      title: "NOTE",
      dataIndex: "notes",
      key: "notes",
      type: "input",
      placeholder: "Notes",
      inputProps: {
        style: { width: "100%" },
      },
    },
  ];

  // Search configuration
  const searchConfig = {
    valueField: "name",
    titleField: "name",
    subtitleField: "code",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => (
      <div className="option-row">
        <span className="option-title">{item.name}</span>
        <span className="option-subtitle">[{item.code}]</span>
      </div>
    ),
  };

  // Event handlers
  const handleSearch = async (query) => {
    return await searchMedications(query);
  };

  const handleRowChange = (row, field, value) => {
    console.log("Row changed:", { row, field, value });
    message.success(`Updated ${field} for ${row.name}`);
  };

  const handleRowAdd = (row) => {
    console.log("Row added:", row);
    message.success(`Added ${row.name} to the list`);
  };

  const handleRowDelete = (row) => {
    console.log("Row deleted:", row);
    message.success(`Removed ${row.name} from the list`);
  };

  // Imperative methods examples
  const handleSaveData = () => {
    const data = tableRef.current?.saveRows();
    console.log("Saved data:", data);
    message.success(`Saved ${data?.length || 0} medications`);
  };

  const handleGetData = () => {
    const data = tableRef.current?.getRows();
    console.log("Current data:", data);
    setSelectedRows(data || []);
    message.info(`Retrieved ${data?.length || 0} medications`);
  };

  const handleAddCustomRow = () => {
    const customRow = {
      id: Date.now(),
      name: "Custom Medication",
      code: "CM",
      givenDate: new Date().toISOString().split("T")[0],
      duration: "5 days",
      notes: "Added programmatically",
    };

    const addedRow = tableRef.current?.addRow(customRow);
    console.log("Added custom row:", addedRow);
    message.success("Added custom medication");
  };

  const handleClearAll = () => {
    tableRef.current?.clearRows();
    message.success("Cleared all medications");
  };

  return (
    <div style={{ margin: "0 auto" }}>
      {/* <Space style={{ marginBottom: "16px" }} wrap>
        <Button type="primary" onClick={handleSaveData}>
          Save Data
        </Button>
        <Button onClick={handleGetData}>Get Data</Button>
        <Button onClick={handleAddCustomRow}>Add Custom Row</Button>
        <Button danger onClick={handleClearAll}>
          Clear All
        </Button>
      </Space> */}

      <DynamicPickerTable
        ref={tableRef}
        isEditable={true}
        columns={columns}
        initialData={initialMedications}
        searchConfig={searchConfig}
        onSearch={handleSearch}
        onRowChange={handleRowChange}
        onRowAdd={handleRowAdd}
        onRowDelete={handleRowDelete}
        emptyText="No medications added"
        searchPlaceholder="Search by medication name or type..."
        rootClassName="medication-picker-example"
      />

      {/* {selectedRows.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h4>Retrieved Data ({selectedRows.length} items):</h4>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
};

export default MedicationPickerExample;
