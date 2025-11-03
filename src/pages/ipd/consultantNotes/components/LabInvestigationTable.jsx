import React from "react";
import CustomTable from "./CustomTable";

const LabInvestigationTable = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const columns = [
    {
      title: "Name",
      dataIndex: "investigation",
      minWidth: "240px",
      flex: "2 1 240px",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      minWidth: "200px",
      flex: "1 1 200px",
    },
  ];

  // Transform data to match the expected format
  const transformedData = data.map((item, index) => {
    return {
      key: item.key || item.id || index,
      investigation: item.name || item.investigation || item.testName || "",
      notes: item.notes || item.instructions || item.remarks || "",
    };
  });

  return <CustomTable columns={columns} data={transformedData} />;
};

export default LabInvestigationTable;
