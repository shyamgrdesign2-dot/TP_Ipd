import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiProgressNotes from "../../api/services/ipd/ApiProgressNotes";

const initialState = {
  progressNotes: {},
  filteredProgressNotes: [], // New array for filtered results
  currentFilterRange: null,
  chiefComplaint: [],
  findings: [],
  vitals: {},
  additionalRemarks: [],
  currentProgressNote: null,
  loading: false,
  isUpdating: false,
  error: null,
  success: false,
  physicalExaminationBasicData: {},
  isFetched: false
};

export const getProgressNotes = createAsyncThunk(
  "progressNotes/getProgressNotes",
  async ({ patientId, admissionId, filterStartDate, filterEndDate }, { rejectWithValue }) => {
    try {
      const result = await ApiProgressNotes.getProgressNotes({
        patientId,
        admissionId,
        filterStartDate,
        filterEndDate,
      });
      if (result?.length) {
        return result;
      } else {
        return rejectWithValue("No Progress notes found");
      }
    } catch (error) {
      console.error("Error fetching progress notes: ", error);
      return rejectWithValue(
        error.message || "Failed to fetch progress notes"
      );
    }
  }
);

export const updateProgressNotes = createAsyncThunk(
  "progressNotes/updateProgressNotes",
  async ({ patientId, admissionId, _id, data }, { rejectWithValue }) => {

    try {
      const result = await ApiProgressNotes.updateProgressNotes({
        patientId,
        admissionId,
        _id,
        data,
      });
      return { result, data, _id };
    } catch (error) {
      console.error("Error updating progress notes: ", error);
      return rejectWithValue(
        error.message || "Failed to update progress notes"
      );
    }
  }
);

export const filterProgressNotesByDateRange = createAsyncThunk(
  "progressNotes/filterProgressNotesByDateRange",
  async ({ patientId, admissionId, filterStartDate, filterEndDate }, { rejectWithValue }) => {
    try {
      const result = await ApiProgressNotes.getProgressNotes({
        patientId,
        admissionId,
        filterStartDate,
        filterEndDate,
      });
      if (result?.length) {
        return result;
      } else {
        return rejectWithValue("No Progress notes found for the selected date range");
      }
    } catch (error) {
      console.error("Error fetching filtered progress notes: ", error);
      return rejectWithValue(
        error.message || "Failed to fetch filtered progress notes"
      );
    }
  }
);

const progressNotesSlice = createSlice({
  name: "progressNotes",
  initialState,
  reducers: {
    setCurrentProgressNote: (state, action) => {
      state.currentProgressNote = action.payload;
    },
    clearProgressNotes: (state) => {
      state.progressNotes = [];
      state.filteredProgressNotes = []; // Clear filtered array too
      state.currentFilterRange = null;
      state.currentProgressNote = null;
      state.error = null;
      state.success = false;
    },
    // Clear date filter
    clearDateFilter: (state) => {
      state.filteredProgressNotes = [];
      state.currentFilterRange = null;
    },
    setChiefComplaint: (state, action) => {
      state.chiefComplaint = action.payload;
    },
    setFindings: (state, action) => {
      state.findings = action.payload;
    },
    setVitals: (state, action) => {
      state.vitals = action.payload;
    },
    setPhysicalExaminationBasicData: (state, action) => {
      state.physicalExaminationBasicData = action.payload;
    },
    setAdditionalRemarks: (state, action) => {
      state.additionalRemarks = action.payload;
    },
    resetProgressNotes: (state) => {
      // state.clinicalAssessmentPlan = [];
      state.chiefComplaint= [];
      state.findings = [];
      state.vitals = {};
      state.additionalRemarks = [];
      state.currentProgressNote = null;
      state.physicalExaminationBasicData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProgressNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgressNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.progressNotes = action.payload;
        state.isFetched = true;
        state.filteredProgressNotes = []; // Clear filtered array when new data is fetched
        state.currentFilterRange = null;
        state.error = null;
      })
      .addCase(getProgressNotes.rejected, (state, action) => {
        state.progressNotes = {};
        state.filteredProgressNotes = []; // Clear filtered array on error
        state.loading = false;
        state.isFetched = true;
        state.currentFilterRange = null;
        state.error = action.payload;
      })
      .addCase(updateProgressNotes.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProgressNotes.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.progressNotes = action.payload;
        state.error = null;
      })
      .addCase(updateProgressNotes.rejected, (state, action) => {
        state.isUpdating = false;
        state.progressNotes = [];
        state.error = action.payload;
      })
      .addCase(filterProgressNotesByDateRange.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const { filterStartDate, filterEndDate } = action.meta.arg || {};
        if (filterStartDate && filterEndDate) {
          state.currentFilterRange = {
            startDate: filterStartDate,
            endDate: filterEndDate,
          };
        } else {
          state.currentFilterRange = null;
        }
      })
      .addCase(filterProgressNotesByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProgressNotes = action.payload;
        state.error = null;
      })
      .addCase(filterProgressNotesByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.filteredProgressNotes = [];
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProgressNote,
  clearProgressNotes,
  clearDateFilter, // New action
  setChiefComplaint,
  setFindings,
  setVitals,
  setAdditionalRemarks,
  setPhysicalExaminationBasicData,
  resetProgressNotes
} = progressNotesSlice.actions;
export default progressNotesSlice.reducer;
