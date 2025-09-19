import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiOtNotes from "../../api/services/ipd/ApiOtNotes";
import ApiSurgical from "../../api/services/ApiSurgical";

const initialState = {
  otNotesData: {},
  loading: false,

  surgeryDetails: {
    surgeryProcedureName: "",
    surgeryName: "",
    anaesthesiaType: "",
    surgeryDate: "",
    surgeryStartTime: "",
    surgeryEndTime: "",
    diagnosis: null,
  },
  surgeryTeam: {
    primarySurgeon: {},
    secondarySurgeon: {},
    assistant: {},
    anaesthesiologist: {},
    scrubNurse: {},
    floorCirculatingNurse: {},
  },
  operativeNotes: {},
  intraOperativeNotes: {},
  surgeryProcedureOptions: [],
  surgeryProcedureOptionsLoading: false,
};

export const searchSurgeryProcedures = createAsyncThunk(
  "otNotes/searchSurgeryProcedures",
  async (query) => {
    try {
      const result = await ApiSurgical.searchExamination(query || "");

      return Array.isArray(result) ? result : [];
    } catch (error) {
      throw Error(error);
    }
  }
);

export const getOtNotesData = createAsyncThunk(
  "otNotes/getOtNotesData",
  async (data, {rejectWithValue}) => {
    try {
      let result = {};
      result = await ApiOtNotes.getOtNotesData(data);
      if (result?.otNotes) {
        return result?.otNotes;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({ visible: false, message: error.response.data.message });
    }
  }
);
export const addOtNotesData = createAsyncThunk(
  "otNotes/addOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.addOtNotesData(data);
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
export const updateOtNotesData = createAsyncThunk(
  "otNotes/updateOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.updateOtNotesData(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

const otNotesSlice = createSlice({
  name: "otNotes",
  initialState,
  reducers: {
    setOtNotesData: (state, action) => {
      state.otNotesData = action.payload;
    },
    setSurgeryProcedureName: (state, action) => {
      state.surgeryDetails.surgeryProcedureName = action.payload || "";
      state.surgeryDetails.surgeryName = action.payload || "";
    },
    setAnaesthesiaType: (state, action) => {
      state.surgeryDetails.anaesthesiaType = action.payload || "";
    },
    setSurgeryDate: (state, action) => {
      state.surgeryDetails.surgeryDate = action.payload || "";
    },
    setSurgeryStartTime: (state, action) => {
      state.surgeryDetails.surgeryStartTime = action.payload || "";
    },
    setSurgeryEndTime: (state, action) => {
      state.surgeryDetails.surgeryEndTime = action.payload || "";
    },
    setDiagnosis: (state, action) => {
      state.surgeryDetails.diagnosis = action.payload || null;
    },
    setSurgeryTeam: (state, action) => {
      state.surgeryTeam[action.payload.roleId] = action.payload.value || {};
    },
    setOperativeNotes: (state, action) => {
      state.operativeNotes[action.payload.key] = action.payload.value || "";
    },
    setIntraOperativeNotes: (state, action) => {
      state.intraOperativeNotes[action.payload.key] = action.payload.value || "";
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(searchSurgeryProcedures.pending, (state) => {
        state.surgeryProcedureOptionsLoading = true;
      })
      .addCase(searchSurgeryProcedures.fulfilled, (state, action) => {
        state.surgeryProcedureOptionsLoading = false;
        state.surgeryProcedureOptions = action.payload || [];
      })
      .addCase(searchSurgeryProcedures.rejected, (state) => {
        state.surgeryProcedureOptionsLoading = false;
        state.surgeryProcedureOptions = [];
      })
      .addCase(getOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(getOtNotesData.rejected, (state, action) => {
        state.otNotesData = {};
        state.loading = false;
      })
      .addCase(addOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(addOtNotesData.rejected, (state, action) => {
        state.otNotesData = [];
        state.loading = false;
      })
      .addCase(updateOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(updateOtNotesData.rejected, (state, action) => {
        state.otNotesData = [];
        state.loading = false;
      });
  },
});

export const {
  setOtNotesData,
  setSurgeryProcedureName,
  setAnaesthesiaType,
  setSurgeryDate,
  setSurgeryStartTime,
  setSurgeryEndTime,
  setDiagnosis,
  setSurgeryTeam,
  setOperativeNotes,
  setIntraOperativeNotes
} = otNotesSlice.actions;
export default otNotesSlice.reducer;
