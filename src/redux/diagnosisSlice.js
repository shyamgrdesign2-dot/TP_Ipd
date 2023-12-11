import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";

const initialState = {
  diagnosis: [],
  templates: [],
  loading: false,
  error: null,
};

export const getDiagnosisTemplates = createAsyncThunk(
  "diagnosis/getDiagnosisTemplates",
  async () => {
    let result = {};
    result = await ApiAppointments.getDiagnosisTemplates();
    console.log("results: ", result);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchDiagnosis = createAsyncThunk(
  "diagnosis/searchDiagnosis",
  async (query) => {
    let result = {};
    result = await ApiAppointments.searchDiagnosis(query);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const clearDiagnosisSearch = createAsyncThunk("diagnosis/clearDiagnosisSearch", async () => {
  return null;
});

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(searchDiagnosis.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchDiagnosis.fulfilled, (state, action) => {
        state.error = null;
        console.log("searchDiagnosis.action.payload: ", action.payload);
        state.diagnosis = action.payload;
      })
      .addCase(searchDiagnosis.rejected, (state, action) => {
        console.log("searchDiagnosis.rejected.action.payload: ", action);
        state.diagnosis = [];
        state.error = action.error.message;
      })
      .addCase(clearDiagnosisSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.diagnosis = action.payload;
        console.log("clearDiagnosisSearch.fulfilled: ", action.payload);
      })
      .addCase(getDiagnosisTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiagnosisTemplates.fulfilled, (state, action) => {
        state.error = null;
        console.log("getDiagnosisTemplates.fulfilled.action.payload: ", action.payload);
        state.templates = action.payload;
      })
      .addCase(getDiagnosisTemplates.rejected, (state, action) => {
        console.log("getDiagnosisTemplates.rejected.action.payload: ", action);
        state.templates = null;
        state.error = action.error.message;
      });
  },
});

export default diagnosisSlice.reducer;
