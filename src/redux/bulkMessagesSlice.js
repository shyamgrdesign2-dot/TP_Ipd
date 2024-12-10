import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiBulkMessages from "../api/services/ApiBulkMessages";

const initialState = {
    userCreditObj: null,
    userCampaignList: [],
    loading: false,
    popup: false,
    campaignDetails: null,
    error: { visible: false, message: '' },
    allTemplateList: [],
    templateLoading: false,
    doctorList: [],
    patientList: []
};

export const userCredit = createAsyncThunk(
    "bulkMessages/userCredit",
    async (_, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCredit();
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const userCampaign = createAsyncThunk(
    "bulkMessages/userCampaign",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCampaign(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const userCampaignDetails = createAsyncThunk(
    "bulkMessages/userCampaignDetails",
    async (id, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCampaignDetails(id);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: true, message: error.response.data.message });
        }
    }
);

export const listAllTemplate = createAsyncThunk(
    "bulkMessages/listAllTemplate",
    async (_, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.listAllTemplate();
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const listDoctor = createAsyncThunk(
    "bulkMessages/listDoctor",
    async (_, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.listDoctor();
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const searchPatient = createAsyncThunk(
    "bulkMessages/searchPatient",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.searchPatient(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

const bulkMessagesSlice = createSlice({
    name: "bulkMessages",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(userCredit.fulfilled, (state, action) => {
                state.userCreditObj = action.payload;
            })
            .addCase(userCredit.rejected, (state, action) => {
                state.userCreditObj = null;
            })
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
            .addCase(userCampaignDetails.pending, (state, action) => {
                state.campaignDetails = null;
            })
            .addCase(userCampaignDetails.fulfilled, (state, action) => {
                state.campaignDetails = action.payload;
            })
            .addCase(userCampaignDetails.rejected, (state, action) => {
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.campaignDetails = null;
            })
            .addCase(listAllTemplate.pending, (state, action) => {
                state.templateLoading = true
            })
            .addCase(listAllTemplate.fulfilled, (state, action) => {
                state.templateLoading = false
                state.allTemplateList = action.payload;
            })
            .addCase(listAllTemplate.rejected, (state, action) => {
                state.templateLoading = false
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.allTemplateList = [];
            })
            .addCase(listDoctor.fulfilled, (state, action) => {
                state.doctorList = action.payload;
            })
            .addCase(listDoctor.rejected, (state, action) => {
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.doctorList = [];
            })
            .addCase(searchPatient.fulfilled, (state, action) => {
                state.patientList = action.payload;
            })
            .addCase(searchPatient.rejected, (state, action) => {
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.patientList = [];
            })


    },
});

export default bulkMessagesSlice.reducer;