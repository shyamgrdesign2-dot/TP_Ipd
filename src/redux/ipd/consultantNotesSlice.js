import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiConsultantNotes from "../../api/services/ipd/ApiConsultantNotes";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const initialState = {
  consultantNotes: [],
  filteredConsultantNotes: [],
  clinicalAssessmentPlan: [],
  vitals: {},
  fluidBalance: {},
  examination: {},
  medication: [],
  labInvestigation: [],
  additionalRemarks: [],
  currentConsultantNote: null,
  loading: false,
  isUpdating: false,
  error: null,
  success: false,
};

// Async thunks
export const getConsultantNotes = createAsyncThunk(
  "consultantNotes/getConsultantNotes",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiConsultantNotes.getConsultantNotes(data);
      const notes = Array.isArray(result) ? result : [];
      const isFiltered = !!data.filterStartDate || !!data.filterEndDate;
      return { notes, isFiltered };
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
      return { result, data, _id: data?._id };
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
      state.filteredConsultantNotes = [];
      state.currentConsultantNote = null;
      state.error = null;
      state.success = false;
    },
    clearFilteredConsultantNotes: (state) => {
      state.filteredConsultantNotes = [];
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
    setFluidBalance: (state, action) => {
      state.fluidBalance = action.payload;
    },
    setExamination: (state, action) => {
      state.examination = action.payload;
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
      state.fluidBalance = {};
      state.examination = {};
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

        const payload = action.payload;
        const isFiltered = payload?.isFiltered || false;
        const notes = Array.isArray(payload?.notes)
          ? payload.notes
          : Array.isArray(payload)
          ? payload
          : [];
        const sorted = [...notes].sort((a, b) => {
          const ad = a?.consultationNotes || {};
          const bd = b?.consultationNotes || {};
          const aDT = dayjs(
            `${ad.date || ""} ${ad.time || ""}`.trim(),
            "YYYY-MM-DD HH:mm:ss",
            true
          );
          const bDT = dayjs(
            `${bd.date || ""} ${bd.time || ""}`.trim(),
            "YYYY-MM-DD HH:mm:ss",
            true
          );

          if (aDT.isValid() && bDT.isValid()) {
            return bDT.valueOf() - aDT.valueOf();
          }

          const aCreated = dayjs(a?.createdAt);
          const bCreated = dayjs(b?.createdAt);
          return bCreated.valueOf() - aCreated.valueOf(); // descending
        });

        if (isFiltered) {
          state.filteredConsultantNotes = sorted;
        } else {
          state.consultantNotes = sorted;
          state.filteredConsultantNotes = [];
        }
        state.error = null;
      })
      .addCase(getConsultantNotes.rejected, (state, action) => {
        state.loading = false;
        state.consultantNotes = [];
        state.filteredConsultantNotes = [];
        state.error = action.payload;
      })
      // Update consultant notes
      .addCase(updateConsultantNotes.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateConsultantNotes.fulfilled, (state, action) => {
        state.success = true;
        state.isUpdating = false;
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
      })
      .addCase(updateConsultantNotes.rejected, (state, action) => {
        state.isUpdating = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentConsultantNote,
  clearConsultantNotes,
  clearFilteredConsultantNotes,
  updateConsultantNoteInList,
  setClinicalAssessmentPlan,
  setVitals,
  setMedication,
  setLabInvestigation,
  setAdditionalRemarks,
  resetConsultantNotes,
  setFluidBalance,
  setExamination,
} = consultantNotesSlice.actions;

export default consultantNotesSlice.reducer;
