import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiMedicalHistory from "../api/services/ApiMedicalHistory";

const initialState = {
  searchList: [],
  defaultList: [],
  loading: false,
  error: null,
};

export const getPatientLastHistory = createAsyncThunk(
  "medicalHistory/getPatientLastHistory",
  async (data) => {
    let result = {};
    result = await ApiMedicalHistory.getPatientLastHistory(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const listSectionwithTag = createAsyncThunk(
  "medicalHistory/listSectionwithTag",
  async () => {
    let result = {};
    result = await ApiMedicalHistory.listSectionwithTag();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const addTag = createAsyncThunk(
  "medicalHistory/addTag",
  async (data) => {
    let result = {};
    result = await ApiMedicalHistory.addTag(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchTag = createAsyncThunk(
  "medicalHistory/searchTag",
  async (data) => {
    let result = {};
    result = await ApiMedicalHistory.searchTag(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

const medicalHistorySlice = createSlice({
  name: "medicalHistory",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listSectionwithTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(listSectionwithTag.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultList = action.payload;
      })
      .addCase(listSectionwithTag.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTag.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTag.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchTag.fulfilled, (state, action) => {
        state.searchList = action.payload;
      })
      .addCase(searchTag.rejected, (state) => {
        state.searchList = [];
      })
  },
});

export default medicalHistorySlice.reducer;