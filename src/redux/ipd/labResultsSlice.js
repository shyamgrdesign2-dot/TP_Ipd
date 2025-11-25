import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiLabResults from "../../api/services/ipd/ApiLabResults";
import { ictAuthToken } from "../appointmentsSlice";
import { PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN } from "../../utils/constants";
import { isZydus } from "../../utils/utils";
import moment from "moment";

export const getPathologyResults = createAsyncThunk(
  "labResults/getPathologyResults",
  async (data, { dispatch }) => {
    try {
      let result = {};
      const apiMethod = isZydus()
        ? ApiLabResults.getZydusLabResults
        : ApiLabResults.getPathologyResults;

      result = await apiMethod(data);

      if (!result.error) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
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
      const apiMethod = isZydus()
        ? ApiLabResults.getZydusRadiologyOrders
        : ApiLabResults.getScanResults;

      result = await apiMethod(data);

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

const parseReferenceRange = (refRangeString) => {
  if (!refRangeString || refRangeString === "-" || refRangeString === "") {
    return { min: null, max: null };
  }

  const rangeMatch = refRangeString.match(/^([\d.]+)\s*-\s*([\d.]+)$/);

  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
    };
  }

  return { min: null, max: null };
};

const transformNewApiDataToComponentFormat = (apiResponse) => {
  if (!Array.isArray(apiResponse) || apiResponse.length === 0) return [];

  const groupedByService = apiResponse.reduce((acc, item) => {
    if (!acc[item.serviceCode]) acc[item.serviceCode] = [];
    acc[item.serviceCode].push(item);
    return acc;
  }, {});

  return Object.entries(groupedByService).map(
    ([serviceCode, labResults], groupIndex) => {
      const testsMap = new Map();

      labResults.forEach((labResult, resultIndex) => {
        const params = labResult.labResultParameters;

        if (params?.length > 0) {
          params.forEach((param, paramIndex) => {
            const testName = param.parameterName;

            if (!testsMap.has(testName)) {
              testsMap.set(testName, {
                key: `${groupIndex + 1}-${resultIndex + 1}-${paramIndex + 1}`,
                name: testName,
                values: {},
                refRange: parseReferenceRange(param.referenceRange),
                selected: false,
                sampleId: labResult.sampleId,
                labResultId: labResult.labResultId,
                labResultParameterId: param.labResultParameterId,
              });
            }

            testsMap.get(testName).values[labResult.certifiedDate] = {
              value: param.resultValue ?? "-",
            };
          });
        } else {
          const testName = labResult.serviceName;

          if (!testsMap.has(testName)) {
            testsMap.set(testName, {
              key: `${groupIndex + 1}-${resultIndex + 1}`,
              name: testName,
              values: {},
              refRange: parseReferenceRange(labResult.referenceRange),
              selected: false,
              sampleId: labResult.sampleId,
              labResultId: labResult.labResultId,
            });
          }

          testsMap.get(testName).values[labResult.certifiedDate] = {
            value: labResult.resultvalue ?? "-",
          };
        }
      });

      return {
        key: String(groupIndex + 1),
        serviceCode,
        category: labResults[0].serviceName,
        tests: Array.from(testsMap.values()),
      };
    }
  );
};

const transformApiDataToComponentFormat = (apiResponse) => {
  if (Array.isArray(apiResponse)) {
    return transformNewApiDataToComponentFormat(apiResponse);
  }

  if (
    !apiResponse ||
    !apiResponse.labParams ||
    !Array.isArray(apiResponse.labParams)
  )
    return [];

  return apiResponse.labParams.map((category, index) => ({
    key: (index + 1).toString(),
    category: `${category.reportName} ${index} (${category.testCount})`,
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

const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(",", ",");
};

const transformComponentDataToApiFormat = (
  componentData,
  selectedTests,
  selectedCategories
) => {
  const result = [];

  componentData.forEach((category) => {
    const isCategorySelected = selectedCategories.includes(category.key);
    const selectedTestsInCategory = category.tests.filter((test) =>
      selectedTests.includes(test.key)
    );

    if (isCategorySelected || selectedTestsInCategory.length > 0) {
      const testsToInclude = isCategorySelected
        ? category.tests
        : selectedTestsInCategory;

      const categoryData = {
        reportName: category.category.split(" (")[0],
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

const transformValuesBackToApi = (values) => {
  const transformed = {};

  Object.entries(values || {}).forEach(([displayDate, data]) => {
    const apiDate = convertDisplayDateToApiFormat(displayDate);
    const [value, unit] = data.value.split(" ");

    transformed[apiDate] = {
      value: parseFloat(value) || 0,
      unit: unit || "",
    };
  });

  return transformed;
};

const convertDisplayDateToApiFormat = (displayDate) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(displayDate)) {
    const [day, month, year] = displayDate.split("-");
    return `${year}-${month}-${day}`;
  }

  const date = new Date(displayDate);
  return date.toISOString().split("T")[0];
};

const computeSelectionsFromAddedData = (addedData, pathologyResults) => {
  const selectedTests = [];
  const selectedCategories = [];

  if (!Array.isArray(addedData) || !Array.isArray(pathologyResults)) {
    return { selectedTests, selectedCategories };
  }

  const byReportName = {};
  pathologyResults.forEach((cat) => {
    const onlyName = cat.category.split(" (")[0]?.trim();
    if (onlyName) byReportName[onlyName] = cat;
  });

  addedData.forEach((report) => {
    const cat = byReportName[(report.reportName || "").trim()];
    if (!cat) return;

    const wantedNames = (report.tests || []).map((t) =>
      (t.testName || "").trim().toLowerCase()
    );

    const pickedKeys = cat.tests
      .filter((t) => wantedNames.includes((t.name || "").trim().toLowerCase()))
      .map((t) => t.key);

    selectedTests.push(...pickedKeys);

    if (pickedKeys.length && pickedKeys.length === cat.tests.length) {
      selectedCategories.push(cat.key);
    }
  });

  return {
    selectedTests: selectedTests,
    selectedCategories: selectedCategories,
  };
};

const mapZydusScanResults = (data, um_id) =>
  data.map((e) => ({
    id: e.orderId,
    category_id: -3,
    name: `${e.serviceName}-${e.orderStatus}`,
    display_name: `${e.serviceName}-${e.orderStatus}`,
    url: null,
    um_id: um_id,
    thumbnail_url: "",
    created_date: moment(e.orderConformedDate).format("YYYY-MM-DD"),
    investigation_date: moment(e.orderConformedDate).format("YYYY-MM-DD"),
    notes: "",
  }));

const mapDefaultScanResults = (data) =>
  data.map(({ docs, _id, createdAt }) => ({
    id: _id,
    category_id: docs.subCategory,
    url: docs?.fileUrl,
    thumbnail_url: docs?.fileUrl,
    investigation_date: createdAt,
    category: docs?.subCategory,
    display_name: docs?.filename,
    notes: "",
  }));

export const loadAddedSelections = createAsyncThunk(
  "labResults/loadAddedSelections",
  async ({ patientId, admissionId }, { dispatch, getState }) => {
    const added = await dispatch(
      getAddedToDischargeSummaryTests({ patientId, admissionId })
    ).unwrap();

    const normalized =
      (added || []).map((grp) => ({
        reportName: grp?.reportName,
        tests: (grp?.tests || []).map((t) => ({ testName: t?.testName })),
      })) || [];

    const state = getState();
    const pathologyResults = state?.labResults?.pathologyResults || [];

    return computeSelectionsFromAddedData(normalized, pathologyResults);
  }
);
const initialState = {
  pathologyResults: [],
  scanResults: [],
  availableDates: [],

  loading: false,
  updating: false,
  error: null,
  updateError: null,

  selectedTests: [],
  selectedCategories: [],

  searchText: "",
  selectedDateRange: null,
  activeTab: "pathology",
  expandedCategories: ["1"],

  scanLoading: false,
  scanError: null,
  activeScanCategory: "all",
  scanDateStatus: "closed",
};

const labResultsSlice = createSlice({
  name: "labResults",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },

    setSelections: (state, action) => {
      state.selectedTests = action.payload?.selectedTests || [];
      state.selectedCategories = action.payload?.selectedCategories || [];
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

    selectCategoryWithTests: (state, action) => {
      const { categoryKey, testKeys } = action.payload;

      if (!state.selectedCategories.includes(categoryKey)) {
        state.selectedCategories.push(categoryKey);
      }

      testKeys.forEach((testKey) => {
        if (!state.selectedTests.includes(testKey)) {
          state.selectedTests.push(testKey);
        }
      });
    },

    deselectCategoryWithTests: (state, action) => {
      const { categoryKey, testKeys } = action.payload;

      state.selectedCategories = state.selectedCategories.filter(
        (key) => key !== categoryKey
      );

      state.selectedTests = state.selectedTests.filter(
        (key) => !testKeys.includes(key)
      );
    },

    setActiveScanCategory: (state, action) => {
      state.activeScanCategory = action.payload;
    },

    setScanDateStatus: (state, action) => {
      state.scanDateStatus = action.payload;
    },

    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.scanError = null;
    },
  },

  extraReducers: (builder) => {
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

        const dates = new Set();

        if (Array.isArray(action.payload)) {
          action.payload.forEach((labResult) => {
            if (labResult.certifiedDate) {
              dates.add(labResult.certifiedDate);
            }
          });
        } else {
          if (
            action.payload?.testDates &&
            Array.isArray(action.payload.testDates)
          ) {
            action.payload.testDates.forEach((date) => {
              dates.add(formatDateForDisplay(date));
            });
          } else {
            action.payload?.labParams?.forEach((category) => {
              category.tests?.forEach((test) => {
                Object.keys(test.values || {}).forEach((date) => {
                  dates.add(formatDateForDisplay(date));
                });
              });
            });
          }
        }

        state.availableDates = Array.from(dates).sort(
          (a, b) => new Date(b) - new Date(a)
        );
      })
      .addCase(getPathologyResults.rejected, (state, action) => {
        state.loading = false;
      });

    builder.addCase(loadAddedSelections.fulfilled, (state, action) => {
      state.selectedTests = action.payload?.selectedTests || [];
      state.selectedCategories = action.payload?.selectedCategories || [];
    });

    builder
      .addCase(updatePathologyResults.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePathologyResults.fulfilled, (state, action) => {
        state.updating = false;

        state.selectedTests = [];
        state.selectedCategories = [];
      })
      .addCase(updatePathologyResults.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          action.payload?.message || "Failed to update pathology results";
      });

    builder
      .addCase(getScanResults.pending, (state) => {
        state.scanLoading = true;
        state.scanError = null;
      })
      .addCase(getScanResults.fulfilled, (state, action) => {
        state.scanLoading = false;

        state.scanResults = isZydus()
          ? mapZydusScanResults(action.payload?.data, action.meta.arg?.um_id)
          : mapDefaultScanResults(action.payload);
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
  setSelections,
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

const isDateInRange = (dateStr, dateRange) => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

  let testDate;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    testDate = new Date(`${year}-${month}-${day}`);
  } else {
    testDate = new Date(dateStr);
  }

  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  testDate.setHours(0, 0, 0, 0);

  return testDate >= startDate && testDate <= endDate;
};

export const selectFilteredPathologyResults = (state) => {
  const results = state.labResults.pathologyResults;
  const searchText = state.labResults.searchText?.toLowerCase().trim() || "";
  const dateRange = state.labResults.selectedDateRange;

  if (!searchText && !dateRange) {
    return results;
  }

  return results
    .map((category) => {
      const filteredTests = category.tests.filter((test) => {
        const matchesSearch =
          !searchText ||
          test.name.toLowerCase().includes(searchText) ||
          category.category.toLowerCase().includes(searchText);

        const matchesDate =
          !dateRange ||
          Object.keys(test.values || {}).some((dateKey) =>
            isDateInRange(dateKey, dateRange)
          );

        return matchesSearch && matchesDate;
      });

      return {
        ...category,
        tests: filteredTests,
        category: `${category.category.split(" (")[0]} (${
          filteredTests.length
        })`,
      };
    })
    .filter((category) => category.tests.length > 0);
};

export const selectFilteredAvailableDates = (state) => {
  const dates = state.labResults.availableDates;
  const searchText = state.labResults.searchText?.toLowerCase().trim() || "";

  if (!searchText) {
    return dates;
  }

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

export const selectTotalSelectionCount = (state) => {
  return state.labResults.selectedTests.length;
};

export const selectTotalItemCount = (state) => {
  const filteredResults = selectFilteredPathologyResults(state);
  const testCount = filteredResults.reduce(
    (total, category) => total + category.tests.length,
    0
  );
  return testCount;
};

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

export const selectIsMainCheckboxIndeterminate = (state) => {
  const totalSelected = selectTotalSelectionCount(state);
  const totalItems = selectTotalItemCount(state);

  return totalSelected > 0 && totalSelected < totalItems;
};

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

      const apiData = transformComponentDataToApiFormat(
        pathologyResults,
        selectedTests,
        selectedCategories
      );

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
export {
  transformApiDataToComponentFormat,
  transformComponentDataToApiFormat,
  formatDateForDisplay,
};
