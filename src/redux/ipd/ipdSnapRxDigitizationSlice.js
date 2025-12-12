import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import IPDSnapRxDigitization from "../../api/services/ipd/IPDSnapRxDigitization";
import { SNAP_RX_TOKENS_STORAGE_KEY } from "../../utils/constants";

const TOKEN_EXPIRY_DURATION = 24 * 60 * 60 * 1000;

const initialState = {
  loading: false,
  error: null,
  uploadedFiles: [],
  fileUploadToken: null,
  fileUploadSessionId: null,
  digitizationResult: null,
};

export const uploadFiles = createAsyncThunk(
  "ipdSnapRx/uploadFiles",
  async (data, { getState }) => {
    try {
      const { fileUploadToken } = getState().ipdSnapRx || {};
      let result = {};
      result = await IPDSnapRxDigitization.uploadSnapRxFiles({
        ...data,
        fileUploadToken: data?.fileUploadToken || fileUploadToken,
      });
      if (result?.uploaded_files?.length > 0) {
        return result?.uploaded_files;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
);

export const generateFileUploadToken = createAsyncThunk(
  "ipdSnapRx/generateFileUploadToken",
  async (data) => {
    try {
      console.log("generateFileUploadToken thunk reached");
      let result = {};
      result = await IPDSnapRxDigitization.generateFileUploadToken(data);
      const token = result?.token;
      const sessionId = result?.sessionId || result?.session_id;
      if (token) {
        return { token, sessionId };
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const getFiles = createAsyncThunk(
  "ipdSnapRx/getFiles",
  async (data, { getState }) => {
    try {
      const { fileUploadToken: tokenFromState } = getState().ipdSnapRx || {};
      const fileUploadToken = data?.fileUploadToken || tokenFromState;
      let result = {};
      result = await IPDSnapRxDigitization.getFiles({
        ...data,
        fileUploadToken,
      });
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

export const getFilesOnMobile = createAsyncThunk(
  "ipdSnapRx/getFilesOnMobile",
  async (data, { getState }) => {
    try {
      const { fileUploadToken } = getState().ipdSnapRx || {};
      let result = {};
      result = await IPDSnapRxDigitization.getFilesOnMobile({
        ...data,
        fileUploadToken,
      });
      if (result?.uploaded_files) {
        return result.uploaded_files;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      const statusCode = error.response?.status;
      if (statusCode === 401) {
        throw Error(error.response?.data?.error || error.message);
      } else {
        throw Error(error.message);
      }
    }
  }
);

export const digitizeAssessments = createAsyncThunk(
  "ipdSnapRx/digitizeAssessments",
  async ({ previousOutput, schemaKey = "ASSESSMENTS" }, { getState }) => {
    const { fileUploadToken } = getState().ipdSnapRx || {};
    try {
      const result = await IPDSnapRxDigitization.digitize({
        schemaKey,
        data: { previousOutput },
        fileUploadToken,
      });
      return result;
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
);

const ipdSnapRxDigitizationSlice = createSlice({
  name: "ipdSnapRx",
  initialState,
  reducers: {
    resetFileUploadToken: (state) => {
      state.fileUploadToken = null;
      state.fileUploadSessionId = null;
    },
    setUploadedFilesFromStore: (state, action) => {
      state.uploadedFiles = action.payload;
    },
    setFileUploadToken: (state, action) => {
      state.fileUploadToken = action.payload;
    },
    setFileUploadSessionId: (state, action) => {
      state.fileUploadSessionId = action.payload;
    },
  },
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
        state.fileUploadToken = action.payload?.token;
        state.fileUploadSessionId = action.payload?.sessionId || null;
        const { patientId, admissionId } = action.meta.arg;

        const tokenKey = `fileUploadToken_${patientId}_${admissionId}`;
        const tokenData = {
          value: action.payload?.token,
          sessionId: action.payload?.sessionId,
          timestamp: Date.now(),
          expiresIn: Date.now() + TOKEN_EXPIRY_DURATION,
        };

        let tokensObject = {};
        try {
          const existingTokens = localStorage.getItem(
            SNAP_RX_TOKENS_STORAGE_KEY
          );
          if (existingTokens) {
            tokensObject = JSON.parse(existingTokens);
          }
        } catch (error) {
          console.error("Error parsing existing tokens:", error);
          tokensObject = {};
        }

        tokensObject[tokenKey] = tokenData;
        localStorage.setItem(
          SNAP_RX_TOKENS_STORAGE_KEY,
          JSON.stringify(tokensObject)
        );
      })
      .addCase(generateFileUploadToken.rejected, (state, action) => {
        state.loading = false;
        state.fileUploadToken = null;
      })
      .addCase(digitizeAssessments.pending, (state) => {
        state.loading = true;
      })
      .addCase(digitizeAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.digitizationResult = action.payload;
      })
      .addCase(digitizeAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
        state.error = action.error.message;
      });
  },
});

export const {
  resetFileUploadToken,
  setUploadedFilesFromStore,
  setFileUploadToken,
  setFileUploadSessionId,
} = ipdSnapRxDigitizationSlice.actions;
export default ipdSnapRxDigitizationSlice.reducer;
