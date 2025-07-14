import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import SnapRxDigitization from "../api/services/SnapRxDigitization";

const initialState = {
  loading: false,
  error: null,
  uploadedFiles: [],
  fileUploadToken: null,
};

export const uploadFiles = createAsyncThunk(
  "snapRx/uploadFiles",
  async (data) => {
    try {
      let result = {};
      result = await SnapRxDigitization.uploadSnapRxFiles(data);
      if (result?.uploaded_files?.length > 0) {
        return data?.file;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const generateFileUploadToken = createAsyncThunk(
  "snapRx/generateFileUploadToken",
  async (data) => {
    try {
      let result = {};
      result = await SnapRxDigitization.generateFileUploadToken(data);
      if (result?.token) {
        return result?.token;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const getFiles = createAsyncThunk("snapRx/getFiles", async (data) => {
  try {
    let result = {};
    result = await SnapRxDigitization.getFiles(data);
    if (result?.uploaded_files) {
      return result.uploaded_files;
    } else {
      throw Error(result.error);
    }
  } catch (error) {
    console.log("error: ", error);
    throw Error(error);
  }
});

export const getFilesOnMobile = createAsyncThunk(
  "snapRx/getFilesOnMobile",
  async (data) => {
    try {
      let result = {};
      result = await SnapRxDigitization.getFilesOnMobile(data);
      if (result?.uploaded_files) {
        return result.uploaded_files;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

const snapRxDigitizationSlice = createSlice({
  name: "snapRx",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFiles = action.payload;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploadedFiles = [];
        state.loading = false;
      })
      .addCase(getFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFiles = action.payload;
      })
      .addCase(getFiles.rejected, (state, action) => {
        state.uploadedFiles = [];
        state.loading = false;
      })
      .addCase(generateFileUploadToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateFileUploadToken.fulfilled, (state, action) => {
        state.loading = false;
        state.fileUploadToken = action.payload;
      })
      .addCase(generateFileUploadToken.rejected, (state, action) => {
        state.loading = false;
        state.fileUploadToken = null;
      })
      .addCase(getFilesOnMobile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilesOnMobile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFiles = action.payload;
      })
      .addCase(getFilesOnMobile.rejected, (state, action) => {
        state.uploadedFiles = [];
        state.loading = false;
      });
  },
});

export default snapRxDigitizationSlice.reducer;
