import React from "react";
import ReusableTable from "./ReusableTable";

const MedicineTable = ({
  data = [],
  className = "",
  customStyles = {},
  ...tableProps
}) => {
  const columns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
      showSubtext: true,
      subtextKey: "composition",
      minWidth: "180px",
      flex: "2 1 180px", // Takes more space but can shrink
    },
    {
      title: "Unit Per Dose",
      dataIndex: "unitPerDose",
      key: "unitPerDose",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "WHEN",
      dataIndex: "when",
      key: "when",
      minWidth: "80px",
      flex: "1 1 80px",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      minWidth: "120px",
      flex: "1 1 120px",
    },
  ];

  // Transform data to match the expected format if needed
  const transformedData = data.map((item, index) => {
    // Handle your specific API data structure:
    // {
    //   "name": "A Tret 10mg Capsule",           // Medicine name
    //   "unitPerDose": "Acitretin (10mg)",       // Composition/generic name
    //   "frequency": "1 - 1 - 1 - 0",           // Frequency
    //   "schedule": "None",                      // When/timing
    //   "duration": "to be continued",          // Duration
    //   "notes": ""                             // Notes
    // }
    const transformedItem = {
      key: item.key || item.id || index,
      // Medicine name
      medicine: item.name || item.medicine || item.medicineName || "",
      // Composition is in unitPerDose field in your API
      composition:
        item.unitPerDose || item.composition || item.genericName || "",
      // For unit per dose, we need to extract or default since your API uses this field for composition
      unitPerDose: item.dose || item.dosage || item.units || "1 Tablet", // Default fallback
      frequency: item.frequency || item.freq || "",
      // Schedule maps to 'when'
      when: item.schedule || item.when || item.timing || "",
      duration: item.duration || item.period || "",
      // Notes field
      note: item.notes || item.note || item.remarks || "",
    };

    return transformedItem;
  });

  return (
    <ReusableTable
      columns={columns}
      data={transformedData}
      className={`medicine-table ${className}`}
      customStyles={{
        container: {
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.5)",
          ...customStyles.container,
        },
        header: {
          backgroundColor: "#f8f4fc",
          ...customStyles.header,
        },
        ...customStyles,
      }}
      {...tableProps}
    />
  );
};

export default MedicineTable;
