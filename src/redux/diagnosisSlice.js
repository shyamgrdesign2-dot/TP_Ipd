import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiDiagnosis from "../api/services/ApiDiagnosis";

const initialState = {
  selectedDiagnosisList: [],
  parentOptionsList: [],
  childOptionsList: [],
  templates: [],
  loading: false,
  error: null,
};

export const addTemplate = createAsyncThunk(
  "diagnosis/addTemplate",
  async (template) => {
    let result = {};
    result = await ApiDiagnosis.addTemplate(template);
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
    const result = await ApiDiagnosis.updateTemplate(template);
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
    const result = await ApiDiagnosis.deleteTemplate(templateId);
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
    result = await ApiDiagnosis.getDiagnosisTemplates();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getFrequentlySearchedDiagnosis = createAsyncThunk(
  "diagnosis/getFrequentlySearchedDiagnosis",
  async () => {
    let result = {};
    result = await ApiDiagnosis.getFrequentlySearchedDiagnosis();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchDiagnosis = createAsyncThunk(
  "diagnosis/searchDiagnosis",
  async (data) => {
    let result = {};
    result = await ApiDiagnosis.searchDiagnosis(data.searchQuery);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getLoadPreviousDiagnosis = createAsyncThunk(
  "diagnosis/getLoadPreviousDiagnosis",
  async (data) => {
    let result = {};
    result = await ApiDiagnosis.getLoadPreviousDiagnosis(data);
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
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDiagnosisList = action.payload.diagnosis;
        state.templates.unshift(action.payload);
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDiagnosisList = action.payload.diagnosis;
        const index = state.templates.findIndex(
          (e) => e.tdt_id == action.payload.tdt_id
        );
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTemplate.pending, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tdt_id == action.meta.arg ? { ...e, loading: true } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const result = state.templates.filter(
          (item) => item.tdt_id !== action.payload.tdt_id
        );
        state.templates = [...result];
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tdt_id == action.meta.arg ? { ...e, loading: false } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(getDiagnosisTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(getDiagnosisTemplates.rejected, (state, action) => {
        state.templates = [];
      })
      .addCase(getFrequentlySearchedDiagnosis.fulfilled, (state, action) => {
        state.parentOptionsList = action.payload;
      })
      .addCase(getFrequentlySearchedDiagnosis.rejected, (state, action) => {
        state.parentOptionsList = [];
      })
      .addCase(searchDiagnosis.pending, (state) => { })
      .addCase(searchDiagnosis.fulfilled, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = action.payload;
        } else {
          state.childOptionsList = action.payload;
        }
      })
      .addCase(searchDiagnosis.rejected, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = [];
        } else {
          state.childOptionsList = [];
        }
      });
  },
});

export default diagnosisSlice.reducer;
