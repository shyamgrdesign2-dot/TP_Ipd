import React from "react";
import CustomTable from "./CustomTable";

const MedicationTable = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const columns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      subtextKey: "composition",
      hasSubtext: true,
      minWidth: "240px",
      flex: "2 1 240px",
    },
    {
      title: "Unit Per Dose",
      dataIndex: "unitPerDose",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "WHEN",
      dataIndex: "when",
      minWidth: "80px",
      flex: "1 1 80px",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      minWidth: "100px",
      flex: "1 1 100px",
    },
    {
      title: "Note",
      dataIndex: "note",
      minWidth: "200px",
      flex: "1 1 200px",
    },
  ];

  // Transform data to match the expected format
  const transformedData = data.map((item, index) => {
    return {
      key: item.key || item.id || index,
      // Medicine name
      medicine: item.name || item.medicine || item.medicineName || "",
      // Composition/generic name (subtext)
      composition:
        item.composition ||
        item.genericName ||
        item.unitPerDose || // Fallback to unitPerDose if composition not available
        "",
      // Unit per dose (actual dosage)
      unitPerDose:
        item.dose ||
        item.dosage ||
        item.units ||
        item.unitPerDose ||
        "1 Tablet",
      frequency: item.frequency || item.freq || "",
      when: item.schedule || item.when || item.timing || "",
      duration: item.duration || item.period || "",
      note: item.notes || item.note || item.remarks || "",
    };
  });

  return <CustomTable columns={columns} data={transformedData} />;
};

export default MedicationTable;
