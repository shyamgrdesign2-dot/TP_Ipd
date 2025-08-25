import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiPrescription from "../api/services/ApiPrescription";

const initialState = {
    medicationData: [],
    pillupSwitch: true,
    labParamsData: [],

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
  },
});

export const { setMedicationData, setPillupSwitch } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
