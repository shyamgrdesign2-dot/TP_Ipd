import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiCaseManager from "../api/services/ApiCaseManager";

const initialState = {
    viewCaseManagerData: null,
    loading: false,
    error: null,
};

export const addCaseManager = createAsyncThunk(
    "vitals/addCaseManager",
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
    "vitals/editCaseManager",
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
    "vitals/viewCaseManager",
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