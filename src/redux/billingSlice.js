import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  billPrintSettings: {},
  advancedSettings: {},
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    resetBillPrintSettingsState: () => initialState,
    setBillPrintSettings: (state, action) => {
      state.billPrintSettings = action.payload;
    },
    setAdvancedSettings: (state, action) => {
      state.advancedSettings = action.payload;
    },
  },
});

export const {
  resetBillPrintSettingsState,
  setBillPrintSettings,
  setAdvancedSettings,
} = billingSlice.actions;
export default billingSlice.reducer;
