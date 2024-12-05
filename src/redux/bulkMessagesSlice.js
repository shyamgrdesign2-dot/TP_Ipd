import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiBulkMessages from "../api/services/ApiBulkMessages";

const initialState = {
    userCampaignList: [],
    loading: false,
    popup: false
};

export const userCampaign = createAsyncThunk(
    "bulkMessages/userCampaign",
    async (data) => {
        let result = {};
        result = await ApiBulkMessages.userCampaign(data);
        if (result?.length > 0) {
            return result;
        } else {
            throw Error(result.message);
        }
    }
);

const bulkMessagesSlice = createSlice({
    name: "bulkMessages",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(userCampaign.pending, (state) => {
                state.loading = true;
                state.popup = false;
            })
            .addCase(userCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.popup = action.payload?.length === 0 ? true : false;
                state.userCampaignList = action.payload;
            })
            .addCase(userCampaign.rejected, (state, action) => {
                state.loading = false;
                state.popup = true;
                state.userCampaignList = [];
            })
    },
});

export default bulkMessagesSlice.reducer;