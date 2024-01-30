import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiCaseManager from "../api/services/ApiCaseManager";

const initialState = {
    selectedOneClickList: [],
    templates: [],
    viewCaseManagerData: null,
    loading: false,
    error: null,
};

export const addTemplate = createAsyncThunk(
    "caseManager/addTemplate",
    async (template) => {
        let result = {};
        result = await ApiCaseManager.addTemplate(template);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const updateTemplate = createAsyncThunk(
    "caseManager/updateTemplate",
    async (template) => {
        const result = await ApiCaseManager.updateTemplate(template);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    "caseManager/deleteTemplate",
    async (templateId) => {
        const result = await ApiCaseManager.deleteTemplate(templateId);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const getOneClickTemplates = createAsyncThunk(
    "caseManager/getOneClickTemplates",
    async () => {
        let result = {};
        result = await ApiCaseManager.getOneClickTemplates();
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const singleOneClickTemplateDetails = createAsyncThunk(
    "caseManager/singleOneClickTemplateDetails",
    async (templateId) => {
      let result = {};
      result = await ApiCaseManager.singleOneClickTemplateDetails(templateId);
      if (result.status) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    }
  );

export const addCaseManager = createAsyncThunk(
    "caseManager/addCaseManager",
    async (data) => {
        let result = {};
        result = await ApiCaseManager.addCaseManager(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const editCaseManager = createAsyncThunk(
    "caseManager/editCaseManager",
    async (data) => {
        let result = {};
        result = await ApiCaseManager.editCaseManager(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const viewCaseManager = createAsyncThunk(
    "caseManager/viewCaseManager",
    async (data) => {
        let result = {};
        result = await ApiCaseManager.viewCaseManager(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

const caseManagerSlice = createSlice({
    name: "caseManager",
    initialState,
    extraReducers: (builder) => {
        builder
            // .addCase(addTemplate.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(addTemplate.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.selectedOneClickList = action.payload.symptoms;
            //     state.templates.unshift(action.payload);
            // })
            // .addCase(addTemplate.rejected, (state, action) => {
            //     state.loading = false;
            // })
            // .addCase(updateTemplate.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(updateTemplate.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.selectedOneClickList = action.payload.symptoms;
            //     const index = state.templates.findIndex(
            //         (e) => e.tst_id == action.payload.tst_id
            //     );
            //     if (index != -1) {
            //         state.templates[index] = action.payload;
            //     }
            // })
            // .addCase(updateTemplate.rejected, (state, action) => {
            //     state.loading = false;
            // })
            .addCase(deleteTemplate.pending, (state, action) => {
                const updatedData = state.templates.map((e) =>
                    e.tmoc_id == action.meta.arg ? { ...e, loading: true } : e
                );
                state.templates = [...updatedData];
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                const result = state.templates.filter(
                    (item) => item.tmoc_id !== action.payload.tmoc_id
                );
                state.templates = [...result];
            })
            .addCase(deleteTemplate.rejected, (state, action) => {
                const updatedData = state.templates.map((e) =>
                    e.tmoc_id == action.meta.arg ? { ...e, loading: false } : e
                );
                state.templates = [...updatedData];
            })
            .addCase(getOneClickTemplates.fulfilled, (state, action) => {
                state.templates = action.payload;
            })
            .addCase(getOneClickTemplates.rejected, (state, action) => {
                state.templates = [];
            })
            .addCase(addCaseManager.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCaseManager.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addCaseManager.rejected, (state) => {
                state.loading = false;
            })
            .addCase(editCaseManager.pending, (state) => {
                state.loading = true;
            })
            .addCase(editCaseManager.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(editCaseManager.rejected, (state) => {
                state.loading = false;
            })
            .addCase(viewCaseManager.pending, (state) => {
                state.loading = true;
            })
            .addCase(viewCaseManager.fulfilled, (state, action) => {
                state.loading = false;
                state.viewCaseManagerData = action.payload;
            })
            .addCase(viewCaseManager.rejected, (state) => {
                state.loading = false;
                state.viewCaseManagerData = null;
            })
    },
});

export default caseManagerSlice.reducer;