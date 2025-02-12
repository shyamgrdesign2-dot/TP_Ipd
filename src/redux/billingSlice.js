import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  billPrintSettings: {},
  advancedSettings: {},
  shouldShowOpdBilling: false,
  isOpdBillChecked: false,
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
    setShouldShowOpdBilling: (state, action) => {
      state.shouldShowOpdBilling = action.payload;
      state.isOpdBillChecked = true;
    },
  },
});

export const {
  resetBillPrintSettingsState,
  setBillPrintSettings,
  setAdvancedSettings,
  setShouldShowOpdBilling,
} = billingSlice.actions;
export default billingSlice.reducer;
