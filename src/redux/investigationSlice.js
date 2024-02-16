import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiInvestigation from "../api/services/ApiInvestigation";

const initialState = {
  selectedInvestigationList: [],
  parentOptionsList: [],
  childOptionsList: [],
  templates: [],
  loading: false,
  error: null,
};

export const addTemplate = createAsyncThunk(
  "investigation/addTemplate",
  async (template) => {
    let result = {};
    result = await ApiInvestigation.addTemplate(template);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "investigation/updateTemplate",
  async (template) => {
    const result = await ApiInvestigation.updateTemplate(template);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "investigation/deleteTemplate",
  async (templateId) => {
    const result = await ApiInvestigation.deleteTemplate(templateId);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getInvestigationTemplates = createAsyncThunk(
  "investigation/getInvestigationTemplates",
  async () => {
    let result = {};
    result = await ApiInvestigation.getInvestigationTemplates();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getFrequentlySearchedInvestigation = createAsyncThunk(
  "investigation/getFrequentlySearchedInvestigation",
  async () => {
    let result = {};
    result = await ApiInvestigation.getFrequentlySearchedInvestigation();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchInvestigation = createAsyncThunk(
  "investigation/searchInvestigation",
  async (data) => {
    let result = {};
    result = await ApiInvestigation.searchInvestigation(data.searchQuery);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

const investigationSlice = createSlice({
  name: "investigation",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvestigationList = action.payload.investigation;
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
        state.selectedInvestigationList = action.payload.investigation;
        const index = state.templates.findIndex(
          (e) => e.tet_id == action.payload.tet_id
        );
        if (index != -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTemplate.pending, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tet_id == action.meta.arg ? { ...e, loading: true } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const result = state.templates.filter(
          (item) => item.tet_id !== action.payload.tet_id
        );
        state.templates = [...result];
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tet_id == action.meta.arg ? { ...e, loading: false } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(getInvestigationTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(getInvestigationTemplates.rejected, (state, action) => {
        state.templates = [];
      })
      .addCase(getFrequentlySearchedInvestigation.fulfilled, (state, action) => {
        state.parentOptionsList = action.payload;
      })
      .addCase(getFrequentlySearchedInvestigation.rejected, (state, action) => {
        state.parentOptionsList = [];
      })
      .addCase(searchInvestigation.pending, (state) => { })
      .addCase(searchInvestigation.fulfilled, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = action.payload;
        } else {
          state.childOptionsList = action.payload;
        }
      })
      .addCase(searchInvestigation.rejected, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = [];
        } else {
          state.childOptionsList = [];
        }
      });
  },
});

export default investigationSlice.reducer;