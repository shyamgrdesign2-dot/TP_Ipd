import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ADD, EDIT } from "../utils/constants";

import ApiLabParams from "../api/services/ApiLabParams";

const initialState = {
    selectedLabParamsList: [],
    labParamsPastList: [],
    loading: false,
    error: null,
};

export const addUpdateLabParams = createAsyncThunk(
    "labParams/addUpdateLabParams",
    async (data) => {
        let result = {};
        result = await ApiLabParams.addUpdateLabParams(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const getLabParams = createAsyncThunk(
    "labParams/getLabParams",
    async (data) => {
        let result = {};
        result = await ApiLabParams.getLabParams(data);
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

const labParamsSlice = createSlice({
    name: "labParams",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addUpdateLabParams.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUpdateLabParams.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLabParamsList = action.payload;
            })
            .addCase(addUpdateLabParams.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getLabParams.pending, (state) => {
                state.loading = true;
                state.selectedLabParamsList = [];
            })
            .addCase(getLabParams.fulfilled, (state, action) => {
                state.loading = false;

                if (action.meta.arg.mode === ADD && action.meta.arg.pam_id !== 0) {
                    const updatedWithPamId = action.payload.filter((e) =>
                        e.pam_id == action.meta.arg.pam_id
                    );
                    state.selectedLabParamsList = [...updatedWithPamId];

                    const updatedWithoutPamId = action.payload.filter((e) =>
                        e.pam_id != action.meta.arg.pam_id
                    );
                    state.labParamsPastList = [...updatedWithoutPamId];
                } else {
                    state.labParamsPastList = action.payload
                }
            })
            .addCase(getLabParams.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default labParamsSlice.reducer;