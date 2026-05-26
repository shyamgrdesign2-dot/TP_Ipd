import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import IpdService from "../../api/services/IpdService";
import { fetchBillsByAdmissionIds } from "../../pages/opdBilling/service";
import { formatPatientsForTable } from "../../pages/ipd/inPatients/staticData";

// Async thunk for fetching billing status by admission IDs
export const fetchBillingByAdmissionIds = createAsyncThunk(
  "ipd/fetchBillingByAdmissionIds",
  async ({ admissionIds }, { rejectWithValue }) => {
    if (!admissionIds?.length) return { billingByAdmissionId: {}, billDataByAdmissionId: {} };
    try {
      const response = await fetchBillsByAdmissionIds(admissionIds);
      const billingByAdmissionId = {};
      const billDataByAdmissionId = {};
      (admissionIds || []).forEach((id) => {
        const bills = response?.[id]?.bills;
        const hasBill = Array.isArray(bills) && bills.length > 0;
        billingByAdmissionId[id] = hasBill ? "billed" : "unbilled";
        if (hasBill && bills[0]) {
          billDataByAdmissionId[id] = bills[0];
        }
      });
      return { admissionIds, billingByAdmissionId, billDataByAdmissionId };
    } catch (error) {
      console.log("API failed for billing by admission IDs", error);
      const billingByAdmissionId = {};
      (admissionIds || []).forEach((id) => {
        billingByAdmissionId[id] = "unbilled";
      });
      return { admissionIds, billingByAdmissionId, billDataByAdmissionId: {} };
    }
  }
);

// Async thunk for fetching patients
export const fetchPatients = createAsyncThunk(
  "ipd/fetchPatients",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      ward = "",
      patientId = "",
      startDate = "",
      endDate = "",
      doctorIdsFilter = "",
      sort = "admittedOn:desc",
      isDischarged = false,
      sentForApproval = false,
      isIntimateDischarged = false,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await IpdService.getPatients({
        page,
        limit,
        search,
        ward,
        patientId,
        startDate,
        endDate,
        doctorIdsFilter,
        sort,
        isDischarged,
        sentForApproval,
        isIntimateDischarged,
      });

      // Extract admission IDs and fetch billing status (render admissions first, then merge billing)
      const patients = response?.patients || [];
      const admissionIds = patients
        .map((p) => p.admissionId || p.admission_id)
        .filter(Boolean);
      if (admissionIds.length > 0) {
        dispatch(fetchBillingByAdmissionIds({ admissionIds }));
      }

      return response;
    } catch (error) {
      console.log("API failed for patients", error);
      // Return a properly structured response for static data
      return {
        patients: [],
        pagination: {
          page: page,
          limit: limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }
);

// Async thunk for fetching filters
export const fetchFilters = createAsyncThunk(
  "ipd/fetchFilters",
  async ({ field, search }, { rejectWithValue }) => {
    try {
      const response = await IpdService.getFilters({
        field,
        search
      });

      return { field, data: response };
    } catch (error) {
      console.log(`API failed for ${field} filters`, error);
    }
  }
);

export const fetchActivityLogs = createAsyncThunk(
  "ipd/fetchActivityLogs",
  async ({ admissionId }, { rejectWithValue }) => {
    try {
      const response = await IpdService.getActivityLogs(admissionId);
      return response;
    } catch (error) {
      console.log("API failed for activity logs", error);
      return rejectWithValue(error?.response?.data || "Failed to fetch logs");
    }
  }
);

const initialState = {
  patients: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    hasMore: true,
  },
  billingByAdmissionId: {},
  billDataByAdmissionId: {},
  billingLoading: false,
  filters: {
    ward: [],
    doctor: [],
    loading: false,
    error: null,
  },
  activityLogs: {
    data: [],
    loading: false,
    error: null,
  },
  filterParams: {
    page: 1,
    limit: 10,
    search: "",
    ward: "",
    patientId: "",
    startDate: "",
    endDate: "",
    doctorIdsFilter: "",
    sort: "admittedOn:desc",
  },
};

const inPatientsSlice = createSlice({
  name: "ipd",
  initialState,
  reducers: {
    setFilterParams: (state, action) => {
      state.filterParams = {
        ...state.filterParams,
        ...action.payload,
        page: 1, // Reset page when filters change
      };
    },
    incrementPage: (state) => {
      state.filterParams.page += 1;
    },
    resetPatients: (state) => {
      state.patients.data = [];
      state.patients.total = 0;
      state.patients.hasMore = true;
      state.filterParams.page = 1;
      state.billingByAdmissionId = {};
      state.billDataByAdmissionId = {};
    },
    updateBillDataForAdmission: (state, action) => {
      const { admissionId, billData } = action.payload || {};
      if (admissionId && billData) {
        state.billDataByAdmissionId[admissionId] = billData;
        state.billingByAdmissionId[admissionId] = "billed";
      }
    },
    updatePatientInList: (state, action) => {
      const { patientId, updates = {}, patientDataUpdates = {} } =
        action.payload || {};
      const idx = state.patients.data.findIndex((p) => p.id === patientId);
      if (idx !== -1) {
        const existing = state.patients.data[idx] || {};
        const updatedPatientData = {
          ...(existing.patientData || {}),
          ...patientDataUpdates,
        };
        state.patients.data[idx] = {
          ...existing,
          ...updates,
          patientData: updatedPatientData,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.patients.loading = true;
        state.patients.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        const { patients, pagination } = action.payload;
        const formattedPatients = formatPatientsForTable(patients || []);

        // If it's the first page, replace data; otherwise, append
        if (state.filterParams.page === 1) {
          state.patients.data = formattedPatients;
        } else {
          // Make sure we're actually appending data and not duplicating
          if (formattedPatients && formattedPatients.length > 0) {
            state.patients.data = [
              ...state.patients.data,
              ...formattedPatients,
            ];
          }
        }

        // Update pagination info
        state.patients.total = pagination?.total || 0;
        state.patients.loading = false;

        // Check if there's more data to load
        state.patients.hasMore =
          formattedPatients?.length > 0 &&
          pagination?.total &&
          state.patients.data?.length < pagination.total;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.patients.loading = false;
        state.patients.error = action.payload || "Failed to fetch patients";
      })

      // Handle fetchBillingByAdmissionIds
      .addCase(fetchBillingByAdmissionIds.pending, (state) => {
        state.billingLoading = true;
      })
      .addCase(fetchBillingByAdmissionIds.fulfilled, (state, action) => {
        const { billingByAdmissionId, billDataByAdmissionId } = action.payload || {};
        if (billingByAdmissionId && typeof billingByAdmissionId === "object") {
          state.billingByAdmissionId = {
            ...state.billingByAdmissionId,
            ...billingByAdmissionId,
          };
        }
        if (billDataByAdmissionId && typeof billDataByAdmissionId === "object") {
          state.billDataByAdmissionId = {
            ...state.billDataByAdmissionId,
            ...billDataByAdmissionId,
          };
        }
        state.billingLoading = false;
      })
      .addCase(fetchBillingByAdmissionIds.rejected, (state) => {
        state.billingLoading = false;
      })

      // Handle fetchFilters
      .addCase(fetchFilters.pending, (state) => {
        state.filters.loading = true;
        state.filters.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        const { field, data } = action.payload || {};
        state.filters[field] = data;
        state.filters.loading = false;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.filters.loading = false;
        state.filters.error = action.payload || "Failed to fetch filters";
      })

      // Handle fetchActivityLogs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.activityLogs.loading = true;
        state.activityLogs.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs.data = action.payload || [];
        state.activityLogs.loading = false;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityLogs.loading = false;
        state.activityLogs.error = action.payload || "Failed to fetch logs";
      });
  },
});

export const { setFilterParams, incrementPage, resetPatients, updateBillDataForAdmission } =
  inPatientsSlice.actions;
export const { updatePatientInList } = inPatientsSlice.actions;

export default inPatientsSlice.reducer;
