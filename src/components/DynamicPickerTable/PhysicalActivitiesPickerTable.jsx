import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import DynamicPickerTable from "./DynamicPickerTable";
import {
  getMockValues,
  setPhysicalActivities,
} from "../../redux/ipd/dischargeSummarySlice";
import { removeBeforeWhiteSpace } from "../../utils/utils";

const PhysicalActivitiesPickerTable = ({ isEditable = true }) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const { mockValues, dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const [physicalActivitiesData, setPhysicalActivitiesData] = useState([]);

  const timersRef = useRef({});
  const DISPATCH_DEBOUNCE_MS = 250;

  useEffect(() => {
    if (!mockValues?.physicalActivities) {
      dispatch(getMockValues());
    }
  }, [dispatch, mockValues?.physicalActivities]);

  useEffect(() => {
    if (dischargeSummaryData?.physicalActivities) {
      const formattedData = dischargeSummaryData.physicalActivities.map(
        (item, index) => ({
          key: item.key ?? `activity_${item.id ?? index}`,
          id: item.id,
          name: item.name,
          note: item.note || "",
        })
      );
      setPhysicalActivitiesData(formattedData);
    }
  }, [dischargeSummaryData?.physicalActivities]);

  const updatePhysicalActivitiesInStore = (updatedData) => {
    const formattedData = updatedData.map((item) => ({
      id: item.id,
      name: item.name,
      note: item.note || "",
    }));

    dispatch(setPhysicalActivities(formattedData));
  };

  const scheduleStoreWrite = (rowKey, field, updatedData) => {
    const id = `${rowKey}::${field}`;
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(() => {
      updatePhysicalActivitiesInStore(updatedData);
      delete timersRef.current[id];
    }, DISPATCH_DEBOUNCE_MS);
  };

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

  const searchConfig = {
    valueField: "name",
    titleField: "name",
    subtitleField: "note",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => {
      if (item.isCustom) {
        return (
          <div className="option-row">
            <span className="option-title">{item.name}</span>
            <div>
              <i className="icon-Add mx-1 text-primary fs-6"></i>
              <button className="fw-medium text-decoration-underline text-primary bg-transparent border-0 p-0">
                Add Custom
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className="option-row">
          <span className="option-title">{item.name}</span>
          {item.note && <span className="option-subtitle">{item.note}</span>}
        </div>
      );
    },
  };

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
    { id: 20, name: "Bed rest", note: "Strict bed rest for 2 days" },
  ];

  const handleSearch = async (query) => {
    const cleanedQuery = removeBeforeWhiteSpace(query);

    if (!cleanedQuery.trim()) {
      return [];
    }

    const activitiesOptions =
      mockValues?.physicalActivities || fallbackPhysicalActivitiesData;

    const filteredResults = activitiesOptions.filter((activity) =>
      activity.name.toLowerCase().includes(cleanedQuery.toLowerCase())
    );

    // Check if the exact query matches any existing activity name
    const exactMatch = filteredResults.some(
      (activity) =>
        activity.name.toLowerCase().trim() === cleanedQuery.toLowerCase().trim()
    );

    // If no exact match exists and query is not empty, add "Add Custom" option
    if (!exactMatch && cleanedQuery.trim()) {
      filteredResults.push({
        id: uuidv4(),
        name: cleanedQuery,
        note: "",
        isCustom: true,
      });
    }

    return filteredResults;
  };

  const handleRowChange = (row, field, value) => {
    const updatedData = physicalActivitiesData.map((item) =>
      item.key === row.key ? { ...item, [field]: value } : item
    );
    setPhysicalActivitiesData(updatedData);
    scheduleStoreWrite(row.key, field, updatedData);
  };

  const handleRowAdd = (row) => {
    const newPhysicalActivitiesData = [...physicalActivitiesData, row];
    setPhysicalActivitiesData(newPhysicalActivitiesData);
    updatePhysicalActivitiesInStore(newPhysicalActivitiesData);
  };

  const handleRowDelete = (row) => {
    const updatedData = physicalActivitiesData.filter(
      (item) => item.key !== row.key
    );
    setPhysicalActivitiesData(updatedData);
    updatePhysicalActivitiesInStore(updatedData);
  };

  return (
    <div style={{ width: "100%" }}>
      {physicalActivitiesData.length > 0 ? (
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
      ) : (
        isEditable && (
          <div className="physical-activities-picker-search-only">
            <DynamicPickerTable
              ref={tableRef}
              isEditable={isEditable}
              columns={columns}
              initialData={[]}
              searchConfig={searchConfig}
              onSearch={handleSearch}
              onRowChange={handleRowChange}
              onRowAdd={handleRowAdd}
              onRowDelete={handleRowDelete}
              emptyText="No physical activities added"
              searchPlaceholder="Search Physical Activities by Name"
              rootClassName="physical-activities-picker-table physical-activities-picker-search-only"
              hideTableWhenEmpty={true}
            />
          </div>
        )
      )}
    </div>
  );
};

export default PhysicalActivitiesPickerTable;
