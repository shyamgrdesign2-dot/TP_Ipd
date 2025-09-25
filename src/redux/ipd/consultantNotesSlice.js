import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiConsultantNotes from "../../api/services/ipd/ApiConsultantNotes";

const initialState = {
  consultantNotes: [],
  clinicalAssessmentPlan: [],
  vitals: {},
  medication: [],
  labInvestigation: [],
  additionalRemarks: [],
  currentConsultantNote: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const getConsultantNotes = createAsyncThunk(
  "consultantNotes/getConsultantNotes",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiConsultantNotes.getConsultantNotes(data);
      if (result?.length) {
        return result;
      } else {
        return rejectWithValue("No consultant notes found");
      }
    } catch (error) {
      console.log("Error fetching consultant notes: ", error);
      return rejectWithValue(
        error.message || "Failed to fetch consultant notes"
      );
    }
  }
);

export const updateConsultantNotes = createAsyncThunk(
  "consultantNotes/updateConsultantNotes",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiConsultantNotes.updateConsultantNotes(data);
      return { result, data, _id };
    } catch (error) {
      console.log("Error updating consultant notes: ", error);
      return rejectWithValue(
        error.message || "Failed to update consultant notes"
      );
    }
  }
);

const consultantNotesSlice = createSlice({
  name: "consultantNotes",
  initialState,
  reducers: {
    setCurrentConsultantNote: (state, action) => {
      state.currentConsultantNote = action.payload;
    },
    clearConsultantNotes: (state) => {
      state.consultantNotes = [];
      state.currentConsultantNote = null;
      state.error = null;
      state.success = false;
    },
    updateConsultantNoteInList: (state, action) => {
      const { _id, updatedData } = action.payload;
      const index = state.consultantNotes.findIndex((note) => note._id === _id);
      if (index !== -1) {
        state.consultantNotes[index] = {
          ...state.consultantNotes[index],
          consultationNotes: updatedData,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    setClinicalAssessmentPlan: (state, action) => {
      state.clinicalAssessmentPlan = action.payload;
    },
    setVitals: (state, action) => {
      state.vitals = action.payload;
    },
    setMedication: (state, action) => {
      state.medication = action.payload;
    },
    setLabInvestigation: (state, action) => {
      state.labInvestigation = action.payload;
    },
    setAdditionalRemarks: (state, action) => {
      state.additionalRemarks = action.payload;
    },
    resetConsultantNotes: (state) => {
      state.clinicalAssessmentPlan = [];
      state.vitals = {};
      state.medication = [];
      state.labInvestigation = [];
      state.additionalRemarks = [];
      state.currentConsultantNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get consultant notes
      .addCase(getConsultantNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConsultantNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.consultantNotes = action.payload;
        state.error = null;
      })
      .addCase(getConsultantNotes.rejected, (state, action) => {
        state.loading = false;
        state.consultantNotes = [];
        state.error = action.payload;
      })
      // Update consultant notes
      .addCase(updateConsultantNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateConsultantNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        // Update the specific note in the list
        const { _id, data } = action.payload;
        const index = state.consultantNotes.findIndex(
          (note) => note._id === _id
        );
        if (index !== -1) {
          state.consultantNotes[index] = {
            ...state.consultantNotes[index],
            consultationNotes: data,
            updatedAt: new Date().toISOString(),
          };
        }

        // Update current note if it's the same one
        if (
          state.currentConsultantNote &&
          state.currentConsultantNote._id === _id
        ) {
          state.currentConsultantNote = {
            ...state.currentConsultantNote,
            consultationNotes: data,
            updatedAt: new Date().toISOString(),
          };
        }
      })
      .addCase(updateConsultantNotes.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentConsultantNote,
  clearConsultantNotes,
  updateConsultantNoteInList,
  setClinicalAssessmentPlan,
  setVitals,
  setMedication,
  setLabInvestigation,
  setAdditionalRemarks,
  resetConsultantNotes,
} = consultantNotesSlice.actions;

export default consultantNotesSlice.reducer;
