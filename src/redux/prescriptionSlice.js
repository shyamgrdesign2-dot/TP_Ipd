import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiPrescription from "../api/services/ApiPrescription";
import { getGynecDetails } from "../api/services/ApiGynec";

const initialState = {
  medicationData: [],
  pillupSwitch: true,
  labParamsData: [],
  medicalHistoryData: [],
  gynecHistoryData: null,
};

export const getLabParamsData = createAsyncThunk(
  "prescription/getLabParamsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiPrescription.getLabParamsData(data);
      if (result.data?.results?.length) {
        return result.data?.results;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const fetchGynecHistory = createAsyncThunk(
  "prescription/fetchGynecHistory",
  async ({ patientId, userId }) => {
    try {
      let result = {};
      result = await getGynecDetails(patientId, userId);
      const { createdAt, createdBy, ...updatedData } = result;
      if (updatedData) {
        return updatedData;
      } else {
        throw Error(result.error);
      }
    } catch (err) {
      console.log("error: ", err);
      throw Error(err);
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setMedicationData: (state, action) => {
      if (typeof action.payload === "function") {
        state.medicationData = action.payload(state.medicationData);
      } else {
        state.medicationData = action.payload;
      }
    },
    setPillupSwitch: (state, action) => {
      if (typeof action.payload === "function") {
        state.pillupSwitch = action.payload(state.pillupSwitch);
      } else {
        state.pillupSwitch = action.payload;
      }
    },
    setMedicalHistoryData: (state, action) => {
      if (typeof action.payload === "function") {
        state.medicalHistoryData = action.payload(state.medicalHistoryData);
      } else {
        state.medicalHistoryData = action.payload;
      }
    },
    setGynecHistoryData: (state, action) => {
      if (typeof action.payload === "function") {
        state.gynecHistoryData = action.payload(state.gynecHistoryData);
      } else {
        state.gynecHistoryData = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabParamsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabParamsData.fulfilled, (state, action) => {
        state.loading = false;
        state.labParamsData = action.payload;
      })
      .addCase(getLabParamsData.rejected, (state, action) => {
        state.labParamsData = [];
        state.loading = false;
      })
      .addCase(fetchGynecHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGynecHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.gynecHistoryData = action.payload;
      })
      .addCase(fetchGynecHistory.rejected, (state, action) => {
        state.gynecHistoryData = [];
        state.loading = false;
      });
  },
});

export const { setMedicationData, setPillupSwitch, setMedicalHistoryData, setGynecHistoryData } =
  prescriptionSlice.actions;
export default prescriptionSlice.reducer;
