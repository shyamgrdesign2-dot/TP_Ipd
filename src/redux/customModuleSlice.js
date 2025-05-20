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

export const userPreModulesRX = createAsyncThunk(
  "customModules/userPreModulesRX",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.userPreModulesRX(data);
      return response; // Assuming the API returns the added module data
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle API errors
    }
  }
);

const customModuleSlice = createSlice({
  name: "customModules",
  initialState: {
    customModules: [],
    moduleContents: [],
    searchModuleResults: [],
    latestSearchedModules: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults(state) {
      state.searchModuleResults = [];
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
        let uniqueResults = [];

        // First try to get results from API response
        if (action.payload?.length) {
          uniqueResults = action.payload
            .flatMap((item) =>
              item.moduleContents
                .filter((module) => module.content?.title)
                .map((module) => module.content)
            )
            .reduce((acc, content) => {
              const titleSet = new Set(acc.map((entry) => entry.title));
              if (!titleSet.has(content.title)) {
                acc.push(content);
              }
              return acc;
            }, []);
        }
        // If API response is empty, search through customModules
        else if (action.meta?.arg?.moduleId) {
          const { moduleId, keyword } = action.meta.arg;
          const targetModule = state.customModules.find(
            (module) => module.module_id === moduleId
          );

          if (targetModule?.templates?.length) {
            uniqueResults = targetModule.templates
              .flatMap((template) =>
                template.content.filter((item) => {
                  // If keyword is provided, search in both title and notes
                  if (keyword) {
                    const searchTerm = keyword.toLowerCase();
                    return (
                      item.title?.toLowerCase().includes(searchTerm) ||
                      item.notes?.toLowerCase().includes(searchTerm)
                    );
                  }
                  // If no keyword, return all items with titles
                  return item.title;
                })
              )
              .reduce((acc, content) => {
                const titleSet = new Set(acc.map((entry) => entry.title));
                if (!titleSet.has(content.title)) {
                  acc.push(content);
                }
                return acc;
              }, []);
          }
        }

        state.searchModuleResults = uniqueResults;

        // Update latest searched modules if moduleId is provided and no keyword
        if (action.meta?.arg?.moduleId && !action.meta?.arg?.keyword) {
          const { moduleId } = action.meta.arg;
          state.latestSearchedModules = {
            ...state.latestSearchedModules,
            [moduleId]: uniqueResults,
          };
        }
      })
      .addCase(searchModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search module contents.";
      });
  },
});

export const { clearSearchResults } = customModuleSlice.actions;

export default customModuleSlice.reducer;
