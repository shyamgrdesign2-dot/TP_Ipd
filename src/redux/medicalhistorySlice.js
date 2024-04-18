import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiMedicalHistory from "../api/services/ApiMedicalHistory";

const initialState = {
  defaultList: [],
  loading: false,
  error: null,
};

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
  },
});

export default medicalHistorySlice.reducer;