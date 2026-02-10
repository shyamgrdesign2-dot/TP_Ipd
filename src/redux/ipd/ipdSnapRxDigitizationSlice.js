import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IPDSnapRxDigitization from "../../api/services/ipd/IPDSnapRxDigitization";
import { SNAP_RX_TOKENS_STORAGE_KEY } from "../../utils/constants";

const TOKEN_EXPIRY_DURATION = 24 * 60 * 60 * 1000;

const initialState = {
  loading: false,
  error: null,

  // Server session files (scoped!)
  uploadedFiles: [],
  uploadedFilesScope: null, // { patientId, admissionId } | null

  fileUploadToken: null,
  fileUploadSessionId: null,
  digitizationResult: null,
};

export const uploadFiles = createAsyncThunk(
  "ipdSnapRx/uploadFiles",
  async (data, { getState, rejectWithValue }) => {
    try {
      const { fileUploadToken } = getState().ipdSnapRx || {};
      console.log('INTEL ==> DATA', data)
      const result = await IPDSnapRxDigitization.uploadSnapRxFiles({
        ...data,
        fileUploadToken: data?.fileUploadToken || fileUploadToken,
        schemaKey: data?.schemaKey,
      });

      if (result?.uploaded_files?.length > 0) {
        return result.uploaded_files;
      }

      return rejectWithValue(result?.error || "Upload failed");
    } catch (error) {
      return rejectWithValue(error?.message || "Upload failed");
    }
  }
);

export const generateFileUploadToken = createAsyncThunk(
  "ipdSnapRx/generateFileUploadToken",
  async (data, { rejectWithValue }) => {
    try {
      const result = await IPDSnapRxDigitization.generateFileUploadToken(data);
      const token = result?.token;
      const sessionId = result?.sessionId || result?.session_id;

      if (token) {
        return { token, sessionId };
      }

      return rejectWithValue(result?.error || "Token generation failed");
    } catch (error) {
      return rejectWithValue(error?.message || "Token generation failed");
    }
  }
);

/**
 * IMPORTANT FIX:
 * Return scope + files always. Even if files are empty, return [] so reducer clears.
 * If request fails, reducer will clear files for that scope as well.
 */
export const getFiles = createAsyncThunk(
  "ipdSnapRx/getFiles",
  async (data, { getState, rejectWithValue }) => {
    try {
      const { fileUploadToken: tokenFromState } = getState().ipdSnapRx || {};
      const fileUploadToken = data?.fileUploadToken || tokenFromState;
      const formKey = data?.type || data?.schemaKey || null;

      const result = await IPDSnapRxDigitization.getFiles({
        ...data,
        fileUploadToken,
      });

      const files = Array.isArray(result?.uploaded_files)
        ? result.uploaded_files
        : [];

      return {
        files,
        patientId: data?.patientId ?? null,
        admissionId: data?.admissionId ?? null,
        schemaKey: formKey,
      };
    } catch (error) {
      // still return scope on reject so we can clear stale state safely
      return rejectWithValue({
        message: error?.message || "Failed to fetch files",
        patientId: data?.patientId ?? null,
        admissionId: data?.admissionId ?? null,
        schemaKey: data.type,
      });
    }
  }
);

export const getFilesOnMobile = createAsyncThunk(
  "ipdSnapRx/getFilesOnMobile",
  async (data, { getState, rejectWithValue }) => {
    try {
      const { fileUploadToken } = getState().ipdSnapRx || {};
      const result = await IPDSnapRxDigitization.getFilesOnMobile({
        ...data,
        fileUploadToken,
      });

      const files = Array.isArray(result?.uploaded_files)
        ? result.uploaded_files
        : [];
      const formKey = data?.type || data?.schemaKey || null;

      return {
        files,
        patientId: data?.patientId ?? null,
        admissionId: data?.admissionId ?? null,
        schemaKey: formKey,
      };
    } catch (error) {
      const statusCode = error?.response?.status;
      const message =
        statusCode === 401
          ? error?.response?.data?.error || error?.message
          : error?.message;

      return rejectWithValue({
        message: message || "Failed to fetch mobile files",
        patientId: data?.patientId ?? null,
        admissionId: data?.admissionId ?? null,
        schemaKey: data?.type || data?.schemaKey || null,
      });
    }
  }
);

export const digitizeAssessments = createAsyncThunk(
  "ipdSnapRx/digitizeAssessments",
  async ({ previousOutput, schemaKey = "ASSESSMENTS" }, { getState, rejectWithValue }) => {
    const { fileUploadToken } = getState().ipdSnapRx || {};
    try {
      const result = await IPDSnapRxDigitization.digitize({
        schemaKey,
        data: { previousOutput },
        fileUploadToken,
      });
      return result;
    } catch (error) {
      return rejectWithValue(error?.message || "Digitization failed");
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

      // OPTIONAL but recommended: reset files too when token is reset
      // because token is tied to a session
      state.uploadedFiles = [];
      state.uploadedFilesScope = null;
    },

    // Allow manual hydration but keep it scoped (payload can be either old array or new shape)
    setUploadedFilesFromStore: (state, action) => {
      const payload = action.payload;

      // Backward compat: if someone dispatches array
      if (Array.isArray(payload)) {
        state.uploadedFiles = payload;
        // do NOT set scope blindly here
        return;
      }

      const files = Array.isArray(payload?.files) ? payload.files : [];
      const scope = payload?.scope || null;

      state.uploadedFiles = files;
      state.uploadedFilesScope = scope;
    },

    clearUploadedFilesFromStore: (state) => {
      state.uploadedFiles = [];
      state.uploadedFilesScope = null;
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
      // uploadFiles
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        // this is local upload result; keep as-is if you rely on it
        state.uploadedFiles = action.payload || [];
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || null;
        // don't wipe server files here necessarily; leave it
      })

      // getFiles
      .addCase(getFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.loading = false;

        const { files, patientId, admissionId } = action.payload || {};
        state.uploadedFiles = Array.isArray(files) ? files : [];
        state.uploadedFilesScope =
          patientId && admissionId
            ? {
                patientId,
                admissionId,
                schemaKey: action.payload?.schemaKey || action.meta?.arg?.type || action.meta?.arg?.schemaKey || null,
              }
            : null;
      })
      .addCase(getFiles.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload;
        state.error = payload?.message || action.error?.message || null;

        // CRITICAL: clear files on failure so stale UI doesn't render
        // But only clear if the request had scope (otherwise we don't know what failed)
        const patientId = payload?.patientId ?? action.meta?.arg?.patientId;
        const admissionId = payload?.admissionId ?? action.meta?.arg?.admissionId;
        const schemaKey = payload?.schemaKey ?? action.meta?.arg?.type ?? action.meta?.arg?.schemaKey ?? null;

        if (patientId && admissionId) {
          state.uploadedFiles = [];
          state.uploadedFilesScope = { patientId, admissionId, schemaKey };
        } else {
          // safest fallback: clear anyway to avoid wrong patient showing
          state.uploadedFiles = [];
          state.uploadedFilesScope = null;
        }
      })

      // generateFileUploadToken
      .addCase(generateFileUploadToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFileUploadToken.fulfilled, (state, action) => {
        state.loading = false;
        state.fileUploadToken = action.payload?.token;
        state.fileUploadSessionId = action.payload?.sessionId || null;

        const { patientId, admissionId, schemaKey } = action.meta.arg || {};
        if (patientId && admissionId) {
          const normalizedSchemaKey = schemaKey || "ASSESSMENTS";
          const tokenKey = `fileUploadToken_${patientId}_${admissionId}_${normalizedSchemaKey}`;
          const legacyTokenKey = `fileUploadToken_${patientId}_${admissionId}`;
          const tokenData = {
            value: action.payload?.token,
            sessionId: action.payload?.sessionId,
            timestamp: Date.now(),
            expiresIn: Date.now() + TOKEN_EXPIRY_DURATION,
          };

          let tokensObject = {};
          try {
            const existingTokens = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);
            if (existingTokens) tokensObject = JSON.parse(existingTokens);
          } catch (error) {
            tokensObject = {};
          }

          // clean up legacy key if present
          if (tokensObject[legacyTokenKey] && !tokensObject[tokenKey]) {
            tokensObject[tokenKey] = tokensObject[legacyTokenKey];
            delete tokensObject[legacyTokenKey];
          }

          tokensObject[tokenKey] = tokenData;
          localStorage.setItem(SNAP_RX_TOKENS_STORAGE_KEY, JSON.stringify(tokensObject));
        }
      })
      .addCase(generateFileUploadToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || null;
        state.fileUploadToken = null;
        state.fileUploadSessionId = null;
      })

      // digitizeAssessments
      .addCase(digitizeAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(digitizeAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.digitizationResult = action.payload;
      })
      .addCase(digitizeAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || null;
      })

      // getFilesOnMobile
      .addCase(getFilesOnMobile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilesOnMobile.fulfilled, (state, action) => {
        state.loading = false;

        const { files, patientId, admissionId } = action.payload || {};
        state.uploadedFiles = Array.isArray(files) ? files : [];
        state.uploadedFilesScope =
          patientId && admissionId
            ? {
                patientId,
                admissionId,
                schemaKey: action.payload?.schemaKey || action.meta?.arg?.type || action.meta?.arg?.schemaKey || null,
              }
            : null;
      })
      .addCase(getFilesOnMobile.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload;
        state.error = payload?.message || action.error?.message || null;

        // Clear to avoid stale render
        const patientId = payload?.patientId ?? action.meta?.arg?.patientId;
        const admissionId = payload?.admissionId ?? action.meta?.arg?.admissionId;
        const schemaKey = payload?.schemaKey ?? action.meta?.arg?.type ?? action.meta?.arg?.schemaKey ?? null;

        if (patientId && admissionId) {
          state.uploadedFiles = [];
          state.uploadedFilesScope = { patientId, admissionId, schemaKey };
        } else {
          state.uploadedFiles = [];
          state.uploadedFilesScope = null;
        }
      });
  },
});

export const {
  resetFileUploadToken,
  setUploadedFilesFromStore,
  clearUploadedFilesFromStore,
  setFileUploadToken,
  setFileUploadSessionId,
} = ipdSnapRxDigitizationSlice.actions;

export default ipdSnapRxDigitizationSlice.reducer;
