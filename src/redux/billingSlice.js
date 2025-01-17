import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  billPrintSettings: {},
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    resetBillPrintSettingsState: () => initialState,
    setBillPrintSettings: (state, action) => {
      state.billPrintSettings = action.payload;
    },
  },
});

export const { resetBillPrintSettingsState, setBillPrintSettings } =
  billingSlice.actions;
export default billingSlice.reducer;
