import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiLabResults from "../../api/services/ipd/ApiLabResults";

// Async thunk for getting pathology results
export const getPathologyResults = createAsyncThunk(
  "labResults/getPathologyResults",
  async (data) => {
    try {
      let result = {};
      result = await ApiLabResults.getPathologyResults(data);
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

// Helper function to transform API data to component format
const transformApiDataToComponentFormat = (apiResponse) => {
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
    if (selectedCategories.includes(category.key)) {
      // Entire category is selected
      const categoryData = {
        reportName: category.category.split(" (")[0], // Remove count from name
        testCount: category.tests.length,
        tests: category.tests.map((test) => ({
          testName: test.name,
          values: transformValuesBackToApi(test.values),
          refRange: test.refRange,
          selected: true,
        })),
      };
      result.push(categoryData);
    } else {
      // Check for individually selected tests
      const selectedTestsInCategory = category.tests.filter((test) =>
        selectedTests.includes(test.key)
      );

      if (selectedTestsInCategory.length > 0) {
        const categoryData = {
          reportName: category.category.split(" (")[0],
          testCount: selectedTestsInCategory.length,
          tests: selectedTestsInCategory.map((test) => ({
            testName: test.name,
            values: transformValuesBackToApi(test.values),
            refRange: test.refRange,
            selected: true,
          })),
        };
        result.push(categoryData);
      }
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
  // Convert "06 Aug, 2025" to "2025-08-06"
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

// Export actions
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

// Selectors
export const selectLabResultsState = (state) => state.labResults;
export const selectPathologyResults = (state) =>
  state.labResults.pathologyResults;
export const selectScanResults = (state) => state.labResults.scanResults;
export const selectScanLoading = (state) => state.labResults.scanLoading;
export const selectScanError = (state) => state.labResults.scanError;
export const selectActiveScanCategory = (state) =>
  state.labResults.activeScanCategory;
export const selectScanDateStatus = (state) => state.labResults.scanDateStatus;
export const selectAvailableDates = (state) => state.labResults.availableDates;
export const selectSelectedTests = (state) => state.labResults.selectedTests;
export const selectSelectedCategories = (state) =>
  state.labResults.selectedCategories;
export const selectIsLoading = (state) => state.labResults.loading;
export const selectIsUpdating = (state) => state.labResults.updating;
export const selectError = (state) => state.labResults.error;
export const selectUpdateError = (state) => state.labResults.updateError;
export const selectActiveTab = (state) => state.labResults.activeTab;
export const selectSearchText = (state) => state.labResults.searchText;
export const selectExpandedCategories = (state) =>
  state.labResults.expandedCategories;

// Complex selectors
export const selectTotalSelectionCount = (state) => {
  return (
    state.labResults.selectedTests.length +
    state.labResults.selectedCategories.length
  );
};

export const selectTotalItemCount = (state) => {
  const testCount = state.labResults.pathologyResults.reduce(
    (total, category) => total + category.tests.length,
    0
  );
  const categoryCount = state.labResults.pathologyResults.length;
  return testCount + categoryCount;
};

export const selectIsAllSelected = (state) => {
  const allTestKeys = state.labResults.pathologyResults.flatMap((category) =>
    category.tests.map((test) => test.key)
  );
  const allCategoryKeys = state.labResults.pathologyResults.map(
    (category) => category.key
  );

  return (
    allTestKeys.every((key) => state.labResults.selectedTests.includes(key)) &&
    allCategoryKeys.every((key) =>
      state.labResults.selectedCategories.includes(key)
    )
  );
};

export const selectIsCategorySelected = (categoryKey) => (state) => {
  return state.labResults.selectedCategories.includes(categoryKey);
};

export const selectIsCategoryIndeterminate = (categoryKey) => (state) => {
  const category = state.labResults.pathologyResults.find(
    (cat) => cat.key === categoryKey
  );
  if (!category) return false;

  const categoryTestKeys = category.tests.map((test) => test.key);
  const selectedCategoryTests = categoryTestKeys.filter((key) =>
    state.labResults.selectedTests.includes(key)
  );

  return (
    selectedCategoryTests.length > 0 &&
    selectedCategoryTests.length < categoryTestKeys.length
  );
};

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

      // Call the update API
      const result = await dispatch(
        updatePathologyResults({
          patientId,
          admissionId,
          data: apiData,
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
