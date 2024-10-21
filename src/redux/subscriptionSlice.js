import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/services/axiosService";
import config from "../config";
import { getDecodedToken } from "../utils/localStorage";
import moment from "moment";

const token = getDecodedToken();

// Async thunk action to fetch subscription details from the API
export const fetchSubscriptionDetails = createAsyncThunk(
  "subscription/fetchSubscriptionDetails",
  async (data) => {
    const response = await api.post(
      `/user/pm/info/plan`,
      {
        mbl_no: token?.result?.mobile_no,
        page: data?.current || 0,
        size: data?.pageSize || 5,
      },
      {
        customBaseUrl: config.user_management_api_url,
        headers: {
          api_key: config.api_key,
          api_secret_key: config.api_secret_key,
        },
      }
    );
    if (response.status === 200) {
      const {
        planStatus: { code: intialPlanStatus = "" },
        productType,
      } = response?.body?.plans?.content?.[0];
      const {
        plan_expiry_date,
        planStatus: { code: currentPlanStatus = "" },
        expiry_reminder_days,
        is_owner,
        is_pm_renew_requested,
      } = response?.body?.profile;

      return {
        intialPlanStatus,
        currentPlanStatus,
        productType,
        billingHistory: response?.body?.plans?.content,
        expiry_reminder_days,
        is_owner,
        is_pm_renew_requested,
        totalPages: response?.body?.plans?.totalPages,
        expiresIn: moment(plan_expiry_date).diff(moment(), "days"),
      };
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    planDetails: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planDetails = action.payload;
      })
      .addCase(fetchSubscriptionDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default subscriptionSlice.reducer;
