import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import IpdService from "../../api/services/IpdService";
import { formatPatientsForTable } from "../../pages/ipd/inPatients/staticData";

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
      isDischarged = false
    },
    { rejectWithValue }
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
        isDischarged
      });

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

const initialState = {
  patients: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    hasMore: true,
  },
  filters: {
    ward: [],
    doctor: [],
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
      });
  },
});

export const { setFilterParams, incrementPage, resetPatients } =
  inPatientsSlice.actions;

export default inPatientsSlice.reducer;
