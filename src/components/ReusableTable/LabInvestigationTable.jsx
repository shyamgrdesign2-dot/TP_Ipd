import React from "react";
import ReusableTable from "./ReusableTable";

const LabInvestigationTable = ({
  data = [],
  className = "",
  customStyles = {},
  ...tableProps
}) => {
  const columns = [
    {
      title: "Investigation",
      dataIndex: "investigation",
      key: "investigation",
      showSubtext: true,
      subtextKey: "category",
      minWidth: "240px",
      flex: "0 0 240px",
    },
    {
      title: "Notes",
      dataIndex: "instructions",
      key: "instructions",
      minWidth: "200px",
      flex: "0 0 200px",
    },
  ];

  // Transform data to match the expected format if needed
  const transformedData = data.map((item, index) => {
    // Handle your specific API data structure:
    // {
    //   "name": "Lab test",        // Investigation name
    //   "notes": ""               // Notes/instructions
    // }
    const transformedItem = {
      key: item.key || item.id || index,
      // Investigation name
      investigation: item.name || item.investigation || item.testName || "",
      // Category/type - not provided in your data, so we'll use empty or default
      category: item.category || item.type || item.group || "",
      // Test type - not provided, using default
      testType: item.testType || item.method || item.technique || "-",
      // Sample type - not provided, using default
      sample: item.sample || item.specimen || item.sampleType || "-",
      // Priority - not provided, using default
      priority: item.priority || item.urgency || "-",
      // Status - not provided, using default
      status: item.status || "-",
      // Instructions from notes field
      instructions: item.notes || item.instructions || item.remarks || "",
    };

    return transformedItem;
  });

  return (
    <ReusableTable
      columns={columns}
      data={transformedData}
      className={`lab-investigation-table ${className}`}
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

export default LabInvestigationTable;
