import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiCustomModule from "../../api/services/ipd/ApiCustomModule";

const initialState = {
  customModules: [],
  moduleContents: [],
  searchModuleResults: [],
  latestSearchedModules: {},
  loading: false,
  error: null,
};

export const getCustomModules = createAsyncThunk(
  "customModules/getCustomModules",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.getCustomModules(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getModuleContents = createAsyncThunk(
  "customModules/getModuleContents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.getModuleContents(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchModule = createAsyncThunk(
  "customModules/searchModule",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.searchModule(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// addModule uses updateModules API (PUT can handle both create and update)
export const addModule = createAsyncThunk(
  "customModules/addModule",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.updateModules(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateModules = createAsyncThunk(
  "customModules/updateModules",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.updateModules(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateModuleContents = createAsyncThunk(
  "customModules/updateModuleContents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCustomModule.updateModuleContents(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customModuleSlice = createSlice({
  name: "ipdCustomModules",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.searchModuleResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomModules.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        if (Array.isArray(action.payload)) {
          state.customModules = action.payload;
        } else if (action.payload?.modules) {
          const sanitizedModules = action.payload.modules.map(
            ({ created_at, updated_at, ...rest }) => rest
          );
          state.customModules = sanitizedModules;
        } else {
          state.customModules = action.payload || [];
        }
      })
      .addCase(getCustomModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.customModules = [];
      })
      .addCase(getModuleContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModuleContents.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        if (Array.isArray(action.payload)) {
          state.moduleContents = action.payload;
        } else {
          state.moduleContents =
            action.payload?.moduleContents || action.payload || [];
        }
      })
      .addCase(getModuleContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
                ?.filter((module) => module.content?.title)
                .map((module) => module.content)
            )
            .reduce((acc, content) => {
              if (!content) return acc;
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
      })
      .addCase(addModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        if (Array.isArray(action.payload)) {
          state.customModules = action.payload;
        } else if (action.payload?.modules) {
          const sanitizedModules = action.payload.modules.map(
            ({ created_at, updated_at, ...rest }) => rest
          );
          state.customModules = sanitizedModules;
        } else {
          state.customModules = action.payload || [];
        }
      })
      .addCase(addModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add module.";
      })
      .addCase(updateModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModules.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        if (Array.isArray(action.payload)) {
          state.customModules = action.payload;
        } else if (action.payload?.modules) {
          const sanitizedModules = action.payload.modules.map(
            ({ created_at, updated_at, ...rest }) => rest
          );
          state.customModules = sanitizedModules;
        } else {
          state.customModules = action.payload || [];
        }
      })
      .addCase(updateModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update modules.";
      })
      .addCase(updateModuleContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModuleContents.fulfilled, (state, action) => {
        state.loading = false;
        // Module contents are typically managed locally, but we can update if needed
        if (action.payload?.moduleContents) {
          state.moduleContents = action.payload.moduleContents;
        }
      })
      .addCase(updateModuleContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update module contents.";
      });
  },
});

export const { clearSearchResults } = customModuleSlice.actions;

export default customModuleSlice.reducer;
