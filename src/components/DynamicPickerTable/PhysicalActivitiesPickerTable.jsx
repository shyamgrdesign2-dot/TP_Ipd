import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicPickerTable from "./DynamicPickerTable";
import { getMockValues, setPhysicalActivities } from "../../redux/ipd/dischargeSummarySlice";

const PhysicalActivitiesPickerTable = ({ isEditable = true }) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const { mockValues, dischargeSummaryData } = useSelector((state) => state.dischargeSummary);
  const [physicalActivitiesData, setPhysicalActivitiesData] = useState([]);

  // Load mock values on component mount
  useEffect(() => {
    if (!mockValues?.physicalActivities) {
      dispatch(getMockValues());
    }
  }, [dispatch, mockValues?.physicalActivities]);

  // Initialize physical activities data from Redux store
  useEffect(() => {
    if (dischargeSummaryData?.physicalActivities) {
      const formattedData = dischargeSummaryData.physicalActivities.map((item, index) => ({
        key: `activity_${item.id || index}`,
        id: item.id,
        name: item.name,
        note: item.note || "",
      }));
      setPhysicalActivitiesData(formattedData);
    }
  }, [dischargeSummaryData?.physicalActivities]);

  // Update Redux store when physical activities data changes
  const updatePhysicalActivitiesInStore = (updatedData) => {
    const formattedData = updatedData.map(item => ({
      id: item.id,
      name: item.name,
      note: item.note || "",
    }));
    
    dispatch(setPhysicalActivities(formattedData));
  };

  // Column configuration
  const columns = [
    {
      title: "ACTIVITIES NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text) => (
        <div className="activity-name-cell">
          <span className="activity-name">{text}</span>
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
  const fallbackPhysicalActivitiesData = [
    { id: 11, name: "Avoid strenuous activity", note: "For 4 days" },
    { id: 12, name: "Gradual walking", note: "" },
    { id: 13, name: "Light stretching", note: "5 minutes twice a day" },
    { id: 14, name: "Climbing stairs", note: "Only after 2 days" },
    { id: 15, name: "Yoga (breathing exercises)", note: "" },
    { id: 16, name: "Physiotherapy guided exercises", note: "As advised" },
    { id: 17, name: "Cycling", note: "After 1 week" },
    { id: 18, name: "Swimming", note: "Avoid until wound heals" },
    { id: 19, name: "Jogging", note: "Resume after 2 weeks" },
    { id: 20, name: "Bed rest", note: "Strict bed rest for 2 days" }
  ];

  // Search function to filter physical activities options from mock data
  const handleSearch = async (query) => {
    if (!query.trim()) {
      return [];
    }

    // Use mock values if available, otherwise use fallback data
    const activitiesOptions = mockValues?.physicalActivities || fallbackPhysicalActivitiesData;

    const filteredResults = activitiesOptions.filter((activity) =>
      activity.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredResults;
  };

  // Event handlers
  const handleRowChange = (row, field, value) => {
    const updatedData = physicalActivitiesData.map(item => 
      item.key === row.key ? { ...item, [field]: value } : item
    );
    setPhysicalActivitiesData(updatedData);
    updatePhysicalActivitiesInStore(updatedData);
  };

  const handleRowAdd = (row) => {
    const newPhysicalActivitiesData = [...physicalActivitiesData, row];
    setPhysicalActivitiesData(newPhysicalActivitiesData);
    updatePhysicalActivitiesInStore(newPhysicalActivitiesData);
  };

  const handleRowDelete = (row) => {
    const updatedData = physicalActivitiesData.filter(item => item.key !== row.key);
    setPhysicalActivitiesData(updatedData);
    updatePhysicalActivitiesInStore(updatedData);
  };

  return (
    <div style={{ width: "100%" }}>
      <DynamicPickerTable
        ref={tableRef}
        isEditable={isEditable}
        columns={columns}
        initialData={physicalActivitiesData}
        searchConfig={searchConfig}
        onSearch={handleSearch}
        onRowChange={handleRowChange}
        onRowAdd={handleRowAdd}
        onRowDelete={handleRowDelete}
        emptyText="No physical activities added"
        searchPlaceholder="Search Physical Activities by Name"
        rootClassName="physical-activities-picker-table"
      />
    </div>
  );
};

export default PhysicalActivitiesPickerTable;
