import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiVideoLibrary from "../api/services/ApiVideoLibrary";

const initialState = {
    loading: false,
    error: null,
    languageList: []
};

export const viewDoctorWebsite = createAsyncThunk(
    "videoLibrary/viewDoctorWebsite",
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

export const saveDoctorWebsite = createAsyncThunk(
    "videoLibrary/saveDoctorWebsite",
    async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key.startsWith('clinicpic')) {
                data[key].forEach((item, index) => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            const result = await ApiVideoLibrary.saveDoctorWebsite(formData);
            if (result.status) {
                return result.data;
            } else {
                throw Error(result.error);
            }
        } catch (error) {
            throw Error(error);
        }
    }
);

const doctorWebsiteSlice = createSlice({
    name: "doctorWebsite",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(viewDoctorWebsite.pending, (state) => {
                state.loading = true;
            })
            .addCase(viewDoctorWebsite.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(viewDoctorWebsite.rejected, (state) => {
                state.loading = false;
            })
            .addCase(listLanguage.fulfilled, (state, action) => {
                state.loading = false;
                state.languageList = action.payload
            })
            .addCase(listLanguage.rejected, (state) => {
                state.loading = false;
                state.languageList = []
            })
            .addCase(saveDoctorWebsite.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveDoctorWebsite.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(saveDoctorWebsite.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default doctorWebsiteSlice.reducer;