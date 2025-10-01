import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicPickerTable from "./DynamicPickerTable";
import { getMockValues, setDiet } from "../../redux/ipd/dischargeSummarySlice";

const DietPickerTable = ({ isEditable = true }) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const { mockValues, dischargeSummaryData } = useSelector((state) => state.dischargeSummary);
  const [dietData, setDietData] = useState([]);

  // Load mock values on component mount
  useEffect(() => {
    if (!mockValues?.diet) {
      dispatch(getMockValues());
    }
  }, [dispatch, mockValues?.diet]);

  // Initialize diet data from Redux store
  useEffect(() => {
    if (dischargeSummaryData?.diet) {
      const formattedData = dischargeSummaryData.diet.map((item, index) => ({
        key: `diet_${item.id || index}`,
        id: item.id,
        name: item.name,
        note: item.note || "",
      }));
      setDietData(formattedData);
    }
  }, [dischargeSummaryData?.diet]);

  // Update Redux store when diet data changes
  const updateDietInStore = (updatedData) => {
    const formattedData = updatedData.map(item => ({
      id: item.id,
      name: item.name,
      note: item.note || "",
    }));
    
    dispatch(setDiet(formattedData));
  };

  // Column configuration
  const columns = [
    {
      title: "DIET NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text) => (
        <div className="diet-name-cell">
          <span className="diet-name">{text}</span>
        </div>
      ),
    },
    {
      title: "NOTE",
      dataIndex: "note",
      key: "note",
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
    subtitleField: "note",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => (
      <div className="option-row">
        <span className="option-title">{item.name}</span>
        {item.note && <span className="option-subtitle">{item.note}</span>}
      </div>
    ),
  };

  // Fallback mock data for testing
  const fallbackDietData = [
    { id: 1, name: "Low-salt", note: "" },
    { id: 2, name: "Low-fat", note: "" },
    { id: 3, name: "Diabetic diet", note: "" },
    { id: 4, name: "High-protein diet", note: "For muscle recovery" },
    { id: 5, name: "Renal diet", note: "Avoid high potassium foods" },
    { id: 6, name: "Soft diet", note: "For 1 week" },
    { id: 7, name: "Gluten-free", note: "" },
    { id: 8, name: "Lactose-free", note: "" },
    { id: 9, name: "High-fiber diet", note: "Encourage fruits and vegetables" },
    { id: 10, name: "Clear liquid diet", note: "First 24 hours" }
  ];

  // Search function to filter diet options from mock data
  const handleSearch = async (query) => {
    if (!query.trim()) {
      return [];
    }

    // Use mock values if available, otherwise use fallback data
    const dietOptions = mockValues?.diet || fallbackDietData;

    const filteredResults = dietOptions.filter((diet) =>
      diet.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredResults;
  };

  // Event handlers
  const handleRowChange = (row, field, value) => {
    const updatedData = dietData.map(item => 
      item.key === row.key ? { ...item, [field]: value } : item
    );
    setDietData(updatedData);
    updateDietInStore(updatedData);
  };

  const handleRowAdd = (row) => {
    const newDietData = [...dietData, row];
    setDietData(newDietData);
    updateDietInStore(newDietData);
  };

  const handleRowDelete = (row) => {
    const updatedData = dietData.filter(item => item.key !== row.key);
    setDietData(updatedData);
    updateDietInStore(updatedData);
  };

  return (
    <div style={{ width: "100%" }}>
      <DynamicPickerTable
        ref={tableRef}
        isEditable={isEditable}
        columns={columns}
        initialData={dietData}
        searchConfig={searchConfig}
        onSearch={handleSearch}
        onRowChange={handleRowChange}
        onRowAdd={handleRowAdd}
        onRowDelete={handleRowDelete}
        emptyText="No diet recommendations added"
        searchPlaceholder="Search Diet by Name"
        rootClassName="diet-picker-table"
      />
    </div>
  );
};

export default DietPickerTable;
