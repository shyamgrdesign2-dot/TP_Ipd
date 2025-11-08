import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiDischargeSummary from "../../api/services/ipd/ApiDischargeSummary";

const getCodeFromModule = (module) => {
  switch (module) {
    case "Cross Referral":
      return "CR";
    case "Consultant Notes":
      return "CN";
    case "OT Notes":
      return "OT";
    case "Progress Notes":
      return "PN";
    case "Assessment Form":
      return "AF";
    default:
      return "N/A";
  }
};

export const initialState = {
  dischargeSummaryData: {
    patientInformation: {},
    surgeriesPerformed: [],
    followUpDoctor: {},
  },
  mockValues: {},
  treatmentNotes: [],
  treatmentNotesLoading: false,
  chronologicalSummary: {},
  chronologicalSummaryLoading: false,
  loading: false,
  currentDischargeSummaryId: null,
  dischargeSummaryFormDetails: {},
  actualDischargeSummaryData: {},
};

const shallowEqualList = (a = [], b = [], keys = ["id", "name", "note"]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    for (const k of keys) {
      if ((a[i]?.[k] ?? null) !== (b[i]?.[k] ?? null)) return false;
    }
  }
  return true;
};

export const getDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/getDischargeSummaryData",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiDischargeSummary.getDischargeSummary(data);
      if (result) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message,
      });
    }
  }
);

export const addDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/addDischargeSummaryData",
  async (data) => {
    try {
      const result = await ApiDischargeSummary.addDischargeSummary(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const updateDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/updateDischargeSummaryData",
  async (data) => {
    try {
      const result = await ApiDischargeSummary.updateDischargeSummary(data);
      if (result.message === "discharge summary created successfully.") {
        return result;
      } else {
        return result?.data;
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

export const getMockValues = createAsyncThunk(
  "dischargeSummary/getMockValues",
  async (_, { rejectWithValue }) => {
    try {
      const result = await ApiDischargeSummary.getMockValues();
      if (result.data) {
        return result.data;
      } else {
        throw Error(result.error || "Failed to fetch mock values");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message || "Failed to fetch mock values",
      });
    }
  }
);

const dischargeSummarySlice = createSlice({
  name: "dischargeSummary",
  initialState,
  reducers: {
    setDischargeSummaryData: (state, action) => {
      state.dischargeSummaryData = action.payload;
    },
    setPatientCondition: (state, action) => {
      state.dischargeSummaryData.patientCondition = action.payload;
    },
    setDischargeSummaryFormDetails: (state, action) => {
      state.dischargeSummaryFormDetails = action.payload || {};
    },
    setCourseInHospital: (state, action) => {
      state.dischargeSummaryData.courseInHospital = action.payload;
    },
    setVitalsData: (state, action) => {
      state.dischargeSummaryData.vitalsData = action.payload;
    },
    setCurrentDischargeSummaryId: (state, action) => {
      state.currentDischargeSummaryId = action.payload || null;
    },
    resetDischargeSummaryForm: (state) => {
      state.dischargeSummaryFormDetails =
        initialState.dischargeSummaryFormDetails;
      state.currentDischargeSummaryId = null;
    },
    resetDischargeSummaryToInitialState: () => initialState,
    setDischargeDate: (state, action) => {
      if (!state.dischargeSummaryData?.patientInformation) {
        state.dischargeSummaryData.patientInformation = {};
      }
      state.dischargeSummaryData.patientInformation.dateOfDischarge =
        action.payload;
    },
    setProvisionalDiagnosis: (state, action) => {
      if (!state.dischargeSummaryData) {
        state.dischargeSummaryData = {};
      }
      if (!state.dischargeSummaryData.diagnosisAndSurgery) {
        state.dischargeSummaryData = {
          ...state.dischargeSummaryData,
          diagnosisAndSurgery: {},
        };
      }
      state.dischargeSummaryData.diagnosisAndSurgery = {
        ...state.dischargeSummaryData.diagnosisAndSurgery,
        provisionalDiagnosis: action.payload,
      };
    },
    resetDischargeSummaryData: (state, action) => {
      state.dischargeSummaryData = {};
    },
    setFinalDiagnosis: (state, action) => {
      if (!state.dischargeSummaryData) {
        state.dischargeSummaryData = {};
      }
      if (!state.dischargeSummaryData.diagnosisAndSurgery) {
        state.dischargeSummaryData.diagnosisAndSurgery = {};
      }
      state.dischargeSummaryData.diagnosisAndSurgery = {
        ...state.dischargeSummaryData.diagnosisAndSurgery,
        finalDiagnosis: action.payload,
      };
    },
    setDiet: (state, action) => {
      const curr = state.dischargeSummaryData.diet || [];
      const next = action.payload || [];
      if (!shallowEqualList(curr, next)) {
        state.dischargeSummaryData.diet = next;
      }
    },
    setDischargeSummaryDataViaPatch: (state, action) => {
      state.dischargeSummaryData = {
        ...state.dischargeSummaryData,
        ...action.payload,
      };
    },
    setPhysicalActivities: (state, action) => {
      const curr = state.dischargeSummaryData.physicalActivities || [];
      const next = action.payload || [];
      if (!shallowEqualList(curr, next)) {
        state.dischargeSummaryData.physicalActivities = next;
      }
    },
    setFollowUpDate: (state, action) => {
      state.dischargeSummaryData.followUpDate = action.payload;
    },
    setFollowUpDoctor: (state, action) => {
      state.dischargeSummaryData.followUpDoctor = action.payload;
    },
    setAdditionalNotes: (state, action) => {
      state.dischargeSummaryData.additionalNotes = action.payload;
    },
    setPreparedBy: (state, action) => {
      state.dischargeSummaryData.preparedBy = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setTreatmentNotes: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload : [];
      state.treatmentNotes = list.map((item, idx) => {
        if (item && item.key) return item;
        const base = item?.id ?? item?.objectID ?? item?.name ?? "row";
        return { ...item, key: `${base}-${idx}` };
      });
    },
    addTreatmentNote: (state, action) => {
      state.treatmentNotes.push(action.payload);
    },
    updateTreatmentNote: (state, action) => {
      const { key, updates } = action.payload;
      const index = state.treatmentNotes.findIndex((note) => note.key === key);
      if (index === -1) return;

      const current = state.treatmentNotes[index];

      let changed = false;
      for (const k in updates) {
        if (updates[k] !== current[k]) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state.treatmentNotes[index] = {
        ...state.treatmentNotes[index],
        ...updates,
      };
    },
    removeTreatmentNote: (state, action) => {
      const key = action.payload;
      state.treatmentNotes = state.treatmentNotes.filter(
        (note) => note.key !== key
      );
    },
    setChronologicalSummary: (state, action) => {
      state.chronologicalSummary = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setOTSurgeries: (state, action) => {
      if (!state.dischargeSummaryData) {
        state.dischargeSummaryData = {};
      }
      if (!state.dischargeSummaryData.otSurgeries) {
        state.dischargeSummaryData = {
          ...state.dischargeSummaryData,
          otSurgeries: {},
        };
      }
      state.dischargeSummaryData.otSurgeries = action.payload;
    },
    setSurgeriesPerformed: (state, action) => {
      state.dischargeSummaryData.surgeriesPerformed = Array.isArray(
        action.payload
      )
        ? action.payload
        : [];
    },
    resetActualDischargeSummaryData: (state, action) => {
      state.actualDischargeSummaryData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.actualDischargeSummaryData = action.payload;
      })
      .addCase(getDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.actualDischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(addDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(addDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.actualDischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(updateDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(updateDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(getMockValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMockValues.fulfilled, (state, action) => {
        state.loading = false;
        state.mockValues = action.payload;
      })
      .addCase(getMockValues.rejected, (state) => {
        state.mockValues = {};
        state.loading = false;
      });
  },
});

export const {
  setDischargeSummaryData,
  setPatientCondition,
  setDischargeSummaryFormDetails,
  setCurrentDischargeSummaryId,
  resetDischargeSummaryForm,
  setDischargeDate,
  setProvisionalDiagnosis,
  setFinalDiagnosis,
  setCourseInHospital,
  setVitalsData,
  setDiet,
  setPhysicalActivities,
  setDischargeSummaryDataViaPatch,
  setFollowUpDate,
  setFollowUpDoctor,
  setAdditionalNotes,
  setPreparedBy,
  setTreatmentNotes,
  addTreatmentNote,
  updateTreatmentNote,
  removeTreatmentNote,
  setChronologicalSummary,
  setSurgeriesPerformed,
  setOTSurgeries,
  resetActualDischargeSummaryData,
  resetDischargeSummaryToInitialState,
  resetDischargeSummaryData,
} = dischargeSummarySlice.actions;

export default dischargeSummarySlice.reducer;
