import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiBulkMessages from "../api/services/ApiBulkMessages";

const initialState = {
    userCreditObj: null,
    tabCountObj: null,
    userCampaignList: [],
    userPurchaseList: [],
    loading: false,
    popup: false,
    campaignDetails: null,
    error: { visible: false, message: '' },
    categoryList: [],
    allTemplateList: [],
    templateLoading: false,
    doctorList: [],
    patientCount: 0
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

export const userCount = createAsyncThunk(
    "bulkMessages/userCount",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCount(data);
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

export const listCategory = createAsyncThunk(
    "bulkMessages/listCategory",
    async (_, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.listCategory();
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
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

export const userCampaignAdd = createAsyncThunk(
    "bulkMessages/userCampaignAdd",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCampaignAdd(data);
            dispatch(userCredit())
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const userCampaignEdit = createAsyncThunk(
    "bulkMessages/userCampaignEdit",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCampaignEdit(data);
            dispatch(userCredit())
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const userCampaignDelete = createAsyncThunk(
    "bulkMessages/userCampaignDelete",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.userCampaignDelete(id);
            dispatch(userCredit())
            return result;
        } catch (error) {
            return rejectWithValue({ visible: true, message: error.response.data.message });
        }
    }
);

export const paymentOrder = createAsyncThunk(
    "bulkMessages/paymentOrder",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.paymentOrder(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);
export const verifyPayment = createAsyncThunk(
    "bulkMessages/verifyPayment",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.verifyPayment(data);
            dispatch(userCredit())
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const paymentHistory = createAsyncThunk(
    "bulkMessages/paymentHistory",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiBulkMessages.paymentHistory(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

const bulkMessagesSlice = createSlice({
    name: "bulkMessages",
    initialState,
    reducers: {
        updatePatientCount: (state, action) => {
            state.patientCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userCredit.fulfilled, (state, action) => {
                state.userCreditObj = action.payload;
            })
            .addCase(userCredit.rejected, (state, action) => {
                state.userCreditObj = null;
            })
            .addCase(userCount.fulfilled, (state, action) => {
                state.tabCountObj = action.payload;
            })
            .addCase(userCount.rejected, (state, action) => {
                state.tabCountObj = null;
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
            .addCase(listCategory.fulfilled, (state, action) => {
                state.categoryList = action.payload;
            })
            .addCase(listCategory.rejected, (state, action) => {
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.categoryList = [];
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
                state.patientCount = action?.payload?.length;
            })
            .addCase(searchPatient.rejected, (state, action) => {
                state.error = { visible: action.payload.visible, message: action.payload.message }
                state.patientCount = 0;
            })
            .addCase(userCampaignAdd.pending, (state) => {
                state.loading = true;
            })
            .addCase(userCampaignAdd.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(userCampaignAdd.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(userCampaignEdit.pending, (state) => {
                state.loading = true;
            })
            .addCase(userCampaignEdit.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(userCampaignEdit.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(userCampaignDelete.fulfilled, (state, action) => {
                state.loading = false;
                const updatedData = state.userCampaignList.filter(e => e?.id != action?.payload?.id);
                state.userCampaignList = updatedData
            })
            .addCase(userCampaignDelete.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(paymentHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(paymentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.userPurchaseList = action.payload;
            })
            .addCase(paymentHistory.rejected, (state, action) => {
                state.loading = false;
                state.userPurchaseList = [];
            })

    },
});

export const { updatePatientCount } = bulkMessagesSlice.actions
export default bulkMessagesSlice.reducer;