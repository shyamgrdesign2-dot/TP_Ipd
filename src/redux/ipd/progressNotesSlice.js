import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiProgressNotes from "../../api/services/ipd/ApiProgressNotes";

const initialState = {
  progressNotes: {},
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
};

export const getProgressNotes = createAsyncThunk(
  "progressNotes/getProgressNotes",
  async ({ patientId, admissionId }, { rejectWithValue }) => {
    try {
      const result = await ApiProgressNotes.getProgressNotes({
        patientId,
        admissionId,
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
      state.currentProgressNote = null;
      state.error = null;
      state.success = false;
    },
    // updateProgressNotes: (state, action) => {
    //   const { _id, updatedData } = action.payload;
    //   const index = state.progressNotes.findIndex((note) => note._id === _id);
    //   if (index !== -1) {
    //     state.progressNotes[index] = {
    //       ...state.progressNotes[index],
    //       progressNotes: updatedData,
    //       updatedAt: new Date().toISOString(),
    //     };
    //   }
    // },
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
        state.error = null;
      })
      .addCase(getProgressNotes.rejected, (state, action) => {
        state.progressNotes = {};
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(addProgressNotes.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(addProgressNotesData.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.progressNotes = action.payload;
      // })
      // .addCase(addProgressNotesData.rejected, (state, action) => {
      //   state.progressNotes = [];
      //   state.loading = false;
      // })
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
  setChiefComplaint,
  setFindings,
  setVitals,
  setAdditionalRemarks,
  resetProgressNotes
} = progressNotesSlice.actions;
export default progressNotesSlice.reducer;
