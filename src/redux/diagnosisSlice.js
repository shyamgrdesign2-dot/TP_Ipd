import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";

const initialState = {
  diagnosis: [],
  frequentDiagnosis: [],
  templates: [],
  loading: false,
  isAddingUpdatingTemplate: false,
  error: null,
};

export const addTemplate = createAsyncThunk(
  "diagnosis/addTemplate",
  async (template) => {
    let result = {};
    result = await ApiAppointments.addTemplate(template);
    console.log("results: ", result);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "diagnosis/updateTemplate",
  async (template) => {
    console.log("template: ", template);
    const result = await ApiAppointments.updateTemplate(template);
    console.log("results: ", result);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "diagnosis/deleteTemplate",
  async (templateId) => {
    const result = await ApiAppointments.deleteTemplate(templateId);
    console.log("results: ", result);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getDiagnosisTemplates = createAsyncThunk(
  "diagnosis/getDiagnosisTemplates",
  async () => {
    let result = {};
    result = await ApiAppointments.getDiagnosisTemplates();
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

export const getFrequentlySearchedDiagnosis = createAsyncThunk(
  "diagnosis/getFrequentlySearchedDiagnosis",
  async () => {
    let result = {};
    result = await ApiAppointments.getFrequentlySearchedDiagnosis();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

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
        state.loading = false;
        console.log("searchDiagnosis.action.payload: ", action.payload);
        state.diagnosis = action.payload;
      })
      .addCase(searchDiagnosis.rejected, (state, action) => {
        console.log("searchDiagnosis.rejected.action.payload: ", action);
        state.diagnosis = [];
        state.loading = false;
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
        state.loading = false;
        console.log("getDiagnosisTemplates.fulfilled.action.payload: ", action.payload);
        state.templates = action.payload;
      })
      .addCase(getDiagnosisTemplates.rejected, (state, action) => {
        console.log("getDiagnosisTemplates.rejected.action.payload: ", action);
        state.templates = null;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTemplate.pending, (state) => {
        state.isAddingUpdatingTemplate = true;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.error = null;
        state.isAddingUpdatingTemplate = false;
        console.log("addTemplate.fulfilled.action.payload: ", action.payload);
        state.templates.push(action.payload);
      })
      .addCase(addTemplate.rejected, (state, action) => {
        console.log("addTemplate.rejected.action.payload: ", action);
        state.error = action.error.message;
        state.isAddingUpdatingTemplate = false;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.isAddingUpdatingTemplate = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.error = null;
        console.log("updateTemplate.fulfilled.action.payload: ", action.payload);
        state.isAddingUpdatingTemplate = false;
        state.templates.push(action.payload);
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        console.log("updateTemplate.rejected.action.payload: ", action);
        state.isAddingUpdatingTemplate = false;
        state.error = action.error.message;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.error = null;
        console.log("deleteTemplate.fulfilled.action.payload: ", action.payload);
        const result = state.templates.filter((item) => item.tdt_id !== action.payload.tdt_id);
        state.templates = [...result];
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        console.log("deleteTemplate.rejected.action.payload: ", action);
        state.error = action.error.message;
      })
      .addCase(getFrequentlySearchedDiagnosis.fulfilled, (state, action) => {
        state.error = null;
        // console.log("getFrequentlySearchedDiagnosis.fulfilled.action.payload: ", action.payload);
        state.frequentDiagnosis = action.payload;
      })
      .addCase(getFrequentlySearchedDiagnosis.rejected, (state, action) => {
        // console.log("getFrequentlySearchedDiagnosis.rejected.action.payload: ", action);
        state.error = action.error.message;
      });
  },
});

export default diagnosisSlice.reducer;
