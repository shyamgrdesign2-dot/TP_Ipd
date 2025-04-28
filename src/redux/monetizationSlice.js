import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiMonetization from "../api/services/ApiMonetization";
import { services } from "./doctorsSlice";

const initialState = {
    loading: false,
    errorObj: { visible: false, message: '' },
};

export const paymentOrder = createAsyncThunk(
    "monetization/paymentOrder",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiMonetization.paymentOrder(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "monetization/verifyPayment",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiMonetization.verifyPayment(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const purchaseDetails = createAsyncThunk(
    "monetization/purchaseDetails",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiMonetization.purchaseDetails(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const checkCredits = createAsyncThunk(
    "monetization/checkCredits",
    async (data, { rejectWithValue }) => {
        try {
            const result = await ApiMonetization.checkCredits(data);
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

export const updateCredits = createAsyncThunk(
    "monetization/updateCredits",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const result = await ApiMonetization.updateCredits(data);
            dispatch(services(data?.b2c_id))
            return result;
        } catch (error) {
            return rejectWithValue({ visible: false, message: error.response.data.message });
        }
    }
);

const monetizationSlice = createSlice({
    name: "monetization",
    initialState,
});

export default monetizationSlice.reducer;