import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiVideoLibrary from "../api/services/ApiVideoLibrary";

const initialState = {
    loading: false,
    error: null,
    languageList: []
};

export const getDefaultDWsettings = createAsyncThunk(
    "videoLibrary/getDefaultDWSettings",
    async () => {
        let result = {};
        result = await ApiVideoLibrary.viewDoctorWebsite();
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

export const listLanguage = createAsyncThunk(
    "videoLibrary/listLanguage",
    async () => {
        let result = {};
        result = await ApiVideoLibrary.listLanguage();
        if (result.status) {
            return result.data;
        } else {
            throw Error(result.error);
        }
    }
);

const doctorWebsiteSlice = createSlice({
    name: "doctorWebsite",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getDefaultDWsettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDefaultDWsettings.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getDefaultDWsettings.rejected, (state) => {
                state.loading = false;
            })
            .addCase(listLanguage.fulfilled, (state, action) => {
                state.loading = false;
                state.languageList = action.payload
            })
            .addCase(listLanguage.rejected, (state) => {
                state.loading = false;
                state.languageList = []
            });
    },
});

export default doctorWebsiteSlice.reducer;