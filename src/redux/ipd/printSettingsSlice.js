import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiPrintSettings from "../../api/services/ipd/ApiPrintSettings";

export const initialState = {
  printSettings: {},
  loading: false,
  error: null,
  uploadedFileUrl: null,
  uploadLoading: false,
};

/**
 * Get print settings
 */
export const getPrintSettings = createAsyncThunk(
  "printSettings/getPrintSettings",
  async (_, { rejectWithValue }) => {
    try {
      const result = await ApiPrintSettings.getPrintSettings();

      if (result?._id) {
        return result;
      } else {
        throw Error(result.error || "Failed to fetch print settings");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message:
          error.response?.data?.message || "Failed to fetch print settings",
      });
    }
  }
);

/**
 * Update print settings
 */
export const updatePrintSettings = createAsyncThunk(
  "printSettings/updatePrintSettings",
  async (printSettings, { rejectWithValue }) => {
    try {
      const result = await ApiPrintSettings.updatePrintSettings({
        printSettings,
      });
      if (result.data) {
        return result.data;
      } else {
        throw Error(result.error || "Failed to update print settings");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message:
          error.response?.data?.message || "Failed to update print settings",
      });
    }
  }
);

/**
 * Upload file (logo, watermark, signature)
 */
export const uploadFile = createAsyncThunk(
  "printSettings/uploadFile",
  async (file, { rejectWithValue }) => {
    try {
      const result = await ApiPrintSettings.uploadFile({ file });
      if (result.data) {
        return result.data;
      } else {
        throw Error(result.error || "Failed to upload file");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message || "Failed to upload file",
      });
    }
  }
);

/**
 * Get file URL by filename
 */
export const getFileUrlByFilename = createAsyncThunk(
  "printSettings/getFileUrlByFilename",
  async (filename, { rejectWithValue }) => {
    try {
      const result = await ApiPrintSettings.getFileUrlByFilename({ filename });
      if (result.data) {
        return result.data;
      } else {
        throw Error(result.error || "Failed to fetch file URL");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message || "Failed to fetch file URL",
      });
    }
  }
);

const printSettingsSlice = createSlice({
  name: "printSettings",
  initialState,
  reducers: {
    // Set entire print settings
    setPrintSettings: (state, action) => {
      state.printSettings = action.payload;
    },

    // Update discharge summary settings
    setDischargeSummarySettings: (state, action) => {
      state.printSettings.dischargeSummary = {
        ...state.printSettings.dischargeSummary,
        ...action.payload,
      };
    },

    // Update format style
    setFormatStyle: (state, action) => {
      state.printSettings.dischargeSummary.formatStyle = {
        ...state.printSettings.dischargeSummary.formatStyle,
        ...action.payload,
      };
    },

    // Update section visibility and order
    setSectionSettings: (state, action) => {
      const { sectionKey, settings } = action.payload;
      if (state.printSettings.dischargeSummary.formatStyle[sectionKey]) {
        state.printSettings.dischargeSummary.formatStyle[sectionKey] = {
          ...state.printSettings.dischargeSummary.formatStyle[sectionKey],
          ...settings,
        };
      }
    },

    // Update header settings
    setHeaderSettings: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.header = {
        ...state.printSettings.dischargeSummary.headerFooter.header,
        ...action.payload,
      };
    },

    // Update footer settings
    setFooterSettings: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.footer = {
        ...state.printSettings.dischargeSummary.headerFooter.footer,
        ...action.payload,
      };
    },

    // Update patient info display settings
    setPatientInfoSettings: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.displayPatientInfo = {
        ...state.printSettings.dischargeSummary.headerFooter.displayPatientInfo,
        ...action.payload,
      };
    },

    // Update patient info field visibility
    setPatientInfoField: (state, action) => {
      const { fieldKey, visible } = action.payload;
      if (
        state.printSettings.dischargeSummary.headerFooter.displayPatientInfo
          .fields
      ) {
        state.printSettings.dischargeSummary.headerFooter.displayPatientInfo.fields[
          fieldKey
        ] = visible;
      }
    },

    // Update other settings (watermark, signature, QR code)
    setOtherSettings: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.otherSettings = {
        ...state.printSettings.dischargeSummary.headerFooter.otherSettings,
        ...action.payload,
      };
    },

    // Update page format
    setPageFormat: (state, action) => {
      state.printSettings.dischargeSummary.pageFormat = {
        ...state.printSettings.dischargeSummary.pageFormat,
        ...action.payload,
      };
    },

    // Update logo
    setLogo: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.header.logo =
        action.payload;
    },

    // Update signature image
    setSignatureImage: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.otherSettings.signatureImg =
        action.payload;
    },

    // Update watermark image
    setWatermarkImage: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter.otherSettings.watermarkImg =
        action.payload;
    },

    // Reset to initial state
    resetPrintSettings: (state) => {
      state.printSettings = initialState.printSettings;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get print settings
      .addCase(getPrintSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrintSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.printSettings = action.payload;
      })
      .addCase(getPrintSettings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch print settings";
      })

      // Update print settings
      .addCase(updatePrintSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrintSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.printSettings = action.payload;
      })
      .addCase(updatePrintSettings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update print settings";
      })

      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadedFileUrl = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload?.message || "Failed to upload file";
      })

      // Get file URL
      .addCase(getFileUrlByFilename.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileUrlByFilename.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFileUrl = action.payload;
      })
      .addCase(getFileUrlByFilename.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch file URL";
      });
  },
});

export const {
  setPrintSettings,
  setDischargeSummarySettings,
  setFormatStyle,
  setSectionSettings,
  setHeaderSettings,
  setFooterSettings,
  setPatientInfoSettings,
  setPatientInfoField,
  setOtherSettings,
  setPageFormat,
  setLogo,
  setSignatureImage,
  setWatermarkImage,
  resetPrintSettings,
  clearError,
} = printSettingsSlice.actions;

export default printSettingsSlice.reducer;
