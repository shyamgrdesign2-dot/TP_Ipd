import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiCustomModule from "../api/services/ApiCustomModule";

// Async thunk for adding a module
export const addModule = createAsyncThunk(
  "customModules/addModule",
  async ({ userId, modules }, { rejectWithValue }) => {
    try {
      const payload = {
        userId,
        modules,
      };
      const response = await ApiCustomModule.addModule(payload);
      return response; // Assuming the API returns the added module data
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle API errors
    }
  }
);

export const getModules = createAsyncThunk(
  "customModules/getModules",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.getModules(userId);

      return response; // Assuming the API returns the added module data
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle API errors
    }
  }
);

export const getModuleContents = createAsyncThunk(
  "customModules/getModuleContents",
  async (tcmId, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.getModuleContents(tcmId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch module contents."
      );
    }
  }
);

export const searchModule = createAsyncThunk(
  "modules/searchModuleContents",
  async ({ moduleId, keyword }, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.searchModule(moduleId, keyword);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to search module contents."
      );
    }
  }
);

const customModuleSlice = createSlice({
  name: "customModules",
  initialState: {
    customModules: [],
    moduleContents: [],
    searchModuleResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCustomModulesPrintConfig: (state, action) => {
      const { module_id, printConfig } = action.payload;

      state.customModules = state.customModules.map((module) =>
        module.module_id === module_id
          ? {
              ...module,
              printConfig: { ...module.printConfig, ...printConfig },
            }
          : module
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.loading = false;
        const sanitizedModules = action.payload.modules.map(
          ({ created_at, updated_at, ...rest }) => rest
        );
        state.customModules = sanitizedModules;
      })
      .addCase(addModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add module.";
      })
      .addCase(getModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModules.fulfilled, (state, action) => {
        state.loading = false;
        const sanitizedModules = action.payload.modules.map(
          ({ created_at, updated_at, ...rest }) => rest
        );
        state.customModules = sanitizedModules;
      })
      .addCase(getModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch modules.";
      })
      .addCase(getModuleContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModuleContents.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleContents = action.payload.moduleContents || [];
      })
      .addCase(getModuleContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch module contents.";
      })
      .addCase(searchModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchModule.fulfilled, (state, action) => {
        state.loading = false;
        state.searchModuleResults =
          action.payload?.flatMap((item) =>
            item.moduleContents
              .filter((module) => module.content?.title)
              .map((module) => module.content)
          ) || [];
      })
      .addCase(searchModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search module contents.";
      });
  },
});


export const { setCustomModulesPrintConfig } = customModuleSlice.actions;
export default customModuleSlice.reducer;
