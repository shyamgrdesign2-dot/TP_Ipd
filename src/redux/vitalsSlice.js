import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ADD, EDIT } from "../utils/constants";

import ApiVitals from "../api/services/ApiVitals";

const initialState = {
    selectedVitalsList: [],
    vitalsPastList: [],
    loading: false,
    error: null,
};

export const addUpdateVitals = createAsyncThunk(
    "vitals/addUpdateVitals",
    async (data) => {
        let result = {};
        result = await ApiVitals.addUpdateVitals(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const getVitals = createAsyncThunk(
    "vitals/getVitals",
    async (data) => {
        let result = {};
        result = await ApiVitals.getVitals(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

const vitalsSlice = createSlice({
    name: "vitals",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addUpdateVitals.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUpdateVitals.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedVitalsList = action.payload;
            })
            .addCase(addUpdateVitals.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getVitals.pending, (state) => {
                state.loading = true;
                state.selectedVitalsList = [];
            })
            .addCase(getVitals.fulfilled, (state, action) => {
                state.loading = false;

                if (action.meta.arg.mode === ADD && action.meta.arg.pam_id !== 0) {
                    const updatedWithPamId = action.payload.filter((e) =>
                        e.pam_id == action.meta.arg.pam_id
                    );
                    state.selectedVitalsList = [...updatedWithPamId];

                    const updatedWithoutPamId = action.payload.filter((e) =>
                        e.pam_id != action.meta.arg.pam_id
                    );
                    state.vitalsPastList = [...updatedWithoutPamId];
                } else {
                    state.vitalsPastList = action.payload
                }
            })
            .addCase(getVitals.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default vitalsSlice.reducer;