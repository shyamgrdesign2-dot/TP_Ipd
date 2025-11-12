import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import DynamicPickerTable from "./DynamicPickerTable";
import { getMockValues, setDiet } from "../../redux/ipd/dischargeSummarySlice";
import { removeBeforeWhiteSpace } from "../../utils/utils";

const DietPickerTable = ({ isEditable = true }) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const { mockValues, dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const [dietData, setDietData] = useState([]);

  const timersRef = useRef({});
  const DISPATCH_DEBOUNCE_MS = 250;

  useEffect(() => {
    if (!mockValues?.diet) {
      dispatch(getMockValues());
    }
  }, [dispatch, mockValues?.diet]);

  useEffect(() => {
    if (dischargeSummaryData?.diet) {
      const formattedData = dischargeSummaryData.diet.map((item, index) => ({
        key: item.key ?? `diet_${item?.id ?? index}`,
        id: item?.id,
        name: item?.name,
        note: item?.note || "",
      }));
      setDietData(formattedData);
    }
  }, [dischargeSummaryData?.diet]);

  const updateDietInStore = (updatedData) => {
    const formattedData = updatedData.map((item) => ({
      id: item?.id,
      name: item?.name,
      note: item?.note || "",
    }));

    dispatch(setDiet(formattedData));
  };

  const scheduleStoreWrite = (rowKey, field, updatedData) => {
    const id = `${rowKey}::${field}`;
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(() => {
      updateDietInStore(updatedData);
      delete timersRef.current[id];
    }, DISPATCH_DEBOUNCE_MS);
  };

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
    { id: 10, name: "Clear liquid diet", note: "First 24 hours" },
    { id: 11, name: "Full diet", note: "" },
  ];

  const handleSearch = async (query) => {
    const cleanedQuery = removeBeforeWhiteSpace(query);

    if (!cleanedQuery.trim()) {
      return [];
    }

    const dietOptions = mockValues?.diet || fallbackDietData;

    const filteredResults = dietOptions.filter((diet) =>
      diet.name.toLowerCase().includes(cleanedQuery.toLowerCase())
    );

    // Check if the exact query matches any existing diet name
    const exactMatch = filteredResults.some(
      (diet) =>
        diet.name.toLowerCase().trim() === cleanedQuery.toLowerCase().trim()
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
    const updatedData = dietData.map((item) =>
      item.key === row.key ? { ...item, [field]: value } : item
    );
    setDietData(updatedData);
    scheduleStoreWrite(row.key, field, updatedData);
  };

  const handleRowAdd = (row) => {
    const newDietData = [...dietData, row];
    setDietData(newDietData);
    updateDietInStore(newDietData);
  };

  const handleRowDelete = (row) => {
    const updatedData = dietData.filter((item) => item.key !== row.key);
    setDietData(updatedData);
    updateDietInStore(updatedData);
  };

  return (
    <div style={{ width: "100%" }}>
      {dietData.length > 0 ? (
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
      ) : (
        isEditable && (
          <div className="diet-picker-search-only">
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
              emptyText="No diet recommendations added"
              searchPlaceholder="Search Diet by Name"
              rootClassName="diet-picker-table diet-picker-search-only"
              hideTableWhenEmpty={true}
            />
          </div>
        )
      )}
    </div>
  );
};

export default DietPickerTable;
