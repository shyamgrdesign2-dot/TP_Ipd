import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiLabResults from "../../api/services/ipd/ApiLabResults";
import { ictAuthToken } from "../appointmentsSlice";
import { PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN } from "../../utils/constants";

// Async thunk for getting pathology results
export const getPathologyResults = createAsyncThunk(
  "labResults/getPathologyResults",
  async (data, { dispatch }) => {
    try {
      let result = {};
      result = await ApiLabResults.getZydusLabResults(data);
      if (!result.error) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      if (error?.response?.status === 401) {
        const action = await dispatch(ictAuthToken());
        if (action.meta.requestStatus === "fulfilled") {
          await localStorage.setItem(
            PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN,
            JSON.stringify(action.payload.tokenNo)
          );
          dispatch(getPathologyResults(data));
        }
      } else throw Error(error);
    }
  }
);

export const getAddedToDischargeSummaryTests = createAsyncThunk(
  "labResults/getAddedToDischargeSummaryTests",
  async (data) => {
    try {
      let result = {};
      result = await ApiLabResults.getAddedToDischargeSummaryTests(data);

      if (!result.error) {
        return result.labParams || [];
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

// Async thunk for updating pathology results (add to discharge summary)
export const updatePathologyResults = createAsyncThunk(
  "labResults/updatePathologyResults",
  async (data) => {
    try {
      let result = {};
      result = await ApiLabResults.updatePathologyResults(data);

      if (result) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const getScanResults = createAsyncThunk(
  "labResults/getScanResults",
  async (data) => {
    try {
      let result = {};
      result = await ApiLabResults.getScanResults(data);
      if (!result.error) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

// Helper function to parse reference range string to object
const parseReferenceRange = (refRangeString) => {
  if (!refRangeString || refRangeString === "-" || refRangeString === "") {
    return { min: null, max: null };
  }

  // Match patterns like "1.0-30.0", "28.0-217.0", etc.
  const rangeMatch = refRangeString.match(/^([\d.]+)\s*-\s*([\d.]+)$/);

  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
    };
  }

  // If it doesn't match the range pattern, return as is
  return { min: null, max: null };
};

// Helper function to transform new API data format to component format
const transformNewApiDataToComponentFormat = (apiResponse) => {
  if (!apiResponse || !Array.isArray(apiResponse)) return [];

  return apiResponse.map((labResult, index) => ({
    key: (index + 1).toString(),
    category: `${labResult.serviceName} (${
      labResult.labResultParameters?.length || 0
    })`,
    sampleId: labResult.sampleId,
    certifiedDate: labResult.certifiedDate,
    serviceCode: labResult.serviceCode,
    labResultId: labResult.labResultId,
    tests:
      labResult.labResultParameters?.map((param, paramIndex) => ({
        key: `${index + 1}-${paramIndex + 1}`,
        name: param.parameterName,
        values: {
          [labResult.certifiedDate]: {
            value: `${param.resultValue || "-"}`,
          },
        },
        refRange: parseReferenceRange(param.referenceRange),
        selected: false,
        labResultParameterId: param.labResultParameterId,
      })) || [],
  }));
};

// Helper function to transform API data to component format (legacy format)
const transformApiDataToComponentFormat = (apiResponse) => {
  // Check if this is the new format (array of lab results)
  if (Array.isArray(apiResponse)) {
    return transformNewApiDataToComponentFormat(apiResponse);
  }

  // Legacy format with labParams
  if (
    !apiResponse ||
    !apiResponse.labParams ||
    !Array.isArray(apiResponse.labParams)
  )
    return [];

  return apiResponse.labParams.map((category, index) => ({
    key: (index + 1).toString(),
    category: `${category.reportName} (${category.testCount})`,
    tests:
      category.tests?.map((test, testIndex) => ({
        key: `${index + 1}-${testIndex + 1}`,
        name: test.testName,
        values: transformTestValues(test.values),
        refRange: test.refRange,
        selected: test.selected || false,
      })) || [],
  }));
};

// Helper function to transform test values
const transformTestValues = (values) => {
  const transformed = {};

  Object.entries(values || {}).forEach(([date, data]) => {
    const formattedDate = formatDateForDisplay(date);
    transformed[formattedDate] = {
      value: `${data.value} ${data.unit}`,
    };
  });

  return transformed;
};

// Helper function to format date for display
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(",", ",");
};

// Helper function to transform component data back to API format
const transformComponentDataToApiFormat = (
  componentData,
  selectedTests,
  selectedCategories
) => {
  const result = [];

  componentData.forEach((category) => {
    // Check if this category or any of its tests are selected
    const isCategorySelected = selectedCategories.includes(category.key);
    const selectedTestsInCategory = category.tests.filter((test) =>
      selectedTests.includes(test.key)
    );

    if (isCategorySelected || selectedTestsInCategory.length > 0) {
      const testsToInclude = isCategorySelected
        ? category.tests
        : selectedTestsInCategory;

      const categoryData = {
        reportName: category.category.split(" (")[0], // Remove count from name
        testCount: testsToInclude.length,
        tests: testsToInclude.map((test) => ({
          testName: test.name,
          values: transformValuesBackToApi(test.values),
          refRange: test.refRange,
          selected: true,
        })),
      };
      result.push(categoryData);
    }
  });

  return result;
};

// Helper function to transform values back to API format
const transformValuesBackToApi = (values) => {
  const transformed = {};

  Object.entries(values || {}).forEach(([displayDate, data]) => {
    // Convert display date back to API date format
    const apiDate = convertDisplayDateToApiFormat(displayDate);
    const [value, unit] = data.value.split(" ");

    transformed[apiDate] = {
      value: parseFloat(value) || 0,
      unit: unit || "",
    };
  });

  return transformed;
};

// Helper function to convert display date to API format
const convertDisplayDateToApiFormat = (displayDate) => {
  // Handle different date formats
  // "06 Aug, 2025" or "08-07-2025" (DD-MM-YYYY) to "2025-08-06" (YYYY-MM-DD)

  // Check if it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }

  // Check if it's in DD-MM-YYYY format (from new API)
  if (/^\d{2}-\d{2}-\d{4}$/.test(displayDate)) {
    const [day, month, year] = displayDate.split("-");
    return `${year}-${month}-${day}`;
  }

  // Otherwise, parse as standard date format
  const date = new Date(displayDate);
  return date.toISOString().split("T")[0];
};

const initialState = {
  // Data state
  pathologyResults: [],
  scanResults: [],
  availableDates: [],

  // UI state
  loading: false,
  updating: false,
  error: null,
  updateError: null,

  // Selection state
  selectedTests: [],
  selectedCategories: [],

  // Filter state
  searchText: "",
  selectedDateRange: null,
  activeTab: "pathology",
  expandedCategories: ["1"], // Default first category expanded

  // Scan results specific state
  scanLoading: false,
  scanError: null,
  activeScanCategory: "all",
  scanDateStatus: "closed",
};

const labResultsSlice = createSlice({
  name: "labResults",
  initialState,
  reducers: {
    // UI actions
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },

    toggleCategory: (state, action) => {
      const categoryKey = action.payload;
      if (state.expandedCategories.includes(categoryKey)) {
        state.expandedCategories = state.expandedCategories.filter(
          (key) => key !== categoryKey
        );
      } else {
        state.expandedCategories.push(categoryKey);
      }
    },

    // Selection actions
    selectTest: (state, action) => {
      const testKey = action.payload;
      if (!state.selectedTests.includes(testKey)) {
        state.selectedTests.push(testKey);
      }
    },

    deselectTest: (state, action) => {
      const testKey = action.payload;
      state.selectedTests = state.selectedTests.filter(
        (key) => key !== testKey
      );
    },

    selectCategory: (state, action) => {
      const categoryKey = action.payload;
      if (!state.selectedCategories.includes(categoryKey)) {
        state.selectedCategories.push(categoryKey);
      }
    },

    deselectCategory: (state, action) => {
      const categoryKey = action.payload;
      state.selectedCategories = state.selectedCategories.filter(
        (key) => key !== categoryKey
      );
    },

    selectAll: (state) => {
      // Select all categories and tests
      state.selectedCategories = state.pathologyResults.map(
        (category) => category.key
      );
      state.selectedTests = state.pathologyResults.flatMap((category) =>
        category.tests.map((test) => test.key)
      );
    },

    deselectAll: (state) => {
      state.selectedTests = [];
      state.selectedCategories = [];
    },

    // Bulk selection actions
    selectCategoryWithTests: (state, action) => {
      const { categoryKey, testKeys } = action.payload;

      // Add category to selection
      if (!state.selectedCategories.includes(categoryKey)) {
        state.selectedCategories.push(categoryKey);
      }

      // Add all tests to selection
      testKeys.forEach((testKey) => {
        if (!state.selectedTests.includes(testKey)) {
          state.selectedTests.push(testKey);
        }
      });
    },

    deselectCategoryWithTests: (state, action) => {
      const { categoryKey, testKeys } = action.payload;

      // Remove category from selection
      state.selectedCategories = state.selectedCategories.filter(
        (key) => key !== categoryKey
      );

      // Remove all tests from selection
      state.selectedTests = state.selectedTests.filter(
        (key) => !testKeys.includes(key)
      );
    },

    // Scan results specific actions
    setActiveScanCategory: (state, action) => {
      state.activeScanCategory = action.payload;
    },

    setScanDateStatus: (state, action) => {
      state.scanDateStatus = action.payload;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.scanError = null;
    },
  },

  extraReducers: (builder) => {
    // Get pathology results
    builder
      .addCase(getPathologyResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPathologyResults.fulfilled, (state, action) => {
        state.loading = false;
        state.pathologyResults = transformApiDataToComponentFormat(
          action.payload
        );

        // Extract available dates from the API response
        const dates = new Set();

        // Check if this is the new format (array of lab results)
        if (Array.isArray(action.payload)) {
          // Extract dates from certifiedDate field
          action.payload.forEach((labResult) => {
            if (labResult.certifiedDate) {
              dates.add(labResult.certifiedDate);
            }
          });
        } else {
          // Legacy format handling
          // Use testDates from API response if available
          if (
            action.payload?.testDates &&
            Array.isArray(action.payload.testDates)
          ) {
            action.payload.testDates.forEach((date) => {
              dates.add(formatDateForDisplay(date));
            });
          } else {
            // Fallback: extract from test values
            action.payload?.labParams?.forEach((category) => {
              category.tests?.forEach((test) => {
                Object.keys(test.values || {}).forEach((date) => {
                  dates.add(formatDateForDisplay(date));
                });
              });
            });
          }
        }

        state.availableDates = Array.from(dates).sort();
      })
      .addCase(getPathologyResults.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch pathology results";
      });

    // Update pathology results
    builder
      .addCase(updatePathologyResults.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePathologyResults.fulfilled, (state, action) => {
        state.updating = false;
        // Optionally clear selections after successful update
        state.selectedTests = [];
        state.selectedCategories = [];
      })
      .addCase(updatePathologyResults.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          action.payload?.message || "Failed to update pathology results";
      });

    // Get scan results
    builder
      .addCase(getScanResults.pending, (state) => {
        state.scanLoading = true;
        state.scanError = null;
      })
      .addCase(getScanResults.fulfilled, (state, action) => {
        state.scanLoading = false;
        state.scanResults = action.payload?.data || action.payload || [];
      })
      .addCase(getScanResults.rejected, (state, action) => {
        state.scanLoading = false;
        state.scanError =
          action.payload?.message || "Failed to fetch scan results";
      });
  },
});

export const {
  setActiveTab,
  setSearchText,
  setSelectedDateRange,
  toggleCategory,
  selectTest,
  deselectTest,
  selectCategory,
  deselectCategory,
  selectAll,
  deselectAll,
  selectCategoryWithTests,
  deselectCategoryWithTests,
  setActiveScanCategory,
  setScanDateStatus,
  clearError,
} = labResultsSlice.actions;

export const selectPathologyResults = (state) =>
  state.labResults.pathologyResults;
export const selectScanResults = (state) => state.labResults.scanResults;
export const selectScanLoading = (state) => state.labResults.scanLoading;
export const selectScanError = (state) => state.labResults.scanError;
export const selectAvailableDates = (state) => state.labResults.availableDates;
export const selectSelectedTests = (state) => state.labResults.selectedTests;
export const selectSelectedCategories = (state) =>
  state.labResults.selectedCategories;
export const selectIsLoading = (state) => state.labResults.loading;
export const selectError = (state) => state.labResults.error;
export const selectUpdateError = (state) => state.labResults.updateError;
export const selectActiveTab = (state) => state.labResults.activeTab;
export const selectSearchText = (state) => state.labResults.searchText;
export const selectSelectedDateRange = (state) =>
  state.labResults.selectedDateRange;
export const selectExpandedCategories = (state) =>
  state.labResults.expandedCategories;

// Helper function to check if a date is within a date range
const isDateInRange = (dateStr, dateRange) => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

  // Parse date string - handle both "DD-MM-YYYY" and other formats
  let testDate;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    testDate = new Date(`${year}-${month}-${day}`);
  } else {
    testDate = new Date(dateStr);
  }

  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  // Set time to start/end of day for proper comparison
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  testDate.setHours(0, 0, 0, 0);

  return testDate >= startDate && testDate <= endDate;
};

// Selector for filtered pathology results based on search and date range
export const selectFilteredPathologyResults = (state) => {
  const results = state.labResults.pathologyResults;
  const searchText = state.labResults.searchText?.toLowerCase().trim() || "";
  const dateRange = state.labResults.selectedDateRange;

  // If no filters applied, return all results
  if (!searchText && !dateRange) {
    return results;
  }

  return results
    .map((category) => {
      // Filter tests within each category
      const filteredTests = category.tests.filter((test) => {
        // Search filter - check test name
        const matchesSearch =
          !searchText ||
          test.name.toLowerCase().includes(searchText) ||
          category.category.toLowerCase().includes(searchText);

        // Date filter - check if any value date is within range
        const matchesDate =
          !dateRange ||
          Object.keys(test.values || {}).some((dateKey) =>
            isDateInRange(dateKey, dateRange)
          );

        return matchesSearch && matchesDate;
      });

      // Return category with filtered tests
      return {
        ...category,
        tests: filteredTests,
        category: `${category.category.split(" (")[0]} (${
          filteredTests.length
        })`,
      };
    })
    .filter((category) => category.tests.length > 0); // Remove empty categories
};

// Selector for filtered available dates based on search
export const selectFilteredAvailableDates = (state) => {
  const dates = state.labResults.availableDates;
  const searchText = state.labResults.searchText?.toLowerCase().trim() || "";

  // If no search, return all dates
  if (!searchText) {
    return dates;
  }

  // Get all dates that have matching tests
  const results = state.labResults.pathologyResults;
  const matchingDates = new Set();

  results.forEach((category) => {
    category.tests.forEach((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchText) ||
        category.category.toLowerCase().includes(searchText);

      if (matchesSearch) {
        Object.keys(test.values || {}).forEach((dateKey) => {
          matchingDates.add(dateKey);
        });
      }
    });
  });

  return dates.filter((date) => matchingDates.has(date));
};

// Selector for total selection count
export const selectTotalSelectionCount = (state) => {
  return state.labResults.selectedTests.length;
};

// Selector for total item count (based on filtered results)
export const selectTotalItemCount = (state) => {
  const filteredResults = selectFilteredPathologyResults(state);
  const testCount = filteredResults.reduce(
    (total, category) => total + category.tests.length,
    0
  );
  return testCount;
};

// Selector to check if all visible items are selected
export const selectIsAllSelected = (state) => {
  const filteredResults = selectFilteredPathologyResults(state);
  const allTestKeys = filteredResults.flatMap((category) =>
    category.tests.map((test) => test.key)
  );

  if (allTestKeys.length === 0) return false;

  return allTestKeys.every((key) =>
    state.labResults.selectedTests.includes(key)
  );
};

// Selector for main checkbox indeterminate state
export const selectIsMainCheckboxIndeterminate = (state) => {
  const totalSelected = selectTotalSelectionCount(state);
  const totalItems = selectTotalItemCount(state);

  return totalSelected > 0 && totalSelected < totalItems;
};

// Thunk for adding selected items to discharge summary
export const addToDischargeSummary = createAsyncThunk(
  "labResults/addToDischargeSummary",
  async (
    { patientId, admissionId },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const { pathologyResults, selectedTests, selectedCategories } =
        state.labResults;

      // Transform selected data to API format
      const apiData = transformComponentDataToApiFormat(
        pathologyResults,
        selectedTests,
        selectedCategories
      );

      const addedToDischargeSummaryTests = await dispatch(
        getAddedToDischargeSummaryTests({
          patientId,
          admissionId,
        })
      ).unwrap();

      const merged = [...addedToDischargeSummaryTests, ...apiData];

      const uniqueByReportName = [
        ...new Map(merged.map((item) => [item.reportName, item])).values(),
      ];

      // Call the update API
      const result = await dispatch(
        updatePathologyResults({
          patientId,
          admissionId,
          data: uniqueByReportName,
        })
      ).unwrap();

      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export default labResultsSlice.reducer;

// Export the transform functions for use in components
export {
  transformApiDataToComponentFormat,
  transformComponentDataToApiFormat,
  formatDateForDisplay,
};
