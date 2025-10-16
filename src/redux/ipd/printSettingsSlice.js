import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiPrintSettings from "../../api/services/ipd/ApiPrintSettings";

export const initialState = {
  printSettings: {},
  draftSettings: {}, // Temporary settings for each module before saving
  // File states for each module
  fileStates: {
    // moduleType: {
    //   fileHeader: null,
    //   fileFooter: null,
    //   fileLogo: null,
    //   fileWatermark: null,
    //   fileSignature: null,
    // }
  },
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

      if (result) {
        return result;
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
      if (result) {
        return result;
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

export const getDefaultPrintsettings = createAsyncThunk(
  "printSettings/getDefaultPrintsettings",
  async (_, { rejectWithValue }) => {
    try {
      const result = await ApiPrintSettings.getDefaultPrintsettings();
      if (result) {
        return result;
      } else {
        throw Error(result.error || "Failed to fetch default print settings");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch default print settings",
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
      state.draftSettings = action.payload;
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

    // Update headerFooter-level settings (letterHeadFormat, printMode, margins)
    setHeaderFooterSettings: (state, action) => {
      state.printSettings.dischargeSummary.headerFooter = {
        ...state.printSettings.dischargeSummary.headerFooter,
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

    // Update patient info field visibility (now supports array-based fields)
    setPatientInfoField: (state, action) => {
      const { fieldId, enabled } = action.payload;
      const fields =
        state.printSettings.dischargeSummary.headerFooter.displayPatientInfo
          .fields;

      if (Array.isArray(fields)) {
        // New array-based structure
        const fieldIndex = fields.findIndex((field) => field.id === fieldId);
        if (fieldIndex !== -1) {
          fields[fieldIndex].enabled = enabled;
        }
      } else if (fields && typeof fields === "object") {
        // Legacy object-based structure (for backward compatibility)
        fields[fieldId] = enabled;
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
      state.draftSettings = initialState.draftSettings;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Draft Settings Management
    // Initialize draft settings for a module with current saved settings
    setDraftSettings: (state, action) => {
      const { moduleType, settings } = action.payload;
      state.draftSettings[moduleType] = JSON.parse(JSON.stringify(settings));
    },

    // Update a specific setting in draft
    updateDraftSetting: (state, action) => {
      const { moduleType, path, value } = action.payload;

      if (!state.draftSettings[moduleType]) {
        state.draftSettings[moduleType] = {};
      }

      // Deep update using path (e.g., "formatStyle[0].visible" or "headerFooter.header.title")
      const updateNestedProperty = (obj, pathArray, value) => {
        if (pathArray.length === 1) {
          obj[pathArray[0]] = value;
        } else {
          const [key, ...rest] = pathArray;
          if (!obj[key]) {
            obj[key] = {};
          }
          updateNestedProperty(obj[key], rest, value);
        }
      };

      // Handle array index access (e.g., "formatStyle[0].visible")
      const pathArray = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);
      updateNestedProperty(state.draftSettings[moduleType], pathArray, value);
    },

    // Save draft settings to main settings (persist changes)
    saveDraftSettings: (state, action) => {
      const { moduleType } = action.payload;

      if (state.draftSettings[moduleType]) {
        // Deep merge draft settings into main settings
        if (!state.printSettings[moduleType]) {
          state.printSettings[moduleType] = {};
        }
        state.printSettings[moduleType] = JSON.parse(
          JSON.stringify(state.draftSettings[moduleType])
        );
      }
    },

    // Revert draft settings back to saved settings
    revertDraftSettings: (state, action) => {
      const { moduleType } = action.payload;

      if (state.printSettings[moduleType]) {
        // Copy saved settings back to draft
        state.draftSettings[moduleType] = JSON.parse(
          JSON.stringify(state.printSettings[moduleType])
        );
      } else {
        // If no saved settings, clear draft
        delete state.draftSettings[moduleType];
      }
    },

    // Update format style section in draft (specific helper for array-based formatStyle)
    updateDraftFormatStyle: (state, action) => {
      const { moduleType, sectionId, updates } = action.payload;

      if (!state.draftSettings[moduleType]) {
        state.draftSettings[moduleType] = {};
      }
      if (!state.draftSettings[moduleType].formatStyle) {
        state.draftSettings[moduleType].formatStyle = [];
      }

      // Helper function to recursively find and update section/subsection
      const updateSectionRecursively = (sections, sectionId, updates) => {
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].id === sectionId) {
            // Found the section, update it
            sections[i] = {
              ...sections[i],
              ...updates,
            };
            return true;
          }

          // Check subsections if they exist
          if (sections[i].subSections && sections[i].subSections.length > 0) {
            const found = updateSectionRecursively(
              sections[i].subSections,
              sectionId,
              updates
            );
            if (found) return true;
          }
        }
        return false;
      };

      // Update the section (could be at any level)
      updateSectionRecursively(
        state.draftSettings[moduleType].formatStyle,
        sectionId,
        updates
      );
    },

    // Update parameter in draft (for custom options)
    updateDraftParameter: (state, action) => {
      const { moduleType, sectionId, parameterId, selected } = action.payload;

      if (!state.draftSettings[moduleType]) {
        state.draftSettings[moduleType] = {};
      }
      if (!state.draftSettings[moduleType].formatStyle) {
        state.draftSettings[moduleType].formatStyle = [];
      }

      // Helper function to recursively find and update parameter in section/subsection
      const updateParameterRecursively = (
        sections,
        sectionId,
        parameterId,
        selected
      ) => {
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].id === sectionId) {
            // Found the section, update the parameter
            if (sections[i].parameters) {
              const paramIndex = sections[i].parameters.findIndex(
                (param) => param.id === parameterId
              );

              if (paramIndex !== -1) {
                sections[i].parameters[paramIndex] = {
                  ...sections[i].parameters[paramIndex],
                  selected: selected,
                };
                return true;
              }
            }
            return false;
          }

          // Check subsections if they exist
          if (sections[i].subSections && sections[i].subSections.length > 0) {
            const found = updateParameterRecursively(
              sections[i].subSections,
              sectionId,
              parameterId,
              selected
            );
            if (found) return true;
          }
        }
        return false;
      };

      // Update the parameter (could be in section at any level)
      updateParameterRecursively(
        state.draftSettings[moduleType].formatStyle,
        sectionId,
        parameterId,
        selected
      );
    },

    // File State Management
    // Set file states for a module
    setFileStates: (state, action) => {
      const { moduleType, fileStates } = action.payload;
      if (!state.fileStates[moduleType]) {
        state.fileStates[moduleType] = {};
      }
      state.fileStates[moduleType] = {
        ...state.fileStates[moduleType],
        ...fileStates,
      };
    },

    // Set individual file
    setFile: (state, action) => {
      const { moduleType, fileType, fileData } = action.payload;
      if (!state.fileStates[moduleType]) {
        state.fileStates[moduleType] = {};
      }
      state.fileStates[moduleType][fileType] = fileData;
    },

    // Clear file states for a module
    clearFileStates: (state, action) => {
      const { moduleType } = action.payload;
      delete state.fileStates[moduleType];
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
        state.draftSettings = action.payload;
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
  setHeaderFooterSettings,
  setPatientInfoSettings,
  setPatientInfoField,
  setOtherSettings,
  setPageFormat,
  setLogo,
  setSignatureImage,
  setWatermarkImage,
  resetPrintSettings,
  clearError,
  // Draft settings actions
  setDraftSettings,
  updateDraftSetting,
  saveDraftSettings,
  revertDraftSettings,
  updateDraftFormatStyle,
  updateDraftParameter,
  // File state actions
  setFileStates,
  setFile,
  clearFileStates,
} = printSettingsSlice.actions;

export default printSettingsSlice.reducer;
