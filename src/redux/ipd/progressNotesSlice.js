import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiProgressNotes from "../../api/services/ipd/ApiProgressNotes";

const initialState = {
  progressNotes: {},
  filteredProgressNotes: [], // New array for filtered results
  lastPrescriptionDate: null,
  lastPrescriptionDataForProgress: {},
  chiefComplaint: [],
  findings: [],
  vitals: {},
  additionalRemarks: [],
  currentProgressNote: null,
  loading: false,
  error: null,
  success: false,
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
      console.log("Error fetching progress notes: ", error);
      return rejectWithValue(
        error.message || "Failed to fetch progress notes"
      );
    }
  }
);

export const updateProgressNotes = createAsyncThunk(
  "progressNotes/updateProgressNotes",
  async ({ patientId, admissionId, _id, data }, { rejectWithValue }) => {

    console.log({ patientId, admissionId, _id, data },"{ patientId, admissionId, _id, data }")
    try {
      const result = await ApiProgressNotes.updateProgressNotes({
        patientId,
        admissionId,
        _id,
        data,
      });
      return { result, data, _id };
    } catch (error) {
      console.log("Error updating progress notes: ", error);
      return rejectWithValue(
        error.message || "Failed to update progress notes"
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
      state.currentProgressNote = null;
      state.error = null;
      state.success = false;
    },
    // New action to filter progress notes by date range
    filterProgressNotesByDateRange: (state, action) => {
      const { startDate, endDate } = action.payload;
      
      if (!startDate || !endDate) {
        // If no date range, clear filtered array
        state.filteredProgressNotes = [];
        return;
      }
      
      if (!Array.isArray(state.progressNotes)) {
        state.filteredProgressNotes = [];
        return;
      }
      
      // Filter progress notes by date range
      state.filteredProgressNotes = state.progressNotes.filter((entry) => {
        const pn = entry?.progressNotes || {};
        const dateIso = pn?.date ? new Date(pn.date) : null;
        
        if (!dateIso) return false;
        
        const formattedDate = `${dateIso.getFullYear()}-${String(dateIso.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(dateIso.getDate()).padStart(2, "0")}`;
        
        return formattedDate >= startDate && formattedDate <= endDate;
      });
    },
    // Clear date filter
    clearDateFilter: (state) => {
      state.filteredProgressNotes = [];
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
        state.error = null;
      })
      .addCase(getProgressNotes.rejected, (state, action) => {
        state.progressNotes = {};
        state.filteredProgressNotes = []; // Clear filtered array on error
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload;
      })
      .addCase(updateProgressNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProgressNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.progressNotes = action.payload;
        state.error = null;
      })
      .addCase(updateProgressNotes.rejected, (state, action) => {
        state.loading = false;
        state.progressNotes = [];
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProgressNote,
  lastPrescriptionDate,
  lastPrescriptionDataForProgress,
  clearProgressNotes,
  filterProgressNotesByDateRange, // New action
  clearDateFilter, // New action
  setChiefComplaint,
  setFindings,
  setVitals,
  setAdditionalRemarks,
  resetProgressNotes
} = progressNotesSlice.actions;
export default progressNotesSlice.reducer;
